import React from 'react';
import Button from '@mui/material/Button';
import ClientSideAuth from '@/components/client-auth';


const Login: React.FC = () => {


  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ marginBottom: '20px', position: 'absolute', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="logo.png"
          alt="American Society on Aging Logo"
          style={{ transform: 'scale(0.3)' }}
        />
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>
        Connie Sign In
      </h1>


      <ClientSideAuth/>

    </div>
  );
};

export default Login;
