"use client";
import Link from "next/link";
import { Button } from "./button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 py-20 px-8 relative overflow-hidden">
      {/* Background accent elements */}
      <div className="absolute top-8 left-8 w-16 h-16 bg-lime-400 border-4 border-black transform rotate-12"></div>
      <div className="absolute bottom-12 right-16 w-12 h-12 bg-white border-4 border-black"></div>
      <div className="absolute top-1/2 right-8 w-6 h-6 bg-orange-500 border-2 border-black transform rotate-45"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left side - CTA */}
          <div>
            <div className="bg-black text-white border-4 border-white shadow-[12px_12px_0px_0px_#333] p-8 relative mb-8">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-2 border-white"></div>

              <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-wider mb-4">
                LET&apos;S BUILD
                <br />
                SOMETHING EPIC
              </h3>

              <p className="font-mono text-sm leading-relaxed mb-6 text-gray-300">
                GOT A PROJECT IDEA? NEED A DEVELOPER WHO ACTUALLY GETS IT DONE?
                LET&apos;S TALK.
              </p>

              <Button className="bg-lime-400 text-black border-white">
                <Link href="/contact">START A PROJECT</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Links & Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Navigation Links */}
            <div className="bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6 relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-black"></div>

              <h4 className="text-lg font-black uppercase tracking-wide mb-4">
                NAVIGATE
              </h4>

              <div className="space-y-2">
                <Link
                  href="/about"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                >
                  ABOUT
                </Link>
                <Link
                  href="/projects"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                >
                  WORK
                </Link>
                <Link
                  href="/blog"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                >
                  BLOG
                </Link>
                <Link
                  href="/contact"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-600 transition-colors"
                >
                  CONTACT
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-lime-400 text-black border-4 border-black shadow-[8px_8px_0px_0px_#000] p-6 relative">
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black"></div>

              <h4 className="text-lg font-black uppercase tracking-wide mb-4">
                CONNECT
              </h4>

              <div className="space-y-2">
                <a
                  href="https://github.com/briankaine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-800 transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/briankaine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-800 transition-colors"
                >
                  LINKEDIN
                </a>
                <a
                  href="https://twitter.com/briankaine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-800 transition-colors"
                >
                  TWITTER
                </a>
                <a
                  href="mailto:hello@briankaine.dev"
                  className="block font-mono text-sm uppercase tracking-wide hover:text-gray-800 transition-colors"
                >
                  EMAIL
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-4 border-white pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="bg-black text-white border-4 border-white shadow-[6px_6px_0px_0px_#333] px-6 py-3 relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 border border-white"></div>
              <p className="font-mono text-xs uppercase tracking-wide">
                © {currentYear} BRIAN KAINE. ALL RIGHTS RESERVED.
              </p>
            </div>

            {/* Fun tagline */}
            <div className="font-mono text-xs text-gray-400 uppercase tracking-wide">
              CRAFTED WITH ❤️ AND TOO MUCH CAFFEINE
            </div>
          </div>
        </div>

        {/* Code signature */}
        <div className="mt-8 text-center">
          <div className="bg-black text-lime-400 border-4 border-white shadow-[10px_10px_0px_0px_#333] p-4 font-mono text-xs inline-block relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-500 border-2 border-white transform rotate-12"></div>
            <div className="text-gray-500 mb-1">{"// end of awesome"}</div>
            <div>
              <span className="text-blue-400">console</span>
              <span className="text-white">.</span>
              <span className="text-yellow-400">log</span>
              <span className="text-white">(</span>
              <span className="text-green-300">
                {"Thanks for scrolling this far! 🚀"}
              </span>
              <span className="text-white">);</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
