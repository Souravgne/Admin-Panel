import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/Firebase';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
  const firebase = useFirebase();
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Fetch users from Firestore when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await firebase.getDocument('users');
      setUsers(usersData);
    };
    fetchUsers();
  }, [firebase]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await firebase.signupUserWithEmailAndPassword(newUsername, newPassword);
      const newUser = {
        id: userCredential.user.uid,
        email: newUsername,
        name: newName,
        role: newRole,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString() , 
        phone : "",


      };
      // Store user details in Firestore
      await firebase.writeNewContest('users', newUser, userCredential.user.uid);
      setUsers([...users, newUser]);
      setNewUsername('');
      setNewPassword('');
      setNewName('');
      setNewRole('');
      toast.success('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user.');
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      await firebase.updateDocument('users', editUser.id, {
        name: editUser.name,
        role: editUser.role,
      });
      setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
      setIsModalOpen(false);
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await firebase.deleteDocument('users', userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-4 dark:bg-gray-800 dark:text-white">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Create User</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200  ">Username</label>
            <input
              type="email"
              placeholder='name@gmail.com'
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              required
              className="mt-1 block w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="mt-1 block w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
              className="mt-1 block w-full p-1 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="" disabled>Select a role</option>
              <option value="admin">Admin</option>
              <option value="typist">Typist</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 text-sm rounded-md hover:bg-blue-600"
          >
            Create User
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y dark:bg-gray-800 dark:text-white divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">
              <button
  onClick={() => handleEdit(user)}
  className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
>
  Edit
</button>

<button
  onClick={() => handleDelete(user.id)}
  className="bg-red-600 text-white hover:bg-red-700 hover:text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out ml-4"
>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          overlayClassName="fixed inset-0"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
              <input
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="admin">Admin</option>
                <option value="typist">Typist</option>
              </select>
            </div>
            <button
              onClick={handleUpdateUser}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateUser;
