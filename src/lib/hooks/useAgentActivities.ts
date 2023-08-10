import { useEffect, useState } from 'react';
import { Activity } from '../taskrouterInterfaces';

export default function useAgentActivities() {
  const [currentAgentActivity, setCurrentAgentActivity] =
    useState<Activity | null>(null);
  const [agentActivities, setAgentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(
      `/api/activities/?workspaceSid=${process.env.NEXT_PUBLIC_WORKSPACE_SID}`
    ).then(async (data) => {
      const activities = await data.json();
      setAgentActivities(activities.activities);
    });
  }, []);
  return { agentActivities };
}
