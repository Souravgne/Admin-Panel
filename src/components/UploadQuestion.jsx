import { useFirebase } from '../context/Firebase';
import React, { useState , useEffect} from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { arrayUnion } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';











const UploadQuestion = () => {
  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      questions: [],
    },
  });
  const [showAddButton, setShowAddButton] = useState(true);
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
    console.log("hello buddy")
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
  const selectedSubTopicId = e.target.value; // No need to parseInt since it's a string ID
  const selectedSubTopic = subTopics.find(subTopic => subTopic.id === selectedSubTopicId);

  // Log the selected subtopic ID and subtopic object for debugging
  console.log('Selected SubTopic ID:', selectedSubTopicId);
  console.log('Selected SubTopic:', selectedSubTopic);

  // Update the form value for selectedSubTopic with the subtopic name if found
  setValue("selectedSubTopic", selectedSubTopic ? selectedSubTopic.id : "");
  setValue("selectedSubTopicName", selectedSubTopic ? selectedSubTopic.name : "");

  // Log the value set for selectedSubTopic
  console.log('Selected SubTopic Name set in form:', selectedSubTopic ? selectedSubTopic.name : "");
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
    // Log the form data received on submit
    console.log('Form data submitted:', data);
    setShowAddButton(true);
    // Find the selected subject based on the submitted data
    const selectedSubject = subjects.find(subject => subject.name === data.selectedSubject);
    console.log('Selected subject:', selectedSubject);

    // Find the selected topic based on the submitted data
    const selectedTopic = topics.find(topic => topic.name === data.selectedTopic);
    console.log('Selected topic:', selectedTopic);

    // Find the selected subtopic based on the submitted data
    const selectedSubTopic = subTopics.find(subTopic => subTopic.name === data.selectedSubTopic);
    console.log('Selected subtopic:', selectedSubTopic);

    // Construct the question data for Firebase
    const questionData = {
        subjectname: data.selectedSubject,
        topicname: data.selectedTopic,
        subtopicname: data.selectedSubTopic,
        questions: data.questions
    };
    console.log('Constructed question data:', questionData);

    try {
        // Attempt to write new contest data to Firebase
        console.log('Attempting to write new contest data to Firebase...');
        await firebase.writeNewContest('questions', questionData, uuidv4());
        console.log('Data successfully written to Firebase.');

        // Display success message and reset form
        toast.success('Questions added successfully!');
        reset();
        console.log('Form reset after successful submission.');
    } catch (error) {
        // Handle errors and display error message
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
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Question Upload</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
    <label htmlFor="subject" className="mr-2 dark:text-gray-300">Subject:</label>
    <select
      id="subject"
      onChange={handleSubjectChange}
      className="mr-2 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
      required
    >
      <option value="">Select Subject</option>
      {subjects && subjects.length > 0 ? (
        subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))
      ) : (
        <option value="">No Subjects Available</option>
      )}
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
          required
        />
        <button 
          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-600 dark:bg-blue-600 text-white"
          onClick={addNewSubject}
          type="button"
        >
          Add
        </button>
      </div>
    )}
  </div>
          <div className="flex items-center">
            <label htmlFor="topic" className="mr-2 dark:text-gray-300">Topic:</label>
            <select 
    id="topic" 
    onClick={handleTopicChange} 
    className="mr-2 overflow-auto border dark:bg-gray-800 dark:text-white  w-full border-gray-300 rounded-md shadow-sm" 
    {...register("selectedTopic" ,  { required: true })}
>
    <option value="">Select Topic</option>
    {topics.map((topic) => (
        <option key={topic.id} value={topic.id}>
            {topic.name}
        </option>
    ))}
</select>


            <button 
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-500 text-white dark:text-gray-300"
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
                  className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-green-500 text-white dark:bg-blue-600 "
                  onClick={addNewTopic}
                  type="button"
                >
                  Add
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
    <label htmlFor="subtopic" className="mr-2 dark:text-gray-300">Sub-Topic:</label>
    <select
      id="subtopic"
      onChange={handleSubTopicChange}
      className="mt-2 overflow-auto border dark:bg-gray-800 dark:text-white w-full border-gray-300 rounded-md shadow-sm"
      {...register("selectedSubTopic", { required: true })}
      required
    >
      <option value="">Select Subtopic</option>
      {subTopics.map((subtopic) => (
        <option key={subtopic.id} value={subtopic.id}>
          {subtopic.name}
        </option>
      ))}
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
          className="mr-2 dark:bg-gray-800 dark:text-white border border-gray-300 rounded-md shadow-sm"
          required
        />
        <button 
          className="px-2 py-1 border border-gray-300 rounded-md shadow-sm bg-blue-600 text-white"
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
          <table className="min-w-full divide-y dark:bg-gray-800 dark:text-white divide-gray-200 mb-6">
            <thead className="bg-gray-50  dark:bg-gray-800 dark:text-white">
              <tr>
                <th className="px-6 py-3 dark:bg-gray-800  dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-6 py-3 text-left text-xs dark:text-white font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Option A</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-white">Option B</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-white tracking-wider">Option C</th>
                <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option D</th>
                <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3   dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                <th className="px-6 py-3 dark:text-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:bg-gray-800 divide-gray-200">
              {fields.map((question, index) => (
                <React.Fragment key={question.id}>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Hindi</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <textarea
                        type="text"
                        {...register(`questions.${index}.hindiquestion`)}
                        className="w-[400px] dark:bg-gray-800 dark:text-white text-wrap border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionA`)}
                        className=" border-gray-300 dark:bg-gray-800 dark:text-white rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionB`)}
                        className=" border-gray-300 dark:bg-gray-800 dark:text-white rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionC`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindioptionD`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindianswer`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.hindiSolution`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className=" hover:text-red-900 border bg-red-500 text-white border-red-600 rounded-md px-4 py-2 text-sm font-semibold"
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
                        className="w-[400px] dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionA`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionB`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionC`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishoptionD`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.englishanswer`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        {...register(`questions.${index}.solution`)}
                        className="dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className=" hover:text-red-900 border bg-red-500 text-white border-red-600 rounded-md px-4 py-2 text-sm font-semibold"
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
          {showAddButton && (
             <button
  type="button"
  onClick={() => {
    // Hide the "Add Question" button
    setShowAddButton(true);

    // Add the question data
    append({
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
      hindisolution: "",
      solution: ""
    });
  }}
  className="px-4 py-2 border border-gray-300 mb-3 rounded-md shadow-sm bg-blue-600 text-white"
>
  Add Question
</button>)}

        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default UploadQuestion;

