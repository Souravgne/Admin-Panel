import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, TextInput, Label } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';

function Students() {
  const { getDocument, updateDocument } = useFirebase();
  const [users, setUsers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      let usersList = await getDocument('users');
  
      // Convert date and time to a Date object for comparison
      usersList = usersList.map((user) => ({
        ...user,
        registrationDateTime: new Date(`${user.date} ${user.time}`),
      }));
  
      // Sort users by registration date and time
      usersList.sort((a, b) => b.registrationDateTime - a.registrationDateTime);
  
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewClick = (user) => {
    navigate('/studentdetails', { state: { user } });
  };

  const handleBlockUser = async (userId, currentBlockedStatus) => {
    try {
      const newBlockedStatus = !currentBlockedStatus;
      await updateDocument('users', userId, { blocked: newBlockedStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, blocked: newBlockedStatus } : user
        )
      );
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setUpdatedUserDetails(user);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateDocument('users', currentUser.id, updatedUserDetails);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUser.id ? { ...updatedUserDetails } : user
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <div className='flex overflow-auto  dark:bg-gray-800 dark:text-white h-screen justify-center w-full'>
      <div className="w-full">
        <Table>
          <Table.Head>
            <Table.HeadCell>Register Date</Table.HeadCell>
            <Table.HeadCell>Register Time</Table.HeadCell>
            <Table.HeadCell>Student Id</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Profile</Table.HeadCell>
            <Table.HeadCell>Mobile no.</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Refer Code</Table.HeadCell>
            <Table.HeadCell>Aadhar No.</Table.HeadCell>
            <Table.HeadCell>Pan No.</Table.HeadCell>
            <Table.HeadCell>Wallet Balance</Table.HeadCell>
            <Table.HeadCell>Edit Details</Table.HeadCell>
            <Table.HeadCell>View</Table.HeadCell>
            <Table.HeadCell>Block User</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.length > 0 ? (
              users.map((user) => (
                <Table.Row key={user.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.date || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.time || 'N/A'}
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.uid || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.name || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.profile || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.phone || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.email || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.referralcode || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.aadharno || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.panno || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">{user.walletbalance || 'N/A'}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                  <button
  onClick={() => handleEditClick(user)}
  className="bg-cyan-600 text-white hover:bg-cyan-700 hover:underline font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-cyan-500 dark:hover:bg-cyan-400"
>
  Edit
</button>

                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                  <button
  onClick={() => handleViewClick(user)}
  className="bg-cyan-600 text-white hover:bg-cyan-700 hover:underline font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-cyan-500 dark:hover:bg-cyan-400"
>
  View
</button>

                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                  <button
  onClick={() => handleBlockUser(user.id, user.blocked)}
  className="bg-red-600 text-white hover:bg-red-700 hover:underline font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out dark:bg-red-500 dark:hover:bg-red-400"
>
  {user.blocked ? 'Unblock User' : 'Block User'}
</button>

                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={13} className="text-center">
                  Loading...
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Edit User Modal */}
      {editModalOpen && (
        <Modal show={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Modal.Header>Edit User Details</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  name="name"
                  type="text"
                  value={updatedUserDetails.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput
                  id="phone"
                  name="phone"
                  type="text"
                  value={updatedUserDetails.phone || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={updatedUserDetails.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Add more input fields as needed */}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit}>Submit</Button>
            <Button onClick={() => setEditModalOpen(false)} color="gray">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Students;
