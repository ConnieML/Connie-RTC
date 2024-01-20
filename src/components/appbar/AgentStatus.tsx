'use client';

import React, {useState} from 'react';
import {Chip} from "@material-tailwind/react";
import {Button} from "../ui/button";

import axios from 'axios';




const activities = {
    Available: 'WAd9d119cdf4ac2d6a37c372ea05029717',
    Unavailable: 'WA387cdc981874d6497a7658e6832d20a7',
    Break: 'WA0e780b853a43067109d8f4c6ecb25c59'
}

const AgentStatus:React.FC = () => {

    const [activity, setActivity] = useState('Unavailable')

   
    const toggleAvailability = async () => {
         const newActivity = activity === 'Unavailable' ? 'Available' : 'Unavailable';
         setActivity(newActivity);
         const activitySid = activities[newActivity];

         //Request to API route
         try {
            // Send a request to your API route using axios
            const response = await axios.post('/api/agent', {
                activitySid
            });
        } catch (error) {
            console.error('Error updating status:', error);
            // If API call fail, make no change
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