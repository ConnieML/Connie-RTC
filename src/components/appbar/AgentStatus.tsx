'use client';

import React, {useState} from 'react';
import {Chip} from "@material-tailwind/react";
import {Button} from "../ui/button";

import axios from 'axios';
import toast from 'react-hot-toast';


const AgentStatus:React.FC = () => {

    const [activity, setActivity] = useState('Unavailable')

   
    const toggleAvailability = async () => {
         const newActivity = activity === 'Unavailable' ? 'Available' : 'Unavailable';
         setActivity(newActivity);

         //Request to API route
         try {
            // Send a request to your API route using axios
            const response = await axios.post('/api/agent', {
                newActivity,
            });

            console.log('Status updated to:', response.data.status);
        } catch (error) {
            console.error('Error updating status:', error);
            // Optionally revert the status change in the UI if the API call fails
            setActivity(activity);
        }
    }

    return(
        <div className="flex gap-2 justify-center items-center">
            <Button 
                variant="outline"
                onClick={toggleAvailability}>
                {activity === 'Available' ? 'Go Offline' : 'Go Available'}
            </Button>
        <div className="flex gap-2 border border-gray-300 p-2 m-4 bg-gray-100 rounded">
        
        
        
        <div>Status</div>

        <div>
            {activity === 'Available'? 
                <>
            <Chip
                variant="ghost"
                color="green"
                size="sm"
                value="Available"
                icon={
                  <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                }
              /></> 
            
                    : 
                <>
                    <Chip
                        variant="ghost"
                        color="red"
                        size="sm"
                        value="Unavailable"
                        icon={
                        <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />
                        }
      />
                    </> }
        
        </div>

        </div>
        </div>
    )
}

export default AgentStatus