import React, { useState, Dispatch, SetStateAction, useEffect, use } from 'react';
import AdminCreateTaskQueue from '../components/AdminCreateTaskQueue';
import AdminEditUser from '../components/AdminEditUser';
import { FaChevronDown } from 'react-icons/fa';
import UsersTable from '../components/UserTable';
import TaskQueuesTable from '../components/TaskQueues';
import Modal from '@/components/Modal';
import { GetServerSideProps } from 'next';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

const AdminSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [newTable, setNewTable] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [workers, setWorkers] = useState<WorkerInstance[] | null>(null);

  // Grab all workers from the workers api
  useEffect(() => {
    const getWorkers = async () => {
      const res = await fetch('/api/workers?workspaceSid=' + workspaceSid);
      const data = await res.json();
      setWorkers(data.workers);
    };
    getWorkers();
  }
  , []);

  return (
    <div className="min-h-screen bg-gray-100">
      {showModal && (
        <Modal>
          <div className="p-4 bg-white rounded-lg">{modalContent}</div>
        </Modal>
      )}
      <div className="flex justify-between p-4">
        <h2>Admin Dashboard</h2>
        <h2>Welcome Back, Cameron</h2>
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
              className="px-4 py-2 mb-4 text-white bg-purple-600 rounded"
              onClick={() => {
                setModalContent(<AdminEditUser setShowModal={setShowModal} />);
                setShowModal(true);
              }}
            >
              Invite User
            </button>
          )}

        </div>

        {currentTable === 1 ? <UsersTable workers={workers} /> : <TaskQueuesTable/>}
      </div>
    </div>
  );
};

export default AdminSettings;
