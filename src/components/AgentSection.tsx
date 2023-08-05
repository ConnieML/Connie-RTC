import Box from '@mui/material/Box';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Activity } from '@/lib/taskrouterInterfaces';
import { Worker } from 'twilio-taskrouter';
import { formatPhoneNumber } from '@/lib/utils';

export default function AgentSection({
  agentActivity,
  agentActivities,
  inCall,
  number,
  worker,
  makeCall,
  setActivityName,
  setNumber,
}: {
  agentActivity: string;
  agentActivities: Activity[];
  inCall: boolean;
  number: string;
  worker: Worker | null;
  makeCall: (number: string) => void;
  setActivityName: (name: string) => void;
  setNumber: (num: string) => void;
}) {
  return (
    <article className="h-full flex flex-col gap-y-10">
      <div className="flex flex-row gap-x-10">
        <div className="flex flex-col">
          <div className="font-bold text-3xl">Welcome {worker?.name}</div>
          <div className="text-base text-[#A3A3A3]">Agent ID</div>
        </div>
        <Box sx={{ minWidth: 240 }}>
          <FormControl>
            <Select
              id="demo-simple-select"
              value={agentActivity}
              onChange={(e) => {
                async function updateActivity() {
                  // Update on backend
                  const newActivity = agentActivities.find(
                    (activity) => activity.friendlyName === e.target.value
                  );
                  await fetch(
                    `/api/workers/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&workerSid=${worker?.sid}`,
                    {
                      method: 'PUT',
                      body: JSON.stringify({
                        activitySid: newActivity?.sid,
                      }),
                    }
                  )
                    .then(async (data) => {
                      setActivityName(e.target.value);
                    })
                    .catch((e) => alert('Failed to update activity name'));

                  // Clear all tasks if set to available. This is done just in case there are any tasks stuck in "Wrapping Up"
                  if (newActivity?.friendlyName === 'Available') {
                    worker?.reservations.forEach(async (reservation) => {
                      await fetch(
                        `/api/tasks/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}&taskSid=${reservation.task.sid}`,
                        {
                          method: 'PUT',
                          body: JSON.stringify({
                            assignmentStatus: 'completed',
                          }),
                        }
                      );
                    });
                  }
                }
                updateActivity();
              }}
            >
              {agentActivities.map((activity, idx) => (
                <MenuItem key={idx} value={activity.friendlyName}>
                  {activity.friendlyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="flex flex-row gap-x-4">
        <input
          type="text"
          className="w-[500px] h-10 rounded-[10px]"
          placeholder="Type phone number"
          disabled={inCall}
          value={formatPhoneNumber(number)}
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
        <button
          className="w-10 h-10 bg-[#6366f1] flex justify-center items-center rounded-[10px]"
          onClick={() => makeCall(number)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="#6366f1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 2.55556C1 1.69645 1.69645 1 2.55556 1H5.10608C5.44086 1 5.73807 1.21422 5.84394 1.53182L7.00891 5.02672C7.13131 5.39392 6.96507 5.79524 6.61887 5.96834L4.86323 6.84616C5.72053 8.74761 7.25239 10.2795 9.15384 11.1368L10.0317 9.38113C10.2048 9.03493 10.6061 8.86869 10.9733 8.99109L14.4682 10.1561C14.7858 10.2619 15 10.5591 15 10.8939V13.4444C15 14.3036 14.3036 15 13.4444 15H12.6667C6.22334 15 1 9.77666 1 3.33333V2.55556Z"
              stroke="white"
              stroke-width="1.67"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
