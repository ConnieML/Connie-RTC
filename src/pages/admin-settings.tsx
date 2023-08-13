import React, { useState, useEffect } from 'react';
import AdminUserModal from '../components/AdminUserModal';
import UsersTable from '../components/UserTable';
import TaskQueuesTable from '../components/TaskQueues';
import Modal from '@/components/Modal';
import Navbar from '@/components/Navbar';
import { Activity } from '@/lib/taskrouterInterfaces';
import { Worker } from 'twilio-taskrouter';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const AdminSettings = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentTable, setCurrentTable] = useState(1);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [users, setUsers] = useState<any[]>([]);

  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSetAllWorkersOffline = async () => {
    try {
      // Get all workers

      const workers = await fetch(
        `/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`,
        {
          method: 'GET',
        }
      )
        .then(async (data) => await data.json())
        .then((data) => data.workers);
      console.log(workers);

      // Get all activities
      const activities = await fetch(
        `/api/activities/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`
      )
        .then(async (data) => await data.json())
        .then((data) => data.activities);
      console.log(activities);

      const offlineActivity: Activity = activities.find(
        (activity: Activity) => (activity.friendlyName = 'Offline')
      );

      // Loop through each worker & set activity to "Offline"
      workers.forEach(async (worker: Worker) => {
        await fetch(
          `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker?.sid}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              activitySid: offlineActivity.sid,
            }),
          }
        );
      });
      alert('All workers have been set offline');
    } catch (e) {
      console.error(e);
      alert(
        'Failed to set all workers offline. This could occur because a worker is currently performing a task'
      );
    }
  };

  useEffect(() => {
    const getOktaUsers = async () => {
      const res = await fetch('/api/okta-users');
      const data = await res.json();
      setUsers(
        data.oktaUsers.map((user: any) => {
          return {
            id: user.id,
            sid: user.profile.employeeNumber,
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            email: user.profile.login,
            role: user.profile.userType,
            status: user.status,
          };
        })
      );
    };
    getOktaUsers();
  }, []);

  useEffect(() => {
    if (status !== 'loading') {
      if (status === 'unauthenticated') {
        router.push('/');
      }
    }
  }, [status, router]);

  // basic auth logic
  if (status !== 'authenticated') {
    return <React.Fragment>Loading...</React.Fragment>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showModal && (
        <Modal>
          <div className="p-4 bg-white rounded-lg">{modalContent}</div>
        </Modal>
      )}
      <Navbar />
      <div className="flex justify-between p-4">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
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
            <div className="flex flex-row gap-x-4">
              <button
                onClick={handleSetAllWorkersOffline}
                className="px-4 py-2 mb-4 text-white bg-purple-600 rounded"
              >
                Set all workers offline
              </button>
              <button
                className="px-4 py-2 mb-4 text-white bg-purple-600 rounded"
                onClick={() => {
                  setModalContent(
                    <AdminUserModal
                      setShowModal={setShowModal}
                      setUsers={setUsers}
                      users={users}
                    />
                  );
                  setShowModal(true);
                }}
              >
                Invite User
              </button>
            </div>
          )}
        </div>

        {currentTable === 1 ? (
          <UsersTable users={users} setUsers={setUsers} />
        ) : (
          <TaskQueuesTable />
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
