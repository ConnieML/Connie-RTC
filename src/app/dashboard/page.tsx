'use client';

import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { OnboardingDialog } from './OnboardingDialog';
import './onboarding.css';

/**
 * The dashboard home page, showing an actionable summary for the user.
 *
 * Route: `/dashboard`
 */
export default function DashboardHome() {
  return (
    <div className="md:grid mg:grid-cols-12 md:gap-x-4">
      <Card className="col-span-12 md:col-span-8">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>
            Welcome to your dashboard. Here you can see a summary of your
            clients and their status.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <OnboardingDialog />
      </Card>
    </div>
  );
}
