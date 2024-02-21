"use client";
import { useState } from "react";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const getChartData = () => {
  return {
    labels: ['January 12', 'January 19', 'January 26', 'February 2', 'February 9', 'February 12'],
    datasets: [
      {
        label: 'Calls Placed',
        data: [50, 75, 150, 125, 200, 220],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Messages Sent',
        data: [400, 600, 900, 800, 1300, 1600],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

const options = {
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: true,
    },
  },
};


interface BillingPeriod {
  startDate: string;
  endDate: string;
}

interface UsageStatistics {
  callsPlaced: number;
  messagesSent: number;
}

const placeholderUsageStatistics: UsageStatistics = {
  callsPlaced: 220,
  messagesSent: 1600,
};

const placeholderBillingPeriod: BillingPeriod = {
  startDate: "January 12",
  endDate: "February 12",
};

export default function Billings() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
    placeholderBillingPeriod
  );
  const [usageStatistics, setUsageStatistics] = useState<UsageStatistics>(
    placeholderUsageStatistics
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Billings and Usage</h1>
      <p className="text-[#64748B] mt-2 text-sm">
        Understand your organization’s Connie usage here.
      </p>
      <hr className="my-6 border-t border-gray-200" />
      <div>
        <h3 className="text-xl font-bold">Current Balance</h3>
        <p className="text-lead20 mt-2">$240.89</p>
        <p className="text-subtle14 mt-1">{`Billing cycle: ${billingPeriod.startDate} - ${billingPeriod.endDate}`}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold">Usage Breakdown</h3>
        <div className="relative h-64 w-full max-w-lg">
          <Line data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>        
          <div className="flex justify-start mt-4">
          <div>
            <h4 className="text-lg font-semibold">Calls placed</h4>
            <p className="text-lead20 text-black">{usageStatistics.callsPlaced}</p>
          </div>
          <div className="ml-20">
            <h4 className="text-lg font-semibold">Messages sent</h4>
            <p className="text-lead20 text-black">{usageStatistics.messagesSent}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
