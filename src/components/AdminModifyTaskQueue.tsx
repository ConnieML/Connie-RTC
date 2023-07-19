import React, { useState, Dispatch, SetStateAction } from 'react';

interface IProps{
  sid: number,
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const AdminModifyTaskQueue = ( {sid, setShowModal}: IProps)=> {
  const [taskQueueName, setTaskQueueName] = useState('');
  const [targetWorkers, setTargetWorkers] = useState('');
  
  async function handleModifyTask() {

    const modifyResponse = await fetch(`/api/taskQueues?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&taskQueueSid=${sid}`,{
      method:'PUT',
      body: JSON.stringify({
        "friendlyName": `${taskQueueName}`
      })
    })
    if (modifyResponse.status !== 200){
      alert("error changing task queue")
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Queue - ${sid}</h2>
      <label className="block mb-2">
        Task Name:
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={taskQueueName}
          onChange={(e) => setTaskQueueName(e.target.value)}
        />
      </label>
      <label className="block mb-4">
        Taget Workers:
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={targetWorkers}
          onChange={(e) => setTargetWorkers(e.target.value)}
        />
      </label>
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
        onClick={handleModifyTask}
      >
        Create Task
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

export default AdminModifyTaskQueue;
