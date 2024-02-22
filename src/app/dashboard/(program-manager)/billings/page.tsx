"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface BillingPeriod {
  startDate: string;
  endDate: string;
  id: string;
}

interface UsageStatistics {
  callsPlaced: number[];
  messagesSent: number[];
}

// Sample data for billing periods and usage statistics
const billingPeriods: BillingPeriod[] = [
  { startDate: "January 12", endDate: "February 12", id: "jan-feb" },
  { startDate: "February 13", endDate: "March 13", id: "feb-mar" },
  { startDate: "March 14", endDate: "April 14", id: "mar-apr" },
  // Add more billing periods as needed
];

const usageData: { [key: string]: UsageStatistics } = {
  "jan-feb": {
    callsPlaced: [50, 75, 150, 125, 200, 220],
    messagesSent: [400, 600, 900, 800, 1300, 1600],
  },
  "feb-mar": {
    callsPlaced: [60, 80, 100, 150, 180, 200],
    messagesSent: [500, 700, 800, 950, 1100, 1200],
  },
  "mar-apr": {
    callsPlaced: [70, 90, 110, 130, 160, 190],
    messagesSent: [450, 650, 850, 1000, 1150, 1300],
  },
  // Add more usage statistics keyed by billing period id
};

export default function Billings() {
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<string>(
    billingPeriods[0].id,
  );

  const getChartData = () => {
    const data = usageData[selectedBillingPeriod];
    const period = billingPeriods.find(
      (period) => period.id === selectedBillingPeriod,
    );
    if (!period) return { labels: [], datasets: [] }; // Return empty data if no period is found

    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Calculate the interval in days between the points
    const interval = differenceInDays / (data.callsPlaced.length - 1);

    const labels = data.callsPlaced.map((_, index) => {
      const date = new Date(
        startDate.getTime() + interval * index * 1000 * 3600 * 24,
      );
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
    return {
      labels: labels,
      datasets: [
        {
          label: "Calls Placed",
          data: data.callsPlaced,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Messages Sent",
          data: data.messagesSent,
          borderColor: "#e08500",
          backgroundColor: "#FF9500",
        },
      ],
    };
  };

  return (
    <main className="p-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">Billings and Usage</h1>
        <p className="text-[#64748B] text-sm mb-6">
          Understand your organization’s Connie usage here.
        </p>
        <hr className="border-t border-gray-200 mb-6" />

        <div className="mb-2">
          <h2 className="text-xl font-bold">Current Balance</h2>
          <p className="text-2xl mt-4">$240.89</p>
        </div>

        <div className="flex items-center mb-6">
          <label
            htmlFor="billing-period-select"
            className="block text-sm font-medium text-gray-700 mr-4"
          >
            Select Billing Period:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="mt-1 w-full pl-3 pr-8 py-2 text-base bg-[#ECECEC] border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md w-64">
                {`${billingPeriods.find((period) => period.id === selectedBillingPeriod)?.startDate} - ${billingPeriods.find((period) => period.id === selectedBillingPeriod)?.endDate}`}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {billingPeriods.map((period) => (
                <DropdownMenuItem
                  key={period.id}
                  onSelect={() => setSelectedBillingPeriod(period.id)}
                >
                  {`${period.startDate} - ${period.endDate}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-8 max-w-lg">
          <h2 className="text-xl font-bold mb-4">Usage Breakdown</h2>
          <div className="relative h-64 w-full">
            <Line
              data={getChartData()}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <h4 className="text-lg font-semibold">Calls placed</h4>
              <p className="text-lg">
                {usageData[selectedBillingPeriod].callsPlaced.at(-1)}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Messages sent</h4>
              <p className="text-lg">
                {usageData[selectedBillingPeriod].messagesSent.at(-1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

//chart values hard-coded for example purposes
