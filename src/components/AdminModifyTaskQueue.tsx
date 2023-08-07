import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import Select from 'react-select';

interface Options{
  value: number,
  label: string
}
interface Worker{
  friendlyName: string,
  attributes: string,
  sid: string
}


interface IProps{
  sid: number,
  taskQueueName: string
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;
  editType: string;
  workerList: Worker[],
  assignedWorkers: string[]
}

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

const AdminModifyTaskQueue = ( {sid, taskQueueName, setShowModal, handleDataChange, editType, workerList, assignedWorkers}: IProps)=> {
  
  const [multiSelectOptions, setMultiSelectOptions] = useState<Options[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Options[]>([])

  const handleChange = (options:any)=>{
    setSelectedOptions(options)
  }
  
  async function handleModifyTaskQueue() {

    if(editType === "Delete"){
      handleDeleteTaskQueue(sid)
      return
    }
    if(selectedOptions.length === 0){
      handleCancel()
      return
    }

    var addFlag = 0         // Check if add operations were valid
    var removeFlag = 0      // Check if remove operations were valid

    var toAdd = false       // Bool for if we add workers
    var toRemove = false    // Bool for if we remove workers

    if(editType === 'Add Workers'){ toAdd = true } else{ toRemove = true}


    if(toAdd){
      for(let i= 0; i < selectedOptions.length; i++){
        for(let j = 0; j < workerList.length; j++){
          if(selectedOptions[i].label === workerList[j].friendlyName){
            addWorkerToQueue(workerList[j].sid, workerList[j].attributes)
            break
          }
          // Worker does not exist - set add flag
          else if(j === workerList.length-1){
            addFlag = addFlag - 1
          }
        }
      }
    }

    if(toRemove){
      for(let i= 0; i < selectedOptions.length; i++){
        for(let j = 0; j < workerList.length; j++){
          if(selectedOptions[i].label === workerList[j].friendlyName){
            removeFlag = removeFlag + await removeWorkerFromQueue(workerList[j].sid, workerList[j].attributes)
            break
          }
          // Worker does not exist - set remove flag
          else if(j === workerList.length-1){
            removeFlag = removeFlag - 1
          }
        }
      }
    }

    var errMsg = ''

    // Create alert based on booleans and check flags
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

    // Check if the worker has a taskQueues attributes
    if(attributes.hasOwnProperty("taskQueues")){
      if(attributes.taskQueues.includes(taskQueueName)){
        console.log("worker already belongs to this task Queue")
        return -1
      }

      // Worker has task queues and doesnt belong to this one
      attributes.taskQueues.push(taskQueueName)
    }
    else{

      // Create task queues attribute and set it to current queue
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

    // Similar logic as adding to queue
    if(attributes.hasOwnProperty("taskQueues")){
      if(!attributes.taskQueues.includes(taskQueueName)){
        console.log("Remove worker from queue error - Worker not assigned to this queue")
        return -1
      }
      var newTaskQueues = []

      // make new array with all but the queue to be removed
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
    setSelectedOptions([])
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

  const createMultiSelectOptions = () => {
    var arr: Options[] = []

    if (editType === 'Add Workers'){
      for(let i=0; i<workerList.length; i++){
        if(!assignedWorkers.includes(workerList[i].friendlyName)){
          var newOption: Options = {value: i, label: workerList[i].friendlyName}
          arr.push(newOption)
        }

      }
    }
    else{
      for(let i=0; i < assignedWorkers.length; i++){
        var newOption: Options = {value: i, label: assignedWorkers[i]}
        arr.push(newOption)
      }
    }

    setMultiSelectOptions(arr)
  }


  useEffect(() =>  {
    createMultiSelectOptions()
    return
  }, []);


  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit {taskQueueName}</h2>

      { editType !== "Delete" &&
        <label className="block mb-4">
          {editType} (Names separated by commas)

          <form
          onSubmit={() => {
            handleModifyTaskQueue()
            
            }}>
            <Select
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              closeMenuOnSelect={false}
              options={multiSelectOptions}
              noOptionsMessage={() => null}
            />
          </form>

        </label>
      }

      { editType === "Delete" && 
        <h3 className="mb-4">Are you sure you want to delete {taskQueueName}?</h3>
      }
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
    </div>
  );
};

export default AdminModifyTaskQueue;
