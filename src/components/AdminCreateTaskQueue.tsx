import React, { useState, Dispatch, SetStateAction } from 'react';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

interface IProps{
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;
}

const AdminCreateTaskQueue = ({ setShowModal, handleDataChange}: IProps) => {
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

    var flag = false
    
    if(workersToAdd.length > 0){
      const getWorkers = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`,{
        method:'GET'
      })
      const workersResponse = await getWorkers.json()
      const workersList = workersResponse.workers
      var parsedWorkersToAdd = workersToAdd.split(', ')

    for(let i= 0; i < parsedWorkersToAdd.length; i++){
      for(let j = 0; j < workersList.length; j++){
        if(parsedWorkersToAdd[i] === workersList[j].friendlyName){
          addWorkerToQueue(workersList[j].sid, workersList[j].attributes)
          break
        }
        if(j === workersList.length-1 ){
          flag = true
        }
      }
    }
    }

    handleDataChange()

    if(flag === true){
      alert("Error adding 1 or more workers provided")
    }

    setShowModal(false);
  };

  async function addWorkerToQueue(sid: string, prevAttributes: string) {

    var attributes = JSON.parse(prevAttributes)

    if(attributes.hasOwnProperty("taskQueues")){
      
      if(attributes.taskQueues.includes(taskQueueName)){
        console.log("worker already belongs to this task Queue")
        return
      }
      attributes.taskQueues.push(taskQueueName)
    }
    else{
      attributes.taskQueues = [taskQueueName]
    }

    attributes = JSON.stringify(attributes)

    const editWorkerRequest = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${sid}`,{
      method: 'PUT',
      body: JSON.stringify({
        'attributes': `${attributes}`,
      })
    })
    if(editWorkerRequest.status !== 200) {
      alert("Error changing worker info")
      return
    }
  }

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
