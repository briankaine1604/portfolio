// components/Smiley.js
export function Smiley() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      stroke="black"
      width={100}
      height={100}
      strokeWidth="2"
      fill="none"
      className="smiley-svg" // Add class for GSAP targeting
    >
      <circle cx="50" cy="50" r="30" />
      <circle cx="40" cy="40" r="2" fill="black" />
      <circle cx="60" cy="40" r="2" fill="black" />
      <path d="M40 60 Q50 70 60 60" strokeLinecap="round" />
    </svg>
  );
}
