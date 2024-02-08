"use client";

import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {FetchedCalls, columns} from "./columns";
import { DataTable } from './DataTable';


const dummyCalls = [
    {
      id: "1",
      direction: "inbound",
      from: "1234567",
      to: "7654321",
      timestamp: new Date("2023-02-03") 
  },
  {
    id: "1",
    direction: "inbound",
    from: "1234567",
    to: "7654321",
    timestamp: new Date("2023-02-03")
},
{
  id: "1",
  direction: "inbound",
  from: "1234567",
  to: "7654321",
  timestamp: new Date("2023-02-03")
},
]

const AuditTable: React.FC = () => {
    const [calls, setCalls] = useState<FetchedCalls[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCalls, setShowCalls] = useState(true);

    useEffect(() => {
        const fetchCalls = async() => {
            setLoading(true);
            try {
                const response = await axios.get('/api/audit-log/calls');
                setCalls(response.data);
                // console.log("call retrieved")
                // console.log(calls)
                setLoading(false);
            } catch (error) {
                console.log('error fetching calls', error);
                setLoading(false);
            }
        }

        fetchCalls();
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
    <div  className="container mx-auto py-10">
      <DataTable columns={columns} data={calls}></DataTable>
      
      
    {calls.length === 0 && <p>No calls to display.</p>}
    </div>
    );
}

export default AuditTable;