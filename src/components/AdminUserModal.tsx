import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const workspaceSid = process.env.NEXT_PUBLIC_WORKSPACE_SID as string;
const oktaUrl = process.env.NEXT_PUBLIC_OKTA_URL as string;

const AdminUserModal = ({
  setShowModal,
  user,
  setUsers,
  users,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: any;
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
  users: any[];
}) => {
  const [userForm, setUserForm] = useState<any>({
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    role: user ? user.role : '',
    email: user ? user.email : '',
  });
  const router = useRouter();

  async function handleCreateUser() {
    // Create new user inside of Twilio
    const createResponse = await fetch(
      `/api/workers?workspaceSid=${workspaceSid}`,
      {
        method: 'POST',
        body: JSON.stringify({
          friendlyName: `${userForm.firstName} ${userForm.lastName}`,
          attributes: JSON.stringify({
            contact_uri: `client:${userForm.email}`,
          }),
        }),
      }
    );
    if (createResponse.status === 500) {
      alert('Error creating new user inside of Twilio');
      return;
    }

    // Grab workers from workspace to find new worker's sid
    const retreiveResponse = await fetch(
      `/api/workers?workspaceSid=${workspaceSid}`,
      {
        method: 'GET',
      }
    );
    const retrieveData = await retreiveResponse.json();

    let workerSid = '';

    // Find newly created worker
    for (let i = 0; i < retrieveData.workers.length; i++) {
      if (
        retrieveData.workers[i].friendlyName ==
        `${userForm.firstName} ${userForm.lastName}`
      ) {
        workerSid = retrieveData.workers[i].sid;
        break;
      }
    }

    // Okta create user call - use twilio sid as employee number for later authentication
    await axios
      .post(
        oktaUrl + '/api/v1/users?activate=true',
        {
          profile: {
            firstName: `${userForm.firstName}`,
            lastName: `${userForm.lastName}`,
            email: `${userForm.email}`,
            login: `${userForm.email}`,
            userType: `${userForm.role}`,
            employeeNumber: `${workerSid}`,
          },
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `SSWS ${process.env.NEXT_PUBLIC_TOKEN}`,
          },
        }
      )
      .then(() => {
        alert('User successfully created');
        router.reload();
        return;
      })
      .catch(() => {
        // If an error occurs in creating user in Okta, delete newly created Twilio user
        deleteTwilioUser(workerSid);
        alert('Error creating new user inside of Okta');
        return;
      });

    setShowModal(false);
  }

  async function handleEditUser() {
    // Update user inside of Twilio
    const updateResponse = await fetch(
      `/api/workers?workspaceSid=${workspaceSid}&workerSid=${user.sid}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          friendlyName: `${userForm.firstName} ${userForm.lastName}`,
          attributes: JSON.stringify({
            contact_uri: `client:${userForm.email}`,
          }),
        }),
      }
    );
    if (updateResponse.status === 500) {
      alert('Error updating user inside of Twilio');
      return;
    }

    // Update user inside of Okta
    await axios
      .post(`/api/okta-users`, {
        id: user.id,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        login: userForm.email,
        userType: userForm.role,
      })
      .then(() => {
        alert('User successfully updated');
        setUsers(
          users.map((u) => {
            if (u.id === user.id) {
              return {
                id: u.id,
                sid: u.sid,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                email: userForm.email,
                role: userForm.role,
                status: u.status,
              };
            }
            return u;
          })
        );
        return;
      })
      .catch(() => {
        alert('Error updating user inside of Okta');
        return;
      });

    setShowModal(false);
  }

  async function deleteTwilioUser(sid: string) {
    await fetch(`/api/workers?workspaceSid=${workspaceSid}&workerSid=${sid}`, {
      method: 'DELETE',
    });
  }

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">
        {user ? 'Edit User' : 'Create a New User'}
      </h2>
      <label className="block mb-2">
        First Name:
        <input
          className="w-full p-2 border border-gray-400 rounded"
          type="text"
          value={userForm.firstName}
          onChange={(e) =>
            setUserForm({ ...userForm, firstName: e.target.value })
          }
        />
      </label>
      <label className="block mb-2">
        Last Name:
        <input
          className="w-full p-2 border border-gray-400 rounded"
          type="text"
          value={userForm.lastName}
          onChange={(e) =>
            setUserForm({ ...userForm, lastName: e.target.value })
          }
        />
      </label>
      <label className="block mb-2">
        Role:
        <input
          className="w-full p-2 border border-gray-400 rounded"
          type="text"
          value={userForm.role}
          onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
        />
      </label>
      <label className="block mb-4">
        Email Address:
        <input
          className="w-full p-2 border border-gray-400 rounded"
          type="email"
          value={userForm.email}
          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
        />
      </label>
      <button
        className="px-4 py-2 mr-2 text-white bg-purple-600 rounded"
        onClick={user ? handleEditUser : handleCreateUser}
      >
        {user ? 'Save Changes' : 'Create User'}
      </button>
      <button
        className="px-4 py-2 text-red-600 bg-gray-200 rounded"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default AdminUserModal;
