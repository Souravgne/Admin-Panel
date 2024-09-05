import React, { useState , useEffect } from 'react';
import { useFirebase } from '../context/Firebase'; // Adjust import path as necessary
import { useForm, useFieldArray } from "react-hook-form";
// import { arrayUnion } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from './Loader';




const PreoareExam = () => {




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
const handleFetchpreviousContest = async () => {
  try {
    const fetchedData = await getDocumentbyId('newcontest', contestId);
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
  const { register, setValue,control,reset ,  formState: { errors } } = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const [isCollapsed, setIsCollapsed] = useState(true); // State to track the collapse of the entire window

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed); // Toggle collapse state
  };
  const [areSubjectsLoaded, setAreSubjectsLoaded] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { getDocument, writeNewContest , updateDocument, appendQuestionsToContest  } = useFirebase();
  const [show , setShow] = useState(false); 


  const [contestId, setContestId] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [selectedTopicName , setSelectedTopicName ] = useState(''); 
  const [selectedSubjectName , setSelectedSubjectName ] = useState(''); 
  const [selectedSubTopicName , setSelectedSubTopicName ] = useState(''); 

  const [subTopic, setSubTopic] = useState('');
  const [totalSpot, setTotalSpot] = useState('');
  const [totalQuestions, setTotalQuestions] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [language, setLanguage] = useState('HINDI');
  const [questions, setQuestions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  // const [show , setshow] = useState(true)
  const [count, setCount] = useState(0);
  const { getDocumentbyId } = useFirebase();

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

 const [tps , settps] = useState(''); 
 const [stps , ssettps] = useState(''); 
  const findSelectedSubject = (subjects, selectedSubjectName) => {
    console.log("subject enter",subjects )
    console.log("name wala ", selectedSubjectName)
    // Convert the subjects object into an array of subject objects
    const subjectsArray = Object.values(subjects);
  
    // Find the subject with the name matching selectedSubjectName
    const selectedSubject = subjectsArray.find(subject => subject.name === selectedSubjectName);
    
    return selectedSubject;
  };

  const handleTopicChange = (e) => {
    const selectedTopicId = e.target.value;
    const selectedTopic = topics.find(topic => topic.id === selectedTopicId);
  
    if (selectedTopic) {
        console.log("Selected Topic:", selectedTopic);
        settps(selectedTopic.id); 
        setSubTopics(selectedTopic.subtopics || []);
        setValue("selectedTopic", selectedTopic.id); // Set the ID for internal logic
        setValue("selectedTopicName", selectedTopic.name); // Set the name for display
    }
    ; // Reset subtopic when topic changes
  };

  const handleSubTopicChange = (e) => {
    const selectedSubTopicId = e.target.value; // Assuming ID is used as value
    const selectedSubTopic = subTopics.find(subTopic => subTopic.id === selectedSubTopicId);
  
    // Log the selected subtopic ID and subtopic object for debugging
    console.log('Selected SubTopic ID:', selectedSubTopicId);
    console.log('Selected SubTopic:', selectedSubTopic);
    ssettps(selectedSubTopic ? selectedSubTopic.id : "")
    // Update the form values
    setValue("selectedSubTopic", selectedSubTopic ? selectedSubTopic.id : "");
    setValue("selectedSubTopicName", selectedSubTopic ? selectedSubTopic.name : "");
  
    // Log the values set in the form
    console.log('Selected SubTopic ID set in form:', selectedSubTopic ? selectedSubTopic.id : "");
    console.log('Selected SubTopic Name set in form:', selectedSubTopic ? selectedSubTopic.name : "");
  };
  const fetchQuestions = async () => {
    console.log("Subject for filtering:", subject);
    console.log("Topic for filtering:", tps);
    console.log("SubTopic for filtering:", stps);
    
    setLoading(true);
    setShow(!show);

    // Fetch all documents from the "questions" collection
    const fetchedDocuments = await getDocument("questions");
    console.log("fetch question ", fetchedDocuments)
    
    // Filter documents based on subject, topic, and subtopic names
    const filteredDocuments = fetchedDocuments.filter((doc) => {
      console.log(doc); 
      return (
        doc.topicname === tps &&
        doc.subtopicname === stps
      );
    });

    // Now extract the questions from the filtered documents
    const allQuestions = filteredDocuments.flatMap((doc) => doc.questions || []);
    
    console.log("All questions:", allQuestions);
    console.log("Filtered questions:", allQuestions);
  
    setQuestionList(allQuestions);
    setLoading(false);
};

  
  
  
useEffect(() => {
  async function fetchSubjects() {
    try {
      const fetchedSubjects = await getDocument('subjects');
      setSubjects(fetchedSubjects);
      setAreSubjectsLoaded(true);  // Indicate subjects are loaded
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }

  fetchSubjects();
}, []);


const handleCheckboxChange = (question) => {
  console.log("Checkbox clicked for question:", question); // Log the clicked question

  setSelectedQuestions((prevSelectedQuestions) => {
    console.log("Previous selected questions:", prevSelectedQuestions); // Log the current state of selected questions

    if (prevSelectedQuestions.includes(question)) {
      // If the question is already selected, remove it
      console.log("Question is already selected, removing:", question);
      
      const updatedQuestions = prevSelectedQuestions.filter((q) => q !== question);
      console.log("Updated selected questions after removal:", updatedQuestions); // Log the updated state after removal
      
      setCount(updatedQuestions.length); // Update the count
      console.log("Updated count after removal:", updatedQuestions.length); // Log the updated count
      
      return updatedQuestions;
    } else {
      // If the question is not selected, add it
      console.log("Question is not selected, adding:", question);
      
      const updatedQuestions = [...prevSelectedQuestions, question];
      console.log("Updated selected questions after addition:", updatedQuestions); // Log the updated state after addition
      
      setCount(updatedQuestions.length); // Update the count
      console.log("Updated count after addition:", updatedQuestions.length); // Log the updated count
      
      return updatedQuestions;
    }
  });
};




const handleSubmit = async () => {
  setSubmitting(true); // Set submitting state to true to disable the button

  try {
    // Map selected questions to a new format
    const newQuestions = selectedQuestions.map((question, index) => ({
      questionid: index,
      englishquestion: question.englishquestion,
      hindiquestion: question.hindiquestion,
      englishoptionA: question.englishoptionA,
      englishoptionB: question.englishoptionB,
      englishoptionC: question.englishoptionC,
      englishoptionD: question.englishoptionD,
      englishanswer: question.englishanswer,
      hindiSolution:question.hindiSolution,
      hindioptionA: question.hindioptionA,
      hindioptionB: question.hindioptionB,
      hindioptionC: question.hindioptionC,
      hindioptionD: question.hindioptionD,
      hindianswer: question.hindianswer,
      solution: question.solution,
    }));

    // Call the append function to add new questions to the existing contest
    await appendQuestionsToContest('newcontest', contestId, newQuestions);

    // Handle success
    console.log("Questions appended successfully!");
    toast.success("Questions added successfully!"); // Use toast notification for success

    // Reset the form fields by clearing the selected questions
    setSelectedQuestions([]); // Reset the selected questions state to an empty array

  } catch (error) {
    // Handle errors
    console.error("Error appending questions:", error);
    toast.error("Error appending questions."); // Use toast notification for errors

  } finally {
    // Reset submitting state after the submission is complete
    setSubmitting(false);
  }
};




  if (loading) {
    return <div className='flex justify-center items-center'>
      <Loader />
    </div> 
  }

  const handleFetchContest = async () => {
    if (!areSubjectsLoaded) {
      console.warn('Subjects are not yet loaded, please wait.');
      return;
    }
  
    try {
      handleFetchpreviousContest()
      const contestData = await getDocumentbyId('newcontest', contestId);
      if (contestData) {
        console.log("insidecontest", contestData);
        setSubject(contestData.selectedSubject || '');
        
        const formattedDate = contestData.examTime
          ? contestData.examTime.toDate().toLocaleString('en-GB', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '';
        setDate(formattedDate);
  
        setTopic(contestData.selectedTopic || '');
        setSelectedTopicName(contestData.selectedTopicName);
        setSelectedSubjectName(contestData.selectedSubjectName);
        setSelectedSubTopicName(contestData.selectedSubTopicName);
        setSubTopic(contestData.selectedSubTopic || '');
        setTotalSpot(contestData.totalSpot || '');
        setTotalQuestions(contestData.totalQuestions || '');
        setSelectedQuestion(contestData.selectedQuestion || '');
        setLanguage(contestData.language || 'HINDI');
        setQuestions(contestData.questions || []);
        setIsDisabled(true);
  
        // Filter topics based on selected subject name
        console.log("subject wala", subjects);
        const selectedSubject = findSelectedSubject(subjects, contestData.selectedSubjectName);
  
        if (selectedSubject) {
          const filteredTopics = selectedSubject.topics || [];
          console.log("Filtered Topics:", filteredTopics);
          setTopics(filteredTopics);
        } else {
          console.log("Selected subject not found in subjects list");
        }
  
      } else {
        alert('Contest not found');
      }
    } catch (error) {
      console.error('Error fetching contest details:', error);
    }
  };
  
  // Function to find the selected subject
  const handleDeleteQuestion = async (indexToDelete) => {
    try {
      console.log("Attempting to delete question at index:", indexToDelete);
      console.log("Original questions array:", contestData.questions);
  
      // Ensure the index is valid before proceeding
      if (indexToDelete < 0 || indexToDelete >= contestData.questions.length) {
        console.error("Invalid index provided for deletion:", indexToDelete);
        toast.error("Invalid question index. Please try again.");
        return;
      }
  
      // Filter out the question to be deleted by keeping all questions except the one at indexToDelete
      const updatedQuestions = contestData.questions.filter((_, index) => index !== indexToDelete);
      console.log("Updated questions array after deletion:", updatedQuestions);
  
      // Update the questions array in Firestore
      console.log("Updating Firestore document with ID:", contestId);
      await updateDocument('newcontest', contestId, { questions: updatedQuestions });
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
  



  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-5 min-h-screen dark:bg-gray-800 dark:text-gray-300">
  <div className="flex flex-wrap gap-4 ">
    <div className="w-1/5">
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
          className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
          onClick={handleFetchContest}
        >
          Fetch
        </button>
      </div>
    </div>

  
    <div className="w-1/5">
      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Subject:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="subject"
        value={selectedSubjectName}
        onChange={(e) => setSubject(e.target.value)}
        disabled={isDisabled}
      />
    </div>

    <div className="w-1/5">
      <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Date & Time:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={isDisabled}
      />
    </div>


    <div className="w-1/5">
    <label htmlFor="topic" className="mr-2">Topic:</label>
        <select 
    id="topic" 
    onClick={handleTopicChange} 
    className="mr-2 overflow-auto border dark:bg-gray-800 dark:text-white  w-full border-gray-300 rounded-md shadow-sm" 
    {...register("selectedTopic" ,  { required: true })}
>
    <option value="">{false?selectedTopicName:  'Select Topic'}</option>
    {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
            {topic.name}
        </option>
    ))}
</select>
    </div>

    <div className="w-1/5">
    <label htmlFor="subTopic" className="mr-2">Sub-Topic:</label>
      <select
    id="subtopic"
    onClick={handleSubTopicChange}
    className="mt-2 overflow-auto border dark:bg-gray-800 dark:text-white w-full border-gray-300 rounded-md shadow-sm"
    {...register("selectedSubTopic" ,  { required: true })}
>
    <option value="">{false?selectedSubTopicName: 'Select Sub-topic' }</option>
    {subTopics.map((subtopic) => (
        <option key={subtopic.id} value={subtopic.id}>
            {subtopic.name}
        </option>
    ))}
</select>
    </div>

    <div className="w-1/5">
      <label htmlFor="totalSpot" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Total Spot:
      </label>
      <input
        type="number"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="totalSpot"
        value={totalSpot}
        onChange={(e) => setTotalSpot(e.target.value)}
        disabled={isDisabled}
      />
    </div>

    <div className="w-1/5">
      <label htmlFor="totalQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Total No. of Questions:
      </label>
      <input
        type="number"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="totalQuestions"
        value={totalQuestions}
        onChange={(e) => setTotalQuestions(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  </div>

  <div className="flex flex-wrap gap-4">
    <div className="w-1/5">
      <label htmlFor="selectedQuestion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Selected Question:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="selectedQuestion"
        value={count}
        onChange={(e) => setSelectedQuestion(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  </div>
  <hr className="dark:border-gray-600" />
  
  <h1 className="text-xl font-semibold dark:text-white  mb-4">Previous Questions </h1>

  <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-300">
          Questions
        </h2>
        <button
          type="button"
          onClick={toggleCollapse}
          className="bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {isCollapsed ? 'Show Questions' : 'Hide Questions'}
        </button>
      </div>

      {/* Conditional rendering to toggle between collapsed and expanded state */}
      {!isCollapsed ? (
        <div className="space-y-4">
          {Array.isArray(contestData.questions) && contestData.questions.length > 0 ? (
            contestData.questions.map((question, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-300">
                    {index + 1}.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(index)}
                    className="bg-red-600 text-white hover:bg-red-700 font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-400"
                  >
                    Delete
                  </button>
                </div>

                {/* English Question and Options */}
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Question (English):
                  </label>
                  <input
                    type="text"
                    value={question.englishquestion || ""}
                    {...register(`questions.${index}.englishquestion`)}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => handleQuestionChange(e, index, 'englishquestion')}
                  />
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Options (English):
                  </label>
                  <div className="flex space-x-4">
                    {['englishoptionA', 'englishoptionB', 'englishoptionC', 'englishoptionD'].map((optionKey) => (
                      <input
                        key={optionKey}
                        type="text"
                        value={question[optionKey] || ""}
                        {...register(`questions.${index}.${optionKey}`)}
                        className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={(e) => handleQuestionChange(e, index, optionKey)}
                      />
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Answer (English):
                  </label>
                  <input
                    type="text"
                    value={question.englishanswer || ""}
                    {...register(`questions.${index}.englishanswer`)}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => handleQuestionChange(e, index, 'englishanswer')}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Solution: {question.solution}
                  </p>
                </div>

                {/* Hindi Question and Options */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Question (Hindi):
                  </label>
                  <input
                    type="text"
                    value={question.hindiquestion || ""}
                    {...register(`questions.${index}.hindiquestion`)}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => handleQuestionChange(e, index, 'hindiquestion')}
                  />
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Options (Hindi):
                  </label>
                  <div className="flex space-x-4">
                    {['hindioptionA', 'hindioptionB', 'hindioptionC', 'hindioptionD'].map((optionKey) => (
                      <input
                        key={optionKey}
                        type="text"
                        value={question[optionKey] || ""}
                        {...register(`questions.${index}.${optionKey}`)}
                        className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        onChange={(e) => handleQuestionChange(e, index, optionKey)}
                      />
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Answer (Hindi):
                  </label>
                  <input
                    type="text"
                    value={question.hindianswer || ""}
                    {...register(`questions.${index}.hindianswer`)}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => handleQuestionChange(e, index, 'hindianswer')}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Solution: {question.hindiSolution}
                  </p>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No Questions
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Questions are hidden.
        </div>
      )}
    </div>
  


  <hr className="dark:border-gray-600" />
  
  <button
    onClick={fetchQuestions}
    type="submit"
    className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-blue-600 dark:hover:bg-blue-500"
  >
   

    {false ? "Hide Questions" : "Select Questions"}
  </button>

       { <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-xl font-semibold dark:text-white  mb-4">Questions List</h1>
      {questionList.length > 0 ? (
  <div className="space-y-4">
    {questionList.map((question, index) => (
      <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          {/* Displaying the question number */}
          <span className="text-lg font-bold text-gray-900 dark:text-gray-300">
            {index + 1}.
          </span>
          <input
            id={`question-checkbox-${index}`}
            type="checkbox"
            checked={selectedQuestions.includes(question)}
            onChange={() => handleCheckboxChange(question)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={`question-checkbox-${index}`}
            className="text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {question.englishquestion}
          </label>
        </div>

        {/* English Options and Answer */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">Options (English):</label>
            <div className="flex space-x-4">
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                <input
                  type="text"
                  value={question.englishoptionA || ""}
                  className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                <input
                  type="text"
                  value={question.englishoptionB || ""}
                  className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                <input
                  type="text"
                  value={question.englishoptionC || ""}
                  className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                <input
                  type="text"
                  value={question.englishoptionD || ""}
                  className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-900 dark:text-white">Answer:</label>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
              <input
                type="text"
                value={question.englishanswer || ""}
                className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled
              />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Solution: {question.solution}</p>

        </div>

        {/* Hindi Options and Answer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-4 mb-4">
            <input
              id={`hindi-question-checkbox-${index}`}
              type="checkbox"
              checked={selectedQuestions.includes(question)}
              onChange={() => handleCheckboxChange(question)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`hindi-question-checkbox-${index}`}
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {question.hindiquestion}
            </label>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">Options (Hindi):</label>
              <div className="flex space-x-4">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                  <input
                    type="text"
                    value={question.hindioptionA || ""}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled
                  />
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                  <input
                    type="text"
                    value={question.hindioptionB || ""}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled
                  />
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                  <input
                    type="text"
                    value={question.hindioptionC || ""}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled
                  />
                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                  <input
                    type="text"
                    value={question.hindioptionD || ""}
                    className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled
                  />
                </div>


              </div>
            </div>

            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">Answer:</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600">
                <input
                  type="text"
                  value={question.hindianswer || ""}
                  className="w-full bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled
                />
              </div>
              
            </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Solution: {question.hindiSolution}</p>

          </div>

        </div>
      </div>
    ))}
  </div>
) : (
  <p className='dark:text-grey-900'>No questions available.</p>
)}


      <button
        onClick={handleSubmit}
        disabled={submitting} // Disable button while submitting
        className={`mt-6 px-4 py-2 ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md shadow-md dark:bg-blue-500 dark:hover:bg-blue-600`}
      >
        {submitting ? "Submitting..." : "Create Contest"} {/* Show loading text */}
      </button>
    </div>}
    </form>
  );
};

export default PreoareExam;
