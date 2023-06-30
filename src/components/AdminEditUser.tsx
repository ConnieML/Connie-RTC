import React, { useState } from 'react';
const AdminEditUser = ({ setShowModal }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
  
    const handleUpdateUser = () => {
      // Update user information in the database
      setShowModal(false);
    };
  
    const handleCancel = () => {
      setShowModal(false);
    };
  
    return (
      <div>
        <h2 className='text-2xl font-bold mb-4'>Create a New User</h2>
        <label className='block mb-2'>
          User Name:
          <input
            className='border border-gray-400 rounded w-full p-2'
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label className='block mb-2'>
          Role:
          <input
            className='border border-gray-400 rounded w-full p-2'
            type='text'
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          />
        </label>
        <label className='block mb-4'>
          Email Address:
          <input
            className='border border-gray-400 rounded w-full p-2'
            type='email'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </label>
        <button
          className='bg-purple-600 text-white py-2 px-4 rounded mr-2'
          onClick={handleUpdateUser}
        >
          Update User
        </button>
        <button
          className='bg-gray-200 text-red-600 py-2 px-4 rounded'
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    );
  };

  export default AdminEditUser;
