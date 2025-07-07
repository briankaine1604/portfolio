"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useRef } from "react";

gsap.registerPlugin(TextPlugin);

export const CodeBlock = ({ className = "" }: { className?: string }) => {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  const codeLines = [
    { text: `const developer = {`, color: "text-lime-400" },
    {
      text: `  name: `,
      color: "text-lime-400",
      append: { text: `'Brian'`, color: "text-green-300" },
      end: ",",
    },
    { text: `  skills: [`, color: "text-lime-400" },
    {
      text: `    `,
      color: "text-lime-400",
      skills: [
        { text: `'React'`, color: "text-green-300" },
        { text: `'Node.js'`, color: "text-green-300" },
        { text: `'Next.js'`, color: "text-green-300" },
      ],
    },
    {
      text: `    `,
      color: "text-lime-400",
      skills: [
        { text: `'TypeScript'`, color: "text-green-300" },
        { text: `'Python'`, color: "text-green-300" },
        { text: `'PHP'`, color: "text-green-300" },
      ],
    },
    {
      text: `    `,
      color: "text-lime-400",
      skills: [
        { text: `'Tanstack Query'`, color: "text-green-300" },
        { text: `'TRPC'`, color: "text-green-300" },
        { text: `'and others'`, color: "text-green-300" },
      ],
    },
    { text: `  ],`, color: "text-lime-400" },
    {
      text: `  passion: `,
      color: "text-lime-400",
      append: { text: `'building_cool_stuff'`, color: "text-green-300" },
    },
    { text: `};`, color: "text-lime-400" },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "none" } });

    codeLines.forEach((line, i) => {
      let fullText = line.text;

      if (line.skills) {
        fullText += line.skills.map((s) => s.text).join(", ");
      } else if (line.append) {
        fullText += line.append.text;
      }

      if (line.end) fullText += line.end;

      tl.to(linesRef.current[i], {
        text: { value: fullText },
        duration: fullText.length * 0.05,
      });

      tl.to({}, { duration: 0.2 });
    });

    tl.to(cursorRef.current, {
      opacity: 0,
      repeat: -1,
      yoyo: true,
      duration: 0.5,
    });
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="bg-black min-h-[400px] text-lime-400 border-4 border-black shadow-[12px_12px_0px_0px_#666] p-6 font-mono text-sm relative">
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 border-2 border-black" />

        {/* Filename */}
        <div className="text-gray-400 mb-2">{"//portfolio.ts"}</div>

        {/* Cursor */}
        <div className="min-h-[1rem] mb-1">
          <span ref={cursorRef} className="inline-block text-white">
            |
          </span>
        </div>

        {/* Lines */}
        <div className="space-y-1">
          {codeLines.map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                linesRef.current[i] = el;
              }}
              className={`whitespace-pre min-h-[1rem] ${line.color}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
