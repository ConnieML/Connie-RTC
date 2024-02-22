"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function VoiceFlowConfiguration() {
  const [defaultMessage, setDefaultMessage] = useState("");

  const handleDefaultMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDefaultMessage(event.target.value);
  };

  const saveDefaultMessage = () => {
    console.log("Default message saved:", defaultMessage);
    // Placeholder for future implementation
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Voice Flow Configuration</h1>
      <p className="mb-3 text-[#64748B]">
        Configure voice settings, powered by Twilio.
      </p>
      <hr className="border-t border-gray-200 mb-6" />
      <div className="mb-6">
        <label
          className="block text-lg font-semibold mb-2"
          htmlFor="default-message"
        >
          Default unavailable message
        </label>
        <textarea
          id="default-message"
          value={defaultMessage}
          onChange={handleDefaultMessageChange}
          className="w-[530px] h-[80px] text-base p-3 border border-gray-200 rounded-md"
          placeholder="Type your message here"
        ></textarea>
        <p className="mt-2 text-sm text-[#64748B]">
          This message will be provided when no agent is available to answer a
          call.
        </p>
      </div>
      <Button
        onClick={saveDefaultMessage}
        className="bg-[#FF9500] hover:bg-[#e08500]"
        size="sm"
      >
        Save Changes
      </Button>
    </div>
  );
}
