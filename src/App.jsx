import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import Students from './components/Students';
import NewContest from './components/NewContest';
import PreviousContest from './components/PreviousContest';
import EditContest from './components/EditContest';
import PrepareExam from './components/PrepareExam';
import UploadQuestion from './components/UploadQuestion';
import CreateUser from './components/CreateUser';
import NotificationPage from './components/NotificationPage';
import Test from './components/Test';
import Waste from './components/Waste';  // Ensure this path is correct
import ContestDetails from './components/ContestDetails';
import ContestList from './components/ContestList';
import StudentDetails from './components/StudentDetails';
import SubjectList from './components/SubjectList';
import NewAdd from './components/NewAdd';

function App() {
  return (
    <div className='flex'>
       <div className="fixed top-0 left-0 h-full w-64">
        <Navbar />
      </div>
      <div className="ml-60 w-full pl-4 overflow-auto h-screen">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/students' element={<Students />} />
          <Route path='/newcontest' element={<NewContest />} />
          <Route path='/previouscontest' element={<PreviousContest />} />
          <Route path='/contestlist' element={<ContestList />} />
          <Route path='/editcontest' element={<EditContest />} />
          <Route path='/prepareexam' element={<PrepareExam />} />
          <Route path='/uploadquestion' element={<UploadQuestion />} />
          <Route path='/createuser' element={<CreateUser />} />
          <Route path='/notificationpage' element={<NotificationPage />} />
          <Route path='/test' element={<Test />} />
          <Route path='/waste' element={<Waste />} />
          <Route path='/contestdetails' element={<ContestDetails />} />
          <Route path='/studentdetails' element={<StudentDetails />} />
          <Route path='/subjectlist' element={<SubjectList />} />
          <Route path='/newadd' element={<NewAdd />} />
          <Route path="/contest-details/:contestId" element={<ContestDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
