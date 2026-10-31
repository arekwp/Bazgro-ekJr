import React from 'react';
import { ScriptBlock, EnvelopeColor } from '../types/scratch';
import { CATEGORY_COLORS } from '../data/blockCatalog';
import {
  Flag,
  Hand,
  Users,
  Mail,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  RotateCw,
  RotateCcw,
  Sparkles,
  Home,
  MessageSquare,
  Maximize2,
  Minimize2,
  RefreshCw,
  EyeOff,
  Eye,
  Volume2,
  Bell,
  Clock,
  Square,
  Repeat,
  Zap,
  PlaySquare,
} from 'lucide-react';

interface PuzzleBlockProps {
  block: ScriptBlock;
  isActive?: boolean;
  isPalette?: boolean;
  onTapParam?: (e: React.MouseEvent | React.TouchEvent) => void;
  onRemove?: () => void;
  onClick?: () => void;
}

export const ENVELOPE_COLORS: Record<EnvelopeColor, string> = {
  orange: '#F97316',
  yellow: '#EAB308',
  red: '#EF4444',
  purple: '#A855F7',
  blue: '#3B82F6',
  green: '#22C55E',
};

export const PuzzleBlock: React.FC<PuzzleBlockProps> = ({
  block,
  isActive = false,
  isPalette = false,
  onTapParam,
  onClick,
}) => {
  const colors = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.motion;

  const isTrigger = block.category === 'trigger' && block.type !== 'send_message';
  const isEnd = block.category === 'end' || block.type === 'stop';

  // Render authentic icon for each block
  const renderIcon = () => {
    const iconSize = isPalette ? 24 : 26;
    const strokeWidth = 2.5;

    switch (block.type) {
      case 'start_flag':
        return <Flag size={iconSize} className="text-emerald-700 fill-emerald-500" strokeWidth={strokeWidth} />;
      case 'start_touch':
        return <Hand size={iconSize} className="text-amber-900 fill-amber-200" strokeWidth={strokeWidth} />;
      case 'start_bump':
        return <Users size={iconSize} className="text-amber-900" strokeWidth={strokeWidth} />;
      case 'start_message':
        return (
          <div className="relative flex items-center justify-center">
            <Mail size={iconSize} className="text-amber-900" strokeWidth={strokeWidth} />
            <div
              className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
              style={{ backgroundColor: ENVELOPE_COLORS[block.colorParam || 'orange'] }}
            />
          </div>
        );
      case 'send_message':
        return (
          <div className="relative flex items-center justify-center">
            <Mail size={iconSize} className="text-amber-900 fill-amber-300" strokeWidth={strokeWidth} />
            <div
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
              style={{ backgroundColor: ENVELOPE_COLORS[block.colorParam || 'orange'] }}
            />
          </div>
        );

      // Motion
      case 'move_right':
        return <ArrowRight size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'move_left':
        return <ArrowLeft size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'move_up':
        return <ArrowUp size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'move_down':
        return <ArrowDown size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'turn_right':
        return <RotateCw size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'turn_left':
        return <RotateCcw size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'hop':
        return (
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-white">
            <path d="M4 18 C 6 8, 14 8, 16 14" strokeLinecap="round" />
            <path d="M12 12 L16 14 L16 10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'home':
        return <Home size={iconSize} className="text-white fill-white/30" strokeWidth={strokeWidth} />;

      // Looks
      case 'say':
        return <MessageSquare size={iconSize} className="text-white fill-white/20" strokeWidth={strokeWidth} />;
      case 'grow':
        return <Maximize2 size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'shrink':
        return <Minimize2 size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'reset_size':
        return <RefreshCw size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'hide':
        return <EyeOff size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'show':
        return <Eye size={iconSize} className="text-white" strokeWidth={strokeWidth} />;

      // Sound
      case 'sound_pop':
        return <Volume2 size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'sound_robot':
        return (
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-white">
            <rect x="5" y="8" width="14" height="12" rx="3" />
            <circle cx="9" cy="13" r="1.5" fill="currentColor" />
            <circle cx="15" cy="13" r="1.5" fill="currentColor" />
            <line x1="12" y1="4" x2="12" y2="8" />
            <circle cx="12" cy="3" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'sound_boing':
        return (
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-white">
            <path d="M6 19 C 18 19, 18 15, 6 15 C 18 15, 18 11, 6 11 C 18 11, 18 7, 12 7" strokeLinecap="round" />
          </svg>
        );
      case 'sound_ding':
        return <Bell size={iconSize} className="text-white fill-white/20" strokeWidth={strokeWidth} />;
      case 'sound_meow':
        return (
          <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-white">
            <path d="M4 10 L6 4 L11 8 C14 8 18 11 18 15 C18 19 14 20 10 20 C6 20 3 16 3 13 Z" strokeLinejoin="round" />
            <path d="M14 8 L18 4 L19 9" strokeLinejoin="round" />
            <circle cx="8" cy="13" r="1" fill="currentColor" />
          </svg>
        );

      // Control
      case 'wait':
        return <Clock size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'stop':
        return <Square size={iconSize} className="text-white fill-white" strokeWidth={strokeWidth} />;
      case 'speed':
        return <Zap size={iconSize} className="text-white fill-amber-300" strokeWidth={strokeWidth} />;
      case 'repeat':
        return <Repeat size={iconSize} className="text-white" strokeWidth={strokeWidth} />;

      // End
      case 'end':
        return <Square size={iconSize} className="text-white fill-white" strokeWidth={strokeWidth} />;
      case 'forever':
        return <Repeat size={iconSize} className="text-white" strokeWidth={strokeWidth} />;
      case 'go_to_page':
        return (
          <div className="flex flex-col items-center">
            <PlaySquare size={iconSize - 2} className="text-white" strokeWidth={strokeWidth} />
            <span className="text-[10px] font-black text-white leading-none mt-0.5">
              P{block.targetPage || 1}
            </span>
          </div>
        );

      default:
        return <Sparkles size={iconSize} className="text-white" />;
    }
  };

  // Puzzle SVG geometry
  // Width: ~64px, Height: ~64px (or 54px in palette)
  const width = isPalette ? 58 : 66;
  const height = isPalette ? 56 : 64;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none transition-all duration-150 cursor-pointer ${
        isActive ? 'scale-110 z-30 drop-shadow-xl' : 'hover:-translate-y-0.5 active:scale-95'
      }`}
      style={{ minWidth: `${width}px` }}
    >
      {/* Puzzle piece body */}
      <div
        className={`relative flex items-center justify-center rounded-lg shadow-sm border-2 ${
          isActive ? 'ring-4 ring-yellow-400 ring-offset-2' : ''
        }`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderTopLeftRadius: isTrigger ? '24px' : '8px',
          borderBottomLeftRadius: isTrigger ? '24px' : '8px',
          borderTopRightRadius: isEnd ? '16px' : '8px',
          borderBottomRightRadius: isEnd ? '16px' : '8px',
        }}
      >
        {/* Left puzzle socket (if not trigger block) */}
        {!isTrigger && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-4 rounded-r-md border-r border-t border-b"
            style={{
              backgroundColor: 'rgba(0,0,0,0.12)',
              borderColor: colors.border,
            }}
          />
        )}

        {/* Gloss highlight */}
        <div className="absolute top-1 left-2 right-2 h-2 rounded-t-md bg-white/25 pointer-events-none" />

        {/* Icon */}
        <div className="flex items-center justify-center p-1 pointer-events-none">
          {renderIcon()}
        </div>

        {/* Right puzzle tab (if not end block) */}
        {!isEnd && !isPalette && (
          <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-4 rounded-r-md border-r border-t border-b shadow-xs z-10"
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
            }}
          />
        )}
      </div>

      {/* Parameter button underneath (for workspace blocks with parameters) */}
      {!isPalette && (
        <div className="mt-1 flex items-center justify-center">
          {block.param !== undefined && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTapParam) onTapParam(e);
              }}
              className="px-2 py-0.5 min-w-[28px] text-xs font-black rounded-md bg-white text-slate-800 border-2 shadow-xs hover:bg-amber-50 active:scale-95 transition-transform flex items-center justify-center truncate max-w-[70px]"
              style={{ borderColor: colors.border }}
              title="Zmień wartość"
            >
              {typeof block.param === 'string' && block.param.length > 5
                ? `${block.param.substring(0, 4)}…`
                : block.param}
            </button>
          )}

          {block.hasColorParam && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTapParam) onTapParam(e);
              }}
              className="w-5 h-5 rounded-full border-2 border-white shadow-xs hover:scale-110 active:scale-90 transition-transform"
              style={{ backgroundColor: ENVELOPE_COLORS[block.colorParam || 'orange'] }}
              title="Wybierz kolor koperty"
            />
          )}

          {block.hasSpeedParam && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTapParam) onTapParam(e);
              }}
              className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-white text-slate-700 border shadow-xs hover:bg-amber-50"
              style={{ borderColor: colors.border }}
            >
              {block.speedParam === 'slow' ? '🐢' : block.speedParam === 'fast' ? '⚡' : '🚶'}
            </button>
          )}

          {block.type === 'go_to_page' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onTapParam) onTapParam(e);
              }}
              className="px-1.5 py-0.5 text-xs font-bold rounded-md bg-white text-slate-800 border shadow-xs"
              style={{ borderColor: colors.border }}
            >
              P{block.targetPage || 1}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
