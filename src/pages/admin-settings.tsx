import React, { useState } from 'react';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import { data, taskQueuesData } from '../data/data';

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

const Users = () => {
  const [displaySkills, setDisplaySkills] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);


const handleMoreClick = (id: number) => {
    if (displaySkills === id) {
      setDisplaySkills(undefined);
    } else {
      setDisplaySkills(id);
    }
  };
  

  return (
    <div className='bg-gray-100 min-h-screen'>
      {showModal && (
      <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-4 rounded-lg'>
          {modalContent}
          </div>
          </div>
          )}
      <div className='flex justify-between p-4'>
        <h2>Admin Dashboard</h2>
        <h2>Welcome Back, Nhi</h2>
      </div>
      <div className='p-4'>
  <div className='flex justify-between mb-4'>
    <div>
      <button
        className={`py-2 px-4 rounded ${
          currentTable === 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-purple-800'
        }`}
        onClick={() => setCurrentTable(1)}
      >
        Users
      </button>
      <button
        className={`py-2 px-4 rounded ml-2 ${
          currentTable === 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-purple-800'
        }`}
        onClick={() => setCurrentTable(3)}
      >
        Task Queues
      </button>
    </div>
    {currentTable === 3 && (
      <button
        className='bg-purple-600 text-white py-2 px-4 rounded mb-4'
        onClick={() => {
          setModalContent(<AdminEditTask setShowModal={setShowModal} />);
          setShowModal(true);
        }}
      >
        Create New Task Queue
      </button>
    )}
  </div>
        {currentTable === 3 && (
             <div className='flex justify-end mb-4'>
             <div className='relative'>
               <button
                 className='border border-gray-400 rounded px-4 mr-2 relative'
                 onClick={() => setShowSortOptions(!showSortOptions)}
                 style={{ height: '30px', paddingTop: '4px', paddingBottom: '4px' }}
               >
                  ▼Sort
                 <div
                   className={`absolute top-full left-0 bg-white border border-gray-400 rounded-lg p-2 ${
                     showSortOptions ? '' : 'hidden'
                   }`}
                 >
                   <button className='w-full text-left py-1 px-2 hover:bg-gray-200'>
                     Sort by Task Name
                   </button>
                   <button className='w-full text-left py-1 px-2 hover:bg-gray-200'>
                     Sort by SID
                   </button>
                 </div>
               </button>
             </div>
             <input
               type='text'
               placeholder='Type to search'
               className='border border-gray-400 rounded w-full p-2 mr-2'
               style={{ height: '30px' }}
             />
             <span style={{ fontSize: '24px' }}>🔍</span>
           </div>                 
        )}

        {currentTable === 3 ? (
          <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
            <div className='my-3 p-2 grid grid-cols-2 items-center justify-between cursor-pointer'>
              <span>Task Name/SID</span>
              <span className='text-right'>Assigned Users</span>
            </div>
            <ul>
                {taskQueuesData.map((task, id) => (
                    <li
                    key={id}
                    className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 items-center justify-between cursor-pointer'
                    >
                    <div className='flex justify-between'>
                        <div>
                        <p>{task.taskName}</p>
                        <p style={{ color: 'gray', fontSize: '0.8em' }}>SID: {task.sid}</p>
                        </div>
                        <div className='flex justify-end'>
                        {task.assignedUsers.map((user, index) => (
                            <img
                            key={index}
                            className='w-8 h-8 rounded-full ml-2'
                            src={user.imageUrl}
                            alt={user.name}
                            />
                        ))}
                        <BsThreeDotsVertical
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
        ) : (
          <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
            <div className='my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'>
              <span>Name</span>
              <span className='sm:text-left text-right'>Email</span>
              <span className='hidden md:grid'>Skills</span>
              <span className='hidden sm:grid'>Status</span>
            </div>
            <ul>
              {data
                .filter((order) => order.table === currentTable)
                .map((order, id) => (
                  <li
                    key={id}
                    className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'
                  >
                    <div className='flex items-center'>
                      <div className='bg-purple-100 p-3 rounded-lg'>
                        <BsPersonFill className='text-purple-800' />
                      </div>
                      <div className='pl-4'>
                        <p>{order.name.first + ' ' + order.name.last}</p>
                        <p style={{ color: 'gray', fontSize: '0.8em' }}>Role: {order.role}</p>
                        <p style={{ color: 'gray', fontSize: '0.8em' }}>
                          Level of Access: {order.levelOfAccess}
                        </p>
                      </div>
                    </div>
                    <p className='text-gray-600 sm:text-left text-right'>
                      {order.name.first}@gmail.com
                    </p>
                    <div className='flex flex-wrap'>
                      {order.skills.split(', ').slice(0, displaySkills === order.id ? undefined : 3).map((skill, index) => (
                        <span
                          key={index}
                          className='bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
                        >
                          {skill}
                        </span>
                      ))}
                      {order.skills.split(", ").length > 3 && (
                        <span
                            className="text-sm text-gray-700 cursor-pointer"
                            onClick={() => handleMoreClick(order.id)}
                        >
                            {displaySkills === order.id ? "Less" : "...More"}
                        </span>
                        )}

                    </div>
                    <div className='sm:flex hidden justify-between items-center'>
                      <span className='bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-800 mr-2 mb-2'>
                        {order.status}
                      </span>
                      <BsThreeDotsVertical
                      onClick={() => {
                        setModalContent(<AdminEditUser setShowModal={setShowModal} />);
                        setShowModal(true);
                      }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users; 