'use client';

import React from 'react';

interface ChatLedgerLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  inverted?: boolean;
}

export function ChatLedgerEmblem({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id={`bgGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E2B45" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id={`tealGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
        <linearGradient id={`blueGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#356AE6" />
        </linearGradient>
        <filter id={`glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Modern Squircle Badge */}
      <rect width="48" height="48" rx="12" fill={`url(#bgGrad-${size})`} />
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="11.25"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />

      {/* Chat Speech Bubble Base Silhouette */}
      <path
        d="M11 23.5C11 16.5 16.8 11 24 11C31.2 11 37 16.5 37 23.5C37 30.5 31.2 36 24 36C21.6 36 19.3 35.3 17.4 34.1L11.5 36L13.1 30.8C11.8 28.6 11 26.1 11 23.5Z"
        fill="#1E293B"
        fillOpacity="0.7"
      />

      {/* Geometric Ledger Bars forming 'C' & 'L' Interlock */}
      {/* Left Pillar (Chat curve) */}
      <rect x="14" y="16" width="5.5" height="15" rx="2.75" fill={`url(#tealGrad-${size})`} />

      {/* Center Pillar (Financial Growth) */}
      <rect x="22" y="13" width="5.5" height="18" rx="2.75" fill={`url(#blueGrad-${size})`} />

      {/* Right Pillar */}
      <rect x="30" y="18" width="5.5" height="13" rx="2.75" fill={`url(#tealGrad-${size})`} />

      {/* Bottom Interlocking Ledger Bar */}
      <path
        d="M14 28.5C14 27.12 15.12 26 16.5 26H31.5C32.88 26 34 27.12 34 28.5V28.5C34 29.88 32.88 31 31.5 31H16.5C15.12 31 14 29.88 14 28.5V28.5Z"
        fill={`url(#tealGrad-${size})`}
      />

      {/* Luminous AI Sparkle Star */}
      <circle cx="34" cy="13" r="2.2" fill="#2DD4BF" filter={`url(#glow-${size})`} />
      <path d="M34 9.5V16.5M30.5 13H37.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatLedgerLogo({
  size = 'md',
  showText = true,
  subtitle,
  className = '',
  inverted = false,
}: ChatLedgerLogoProps) {
  const sizeMap = {
    xs: 24,
    sm: 28,
    md: 34,
    lg: 42,
    xl: 52,
  };

  const pixelSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <ChatLedgerEmblem size={pixelSize} />

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 leading-none">
            <span
              className={`font-extrabold tracking-tight ${
                size === 'xs'
                  ? 'text-xs'
                  : size === 'sm'
                  ? 'text-sm'
                  : size === 'md'
                  ? 'text-base'
                  : size === 'lg'
                  ? 'text-xl'
                  : 'text-2xl'
              } ${inverted ? 'text-white' : 'text-[#202938]'}`}
            >
              ChatLedger
            </span>
            <span
              className={`font-black text-[#0D9488] ${
                size === 'xs'
                  ? 'text-xs'
                  : size === 'sm'
                  ? 'text-sm'
                  : size === 'md'
                  ? 'text-base'
                  : size === 'lg'
                  ? 'text-xl'
                  : 'text-2xl'
              }`}
            >
              .AI
            </span>
          </div>
          {subtitle && (
            <span
              className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[140px] ${
                inverted ? 'text-slate-400' : 'text-[#707B8B]'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
