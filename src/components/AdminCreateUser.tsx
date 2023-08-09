import React, { useState } from 'react';
import axios from 'axios';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string
const createUserOktaUrl = process.env.NEXT_PUBLIC_OKTA_CREATE_USER_URL as string

const AdminCreateUser = ({ setShowModal }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
  
    async function handleUpdateUser(){
      
      // Create new user inside of Twilio
      const createResponse = await fetch(`/api/workers?workspaceSid=${workspaceSid}`,{
          method: 'POST',
          body: JSON.stringify({
              "friendlyName" : `${firstName} ${lastName}`,
          }),
      })
      if (createResponse.status === 500){
        alert("Error creating new user inside of Twilio")
        return
      }
      
      // Grab workers from workspace to find new worker's sid
      const retreiveResponse = await fetch(`/api/workers?workspaceSid=${workspaceSid}`, {
        method: 'GET',
      })
      const retrieveData = await retreiveResponse.json()

      var workerSid = ""

      // Find newly created worker
      for(let i=0; i < retrieveData.workers.length; i++){
          if(retrieveData.workers[i].friendlyName == `${firstName} ${lastName}`){
              workerSid = retrieveData.workers[i].sid
              break
          }
      }

      // Okta create user call - use twilio sid as employee number for later authentication
      await axios.post(createUserOktaUrl, 
      {
          "profile": {
              "firstName": `${firstName}`,
              "lastName": `${lastName}`,
              "email": `${userEmail}`,
              "login": `${userEmail}`,
              "userType": `${userRole}`,
              "employeeNumber": `${workerSid}`,
          }
      }, 
      {
          headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
              "Authorization": `SSWS ${process.env.NEXT_PUBLIC_TOKEN}`,
          }
      }
      )
      .catch(() => {
          // If an error occurs in creating user in Okta, delete newly created Twilio user
          deleteTwilioUser(workerSid)
          alert("Error creating new user inside of Okta")
          return
      })

      setShowModal(false);
    };

    async function deleteTwilioUser(sid: string) {
      await fetch(`/api/workers?workspaceSid=${workspaceSid}&workerSid=${sid}`,{
        method: 'DELETE',
      })
    }
  
    const handleCancel = () => {
      setShowModal(false);
    };
  
    return (
      <div>
        <h2 className='mb-4 text-2xl font-bold'>Create a New User</h2>
        <label className='block mb-2'>
          First Name:
          <input
            className='w-full p-2 border border-gray-400 rounded'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label className='block mb-2'>
          Last Name:
          <input
            className='w-full p-2 border border-gray-400 rounded'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label className='block mb-2'>
          Role:
          <input
            className='w-full p-2 border border-gray-400 rounded'
            type='text'
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
          />
        </label>
        <label className='block mb-4'>
          Email Address:
          <input
            className='w-full p-2 border border-gray-400 rounded'
            type='email'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
        </label>
        <button
          className='px-4 py-2 mr-2 text-white bg-purple-600 rounded'
          onClick={handleUpdateUser}
        >
          Update User
        </button>
        <button
          className='px-4 py-2 text-red-600 bg-gray-200 rounded'
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    );
  };

  export default AdminCreateUser;
