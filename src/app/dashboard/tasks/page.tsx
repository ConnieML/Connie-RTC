"use client"

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import useCalls from '@/lib/hooks/useCalls';

function formatTime(seconds: number) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hrs = Math.floor(seconds / (60 * 60));
  seconds -= hrs * 60 * 60;
  const mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;

  if (days) return days + (days > 1 ? " days" : " day") + " ago";
  if (hrs) return hrs + (hrs > 1 ? " hours" : " hour") + " ago";
  if (mnts) return mnts + (mnts > 1 ? " minutes" : " minute") + " ago";
  if (seconds) return seconds + (seconds > 1 ? " second" : " second") + " ago";

}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const { data: session } = useSession();

  const { inCall, number, makeCall, setNumber, endCall } = useCalls({
    email: session?.user?.email || '',
    workerSid: session?.employeeNumber || '',
    friendlyName: session?.user?.name || '',
  });

  useEffect(() => {
    const fetchTasks = () => {
      // fetch('/api/tasks')
      //   .then(response => response.json())
      //   .then(data => setTasks(data));
      fetch('/api/reservations?workerSid=' + session?.employeeNumber)
        .then(response => response.json())
        .then(data => {
          setTasks(data);
          setActiveTasks(data.filter((task: any) => task.reservation.reservationStatus === 'accepted' || task.reservation.reservationStatus === 'pending'));
        });
        
    };

    // Fetch tasks immediately and then every 5 seconds
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 5000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
                  <>Call {JSON.parse(task.task.attributes).from || "unknown"}</>
                ) : task.task.taskChannelUniqueName === 'chat' ? (
                  <>Respond to message from {JSON.parse(task.task.attributes).from || "unknown"}</>
                ) : null}
              </td>
              <td>{formatTime(task.task.age)}</td>
              <td>
                {task.task.taskChannelUniqueName === 'voice' ? (
                  <Button
                    className="bg-[#334155] hover:bg-[#2D3A4C]/90 w-fit mr-2"
                    onClick={() => console.log(task)}
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
                // onClick={console.log('clicied')}
                >Transfer</Button>
                <Button
                  className="bg-[#F1F5F9] hover:bg-[#D8DCE0]/90 w-fit text-black"
                // onClick={console.log('clicied')}
                >Dismiss</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}