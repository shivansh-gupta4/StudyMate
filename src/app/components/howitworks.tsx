"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Goal",
      description: "Select what you want to learn - from Data Structures & Algorithms to Machine Learning, or any other topic.",
      highlight: "Learn DSA in 30 days",
      image: "/set your goal.png"
    },
    {
      step: "02", 
      title: "Get Your Plan",
      description: "Our AI generates a structured daily study plan breaking down complex topics into manageable chunks.",
      highlight: "Personalized daily schedule",
      image: "/make-plan.png"
    },
    {
      step: "03",
      title: "Learn & Track",
      description: "Follow curated YouTube videos, take notes, use our AI summarizer, and track your progress daily.",
      highlight: "Smart learning tools",
      image: "/learn-track.png"
    },
    {
      step: "04",
      title: "Achieve Success",
      description: "Stay consistent with our progress tracking and detailed reports to master your chosen topic.",
      highlight: "Measurable results",
      image: "/achieve-success-.png"
    }
  ];

  const [visible, setVisible] = useState<boolean[]>(() => steps.map(() => false));
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const indexAttr = entry.target.getAttribute("data-index");
          if (!indexAttr) return;
          const idx = parseInt(indexAttr, 10);
          if (entry.isIntersecting) {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <section className="relative overflow-hidden py-14 md:py-18 lg:py-24">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Your Learning Journey</span>
            <span className="ml-2 text-blue-900">in 4 Steps</span>
          </h2>
          <p className="mt-3 text-blue-900/70 max-w-3xl mx-auto">
            Structured, efficient, and enjoyable—so you keep moving forward every day.
          </p>
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Center timeline line */}
          <div className="pointer-events-none absolute left-1/2 top-0 -ml-px h-full w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-yellow-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Node */}
              <div className="absolute left-1/2 top-1 -translate-x-1/2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-blue-600 to-yellow-400 ring-4 ring-white" />
              </div>

              <div
                ref={(el) => {
                  refs.current[index] = el;
                }}
                data-index={index}
                className={`relative grid grid-cols-1 lg:grid-cols-2 items-center gap-8 sm:gap-10 py-8 lg:py-12 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Step content */}
                <div
                  className={`transform-gpu transition-all duration-700 ease-out ${
                    visible[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/20 text-blue-900 ring-1 ring-yellow-400/40 px-4 py-1.5 font-semibold">
                    <span className="text-xs">STEP</span>
                    <span className="text-base">{step.step}</span>
                  </div>
                  <h3 className="mt-3 text-2xl md:text-3xl font-bold text-blue-900">{step.title}</h3>
                  <p className="mt-2 text-blue-900/70 leading-relaxed">{step.description}</p>
                  <div className="mt-3 inline-flex rounded-lg bg-blue-50 px-4 py-2 text-blue-900 font-medium ring-1 ring-blue-100">
                    {step.highlight}
                  </div>
                </div>

                {/* Step visual */}
                <div
                  className={`group relative mx-auto flex w-full max-w-md items-center justify-center transform-gpu transition-all duration-700 ease-out ${
                    visible[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-blue-200 to-yellow-200 blur opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-full rounded-2xl border border-blue-200/40 bg-white/80 p-4 shadow-lg backdrop-blur transform transition-transform group-hover:-rotate-1 group-hover:scale-[1.01]">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={480}
                      height={320}
                      className="mx-auto h-auto w-full max-w-[320px] sm:max-w-[360px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Final connector arrow */}
          <div className="mt-2 flex justify-center">
            <ArrowRight className="h-7 w-7 text-yellow-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;