import React, { useState } from 'react';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import AdminUserModal from './AdminUserModal';
import Modal from './Modal';

const UsersTable = ({
  users,
  setUsers,
}: {
  users: any[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <Modal>
          <div className="p-4 bg-white rounded-lg">{modalContent}</div>
        </Modal>
      )}
      <div className="w-full p-4 m-auto overflow-y-auto bg-white border rounded-lg">
        <div className="grid items-center justify-between grid-cols-2 p-2 my-3 cursor-pointer md:grid-cols-4 sm:grid-cols-3">
          <span>Name</span>
          <span className="text-right sm:text-left">Email</span>
          <span className="hidden md:grid">Skills</span>
          <span className="hidden sm:grid">Status</span>
        </div>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="grid items-center justify-between grid-cols-2 p-2 my-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 md:grid-cols-4 sm:grid-cols-3"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BsPersonFill className="text-purple-800" />
                </div>
                <div className="pl-4">
                  {user.firstName + ' ' + user.lastName}
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    Role: {user.role}
                  </p>
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    Level of Access:
                  </p>
                </div>
              </div>
              <div>
                <p className="text-right text-gray-600 sm:text-left">
                  {user.email}
                </p>
                <p style={{ color: 'gray', fontSize: '0.8em' }}>{user.sid}</p>
              </div>
              <div className="flex flex-wrap">
                {/* Placeholder skills */}
                {['Skill A', 'Skill B', 'Skill C'].map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                  >
                    {skill}
                  </div>
                ))}
              </div>
              <div className="items-center justify-between hidden sm:flex">
                <span className="px-3 py-1 mb-2 mr-2 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
                  {user.status}
                </span>
                <BsThreeDotsVertical
                  onClick={() => {
                    setModalContent(
                      <AdminUserModal
                        setShowModal={setShowModal}
                        user={user}
                        setUsers={setUsers}
                        users={users}
                      />
                    );
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
