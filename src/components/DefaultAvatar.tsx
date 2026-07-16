import React from "react";

export default function DefaultAvatar({ className = "w-full h-full text-crt-primary" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 8 8"
      className={`${className} fill-current`}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* 8x8 Retro CRT Hacker Head Pixel Art */}
      {/* Top Hair/Cap */}
      <rect x="2" y="0" width="4" height="1" />
      <rect x="1" y="1" width="6" height="1" />
      <rect x="0" y="2" width="8" height="1" />
      {/* Visor/Glasses */}
      <rect x="0" y="3" width="8" height="1" className="text-zinc-950 fill-current" />
      <rect x="2" y="3" width="1" height="1" className="text-crt-primary fill-current" />
      <rect x="5" y="3" width="1" height="1" className="text-crt-primary fill-current" />
      {/* Face/Cheeks */}
      <rect x="0" y="4" width="8" height="1" />
      {/* Beard/Mouth Area */}
      <rect x="1" y="5" width="6" height="1" />
      <rect x="2" y="6" width="4" height="1" />
      <rect x="3" y="7" width="2" height="1" />
      {/* Mouth Cutout */}
      <rect x="3" y="5" width="2" height="1" className="text-zinc-950 fill-current" />
    </svg>
  );
}
