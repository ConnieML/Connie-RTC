"use client";

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
  } from "@/components/ui/table"


interface Calls {
    from: string;
    to: string;
    direction: string;
    answeredBy: string;
    dateCreated: Date | string;
}

const dummyCalls = [
    {
        from:"user1",
        to:"caller1",
        direction:"inbound",
        timeStamp:"2023-02-03"

    },
    {
        from:"user2",
        to:"caller1",
        direction:"inbound",
        timeStamp:"2023-02-03"

    },
    {
        from:"user3",
        to:"caller1",
        direction:"inbound",
        timeStamp:"2023-02-03"

    },
]

const AuditTable: React.FC = () => {
    const [calls, setCalls] = useState<Calls[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCalls = async() => {
            setLoading(true);
            try {
                const response = await axios.get('/api/audit-log');
                setCalls(response.data);
                console.log("call retrieved")
                setLoading(false);
            } catch (error) {
                console.log('error fetching calls', error);
                setLoading(false);
            }
        }

        fetchCalls;
    }, [])

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
    <div>
        <Table>
      <TableCaption>A list of your recent activity.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Direction</TableHead>
          <TableHead className="text-right">Time Stamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyCalls.map((call) => (
          <TableRow key={call.from}>
            <TableCell className="font-medium">{call.from}</TableCell>
            <TableCell>{call.to}</TableCell>
            <TableCell>{call.direction}</TableCell>
            <TableCell className="text-right">{call.timeStamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
            {calls.length === 0 && <p>No calls to display.</p>}
            </div>
    );
}

export default AuditTable;