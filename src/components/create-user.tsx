import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const {OKTA_OAUTH2_ISSUER, OKTA_OAUTH2_CLIENT_ID, OKTA_OAUTH2_CLIENT_SECRET, DEFAULT_SCOPE} = process.env


interface Response{
    res: {}
}


function UserRegister() {
    const { data: session, status } = useSession()

    async function createUser() {
    
        if (session){



            const accessToken = JSON.parse(Buffer.from(session.idToken.split('.')[1], 'base64').toString());

            const {data} = await axios.get('https://trial-2094636.okta.com/oauth2/default/.well-known/oauth-authorization-server')

            console.log(data)

            
            /*const {data} = await axios.post('https://trial-2094636.okta.com/api/v1/users?activate=false', 
            {
                "firstName": "John",
                "lastName": "Smith",
                "email": "obriecam@oregonstate.edu",
                "login": "obriecam@oregonstate.edu",
                "mobilePhone": "503-781-9403"
            }, 
            {
                headers: {
                    "Accept": "application/json",
                    'Content-Type': 'application/json',
                    "Authorization": `SSWS ${session.accessToken}`,
                }
            }
            )
            console.log(data)*/
        }
    }
    

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    };

    const [values, setValues] = useState(initialState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createUser();
        console.log(values);
    };

    if(session){
        return (
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                            name='firstName'
                            id='firstName'
                            type='text'
                            placeholder='First Name'
                            onChange={handleChange}
                            />
                        <input
                            name='lastName'
                            id='lastName'
                            type='text'
                            placeholder='Last Name'
                            onChange={handleChange}
                            />
                        <input
                            name='email'
                            id='email'
                            type='email'
                            placeholder='Email'
                            onChange={handleChange}
                            />

                        <input
                            name='role'
                            id='role'
                            type='text'
                            placeholder='Password'
                            onChange={handleChange}
                            />
                        <button type='submit'>Create User</button>
                </div>
            </form>
        );
    }
    return(
        <h1>Sign in to add user</h1>
    )
}

export default UserRegister;