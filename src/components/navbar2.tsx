"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { Button } from "./button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react"; // Import useGSAP

gsap.registerPlugin(ScrollTrigger);

export default function Navbar2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the main container wrapping the navbar

  // useGSAP hook for animations
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut", duration: 0.3 },
      });

      // Animate the container (which holds the sticky navbar)
      // to hide it by moving it up and fading it out
      tl.to(containerRef.current, { y: "-100%", opacity: 0 });

      ScrollTrigger.create({
        start: "top top", // Trigger from the top of the viewport
        end: "max", // Continue till the end of the page
        onUpdate: (self) => {
          // Only trigger hiding if scrolled down significantly
          if (self.direction === 1 && self.scroll() > 150) {
            tl.play(); // Play timeline to hide
          } else if (self.direction === -1 || self.scroll() <= 150) {
            // If scrolling up or at the top threshold
            tl.reverse(); // Reverse timeline to show
          }
        },
        // markers: true, // For debugging - remove in production
      });
    },
    { scope: containerRef }
  ); // Associate the animation with the containerRef

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      ref={containerRef} // Attach the ref here
      className="px-8 pt-4 bg-gray-100 sticky top-0 z-50"
    >
      <nav className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] relative max-w-6xl mx-auto">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="relative">
              <Link
                href="/"
                className="bg-black text-white px-4 py-2 border-4 border-black font-black uppercase tracking-wide text-lg"
              >
                BRIAN KAINE
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/about"
                className="font-black uppercase tracking-wide text-sm hover:text-gray-400 transition-colors"
              >
                ABOUT
              </a>
              <a
                href="/blog"
                className="font-black uppercase tracking-wide text-sm hover:text-gray-400 transition-colors"
              >
                BLOG
              </a>
              <a
                href="/projects"
                className="font-black uppercase tracking-wide text-sm hover:text-gray-400 transition-colors"
              >
                WORK
              </a>

              {/* Contact button */}
              <Button className="bg-lime-400">
                <Link href={"/contact"}>CONTACT</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden bg-black text-white border-4 border-black shadow-[4px_4px_0px_0px_#666] p-2 font-black uppercase text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {isMenuOpen ? "CLOSE" : "MENU"}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-6 bg-gray-900 border-4 border-black shadow-[8px_8px_0px_0px_#666] p-6 relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-400 border-2 border-black"></div>
              {/**Routes */}
              <div className="space-y-4">
                <a
                  href="/about"
                  className="block font-black uppercase tracking-wide text-white hover:text-lime-400 transition-colors"
                >
                  ABOUT
                </a>

                <a
                  href="/blog"
                  className="block font-black uppercase tracking-wide text-white hover:text-lime-400 transition-colors"
                >
                  BLOG
                </a>
                <a
                  href="/projects"
                  className="block font-black uppercase tracking-wide text-white hover:text-lime-400 transition-colors"
                >
                  MY WORK
                </a>
                <Button className="bg-lime-400">
                  <Link href={"/contact"}>CONTACT</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Decorative corner elements */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 border-4 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black"></div>
      </nav>
    </div>
  );
}
