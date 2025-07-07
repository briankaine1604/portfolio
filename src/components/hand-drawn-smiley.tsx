"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HandDrawnSmileyProps {
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  fillColor?: string;
  autoStart?: boolean;
  delay?: number;
  className?: string;
}

export default function HandDrawnSmiley({
  size = 100,
  strokeWidth = 2,
  strokeColor = "black",
  fillColor = "none",
  autoStart = true,
  delay = 0,
  className = "",
}: HandDrawnSmileyProps) {
  const refs = {
    head: useRef<SVGPathElement>(null),
    leftEye: useRef<SVGPathElement>(null),
    rightEye: useRef<SVGPathElement>(null),
    smile: useRef<SVGPathElement>(null),
    svg: useRef<SVGSVGElement>(null),
  };

  const [hasAnimated, setHasAnimated] = useState(false);

  const drawPath = (path: SVGPathElement | null, duration: number) => {
    if (!path) return;
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    return gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      ease: "power2.out",
    });
  };

  const animate = () => {
    if (hasAnimated) return;

    const tl = gsap.timeline({
      delay,
      onComplete: () => setHasAnimated(true),
    });

    const headTween = drawPath(refs.head.current, 2);
    if (headTween) tl.add(headTween);

    tl.to({}, { duration: 0.3 });

    const leftEyeTween = drawPath(refs.leftEye.current, 0.4);
    if (leftEyeTween) tl.add(leftEyeTween);

    tl.to({}, { duration: 0.2 });

    const rightEyeTween = drawPath(refs.rightEye.current, 0.4);
    if (rightEyeTween) tl.add(rightEyeTween);

    tl.to({}, { duration: 0.4 });

    const smileTween = drawPath(refs.smile.current, 1);
    if (smileTween) tl.add(smileTween);

    // subtle bounce at the end
    tl.to(refs.svg.current, { scale: 1.05, duration: 0.2 });
    tl.to(refs.svg.current, { scale: 1, duration: 0.2 });
  };

  const reset = () => {
    [refs.head, refs.leftEye, refs.rightEye, refs.smile].forEach((r) => {
      if (!r.current) return;
      gsap.killTweensOf(r.current);
      const length = r.current.getTotalLength();
      gsap.set(r.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });
    });
    setHasAnimated(false);
  };

  useGSAP(() => {
    if (autoStart) animate();
  }, []);

  return (
    <div className={`inline-block ${className}`}>
      <svg
        ref={refs.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        stroke={strokeColor}
        fill={fillColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Animated smiley face"
        className="transition-transform duration-200 hover:scale-105 cursor-pointer"
        onClick={() => (hasAnimated ? reset() : animate())}
      >
        <path
          ref={refs.head}
          d="M60,32a30,30 0 0,1 8,42 a30,30 0 0,1 -36,-8 a30,30 0 0,1 -2,-34"
          opacity="0"
        />
        <path ref={refs.leftEye} d="M37,42c1.5,-1 3,0.2 3.5,1.5" opacity="0" />
        <path ref={refs.rightEye} d="M57,42c1.5,-1 3,0.2 3.5,1.5" opacity="0" />
        <path ref={refs.smile} d="M40,63c3,3 12,4 20,-1" opacity="0" />
      </svg>
    </div>
  );
}
