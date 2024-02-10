"use client";

import React, {useEffect, useState} from 'react';
import axios from 'axios';

import {FetchedCalls, columns} from "./columns";
import { DataTable } from './DataTable';

const AuditTable: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCalls, setShowCalls] = useState(false);

    useEffect(() => {
        const fetchCalls = async() => {
            setLoading(true);
            try {
                const endpoint = showCalls ? '/api/audit-log/calls' : '/api/audit-log/message'
                const response = await axios.get(endpoint);
                setData(response.data);
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
      <DataTable columns={columns} data={data}></DataTable>
      
      
    {data.length === 0 && <p>No calls to display.</p>}
    </div>
    );
}

export default AuditTable;