import React, { useState } from 'react';
import { Data } from '../data/data';
import { BsPersonFill, BsThreeDotsVertical } from 'react-icons/bs';
import AdminEditUser from './AdminEditUser';
import Modal from './Modal';
import { WorkerInstance } from 'twilio/lib/rest/taskrouter/v1/workspace/worker';

const UsersTable = (props: {workers: WorkerInstance[] | null}) => {
  const [displaySkills, setDisplaySkills] = useState<number | undefined>(
    undefined
  );
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);
    
  const { workers } = props;
  const data: Data[] = workers?.map((worker) => {
    return {
      id: worker.sid,
      name: worker.friendlyName,
      table: 1
    }
  }) || [];

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
          {data?.map((worker) => (
            <li
              key={worker.id}
              className="grid items-center justify-between grid-cols-2 p-2 my-3 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 md:grid-cols-4 sm:grid-cols-3"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BsPersonFill className="text-purple-800" />
                </div>
                <div className="pl-4">
                  {worker.name}
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    {worker.id}
                  </p>
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    Role:
                  </p>
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    Level of Access:
                  </p>
                </div>
              </div>
              <p className="text-right text-gray-600 sm:text-left">
                johndoe@email.com
              </p>
              {/* <div className="flex flex-wrap">
                {order.skills
                  .split(', ')
                  .slice(0, displaySkills === order.id ? undefined : 3)
                  .map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                {order.skills.split(', ').length > 3 && (
                  <span
                    className="text-sm text-gray-700 cursor-pointer"
                    onClick={() => handleMoreClick(order.id)}
                  >
                    {displaySkills === order.id ? 'Less' : '...More'}
                  </span>
                )}
              </div> */}
              <div className="items-center justify-between hidden sm:flex">
                <span className="px-3 py-1 mb-2 mr-2 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
                  User Invited
                </span>
                <BsThreeDotsVertical
                  onClick={() => {
                    setModalContent(
                      <AdminEditUser setShowModal={setShowModal} />
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
