import React, { useState, useRef } from 'react';
import { CharacterInstance } from '../types/scratch';
import { CHARACTER_TEMPLATES } from '../data/characters';
import { BACKGROUND_TEMPLATES } from '../data/backgrounds';
import { sound } from '../utils/audio';

interface StageProps {
  backgroundId: string;
  characters: CharacterInstance[];
  selectedCharacterId: string;
  showGrid: boolean;
  isPresentation: boolean;
  onSelectCharacter: (id: string) => void;
  onUpdateCharacter: (id: string, updates: Partial<CharacterInstance>) => void;
  onCharacterTouch: (char: CharacterInstance) => void;
  onDragStart?: () => void;
}

export const Stage: React.FC<StageProps> = ({
  backgroundId,
  characters,
  selectedCharacterId,
  showGrid,
  isPresentation,
  onSelectCharacter,
  onUpdateCharacter,
  onCharacterTouch,
  onDragStart,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [draggingCharId, setDraggingCharId] = useState<string | null>(null);
  const [dragCoords, setDragCoords] = useState<{ x: number; y: number } | null>(null);

  const bgTemplate = BACKGROUND_TEMPLATES[backgroundId] || BACKGROUND_TEMPLATES.grid;

  // Convert grid coordinates (X: 1..20, Y: 1..15) to percentages (0..100%)
  // Center of cell (x, y):
  // percentX = ((x - 0.5) / 20) * 100%
  // percentY = (1 - (y - 0.5) / 15) * 100%
  const getPercentPos = (x: number, y: number) => {
    const px = ((Math.max(1, Math.min(20, x)) - 0.5) / 20) * 100;
    const py = (1 - (Math.max(1, Math.min(15, y)) - 0.5) / 15) * 100;
    return { left: `${px}%`, top: `${py}%` };
  };

  // Convert screen mouse/touch position to grid coordinates (1..20, 1..15)
  const calculateGridCoord = (clientX: number, clientY: number) => {
    if (!stageRef.current) return { x: 10, y: 8 };
    const rect = stageRef.current.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;

    const gridX = Math.max(1, Math.min(20, Math.round(relX * 20 + 0.5)));
    const gridY = Math.max(1, Math.min(15, Math.round((1 - relY) * 15 + 0.5)));

    return { x: gridX, y: gridY };
  };

  const handlePointerDown = (char: CharacterInstance, e: React.PointerEvent) => {
    e.stopPropagation();
    onSelectCharacter(char.id);

    if (isPresentation) {
      // In presentation mode, tap immediately triggers touch script
      onCharacterTouch(char);
      return;
    }

    if (onDragStart) {
      onDragStart();
    }

    setDraggingCharId(char.id);
    const coords = calculateGridCoord(e.clientX, e.clientY);
    setDragCoords(coords);

    const onPointerMove = (moveEv: PointerEvent) => {
      const newCoords = calculateGridCoord(moveEv.clientX, moveEv.clientY);
      setDragCoords(newCoords);
      onUpdateCharacter(char.id, {
        x: newCoords.x,
        y: newCoords.y,
        homeX: newCoords.x,
        homeY: newCoords.y,
      });
    };

    const onPointerUp = (upEv: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setDraggingCharId(null);
      setDragCoords(null);

      // Check if it was just a quick tap without drag
      const endCoords = calculateGridCoord(upEv.clientX, upEv.clientY);
      if (Math.abs(endCoords.x - char.x) <= 0.5 && Math.abs(endCoords.y - char.y) <= 0.5) {
        onCharacterTouch(char);
      } else {
        sound.playPop();
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      ref={stageRef}
      className="relative w-full h-full overflow-hidden bg-slate-900 select-none shadow-inner flex items-center justify-center rounded-2xl border-4 border-amber-300"
      style={{ touchAction: 'none' }}
    >
      {/* Background SVG */}
      <div className="absolute inset-0 pointer-events-none">
        {bgTemplate.renderSvg({ className: 'w-full h-full object-cover' })}
      </div>

      {/* 20 x 15 Coordinate Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Vertical grid lines */}
          <div className="w-full h-full grid grid-cols-20 grid-rows-15">
            {Array.from({ length: 300 }).map((_, i) => (
              <div
                key={`grid-cell-${i}`}
                className="border-r border-b border-sky-400/35 relative"
              />
            ))}
          </div>

          {/* Coordinate numbers at bottom (X: 1..20) */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-sky-900/60 flex text-[9px] text-white font-bold pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`col-${i}`} className="flex-1 flex items-center justify-center">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Coordinate numbers at left (Y: 1..15) */}
          <div className="absolute top-0 bottom-4 left-0 w-4 bg-sky-900/60 flex flex-col text-[9px] text-white font-bold pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={`row-${i}`} className="flex-1 flex items-center justify-center">
                {15 - i}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Drag Coordinates Pill */}
      {showGrid && dragCoords && draggingCharId && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1 bg-amber-400 text-amber-950 font-black text-sm rounded-full shadow-lg border-2 border-white flex items-center gap-2 animate-bounce">
          <span>X: {dragCoords.x}</span>
          <span>·</span>
          <span>Y: {dragCoords.y}</span>
        </div>
      )}

      {/* Characters Layer */}
      {characters.map((char) => {
        const template = CHARACTER_TEMPLATES[char.characterId] || CHARACTER_TEMPLATES.robot;
        const pos = getPercentPos(char.x, char.y);
        const isSelected = char.id === selectedCharacterId && !isPresentation;
        const isDragging = char.id === draggingCharId;

        return (
          <div
            key={char.id}
            onPointerDown={(e) => handlePointerDown(char, e)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform duration-75 z-20 ${
              isDragging ? 'scale-110 z-30 drop-shadow-2xl' : ''
            }`}
            style={{
              left: pos.left,
              top: pos.top,
              opacity: char.visible ? 1 : 0,
              pointerEvents: char.visible ? 'auto' : 'none',
              transform: `translate(-50%, -50%) rotate(${char.rotation}deg) scale(${char.scale})`,
            }}
          >
            {/* Character Visual Box */}
            <div
              className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl transition-all ${
                isSelected
                  ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-transparent bg-white/10'
                  : ''
              }`}
            >
              {template.renderSvg({ className: 'w-full h-full filter drop-shadow-md' })}

              {/* Selected indicator marker */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow-xs" />
              )}
            </div>

            {/* Speech Bubble */}
            {char.speechText && (
              <div
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 bg-white text-slate-900 font-black text-xs sm:text-sm px-3 py-2 rounded-2xl shadow-xl border-2 border-amber-400 whitespace-nowrap animate-in fade-in zoom-in-75 duration-200"
                style={{ transform: `translateX(-50%) rotate(${-char.rotation}deg)` }}
              >
                {char.speechText}
                {/* Speech tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-400" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
