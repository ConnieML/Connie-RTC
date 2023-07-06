import React, { useState } from 'react';
import { data } from '../data/data';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import AdminEditUser from './AdminEditUser';

const UsersTable = () => {
  const [displaySkills, setDisplaySkills] = useState<number | undefined>(undefined);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);

  const handleMoreClick = (id: number) => {
    if (displaySkills === id) {
      setDisplaySkills(undefined);
    } else {
      setDisplaySkills(id);
    }
  };

  return (
    <>
      {showModal && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded-lg'>{modalContent}</div>
        </div>
      )}
      <div className='w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto'>
        <div className='my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer'>
          <span>Name</span>
          <span className='sm:text-left text-right'>Email</span>
          <span className='hidden md:grid'>Skills</span>
          <span className='hidden sm:grid'>Status</span>
        </div>
        <ul>
          {data.map((order, id) => (
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
              <p className='text-gray-600 sm:text-left text-right'>{order.name.first}@gmail.com</p>
              <div className='flex flex-wrap'>
                {order.skills
                  .split(', ')
                  .slice(0, displaySkills === order.id ? undefined : 3)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className='bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
                    >
                      {skill}
                    </span>
                  ))}
                {order.skills.split(', ').length > 3 && (
                  <span
                    className='text-sm text-gray-700 cursor-pointer'
                    onClick={() => handleMoreClick(order.id)}
                  >
                    {displaySkills === order.id ? 'Less' : '...More'}
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
    </>
  );
};

export default UsersTable;
