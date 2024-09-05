import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';
import { Table } from 'flowbite-react';

const ContestDetails = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const { getDocumentbyId } = useFirebase();

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const data = await getDocumentbyId('newcontest', contestId);
        setContest(data);
        // Fetch student data associated with the contest if needed
        // For example, fetching from a 'students' collection or similar
        // setStudents(fetchedStudentData);
      console.log(data)

      } catch (err) {
        setError('Failed to fetch contest details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId, getDocumentbyId]);

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  console.log("hola dola " , contest)

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
  {contest ? (
    <div>
      {/* Contest Details Section */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contest Details</h1>
      <div className=" gap-6 mb-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Contest ID', value: contest.contestId },
            { label: 'Subject', value: contest.selectedSubjectName },
            { label: 'Total Spots', value: contest.totalSpot },
            { label: 'Date & Time', value: contest.examTime ? new Date(contest.examTime.seconds * 1000).toLocaleString() : 'N/A' },
            { label: 'Join Amount', value: contest.entryFee },
            { label: 'Booked Spot', value: contest.bookedspot?contest.bookedspot:"N/A" },
            { label: 'Total Amount Received', value: contest.totalAmountReceived?contest.totalAmountReceived:"N/A" },
            { label: 'Amount Distributed', value: contest.amountDistributed?contest.amountDistributed:"N/A" },
          ].map((item) => (
            console.log("item" , item),
            <div key={item.label} className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">{item.label}</label>
              <input
                type="text"
                value={item.value || ""}
                className="bg-gray-100 border-gray-300 text-gray-900 rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled
              />
            </div>
          ))}
        </div>
      </div>

      {/* Student Details Table */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student Details</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Student ID</Table.HeadCell>
            <Table.HeadCell>Student Name</Table.HeadCell>
            <Table.HeadCell>Rank</Table.HeadCell>
            <Table.HeadCell>Correct Questions</Table.HeadCell>
            <Table.HeadCell>Total Attempted Questions</Table.HeadCell>
            <Table.HeadCell>Total Question Time Taken</Table.HeadCell>
            <Table.HeadCell>Marks</Table.HeadCell>
            <Table.HeadCell>Winning Amount</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {students.length > 0 ? (
              students.map((student) => (
                <Table.Row key={student.studentId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.studentId || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.studentName || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.rank || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.correctQuestions || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.totalAttemptedQuestions || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.totalQuestionTimeTaken || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.marks || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {student.winningAmount || 'N/A'}
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={8} className="text-center text-gray-600">
                  No student data available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">No contest found</p>
  )}
</div>

  );
};

export default ContestDetails;
