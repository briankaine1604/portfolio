import { Status } from "@/modules/types";
import Image from "next/image";
import React from "react";
// Adjust the path to wherever it's exported

type ProjectCardProps = {
  title: string;
  description: string;
  tech: string[];
  status: Status;
  liveUrl?: string;
  githubUrl?: string;
  thumbnail?: string;
  slug?: string;
};

const badgeColors: Record<Status, string> = {
  LIVE: "bg-lime-400",
  IN_PROGRESS: "bg-yellow-400",
  COMPLETED: "bg-blue-400",
  ARCHIVED: "bg-gray-400",
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  tech,
  status,
  liveUrl,
  githubUrl,
  thumbnail,
  slug,
}) => {
  return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all duration-200 relative group cursor-pointer">
      {/* Status badge */}
      <div
        className={`absolute -top-2 -right-2 px-3 py-1 border-2 border-black font-black text-xs uppercase tracking-wide ${badgeColors[status]}`}
      >
        {status}
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black"></div>

      <div className="p-8">
        {/* Thumbnail or terminal fallback */}
        {thumbnail ? (
          <div className="h-48 border-4 border-black mb-6 relative overflow-hidden bg-gray-200">
            <Image
              src={thumbnail}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
          </div>
        ) : (
          <div className="bg-gray-900 border-4 border-black h-48 mb-6 relative overflow-hidden">
            <div className="absolute inset-4 bg-black border-2 border-lime-400">
              <div className="p-4 font-mono text-xs text-lime-400">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <div className="text-gray-400">
                    ~/projects/{slug ?? title.toLowerCase()}
                  </div>
                </div>
                <div className="space-y-1">
                  <div>$ npm run build</div>
                  <div className="text-green-400">✓ Build successful</div>
                  <div>$ npm run deploy</div>
                  <div className="text-green-400">✓ Deployed to production</div>
                  <div className="text-gray-400 mt-2">[{tech.join(" • ")}]</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project info */}
        <h3 className="text-2xl font-black uppercase tracking-wide mb-3">
          {title}
        </h3>
        <p className="font-mono text-sm leading-relaxed mb-4 text-gray-700">
          {description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tech.map((item, i) => (
            <span
              key={i}
              className="bg-gray-900 text-lime-400 border-2 border-black px-2 py-1 font-mono text-xs font-black uppercase"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-lime-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              VIEW LIVE
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] px-4 py-2 font-black uppercase tracking-wide text-xs transform transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              CODE
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
