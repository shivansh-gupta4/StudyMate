"use client"

import { useState, useEffect,  FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Book, Calendar, ChevronRight, ChevronLeft, Lightbulb, Target, Clock, Trophy } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { generateResponse } from "@/app/services/groqApi"; 
import Link from 'next/link'


interface User {
    email: string;
    id: number;
    createdAt: Date;
    name: string | null;
    password: string;
    registered: boolean;
    CourseFilled: boolean;
    updatedAt: Date;
} 


// Make the user prop accept `User | null | undefined`
interface Learning_choicePageProps {
  user: User | null | undefined;
}

export default function CourseInputPage({ user }: Learning_choicePageProps) {
  const [course, setCourse] = useState('')
  const [days, setDays] = useState('')
  const [error, setError] = useState('')
  const [currentQuote, setCurrentQuote] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const router= useRouter();

  const handleClick = async (e: FormEvent<HTMLFormElement>) => {
    console.log("clicked");
   e.preventDefault();
    
    const learning_path = course;
    const learning_days = parseInt(days, 10);
    const user_id = user?.id || 0;
    const user_mail = user?.email;
    const user_password = user?.password;
  
    setCourse('');
    setDays('');
    setError('');

    const prompt = `JSON FORMAT Generate a detailed study plan in JSON format for a student preparing for the ${learning_path}. The student has ${learning_days} days to prepare for the exam. The plan should cover the entire syllabus comprehensively without missing any topics. The study plan should be divided into sections, where each day includes a list of topics from all/different subjects within the course. The output should include the day number, subject name, chapter, and sub-topics to be studied on that day. Ensure that every topic in the syllabus is covered, and no important area is overlooked. You can first gather all the syllabus from web for the particular course/exam and then generate result without missing out on a single topic. Do not include any other information in the output.`;
    let studyPlanString;
    try {
       studyPlanString = await generateResponse(prompt);
  } catch (error) {
      if (error instanceof Error) {
          setError("Please try using a more appropriate deadline or a comprehensive course"); // This assumes setError expects a string
      } else {
          setError("Please try using a more appropriate deadline or a comprehensive course");
      }
      return;
  }
    
 
  
    try {
      const response = await fetch('/api/learning_path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, learning_path, learning_days }),
      });
  
      const result = await response.json();

      try {
        const response = await fetch('/api/putStudyPlaninDB', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, studyPlanString}),
        });
    
        const result = await response.json();
    
        if (!response.ok) {
            console.error("Error saving study plan:", result.error);
            return;
        }
    
        console.log(result.message); // "Study plan saved successfully"
    } catch (error) {
        console.error("Network or server error:", error);
    }
    
  
      if (result.ok) {
        const signInResult = await signIn("credentials", {
          redirect: false,  // Avoid auto redirect, handle it manually
          email: user_mail,
          password: user_password,
        });
        console.log("sign in result", signInResult);
  
        if (signInResult?.ok) {
          // Redirect user to dashboard after successful sign-in
         router.push('/dashboard/calendar');
        } else {
          console.error("Sign-in failed", signInResult?.error);
        }
      }
      else
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const quotes = [
    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. - Brian Herbert",
    "The expert in anything was once a beginner. - Helen Hayes",
    "The beautiful thing about learning is that nobody can take it away from you. - B.B. King",
    "Education is not the filling of a pail, but the lighting of a fire. - W.B. Yeats",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss"
  ]

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (parseInt(value) > 0 && parseInt(value) <= 90)) {
      setDays(value)
    }
  }

  const nextQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuote((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2YxZjVmOSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzYgNDZMMjQgMzRMMzYgMjJMMjQgMTBMMTIgMjJMMCAxMEwxMiAyMkwwIDM0TDEyIDQ2TDI0IDM0TDM2IDQ2TDQ4IDM0TDYwIDQ2TDQ4IDM0TDYwIDIyTDQ4IDEwTDM2IDIyWiIgZmlsbD0iI2UyZThmMCI+PC9wYXRoPgo8L3N2Zz4=')] opacity-30"></div>
        <div 
          className="absolute w-[800px] h-[800px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
          }}
        ></div>
        <div 
          className="absolute w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{
            right: `${mousePosition.x * 0.05}px`,
            bottom: `${mousePosition.y * 0.05}px`,
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl z-10">
        <div className="bg-white bg-opacity-80 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-lg border border-gray-200">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNNDggMEw2MCA0OEw0OCA2MEwwIDQ4TDEyIDM2TDAgMjRMMTIgMTJMMjQgMjRMMzYgMTJMNDggMjRMNjAgMTJMNDggMFoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 z-0"></div>
            <div className="flex items-center relative z-50">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center hover:opacity-80 transition-opacity cursor-pointer focus:outline-none bg-transparent border-0 p-0 m-0"
                type="button"
              >
                <GraduationCap className="text-white w-12 h-12" />
                <h2 className="text-3xl font-bold text-white ml-3">StudyMate</h2>
              </button>
            </div>
            <Lightbulb className="text-yellow-300 w-10 h-10 relative z-50" />
          </div>
          <div className="px-12 py-12 space-y-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 leading-tight">
                Plan Your Learning Journey
              </h1>
              <p className="text-xl text-gray-600">Set your goal, define your timeline, and let StudyMate guide you to success.</p>
            </div>
            <form onSubmit={handleClick}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label htmlFor="course" className="text-2xl font-semibold text-gray-800 block ">
                  What do you want to learn?
                </Label>
                <p className="text-gray-600">Choose a subject or skill you're passionate about mastering.</p>
                <div className="relative group">
                  <Input
                    id="course"
                    type="text"
                    placeholder="e.g. Machine Learning, Calculus, Spanish"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="pl-14 pr-4 py-4 w-full border-2 border-blue-300 rounded-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-lg shadow-sm transition-all duration-300 group-hover:shadow-md"
                    required
                 />
                  <Book className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6 transition-all duration-300 group-hover:scale-110" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days" className="text-2xl font-semibold text-gray-800 block mb-6">
                  How many days to master it? (Max 90 days)
                </Label>
                <div className="relative group">
                  <Input
                    id="days"
                    type="number"
                    placeholder="Enter number of days (1-90)"
                    required
                    value={days}
                    onChange={handleDaysChange}
                    min="1"
                    max="90"
                    className="pl-14 pr-4 py-4 w-full border-2 border-blue-300 rounded-full focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-lg shadow-sm transition-all duration-300 group-hover:shadow-md"
                  />
                  <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500 w-6 h-6 transition-all duration-300 group-hover:scale-110" />
                </div>
              </div>
            </div>
            <br/>
            <p className="text-red-500 text-center">{error}</p>
            <Button type='submit' className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xl font-bold py-4 px-6 rounded-full transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Create My Learning Plan
            </Button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <Target className="w-12 h-12 text-blue-500 mb-4 transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Set Clear Goals</h3>
                <p className="text-gray-600">Define your learning objectives and stay focused on your target.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <Clock className="w-12 h-12 text-purple-500 mb-4 transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Manage Your Time</h3>
                <p className="text-gray-600">Optimize your study schedule and make the most of your learning time.</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-blue-50 p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                <Trophy className="w-12 h-12 text-pink-500 mb-4 transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Track Progress</h3>
                <p className="text-gray-600">Monitor your achievements and celebrate your learning milestones.</p>
              </div>
            </div>
          </div>
          <div className="px-12 py-8 bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgMzBMNjAgNjBIMEwzMCAzMFoiIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-50"></div>
            <div className="relative">
              <button onClick={prevQuote} className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-purple-500 transition-colors duration-300">
                <ChevronLeft className="w-8 h-8" />
              </button>
              <p className="text-center text-gray-700 italic px-16 text-lg leading-relaxed">
                {quotes[currentQuote]}
              </p>
              <button onClick={nextQuote} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-purple-500 transition-colors duration-300">
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}