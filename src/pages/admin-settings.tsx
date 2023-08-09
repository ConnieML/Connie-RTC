import React, { useState, useEffect } from 'react';
import AdminCreateUser from '../components/AdminCreateUser';
import UsersTable from '../components/UserTable';
import TaskQueuesTable from '../components/TaskQueues';
import Modal from '@/components/Modal';

const AdminSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const getOktaUsers = async () => {
      const res = await fetch('/api/okta-users');
      const data = await res.json();
      setUsers(data.oktaUsers
        .map((user: any) => {
          return {
            id: user.id,
            sid: user.profile.employeeNumber,
            name: user.profile.firstName + ' ' + user.profile.lastName,
            email: user.profile.login,
            role: user.profile.userType,
            status: user.status
          }
        })
      );
    }
    getOktaUsers();
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
                setModalContent(<AdminCreateUser setShowModal={setShowModal} />);
                setShowModal(true);
              }}
            >
              Invite User
            </button>
          )}

        </div>

        {currentTable === 1 ? <UsersTable users={users} /> : <TaskQueuesTable/>}
      </div>
    </div>
  );
};

export default AdminSettings;
