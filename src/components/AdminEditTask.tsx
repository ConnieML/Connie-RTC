import React, { useState } from 'react';
const AdminEditTask = ({ setShowModal }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [taskName, setTaskName] = useState('');
    const [assignedUsers, setAssignedUsers] = useState('');
  
    const handleUpdateTask = () => {
      // Update task information in the database
      setShowModal(false);
    };
  
    const handleCancel = () => {
      setShowModal(false);
    };
  
    return (
      <div>
        <h2 className='text-2xl font-bold mb-4'>Create a New Task</h2>
        <label className='block mb-2'>
          Task Name:
          <input
            className='border border-gray-400 rounded w-full p-2'
            type='text'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </label>
        <label className='block mb-4'>
          Assigned Users:
          <input
            className='border border-gray-400 rounded w-full p-2'
            type='text'
            value={assignedUsers}
            onChange={(e) => setAssignedUsers(e.target.value)}
          />
        </label>
        <button
          className='bg-purple-600 text-white py-2 px-4 rounded mr-2'
          onClick={handleUpdateTask}
        >
          Update Task
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

  export default AdminEditTask;
