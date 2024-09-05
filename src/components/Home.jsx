import React, { useEffect, useState } from 'react';
import Cards from './Card';
import { useFirebase } from '../context/Firebase';

function Home() {
  const { getDocumentbyId } = useFirebase();
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [registeredUserCount, setRegisteredUserCount] = useState(0);

  useEffect(() => {
    // Fetch active users data
    const fetchActiveUserCount = async () => {
      const activeUserData = await getDocumentbyId('home', 'activeuser');
      if (activeUserData) {
        setActiveUserCount(activeUserData.count);
      }
    };

    // Fetch registered users data
    const fetchRegisteredUserCount = async () => {
      const registeredUserData = await getDocumentbyId('home', 'registeredUser');
      if (registeredUserData) {
        setRegisteredUserCount(registeredUserData.count);
      }
    };

    fetchActiveUserCount();
    fetchRegisteredUserCount();
  }, [getDocumentbyId]);

  return (
    <div className='dark:bg-gray-800 dark:text-white'>
      <div className='dark:bg-gray-800 dark:text-white p-4 h-screen flex justify-center w-full'>
        <div className='mt-8 flex gap-8'>
          <Cards title='Active Students' count={activeUserCount} />
          <Cards title='TOTAL REGISTERED STUDENT' count={registeredUserCount} />
          <Cards title='BALANCE IN STUDENT WALLET' count={0} />
        </div>
      </div>
    </div>
  );
}

export default Home;
