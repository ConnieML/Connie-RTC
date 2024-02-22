import React, { useEffect} from "react";
import { formatPhoneNumber, formatTimeWithUnits } from "../../lib/utils";
import { useSession } from "next-auth/react";
import { MessageSquare, PhoneIncoming } from "lucide-react";


interface NotificationsCardProps {
  activeTasks: any;
  setActiveTasks: (tasks: any) => void;
}

export default function NotificationsCard({ activeTasks, setActiveTasks }: NotificationsCardProps) {
  const { data: session } = useSession();

  const fetchTasks = () => {
    fetch('/api/reservations?workerSid=' + session?.employeeNumber)
      .then(response => response.json())
      .then(data => {
        setActiveTasks(data.filter((task: any) => task.reservation.reservationStatus === 'accepted' || task.reservation.reservationStatus === 'pending'));
      });

  };

  useEffect(() => {
    // Fetch tasks immediately and then every 2 seconds
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 2000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (

    <div>
      <h1 className="text-lg">Notifications</h1>
      {activeTasks && Array.isArray(activeTasks) && activeTasks
        .map((task: any) => (
          <div key={task.task.sid} className="border-t border-gray-300 w-full p-1 flex items-center">
            <div className="mr-3">
              {task.task.taskChannelUniqueName === 'voice' ? <PhoneIncoming /> : <MessageSquare />}
            </div>
            <div>
              <h2>
                {task.task.taskChannelUniqueName === 'voice' ? (
                  <>
                    Call {formatPhoneNumber(JSON.parse(task.task.attributes).from) || "unknown"}
                  </>
                ) : task.task.taskChannelUniqueName === 'chat' ? (
                  <>
                    Respond to message from {formatPhoneNumber(JSON.parse(task.task.attributes).from) || "unknown"}"
                  </>
                ) : null}
              </h2>
              <h3 className="text-sm font-light">{formatTimeWithUnits(task.task.age)}</h3>
            </div>
          </div>
        ))}
    </div>
  )
}
