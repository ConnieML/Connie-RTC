'use client';

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import * as XLSX from "xlsx";

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { DataTable } from './DataTable';
import { FetchedCalls, columns } from './columns';

interface SelectionChange<TData> {
  selectionState: Record<string, boolean>;
  selectedRowsData: TData[];
}

const AuditTable: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCalls, setShowCalls] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedContent, setSelectedContent] = useState<any[]>([]);

  useEffect(() => {
    const fetchCalls = async () => {
      setLoading(true);
      try {
        const endpoint = showCalls
          ? '/api/audit-log/calls'
          : '/api/audit-log/message';
        const response = await axios.get(endpoint);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log('error fetching calls', error);
        setLoading(false);
      }
    };

    fetchCalls();
  }, [showCalls]);

  const handleSelectionChange = useCallback(
    (change: Record<string, boolean>, content: any[]) => {
      setSelectedRows(change);
      setSelectedContent(content);
      console.log(change);
      console.log(content);
    },
    [],
  );

  //exporting functionalities
  const exportSelectedRowsToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(selectedContent);
    XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedRows");
    XLSX.writeFile(workbook, "selected-rows.xlsx");
  };

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
        <Button
          onClick={() => setShowCalls(true)}
          variant={showCalls ? 'default' : 'outline'}
        >
          Calls
        </Button>
        <Button
          onClick={() => setShowCalls(false)}
          variant={showCalls ? 'outline' : 'default'}
        >
          Messages
        </Button>
      </div>
      <div className="flex justify-between itms-end">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="search">Search</Label>
          <Input type="search" id="search" placeholder="Search" />
        </div>
        <div className="flex space-x-4 gap-2 items-end">
          <Button variant="ghost">Export All</Button>
          <Button variant="default" onClick={exportSelectedRowsToExcel}>
            Export Selected
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={data}
          onSelectionChange={handleSelectionChange}
        ></DataTable>
      </div>
    </>
  );
};

export default AuditTable;
