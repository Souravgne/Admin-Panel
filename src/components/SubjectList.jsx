import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubjectList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { getDocument, writeNewContest } = useFirebase();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const fetchedDocuments = await getDocument("questions");
      const allQuestions = fetchedDocuments.flatMap((doc) => doc.questions || []);
      setQuestionList(allQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, [getDocument]);

  const handleCheckboxChange = (question) => {
    setSelectedQuestions((prevSelectedQuestions) => {
      if (prevSelectedQuestions.includes(question)) {
        return prevSelectedQuestions.filter((q) => q !== question);
      } else {
        return [...prevSelectedQuestions, question];
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true); // Set submitting state to true to disable the button
    try {
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

      for (const question of batch) {
        await writeNewContest('bhola', question, new Date().toISOString()); // Use a unique ID or timestamp
      }

      toast.success("Questions submitted successfully!"); // Show success message using toast
    } catch (error) {
      console.error("Error submitting questions: ", error);
      toast.error("Error submitting questions."); // Show error message using toast
    } finally {
      setSubmitting(false); // Reset submitting state after the submission is complete
    }
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-xl font-semibold dark:text-blue-500 mb-4">Questions List</h1>
      {questionList.length > 0 ? (
        <div className="space-y-4">
          {questionList.map((question, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-4 mb-4">
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
        <p>No questions available.</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting} // Disable button while submitting
        className={`mt-6 px-4 py-2 ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md shadow-md dark:bg-blue-500 dark:hover:bg-blue-600`}
      >
        {submitting ? "Submitting..." : "Submit Selected Questions"} {/* Show loading text */}
      </button>
    </div>
  );
};

export default SubjectList;
