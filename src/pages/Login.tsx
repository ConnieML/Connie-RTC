import React from 'react';
import Button from '@mui/material/Button';
import { OktaAuth } from '@okta/okta-auth-js';


const Login: React.FC = () => {
  const handleOktaLogin = async () => {
    try {
      const oktaAuth = new OktaAuth({
        issuer: 'https://trial-2094636.okta.com/oauth2/default',
        clientId: '0oa5vcy6kr6JCCBpe697',
        redirectUri: 'https://connie-rtc.vercel.app/api/auth/callback/okta/state=XKvImlFbW19uUMS47fclMpbUGBGUv12equo1AMaBfkU', // this link seems to be causing an error?
      });
  
      await oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error('Okta authentication error:', error);
    }
  };
  

  

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

      <p style={{ fontSize: '14px', color: 'grey', marginBottom: '30px' }}>
        Click here to sign in
      </p>

      <Button
        onClick={handleOktaLogin}
        variant="contained"
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          color: 'black', // Text color is black
          border: '1px solid gray',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px', // Adjust the font size as needed
          fontWeight: 'normal', // Not bold
          textTransform: 'capitalize', // Sentence case
          boxShadow: 'none', // Remove the shadow

        }}
      >
        <img
          src="okta-logo.png" // Replace with your Okta logo image path
          alt="Okta Logo"
          style={{ marginRight: '10px' }}
        />
        Sign in with Okta
      </Button>
    </div>
  );
};

export default Login;
