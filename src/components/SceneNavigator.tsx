import React, { useState } from 'react';
import { ScenePage } from '../types/scratch';
import { BACKGROUND_TEMPLATES } from '../data/backgrounds';
import { sound } from '../utils/audio';
import { Plus, Image as ImageIcon, X } from 'lucide-react';

interface SceneNavigatorProps {
  pages: ScenePage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
  onChangeBackground: (bgId: string) => void;
}

export const SceneNavigator: React.FC<SceneNavigatorProps> = ({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDeletePage,
  onChangeBackground,
}) => {
  const [showBgPicker, setShowBgPicker] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center bg-amber-100 border-l-2 border-amber-300 w-16 sm:w-20 shrink-0 p-2 gap-2 overflow-y-auto">
        {/* Change Background Button for current scene */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setShowBgPicker(true);
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-400 hover:bg-sky-300 active:scale-95 text-white font-black border-2 border-sky-500 shadow-sm flex flex-col items-center justify-center gap-0.5 transition-transform"
          title="Zmień tło sceny"
        >
          <ImageIcon size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black leading-none">TŁO</span>
        </button>

        {/* Scene Pages List */}
        <div className="flex flex-col gap-2 w-full items-center">
          {pages.map((page, index) => {
            const bg = BACKGROUND_TEMPLATES[page.backgroundId] || BACKGROUND_TEMPLATES.grid;
            const isActive = index === activePageIndex;

            return (
              <div key={page.id} className="relative group w-full flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onSelectPage(index);
                  }}
                  className={`w-12 h-10 sm:w-14 sm:h-11 rounded-xl border-3 overflow-hidden relative shadow-xs transition-all ${
                    isActive
                      ? 'border-amber-500 ring-2 ring-amber-400 scale-105 shadow-md'
                      : 'border-amber-200 hover:border-amber-300 opacity-80 hover:opacity-100'
                  }`}
                  title={page.name}
                >
                  <div className="w-full h-full pointer-events-none">
                    {bg.renderSvg({ className: 'w-full h-full object-cover' })}
                  </div>
                  {/* Page number badge */}
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-black bg-amber-400/90 text-amber-950 px-1 rounded-sm">
                    {index + 1}
                  </span>
                </button>

                {/* Delete page button if > 1 page */}
                {pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTrash();
                      onDeletePage(index);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Usuń scenę"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Page Button (max 4 pages in ScratchJr standard) */}
        {pages.length < 4 && (
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              onAddPage();
            }}
            className="w-12 h-10 sm:w-14 sm:h-11 rounded-xl bg-amber-200 hover:bg-amber-300 border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-800 transition-colors"
            title="Dodaj nową scenę"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Background Selector Modal */}
      {showBgPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setShowBgPicker(false)}
        >
          <div
            className="w-full max-w-lg bg-amber-50 rounded-3xl p-5 border-4 border-amber-400 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
              <h3 className="text-lg font-black text-amber-950">Wybierz tło dla sceny</h3>
              <button
                onClick={() => setShowBgPicker(false)}
                className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 flex items-center justify-center font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 max-h-[60vh] overflow-y-auto p-1">
              {Object.values(BACKGROUND_TEMPLATES).map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onChangeBackground(bg.id);
                    setShowBgPicker(false);
                  }}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-500 hover:shadow-md active:scale-95 transition-all text-left"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-200 mb-2 pointer-events-none">
                    {bg.renderSvg({ className: 'w-full h-full object-cover' })}
                  </div>
                  <span className="text-xs font-bold text-amber-950 truncate w-full">
                    {bg.name.pl}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
