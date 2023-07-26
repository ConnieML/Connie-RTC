import React, { useState, Dispatch, SetStateAction } from 'react';

interface IProps{
  sid: number,
  taskQueueName: string,
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;

}

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

const AdminModifyTaskQueue = ( {sid, taskQueueName, setShowModal, handleDataChange}: IProps)=> {
  
  const [workersToAdd, setWorkersToAdd] = useState('');
  const [workersToRemove, setWorkersToRemove] = useState('');

  
  async function handleModifyTaskQueue() {

    const getWorkers = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`,{
      method:'GET'
    })
    const workersResponse = await getWorkers.json()
    const workersList = workersResponse.workers

    var parsedWorkersToAdd = workersToAdd.split(', ')
    var parsedWorkersToRemove = workersToRemove.split(', ')

    var addFlag = 0         // Check if add operations were valid
    var removeFlag = 0      // Check if remove operations were valid

    var toAdd = false       // Bool for if we add workers
    var toRemove = false    // Bool for if we remove workers

    if(parsedWorkersToAdd[0] !== ''){ toAdd = true}         
    if(parsedWorkersToRemove[0] !== ''){ toRemove = true}

    if(toAdd){
      for(let i= 0; i < parsedWorkersToAdd.length; i++){
        for(let j = 0; j < workersList.length; j++){
          if(parsedWorkersToAdd[i] === workersList[j].friendlyName){
            addWorkerToQueue(workersList[j].sid, workersList[j].attributes)
            break
          }
          // Worker does not exist - set add flag
          else if(j === workersList.length-1){
            addFlag = addFlag - 1
          }
        }
      }
    }

    if(toRemove){
      for(let i= 0; i < parsedWorkersToRemove.length; i++){
        for(let j = 0; j < workersList.length; j++){
          if(parsedWorkersToRemove[i] === workersList[j].friendlyName){
            removeFlag = removeFlag + await removeWorkerFromQueue(workersList[j].sid, workersList[j].attributes)
            break
          }
          // Worker does not exist - set remove flag
          else if(j === workersList.length-1){
            removeFlag = removeFlag - 1
          }
        }
      }
    }

    var errMsg = ''

    if(toAdd){
      if(addFlag === 0){
        errMsg = errMsg.concat(`All specified workers added successfully\n`)
      }
      else{
        errMsg = errMsg.concat(`Error adding ${addFlag*-1} workers\n`)
      }
    }
    if(toRemove){
      if(removeFlag === 0){
        errMsg = errMsg.concat("All specified workers removed successfully")
      }
      else{
        errMsg = errMsg.concat(`Error removing ${removeFlag*-1} or more workers`)
      }
    }
    alert(errMsg)

    handleDataChange()

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
      return -1
    }
    return 0
  }

  async function removeWorkerFromQueue(sid: string, prevAttributes: string) {
    var attributes = JSON.parse(prevAttributes)
    if(attributes.hasOwnProperty("taskQueues")){
      if(!attributes.taskQueues.includes(taskQueueName)){
        console.log("Remove worker from queue error - Worker not assigned to this queue")
        return -1
      }
      var newTaskQueues = []
      for(let i=0; i < attributes.taskQueues.length; i++){
        if (attributes.taskQueues[i] !== taskQueueName){
          newTaskQueues.push(attributes.taskQueues[i])
        }
      }
    }
    else{
      console.log("Worker does not belong to any task queues")
      return -1
    }
    attributes.taskQueues = newTaskQueues
    attributes = JSON.stringify(attributes)
    const editWorkerRequest = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${sid}`,{
      method: 'PUT',
      body: JSON.stringify({
        'attributes': `${attributes}`,
      })
    })
    if(editWorkerRequest.status !== 200) {
      alert("Error changing worker info")
      return -1
    }
    return 0
  }

  const handleCancel = () => {
    setShowModal(false);
  };

  async function handleDeleteTaskQueue(taskQueueSid: number){
    
    const deleteQueueRequest = await fetch(`/api/taskQueues?workspaceSid=${workspaceSid}&taskQueueSid=${taskQueueSid}`,{
      method: 'DELETE',
    })
    if(deleteQueueRequest.status!==200){
      alert("Cannot delete Task Queue")
      return
    }

    setShowModal(false)
    handleDataChange()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Queue</h2>
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
      <label className="block mb-4">
        Remove Workers (Names separated by commas)        
        <input
          className="border border-gray-400 rounded w-full p-2"
          type="text"
          value={workersToRemove}
          placeholder={"John Doe, Jane Smith, etc."}
          onChange={(e) => setWorkersToRemove(e.target.value)}
        />
      </label>
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
        onClick={handleModifyTaskQueue}
      >
        Confirm Changes
      </button>
      <button
        className="bg-gray-200 text-red-600 py-2 px-4 rounded"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded mb-4justify-end"
        onClick={() => {
          handleDeleteTaskQueue(sid)
        }}
        style={
        {
          marginLeft:70,
          backgroundColor: "red",
          justifySelf: "right",
        }
        }
       >
          Delete
        </button>
    </div>
  );
};

export default AdminModifyTaskQueue;
