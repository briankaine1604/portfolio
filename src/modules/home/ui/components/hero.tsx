"use client";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/button";
gsap.registerPlugin(ScrollTrigger);

const skillsRotation = [
  "FULLSTACK",
  "FRONTEND",
  "NEXT.JS",
  "BACKEND",
  "TYPESCRIPT",
  "REACT",
  "NODE.JS",
  "GSAP",
  "PAYLOAD",
  "ECOMMERCE",
];

const TypewriterText = ({
  words,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}: {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    // Animate cursor with GSAP instead of CSS
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, []);

  useEffect(() => {
    const word = words[index];
    if (pause) {
      const t = setTimeout(() => {
        setPause(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(t);
    }

    if (isDeleting) {
      if (displayText.length > 0) {
        const t = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    } else {
      if (displayText.length < word.length) {
        const t = setTimeout(() => {
          setDisplayText(word.slice(0, displayText.length + 1));
        }, speed);
        return () => clearTimeout(t);
      } else {
        setPause(true);
      }
    }
  }, [
    displayText,
    isDeleting,
    pause,
    words,
    index,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  return (
    <span className="text-red-500">
      {displayText}
      <span ref={cursorRef}>|</span>
    </span>
  );
};

const CodeBlock = () => {
  const codeRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (codeRef.current) {
      gsap.from(codeRef.current, {
        scrollTrigger: {
          trigger: codeRef.current,
          start: "top 80%", // trigger when top of block hits 80% viewport
          toggleActions: "play none none reset",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    }

    gsap.from(linesRef.current, {
      scrollTrigger: {
        trigger: codeRef.current,
        start: "top 80%",
        toggleActions: "play none none reset",
      },
      opacity: 0,
      x: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={codeRef}
      className="bg-gray-900 text-green-400 p-6 font-mono text-sm border-4 border-black shadow-[8px_8px_0px_0px_#000] relative overflow-hidden mt-3"
    >
      <div className="absolute top-2 left-2 flex gap-2">
        <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      <div className="mt-6">
        <div
          ref={(el) => {
            linesRef.current[0] = el!;
          }}
          className="text-blue-400"
        >
          const
        </div>
        <div
          ref={(el) => {
            linesRef.current[1] = el!;
          }}
          className="text-yellow-400 ml-2"
        >
          developer = {"{"}
        </div>
        <div
          ref={(el) => {
            linesRef.current[2] = el!;
          }}
          className="ml-4 text-green-400"
        >
          name: {"Brian"},
        </div>
        <div
          ref={(el) => {
            linesRef.current[3] = el!;
          }}
          className="ml-4 text-green-400"
        >
          skills: [{"React"}, {"Node"}],
        </div>
        <div
          ref={(el) => {
            linesRef.current[4] = el!;
          }}
          className="ml-4 text-green-400"
        >
          passion: {"Building cool stuff"}
        </div>
        <div
          ref={(el) => {
            linesRef.current[5] = el!;
          }}
          className="text-yellow-400"
        >
          {"}"}
        </div>
      </div>
    </div>
  );
};

export default function PortfolioHero() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const decorElementsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(() => {
    // Create a timeline for orchestrated animations
    const tl = gsap.timeline();

    // Container entrance
    if (containerRef.current) {
      tl.from(containerRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    // Headline animation
    if (headlineRef.current) {
      tl.from(
        headlineRef.current.children,
        {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.5"
      );
    }

    // Skill/typewriter container
    if (skillRef.current) {
      tl.from(
        skillRef.current,
        {
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );
    }

    // Description text
    if (descriptionRef.current) {
      tl.from(
        descriptionRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    // Stats cards
    tl.from(
      cardsRef.current,
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Decorative elements
    gsap.from(decorElementsRef.current, {
      scale: 0,
      rotation: 45,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 1.8,
      ease: "back.out(1.7)",
    });

    // Floating animation for decorative elements
    gsap.to(decorElementsRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.5,
      delay: 2.5,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div
          ref={containerRef}
          className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 md:p-12 relative"
        >
          <div
            ref={(el) => {
              decorElementsRef.current[0] = el!;
            }}
            className="absolute -top-3 -right-3 w-12 h-12 bg-lime-500 border-4 border-black"
          />
          <div
            ref={(el) => {
              decorElementsRef.current[1] = el!;
            }}
            className="absolute -bottom-2 -left-2 w-8 h-8 bg-black"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-12 items-center">
            <div>
              <div className="mb-4">
                <h1
                  ref={headlineRef}
                  className="text-6xl lg:text-7xl font-black uppercase tracking-wider leading-none mb-4"
                >
                  <span className="block">HI, I&apos;M</span>
                  <span className="block text-5xl lg:text-6xl">BRIAN</span>
                </h1>
                <div className="w-24 h-2 bg-lime-500 mb-6"></div>
              </div>

              <div
                ref={skillRef}
                className="text-xl lg:text-2xl font-black uppercase tracking-wide mb-6 text-gray-700"
              >
                <div className="flex flex-wrap items-center gap-2">
                  YOUR NEXT
                  <span className="inline-block relative h-8 w-48 px-2">
                    <span className="font-black font-mono">
                      <TypewriterText words={skillsRotation} />
                    </span>
                  </span>
                </div>
                <div>DEVELOPER</div>
              </div>

              <p
                ref={descriptionRef}
                className="text-base font-mono leading-relaxed mb-4 max-w-lg"
              >
                I BUILD ROBUST, SCALABLE WEB APPLICATIONS THAT DON&apos;T JUST
                WORK—THEY PERFORM. FROM REACT FRONTENDS TO NODE.JS BACKENDS, I
                CRAFT DIGITAL EXPERIENCES THAT USERS ACTUALLY WANT TO USE.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-red-500" onClick={scrollToProjects}>
                  VIEW WORK
                </Button>
                <Button className="bg-gray-900 text-white">
                  <Link href={"/contact"}>GET IN TOUCH</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <CodeBlock />
              <div
                ref={(el) => {
                  decorElementsRef.current[2] = el!;
                }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-lime-500 border-4 border-black transform rotate-12"
              ></div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-4 border-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "♾️",
                  label: "PROJECTS SHIPPED",
                  className: "bg-gray-900 text-white",
                  accent: (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-500 border-2 border-black"></div>
                  ),
                },
                {
                  icon: "3+",
                  label: "YEARS EXPERIENCE",
                  className: "bg-lime-500 text-white",
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
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      y: -1,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      y: 0,
                      duration: 0.3,
                      ease: "power2.out",
                    });
                  }}
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
