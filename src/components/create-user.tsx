import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { AxiosResponse, AxiosError} from 'axios';

interface res{
    response: {}
}

function UserRegister() {
    const { data: session } = useSession()
    
    async function createUser() {
    
        if (session){
            // twilio create user call

            // How should we assign workspace? - currently throws in my workspace sid
            const createResponse = await fetch(`/api/workers?workspaceSid=WSef13753652555120195288885123b5cf`,{
                method: 'POST',
                body: JSON.stringify({
                    // replace with field var
                    "friendlyName" : "Jane Doe",
                }),
            })
            const responseData = await createResponse.json()
            if (responseData.error) {
              console.error(responseData.error)
              return
            }

            // grab workers from workspace to find new worker's sid
            const retreiveResponse = await fetch(`/api/workers?workspaceSid=WSef13753652555120195288885123b5cf`, {
                method: 'GET',
            })
            const retrieveData = await retreiveResponse.json()

            var workerSid = ""

            // find newly created worker (is there a better way to do this? - workers are stored in alphabetical order)
            for(let i=0; i < retrieveData.workers.length; i++){
                // replace with field var
                if(retrieveData.workers[i].friendlyName == "Jane Doe"){
                    workerSid = retrieveData.workers[i].sid
                    break
                }
            }
            
            // okta create user call - use twilio sid for employee number for later auth
            await axios.post('https://trial-2094636.okta.com/api/v1/users?activate=true', 
            {
                // replace these with field vars
                "profile": {
                    "firstName": "Jane",
                    "lastName": "Doe",
                    "email": "obriecam@oregonstate.edu",
                    "login": "obriecam@oregonstate.edu",
                    "mobilePhone": "503-781-9403",
                    "userType": "agent",
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
            .then((response: AxiosResponse) => {
                console.log(response)
            })
            .catch((reason: AxiosError) => {
                if (reason.response!.status === 400){
                    console.log("error code 400")
                }
            })
            
        }
    }
    

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        role: "",
    };

    const [values, setValues] = useState(initialState);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createUser();
    };

    if(session){
        return (
            <form onSubmit={handleSubmit}>
                <button type='submit'>Create User</button>
            </form>
        );
    }
    return(
        <h1>Sign in to add user</h1>
    )
}

export default UserRegister;