import React, { useState, ChangeEvent } from 'react';

const Taskqueue = () => {
  const [taskName, setTaskName] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const handleTaskNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
  };

  const handleCreateTask = () => {
    fetch('/taskQueues.ts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName,
        selectedUser,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Task queue created');
        } else {
          console.error('Error creating task queue');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h2 style={{ textAlign: 'center' }}>Add a New Task Queue</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="taskName" style={{ display: 'block' }}>Task Name</label>
        <input type="text" id="taskName" value={taskName} onChange={handleTaskNameChange} style={{ width: '100%', padding: '5px', color: 'black', border: '1px solid #6366f1ff', backgroundColor: 'white' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="users" style={{ display: 'block' }}>Assign Users</label>
        <select id="users" value={selectedUser} onChange={handleUserChange} style={{ width: '100%', padding: '5px', color: 'black', border: '1px solid #6366f1ff', backgroundColor: 'white' }}>
          <option value="">Select User</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleCreateTask} style={{ marginRight: '5px', padding: '10px 20px', backgroundColor: '#6366f1ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Task</button>
        <button style={{ padding: '10px 20px', backgroundColor: 'white', color: 'red', border: '1px solid gray', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
};

export default Taskqueue;
