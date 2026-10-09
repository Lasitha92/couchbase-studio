import React from "react";
import { Box } from "@mui/material";

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 28 }) => {
  return (
    <Box
      component="svg"
      viewBox="0 0 128 128"
      sx={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
      }}
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="logoLetterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* Squircle Background */}
      <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#logoBgGrad)" />
      <rect
        x="5"
        y="5"
        width="118"
        height="118"
        rx="27"
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="2"
        fill="none"
      />

      {/* Database Cluster Accents */}
      <circle cx="100" cy="26" r="4.5" fill="#38BDF8" opacity="0.9" />
      <circle cx="112" cy="38" r="3" fill="#93C5FD" opacity="0.75" />
      <line
        x1="100"
        y1="26"
        x2="112"
        y2="38"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        opacity="0.6"
      />

      {/* Monogram CS */}
      {/* Letter C */}
      <path
        d="M 52 40
           C 46 33, 36 33, 30 39
           C 20 49, 20 79, 30 89
           C 36 95, 46 95, 52 88"
        fill="none"
        stroke="url(#logoLetterGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter S */}
      <path
        d="M 94 42
           C 90 35, 79 33, 73 37
           C 65 42, 64 51, 74 57
           C 87 65, 87 76, 78 84
           C 70 91, 59 88, 56 82"
        fill="none"
        stroke="url(#logoLetterGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cyan Dot at bottom tip of C */}
      <circle cx="52" cy="88" r="3" fill="#38BDF8" />
    </Box>
  );
};

export default Logo;
