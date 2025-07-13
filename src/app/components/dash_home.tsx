"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Target, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface StudyPlan {
  id: number;
  planName: string;
  totalDays: number;
  CourseProgress: number;
  completedDays: number;
  days: {
    dayNumber: number;
    progress: number;
  }[];
}

export default function HomePage() {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudyPlan = async () => {
      try {
        const response = await fetch('/api/dashboard/study-plan');
        if (!response.ok) {
          throw new Error('Failed to fetch study plan');
        }
        const data = await response.json();
        //  console.log(data);
        setStudyPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPlan();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!studyPlan) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Study Plan Found</h1>
          <p className="text-muted-foreground mb-6">Create a study plan to start tracking your progress</p>
          <Button asChild>
            <Link href="/dashboard/study-plan/new">Create New Plan</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Track your study progress and stay on top of your goals</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/study-plan/new">
            Create New Plan
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyPlan.CourseProgress.toFixed(2)}%</div>
            <Progress value={studyPlan.CourseProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studyPlan.completedDays}</div>
            <p className="text-xs text-muted-foreground">out of {studyPlan.totalDays} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progress of All Days</CardTitle>
          <CardDescription>Your progress of all days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studyPlan.days.map((day) => (
              <div key={day.dayNumber} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>Day {day.dayNumber}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress value={day.progress} className="w-[100px]" />
                  <span className="text-sm text-muted-foreground">
                    {day.progress.toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
