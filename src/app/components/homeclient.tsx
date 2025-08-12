"use client"

/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession, signIn, signOut } from "next-auth/react"
import { GraduationCap, Target, CalendarDays, Youtube, Users, Headphones, BookOpen, ArrowRight, CheckCircle2, ChevronDown, Clock, Loader2 } from "lucide-react"
import Header from "@/app/components/header"
import HowItWorks from "./howitworks"

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isHeroNavigating, setIsHeroNavigating] = useState(false);
  const [isFinalNavigating, setIsFinalNavigating] = useState(false);
  

  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header />
      <main className="flex-1 scroll-smooth">
        {/* Hero */}
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1920&q=80"
            alt="Students collaborating"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/80" />
          <div className="pointer-events-none absolute inset-0 hidden sm:block bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm mb-5">
              <GraduationCap className="h-4 w-4" />
              <span>Personalized learning made simple</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              You Set the Goals,
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                We Chart the Course to Success
              </span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Where ambition meets achievement with a plan that fits your life.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => {
                  if (isHeroNavigating) return;
                  setIsHeroNavigating(true);
                  router.push('/dashboard/calendar');
                }}
                aria-busy={isHeroNavigating}
                disabled={isHeroNavigating}
                className={`group w-full sm:w-auto bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-base md:text-lg h-12 px-6 md:px-7 font-bold shadow-lg shadow-yellow-950/20 ${isHeroNavigating ? 'cursor-wait opacity-90' : ''}`}
              >
                {isHeroNavigating ? (
                  <span className="inline-flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</span>
                ) : (
                  <span className="inline-flex items-center">Start Your Journey<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" /></span>
                )}
              </Button>
              <a href="#how" className="inline-flex w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-6 md:px-7 bg-white/10 hover:bg-white/20 border-white/30 text-white">
                  How it works
                </Button>
              </a>
            </div>
          </div>
          {/* subtle bottom gradient tint */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-900/60 to-transparent" />
          {/* scroll indicator */}
          <div className="absolute bottom-6 left-0 right-0 z-10 hidden sm:flex justify-center">
            <a href="#how" className="group inline-flex flex-col items-center text-white/80 hover:text-white">
              <span className="text-xs mb-1 tracking-wide">Scroll</span>
              <ChevronDown className="h-6 w-6 animate-bounce" />
            </a>
          </div>
        </section>

        

        {/* Features */}
        <section id="how" className="relative w-full pt-16 md:pt-20 pb-12 md:pb-16 lg:pb-20 scroll-mt-28 overflow-hidden">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_0%_-10%,rgba(59,130,246,0.12),transparent),radial-gradient(800px_400px_at_100%_0%,rgba(234,179,8,0.10),transparent)]" />
            <div className="absolute inset-0 [background:linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.08)_calc(100%-1px))_0/100%_28px,linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.08)_calc(100%-1px))_0/28px_100%]" />
          </div>
          <div className="relative container px-4 md:px-6 max-w-6xl">
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">How StudyMate Works</span>
            </h2>
            <p className="mt-3 text-center text-blue-900/70 max-w-2xl mx-auto">
              A clear path from idea to mastery—tailored to your goals and time.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative rounded-2xl border border-blue-200/40 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Set Your Goal</h3>
                <p className="mt-1.5 text-blue-900/70">Input your career field or what you want to learn. We'll handle the rest.</p>
              </div>
              <div className="group relative rounded-2xl border border-yellow-200/50 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500 ring-1 ring-yellow-400/30">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Personalized Schedule</h3>
                <p className="mt-1.5 text-blue-900/70">Get a tailored study plan that fits your timeline and covers all necessary topics.</p>
              </div>
              <div className="group relative rounded-2xl border border-green-200/50 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-500/30">
                  <Youtube className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Curated Content</h3>
                <p className="mt-1.5 text-blue-900/70">Access the best educational videos and resources for each topic.</p>
              </div>
              <div className="group relative rounded-2xl border border-blue-200/40 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-600/20">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Expert Guidance</h3>
                <p className="mt-1.5 text-blue-900/70">Connect with consulting agents and personalized tutors for one-on-one support.</p>
              </div>
              <div className="group relative rounded-2xl border border-yellow-200/50 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500 ring-1 ring-yellow-400/30">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Community Support</h3>
                <p className="mt-1.5 text-blue-900/70">Join a community of like-minded peers pursuing similar career paths.</p>
              </div>
              <div className="group relative rounded-2xl border border-green-200/50 bg-white/80 backdrop-blur p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-500/30">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Comprehensive Resources</h3>
                <p className="mt-1.5 text-blue-900/70">Access practice tests, mock exams, and up-to-date study materials.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What you'll get */}
        <section className="relative w-full pt-14 md:pt-18 pb-10 md:pb-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_20%_0%,rgba(234,179,8,0.10),transparent),radial-gradient(900px_500px_at_100%_10%,rgba(59,130,246,0.12),transparent)]" />
          </div>
          <div className="relative container px-4 md:px-6 max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-blue-900">What you’ll get</h3>
                <p className="mt-2 text-blue-900/70">Everything you need to stay consistent and see progress.</p>
                <ul className="mt-6 grid gap-3">
                  {[
                    "Daily breakdown of topics and time",
                    "Curated videos per topic",
                    "Simple progress tracking",
                    "Room for revision and buffer days",
                    "Clean, distraction-free dashboards",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-400" />
                      <span className="text-blue-900/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-yellow-300/50 to-blue-300/50 blur opacity-40" />
                <div className="relative rounded-3xl border border-blue-200/50 bg-white/90 backdrop-blur p-6 shadow-xl">
                  {/* Today's Topics */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-blue-900">Today's Topics</div>
                    <div className="inline-flex items-center text-xs text-blue-900/60"><Clock className="mr-1 h-3.5 w-3.5" /> ~2 hrs</div>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {[
                      { title: "Newton's Laws of Motion", desc: 'Forces, friction, and free‑body diagrams', color: 'bg-blue-500', time: '30–35m' },
                      { title: 'Kinematics: Projectile Motion', desc: 'Range, time of flight, and peak height', color: 'bg-yellow-500', time: '25–30m' },
                      { title: 'Work, Energy, and Power', desc: 'Kinetic vs potential, conservation ideas', color: 'bg-green-500', time: '30–35m' },
                      { title: 'Momentum & Collisions', desc: 'Elastic vs inelastic, impulse basics', color: 'bg-blue-700', time: '20–25m' },
                    ].map((t) => (
                      <li key={t.title} className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-3 ring-1 ring-blue-100">
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
                          <div>
                            <div className="text-sm font-semibold text-blue-900">{t.title}</div>
                            <div className="text-xs text-blue-900/60">{t.desc}</div>
                          </div>
                        </div>
                        <span className="text-xs text-blue-900/60">{t.time}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-50 to-yellow-50 p-3 text-xs text-blue-900/80 ring-1 ring-blue-100">
                    Tip: Keep sessions short and focused. End with a quick recap to lock in learning.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works detail (existing component) */}
        <section id="journey" className="pt-16 md:pt-20 pb-12 md:pb-16 scroll-mt-28">
          <HowItWorks />
        </section>


        {/* Value section */}
        <section id="value" className="relative w-full pt-16 md:pt-20 pb-12 md:pb-16 lg:pb-20 scroll-mt-28 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
          {/* pattern overlay */}
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <div className="absolute inset-0 [background:linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(255,255,255,0.1)_calc(100%-1px))_0/100%_28px,linear-gradient(90deg,transparent_0,transparent_calc(100%-1px),rgba(255,255,255,0.08)_calc(100%-1px))_0/28px_100%] opacity-30" />
          </div>
          <div className="relative container px-4 md:px-6 max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-5">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  Your Success, Our Priority
                </h2>
                <p className="text-white/90 md:text-lg">
                  StudyMate is more than just a study planner. It's your personal academic assistant,
                  designed to help you achieve your goals efficiently and effectively.
                </p>
                <ul className="space-y-3 text-white/95">
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-300" /><span>Comprehensive study materials</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-300" /><span>One-on-one tutoring sessions</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-300" /><span>Supportive peer community</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-300" /><span>Practice tests and mock exams</span></li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-yellow-300 via-yellow-400 to-yellow-200 blur opacity-40"></div>
                  <div className="relative rounded-3xl bg-white p-6 shadow-2xl">
                    <div className="text-2xl font-bold mb-4 text-blue-700">Your Study Dashboard</div>
                    <div className="space-y-3">
                      <div className="h-4 rounded bg-gradient-to-r from-blue-100 to-blue-200"></div>
                      <div className="h-4 w-5/6 rounded bg-gradient-to-r from-blue-100 to-blue-200"></div>
                      <div className="h-4 w-4/6 rounded bg-gradient-to-r from-blue-100 to-blue-200"></div>
                    </div>
                    <div className="mt-6">
                      <div className="h-10 w-1/2 rounded bg-blue-600"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full pt-12 md:pt-16 pb-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative overflow-hidden rounded-3xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-yellow-50 p-8 md:p-12">
              <div className="absolute -inset-1 bg-[radial-gradient(400px_200px_at_10%_20%,rgba(59,130,246,0.10),transparent),radial-gradient(400px_200px_at_90%_60%,rgba(234,179,8,0.15),transparent)] animate-pulse [animation-duration:5s]" aria-hidden="true"></div>
              <div className="relative">
                <h3 className="text-2xl md:text-3xl font-extrabold text-blue-900">Make today your Day 1</h3>
                <p className="mt-2 text-blue-900/70 max-w-2xl">Generate a plan that fits your time and goals. Stay consistent and ship progress every day.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      if (isFinalNavigating) return;
                      setIsFinalNavigating(true);
                      router.push('/dashboard/calendar');
                    }}
                    aria-busy={isFinalNavigating}
                    disabled={isFinalNavigating}
                    className={`group bg-blue-600 hover:bg-blue-700 text-white h-12 px-7 font-semibold ${isFinalNavigating ? 'cursor-wait opacity-90' : ''}`}
                  >
                    {isFinalNavigating ? (
                      <span className="inline-flex items-center"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…</span>
                    ) : (
                      <span className="inline-flex items-center">Create your study plan<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" /></span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative w-full pt-10 md:pt-12 pb-16 md:pb-20 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(700px_400px_at_80%_10%,rgba(59,130,246,0.10),transparent)]" />
          </div>
          <div className="relative container px-4 md:px-6 max-w-6xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-900 text-center">Frequently asked questions</h3>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[{
                q: 'Do I need to pay to generate a plan?',
                a: 'No. You can start by creating a plan for your learning goal and explore how the schedule looks.'
              }, {
                q: 'Can I change my goal or timeline later?',
                a: 'Yes. You can regenerate a plan with a different timeline if your schedule changes.'
              }, {
                q: 'What kind of content is included?',
                a: 'Curated videos and structured topics to help you learn efficiently, with space for notes and revisions.'
              }, {
                q: 'Is my progress saved?',
                a: 'Your plan and progress are saved so you can pick up right where you left off.'
              }].map((f) => (
                <details key={f.q} className="group rounded-2xl border border-blue-200/50 bg-white/80 backdrop-blur p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-blue-900 font-semibold">
                    <span>{f.q}</span>
                    <span className="ml-4 text-blue-900/50 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="mt-3 text-blue-900/70">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-blue-100 bg-white">
        <div className="container px-4 md:px-6 py-12 max-w-6xl">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-blue-900 font-bold text-lg">Contact Us</h3>
              <p className="mt-2 text-blue-900/70">Feedback: shivanshgupta6372@gamil.com</p>
            </div>
            <div>
              <h3 className="text-blue-900 font-bold text-lg">Stay in the loop</h3>
              <p className="mt-2 text-blue-900/70">Get product updates and study tips.</p>
              <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input type="email" placeholder="Enter your email" className="bg-white" aria-label="Email address" />
                <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
              </form>
            </div>
            <div className="md:text-right">
              <h3 className="text-blue-900 font-bold text-lg">Follow Us</h3>
              <div className="mt-2 flex gap-4 md:justify-end">
                <Link href="https://github.com/shivansh-gupta4" className="text-blue-900/80 hover:text-blue-900">GitHub</Link>
                <Link href="https://x.com/shivanshgupta76" className="text-blue-900/80 hover:text-blue-900">Twitter</Link>
                <Link href="https://www.linkedin.com/in/shivansh-gupta07/" className="text-blue-900/80 hover:text-blue-900">LinkedIn</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between border-t border-blue-100 pt-6 text-sm text-blue-900/70">
            <span>© 2023 StudyMate. All rights reserved.</span>
            <span className="hidden sm:inline">Built for focus and progress.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
