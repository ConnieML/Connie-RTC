import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import AdminModifyTaskQueue from './AdminModifyTaskQueue';
import Modal from './Modal';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

interface IProps{
  sid: number,
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const TaskQueuesTable = () => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskQueuesData, setTaskQueuesData] = useState([]);

  // for right now just grab task queues
  async function getTaskQueues (){
    const taskQueuesRequest = await fetch(`/api/taskQueues?workspaceSid=${workspaceSid}`,{
      method: 'GET',
    })
    const taskQueuesResponse = await taskQueuesRequest.json()
    setTaskQueuesData(taskQueuesResponse.taskQueues)
  }

  const handleModifyTask = (taskQueueSid: number) => {
    var props:IProps = {
      sid: taskQueueSid,
      setShowModal: setShowModal,
    }
    
    setModalContent(
      <AdminModifyTaskQueue {...props} />
    );
    setShowModal(true);
  }

  useEffect(() =>  {
    getTaskQueues()

    return
  }, []);



  return (
    <>
      {showModal && (
        <Modal>
          <div className="bg-white p-4 rounded-lg">{modalContent}</div>
        </Modal>
      )}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button
            className="border border-gray-400 rounded px-4 mr-2 relative"
            onClick={() => setShowSortOptions(!showSortOptions)}
            style={{
              height: '30px',
              width: '80px',
              paddingTop: '4px',
              paddingBottom: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Sort
              <FaChevronDown />
            </div>
            <div
              className={`absolute top-full left-0 bg-white border border-gray-400 rounded-lg p-2 ${
                showSortOptions ? '' : 'hidden'
              }`}
            >
              <button className="w-full text-left py-1 px-2 hover:bg-gray-200">
                Sort by Task Name
              </button>
              <button className="w-full text-left py-1 px-2 hover:bg-gray-200">
                Sort by SID
              </button>
            </div>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Type to search"
            className="border border-gray-400 rounded w-full p-2 mr-2 pl-8"
            style={{ height: '30px' }}
          />
          <span
            style={{
              fontSize: '24px',
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            🔍
          </span>
        </div>
      </div>

      <div className="w-full m-auto p-4 border rounded-lg bg-white overflow-y-auto">
        <div className="my-3 p-2 grid grid-cols-3 items-center justify-between cursor-pointer">
          <span>Task Name/SID</span>
          <span className="text-center">Target Workers Clause</span>
          <span></span>
        </div>
        <ul>
          {taskQueuesData.map((taskQueue:{friendlyName: string, sid: number, targetWorkers: string}) => (
            <li
              key={taskQueue.friendlyName}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 items-center justify-between cursor-pointer"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p>{taskQueue.friendlyName}</p>
                  <p style={{ color: 'gray', fontSize: '0.8em' }}>
                    SID: {taskQueue.sid}
                  </p>
                </div>
                <div className="flex justify-center text-center">
                  <p>{taskQueue.targetWorkers}</p>
                </div>
                <div className="flex justify-end">
                  <BsThreeDots
                    onClick={() => {
                      handleModifyTask(taskQueue.sid)
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
