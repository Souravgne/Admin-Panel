import React from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function StudentDetails() {
  const location = useLocation();
  const { user } = location.state || {}; // Access the user object
  console.log(user)
  const printPDF = () => {
    const input = document.getElementById('student-details');

    html2canvas(input, { scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('student-details.pdf');
    });
  };

  if (!user) {
    return <div className="p-4 text-red-600 dark:text-red-400">No user details available.</div>;
  }

  return (
    <div className='dark:bg-gray-800 w-[100%] min-h-screen dark:text-white'>  
      <div className="p-6 max-w-full mx-auto  bg-gray-200 dark:bg-gray-800 dark:text-white rounded-lg shadow-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={printPDF}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Print as PDF
          </button>
        </div>
        <div id="student-details">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Student Details</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
  {[
    { label: 'Register Date & Time:', value: user.registrationdate ? new Date(user.registrationdate.seconds * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A' },
    { label: 'Student Id:', value: user.uid },
    { label: 'Name:', value: user.name },
    { label: 'Profile:', value: user.profile },
    { label: 'Mobile no.:', value: user.phone },
    { label: 'Email:', value: user.email },
    { label: 'Refer Code:', value: user.referralcode },
    { label: 'Aadhar No.:', value: user.aadharno },
    { label: 'Pan No.:', value: user.panno },
    { label: 'Wallet Balance:', value: user.walletbalance },
  ].map((item) => (
    <div key={item.label} className="flex flex-col dark:bg-gray-800 dark:text-white">
      <label className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</label>
      <input
        type="text"
        value={item.value || 'N/A'}
        disabled
        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
      />
    </div>
  ))}
</div>


          {/* Render attendContest as a table */}
          <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">Attended Contest</h2>
          <div className="overflow-x-auto">
  <table className="min-w-full bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-600">
    <thead>
      <tr>
        { user.attendContest && [
          "DATE & TIME OF CONTEST",
          "CONTEST ID",
          "RANK",
          "CORRECT QUESTION",
          "TOTAL ATTEMPT QUESTION",
          "TOTAL QUESTION",
          "TIME TAKEN",
          "MARKS",
          "WINNING AMOUNT",
          "WALLET BAL."
        ].map((header) => (
          <th key={header} className="px-4 py-2 border-b dark:border-gray-600">
            {header}
          </th>
        ))}
      </tr>
    </thead>
   {user.attendContest && <tbody>
      <tr>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.dateTimeOfContest || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.contestId || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.rank || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.correctquestions || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.totalAttemptQuestions || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.totalQuestion || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.timetaken || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.marks || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.winningAmount || "N/A"}
        </td>
        <td className="px-4 py-2 border-b dark:border-gray-600">
          {user.attendContest?.walletbalance || "N/A"}
        </td>
      </tr>
    </tbody> }
  </table>
</div>


        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
