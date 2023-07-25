import React, { useState } from 'react';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string


const AdminCreateTaskQueue = ({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [taskQueueName, setTaskQueueName] = useState('');
  const [workersToAdd, setWorkersToAdd] = useState('');

  async function handleCreateTask(){
    const createResponse = await fetch(`/api/taskQueues?workspaceSid=${workspaceSid}`,{
      method: 'POST',
      body: JSON.stringify({
        "friendlyName": `${taskQueueName}`,
        "targetWorkers": `taskQueues HAS "${taskQueueName}"`,
      })
    })

    if (createResponse.status !== 200){
      alert("Error creating task queue")
      return
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create a New Task</h2>
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
        Add Workers (Names separated by commas)        
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={workersToAdd}
          placeholder={"John Doe, Jane Smith, etc."}
          onChange={(e) => setWorkersToAdd(e.target.value)}
        />
      </label>
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
        onClick={handleCreateTask}
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

export default AdminCreateTaskQueue;
