import React, { useState, Dispatch, SetStateAction } from 'react';

interface IProps{
  sid: number,
  taskQueueName: string,
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

const AdminModifyTaskQueue = ( {sid, taskQueueName, setShowModal}: IProps)=> {
  
  const [workersToAdd, setWorkersToAdd] = useState('');

  
  async function handleModifyTaskQueue() {

    // retrieve all workers
    const getWorkers = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`,{
      method:'GET'
    })
    const workersResponse = await getWorkers.json()
    const workersList = workersResponse.workers

    var parsedWorkersToAdd = workersToAdd.split(', ')

    // find a match for workers and workers to add
    for(let i= 0; i < parsedWorkersToAdd.length; i++){
      for(let j = 0; j < workersList.length; j++){
        if(parsedWorkersToAdd[i] === workersList[j].friendlyName){

          // if no attributes are on worker profile we can easily put the new task queue on it
          if(JSON.stringify(workersList[j].attributes) === `"{}"`){
            addWorkerToQueueNoAttributes(workersList[j].sid)
          }
          // otherwise we have to copy over their attributes and add on the task queue name in the taskQueues attribute
          else{
          
            addWorkerToQueueWithAttributes(workersList[j].sid, workersList[j].attributes)
          }
          break
        }
      }
    }


    setShowModal(false);
  };

  async function addWorkerToQueueWithAttributes(sid: string, prevAttributes: {taskQueues: string}) {

    // this value is undefined for some reason - https://www.twilio.com/docs/taskrouter/api/worker
    // 
    var taskQueues = prevAttributes["taskQueues"]
    console.log(taskQueues)

    
    

    // 
    /*const editWorkerRequest = await fetch(`/api/workers?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${sid}`,{
      method: 'PUT',
      body: JSON.stringify({
        'attributes': `${attributes}`,
      })
    })
    if(editWorkerRequest.status !== 200) {
      alert("Error changing worker info")
      return
    }*/
  }

  // this works perfect
  async function addWorkerToQueueNoAttributes(sid: string){

    var taskQueues = [taskQueueName]
    
    var attributes: any = {}
    attributes.taskQueues = taskQueues

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

  async function handleDeleteTaskQueue(taskQueueSid: number){
    const deleteQueueRequest = await fetch(`/api/taskQueues?workspaceSid=${workspaceSid}&taskQueueSid=${taskQueueSid}`,{
      method: 'DELETE',
    })
    if(deleteQueueRequest.status!==200){
      alert("Cannot delete Task Queue")
      return
    }
    setShowModal(false)
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
