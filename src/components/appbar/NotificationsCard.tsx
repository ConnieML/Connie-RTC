import React, { useCallback, useEffect } from "react";
import { formatPhoneNumber, formatTimeWithUnits } from "../../lib/utils";
import { MessageSquare, PhoneIncoming } from "lucide-react";


interface NotificationsCardProps {
  activeTasks: any;
}

export default function NotificationsCard({ activeTasks }: NotificationsCardProps) {

  return (
    <div>
      <h2>Notifications</h2>
      {activeTasks?.length > 0 ? (
        activeTasks.map((task: any) => (
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
                    Respond to message from {formatPhoneNumber(JSON.parse(task.task.attributes).from) || "unknown"}
                  </>
                ) : null}
              </h2>
              <h3 className="text-sm font-light">{formatTimeWithUnits(task.task.age)}</h3>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm italic mt-2">No Notifications</p>
        )}
    </div>
  )
}
