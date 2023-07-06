import React, { useState } from 'react';
import { taskQueuesData } from '../data/data';
import { BsThreeDots } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import AdminEditTask from './AdminEditTask';

const TaskQueuesTable = () => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded-lg'>{modalContent}</div>
        </div>
      )}
      <div className='flex justify-end mb-4'>
        <div className='relative'>
          <button
            className='border border-gray-400 rounded px-4 mr-2 relative'
            onClick={() => setShowSortOptions(!showSortOptions)}
            style={{ height: '30px', width: '80px', paddingTop: '4px', paddingBottom: '4px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Sort
              <FaChevronDown />
            </div>
            <div
              className={`absolute top-full left-0 bg-white border border-gray-400 rounded-lg p-2 ${
                showSortOptions ? '' : 'hidden'
              }`}
            >
              <button className='w-full text-left py-1 px-2 hover:bg-gray-200'>Sort by Task Name</button>
              <button className='w-full text-left py-1 px-2 hover:bg-gray-200'>Sort by SID</button>
            </div>
          </button>
        </div>
        <div className='relative'>
          <input
            type='text'
            placeholder='Type to search'
            className='border border-gray-400 rounded w-full p-2 mr-2 pl-8'
            style={{ height: '30px' }}
          />
          <span style={{ fontSize: '24px', position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
            🔍
          </span>
        </div>
      </div>

      <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
        <div className='my-3 p-2 grid grid-cols-3 items-center justify-between cursor-pointer'>
          <span>Task Name/SID</span>
          <span className='text-center'>Assigned Users</span>
          <span></span>
        </div>
        <ul>
          {taskQueuesData.map((task, id) => (
            <li
              key={id}
              className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 items-center justify-between cursor-pointer'
            >
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <p>{task.taskName}</p>
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>SID: {task.sid}</p>
                </div>
                <div className='flex justify-center text-center'>
                  {task.assignedUsers.map((user, index) => (
                    <img
                      key={index}
                      className='w-8 h-8 rounded-full ml-2'
                      src={user.imageUrl}
                      alt={user.name}
                    />
                  ))}
                </div>
                <div className='flex justify-end'>
                  <BsThreeDots
                    onClick={() => {
                      setModalContent(<AdminEditTask setShowModal={setShowModal} />);
                      setShowModal(true);
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TaskQueuesTable;
