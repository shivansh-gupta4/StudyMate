"use client"

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { GraduationCap, Target, CalendarDays, Youtube, Users, Headphones, BookOpen, Loader2 } from "lucide-react"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header: React.FC = () => {
  const session= useSession();
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative h-16 flex items-center">
        <div className="absolute inset-0 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-white/40 shadow-sm" />
        <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-600 via-yellow-400 to-blue-600 opacity-80" />
        <div className="relative w-full mx-auto max-w-6xl px-4 lg:px-6 flex items-center">
          <Link className="flex items-center" href="#">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 ring-1 ring-blue-600/20">
              <GraduationCap className="h-5 w-5 text-blue-700" />
            </span>
            <span className="ml-2 text-2xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent tracking-tight">StudyMate</span>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-2 lg:gap-4">
            <a href="#how" className="text-blue-900/80 hover:text-blue-900 text-sm font-semibold transition-colors">Features</a>
            <a href="#journey" className="text-blue-900/80 hover:text-blue-900 text-sm font-semibold transition-colors">Journey</a>
            <a href="#value" className="text-blue-900/80 hover:text-blue-900 text-sm font-semibold transition-colors">Value</a>
            <a href="#faq" className="text-blue-900/80 hover:text-blue-900 text-sm font-semibold transition-colors">FAQ</a>
          </nav>
          <div className="ml-auto md:ml-4 flex items-center gap-2 sm:gap-3">
            {session.data?.user ? (
              <Button
                variant="ghost"
                className="rounded-full text-sm font-semibold text-blue-900 border border-blue-200/60 hover:border-blue-300 hover:bg-blue-50/60 px-4"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="rounded-full text-sm font-semibold text-blue-900 border border-blue-200/60 hover:border-blue-300 hover:bg-blue-50/60 px-4"
                >
                  Sign In
                </Button>
              </Link>
            )}
            <Button
              onClick={() => {
                if (isRouting) return;
                setIsRouting(true);
                router.push('/dashboard/calendar');
              }}
              aria-busy={isRouting}
              disabled={isRouting}
              className={`hidden md:inline-flex rounded-full bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 font-semibold ${isRouting ? 'cursor-wait opacity-90' : ''}`}
            >
              {isRouting ? (
                <span className="inline-flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</span>
              ) : (
                'Get Started'
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
