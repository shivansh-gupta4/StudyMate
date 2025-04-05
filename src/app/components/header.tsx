"use client"

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { GraduationCap, Target, CalendarDays, Youtube, Users, Headphones, BookOpen } from "lucide-react"
import Link from 'next/link';

const Header: React.FC = () => {
  const session= useSession();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-md fixed w-full z-10">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-blue-600">StudyMate</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {session.data?.user ? (
            <Button variant="ghost" className="text-sm font-medium" onClick={() => signOut()}>
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/login">
            <Button variant="ghost" className="text-sm font-medium" >
              Sign In
            </Button>
            </Link>
          )}
        </nav>
      </header>
  );
};

export default Header;
