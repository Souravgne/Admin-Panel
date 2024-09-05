import React, { useState , useEffect } from 'react';
import { useFirebase } from '../context/Firebase'; // Adjust import path as necessary
import { useForm, useFieldArray } from "react-hook-form";
// import { arrayUnion } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from './Loader';




const Waste = () => {




  
  const { register, control } = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { getDocument, writeNewContest  , updateDocument} = useFirebase();
  const [show , setShow] = useState(false); 


  const [contestId, setContestId] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
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


  const fetchQuestions = async () => {
    console.log("Subject for filtering:", subject);
    console.log("Topic for filtering:", topic);
    console.log("SubTopic for filtering:", subTopic);
    
    setLoading(true);
    setShow(!show);

    // Fetch all documents from the "questions" collection
    const fetchedDocuments = await getDocument("questions");
    console.log("fetch question ", fetchedDocuments)
    
    // Filter documents based on subject, topic, and subtopic names
    const filteredDocuments = fetchedDocuments.filter((doc) => {
      return (
        doc.subjectname === subject &&
        doc.topicname === topic &&
        doc.subtopicname === subTopic
      );
    });

    // Now extract the questions from the filtered documents
    const allQuestions = filteredDocuments.flatMap((doc) => doc.questions || []);
    
    console.log("All questions:", allQuestions);
    console.log("Filtered questions:", allQuestions);
  
    setQuestionList(allQuestions);
    setLoading(false);
};

  
  
  
 


const handleCheckboxChange = (question) => {
  setSelectedQuestions((prevSelectedQuestions) => {
    if (prevSelectedQuestions.includes(question)) {
      // If the question is already selected, remove it
      const updatedQuestions = prevSelectedQuestions.filter((q) => q !== question);
      setCount(updatedQuestions.length); // Update the count
      return updatedQuestions;
    } else {
      // If the question is not selected, add it
      const updatedQuestions = [...prevSelectedQuestions, question];
      setCount(updatedQuestions.length); // Update the count
      return updatedQuestions;
    }
  });
};

const handleSubmit = async () => {
 
  setSubmitting(true); // Set submitting state to true to disable the button
  try {
    console.log("insde handle")
      // Prepare the batch of questions
      const batch = selectedQuestions.map((question) => ({
          englishquestion: question.englishquestion,
          hindiquestion: question.hindiquestion,
          englishoptionA: question.englishoptionA,
          englishoptionB: question.englishoptionB,
          englishoptionC: question.englishoptionC,
          englishoptionD: question.englishoptionD,
          englishanswer: question.englishanswer,
          hindioptionA: question.hindioptionA,
          hindioptionB: question.hindioptionB,
          hindioptionC: question.hindioptionC,
          hindioptionD: question.hindioptionD,
          hindianswer: question.hindianswer,
          solution: question.solution,
      }));
    console.log("batch" , batch)


      // Create or update the document in the 'newcontest' collection
      const contestid = contestId; 
    console.log("id" , contestId)
    // Replace with the actual contest ID or use a variable
      await updateDocument('newcontest', contestid, { questions: batch });

      toast.success("Questions submitted successfully!"); // Show success message using toast
  } catch (error) {
      console.error("Error submitting questions: ", error);
      toast.error("Error submitting questions."); // Show error message using toast
  } finally {
      // setSubmitting(false); // Reset submitting state after the submission is complete
  }
};


  if (loading) {
    return <div className='flex justify-center items-center'>
      <Loader />
    </div> 
  }

  const handleFetchContest = async () => {
    const contestData = await getDocumentbyId('newcontest', contestId);
    if (contestData) {
      setSubject(contestData.selectedSubject || '');
      setDate(contestData.examTime?.toDate().toISOString() || ''); // Adjust date formatting as needed
      setTopic(contestData.selectedTopic || '');
      setSubTopic(contestData.selectedSubTopic || '');
      setTotalSpot(contestData.totalSpot || '');
      setTotalQuestions(contestData.totalQuestions || '');
      setSelectedQuestion(contestData.selectedQuestion || '');
      setLanguage(contestData.language || 'HINDI');
      setQuestions(contestData.questions || []);
      setIsDisabled(true);

    } else {
      alert('Contest not found');
    }
  };

  


  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-5 dark:bg-gray-800 dark:text-gray-300">
  <div className="flex flex-wrap gap-4">
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

    {/* Repeat for other input fields */}
    {/* Apply similar dark mode classes to other fields as shown above */}
    <div className="w-1/5">
      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Subject:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="subject"
        value={subject}
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
      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Topic:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        disabled={isDisabled}
      />
    </div>

    <div className="w-1/5">
      <label htmlFor="subTopic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Sub Topic:
      </label>
      <input
        type="text"
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        id="subTopic"
        value={subTopic}
        onChange={(e) => setSubTopic(e.target.value)}
        disabled={isDisabled}
      />
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
  
  <button
    onClick={fetchQuestions}
    type="submit"
    className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-blue-600 dark:hover:bg-blue-500"
  >
    {show ? "Hide Questions" : "Select Questions"}
  </button>

       {show && <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">Solution: {question.solution}</p>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className='dark:text-white'>No questions available.</p>
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

export default Waste;
