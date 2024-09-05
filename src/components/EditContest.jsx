import React, { useState  ,useEffect} from 'react';
import { useForm , Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { BiCalendar, BiTime } from 'react-icons/bi';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useFirebase } from '../context/Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa";

// const { register, control, handleSubmit, setValue, watch, reset } = useForm()

const CustomInputField = React.forwardRef(
  (
    {
      name,
      value,
      label,
      onClick,
      disabled,
      inputClassName,
      icon = <BiCalendar size="1rem" />,
    },
    ref
  ) => (
    <button className="w-full" onClick={onClick} ref={ref} disabled={disabled}>
      <div className="flex flex-row items-stretch w-full">
        <input
          id={name}
          name={name}
          value={value}
          onChange={() => null}
          type="text"
          placeholder={label}
          aria-label={label}
          className={`peer block w-full p-3 text-gray-600 bg-gray-100 border border-r-0 focus:border-red-400 focus:bg-white focus:outline-none focus:ring-0 appearance-none rounded-tr-none rounded-br-none rounded transition-colors duration-300 ${disabled ? 'bg-gray-200' : ''} ${inputClassName}`}
          disabled={disabled}
        />
        <div className={`flex items-center rounded-tl-none rounded-bl-none rounded pr-3 py-3 text-gray-600 bg-gray-100 border border-l-0 peer-focus:border-red-400 peer-focus:bg-white transition-colors duration-300 ${disabled ? 'bg-gray-200' : ''}`}>
          {icon}
        </div>
      </div>
    </button>
  )
);

const EditContest = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Subject 1" },
    
  ]);
  // const [topics, setTopics] = useState([
  //   { id: 1, name: "Topic 1", subjectId: 1 },
    
  // ]);

  // const [subTopics, setSubTopics] = useState([
  //   { id: 1, name: "Sub Topic 1", topicId: 1 },
  //   { id: 2, name: "Sub Topic 2", topicId: 2 },
  // ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [examTime, setExamTime] = useState(null);
  const [resultTime, setResultTime] = useState(null);
  const [lastEntryTime, setLastEntryTime] = useState(null);
  const [contestEndTime, setContestEndTime] = useState(null);
  const [contestId, setContestId] = useState('');
  const { register,  handleSubmit,setValue,control, formState: { errors } } = useForm();
  const [newSubject , setNewSubject] = useState("")
  const [newTopic , setNewTopic] = useState("")
  const [newSubTopic , setNewSubTopic] = useState("")
  let [selectedSubjectId, setSelectedSubjectId] = useState('')
  
  const[contestname , setContestName] = useState('')
  const[subject , setSubject]= useState('');
  const[topic , setTopic]= useState('');
  const[questionCount , setQuestionCount]= useState('');
  const[entryFee , setEntryFee]= useState('');
  const[totalSpot , setTotalSpot]= useState('');
  const[description , setDescription]= useState('');
  const[prizeMoneyTotal , setPrizeMoneyTotal]= useState('');
 
  const [selectedTopicName , setSelectedTopicName ] = useState(''); 
  const [selectedSubjectName , setSelectedSubjectName ] = useState(''); 
  const [selectedSubTopicName , setSelectedSubTopicName ] = useState(''); 


    // Initial number of grids
  
    const handleAddGrid = () => {
      setRankings([...rankings, { totalrankfrom: '', totalrankto: '', totalamount: '' }]);
      setBookings([...bookings, { bookedrankfrom: '', bookedrankto: '', bookedamount: '' }]);
    };
    
  
    const handleSubjectChange = (e) => {
      const selectedSubjectId = e.target.value;
  
      // Debug: Log the selected subject ID
      console.log("Selected Subject ID:", selectedSubjectId);
  
      const selectedSubject = subjects.find(subject => subject.id === selectedSubjectId);
  
      // Debug: Log the selected subject object
      console.log("Selected Subject:", selectedSubject);
  
      if (selectedSubject) {
        const selectedSubjectName = selectedSubject.name;
  
        // Log the subject name for debugging
        console.log('Selected Subject Name:', selectedSubjectName);
          const filteredTopics = selectedSubject.topics;
  
          // Debug: Log the filtered topics
          console.log("Filtered Topics:", filteredTopics);
  
          setTopics(filteredTopics);
          setSubTopics([]);
  
          setSelectedSubjectId(selectedSubjectId);
          setValue("selectedSubject", selectedSubjectId);  
          setValue("selectedSubjectName" , selectedSubjectName ); 
          setValue("selectedTopic", "");
          setValue("selectedSubTopic", "");
  
          // Debug: Log the state changes
          console.log("Topics after filtering:", filteredTopics);
          console.log("SubTopics reset to:", []);
          console.log("Selected Subject ID state:", selectedSubjectId);
          console.log("Form Values: selectedSubject, selectedTopic, selectedSubTopic set to:", selectedSubjectId, "", "");
      } else {
          console.error("Selected subject not found. Ensure the ID matches exactly.");
      }
  };
  // const handleTopicChange = (e) => {
  //   const selectedTopicId = e.target.value;
  //   const selectedTopic = topics.find(topic => topic.id === selectedTopicId);
  
  //   if (selectedTopic) {
  //       console.log("Selected Topic:", selectedTopic);
  //       setSubTopics(selectedTopic.subtopics || []);
  //       setValue("selectedTopic", selectedTopic.id); // Set the ID for internal logic
  //       setValue("selectedTopicName", selectedTopic.name); // Set the name for display
  //   }
  //   setValue("selectedSubTopic", ""); // Reset subtopic when topic changes
  // };

  // const handleSubTopicChange = (e) => {
  //   const selectedSubTopicId = e.target.value; // Assuming ID is used as value
  //   const selectedSubTopic = subTopics.find(subTopic => subTopic.id === selectedSubTopicId);
  
  //   // Log the selected subtopic ID and subtopic object for debugging
  //   console.log('Selected SubTopic ID:', selectedSubTopicId);
  //   console.log('Selected SubTopic:', selectedSubTopic);
  
  //   // Update the form values
  //   setValue("selectedSubTopic", selectedSubTopic ? selectedSubTopic.id : "");
  //   setValue("selectedSubTopicName", selectedSubTopic ? selectedSubTopic.name : "");
  
  //   // Log the values set in the form
  //   console.log('Selected SubTopic ID set in form:', selectedSubTopic ? selectedSubTopic.id : "");
  //   console.log('Selected SubTopic Name set in form:', selectedSubTopic ? selectedSubTopic.name : "");
  // };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onSubmit = async (data) => {
    const selectedSubject = subjects.find(subject => subject.id === parseInt(data.selectedSubject));
    // const selectedTopic = topic.find(topic => topic.id === parseInt(data.selectedTopic));
    data.rankings = data.rankings
    data.examTime = examTime;
    data.resultTime = resultTime;
    data.lastEntryTime = lastEntryTime;
    data.constestEndTime = contestEndTime;

    data.contestId = String(contestId); // Ensure it's a string
    data.bookedspot=""
    data.totalAmountReceived =0
    data.amountDistributed = 0

    try {
      console.log(data); 
      await firebase.updateDocument('newcontest' , data.contestId ,data  );
      // Reset form fields
      setExamTime(new Date());
      setResultTime(new Date());
      setLastEntryTime(new Date());
      setContestEndTime(new Date());
      setContestId('');
      reset(); // This resets the form controlled by react-hook-form
      // Show success toast
      toast.error('Failed to create contest.');
      
    } catch (error) {
      console.error("Error creating contest:", error);
      toast.success('Contest created successfully!');
      
    }
  };



  

  const firebase = useFirebase();
 useEffect(() => {
    async function fetchSubjects() {
      try {
        const fetchedSubjects = await firebase.getDocument('subjects');
        setSubjects(fetchedSubjects);
        console.log(fetchedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    }

    fetchSubjects();
  }, []);



 const handleDeleteQuestion = async (indexToDelete) => {
    try {
      console.log("Attempting to delete question at index:", indexToDelete);
      console.log("Original questions array:", contestData.questions);
  
      // Filter out the question to be deleted
      const updatedQuestions = contestData.questions.filter((_, index) => index !== indexToDelete);
      console.log("Updated questions array after deletion:", updatedQuestions);
  
      // Update the questions array in Firestore
      console.log("Updating Firestore document with ID:", contestId);
      await firebase.updateDocument('newcontest', contestId, { questions: updatedQuestions });
      console.log("Firestore document successfully updated!");
  
      // Update the state with the updated questions array
      setContestData((prevData) => ({
        ...prevData,
        questions: updatedQuestions,
      }));
      console.log("State updated with new questions array:", updatedQuestions);
  
      // Show success toast message
      toast.success("Question successfully deleted!");
  
    } catch (error) {
      console.error("Error deleting question:", error);
  
      // Show error toast message
      toast.error("Failed to delete the question. Please try again.");
    }
  };


  
  
  
  
  
  
  const [contestData, setContestData] = useState({
    bookings : [], 
    rankings : [], 
    selectedTopicName: '',
    selectedSubjectName: '',
    selectedSubTopicName: '',
    totalAmount1: '',
    totalAmount2: '',
    totalAmount3: '',
    totalRankFrom1: '',
    totalRankFrom2: '',
    totalRankFrom3: '',
    totalRankTo1: '',
    totalRankTo2: '',
    totalRankTo3: '',
    bookedAmount1: '',
    bookedAmount2: '',
    bookedAmount3: '',
    bookedRankFrom1: '',
    bookedRankFrom2: '',
    bookedRankFrom3: '',
    bookedRankTo1: '',
    bookedRankTo2: '',
    bookedRankTo3: '',
    questions: [],
    examTime: null,
    resultTime: null,
    lastEntryTime: null,
    contestEndTime: null,
    topic: '',
    questionCount: '',
    description: '',
    entryFee: '',
    totalSpot: '',
    prizeMoneyTotal: '',
    prizeMoneyBooked:'',
    contestName: '',
    subject: '',
    selectedTopic: '',
    selectedSubTopic: '',
    totalQuestions: '',
    selectedQuestion: '',
    language: 'HINDI',
    isDisabled: false,
});


const [rankings, setRankings] = useState(contestData.rankings || []);
const [bookings, setBookings] = useState(contestData.bookings || []);

useEffect(() => {
  if (contestData) {
    setRankings(contestData.rankings || []);
    setBookings(contestData.bookings || []);
  }
}, [contestData]);

const handleFetchContest = async () => {
  try {
    const fetchedData = await firebase.getDocumentbyId('newcontest', contestId);
    console.log("Fetching contest data:", fetchedData);

    if (fetchedData) {
      // Convert Firestore timestamps to Date objects
      const examTimeFromFirestore = fetchedData.examTime ? fetchedData.examTime.toDate() : null;
      const resultTimeFromFirestore = fetchedData.resultTime ? fetchedData.resultTime.toDate() : null;
      const lastEntryTimeFromFirestore = fetchedData.lastEntryTime ? fetchedData.lastEntryTime.toDate() : null;
      const contestEndTimeFromFirestore = fetchedData.contestEndTime ? fetchedData.contestEndTime.toDate() : null;

      // Set all the state at once
      setContestData({
        bookings: fetchedData.bookings || [],
        rankings: fetchedData.rankings || [],
        selectedTopicName: fetchedData.selectedTopicName || '',
        selectedSubjectName: fetchedData.selectedSubjectName || '',
        selectedSubTopicName: fetchedData.selectedSubTopicName || '',
        totalAmount1: fetchedData.totalamount1 || '',
        totalAmount2: fetchedData.totalamount2 || '',
        totalAmount3: fetchedData.totalamount3 || '',
        totalRankFrom1: fetchedData.totalrankfrom1 || '',
        totalRankFrom2: fetchedData.totalrankfrom2 || '',
        totalRankFrom3: fetchedData.totalrankfrom3 || '',
        totalRankTo1: fetchedData.totalrankto1 || '',
        totalRankTo2: fetchedData.totalrankto2 || '',
        totalRankTo3: fetchedData.totalrankto3 || '',
        bookedAmount1: fetchedData.bookedamount1 || '',
        bookedAmount2: fetchedData.bookedamount2 || '',
        bookedAmount3: fetchedData.bookedamount3 || '',
        bookedRankFrom1: fetchedData.bookedrankfrom1 || '',
        bookedRankFrom2: fetchedData.bookedrankfrom2 || '',
        bookedRankFrom3: fetchedData.bookedrankfrom3 || '',
        bookedRankTo1: fetchedData.bookedrankto1 || '',
        bookedRankTo2: fetchedData.bookedrankto2 || '',
        bookedRankTo3: fetchedData.bookedrankto3 || '',
        questions: fetchedData.questions || [],
        examTime: examTimeFromFirestore,
        resultTime: resultTimeFromFirestore,
        lastEntryTime: lastEntryTimeFromFirestore,
        contestEndTime: contestEndTimeFromFirestore,
        topic: fetchedData.selectedTopic || '',
        questionCount: fetchedData.totalQuestions || '',
        description: fetchedData.contestDescription || '',
        entryFee: fetchedData.entryFee || '',
        totalSpot: fetchedData.totalSpot || '',
        prizeMoneyTotal: fetchedData.prizeMoneyTotal || '',
        prizeMoneyBooked: fetchedData.prizeMoneyBooked || '',
        contestName: fetchedData.contestName || '',
        subject: fetchedData.selectedSubject || '',
        selectedTopic: fetchedData.selectedTopic || '',
        selectedSubTopic: fetchedData.selectedSubTopic || '',
        totalQuestions: fetchedData.totalQuestions || '',
        selectedQuestion: fetchedData.selectedQuestion || '',
        language: fetchedData.language || 'HINDI',
        isDisabled: true,
      });

      // Log to confirm setting
      console.log("Contest data successfully set:", fetchedData.questions);
      console.log("questions state" , questions)

      // Log the times to ensure they're being set correctly
      console.log("Exam Time:", examTimeFromFirestore);
      console.log("Result Time:", resultTimeFromFirestore);
      console.log("Last Entry Time:", lastEntryTimeFromFirestore);
      console.log("Contest End Time:", contestEndTimeFromFirestore);
    } else {
      alert('Contest not found');
    }
  } catch (error) {
    console.error("Error fetching contest data:", error);
  }
};

const [questions, setQuestions] = useState([contestData.questions]);



  
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className={`container min-h-screen dark:bg-gray-800 dark:text-white mx-auto p-4 ${isDarkMode ? 'bg-gray-800 dark:text-white' : 'bg-white text-gray-700'}`}>
      <div className="grid grid-cols-5 gap-4">
        
        <div className="col-span-1">
      <label htmlFor="contestId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Contest ID:
      </label>
      <div className="flex">
        <input
          type="text"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          id="contestId"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
        />
        <button
          type="button"
          className="ml-2  w-full  text-center justify-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={handleFetchContest}
        >
          Fetch
        </button>
      </div>
    </div>
    <div className="col-span-1">
  <label htmlFor="contestName" className="block text-sm font-medium">Contest Name</label>
  <input
    type="text"
    id="contestName"
    defaultValue={contestData.contestName} // Use defaultValue instead of value
    onChange={(e) => setContestName(e.target.value)}
    {...register('contestName', { required: 'Contest Name is required' })} // Keep register here
    className={`mt-1 block w-full dark:bg-gray-800 dark:text-white rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
  />
  {errors.contestName && <p className="text-red-500 text-sm mt-1">{errors.contestName.message}</p>}
</div>

<div className="col-span-1">
  <label htmlFor="examTime" className="block text-sm font-medium">Exam Time</label>
  <DatePicker
    className="w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300"
    selected={examTime?examTime:contestData.examTime}
     // This is the state that controls the date picker
    onChange={setExamTime} // This updates the state when the date is changed
    showTimeSelect
    dateFormat="MMMM d, yyyy h:mm aa"
  />
</div>

<div className="col-span-1">
  <label htmlFor="resultTime" className="block text-sm font-medium">Result Time</label>
  <DatePicker
    className="w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300"
    selected={resultTime?resultTime:contestData.resultTime} // This is the state that controls the date picker for result time
    onChange={setResultTime} // This updates the state when the date is changed
    showTimeSelect
    dateFormat="MMMM d, yyyy h:mm aa"
  />
</div>
        <div className="col-span-1">
          <label htmlFor="lastEntryTime" className="block text-sm font-medium">Last Entry Time</label>
          <DatePicker className='w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300'
            selected={lastEntryTime?lastEntryTime:contestData.lastEntryTime}
            onChange={setLastEntryTime}
            // customInput={<CustomInputField name="lastEntryTime" label="Select time" icon={<BiTime size="1rem" />} />}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>

      </div>

      <div className="grid grid-cols-5 gap-6 mt-4">
  
        <div className="col-span-1">
        
  <label htmlFor="contestEndTime" className="block text-sm font-medium">Contest End Time</label>
  <DatePicker
    className="w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300"
    selected={contestEndTime?contestEndTime:contestData.
constestEndTime
} // This is the state that controls the date picker for contest end time
    onChange={setContestEndTime} // This updates the state when the time is changed
    showTimeSelect
    showTimeSelectOnly
    timeIntervals={15}
    timeCaption="Time"
    dateFormat="h:mm aa"
  />
</div>

        <div className="col-span-1">
        {/* sourav */}
  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
    Subject:
  </label>
  <select id="subject" onClick={handleSubjectChange} className="mr-2 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm" {...register("selectedSubject")}>
  <option value="">
  {contestData.selectedSubjectName ? contestData.selectedSubjectName : "Select Subject"}
</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
</div>

        {/* <div className="col-span-1">
        <label htmlFor="topic" className="mr-2">Topic:</label>
        <select 
    id="topic" 
    onClick={handleTopicChange} 
    className="mr-2 overflow-auto border dark:bg-gray-800 dark:text-white  w-full border-gray-300 rounded-md shadow-sm" 
    {...register("selectedTopic")}
>
    <option value="">
  {contestData.selectedTopicName ? contestData.selectedTopicName : "Select Topic"}
</option>
    {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
            {topic.name}
        </option>
    ))}
</select>
        </div> */}
       
        <div className="col-span-1">
          <label htmlFor="totalQuestions" className="block text-sm font-medium">Total No. of Questions</label>
          <input
            type="number"
            id="totalQuestions"
            defaultValue={contestData.questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}

            {...register('totalQuestions', { required: 'Total No. of Questions is required' })}
            className={`mt-1 dark:bg-gray-800 dark:text-white block w-md rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.totalQuestions && <p className="text-red-500 text-sm mt-1">{errors.totalQuestions.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="entryFee" className="block text-sm font-medium">Entry Fee</label>
          <input
            type="number"
            id="entryFee"
            defaultValue={contestData.entryFee}
            {...register('entryFee', { required: 'Entry Fee is required' })}
            className={`mt-1 block w-md rounded-md dark:bg-gray-800 dark:text-white border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="1 RS = 1 COIN"
          />
          {errors.entryFee && <p className="text-red-500 text-sm mt-1">{errors.entryFee.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="totalSpot" className="block text-sm font-medium">Total Spot</label>
          <input
            type="number"
            id="totalSpot"
            defaultValue={contestData.totalSpot}
            {...register('totalSpot', { required: 'Total Spot is required' })}
            className={`mt-1 block w-md rounded-md dark:bg-gray-800 dark:text-white border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="200"
          />
          {errors.totalSpot && <p className="text-red-500 text-sm mt-1">{errors.totalSpot.message}</p>}
        </div>
      
       
      </div>
   
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="col-span-3">
          <label htmlFor="contestDescription" className="block text-sm font-medium">Contest Description</label>
          <textarea
            id="contestDescription"
            defaultValue={contestData.description}
            {...register('contestDescription', { required: 'Contest Description is required' })}
            className={`mt-1 block w-full rounded-md border dark:bg-gray-800 dark:text-white ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.contestDescription && <p className="text-red-500 text-sm mt-1">{errors.contestDescription.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 ml-8 mr-8 mt-4">
        <div className="col-span-2">
          <label htmlFor="prizeMoneyTotal" className="block text-sm font-medium">Prize Money on Total Spot</label>
          <input
            type="text"
            id="prizeMoneyTotal"
            defaultValue={contestData.prizeMoneyTotal}
            {...register('prizeMoneyTotal', { required: 'Prize Money on Total Spot is required' })}
            className={`mt-1 block w-full dark:bg-gray-800 dark:text-white text-center rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="100"
          />
          {errors.prizeMoneyTotal && <p className="text-red-500 text-sm mt-1">{errors.prizeMoneyTotal.message}</p>}
        </div>
        <div className="col-span-2">
          <label htmlFor="prizeMoneyBooked" className="block text-sm font-medium">Prize Money on Booked Spot</label>
          <input
            type="text"
            id="prizeMoneyBooked"
            defaultValue={contestData.prizeMoneyBooked}
            {...register('prizeMoneyBooked')}
            className={`mt-1 block w-full text-center dark:bg-gray-800 dark:text-white rounded-md border ${isDarkMode ? 'border-gray-600 dark:bg-gray-800 dark:text-white bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="70"
          />
          {errors.prizeMoneyBooked && <p className="text-red-500 text-sm mt-1">{errors.prizeMoneyBooked.message}</p>}
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4 mt-4">
  <div className="grid grid-cols-3 gap-4">
    {rankings.map((ranks, index) => {
      const i = index + 1;
      return (
        <React.Fragment key={index}>
          <div className="col-span-1">
            <label htmlFor={`totalRankFrom${i}`} className="block text-sm font-medium">Total Rank From</label>
            <input
              type="number"
              defaultValue={ranks.totalrankfrom}
              id={`totalRankFrom${i}`}
              {...register(`rankings[${index}].totalrankfrom`)}
              className={`mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor={`totalRankTo${i}`} className="block text-sm font-medium">Total Rank To</label>
            <input
              type="number"
              defaultValue={ranks.totalrankto}
              id={`totalRankTo${i}`}
              {...register(`rankings[${index}].totalrankto`)}
              className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor={`totalAmount${i}`} className="block text-sm font-medium">Total Amount</label>
            <input
              type="number"
              defaultValue={ranks.totalamount}
              id={`totalAmount${i}`}
              {...register(`rankings[${index}].totalamount`)}
              className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
        </React.Fragment>
      );
    })}
  </div>

  <div className="grid grid-cols-3 gap-4">
    {bookings.map((ranks, index) => {
      const i = index + 1;
      return (
        <React.Fragment key={index}>
          <div className="col-span-1">
            <label htmlFor={`bookedRankFrom${i}`} className="block text-sm font-medium">Booked Rank From</label>
            <input
              type="number"
              defaultValue={ranks.bookedrankfrom}
              id={`bookedRankFrom${i}`}
              {...register(`bookings[${index}].bookedrankfrom`)}
              className={`mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor={`bookedRankTo${i}`} className="block text-sm font-medium">Booked Rank To</label>
            <input
              type="number"
              defaultValue={ranks.bookedrankto}
              id={`bookedRankTo${i}`}
              {...register(`bookings[${index}].bookedrankto`)}
              className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor={`bookedAmount${i}`} className="block text-sm font-medium">Booked Amount</label>
            <input
              type="number"
              defaultValue={ranks.bookedamount}
              id={`bookedAmount${i}`}
              {...register(`bookings[${index}].bookedamount`)}
              className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
          </div>
        </React.Fragment>
      );
    })}
  </div>

  <button
    type="button"
    onClick={handleAddGrid}
    className={`inline-flex justify-center items-center w-[100px] mt-2 mb-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${isDarkMode ? 'dark:text-white bg-blue-500 hover:bg-indigo-700' : 'dark:text-white bg-indigo-500 hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
    <FaPlus />
  </button>
</div>


          {/* render */}
          <div className="space-y-4">
  {Array.isArray(contestData.questions) && contestData.questions.length > 0 ? (
    contestData.questions.map((question, index) => (
      <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-300">
            {index + 1}.
          </span>
          <button
            type='button'
            onClick={() => handleDeleteQuestion(index)}
            className="bg-red-600 text-white hover:bg-red-700 hover:text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-400 dark:text-white dark:hover:text-white"
          >
            Delete
          </button>
        </div>

        {/* English Question and Options */}
        <div className="space-y-2 mb-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Question (English):</label>
          <input
            type="text"
            value={question.englishquestion || ""}
            {...register(`questions.${index}.englishquestion`)}
            className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleQuestionChange(e, index, 'englishquestion')}
          />
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Options (English):</label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={question.englishoptionA || ""}
              {...register(`questions.${index}.englishoptionA`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'englishoptionA')}
            />
            <input
              type="text"
              value={question.englishoptionB || ""}
              {...register(`questions.${index}.englishoptionB`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'englishoptionB')}
            />
            <input
              type="text"
              value={question.englishoptionC || ""}
              {...register(`questions.${index}.englishoptionC`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'englishoptionC')}
            />
            <input
              type="text"
              value={question.englishoptionD || ""}
              {...register(`questions.${index}.englishoptionD`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'englishoptionD')}
            />
          </div>

          <label className="block text-sm font-medium text-gray-900 dark:text-white">Answer (English):</label>
          <input
            type="text"
            value={question.englishanswer || ""}
            {...register(`questions.${index}.englishanswer`)}
            className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleQuestionChange(e, index, 'englishanswer')}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Solution: {question.solution}</p>

        </div>

        {/* Hindi Question and Options */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Question (Hindi):</label>
          <input
            type="text"
            value={question.hindiquestion || ""}
            {...register(`questions.${index}.hindiquestion`)}
            className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleQuestionChange(e, index, 'hindiquestion')}
          />
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Options (Hindi):</label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={question.hindioptionA || ""}
              {...register(`questions.${index}.hindioptionA`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'hindioptionA')}
            />
            <input
              type="text"
              value={question.hindioptionB || ""}
              {...register(`questions.${index}.hindioptionB`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'hindioptionB')}
            />
            <input
              type="text"
              value={question.hindioptionC || ""}
              {...register(`questions.${index}.hindioptionC`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'hindioptionC')}
            />
            <input
              type="text"
              value={question.hindioptionD || ""}
              {...register(`questions.${index}.hindioptionD`)}
              className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onChange={(e) => handleQuestionChange(e, index, 'hindioptionD')}
            />
          </div>

          <label className="block text-sm font-medium text-gray-900 dark:text-white">Answer (Hindi):</label>
          <input
            type="text"
            value={question.hindianswer || ""}
            {...register(`questions.${index}.hindianswer`)}
            className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => handleQuestionChange(e, index, 'hindianswer')}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">Solution: {question.hindiSolution}</p>

      </div>
    ))
  ) : (
    <div className="text-center text-gray-500 dark:text-gray-400">
      No Questions
    </div>
  )}
</div>


      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${isDarkMode ? 'dark:text-white bg-indigo-600 hover:bg-indigo-700' : 'dark:text-white bg-indigo-500 hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Update Contest
        </button>
     
      </div>
    </form>

    <ToastContainer />
    </>
  );
};

export default EditContest;
