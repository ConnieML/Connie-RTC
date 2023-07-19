import React, { useState } from 'react';
import AdminCreateTaskQueue from '../components/AdminCreateTaskQueue';
import AdminEditUser from '../components/AdminEditUser';
import { FaChevronDown } from 'react-icons/fa';
import UsersTable from '../components/UserTable';
import TaskQueuesTable from '../components/TaskQueues';
import Modal from '@/components/Modal';

const AdminSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      {showModal && (
        <Modal>
          <div className="bg-white p-4 rounded-lg">{modalContent}</div>
        </Modal>
      )}
      <div className="flex justify-between p-4">
        <h2>Admin Dashboard</h2>
        <h2>Welcome Back, Nhi</h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <button
              className={`py-2 px-4 rounded ml-2 ${
                currentTable === 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-purple-800'
              }`}
              onClick={() => setCurrentTable(1)}
            >
              Users
            </button>
            <button
              className={`py-2 px-4 rounded ml-2 ${
                currentTable === 3
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-purple-800'
              }`}
              onClick={() => setCurrentTable(3)}
            >
              Task Queues
            </button>
          </div>
          {currentTable === 1 && (
            <button
              className="bg-purple-600 text-white py-2 px-4 rounded mb-4"
              onClick={() => {
                setModalContent(<AdminEditUser setShowModal={setShowModal} />);
                setShowModal(true);
              }}
            >
              Invite User
            </button>
          )}
          {currentTable === 3 && (
            <button
              className="bg-purple-600 text-white py-2 px-4 rounded mb-4"
              onClick={() => {
                setModalContent(<AdminCreateTaskQueue setShowModal={setShowModal} />);
                setShowModal(true);
              }}
            >
              Create New Task Queue
            </button>
          )}
        </div>

        {currentTable === 1 ? <UsersTable /> : <TaskQueuesTable />}
      </div>
    </div>
  );
};

export default AdminSettings;
