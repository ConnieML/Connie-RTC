interface Name {
    first: string;
    last: string;
  }
  
  interface Data {
    id: number;
    table: number;
    name: Name;
    status: string;
    skills: string;
    role: string;
    levelOfAccess: string;
  }
  
  interface AssignedUser {
    name: string;
    imageUrl: string;
  }
  
  interface TaskQueuesData {
    id: number;
    table: number;
    taskName: string;
    sid: string;
    assignedUsers: AssignedUser[];
  }
  
  export const data: Data[] = [
    {
        id: 1,
        table: 1,
        name: {
          first: 'First',
          last: 'Last',
        },
        status: 'User Invited',
        skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
        role: 'Role',
        levelOfAccess: 'Level of Access',
      },
    
      {
        id: 2,
        table: 1,
        name: {
          first: 'First',
          last: 'Last',
        },
        status: 'User Invited',
        skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
        role: 'Role',
        levelOfAccess: 'Level of Access',
      },
    
      {
        id: 3,
        table: 1,
        name: {
          first: 'First',
          last: 'Last',
        },
        status: 'User Invited',
        skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
        role: 'Role',
        levelOfAccess: 'Level of Access',
      },
    
      {
        id: 4,
        table: 1,
        name: {
          first: 'First',
          last: 'Last',
        },
        status: 'User Invited',
        skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
        role: 'Role',
        levelOfAccess: 'Level of Access',
      },
    
      {
        id: 5,
        table: 1,
        name: {
          first: 'First',
          last: 'Last',
        },
        status: 'User Invited',
        skills: 'Skill 1, Skill 2, Skill 3, Skill 4',
        role: 'Role',
        levelOfAccess: 'Level of Access',
      },
    
    ]
  
  export const taskQueuesData: TaskQueuesData[] = [
    {
        id: 1,
        table: 2,
        taskName: 'Task Queue Name',
        sid: 'WQ697bb5fa6feab6334064c4456adcab',
        assignedUsers: [
          { name: 'User 1', imageUrl: 'https://i.pravatar.cc/300?img=1' },
          { name: 'User 2', imageUrl: 'https://i.pravatar.cc/300?img=2' },
          { name: 'User 3', imageUrl: 'https://i.pravatar.cc/300?img=3' },
        ],
      },
      {
        id: 2,
        table: 2,
        taskName: 'Task Queue Name',
        sid: 'WQ697bb5fa6feab6334064c4456adcab',
        assignedUsers: [
          { name: 'User 1', imageUrl: 'https://i.pravatar.cc/300?img=1' },
          { name: 'User 2', imageUrl: 'https://i.pravatar.cc/300?img=2' },
          { name: 'User 3', imageUrl: 'https://i.pravatar.cc/300?img=3' },
        ],
      },
  ];