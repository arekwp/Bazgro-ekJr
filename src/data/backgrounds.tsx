import React from 'react';

export interface BackgroundTemplate {
  id: string;
  name: { pl: string; en: string };
  renderSvg: (props?: { className?: string }) => React.ReactNode;
}

export const BACKGROUND_TEMPLATES: Record<string, BackgroundTemplate> = {
  grid: {
    id: 'grid',
    name: { pl: 'Siatka Robotyki (Współrzędne)', en: 'Robotics Grid (Coordinates)' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#F8FAFC" />
        
        {/* Subtle coordinate grid lines (20 columns x 15 rows = 40px each) */}
        {Array.from({ length: 21 }).map((_, i) => (
          <line
            key={`vl-${i}`}
            x1={i * 40}
            y1={0}
            x2={i * 40}
            y2={600}
            stroke="#CBD5E1"
            strokeWidth={i % 5 === 0 ? "2" : "1"}
            strokeDasharray={i % 5 === 0 ? undefined : "3 3"}
          />
        ))}

        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={`hl-${i}`}
            x1={0}
            y1={i * 40}
            x2={800}
            y2={i * 40}
            stroke="#CBD5E1"
            strokeWidth={i % 5 === 0 ? "2" : "1"}
            strokeDasharray={i % 5 === 0 ? undefined : "3 3"}
          />
        ))}

        {/* Start Pad in bottom left */}
        <rect x="40" y="480" width="80" height="80" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" />
        <text x="80" y="526" fill="#15803D" fontSize="16" fontWeight="bold" textAnchor="middle">START</text>

        {/* Finish Pad in top right */}
        <rect x="680" y="40" width="80" height="80" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" strokeDasharray="4 4" />
        <text x="720" y="86" fill="#B45309" fontSize="16" fontWeight="bold" textAnchor="middle">META ★</text>

        {/* Robot path track lines */}
        <path d="M80 480 L80 320 L320 320 L320 160 L680 160 L680 80" stroke="#93C5FD" strokeWidth="4" strokeDasharray="8 8" fill="none" opacity="0.6" />
      </svg>
    ),
  },
  lab: {
    id: 'lab',
    name: { pl: 'Laboratorium Robotyki', en: 'Robotics Lab' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wall */}
        <rect width="800" height="420" fill="#0F172A" />
        {/* Floor */}
        <rect y="420" width="800" height="180" fill="#334155" />
        {/* Floor grid perspective */}
        <line x1="0" y1="420" x2="800" y2="420" stroke="#475569" strokeWidth="3" />
        <line x1="160" y1="420" x2="100" y2="600" stroke="#475569" strokeWidth="2" />
        <line x1="320" y1="420" x2="280" y2="600" stroke="#475569" strokeWidth="2" />
        <line x1="480" y1="420" x2="520" y2="600" stroke="#475569" strokeWidth="2" />
        <line x1="640" y1="420" x2="700" y2="600" stroke="#475569" strokeWidth="2" />

        {/* Big Lab Monitor in background */}
        <rect x="220" y="60" width="360" height="220" rx="12" fill="#1E293B" stroke="#0EA5E9" strokeWidth="4" />
        <rect x="236" y="76" width="328" height="188" rx="6" fill="#0369A1" opacity="0.3" />
        {/* Code/Graph on screen */}
        <path d="M260 200 L320 140 L380 180 L440 110 L500 150 L530 130" stroke="#38BDF8" strokeWidth="4" fill="none" />
        <text x="260" y="110" fill="#7DD3FC" fontSize="16" fontWeight="bold">ROBOT_SYSTEM: ONLINE</text>

        {/* Shelves with gears and tools */}
        <rect x="40" y="120" width="140" height="14" rx="4" fill="#64748B" />
        <circle cx="80" cy="98" r="16" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
        <circle cx="80" cy="98" r="6" fill="#0F172A" />
        <circle cx="120" cy="104" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />

        {/* Right side robotic arm fixture */}
        <rect x="620" y="100" width="140" height="14" rx="4" fill="#64748B" />
        <rect x="640" y="50" width="40" height="50" rx="6" fill="#3B82F6" />
        <circle cx="660" cy="70" r="8" fill="#FCD34D" />

        {/* Workbenches */}
        <rect x="50" y="360" width="180" height="70" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="3" />
        <rect x="570" y="360" width="180" height="70" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="3" />
      </svg>
    ),
  },
  park: {
    id: 'park',
    name: { pl: 'Słoneczny Park', en: 'Sunny Park' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sky */}
        <rect width="800" height="400" fill="#BAE6FD" />
        
        {/* Sun */}
        <circle cx="700" cy="90" r="50" fill="#FBBF24" />
        <circle cx="700" cy="90" r="60" fill="#FDE047" opacity="0.3" />

        {/* Clouds */}
        <path d="M120 100 Q140 70 180 80 Q210 60 250 80 Q290 80 290 110 L120 110 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M420 140 Q440 110 480 120 Q510 100 550 120 Q590 120 590 150 L420 150 Z" fill="#FFFFFF" opacity="0.9" />

        {/* Distant Hills */}
        <path d="M0 400 Q200 320 400 380 Q600 300 800 360 L800 600 L0 600 Z" fill="#86EFAC" />

        {/* Foreground Meadow */}
        <path d="M0 430 Q240 380 500 440 Q700 400 800 450 L800 600 L0 600 Z" fill="#4ADE80" />

        {/* Pathway */}
        <path d="M260 600 Q360 480 440 430 L480 430 Q440 490 380 600 Z" fill="#FDE68A" />

        {/* Trees */}
        <rect x="100" y="340" width="20" height="90" fill="#78350F" rx="4" />
        <circle cx="110" cy="310" r="55" fill="#15803D" />
        <circle cx="90" cy="300" r="40" fill="#16A34A" />

        <rect x="680" y="330" width="22" height="100" fill="#78350F" rx="4" />
        <circle cx="691" cy="290" r="60" fill="#15803D" />
        <circle cx="715" cy="280" r="45" fill="#16A34A" />
      </svg>
    ),
  },
  space: {
    id: 'space',
    name: { pl: 'Kosmos i Planety', en: 'Space & Planets' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Space Background */}
        <rect width="800" height="600" fill="#090D16" />
        
        {/* Twinkling Stars */}
        {[
          [60, 50], [140, 120], [240, 40], [350, 90], [450, 40], [580, 110], [720, 60],
          [90, 220], [180, 260], [300, 180], [400, 250], [520, 200], [660, 240], [760, 180],
          [50, 340], [130, 400], [700, 360], [780, 420]
        ].map(([cx, cy], i) => (
          <circle key={`star-${i}`} cx={cx} cy={cy} r={i % 3 === 0 ? 3 : 2} fill="#F8FAFC" opacity={0.6 + (i % 5) * 0.08} />
        ))}

        {/* Ringed Planet (Saturn-like) */}
        <circle cx="650" cy="140" r="45" fill="#F59E0B" />
        <ellipse cx="650" cy="140" rx="75" ry="16" fill="none" stroke="#FDE68A" strokeWidth="8" transform="rotate(-18 650 140)" />

        {/* Distant Blue Earth/Planet */}
        <circle cx="160" cy="110" r="32" fill="#0284C7" />
        <path d="M145 95 Q160 90 170 100 Q160 120 145 125 Z" fill="#22C55E" />

        {/* Moon / Lunar surface landscape */}
        <path d="M0 440 Q250 380 500 430 Q700 400 800 450 L800 600 L0 600 Z" fill="#475569" />
        <path d="M0 480 Q200 450 450 490 Q650 460 800 510 L800 600 L0 600 Z" fill="#334155" />

        {/* Lunar Craters */}
        <ellipse cx="220" cy="520" rx="35" ry="12" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        <ellipse cx="560" cy="510" rx="48" ry="16" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
        <ellipse cx="380" cy="560" rx="25" ry="8" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      </svg>
    ),
  },
  ocean: {
    id: 'ocean',
    name: { pl: 'Podwodny Świat', en: 'Underwater Ocean' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ocean gradient */}
        <rect width="800" height="600" fill="#0284C7" />
        <rect y="250" width="800" height="350" fill="#0369A1" opacity="0.6" />
        <rect y="440" width="800" height="160" fill="#075985" opacity="0.8" />

        {/* Sandy Sea Floor */}
        <path d="M0 480 Q250 450 500 490 Q700 460 800 500 L800 600 L0 600 Z" fill="#FDE68A" />

        {/* Seaweed */}
        <path d="M60 520 Q40 400 80 320 Q50 250 70 180" stroke="#16A34A" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M120 540 Q150 420 110 330 Q140 260 120 200" stroke="#22C55E" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M720 530 Q750 410 700 320 Q740 240 710 170" stroke="#16A34A" strokeWidth="14" fill="none" strokeLinecap="round" />

        {/* Corals */}
        <circle cx="280" cy="480" r="30" fill="#F43F5E" />
        <circle cx="310" cy="470" r="24" fill="#FB7185" />
        <circle cx="560" cy="490" r="35" fill="#8B5CF6" />

        {/* Bubbles */}
        {[
          [160, 360, 8], [170, 280, 12], [165, 180, 10],
          [480, 320, 7], [490, 240, 11], [485, 150, 9],
          [640, 380, 9], [635, 290, 14], [645, 190, 12]
        ].map(([cx, cy, r], i) => (
          <circle key={`bub-${i}`} cx={cx} cy={cy} r={r} fill="#E0F2FE" opacity="0.6" stroke="#BAE6FD" strokeWidth="1.5" />
        ))}
      </svg>
    ),
  },
  room: {
    id: 'room',
    name: { pl: 'Klasa i Pokój Zabaw', en: 'Playroom & Class' },
    renderSvg: ({ className = 'w-full h-full' } = {}) => (
      <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {/* Wall */}
        <rect width="800" height="420" fill="#FEF3C7" />
        {/* Wood floor */}
        <rect y="420" width="800" height="180" fill="#B45309" />
        {/* Floor planks */}
        <line x1="0" y1="480" x2="800" y2="480" stroke="#92400E" strokeWidth="2" />
        <line x1="0" y1="540" x2="800" y2="540" stroke="#92400E" strokeWidth="2" />

        {/* Window */}
        <rect x="80" y="80" width="160" height="180" rx="8" fill="#BAE6FD" stroke="#FFFFFF" strokeWidth="8" />
        <line x1="160" y1="80" x2="160" y2="260" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="80" y1="170" x2="240" y2="170" stroke="#FFFFFF" strokeWidth="6" />

        {/* Blackboard / Whiteboard */}
        <rect x="320" y="70" width="380" height="200" rx="8" fill="#15803D" stroke="#78350F" strokeWidth="8" />
        <text x="360" y="130" fill="#FFFFFF" fontSize="24" fontWeight="bold">1 + 1 = 2</text>
        <text x="360" y="180" fill="#FDE047" fontSize="24" fontWeight="bold">ROBOTYKA 🤖</text>
        <path d="M540 180 L580 140 L620 180" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

        {/* Toy blocks on floor */}
        <rect x="120" y="470" width="40" height="40" rx="4" fill="#EF4444" />
        <rect x="165" y="470" width="40" height="40" rx="4" fill="#3B82F6" />
        <rect x="142" y="430" width="40" height="40" rx="4" fill="#F59E0B" />
      </svg>
    ),
  },
};
