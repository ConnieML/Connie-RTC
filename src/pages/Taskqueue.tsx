import React, { useState, ChangeEvent } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

const Taskqueue = () => {
  const [taskQueueName, setTaskQueueName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleTaskQueueNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskQueueName(e.target.value);
  };

  const handleUserChange = (e: SelectChangeEvent<string[]>) => {
    const selectedValues = e.target.value as string[];
    setSelectedUsers(selectedValues);
  };

  const handleCreateTaskQueue = async () => {
    try {
      const selectedUserValues = selectedUsers.map(user => user.valueOf);
      const response = await axios.post('/api/taskQueueHandler', {
        friendlyName: taskQueueName,
        selectedUsers: selectedUserValues,
      });
      if (response.status === 200) {
        console.log('Task queue created');
      } else {
        console.error('Error creating task queue');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'white', color: 'black' }}>
      <h2 style={{ textAlign: 'center' }}>Add a New Task Queue</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="taskName" style={{ display: 'block' }}>Task Name</label>
        <input type="text" id="taskName" value={taskQueueName} onChange={handleTaskQueueNameChange} style={{ width: '100%', padding: '5px', color: 'black', border: '1px solid #6366f1ff', backgroundColor: 'white' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-multiple-select-label">Assign Users</InputLabel>
          <Select
            labelId="demo-multiple-select-label"
            id="demo-multiple-select"
            multiple
            value={selectedUsers}
            onChange={handleUserChange}
            style={{ width: '100%', padding: '5px', color: 'black', border: '1px solid #6366f1ff', backgroundColor: 'white' }}
          >
            <MenuItem value="user1">User 1</MenuItem>
            <MenuItem value="user2">User 2</MenuItem>
            <MenuItem value="user3">User 3</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleCreateTaskQueue} style={{ marginRight: '5px', padding: '10px 20px', backgroundColor: '#6366f1ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Create Task</button>
        <button style={{ padding: '10px 20px', backgroundColor: 'white', color: 'red', border: '1px solid gray', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
};

export default Taskqueue;
