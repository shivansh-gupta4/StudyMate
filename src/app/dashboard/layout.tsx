'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  GraduationCap, 
  Calendar as CalendarIcon, 
  FileText,
  Users, 
  MessageCircle,
  Home,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const inter = Inter({ subsets: ['latin'] })

// Mock user data - in a real app, this would come from your auth system


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const user = {
    name: session?.user?.name || "Jane Doe",
    avatar: "/placeholder.svg?height=32&width=32",
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex flex-col">
          {/* Top Navbar */}
          <nav className="bg-white/95 backdrop-filter backdrop-blur-lg py-2 px-4 sticky top-0 z-10">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                  <GraduationCap className="h-8 w-8 text-indigo-600" />
                  <span className="ml-2 text-2xl font-bold text-indigo-900 whitespace-nowrap">StudyMate</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-indigo-200 transition-all duration-200 hover:ring-indigo-400">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-indigo-100">
                      <Menu className="h-5 w-5 text-indigo-600" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <button onClick={() => signOut()}>
                      <span>Log out</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </nav>

          {/* Main Navigation */}
          <nav className="bg-white/95 backdrop-filter backdrop-blur-lg border-b border-indigo-100/30 sticky top-14 z-10">
           <div className="w-full px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between overflow-x-auto">
                {[
                  { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/dashboard/home' },
                  { name: 'Calendar', icon: <CalendarIcon className="w-5 h-5" />, href: '/dashboard/calendar' },
                  { name: 'PYQ', icon: <FileText className="w-5 h-5" />, href: '/dashboard/pyq' },
                  { name: 'Services', icon: <Users className="w-5 h-5" />, href: '/dashboard/services' },
                  { name: 'Community', icon: <MessageCircle className="w-5 h-5" />, href: '/dashboard/community' },
                ].map((item) => (
                  <Link key={item.name} href={item.href} className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      className={`flex items-center justify-center py-4 px-4 h-14 w-32 transition-all duration-300 relative group overflow-hidden ${
                        pathname === item.href 
                          ? 'text-indigo-700 bg-indigo-100/70' 
                          : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/70'
                      }`}
                    >
                      <div className={`flex flex-col items-center transition-all duration-300 ${
                        pathname === item.href ? '' : 'group-hover:-translate-y-10'
                      }`}>
                        {item.icon}
                        <span className="mt-1">{item.name}</span>
                      </div>
                      {pathname !== item.href && (
                        <div className="absolute inset-0 flex items-center justify-center -translate-y-full transition-all duration-300 group-hover:translate-y-0 bg-indigo-100 text-indigo-800">
                          <span>{item.name}</span>
                        </div>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
             <div className="w-full max-w-7xl mx-auto">
               {children}
             </div>
            </main>
        </div>
      </body>
    </html>
  )
}