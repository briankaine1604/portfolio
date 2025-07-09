"use client";
import { Button } from "@/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function About() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 relative inline-block">
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black"></div>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-wider">
              ABOUT ME
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Main bio block */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-lime-400 border-2 border-black"></div>

              <h2 className="text-2xl font-black uppercase tracking-wide mb-6 border-b-2 border-black pb-2">
                MY STORY
              </h2>

              <div className="space-y-4 font-mono text-sm leading-relaxed">
                <p>
                  I’M BRIAN — A WEB DEVELOPER WITH A LOVE FOR CODE, COMPONENTS,
                  AND THE KIND OF TECH STACKS THAT JUST *MAKE SENSE*. I
                  GRADUATED FROM COVENANT UNIVERSITY, NIGERIA WITH A B.ENG IN
                  COMPUTER ENGINEERING, AND I FLOAT BETWEEN PORT HARCOURT AND
                  LAGOS.
                </p>

                <p>
                  I STARTED WITH AN E-COMMERCE TUTORIAL YEARS AGO, AND IT
                  SPIRALED INTO OBSESSIONS LIKE TYPING EVERYTHING, INFUSING AI,
                  AND SEEING HOW FAR I CAN SELF-HOST WITHOUT TOUCHING AWS. IF I
                  CAN DEPLOY IT WITH COOLIFY ON A VPS, BEST BELIEVE I’M DOING
                  THAT.
                </p>

                <p>
                  I’M A NIGHT CODER. DAYLIGHT IS FOR INSPIRATION — MIDNIGHT IS
                  FOR CREATION. WHETHER I’M MESSING WITH TRPC, EXPLORING PAYLOAD
                  CMS, OR SPINNING UP A DOCKERIZED MONSTER, I’M ALWAYS BUILDING
                  SOMETHING... OR BREAKING IT.
                </p>

                <p>
                  I’M BIG ON MUSIC, GAMING (FIFA STRICTLY), AND MOVIES THAT
                  EITHER EXPLODE OR BEND YOUR MIND — SOMETIMES BOTH. MY
                  DEBUGGING STYLE? LET’S JUST SAY I HIT THE AI BUTTON BEFORE
                  PANICKING. IT’S 2025. WHY SUFFER ALONE?
                </p>

                <p>
                  RIGHT NOW, I’M MOVING TOWARD AI-INFUSED APPS — BRIDGING THAT
                  GAP BETWEEN THE WEB I BUILD AND THE INTELLIGENCE I WANT IT TO
                  SHOW. THAT’S THE NEXT CHAPTER.
                </p>

                <p>
                  STILL CURIOUS? ASK ME ANYTHING. I’VE GOT HOT TAKES ON STACKS,
                  STRONG FEELINGS ABOUT SELF-HOSTING, AND A TODO LIST FULL OF
                  PROJECTS I MAY NEVER FINISH — BUT I’M HAVING FUN ANYWAY.
                </p>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="bg-gray-900 border-4 border-black shadow-[12px_12px_0px_0px_#666] p-8 relative">
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black"></div>

              <h3 className="text-xl font-black uppercase tracking-wide mb-6 text-white border-b-2 border-white pb-2">
                TECH STACK
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black text-lime-400 border-2 border-lime-400 p-3 font-mono text-xs">
                  <div className="font-black">FRONTEND</div>
                  <div className="mt-1">
                    React • Next.js • TypeScript • Laravel x Blade • HTML •
                    Javascript
                  </div>
                </div>
                <div className="bg-black text-lime-400 border-2 border-lime-400 p-3 font-mono text-xs">
                  <div className="font-black">BACKEND</div>
                  <div className="mt-1">
                    Node.js • Hono.js • Bun • PHP • Laravel • Mongo DB •
                    PostgreSQL • Prisma • Drizzle • Payload
                  </div>
                </div>
                <div className="bg-black text-lime-400 border-2 border-lime-400 p-3 font-mono text-xs">
                  <div className="font-black">TOOLS</div>
                  <div className="mt-1">Docker • Coolify • Git </div>
                </div>
                <div className="bg-black text-lime-400 border-2 border-lime-400 p-3 font-mono text-xs">
                  <div className="font-black">DESIGN</div>
                  <div className="mt-1">GSAP • CSS • Tailwind • UI/UX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="space-y-8">
            {/* Image placeholder */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-4 relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-black"></div>
              <div className="aspect-square bg-gray-200 border-4 border-black flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/potrait.webp"
                  alt="cartoon profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Stats boxes */}
            <div className="space-y-4">
              <div className="bg-lime-400 border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 relative">
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-black"></div>
                <div className="text-3xl font-black">20+</div>
                <div className="font-mono text-xs uppercase tracking-wide">
                  PROJECTS COMPLETED
                </div>
              </div>

              <div className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6 relative">
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-lime-400 border-2 border-black"></div>
                <div className="text-3xl font-black">3+</div>
                <div className="font-mono text-xs uppercase tracking-wide">
                  YEARS EXPERIENCE
                </div>
              </div>

              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6">
                <div className="text-3xl font-black">∞</div>
                <div className="font-mono text-xs uppercase tracking-wide">
                  COFFEE CONSUMED (It&apos;s a lie we don&apos;t drink coffee in
                  Nigeria)
                </div>
              </div>
            </div>

            {/* Philosophy block */}
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-6 relative">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black transform rotate-45"></div>

              <h4 className="font-black uppercase tracking-wide mb-4 text-sm">
                PHILOSOPHY
              </h4>
              <blockquote className="font-mono uppercase text-xs leading-relaxed border-l-4 border-black pl-4">
                &quot;Client meet Brian. Brian happy. Brian build. Client happy.
                Client pay. Brian happier. Everybody happy.&quot;
              </blockquote>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gray-900 border-4 border-black shadow-[8px_8px_0px_0px_#666] p-8 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-lime-400 border-4 border-black"></div>

          <h3 className="text-2xl font-black uppercase tracking-wide text-white mb-4">
            LET&apos;S BUILD SOMETHING
          </h3>

          <p className="font-mono text-sm text-gray-300 mb-6 max-w-2xl mx-auto">
            READY TO TURN YOUR IDEAS INTO REALITY? I&apos;M ALWAYS EXCITED TO
            WORK ON NEW PROJECTS AND COLLABORATE WITH FELLOW CREATORS.
          </p>

          <Button
            variant={"inverse"}
            className=" bg-lime-400"
            onClick={() => router.push("/contact")}
          >
            START A PROJECT
          </Button>
        </div>
      </div>
    </div>
  );
}
