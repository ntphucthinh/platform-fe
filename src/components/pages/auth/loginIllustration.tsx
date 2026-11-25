import React from "react";
import { Box } from "@mui/material";

export interface LoginIllustrationProps {
  sx?: Record<string, unknown>;
}

/**
 * SaaS Admin System Illustration:
 * Features general system management visuals — Dashboard window, bar chart,
 * donut chart, floating checklist card, document folder, and settings gear.
 * Does not contain any module-specific imagery (no travel, map, or homestay visuals).
 */
export const LoginIllustration: React.FC<LoginIllustrationProps> = ({ sx }) => {
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: "100%",
        maxWidth: { xs: 155, sm: 210, md: 490, lg: 530 },
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        ...sx,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 520 370"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Main Window Shadow */}
          <filter
            id="adminWindowShadow"
            x="-12%"
            y="-10%"
            width="124%"
            height="128%"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="18"
              floodColor="#1976D2"
              floodOpacity="0.11"
            />
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="6"
              floodColor="#172033"
              floodOpacity="0.04"
            />
          </filter>

          {/* Checklist Floating Card Shadow */}
          <filter
            id="checklistCardShadow"
            x="-18%"
            y="-14%"
            width="136%"
            height="136%"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="12"
              stdDeviation="14"
              floodColor="#1976D2"
              floodOpacity="0.15"
            />
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="4"
              floodColor="#172033"
              floodOpacity="0.05"
            />
          </filter>

          {/* Folder Drop Shadow */}
          <filter
            id="folderDropShadow"
            x="-15%"
            y="-15%"
            width="135%"
            height="135%"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="10"
              floodColor="#1565C0"
              floodOpacity="0.2"
            />
          </filter>

          {/* Soft Pedestal Gradient */}
          <radialGradient id="pedestalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.24" />
            <stop offset="70%" stopColor="#E5F0FD" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#E5F0FD" stopOpacity="0" />
          </radialGradient>

          {/* Decorative Leaf Gradients */}
          <linearGradient id="leafPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#2589F2" stopOpacity="0.35" />
          </linearGradient>

          <linearGradient id="leafSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#E5F0FD" stopOpacity="0.85" />
          </linearGradient>

          {/* Settings Gear Gradient */}
          <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" />
            <stop offset="100%" stopColor="#2589F2" />
          </linearGradient>

          {/* Bar Chart Gradients */}
          <linearGradient id="bar1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" />
            <stop offset="100%" stopColor="#58AAF8" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="bar2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" />
            <stop offset="100%" stopColor="#2589F2" />
          </linearGradient>

          <linearGradient id="bar3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2589F2" />
            <stop offset="100%" stopColor="#1976D2" />
          </linearGradient>

          <linearGradient id="bar4Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#1565C0" />
          </linearGradient>

          {/* Checkbox Badge Gradient */}
          <linearGradient id="checkBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2589F2" />
            <stop offset="100%" stopColor="#1976D2" />
          </linearGradient>

          {/* Folder Front Flap Gradient */}
          <linearGradient id="folderFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#58AAF8" />
            <stop offset="55%" stopColor="#2589F2" />
            <stop offset="100%" stopColor="#1976D2" />
          </linearGradient>

          {/* Folder Back Flap Gradient */}
          <linearGradient id="folderBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1976D2" />
            <stop offset="100%" stopColor="#1565C0" />
          </linearGradient>
        </defs>

        {/* Base Ambient Shadow Ellipse */}
        <ellipse cx="260" cy="332" rx="228" ry="26" fill="url(#pedestalGrad)" />

        {/* Left Decorative Leaves (Behind Main Window & Checklist) */}
        <g>
          {/* Outer Left Leaf */}
          <path
            d="M 88 215 C 46 198 20 150 28 114 C 62 122 94 162 96 206 Z"
            fill="url(#leafSecondary)"
          />
          <path
            d="M 32 120 C 56 146 76 178 90 208"
            stroke="#58AAF8"
            strokeWidth="1.5"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          {/* Inner Left Leaf */}
          <path
            d="M 96 205 C 62 178 52 134 68 102 C 96 118 112 158 106 198 Z"
            fill="url(#leafPrimary)"
          />
          <path
            d="M 70 110 C 84 140 94 170 98 198"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </g>

        {/* Right Decorative Leaves (Behind Main Window & Folder) */}
        <g>
          {/* Upper Right Leaf */}
          <path
            d="M 404 228 C 424 186 458 158 486 154 C 482 190 452 224 412 236 Z"
            fill="url(#leafPrimary)"
          />
          <path
            d="M 480 158 C 456 182 434 208 412 230"
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          {/* Lower Right Leaf */}
          <path
            d="M 408 248 C 442 226 482 220 504 230 C 486 258 446 268 412 258 Z"
            fill="url(#leafSecondary)"
          />
        </g>

        {/* Top-Right Settings Gear (Peeking behind Dashboard Window) */}
        <g transform="translate(382, 74)">
          <path
            d="M -6 -44 L 6 -44 L 9 -34 C 13 -32.8 16.8 -31.2 20.2 -29 L 29.5 -34 L 38 -25.5 L 33 -16.2 C 35.2 -12.8 36.8 -9 38 -5 L 48 -2 L 48 10 L 38 13 C 36.8 17 35.2 20.8 33 24.2 L 38 33.5 L 29.5 42 L 20.2 37 C 16.8 39.2 13 40.8 9 42 L 6 52 L -6 52 L -9 42 C -13 40.8 -16.8 39.2 -20.2 37 L -29.5 42 L -38 33.5 L -33 24.2 C -35.2 20.8 -36.8 17 -38 13 L -48 10 L -48 -2 L -38 -5 C -36.8 -9 -35.2 -12.8 -33 -16.2 L -38 -25.5 L -29.5 -34 L -20.2 -29 C -16.8 -31.2 -13 -32.8 -9 -34 Z"
            fill="url(#gearGrad)"
            opacity="0.88"
          />
          <circle cx="0" cy="4" r="21" fill="#E5F0FD" />
          <circle cx="0" cy="4" r="14" fill="#F7F9FC" />
        </g>

        {/* Main Dashboard Browser Window */}
        <g filter="url(#adminWindowShadow)">
          {/* Window Base Surface */}
          <rect
            x="84"
            y="68"
            width="332"
            height="216"
            rx="14"
            fill="#FFFFFF"
            stroke="#E7ECF2"
            strokeWidth="1.5"
          />

          {/* Top Browser Chrome Header */}
          <path
            d="M 85 82 C 85 74.82 90.82 69 98 69 L 402 69 C 409.18 69 415 74.82 415 82 L 415 100 L 85 100 Z"
            fill="#F7F9FC"
          />
          <line
            x1="85"
            y1="100"
            x2="415"
            y2="100"
            stroke="#E7ECF2"
            strokeWidth="1.2"
          />

          {/* Window Traffic Dots */}
          <circle cx="105" cy="84.5" r="4" fill="#1976D2" />
          <circle cx="119" cy="84.5" r="4" fill="#58AAF8" />
          <circle cx="133" cy="84.5" r="4" fill="#94A3B8" opacity="0.45" />

          {/* Header Bar Pill Placeholder */}
          <rect
            x="156"
            y="81"
            width="92"
            height="7"
            rx="3.5"
            fill="#E7ECF2"
          />

          {/* Left Sub-Card: Bar Chart */}
          <rect
            x="104"
            y="116"
            width="172"
            height="122"
            rx="10"
            fill="#F7F9FC"
            stroke="#E7ECF2"
            strokeWidth="1"
          />

          {/* Subtle Chart Grid Lines */}
          <line
            x1="118"
            y1="140"
            x2="262"
            y2="140"
            stroke="#E7ECF2"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="118"
            y1="168"
            x2="262"
            y2="168"
            stroke="#E7ECF2"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="118"
            y1="196"
            x2="262"
            y2="196"
            stroke="#E7ECF2"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* 4 Ascending Vertical Bars */}
          <rect
            x="124"
            y="186"
            width="21"
            height="36"
            rx="4"
            fill="url(#bar1Grad)"
          />
          <rect
            x="157"
            y="164"
            width="21"
            height="58"
            rx="4"
            fill="url(#bar2Grad)"
          />
          <rect
            x="190"
            y="148"
            width="21"
            height="74"
            rx="4"
            fill="url(#bar3Grad)"
          />
          <rect
            x="223"
            y="128"
            width="21"
            height="94"
            rx="4"
            fill="url(#bar4Grad)"
          />

          {/* Chart Baseline */}
          <line
            x1="116"
            y1="222"
            x2="264"
            y2="222"
            stroke="#E7ECF2"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Right Section: Donut Chart */}
          <g transform="translate(346, 156)">
            {/* Base Donut Track */}
            <circle
              cx="0"
              cy="0"
              r="33"
              fill="none"
              stroke="#E5F0FD"
              strokeWidth="15"
            />
            {/* Segment 1: Deep Blue */}
            <circle
              cx="0"
              cy="0"
              r="33"
              fill="none"
              stroke="#1976D2"
              strokeWidth="15"
              strokeDasharray="86 210"
              strokeDashoffset="15"
            />
            {/* Segment 2: Azure Blue */}
            <circle
              cx="0"
              cy="0"
              r="33"
              fill="none"
              stroke="#2589F2"
              strokeWidth="15"
              strokeDasharray="64 210"
              strokeDashoffset="-75"
            />
            {/* Segment 3: Sky Blue */}
            <circle
              cx="0"
              cy="0"
              r="33"
              fill="none"
              stroke="#58AAF8"
              strokeWidth="15"
              strokeDasharray="48 210"
              strokeDashoffset="-143"
            />
            <circle cx="0" cy="0" r="22" fill="#FFFFFF" />
          </g>

          {/* Right Section: Summary Checkmark Rows under Donut */}
          <g>
            {/* Row 1 */}
            <path
              d="M 298 220 L 302.5 224.5 L 311 215"
              stroke="#1976D2"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="321"
              y="214"
              width="72"
              height="6"
              rx="3"
              fill="#94A3B8"
              opacity="0.55"
            />
            <rect
              x="321"
              y="224"
              width="52"
              height="5"
              rx="2.5"
              fill="#E7ECF2"
            />

            {/* Row 2 */}
            <path
              d="M 298 246 L 302.5 250.5 L 311 241"
              stroke="#1976D2"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="321"
              y="240"
              width="68"
              height="6"
              rx="3"
              fill="#94A3B8"
              opacity="0.55"
            />
            <rect
              x="321"
              y="250"
              width="46"
              height="5"
              rx="2.5"
              fill="#E7ECF2"
            />
          </g>
        </g>

        {/* Foreground Bottom-Left: Floating Checklist Card */}
        <g filter="url(#checklistCardShadow)">
          <rect
            x="40"
            y="196"
            width="158"
            height="136"
            rx="12"
            fill="#FFFFFF"
            stroke="#E7ECF2"
            strokeWidth="1.5"
          />

          {/* Checklist Row 1 */}
          <g transform="translate(58, 214)">
            <rect
              x="0"
              y="0"
              width="23"
              height="23"
              rx="6"
              fill="url(#checkBadgeGrad)"
            />
            <path
              d="M 6 11.5 L 10 15.5 L 17.5 7.5"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="34"
              y="4"
              width="86"
              height="6.5"
              rx="3.25"
              fill="#94A3B8"
              opacity="0.6"
            />
            <rect
              x="34"
              y="14.5"
              width="58"
              height="5"
              rx="2.5"
              fill="#E7ECF2"
            />
          </g>

          {/* Checklist Row 2 */}
          <g transform="translate(58, 251)">
            <rect
              x="0"
              y="0"
              width="23"
              height="23"
              rx="6"
              fill="url(#checkBadgeGrad)"
            />
            <path
              d="M 6 11.5 L 10 15.5 L 17.5 7.5"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="34"
              y="4"
              width="80"
              height="6.5"
              rx="3.25"
              fill="#94A3B8"
              opacity="0.6"
            />
            <rect
              x="34"
              y="14.5"
              width="64"
              height="5"
              rx="2.5"
              fill="#E7ECF2"
            />
          </g>

          {/* Checklist Row 3 */}
          <g transform="translate(58, 288)">
            <rect
              x="0"
              y="0"
              width="23"
              height="23"
              rx="6"
              fill="url(#checkBadgeGrad)"
            />
            <path
              d="M 6 11.5 L 10 15.5 L 17.5 7.5"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="34"
              y="4"
              width="84"
              height="6.5"
              rx="3.25"
              fill="#94A3B8"
              opacity="0.6"
            />
            <rect
              x="34"
              y="14.5"
              width="52"
              height="5"
              rx="2.5"
              fill="#E7ECF2"
            />
          </g>
        </g>

        {/* Foreground Bottom-Right: 3D Document Folder */}
        <g filter="url(#folderDropShadow)">
          {/* Folder Back Plate with Top Tab */}
          <path
            d="M 350 248 C 350 243.58 353.58 240 358 240 L 388 240 C 391.2 240 394.1 241.8 395.6 244.6 L 399.5 252 L 450 252 C 454.42 252 458 255.58 458 260 L 458 324 C 458 328.42 454.42 332 450 332 L 358 332 C 353.58 332 350 328.42 350 324 Z"
            fill="url(#folderBack)"
          />

          {/* Inner White Document Sheet Peeking Out */}
          <rect
            x="358"
            y="249"
            width="90"
            height="62"
            rx="6"
            fill="#FFFFFF"
            stroke="#E7ECF2"
            strokeWidth="1"
            transform="rotate(-2.5 403 280)"
          />

          {/* Front Slanted Folder Cover */}
          <path
            d="M 360 266 C 360.6 261.9 364.1 259 368.2 259 L 459 259 C 463.8 259 467.4 263.3 466.5 268 L 456.2 325.4 C 455.5 329.3 452.1 332 448.2 332 L 358 332 C 353.6 332 350.2 328.1 350.8 323.7 Z"
            fill="url(#folderFront)"
          />

          {/* Subtle Top Highlight on Folder Front Cover */}
          <path
            d="M 366 261.5 L 459 261.5"
            stroke="#FFFFFF"
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </Box>
    </Box>
  );
};
