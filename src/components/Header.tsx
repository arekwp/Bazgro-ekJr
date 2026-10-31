import React, { useState } from 'react';
import { sound } from '../utils/audio';
import {
  Home,
  Grid,
  RotateCcw,
  Undo2,
  Flag,
  Square,
  Maximize2,
  Minimize2,
  HelpCircle,
  Share2,
  Edit2,
  Check,
} from 'lucide-react';

interface HeaderProps {
  projectName: string;
  showGrid: boolean;
  isPresentation: boolean;
  isRunning: boolean;
  canUndo?: boolean;
  onUndo?: () => void;
  onGoHome: () => void;
  onRenameProject: (newName: string) => void;
  onToggleGrid: () => void;
  onTogglePresentation: () => void;
  onResetPositions: () => void;
  onRunGreenFlag: () => void;
  onStop: () => void;
  onOpenGuide: () => void;
  onExportProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  showGrid,
  isPresentation,
  isRunning,
  canUndo = false,
  onUndo,
  onGoHome,
  onRenameProject,
  onToggleGrid,
  onTogglePresentation,
  onResetPositions,
  onRunGreenFlag,
  onStop,
  onOpenGuide,
  onExportProject,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(projectName);

  const handleFinishRename = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onRenameProject(titleInput.trim());
    } else {
      setTitleInput(projectName);
    }
  };

  return (
    <header className="h-14 sm:h-16 bg-amber-400 border-b-4 border-amber-500 px-2 sm:px-4 flex items-center justify-between select-none shadow-md shrink-0 gap-2">
      {/* Left: Home & Project Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onGoHome();
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-100 hover:bg-white active:scale-95 text-amber-900 border-2 border-amber-600 shadow-sm flex items-center justify-center transition-transform"
          title="Moje Projekty (Strona główna)"
        >
          <Home size={22} className="stroke-[2.5]" />
        </button>

        {isEditingTitle ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
              autoFocus
              className="px-2 py-1 bg-white font-black text-xs sm:text-sm rounded-xl border-2 border-amber-600 focus:outline-none w-32 sm:w-48 text-amber-950"
            />
            <button
              type="button"
              onClick={handleFinishRename}
              className="p-1 rounded-lg bg-emerald-500 text-white"
            >
              <Check size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTitleInput(projectName);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-amber-300/80 transition-colors group"
            title="Dotknij, aby zmienić nazwę projektu"
          >
            <span className="font-black text-sm sm:text-base text-amber-950 truncate max-w-[120px] sm:max-w-[200px]">
              {projectName}
            </span>
            <Edit2 size={13} className="text-amber-800 opacity-60 group-hover:opacity-100" />
          </button>
        )}
      </div>

      {/* Center: Stage & Project Tools (Undo, Presentation, Grid, Reset Positions) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Undo Button */}
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => {
            if (canUndo && onUndo) {
              sound.playPop();
              onUndo();
            }
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 transition-all flex items-center justify-center shadow-xs ${
            canUndo
              ? 'bg-white hover:bg-amber-100 text-amber-950 border-amber-600 active:scale-95 cursor-pointer'
              : 'bg-amber-200/50 text-amber-900/30 border-amber-300/50 cursor-not-allowed opacity-50'
          }`}
          title={canUndo ? 'Cofnij ostatnią zmianę (Undo)' : 'Brak zmian do cofnięcia'}
        >
          <Undo2 size={18} strokeWidth={2.5} />
        </button>

        {/* Fullscreen / Presentation Mode */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onTogglePresentation();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 transition-transform active:scale-95 flex items-center justify-center shadow-xs ${
            isPresentation
              ? 'bg-amber-900 text-amber-100 border-amber-950 shadow-inner'
              : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-600'
          }`}
          title={isPresentation ? 'Wyjdź z trybu pełnoekranowego' : 'Tryb prezentacji (Duży ekran)'}
        >
          {isPresentation ? <Minimize2 size={18} strokeWidth={2.5} /> : <Maximize2 size={18} strokeWidth={2.5} />}
        </button>

        {/* 20x15 Coordinate Grid Toggle */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onToggleGrid();
          }}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 transition-transform active:scale-95 flex items-center justify-center shadow-xs ${
            showGrid
              ? 'bg-sky-500 text-white border-sky-600 ring-2 ring-sky-300'
              : 'bg-white hover:bg-amber-100 text-amber-950 border-amber-600'
          }`}
          title="Siatka współrzędnych 20x15 (Robotyka)"
        >
          <Grid size={18} strokeWidth={2.5} />
        </button>

        {/* Reset Positions (Home characters) */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onResetPositions();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white hover:bg-amber-100 active:scale-95 text-amber-950 border-2 border-amber-600 shadow-xs flex items-center justify-center transition-transform"
          title="Ustaw postacie na pozycjach początkowych"
        >
          <RotateCcw size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Right: Flag, Stop, Guide, Share */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Green Flag (Run All Scripts) */}
        <button
          type="button"
          onClick={onRunGreenFlag}
          className={`h-10 sm:h-11 px-3 sm:px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm border-2 border-emerald-600 shadow-md flex items-center gap-1.5 transition-transform ${
            isRunning ? 'ring-4 ring-emerald-300 animate-pulse' : ''
          }`}
          title="Uruchom wszystkie programy (Zielona Flaga)"
        >
          <Flag size={20} className="fill-white" strokeWidth={2.5} />
          <span className="hidden sm:inline">START</span>
        </button>

        {/* Red Stop Button */}
        <button
          type="button"
          onClick={onStop}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-95 text-white border-2 border-red-700 shadow-md flex items-center justify-center transition-transform"
          title="Zatrzymaj programy"
        >
          <Square size={18} className="fill-white" strokeWidth={2.5} />
        </button>

        {/* Guide / Pomoc */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onOpenGuide();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-950 border-2 border-amber-500 flex items-center justify-center transition-transform"
          title="Przewodnik i Pomoc"
        >
          <HelpCircle size={19} strokeWidth={2.5} />
        </button>

        {/* Export / Share */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onExportProject();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-950 border-2 border-amber-500 flex items-center justify-center transition-transform"
          title="Eksportuj projekt (plik JSON do udostępnienia)"
        >
          <Share2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};
