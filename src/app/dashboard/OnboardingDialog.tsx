'use client';

import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

import connieLogo from '@/assets/connie-logo.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import useOnboardingState from '@/lib/client/use-onboarding-state';
import { cn } from '@/lib/utils';

type OnboardingData = {
  screenshot: StaticImageData;
  title: string;
  description: string;
};

const ONBOARDING_STEPS: OnboardingData[] = [
  {
    screenshot: connieLogo,
    title: 'Call clients',
    description:
      'Connie allows you to call clients directly from the dashboard. Click on the phone icon to start a call.',
  },
  {
    screenshot: connieLogo,
    title: 'Chat with Clients',
    description: 'To chat with a client, simply search for them.',
  },
  {
    screenshot: connieLogo,
    title: 'See tasks',
    description:
      'Miss a call? No problem. You can see all missed calls and tasks in the "Tasks" tab.',
  },
  {
    screenshot: connieLogo,
    title: 'Change Status',
    description:
      'To receive incoming calls from clients, change your status to "Available" in the app toolbar.',
  },
];

/**
 * An onboarding dialog that appears when the user first logs in.
 *
 * This presents the user with a short guide on how to use the app.
 *
 * Note: This only appears if the user has not completed the onboarding process.
 */
export function OnboardingDialog() {
  const { isOnboarded, setIsOnboarded } = useOnboardingState();
  const [currentStep, setCurrentStep] = useState(0);

  const advanceStep = () => {
    if (currentStep === ONBOARDING_STEPS.length - 1) {
      onFinish();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Go back to the previous step, making sure we don't go below 0.
   */
  const goBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const onFinish = () => {
    setIsOnboarded(true);
  };

  if (isOnboarded) {
    return <></>;
  }

  const isPastCurrentStep = (index: number) => index <= currentStep;

  const isDone = currentStep >= ONBOARDING_STEPS.length;
  const currentContent = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 p-4 lg:p-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="max-w-3xl w-full h-[600px] flex flex-col overflow-hidden p-6 relative">
        <div className="text-center pb-4 space-y-4">
          <h1 className="text-3xl font-bold text-emphasis-high">
            Welcome to Connie.
          </h1>
          <p className="text-base text-emphasis-low">
            We&apos;re so happy you&apos;re here. Get to know the app through a
            few simple steps.
          </p>
        </div>

        <div className="md:flex-grow md:flex mt-4 md:space-x-6 items-center">
          <div className="min-w-[180px] flex flex-col space-y-3">
            {ONBOARDING_STEPS.map(({ title }, index) => (
              <div key={index} className="h-10 flex items-center space-x-4 ">
                <div
                  className={cn(
                    'size-6 rounded-full',
                    isPastCurrentStep(index) ? 'bg-primary' : 'bg-gray-200',
                  )}
                />
                <div className="text-lg">{title}</div>
              </div>
            ))}
          </div>
          <div className="flex-grow">
            <div>
              <Image
                src={currentContent.screenshot}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-4">{currentContent.description}</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={goBack}
            className={cn(currentStep === 0 ? 'hidden' : 'visible')}
            tabIndex={1}
          >
            Back
          </Button>
          <Button onClick={advanceStep} variant="default" tabIndex={2}>
            {isDone ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
