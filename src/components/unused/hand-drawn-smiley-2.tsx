// components/HandDrawnSmiley.jsx
"use client";

export default function HandDrawnSmiley2({ size = 100, strokeWidth = 2 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      stroke="black"
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="hand-drawn-svg"
    >
      {/* Tighter head circle with subtle imperfections */}
      <path
        d="M50,25 
               a25,25 0 0,1 20,10 
               a25,25 0 0,1 5,15 
               a25,25 0 0,1 -15,20 
               a25,25 0 0,1 -20,-5 
               a25,25 0 0,1 -10,-20 
               a25,25 0 0,1 10,-15 
               a25,25 0 0,1 10,-5"
      />

      {/* Playful eyes - slightly uneven */}
      <path d="M38,45 q2,-1 4,0" />
      <path d="M58,43 q2,1 4,0" />

      {/* Smirk mouth - more personality */}
      <path d="M40,65 q5,3 20,-2" />
    </svg>
  );
}
