import React, { useState, useEffect } from 'react';
// import axios from 'axios';

const NotificationPage = () => {
  const [contestId, setContestId] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      if (contestId) {
        try {
          const response = await axios.get(`/api/students?contestId=${contestId}`);
          setStudents(response.data);
        } catch (error) {
          setError(error.message);
        }
      }
    };
    fetchStudents();
  }, [contestId]);

  const handleContestIdChange = (event) => {
    setContestId(event.target.value);
  };

  const handleNotificationMessageChange = (event) => {
    setNotificationMessage(event.target.value);
  };

  const handleSendNotification = async () => {
    if (contestId && notificationMessage) {
      try {
        setLoading(true);
        const response = await axios.post('/api/notifications', {
          contestId,
          message: notificationMessage,
        });
        setLoading(false);
        alert('Notification sent successfully!');
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Send Notification</h1>
      <form className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <label htmlFor="contestId" className="w-1/5 text-right pr-2 font-medium">Contest ID:</label>
          <input
            type="text"
            id="contestId"
            value={contestId}
            onChange={handleContestIdChange}
            className="p-2 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm w-4/5"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <label htmlFor="notificationMessage" className="w-1/5 text-right pr-2 font-medium">Notification Message:</label>
          <textarea
            id="notificationMessage"
            value={notificationMessage}
            onChange={handleNotificationMessageChange}
            className="p-2 border dark:bg-gray-800 dark:text-white border-gray-300 rounded-md shadow-sm w-4/5 h-32"
          />
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSendNotification}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Send Notification
          </button>
        </div>
        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
      </form>
      <h2 className="text-2xl font-bold mt-8 mb-4">Students Enrolled in Contest {contestId}</h2>
      <ul className="list-disc list-inside pl-4">
        {students.map((student) => (
          <li key={student.id} className="mb-2 dark:bg-gray-800 dark:text-white">{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
