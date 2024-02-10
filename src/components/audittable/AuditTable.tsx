"use client";

import React, {useEffect, useState} from 'react';
import axios from 'axios';


import {FetchedCalls, columns} from "./columns";
import { DataTable } from './DataTable';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
    }, [showCalls])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="flex space-x-4 mb-8">
            <div className="flex items-center space-x-2">
                <Switch id="update-live" />
                <Label htmlFor="airplane-mode">Update Live</Label>
            </div>
            <Button onClick={() => setShowCalls(true)} variant={showCalls? 'default' : 'outline'}>
                Calls
            </Button>
            <Button onClick={() => setShowCalls(false)} variant={showCalls? 'outline' : 'default'}>
                Messages
            </Button>
        </div>
        <div className="flex justify-between itms-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="search">Search</Label>
            <Input type="search" id="search" placeholder='Search' />
            </div>
            <div className="flex space-x-4 gap-2 items-end">
                <Button variant="ghost">
                    Export All
                </Button>
                <Button  variant="default">
                    Export Selected
                </Button>
            </div>
        </div>

        
    <div  className="container mx-auto py-10">
      <DataTable columns={columns} data={data}></DataTable>
      
      
    {data.length === 0 && <p>No calls to display.</p>}
    </div>
    </>
    );
}

export default AuditTable;