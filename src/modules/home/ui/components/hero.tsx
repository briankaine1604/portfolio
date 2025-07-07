"use client";
import { Button } from "@/components/button";
import { CodeBlock } from "./code-block";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function PortfolioHero() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: cardsRef.current[0]?.parentElement, // grid container
        start: "top 80%", // trigger when top of grid hits 80% of viewport
        toggleActions: "play none none none", // only play once
      },
    });
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Main hero container */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-12 relative">
          {/* Decorative accent elements */}
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-lime-400 border-4 border-black"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black"></div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <div className="mb-6">
                <h1 className="text-6xl lg:text-7xl font-black uppercase tracking-wider leading-none mb-4">
                  HI, I&apos;M
                  <br />
                  <div className="text-5xl lg:text-6xl flex items-center">
                    BRIAN
                    {/* <HandDrawnSmiley size={85} strokeWidth={3} /> */}
                  </div>
                </h1>
                <div className="w-24 h-2 bg-lime-400 mb-6"></div>
              </div>

              <h2 className="text-xl lg:text-2xl font-black uppercase tracking-wide mb-8 text-gray-700">
                YOUR NEXT FULLSTACK
                <br />
                DEVELOPER
              </h2>

              <p className="text-base font-mono leading-relaxed mb-5 max-w-lg">
                I BUILD ROBUST, SCALABLE WEB APPLICATIONS THAT DON&apos;T JUST
                WORK—THEY PERFORM. FROM REACT FRONTENDS TO NODE.JS BACKENDS, I
                CRAFT DIGITAL EXPERIENCES THAT USERS ACTUALLY WANT TO USE.
              </p>
              {/* <p className="mt-4 mb-5 text-xs italic font-mono text-gray-600">
                That drawing? Yeah… I just had to use it somewhere 😂
              </p> */}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="accent"
                  onClick={() => alert("Opening portfolio...")}
                >
                  VIEW WORK
                </Button>
                <Button
                  variant="primary"
                  onClick={() => alert("Opening contact...")}
                >
                  GET IN TOUCH
                </Button>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              {/* Main code block */}
              <CodeBlock />

              {/* Floating accent elements */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-lime-400 border-4 border-black transform rotate-12"></div>
            </div>
          </div>

          {/* Bottom stats section */}
          <div className="mt-12 pt-8 border-t-4 border-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "♾️",
                  label: "PROJECTS SHIPPED",
                  className: "bg-gray-900 text-white",
                  accent: (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 border-2 border-black"></div>
                  ),
                },
                {
                  icon: "3+",
                  label: "YEARS EXPERIENCE",
                  className: "bg-lime-400 text-black",
                },
                {
                  icon: "24/7",
                  label: "PROBLEM SOLVER",
                  className: "bg-white text-black",
                  accent: (
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-black"></div>
                  ),
                },
              ].map((card, i) => (
                <div
                  key={card.label}
                  ref={(el) => {
                    cardsRef.current[i] = el!;
                  }}
                  className={`${card.className} border-4 border-black shadow-[6px_6px_0px_0px_#000] p-4 relative`}
                >
                  {card.accent}
                  <div className="text-2xl font-black">{card.icon}</div>
                  <div className="text-xs font-mono uppercase tracking-wide">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
