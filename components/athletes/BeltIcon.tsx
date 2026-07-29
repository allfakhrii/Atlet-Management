import React from 'react';

interface BeltIconProps {
  belt: string;
  className?: string;
}

export default function BeltIcon({ belt, className = "w-10 h-10" }: BeltIconProps) {
  // Define base and strip colors
  let baseColor = "#ffffff";
  let stripColor = null;

  switch (belt) {
    case "Putih":
      baseColor = "#ffffff";
      break;
    case "Kuning":
      baseColor = "#fbbf24"; // yellow-400
      break;
    case "Kuning Strip":
      baseColor = "#fbbf24";
      stripColor = "#22c55e"; // green
      break;
    case "Hijau":
      baseColor = "#22c55e"; // green-500
      break;
    case "Hijau Strip":
      baseColor = "#22c55e";
      stripColor = "#3b82f6"; // blue
      break;
    case "Biru":
      baseColor = "#3b82f6"; // blue-500
      break;
    case "Biru Strip":
      baseColor = "#3b82f6";
      stripColor = "#ef4444"; // red
      break;
    case "Merah":
      baseColor = "#ef4444"; // red-500
      break;
    case "Merah Strip":
      baseColor = "#ef4444";
      stripColor = "#171717"; // black
      break;
    case "Hitam":
      baseColor = "#171717"; // neutral-900
      break;
    default:
      baseColor = "#ffffff"; // fallback
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
    >
      {/* Belt Main Loop */}
      <path 
        d="M 10 40 C 10 20, 90 20, 90 40 C 90 55, 65 60, 50 60 C 35 60, 10 55, 10 40 Z" 
        fill={baseColor} 
        stroke="#475569" 
        strokeWidth="2" 
      />
      
      {/* Left Tail */}
      <path 
        d="M 40 55 L 25 90 L 38 92 L 48 58 Z" 
        fill={baseColor} 
        stroke="#475569" 
        strokeWidth="2"
      />

      {/* Right Tail */}
      <path 
        d="M 60 55 L 75 90 L 62 92 L 52 58 Z" 
        fill={baseColor} 
        stroke="#475569" 
        strokeWidth="2"
      />

      {/* Strip on Left Tail if exists */}
      {stripColor && (
        <path 
          d="M 28 80 L 36 82 L 35 85 L 27 83 Z" 
          fill={stripColor} 
        />
      )}

      {/* Strip on Right Tail if exists */}
      {stripColor && (
        <path 
          d="M 72 80 L 64 82 L 65 85 L 73 83 Z" 
          fill={stripColor} 
        />
      )}

      {/* Knot Center */}
      <path 
        d="M 42 50 C 42 45, 58 45, 58 50 C 58 60, 42 60, 42 50 Z" 
        fill={baseColor} 
        stroke="#475569" 
        strokeWidth="2" 
      />

      {/* Subtle Texture/Highlight Overlay for realism */}
      <path 
        d="M 15 40 C 25 30, 75 30, 85 40" 
        stroke="white" 
        strokeOpacity="0.2" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
