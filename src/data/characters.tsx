import React from 'react';

export interface CharacterTemplate {
  id: string;
  name: { pl: string; en: string };
  category: 'robotics' | 'animals' | 'vehicles' | 'fantasy';
  renderSvg: (props?: { className?: string }) => React.ReactNode;
}

export const CHARACTER_TEMPLATES: Record<string, CharacterTemplate> = {
  robot: {
    id: 'robot',
    name: { pl: 'Robot Bajt', en: 'Robot Byte' },
    category: 'robotics',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="7" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="48" cy="5" r="2" fill="#FEF3C7" />
        
        {/* Ears / Bolts */}
        <rect x="18" y="32" width="6" height="12" rx="3" fill="#64748B" />
        <rect x="76" y="32" width="6" height="12" rx="3" fill="#64748B" />

        {/* Head */}
        <rect x="22" y="20" width="56" height="36" rx="10" fill="#0EA5E9" stroke="#0284C7" strokeWidth="3" />
        
        {/* Screen visor */}
        <rect x="28" y="26" width="44" height="22" rx="6" fill="#0F172A" />
        {/* Eyes */}
        <circle cx="39" cy="37" r="5.5" fill="#38BDF8" />
        <circle cx="61" cy="37" r="5.5" fill="#38BDF8" />
        <circle cx="41" cy="35" r="2" fill="#FFFFFF" />
        <circle cx="63" cy="35" r="2" fill="#FFFFFF" />
        {/* Smile pixels */}
        <path d="M46 43 Q50 46 54 43" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Neck */}
        <rect x="44" y="56" width="12" height="6" fill="#64748B" rx="2" />

        {/* Body */}
        <rect x="25" y="60" width="50" height="30" rx="8" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
        
        {/* Chest Panel */}
        <rect x="33" y="65" width="34" height="18" rx="4" fill="#E2E8F0" />
        {/* Chest meters & buttons */}
        <circle cx="40" cy="74" r="3.5" fill="#EF4444" />
        <circle cx="50" cy="74" r="3.5" fill="#10B981" />
        <circle cx="60" cy="74" r="3.5" fill="#F59E0B" />
        
        {/* Arms */}
        <path d="M24 66 C15 70 14 78 20 84" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="20" cy="85" r="4" fill="#F59E0B" />
        <path d="M76 66 C85 70 86 78 80 84" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="85" r="4" fill="#F59E0B" />

        {/* Wheels / Tracks */}
        <rect x="32" y="88" width="14" height="8" rx="4" fill="#1E293B" />
        <rect x="54" y="88" width="14" height="8" rx="4" fill="#1E293B" />
      </svg>
    ),
  },
  rover: {
    id: 'rover',
    name: { pl: 'Łazik Kosmiczny', en: 'Mars Rover' },
    category: 'robotics',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Camera Mast */}
        <line x1="68" y1="46" x2="68" y2="24" stroke="#475569" strokeWidth="4" />
        <rect x="60" y="16" width="18" height="12" rx="4" fill="#F97316" stroke="#EA580C" strokeWidth="2" />
        <circle cx="67" cy="22" r="4" fill="#0F172A" />
        <circle cx="68" cy="21" r="1.5" fill="#38BDF8" />

        {/* Antenna dish */}
        <path d="M30 28 Q40 22 46 32" stroke="#64748B" strokeWidth="3" fill="none" />
        <line x1="38" y1="26" x2="38" y2="46" stroke="#475569" strokeWidth="3" />

        {/* Main Body */}
        <rect x="22" y="44" width="56" height="28" rx="6" fill="#F3F4F6" stroke="#4B5563" strokeWidth="3" />
        {/* Solar panels grid */}
        <rect x="26" y="48" width="30" height="12" rx="2" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1" />
        <line x1="36" y1="48" x2="36" y2="60" stroke="#60A5FA" strokeWidth="1" />
        <line x1="46" y1="48" x2="46" y2="60" stroke="#60A5FA" strokeWidth="1" />
        
        {/* Status LED */}
        <circle cx="68" cy="54" r="3" fill="#10B981" />

        {/* Rocker-Bogie Suspension */}
        <path d="M26 68 L22 82 M48 68 L50 82 M72 68 L76 82" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        
        {/* Wheels */}
        <circle cx="20" cy="84" r="8" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        <circle cx="20" cy="84" r="3" fill="#CBD5E1" />
        <circle cx="50" cy="84" r="8" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        <circle cx="50" cy="84" r="3" fill="#CBD5E1" />
        <circle cx="78" cy="84" r="8" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        <circle cx="78" cy="84" r="3" fill="#CBD5E1" />
      </svg>
    ),
  },
  cat: {
    id: 'cat',
    name: { pl: 'Kotek Tik', en: 'Tick Cat' },
    category: 'animals',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tail */}
        <path d="M28 72 C16 68 12 50 18 42 C20 40 24 44 22 48 C18 56 22 66 32 68" fill="#F97316" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />

        {/* Body */}
        <ellipse cx="48" cy="68" rx="22" ry="18" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />
        <ellipse cx="48" cy="70" rx="14" ry="11" fill="#FEF08A" />

        {/* Feet */}
        <ellipse cx="36" cy="86" rx="7" ry="5" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
        <ellipse cx="60" cy="86" rx="7" ry="5" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />

        {/* Ears */}
        <polygon points="34,34 40,16 50,30" fill="#FB923C" stroke="#EA580C" strokeWidth="2.5" />
        <polygon points="37,30 42,21 47,28" fill="#FCA5A5" />
        <polygon points="58,30 68,16 74,34" fill="#FB923C" stroke="#EA580C" strokeWidth="2.5" />
        <polygon points="61,28 66,21 71,30" fill="#FCA5A5" />

        {/* Head */}
        <ellipse cx="54" cy="38" rx="24" ry="19" fill="#FB923C" stroke="#EA580C" strokeWidth="3" />

        {/* Eyes */}
        <ellipse cx="45" cy="35" rx="5" ry="6" fill="#FFFFFF" />
        <circle cx="45" cy="36" r="3.5" fill="#0F172A" />
        <circle cx="44" cy="34" r="1.5" fill="#FFFFFF" />

        <ellipse cx="63" cy="35" rx="5" ry="6" fill="#FFFFFF" />
        <circle cx="63" cy="36" r="3.5" fill="#0F172A" />
        <circle cx="62" cy="34" r="1.5" fill="#FFFFFF" />

        {/* Cheeks */}
        <circle cx="37" cy="42" r="3" fill="#FDA4AF" />
        <circle cx="71" cy="42" r="3" fill="#FDA4AF" />

        {/* Nose & Mouth */}
        <polygon points="54,41 51,38 57,38" fill="#E11D48" />
        <path d="M54 41 L54 44 M54 44 Q50 48 46 44 M54 44 Q58 48 62 44" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />

        {/* Whiskers */}
        <line x1="32" y1="39" x2="22" y2="37" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="43" x2="20" y2="45" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        <line x1="76" y1="39" x2="86" y2="37" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
        <line x1="76" y1="43" x2="88" y2="45" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  rocket: {
    id: 'rocket',
    name: { pl: 'Rakieta Kosmiczna', en: 'Space Rocket' },
    category: 'vehicles',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fins */}
        <path d="M30 64 L16 80 L32 78 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <path d="M70 64 L84 80 L68 78 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />

        {/* Flame Thrusters */}
        <path d="M42 84 Q50 99 58 84 Q50 92 42 84 Z" fill="#F59E0B" />
        <path d="M45 84 Q50 93 55 84 Q50 88 45 84 Z" fill="#EF4444" />

        {/* Rocket Body */}
        <path d="M50 12 C34 32 32 74 36 82 L64 82 C68 74 66 32 50 12 Z" fill="#F8FAFC" stroke="#334155" strokeWidth="3" />
        
        {/* Nose Cone Tip */}
        <path d="M50 12 C44 20 40 26 40 32 L60 32 C60 26 56 20 50 12 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />

        {/* Porothole Window */}
        <circle cx="50" cy="46" r="11" fill="#0EA5E9" stroke="#0284C7" strokeWidth="3" />
        <circle cx="50" cy="46" r="8" fill="#38BDF8" />
        <path d="M45 42 Q48 40 54 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Center Stripe */}
        <rect x="42" y="66" width="16" height="4" rx="2" fill="#3B82F6" />
      </svg>
    ),
  },
  dog: {
    id: 'dog',
    name: { pl: 'Piesek Pikuś', en: 'Puppy Dog' },
    category: 'animals',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wagging Tail */}
        <path d="M25 66 C15 60 14 50 20 44" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
        
        {/* Body */}
        <ellipse cx="46" cy="68" rx="24" ry="18" fill="#D97706" stroke="#92400E" strokeWidth="3" />
        <ellipse cx="44" cy="72" rx="14" ry="10" fill="#FEF3C7" />
        {/* Spots */}
        <circle cx="36" cy="64" r="5" fill="#78350F" opacity="0.4" />

        {/* Legs */}
        <ellipse cx="32" cy="86" rx="6" ry="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="60" cy="86" rx="6" ry="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />

        {/* Floppy Ears */}
        <ellipse cx="34" cy="42" rx="7" ry="14" transform="rotate(-20 34 42)" fill="#78350F" />
        <ellipse cx="74" cy="42" rx="7" ry="14" transform="rotate(20 74 42)" fill="#78350F" />

        {/* Head */}
        <ellipse cx="54" cy="38" rx="22" ry="18" fill="#D97706" stroke="#92400E" strokeWidth="3" />
        <ellipse cx="54" cy="44" rx="11" ry="8" fill="#FEF3C7" />

        {/* Eyes */}
        <ellipse cx="46" cy="34" rx="4" ry="5" fill="#1E293B" />
        <circle cx="45" cy="32" r="1.5" fill="#FFFFFF" />
        <ellipse cx="62" cy="34" rx="4" ry="5" fill="#1E293B" />
        <circle cx="61" cy="32" r="1.5" fill="#FFFFFF" />

        {/* Nose & Tongue */}
        <ellipse cx="54" cy="42" rx="4" ry="3" fill="#1E293B" />
        <path d="M54 44 Q54 48 57 48" stroke="#1E293B" strokeWidth="2" />
        <path d="M52 47 Q54 55 57 48 Z" fill="#F43F5E" />
      </svg>
    ),
  },
  frog: {
    id: 'frog',
    name: { pl: 'Żabka Kumka', en: 'Froggy' },
    category: 'animals',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Back Legs */}
        <ellipse cx="26" cy="74" rx="14" ry="10" transform="rotate(-30 26 74)" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />
        <ellipse cx="74" cy="74" rx="14" ry="10" transform="rotate(30 74 74)" fill="#22C55E" stroke="#15803D" strokeWidth="2.5" />

        {/* Body */}
        <ellipse cx="50" cy="66" rx="22" ry="19" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
        <ellipse cx="50" cy="70" rx="15" ry="12" fill="#DCFCE7" />

        {/* Front Feet */}
        <ellipse cx="38" cy="85" rx="6" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
        <ellipse cx="62" cy="85" rx="6" ry="4" fill="#22C55E" stroke="#15803D" strokeWidth="2" />

        {/* Eyeballs protruding */}
        <circle cx="36" cy="32" r="12" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
        <circle cx="64" cy="32" r="12" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />

        {/* Head */}
        <ellipse cx="50" cy="46" rx="24" ry="16" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />

        {/* Big frog eyes */}
        <circle cx="36" cy="32" r="7" fill="#FFFFFF" />
        <circle cx="37" cy="32" r="4.5" fill="#0F172A" />
        <circle cx="35" cy="30" r="1.5" fill="#FFFFFF" />

        <circle cx="64" cy="32" r="7" fill="#FFFFFF" />
        <circle cx="63" cy="32" r="4.5" fill="#0F172A" />
        <circle cx="61" cy="30" r="1.5" fill="#FFFFFF" />

        {/* Wide smile */}
        <path d="M36 48 Q50 58 64 48" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="33" cy="49" r="3" fill="#F472B6" />
        <circle cx="67" cy="49" r="3" fill="#F472B6" />
      </svg>
    ),
  },
  star: {
    id: 'star',
    name: { pl: 'Złota Gwiazdka (Cel)', en: 'Golden Star (Goal)' },
    category: 'robotics',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="50,10 62,38 92,38 67,56 77,85 50,68 23,85 33,56 8,38 38,38"
          fill="#FBBF24"
          stroke="#D97706"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <polygon
          points="50,18 58,40 82,40 62,54 70,77 50,63 30,77 38,54 18,40 42,40"
          fill="#FDE047"
          opacity="0.7"
        />
        {/* Smiling face on the star */}
        <circle cx="43" cy="48" r="3" fill="#78350F" />
        <circle cx="57" cy="48" r="3" fill="#78350F" />
        <path d="M46 54 Q50 58 54 54" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  alien: {
    id: 'alien',
    name: { pl: 'Kosmita Zik', en: 'Alien Zik' },
    category: 'fantasy',
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Antennas */}
        <line x1="40" y1="26" x2="32" y2="12" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
        <circle cx="31" cy="11" r="4" fill="#A3E635" stroke="#65A30D" strokeWidth="2" />
        <line x1="60" y1="26" x2="68" y2="12" stroke="#84CC16" strokeWidth="3" strokeLinecap="round" />
        <circle cx="69" cy="11" r="4" fill="#A3E635" stroke="#65A30D" strokeWidth="2" />

        {/* Body */}
        <ellipse cx="50" cy="68" rx="22" ry="18" fill="#84CC16" stroke="#4D7C0F" strokeWidth="3" />
        {/* Belly */}
        <ellipse cx="50" cy="72" rx="13" ry="10" fill="#BEF264" />

        {/* Head */}
        <ellipse cx="50" cy="38" rx="25" ry="18" fill="#84CC16" stroke="#4D7C0F" strokeWidth="3" />

        {/* Big friendly single Cyclops eye */}
        <circle cx="50" cy="36" r="10" fill="#FFFFFF" stroke="#4D7C0F" strokeWidth="2" />
        <circle cx="50" cy="36" r="6" fill="#8B5CF6" />
        <circle cx="50" cy="36" r="3.5" fill="#0F172A" />
        <circle cx="48" cy="34" r="1.5" fill="#FFFFFF" />

        {/* Smile */}
        <path d="M42 47 Q50 52 58 47" stroke="#365314" strokeWidth="2.5" strokeLinecap="round" />

        {/* Little 3 legs */}
        <rect x="34" y="84" width="7" height="8" rx="3.5" fill="#65A30D" />
        <rect x="47" y="84" width="7" height="8" rx="3.5" fill="#65A30D" />
        <rect x="60" y="84" width="7" height="8" rx="3.5" fill="#65A30D" />
      </svg>
    ),
  },
};
