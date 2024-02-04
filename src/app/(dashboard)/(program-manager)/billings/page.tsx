"use client";
import { useState } from "react";

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
        <p className="text-lead20 mt-2">${/* Insert current balance here */}</p>
        <p className="text-subtle14 mt-1">{`Billing cycle: ${billingPeriod.startDate} - ${billingPeriod.endDate}`}</p>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold">Usage Breakdown</h3>
        <img
          src="/placeholder-graph.jpg" // Replace with actual graph image or component
          alt="Usage Graph"
          className="mt-4"
        />
        <div className="flex justify-start mt-4">
          <div>
            <h4 className="text-lg font-semibold">Calls placed</h4>
            <p className="text-gray-600">{usageStatistics.callsPlaced}</p>
          </div>
          <div className="ml-20">
            <h4 className="text-lg font-semibold">Messages sent</h4>
            <p className="text-gray-600">{usageStatistics.messagesSent}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
