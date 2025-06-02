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

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-9">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Your Learning Journey in <span className="text-yellow-500">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From goal setting to achievement - we make learning structured, efficient, and enjoyable
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`flex flex-col lg:flex-row items-center gap-12 py-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                {/* Step Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-block bg-yellow-500 text-blue-900 font-bold text-lg px-4 py-2 rounded-full mb-4">
                    Step {step.step}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="inline-block bg-blue-50 text-blue-900 px-4 py-2 rounded-lg font-medium">
                    {step.highlight}
                  </div>
                </div>

                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={320}
                      height={240}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-4">
                  <ArrowRight className="h-8 w-8 text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;