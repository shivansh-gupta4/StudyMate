'use client'

import React, { useState, useEffect } from 'react'
import { addDays, format, isSameMonth, isSameDay, isWithinInterval, differenceInDays } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BookOpen, ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"


const fetchUserData = async (email: string) => {
  let data = [];
  try {
    const response = await fetch('/api/givedaydata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, daynumber: 1 }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Not able to fetch data", result.error);
    }

     data = result.message;
     console.log("data", data);
  } catch (error) {
    console.error("Network or server error:", error);}
  
    return {
      startDate: new Date(new Date(data[2]).setHours(0, 0, 0, 0)),
      courseDuration: data[3] || 0,
      progress: Math.round((data[1] || 0) * 100) / 100,
      cousename: data[4] || " ",
     }
  }


const fetchTopicsForDay = async (day: Number, email: string) => {
  let data = [];
  try {
    const response = await fetch('/api/givedaydata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, daynumber: day }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Not able to fetch data", result.error);
    }

    data = result.message;
    console.log("data", data);
  } catch (error) {
    console.error("Network or server error:", error);
  }

  return {
    topics: data[0].map((topicData: [string, boolean]) => topicData[0]),
    completed: data[0].map((topicData: [string, boolean]) => topicData[1])
  };
}
    

const fetchCompletedDays = async (email: string) => {
  try {
    const response = await fetch('/api/getdayprogress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Not able to fetch completed days", result.error);
      return {};
    }

    return result.completedDays;
  } catch (error) {
    console.error("Network or server error:", error);
    return {};
  }
};

export default function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userStartDate, setUserStartDate] = useState<Date>(new Date())
  const [courseDuration, setCourseDuration] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [topics, setTopics] = useState<string[]>([])
  const [topicsCompleted, setTopicsCompleted] = useState<boolean[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [courseName, setCourseName] = useState<string>("")
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>({});
  const { data: session, status } = useSession();
  const router = useRouter()

  const email: string = session?.user?.email || "";

  useEffect(() => {
    const loadUserData = async () => {
      if (status === "loading") return;
      if (!session?.user?.email) {
        router.push('/');
        return;
      }
      
      setIsLoading(true);
      try {
        const [userData, completedDaysData] = await Promise.all([
          fetchUserData(session.user.email),
          fetchCompletedDays(session.user.email)
        ]);

        setUserStartDate(userData.startDate);
        setCourseDuration(userData.courseDuration);
        setProgress(userData.progress);
        setCurrentMonth(userData.startDate);
        setSelectedDate(userData.startDate);
        setCourseName(userData.cousename);
        setCompletedDays(completedDaysData);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [session, status]);

  useEffect(() => {
    const loadTopics = async () => {
      const daynumber = selectedDate ? Math.floor((new Date(selectedDate.setHours(0, 0, 0, 0)).getTime() - new Date(userStartDate.setHours(0, 0, 0, 0)).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;
      if (daynumber) {
        if (!session?.user?.email) return;
        const fetchedTopics = await fetchTopicsForDay(daynumber, session.user.email)
        setTopics(fetchedTopics.topics)
        setTopicsCompleted(fetchedTopics.completed)
        setSelectedTopic(fetchedTopics.topics[0] || "")
      }
    }
    loadTopics()
  }, [selectedDate])

  const endDate = addDays(userStartDate, courseDuration - 1)

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isWithinInterval(date, { start: userStartDate, end: endDate })) {
      setSelectedDate(date)
    }
  }

  const handleBeginLearning = () => {
    if (selectedTopic) {
      // Clean the course name
      const cleanCourseName = courseName;
      
      // Clean the selected topic
      const cleanTopic = selectedTopic;
      
      // Construct the query with a clear separator between course and topic
      const finalQuery = `${cleanCourseName}+sep+${cleanTopic}`;
      
      const dayNumber = Math.floor((new Date(selectedDate!.setHours(0, 0, 0, 0)).getTime() - 
        new Date(userStartDate.setHours(0, 0, 0, 0)).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      router.push(`/learning/${encodeURIComponent(finalQuery)}?day=${dayNumber}`)
    }
  }

  const isDayCompleted = (date: Date) => {
    if (!isWithinInterval(date, { start: userStartDate, end: endDate })) {
      return false;
    }
    const dayNumber = differenceInDays(date, userStartDate) + 1;
    return completedDays[dayNumber] || false;
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 w-full h-full">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Card Skeleton */}
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600">
                <Skeleton className="h-6 w-32 bg-white/20" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-6">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-full" />
                      ))}
                    </div>
                  </div>
                  <div className="relative h-full min-h-[300px] bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topics Card Skeleton */}
            <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600">
                <Skeleton className="h-6 w-32 bg-white/20" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <Skeleton className="h-4 w-4 rounded-full mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                  <Skeleton className="h-10 w-full mt-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 w-full h-full">
      {/* Animated background elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Larger, slower moving blobs in the back */}
        <div className="absolute w-[35vw] h-[35vw] -top-1/4 -left-1/4 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob-slow"></div>
        <div className="absolute w-[30vw] h-[30vw] top-1/2 -right-1/4 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob-slow animation-delay-4000"></div>
        
        {/* Medium sized blobs */}
        <div className="absolute w-[25vw] h-[25vw] top-1/4 left-1/4 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute w-[20vw] h-[20vw] top-1/3 right-1/4 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute w-[22vw] h-[22vw] bottom-1/4 left-1/3 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative w-full">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600">
                <CardTitle className="text-xl font-semibold text-white">Study Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-xl border-0"
                    modifiers={{
                      completed: (date) => isDayCompleted(date) && isSameMonth(date, currentMonth),
                      selected: (date) => selectedDate ? isSameDay(date, selectedDate) && !isDayCompleted(date) : false,
                      today: (date) => isSameDay(date, new Date()) && !isDayCompleted(date) && !(selectedDate && isSameDay(date, selectedDate)),
                      highlighted: (date) => isWithinInterval(date, { start: userStartDate, end: endDate }) && isSameMonth(date, currentMonth) && !isDayCompleted(date) && !(selectedDate && isSameDay(date, selectedDate)) && !isSameDay(date, new Date()),
                    }}
                    modifiersClassNames={{
                      completed: "bg-green-500/90 hover:bg-green-600/90 text-white font-medium rounded-full shadow-[0_0_0_1px_rgba(34,197,94,0.2)] hover:shadow-[0_0_0_2px_rgba(34,197,94,0.3)] hover:-translate-y-0.5",
                      selected: "bg-indigo-500/90 hover:bg-indigo-600/90 text-white font-medium rounded-full shadow-[0_0_0_1px_rgba(99,102,241,0.2)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.3)] hover:-translate-y-0.5",
                      today: "ring-2 ring-indigo-400/30 ring-offset-2 shadow-sm bg-white transition-transform rounded-full",
                      highlighted: "bg-indigo-100/30 hover:bg-indigo-200/40 text-indigo-900 rounded-full",
                    }}
                    classNames={{
                      caption: "flex justify-center relative items-center h-12 select-none mb-4",
                      caption_label: "text-base font-medium text-indigo-900",
                      nav: "flex items-center absolute inset-0",
                      nav_button: "h-8 w-8 bg-white/50 hover:bg-indigo-50/80 backdrop-blur-sm rounded-full transition-all duration-200 flex items-center justify-center shadow-[0_0_0_1px_rgba(99,102,241,0.1)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.2)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0",
                      nav_button_previous: "absolute left-0",
                      nav_button_next: "absolute right-0",
                      table: "w-full border-collapse",
                      head_row: "flex w-full gap-1.5 mb-4",
                      head_cell: "text-indigo-600/60 w-10 font-medium text-[0.8rem] uppercase tracking-wider text-center select-none",
                      row: "flex w-full mt-1.5 gap-1.5",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                      day: "h-10 w-10 p-0 font-normal transition-all duration-200 rounded-full flex items-center justify-center",
                      day_outside: "text-slate-400/50 hover:bg-slate-100/30 cursor-not-allowed hover:translate-y-0 hover:shadow-none",
                      day_disabled: "text-slate-400/50 hover:bg-transparent cursor-not-allowed hover:translate-y-0 hover:shadow-none",
                      root: "p-4"
                    }}
                  />

                  <div className="relative h-full min-h-[300px] bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl overflow-hidden shadow-inner">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000 ease-in-out"
                      style={{ height: `${progress}%` }}
                    >
                      <div className="absolute inset-0 water-animation"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-indigo-900">Course Progress</h3>
                        <p className="text-2xl font-bold text-indigo-900">{progress}%</p>
                      </div>
                      <div className="space-y-2 text-indigo-900">
                        <div className="flex justify-between">
                          <span className="text-sm">Start Date</span>
                          <span className="text-sm font-medium">{format(userStartDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">End Date</span>
                          <span className="text-sm font-medium">{format(endDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Duration</span>
                          <span className="text-sm font-medium">{courseDuration} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-indigo-100/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Daily Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedDate && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-indigo-900">
                        {format(selectedDate, 'MMMM d, yyyy')}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="bg-indigo-50 text-indigo-600 border-indigo-200"
                      >
                        Day {Math.floor((new Date(selectedDate.setHours(0, 0, 0, 0)).getTime() - new Date(userStartDate.setHours(0, 0, 0, 0)).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                      </Badge>
                    </div>
                    <RadioGroup 
                      value={selectedTopic} 
                      onValueChange={setSelectedTopic}
                      className="space-y-3"
                    >
                      {topics.map((topic, index) => (
                        <div 
                          key={index} 
                          className={`flex items-start space-x-3 p-3 rounded-lg transition-colors
                            ${topicsCompleted[index] 
                              ? 'bg-green-50 border-[0.5px] border-green-100 shadow-sm' 
                              : 'hover:bg-indigo-100/50'}`}
                        >
                          <RadioGroupItem 
                            value={topic} 
                            id={`topic-${index}`}
                            className={`mt-1 ${topicsCompleted[index] 
                              ? 'text-green-600 border-green-600' 
                              : ''}`}
                          />
                          <Label 
                            htmlFor={`topic-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <Badge 
                                className={`select-none hover:bg-inherit ${topicsCompleted[index] 
                                  ? 'bg-green-100 text-green-600 border-[0.5px] border-green-100' 
                                  : 'bg-indigo-100 text-indigo-600'}`}
                              >
                                {index + 1}
                              </Badge>
                              <span className={`${topicsCompleted[index] 
                                ? 'text-green-700 font-medium' 
                                : 'text-gray-700'}`}
                              >
                                {topic}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button 
                      className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleBeginLearning}
                    >
                      Begin Your Learning Journey
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
  
}
