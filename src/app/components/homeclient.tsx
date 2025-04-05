"use client"

/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { GraduationCap, Target, CalendarDays, Youtube, Users, Headphones, BookOpen } from "lucide-react"
import Header from "@/app/components/header"
import Redirect from '@/app/components/redirect'

export default function LandingPage() {
  const { data: session, status } = useSession();
  

  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header/>
      <main className="flex-1">
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80"
            alt="Students collaborating"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-blue-900/70" />
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              You Set the Goals,<br />We Chart the Course to Success
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white mb-8">
              Where Ambition Meets Achievement
            </p>
            <Link href='/dashboard'>
            <Button className="bg-yellow-500 text-blue-900 hover:bg-yellow-400 text-lg py-2 px-6 font-bold transition-all duration-300 transform hover:scale-105">
              Start Your Journey
            </Button>
            </Link>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-blue-600">
              How StudyMate Works
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Set Your Goal</h3>
                <p className="text-gray-600">Input your career field or what you want to learn. We'll handle the rest.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-yellow-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CalendarDays className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Personalized Schedule</h3>
                <p className="text-gray-600">Get a tailored study plan that fits your timeline and covers all necessary topics.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Youtube className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Curated Content</h3>
                <p className="text-gray-600">Access the best educational videos and resources for each topic.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Headphones className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
                <p className="text-gray-600">Connect with consulting agents and personalized tutors for one-on-one support.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-yellow-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <Users className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Community Support</h3>
                <p className="text-gray-600">Join a community of like-minded peers pursuing similar career paths.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-green-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Comprehensive Resources</h3>
                <p className="text-gray-600">Access practice tests, mock exams, and up-to-date study materials.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Your Success, Our Priority
                </h2>
                <p className="text-white md:text-xl">
                  StudyMate is more than just a study planner.It's your personal academic assistant, designed to help you achieve your goals efficiently and effectively.
                </p>
                <ul className="space-y-2 text-white">
                  <li className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>Comprehensive study materials</span>
                  </li>
                  <li className="flex items-center">
                    <Headphones className="h-5 w-5 mr-2" />
                    <span>One-on-one tutoring sessions</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span>Supportive peer community</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    <span>Practice tests and mock exams</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-yellow-300 transform skew-y-6 rounded-3xl shadow-xl"></div>
                  <div className="relative bg-white p-6 rounded-3xl shadow-lg">
                    <div className="text-2xl font-bold mb-4 text-blue-600">Your Study Dashboard</div>
                    <div className="space-y-2">
                      <div className="h-4 bg-blue-100 rounded"></div>
                      <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                      <div className="h-4 bg-blue-100 rounded w-4/6"></div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <div className="w-1/2 h-8 bg-blue-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-blue-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold">Contact Us</h3>
              <p>Student Support: support@studymate.com</p>
              <p>Helpline: +1 (800) 123-4567</p>
            </div>
            <div className="flex flex-col space-y-2 md:items-end">
              <h3 className="font-bold">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-yellow-300">Facebook</Link>
                <Link href="#" className="hover:text-yellow-300">Twitter</Link>
                <Link href="#" className="hover:text-yellow-300">Instagram</Link>
                <Link href="#" className="hover:text-yellow-300">LinkedIn</Link>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-sm">
            © 2023 StudyMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}