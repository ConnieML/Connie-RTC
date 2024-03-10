"use client"

import { useState, useEffect, useCallback, useContext } from 'react';
import { useSession } from "next-auth/react";
import { Button } from '../../../components/ui/button';
import React from 'react';
import { formatPhoneNumber, formatTimeWithUnits } from '../../../lib/utils';
import CallsContext from '@/contexts/CallsContext';

export default function Tasks() {

  const {
    inCall,
    number,
    makeCall,
    setNumber,
    endCall,
    incomingCall,
    acceptCall,
    rejectCall,
    activeTasks,
    updateReservation,
    dequeueTask
  } = useContext(CallsContext);

  return (
    <main>
      <h2 className="text-4xl font-semibold mb-4 mt-4">Tasks</h2>
      <h3 className="text-lg font-semibold">See all unresolved communications with clients here.</h3>
      <h3 className="italic font-normal mt-4">{activeTasks.length} outstanding task{activeTasks.length == 1 ? "" : "s"}</h3>
      <table className="mt-8">
        <thead>
          <tr className="text-left text-lg font-semibold">
            <th className="min-w-[20rem]">Task</th>
            <th className="min-w-[14rem]">Initiated</th>
            <th className="min-w-[14rem]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeTasks && Array.isArray(activeTasks) && activeTasks
            .map((task: any) => (
              <tr key={task.task.sid} >
                <td>
                  {task.task.taskChannelUniqueName === 'voice' ? (
                    <>Call {formatPhoneNumber(JSON.parse(task.task.attributes).from) || "unknown"}</>
                  ) : task.task.taskChannelUniqueName === 'chat' ? (
                    <>Respond to message from {formatPhoneNumber(JSON.parse(task.task.attributes).from) || "unknown"}</>
                  ) : null}
                </td>
                <td>{formatTimeWithUnits(task.task.age)}</td>
                <td>
                  {task.task.taskChannelUniqueName === 'voice' ? (
                    <Button
                      className="bg-[#334155] hover:bg-[#2D3A4C]/90 w-fit mr-2"
                      onClick={() => dequeueTask(task, JSON.parse(task.task.attributes).from)}
                    >
                      Call
                    </Button>
                  ) : task.task.taskChannelUniqueName === 'chat' ? (
                    <Button
                      className="bg-[#334155] hover:bg-[#2D3A4C]/90 w-fit mr-2"
                      onClick={() => console.log('Chat mode')}
                    >
                      Chat
                    </Button>
                  ) : null}
                  <Button
                    className="bg-[#F1F5F9] hover:bg-[#D8DCE0]/90 w-fit mr-2 text-black"
                    onClick={() => updateReservation(task.reservation, 'rejected')}
                  >Reject</Button>
                  {/* <Button
                  className="bg-[#F1F5F9] hover:bg-[#D8DCE0]/90 w-fit text-black"
                onClick={ () => updateReservation(task.reservation, 'canceled')}
                >Dismiss</Button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}