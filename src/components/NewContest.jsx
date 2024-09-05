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

const NewContest = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Subject 1" },
    { id: 2, name: "Subject 2" },
  ]);
  const [topics, setTopics] = useState([
    { id: 1, name: "Topic 1", subjectId: 1 },
    { id: 2, name: "Topic 2", subjectId: 1 },
    { id: 3, name: "Topic 3", subjectId: 2 },
  ]);

  const [subTopics, setSubTopics] = useState([
    { id: 1, name: "Sub Topic 1", topicId: 1 },
    { id: 2, name: "Sub Topic 2", topicId: 2 },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [examTime, setExamTime] = useState(new Date());
  const [resultTime, setResultTime] = useState(new Date());
  const [lastEntryTime, setLastEntryTime] = useState(new Date());
  const [contestEndTime, setContestEndTime] = useState(new Date());
  const [contestId, setContestId] = useState('');
  const { register, handleSubmit,setValue,control, formState: { errors } } = useForm();
  const [newSubject , setNewSubject] = useState("")
  const [newTopic , setNewTopic] = useState("")
  const [newSubTopic , setNewSubTopic] = useState("")
  let [selectedSubjectId, setSelectedSubjectId] = useState('');
  

 
    const [numGrids, setNumGrids] = useState(3); // Initial number of grids
  
    const handleAddGrid = () => {
      setNumGrids(numGrids + 1); // Increase the number of grids
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
        const filteredTopics = selectedSubject.topics || [];

  
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
  const handleTopicChange = (e) => {
    const selectedTopicId = e.target.value;
    const selectedTopic = topics.find(topic => topic.id === selectedTopicId);
  
    if (selectedTopic) {
        console.log("Selected Topic:", selectedTopic);
        setSubTopics(selectedTopic.subtopics || []);
        setValue("selectedTopic", selectedTopic.id); // Set the ID for internal logic
        setValue("selectedTopicName", selectedTopic.name); // Set the name for display
    }
    setValue("selectedSubTopic", ""); // Reset subtopic when topic changes
  };

  const handleSubTopicChange = (e) => {
    const selectedSubTopicId = e.target.value; // Assuming ID is used as value
    const selectedSubTopic = subTopics.find(subTopic => subTopic.id === selectedSubTopicId);
  
    // Log the selected subtopic ID and subtopic object for debugging
    console.log('Selected SubTopic ID:', selectedSubTopicId);
    console.log('Selected SubTopic:', selectedSubTopic);
  
    // Update the form values
    setValue("selectedSubTopic", selectedSubTopic ? selectedSubTopic.id : "");
    setValue("selectedSubTopicName", selectedSubTopic ? selectedSubTopic.name : "");
  
    // Log the values set in the form
    console.log('Selected SubTopic ID set in form:', selectedSubTopic ? selectedSubTopic.id : "");
    console.log('Selected SubTopic Name set in form:', selectedSubTopic ? selectedSubTopic.name : "");
  };
  
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onSubmit = async (data) => {
    const selectedSubject = subjects.find(subject => subject.id === parseInt(data.selectedSubject));
    const selectedTopic = topics.find(topic => topic.id === parseInt(data.selectedTopic));
    const selectedSubTopic = subTopics.find(subTopic => subTopic.id === parseInt(data.selectedSubTopic));

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
      await firebase.writeNewContest('newcontest' , data , data.contestId);
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



  const generateContestId = async () => {
    try {
        const id = await firebase.getAndIncrementContestNumber();
        setContestId(id);
        setValue('contestId', id, { shouldValidate: true });
    } catch (error) {
        console.error("Error generating contest ID:", error);
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
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className={`container min-h-screen dark:bg-gray-800 dark:text-white mx-auto p-4 ${isDarkMode ? 'bg-gray-800 dark:text-white' : 'bg-white text-gray-700'}`}>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-1 flex items-center">
          <label htmlFor="contestId" className="block text-sm font-medium">Contest ID</label>
          <input
            type="text"
            id="contestId"
            value={contestId}
            onChange={(e) => setContestId(e.target.value)}
            {...register('contestId', { required: 'Contest ID is required' })}
            className={`mt-1 block w-full dark:bg-gray-800 dark:text-white rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          <button
  type="button"
  onClick={generateContestId}
  className={`ml-2 w-[150px] px-3 py-1 text-xs font-medium rounded-md shadow-sm ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
>
  Generate Contest ID
</button>

          {errors.contestId && <p className="text-red-500 text-sm mt-1">{errors.contestId.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="contestName" className="block text-sm font-medium">Contest Name</label>
          <input
            type="text"
            id="contestName"
            {...register('contestName', { required: 'Contest Name is required' })}
            className={`mt-1 block w-full dark:bg-gray-800 dark:text-white rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.contestName && <p className="text-red-500 text-sm mt-1">{errors.contestName.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="examTime" className="block text-sm  font-medium">Exam Time</label>
          <DatePicker className='w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300'
            selected={examTime}
            onChange={setExamTime}

            // customInput={<CustomInputField name="examTime" label="Select date and time" />}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="resultTime" className="block text-sm font-medium">Result Time</label>
          <DatePicker className='w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300'
            selected={resultTime}
            onChange={setResultTime}
            // customInput={<CustomInputField name="resultTime" label="Select date and time" />}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="lastEntryTime" className="block text-sm font-medium">Last Entry Time</label>
          <DatePicker className='w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300'
            selected={lastEntryTime}
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
          <label htmlFor="contestEndTime" className="block text-sm  font-medium">Contest End Time</label>
          <DatePicker className='w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-300'
            selected={contestEndTime}
            onChange={setContestEndTime}
        
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
          />
        </div>
        <div className="col-span-1">
  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
    Subject:
  </label>
  <select id="subject" onClick={handleSubjectChange} className="mr-2 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm" {...register("selectedSubject")}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
</div>
<div className="col-span-1">
          <label htmlFor="totalQuestions" className="block text-sm font-medium">Total No. of Questions</label>
          <input
            type="text"
            id="totalQuestions"
            {...register('totalQuestions', { required: 'Total No. of Questions is required' })}
            className={`mt-1 dark:bg-gray-800 dark:text-white block w-md rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.totalQuestions && <p className="text-red-500 text-sm mt-1">{errors.totalQuestions.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="entryFee" className="block text-sm font-medium">Entry Fee</label>
          <input
            type="text"
            id="entryFee"
            {...register('entryFee', { required: 'Entry Fee is required' })}
            className={`mt-1 block w-md rounded-md dark:bg-gray-800 dark:text-white border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="1 RS = 1 COIN"
          />
          {errors.entryFee && <p className="text-red-500 text-sm mt-1">{errors.entryFee.message}</p>}
        </div>
        <div className="col-span-1">
          <label htmlFor="totalSpot" className="block text-sm font-medium">Total Spot</label>
          <input
            type="text"
            id="totalSpot"
            {...register('totalSpot', { required: 'Total Spot is required' })}
            className={`mt-1 block w-md rounded-md dark:bg-gray-800 dark:text-white border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="200"
          />
          {errors.totalSpot && <p className="text-red-500 text-sm mt-1">{errors.totalSpot.message}</p>}
        </div>

        {/* <div className="col-span-1">
        <label htmlFor="topic" className="mr-2">Topic:</label>
        <select 
    id="topic" 
    onClick={handleTopicChange} 
    className="mr-2 overflow-auto border dark:bg-gray-800 dark:text-white  w-full border-gray-300 rounded-md shadow-sm" 
    {...register("selectedTopic")}
>
    <option value="">Select Topic</option>
    {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
            {topic.name}
        </option>
    ))}
</select>
        </div> */}
       
        
      
       
      </div>
      <div className="grid grid-cols-4 gap-4 mt-6">
      {/* <div className="col-span-1">
      <label htmlFor="subTopic" className="mr-2">Sub-Topic:</label>
      <select
    id="subtopic"
    onClick={handleSubTopicChange}
    className="mt-2 overflow-auto border dark:bg-gray-800 dark:text-white w-full border-gray-300 rounded-md shadow-sm"
    {...register("selectedSubTopic")}
>
    <option value="">Select Subtopic</option>
    {subTopics.map((subtopic) => (
        <option key={subtopic.id} value={subtopic.id}>
            {subtopic.name}
        </option>
    ))}
</select>
        </div> */}
      
        
       
        
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="col-span-3">
          <label htmlFor="contestDescription" className="block text-sm font-medium">Contest Description</label>
          <textarea
            id="contestDescription"
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
            {...register('prizeMoneyBooked')}
            className={`mt-1 block w-full text-center dark:bg-gray-800 dark:text-white rounded-md border ${isDarkMode ? 'border-gray-600 dark:bg-gray-800 dark:text-white bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            placeholder="70"
          />
          {errors.prizeMoneyBooked && <p className="text-red-500 text-sm mt-1">{errors.prizeMoneyBooked.message}</p>}
        </div>
      </div>

      
      <div className="grid grid-cols-2 gap-4 mt-4">
       <div className="grid grid-cols-3 gap-4">
  {[...Array(numGrids)].map((_, index) => (
    <React.Fragment key={index}>
      <div className="col-span-1">
        <label htmlFor={`totalRankFrom${index + 1}`} className="block text-sm font-medium">Total Rank From</label>
        <input
          type="number"
          id={`totalRankFrom${index + 1}`}
          {...register(`rankings[${index}].totalrankfrom`)}
          className={`mt-1 block dark:bg-gray-800 dark:text-white w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor={`totalRankTo${index + 1}`} className="block text-sm font-medium">Total Rank To</label>
        <input
          type="number"
          id={`totalRankTo${index + 1}`}
          {...register(`rankings[${index}].totalrankto`)}
          className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor={`totalAmount${index + 1}`} className="block text-sm font-medium">Total Amount</label>
        <input
          type="number"
          id={`totalAmount${index + 1}`}
          {...register(`rankings[${index}].totalamount`)}
          className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
    </React.Fragment>
  ))}
</div>


<div className="grid grid-cols-3 gap-4">
  {[...Array(numGrids)].map((_, index) => (
    <React.Fragment key={index}>
      <div className="col-span-1">
        <label htmlFor={`bookedRankFrom${index + 1}`} className="block text-sm font-medium">Booked Rank From</label>
        <input
          type="number"
          id={`bookedRankFrom${index + 1}`}
          {...register(`bookings[${index}].bookedrankfrom`)}
          className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor={`bookedRankTo${index + 1}`} className="block text-sm font-medium">Booked Rank To</label>
        <input
          type="number"
          id={`bookedRankTo${index + 1}`}
          {...register(`bookings[${index}].bookedrankto`)}
          className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
      <div className="col-span-1">
        <label htmlFor={`bookedAmount${index + 1}`} className="block text-sm font-medium">Booked Amount</label>
        <input
          type="number"
          id={`bookedAmount${index + 1}`}
          {...register(`bookings[${index}].bookedamount`)}
          className={`mt-1 dark:bg-gray-800 dark:text-white block w-full rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'} py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
      </div>
    </React.Fragment>
  ))}
</div>

        <button
  type="button"
  onClick={handleAddGrid}
  className={`inline-flex justify-center items-center w-[100px] px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${isDarkMode ? 'dark:text-white bg-blue-500 hover:bg-indigo-700' : 'dark:text-white bg-indigo-500 hover:bg-blue-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
<FaPlus />
</button>

      </div>



      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${isDarkMode ? 'dark:text-white bg-indigo-600 hover:bg-indigo-700' : 'dark:text-white bg-indigo-500 hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          Create New Contest
        </button>
     
      </div>
    </form>

    <ToastContainer />
    </>
  );
};

export default NewContest;
