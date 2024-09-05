import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from 'react-icons/hi';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';

const sidebarItems = [
  { path: '/', label: 'Home', icon: HiChartPie },
  { path: 'students', label: 'Student Details', icon: HiInbox },
  {
    label: 'Contest', icon: HiShoppingBag, subItems: [
      { path: '/newcontest', label: 'New Contest' },
      // { path: '/previouscontest', label: 'Previous Contest' },
      { path: '/contestlist', label: 'Contest List' },
      { path: '/editcontest', label: 'Edit Contest' }
    ]
  },
  { path: '/prepareexam', label: 'Prepare Exam', icon: HiUser },
  { path: '/uploadquestion', label: 'Question Upload', icon: HiShoppingBag },
  { path: '/createuser', label: 'Create User', icon: HiArrowSmRight },
  { path: '/notificationpage', label: 'Notification', icon: HiTable },
  // { path: '/waste', label: 'Waste', icon: HiTable },
  // { path: '/contestdetails', label: 'ContestDetails', icon: HiTable },
  // { path: '/subjectlist', label: 'SubjectList', icon: HiTable },
  // { path: '/newadd', label: 'Newadd', icon: HiTable },
  // { path: '/studentdetails', label: 'StudentDetails', icon: HiTable },
];

function Navbar() {
  const { signOutUser } = useFirebase();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    console.log("signOut success");
    navigate('/');
  };

  return (
    <div className="h-screen">
      <Sidebar aria-label="Sidebar with multi-level dropdown example" className="h-full">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            {sidebarItems.map((item, index) => item.subItems ? (
              <Sidebar.Collapse key={index} icon={item.icon} label={item.label}>
                {item.subItems.map((subItem, subIndex) => (
                  <Sidebar.Item key={`${index}-${subIndex}`} as="div">
                    <NavLink 
                      className={({ isActive }) => 
                        isActive ? "text-blue-600" : ""
                      } 
                      to={subItem.path}>
                      {subItem.label}
                    </NavLink>
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            ) : (
              <Sidebar.Item key={index} as="div" icon={item.icon}>
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "text-blue-600" : ""
                  } 
                  to={item.path}>
                  {item.label}
                </NavLink>
              </Sidebar.Item>
            ))}
            <Sidebar.Item as="div" icon={HiTable}>
              <button onClick={handleSignOut} className="text-left w-full">
                Sign Out
              </button>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default Navbar;
