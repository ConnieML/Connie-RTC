import React, { useState } from 'react';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import { data } from '../data/data.js';

type ModalProps = {
  closeModal: () => void;
  children: React.ReactNode;
};

const Modal = ({ closeModal, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-200 text-red-600 py-2 px-4 rounded"
            onClick={closeModal}
          >
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminEditUser =  ({ closeModal }: { closeModal: () => void }) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleUpdateUser = () => {
    // Update user information in the database
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <label className="block mb-2">
        User Name:
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </label>
      <label className="block mb-2">
        Role:
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        />
      </label>
      <label className="block mb-4">
        Email Address:
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </label>
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
        onClick={handleUpdateUser}
      >
        Update User
      </button>
      <button
        className="bg-gray-200 text-red-600 py-2 px-4 rounded"
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

  const handleMoreClick = (id: number) => {
    setDisplaySkills(id);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && (
        <Modal closeModal={closeModal}>
          {modalContent}
        </Modal>
      )}
      <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
        <div className="my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer">
          <span>Name</span>
          <span className="sm:text-left text-right">Email</span>
          <span className="hidden md:grid">Skills</span>
          <span className="hidden sm:grid">Status</span>
        </div>
        <ul>
          {data
            .filter((order) => order.table === currentTable)
            .map((order, id) => (
              <li
                key={id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BsPersonFill className="text-purple-800" />
                  </div>
                  <div className="pl-4">
                    <p>{order.name.first + ' ' + order.name.last}</p>
                    <p style={{ color: 'gray', fontSize: '0.8em' }}>Role: {order.role}</p>
                    <p style={{ color: 'gray', fontSize: '0.8em' }}>
                      Level of Access: {order.levelOfAccess}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 sm:text-left text-right">
                  {order.name.first}@gmail.com
                </p>
                <div className="flex flex-wrap">
                  {order.skills.split(', ').slice(0, displaySkills === order.id ? undefined : 3).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      {skill}
                    </span>
                  ))}
                  {order.skills.split(', ').length > 3 && (
                    <span
                      className="text-sm text-gray-700 cursor-pointer"
                      onClick={() => handleMoreClick(order.id)}
                    >
                      ...More
                    </span>
                  )}
                </div>
                <div className="sm:flex hidden justify-between items-center">
                  <span className="bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-800 mr-2 mb-2">
                    {order.status}
                  </span>
                  <BsThreeDotsVertical
                    onClick={() => {
                      setModalContent(<AdminEditUser closeModal={closeModal} />);
                      openModal();
                    }}
                  />
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
