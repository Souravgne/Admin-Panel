import React, { useEffect, useState } from 'react';
import { Table } from 'flowbite-react';
import { useFirebase } from '../context/Firebase';
import { Link } from 'react-router-dom';

function PreviousContest() {
  const { getDocument } = useFirebase();
  const [contests, setContests] = useState([]);

  const fetchContests = async () => {
    try {
      const contestList = await getDocument('newcontest');
      // Convert timestamp fields to JavaScript Date objects
      const convertedContests = contestList.map(contest => ({
        ...contest,
        examTime: contest.examTime ? new Date(contest.examTime.seconds * 1000) : null,
        resultTime: contest.resultTime ? new Date(contest.resultTime.seconds * 1000) : null,
        lastEntryTime: contest.lastEntryTime ? new Date(contest.lastEntryTime.seconds * 1000) : null,
      }));
      setContests(convertedContests);
    } catch (error) {
      console.error('Error fetching contests:', error);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className='flex overflow-auto justify-center w-full'>
      <div className="w-full">
        <Table>
          <Table.Head>
            <Table.HeadCell>Contest ID</Table.HeadCell>
            <Table.HeadCell>Contest Name</Table.HeadCell>
            <Table.HeadCell>Entry Fee</Table.HeadCell>
            <Table.HeadCell>Exam Time</Table.HeadCell>
            <Table.HeadCell>Last Entry Time</Table.HeadCell>
            <Table.HeadCell>Result Time</Table.HeadCell>
            <Table.HeadCell>Prize Money Booked</Table.HeadCell>
            <Table.HeadCell>Prize Money Total</Table.HeadCell>
            <Table.HeadCell>Total Spots</Table.HeadCell>
            <Table.HeadCell>Total Questions</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {contests.length > 0 ? (
              contests.map((contest) => (
                console.log("contestId" ,contest.id),
                <Table.Row key={contest.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {contest.contestId || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.contestName || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.entryFee || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.examTime ? contest.examTime.toLocaleString() : 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.lastEntryTime ? contest.lastEntryTime.toLocaleString() : 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.resultTime ? contest.resultTime.toLocaleString() : 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.prizeMoneyBooked || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.prizeMoneyTotal || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.totalSpot || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    {contest.totalQuestions || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                    <Link
                      to={`/contest-details/${contest.id}`} // Adjust the route if needed
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                    >
                      View
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={11} className="text-center">
                  Loading...
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default PreviousContest;
