import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { FaChevronDown } from 'react-icons/fa';
import AdminCreateTaskQueue from './AdminCreateTaskQueue';
import AdminModifyTaskQueue from './AdminModifyTaskQueue';
import Modal from './Modal';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

interface ModifyTaskProps{
  sid: number,
  taskQueueName: string
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;
}

interface CreateTaskProps{
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;
}

const TaskQueuesTable = () => {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [showModal, setShowModal] = useState(false);
  const [taskQueuesData, setTaskQueuesData] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([[""]]);

  async function getAssignedUsers(taskQueues: [{friendlyName: string}]) {

    const getWorkers = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`,{
      method:'GET'
    })
    const workersResponse = await getWorkers.json()
    const workersList = workersResponse.workers

    var allAssignedUsers = []

    for(let i=0; i < taskQueues.length; i++){

      var curAssignedUsers = []
    
      for(let j=0; j < workersList.length; j++){
        const attributes = JSON.parse(workersList[j].attributes)
        if(attributes.hasOwnProperty("taskQueues")){
          if(attributes.taskQueues.includes(taskQueues[i].friendlyName)){
            curAssignedUsers.push(workersList[j].friendlyName)
          }
        }
      }
      if (curAssignedUsers.length === 0){
        curAssignedUsers.push("No Workers Assigned")
      }
      allAssignedUsers.push(curAssignedUsers)
    }
    setAssignedUsers(allAssignedUsers)
  }

  const handleDataChanges = () => {
    getTaskQueues()
  }

  async function getTaskQueues (){
    const taskQueuesRequest = await fetch(`/api/taskQueues?workspaceSid=${workspaceSid}`,{
      method: 'GET',
    })
    const taskQueuesResponse = await taskQueuesRequest.json()
    setTaskQueuesData(taskQueuesResponse.taskQueues)

    getAssignedUsers(taskQueuesResponse.taskQueues)
  }

  const handleModifyTaskQueue = (taskQueueSid: number, taskQueueName: string) => {
    var props:ModifyTaskProps = {
      sid: taskQueueSid,
      taskQueueName: taskQueueName,
      setShowModal: setShowModal,
      handleDataChange: handleDataChanges
    }
    
    setModalContent(
      <AdminModifyTaskQueue {...props} />
    );
    setShowModal(true);
  }
  
  const handleCreateTaskQueue = () => {

    var props:CreateTaskProps={
      setShowModal: setShowModal,
      handleDataChange: handleDataChanges
    }

    setModalContent(<AdminCreateTaskQueue {...props} />);
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
      <div className="flex mb-4 justify-end">

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
          <span className="text-center">Current Assigned Workers</span>
          <button
          className="bg-purple-600 text-white py-2 px-2 rounded"
          onClick={() => {
            handleCreateTaskQueue()
          }}
          style={{
            }

          }>
            Create New Task Queue
            </button>
        </div>
        <ul>
          {taskQueuesData.map((taskQueue:{friendlyName: string, sid: number, targetWorkers: string}, index) => (
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
                  {index < assignedUsers.length &&
                    <p>{assignedUsers[index].join(', ')}</p>
                  }
                </div>
                <div className="flex justify-end">
                  <BsThreeDots
                    onClick={() => {
                      handleModifyTaskQueue(taskQueue.sid, taskQueue.friendlyName)
                    }}
                  >
                    Edit
                  </BsThreeDots>
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
