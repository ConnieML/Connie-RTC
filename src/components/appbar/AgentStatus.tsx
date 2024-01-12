'use client';

import React, {useState} from 'react';
import {Chip} from "@material-tailwind/react";
import {Button} from "../ui/button";

const AgentStatus:React.FC = () => {

    const [isAvailable, setIsAvailable] = useState(false);

    const toggleAvailability = async () => {
        const newAvailability = !isAvailable;
        setIsAvailable(newAvailability);
    }

    return(
        <div className="flex gap-2 justify-center items-center">
            <Button 
                variant="outline"
                onClick={toggleAvailability}>
                {isAvailable? 'Go Unavailable' : 'Go Available'}
            </Button>
        <div className="flex gap-2 border border-gray-300 p-2 m-4 bg-gray-100 rounded">
        
        
        
        <div>Status</div>

        <div>
            {isAvailable? 
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