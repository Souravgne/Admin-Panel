import { useFirebase } from '../context/Firebase';
import React, { useState , useEffect} from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { arrayUnion } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { useFetcher } from 'react-router-dom';










const NewAdd = () => {
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const [allSubjects, setallSubjects] = useState([]);

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

  const firebase = useFirebase();
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newSubTopic, setNewSubTopic] = useState("");
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false);
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);
  const [showNewSubTopicInput, setShowNewSubTopicInput] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // Added state for selected subject ID

  const handleSubjectChange = (e) => {
    const selectedSubjectId = e.target.value;
    const selectedSubject = subjects.find(subject => subject.id === parseInt(selectedSubjectId));
    const filteredTopics = topics.filter(t => t.subjectId === parseInt(selectedSubjectId));
    setTopics(filteredTopics);
    setSubTopics([]);
    setSelectedSubjectId(selectedSubjectId); // Set selected subject ID
    setValue("selectedSubject", selectedSubjectId);  // Set the subject ID directly
    setValue("selectedTopic", "");
    setValue("selectedSubTopic", "");
  };

  const handleTopicChange = (e) => {
    const selectedTopicId = parseInt(e.target.value);
    const selectedTopic = topics.find(topic => topic.id === selectedTopicId);
    const filteredSubTopics = subTopics.filter(st => st.topicId === selectedTopicId);
    setSubTopics(filteredSubTopics);
    setValue("selectedTopic", selectedTopic ? selectedTopic.name : "");
    setValue("selectedSubTopic", "");
  };

  const handleSubTopicChange = (e) => {
    const selectedSubTopicId = parseInt(e.target.value);
    const selectedSubTopic = subTopics.find(subTopic => subTopic.id === selectedSubTopicId);
    setValue("selectedSubTopic", selectedSubTopic ? selectedSubTopic.name : "");
  };

  const addNewSubject = async () => {
    try {
      const newSubjectId = uuidv4();
      const newSubjectData = { id: newSubjectId.toString(), name: newSubject.trim() };
  
      // Update local state
      setSubjects([...subjects, newSubjectData]);
  
      // Write new subject to Firebase
      await firebase.writeNewContest("subjects", newSubjectData, newSubjectId.toString());
  
      // Clear input fields and hide input box
      setNewSubject("");
      setShowNewSubjectInput(false);
  
      // Show success message
      toast.success('Subject added successfully!');
    } catch (error) {
      // Show error message
      toast.error('Failed to add subject.');
      console.error("Error adding subject:", error);
    }
  };

  const addNewTopic = async () => {
    try {
      const selectedSubjectId = watch("selectedSubject");
      const newTopicId = uuidv4();
      const newTopicData = {
        id: newTopicId.toString(),
        name: newTopic.trim(),
        subjectId: questionId,
      };
  
      // Retrieve the existing subject document
      const existingSubject = await firebase.getDocumentbyId("subjects", selectedSubjectId);
  
      if (existingSubject) {
        // Update the subject document with the new topic
        const updatedSubject = {
          ...existingSubject,
          topics: arrayUnion(newTopicData), // Use arrayUnion to add the new topic
        };
  
        await firebase.updateDocument("subjects", selectedSubjectId, updatedSubject);
        
        // Update local state
        setTopics([...topics, newTopicData]);
  
        setNewTopic("");
        setShowNewTopicInput(false);
        toast.success('Topic added successfully!');
      } else {
        console.log("Subject not found for ID:", selectedSubjectId);
      }
    } catch (error) {
      toast.error('Failed to add topic.');
      console.error("Error adding topic:", error);
    }
  };
  
  const addNewSubTopic = async () => {
    const selectedTopicId = watch("selectedTopic");
    const selectedSubjectId = watch("selectedSubject");
    const newSubTopicId = uuidv4();
    const newSubTopicData = {
        id: newSubTopicId.toString(),
        name: newSubTopic.trim(),
        // questions: [] // Initialize with an empty array for questions
    };

    // Add the new subtopic to the local state
    setSubTopics([...subTopics, newSubTopicData]);

    try {
        // Get the reference to the subject document
        const subjectDoc = await firebase.getDocumentbyId("subjects", selectedSubjectId.toString());

        // setDataSet(subjectDoc)
        if (subjectDoc) {
            const subjectData = subjectDoc;

            // Find the topic within the topics array
            const topicIndex = subjectData.topics.findIndex(topic => topic.id === selectedTopicId.toString());

            if (topicIndex !== -1) {
                // Ensure the topic data has a subtopics field and add the new subtopic
                const updatedTopics = [...subjectData.topics];
                const updatedSubTopics = updatedTopics[topicIndex].subtopics ? [...updatedTopics[topicIndex].subtopics, newSubTopicData] : [newSubTopicData];
                updatedTopics[topicIndex] = {
                    ...updatedTopics[topicIndex],
                    subtopics: updatedSubTopics,
                };

                // Update the subject document with the new topics array
                await firebase.updateDocument("subjects", selectedSubjectId.toString(), { topics: updatedTopics });

                setNewSubTopic("");
                setShowNewSubTopicInput(false);
                toast.success('Sub-Topic added successfully!');
            } else {
                console.log("Topic not found for ID:", selectedTopicId);
                toast.error('Topic not found.');
            }
        } else {
            console.log("Subject not found for ID:", selectedSubjectId);
            toast.error('Subject not found.');
        }
    } catch (error) {
        console.error("Error adding subtopic: ", error);
        toast.error('Failed to add subtopic.');
    }
};

  
  

  const generateQuestionId = () => {
    const id = Math.floor(1000 + Math.random() * 9000);
    setQuestionId(id);
  };

  const onSubmit = async (data) => {
    const selectedSubject = subjects.find(subject => subject.id === parseInt(data.selectedSubject));
    const selectedTopic = topics.find(topic => topic.id === parseInt(data.selectedTopic));
    const selectedSubTopic = subTopics.find(subTopic => subTopic.id === parseInt(data.selectedSubTopic));
  
    const questionData = {
      subjectname: selectedSubject ? selectedSubject.name : '',
      subjectid: data.selectedSubject,
      topicname: selectedTopic ? selectedTopic.name : '',
      topicid: data.selectedTopic,
      subtopicname: selectedSubTopic ? selectedSubTopic.name : '',
      subtopicid : data.selectedSubTopic,
      questions: data.questions
    };
  
    try {
      await firebase.writeNewContest('questions' ,questionData ,uuidv4());
      toast.success('Questions added successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to add questions.');
      console.error('Error adding questions:', error);
    }
  };
  
 

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Question Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="col-span-1 flex items-center">
            <label htmlFor="contestId" className="block text-sm font-medium">Contest ID</label>
            <input
              type="text"
              id="contestId"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              {...register('contestId', { required: 'Question ID is required' })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={generateQuestionId}
              className="ml-2 px-3 py-1 text-xs font-medium rounded-md shadow-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Generate ID
            </button>
          </div>
          <div className="flex items-center">
            <label htmlFor="subject" className="mr-2">Subject:</label>
            <select id="subject" onChange={handleSubjectChange} className="mr-2 border border-gray-300 rounded-md shadow-sm" {...register("selectedSubject")}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <button 
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-500 text-white" 
              onClick={() => setShowNewSubjectInput(true)}
              type="button"
            >
              +
            </button>
            {showNewSubjectInput && (
              <div className="ml-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="mr-2 border border-gray-300 rounded-md shadow-sm"
                />
                <button 
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white"
                  onClick={addNewSubject}
                  type="button"
                >
                  Add
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <label htmlFor="topic" className="mr-2">Topic:</label>
            <select id="topic" onChange={handleTopicChange} className="mr-2 border border-gray-300 rounded-md shadow-sm" {...register("selectedTopic")}>
              <option value="">Select Topic</option>
              {subjects.map((subject) => (
  (subject.topics || []).map((topic) => (
    <option key={topic.id} value={topic.id}>
      {topic.name}
    </option>
  ))
))}

             
            </select>
            <button 
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-500 text-white"
              onClick={() => setShowNewTopicInput(true)}
              type="button"
            >
              +
            </button>
            {showNewTopicInput && (
              <div className="ml-2">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="mr-2 border border-gray-300 rounded-md shadow-sm"
                />
                <button 
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white"
                  onClick={addNewTopic}
                  type="button"
                >
                  Add
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <label htmlFor="subTopic" className="mr-2">Sub-Topic:</label>
            <select id="subTopic" onChange={handleSubTopicChange} className="mr-2 border border-gray-300 rounded-md shadow-sm" {...register("selectedSubTopic")}>
              <option value="">Select Sub-Topic</option>
              {subjects.map((subject) =>
  (subject.topics || []).map((topic) =>
    (topic.subtopics || []).map((subTopic) => (
      <option key={subTopic.id} value={subTopic.id}>
        {subTopic.name}
      </option>
    ))
  )
)}


                     
            </select>
            <button 
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-500 text-white"
              onClick={() => setShowNewSubTopicInput(true)}
              type="button"
            >
              +
            </button>
            {showNewSubTopicInput && (
              <div className="ml-2">
                <input
                  type="text"
                  value={newSubTopic}
                  onChange={(e) => setNewSubTopic(e.target.value)}
                  className="mr-2 border border-gray-300 rounded-md shadow-sm"
                />
                <button 
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white"
                  onClick={addNewSubTopic}
                  type="button"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option A</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option B</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option C</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option D</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((question, index) => (
                <React.Fragment key={question.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Hindi</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <textarea
                        type="text"
                        {...register(`questions.${index}.hindiquestion`)}
                        className="w-[400px] text-wrap border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionA`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionB`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionC`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionD`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindianswer`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.solution`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 border bg-red-500 text-white border-red-600 rounded-md px-4 py-2 text-sm font-semibold"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">English</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <textarea col-4
                        type="text"
                        {...register(`questions.${index}.englishquestion`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionA`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionB`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionC`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionD`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishanswer`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.solution`)}
                        className="w-full border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900 border bg-red-500 text-white border-red-600 rounded-md px-4 py-2 text-sm font-semibold"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => append({
              hindiquestion: "",
              hindioptionA: "",
              hindioptionB: "",
              hindioptionC: "",
              hindioptionD: "",
              hindianswer: "",
              englishquestion: "",
              englishoptionA: "",
              englishoptionB: "",
              englishoptionC: "",
              englishoptionD: "",
              englishanswer: "",
              solution: ""
            })}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white"
          >
            Add Question
          </button>
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default NewAdd;

