"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "../button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Animate in on mount or route change
  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.from(containerRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [pathname] }
  );

  // Scroll-triggered hide/show behavior
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollTl = gsap.timeline({ paused: true });
      scrollTl.to(containerRef.current, { y: "-100%", opacity: 0 });

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 150) {
            scrollTl.play();
          } else if (self.direction === -1 || self.scroll() <= 150) {
            scrollTl.reverse();
          }
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="sticky top-0 z-50">
      <nav className="bg-white border-b-4 border-black shadow-[0px_2px_0px_0px_#000]">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 border-2 border-black"></div>
              <Link
                href="/"
                className="cursor-pointer bg-black text-white px-4 py-2 border-4 border-black font-black uppercase tracking-wide text-lg"
              >
                BRIAN KAINE
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/projects"
                className={`font-black uppercase tracking-wide text-sm transition-colors hover:text-gray-600 ${
                  pathname === "/projects" ? "text-lime-500" : ""
                }`}
              >
                MY WORK
              </Link>
              <Link
                href="/about"
                className={`font-black uppercase tracking-wide text-sm transition-colors hover:text-gray-600 ${
                  pathname === "/about" ? "text-lime-500" : ""
                }`}
              >
                ABOUT
              </Link>
              <Link
                href="/blog"
                className={`font-black uppercase tracking-wide text-sm transition-colors hover:text-gray-600 ${
                  pathname === "/blog" ? "text-lime-500" : ""
                }`}
              >
                BLOG
              </Link>
              <Button>
                <Link
                  href="/contact"
                  className={`${
                    pathname === "/contact" ? "text-lime-800" : ""
                  }`}
                >
                  CONTACT
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-black text-white border-4 border-black shadow-[4px_4px_0px_0px_#666] p-2 font-black uppercase text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {isMenuOpen ? "CLOSE" : "MENU"}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 bg-gray-900 border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6 relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
              <div className="space-y-4">
                <Link
                  href="/projects"
                  className={`block font-black uppercase tracking-wide transition-colors ${
                    pathname === "/projects"
                      ? "text-lime-400"
                      : "text-white hover:text-lime-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  MY WORK
                </Link>
                <Link
                  href="/about"
                  className={`block font-black uppercase tracking-wide transition-colors ${
                    pathname === "/about"
                      ? "text-lime-400"
                      : "text-white hover:text-lime-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ABOUT
                </Link>
                <Link
                  href="/blog"
                  className={`block font-black uppercase tracking-wide transition-colors ${
                    pathname === "/blog"
                      ? "text-lime-400"
                      : "text-white hover:text-lime-400"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  BLOG
                </Link>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  <button
                    className={`w-full border-4 border-black shadow-[4px_4px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-sm mt-4 transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none ${
                      pathname === "/contact"
                        ? "bg-lime-600 text-white"
                        : "bg-lime-400 text-black"
                    }`}
                  >
                    CONTACT
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
