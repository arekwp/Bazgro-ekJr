import React, { useState } from 'react';
import { CharacterInstance } from '../types/scratch';
import { CHARACTER_TEMPLATES } from '../data/characters';
import { sound } from '../utils/audio';
import { Plus, Trash2, X } from 'lucide-react';

interface CharacterSelectorProps {
  characters: CharacterInstance[];
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  onAddCharacter: (templateId: string) => void;
  onDeleteCharacter: (id: string) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  onAddCharacter,
  onDeleteCharacter,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center bg-amber-100 border-r-2 border-amber-300 w-16 sm:w-20 shrink-0 p-2 gap-2 overflow-y-auto">
        {/* Add Character Button */}
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            setShowPicker(true);
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black border-2 border-amber-500 shadow-sm flex flex-col items-center justify-center gap-0.5 transition-transform"
          title="Dodaj nową postać"
        >
          <Plus size={24} strokeWidth={3} />
          <span className="text-[9px] font-black leading-none">POSTAĆ</span>
        </button>

        {/* Character List */}
        <div className="flex flex-col gap-2 w-full items-center">
          {characters.map((char) => {
            const template = CHARACTER_TEMPLATES[char.characterId] || CHARACTER_TEMPLATES.robot;
            const isSelected = char.id === selectedCharacterId;

            return (
              <div key={char.id} className="relative group w-full flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onSelectCharacter(char.id);
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 p-1 rounded-2xl border-3 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                      : 'bg-amber-50/70 border-amber-200 hover:bg-white hover:border-amber-300'
                  }`}
                  title={char.name}
                >
                  {template.renderSvg({ className: 'w-full h-full' })}
                </button>

                {/* Character Name under avatar */}
                <span className="text-[10px] font-bold text-amber-900 truncate max-w-[56px] text-center mt-0.5">
                  {char.name}
                </span>

                {/* Delete button (can be clicked or toggled) */}
                {characters.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playTrash();
                      onDeleteCharacter(char.id);
                    }}
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xs transition-opacity ${
                      deleteMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 sm:opacity-0'
                    }`}
                    title="Usuń postać ze sceny"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Toggle delete mode for mobile touch */}
        {characters.length > 1 && (
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setDeleteMode(!deleteMode);
            }}
            className={`mt-auto p-1.5 rounded-xl border text-xs font-bold transition-colors ${
              deleteMode ? 'bg-red-500 text-white border-red-600' : 'bg-amber-200/60 text-amber-800 border-amber-300'
            }`}
            title="Włącz/wyłącz usuwanie"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Add Character Modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full max-w-md bg-amber-50 rounded-3xl p-5 border-4 border-amber-400 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
              <h3 className="text-lg font-black text-amber-950">Wybierz nową postać</h3>
              <button
                onClick={() => setShowPicker(false)}
                className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 flex items-center justify-center font-bold"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 my-4 max-h-[60vh] overflow-y-auto p-1">
              {Object.values(CHARACTER_TEMPLATES).map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    onAddCharacter(tmpl.id);
                    setShowPicker(false);
                  }}
                  className="flex flex-col items-center p-2 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-500 hover:shadow-md active:scale-95 transition-all text-center"
                >
                  <div className="w-14 h-14 mb-1">
                    {tmpl.renderSvg({ className: 'w-full h-full' })}
                  </div>
                  <span className="text-[11px] font-bold text-amber-950 truncate w-full">
                    {tmpl.name.pl}
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
