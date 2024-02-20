"use client";

import React, { useState } from "react";
import "./Home.css";

const steps = [
  "Dashboard Cards",
  "Notifications",
  "Communicate With Clients",
  "Change Status",
];

export default function DashboardHome() {
  const [currentPage, setCurrentPage] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(
    new Array(steps.length).fill(false),
  );
  // const tutorialCompleted = localStorage.getItem('tutorialCompleted') === 'true';
  // const [showPopup, setShowPopup] = useState(!tutorialCompleted);
  const [showPopup, setShowPopup] = useState(true);
  const [showFinishButton, setShowFinishButton] = useState(false);

  const goToNextPage = () => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentPage] = true;
    setCompletedSteps(newCompletedSteps);
    if (currentPage < steps.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      setShowFinishButton(true);
    }
  };

  const finishTutorial = () => {
    // Set the last step as completed before closing
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[currentPage] = true;
    setCompletedSteps(newCompletedSteps);
    // localStorage.setItem('tutorialCompleted', 'true');
    setShowPopup(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${!showPopup ? "hidden" : ""}`}
    >
      {showPopup && (
        <div className="bg-white rounded-2xl max-w-[836px] max-h-[537px] flex flex-col shadow overflow-hidden p-6 relative">
          <div className="text-center pb-4">
            <h1 className="text-2xl font-bold mb-2.5">Welcome to Connie.</h1>
            <p className="text-base text-gray-500">
              We’re so happy you’re here. Get to know your space through a few
              simple steps. Here are the main functions of your dashboard:
            </p>
          </div>

          <div className="flex mt-4">
            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center mb-5 ml-2 relative"
                >
                  <div
                    className={`w-7 h-7 rounded-full ${index === currentPage ? "bg-orange-500" : completedSteps[index] ? "bg-orange-500" : "bg-gray-200"}`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center mb-8 ml-9 relative step-oval ${index === currentPage ? "active" : completedSteps[index] ? "completed" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center absolute left-2.5 ${index === currentPage ? "active" : ""} ${completedSteps[index] ? "completed step-checkmark" : ""} ${index === currentPage || completedSteps[index] ? "border-orange-500" : "border-gray-300"} `}
                  ></div>
                  <div className="ml-10 mr-4 text-sm">{step}</div>
                </div>
              ))}
            </div>
            <div className="flex-grow">
              {steps.map((content, index) => (
                <div
                  key={content}
                  className={`ml-7 content ${index === currentPage ? "block" : "hidden"}`}
                >
                  {`Content for ${content}`}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
            {!showFinishButton ? (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                onClick={goToNextPage}
              >
                {currentPage === steps.length - 1 ? "Finish" : "Next"}
              </button>
            ) : (
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                onClick={finishTutorial}
              >
                Exit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
