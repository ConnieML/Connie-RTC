import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import Select from 'react-select';


const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string

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
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handleDataChange: () => any;
  workerList: Worker[];

}

const AdminCreateTaskQueue = ({ setShowModal, handleDataChange, workerList}: IProps) => {
  const [taskQueueName, setTaskQueueName] = useState('');
  const [multiSelectOptions, setMultiSelectOptions] = useState<Options[]>([])
  const [selectedOptions, setSelectedOptions] = useState<Options[]>([])

  const handleChange = (options:any)=>{
    setSelectedOptions(options)
  }
  

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

    for(let i= 0; i < selectedOptions.length; i++){
      for(let j = 0; j < workerList.length; j++){
        if(selectedOptions[i].label === workerList[j].friendlyName){
          addWorkerToQueue(workerList[j].sid, workerList[j].attributes)
          break
        }
        if(j === workerList.length-1 ){
          flag = true
        }
      }
    }

    handleDataChange()

    if(flag === true){
      alert("Error adding 1 or more workers provided")
    }
    else{
      alert("All workers added successfully")
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

  const createMultiSelectOptions = () => {
    var arr: Options[] = []

    for(let i=0; i < workerList.length; i++){
      var newOption: Options = {value: i, label: workerList[i].friendlyName}
      arr.push(newOption)
    }

    setMultiSelectOptions(arr)
  }

  useEffect(() =>  {
    createMultiSelectOptions()
    console.log(multiSelectOptions)
    return
  }, []);

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
      <label  className="mb-4">
        Select Workers to Add:
      <form className='mb-4'
          onSubmit={() => {
            handleCreateTask()
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
