import React, { useState } from 'react';
import { ScriptBlock, EnvelopeColor } from '../types/scratch';
import { sound } from '../utils/audio';
import { ENVELOPE_COLORS } from './PuzzleBlock';
import { X, Check, Delete } from 'lucide-react';

interface ParamEditorModalProps {
  block: ScriptBlock;
  totalPages?: number;
  onSave: (updates: Partial<ScriptBlock>) => void;
  onClose: () => void;
}

export const ParamEditorModal: React.FC<ParamEditorModalProps> = ({
  block,
  totalPages = 4,
  onSave,
  onClose,
}) => {
  const [numVal, setNumVal] = useState<string>(() => {
    if (typeof block.param === 'number') return String(block.param);
    return '1';
  });

  const [textVal, setTextVal] = useState<string>(() => {
    if (typeof block.param === 'string') return block.param;
    return 'Cześć!';
  });

  const [selectedColor, setSelectedColor] = useState<EnvelopeColor>(
    block.colorParam || 'orange'
  );

  const [selectedSpeed, setSelectedSpeed] = useState<'slow' | 'medium' | 'fast'>(
    block.speedParam || 'medium'
  );

  const [selectedPage, setSelectedPage] = useState<number>(
    block.targetPage || 1
  );

  const handleDigit = (digit: string) => {
    sound.playPop();
    if (numVal === '0') {
      setNumVal(digit);
    } else if (numVal.length < 3) {
      setNumVal((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    sound.playPop();
    setNumVal((prev) => (prev.length > 1 ? prev.slice(0, -1) : '1'));
  };

  const handleSave = () => {
    sound.playSnap();
    if (block.type === 'say') {
      onSave({ param: textVal || 'Cześć!' });
    } else if (block.hasColorParam) {
      onSave({ colorParam: selectedColor });
    } else if (block.hasSpeedParam) {
      onSave({ speedParam: selectedSpeed });
    } else if (block.type === 'go_to_page') {
      onSave({ targetPage: selectedPage });
    } else {
      const parsed = parseInt(numVal, 10);
      onSave({ param: isNaN(parsed) ? 1 : Math.max(1, Math.min(99, parsed)) });
    }
    onClose();
  };

  const quickPhrases = [
    'Cześć!',
    'Brawo!',
    'Bip-bip!',
    'Ruszamy!',
    'Do przodu!',
    'Meta!',
    'Hurra!',
    'Jestem robotem!',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs bg-amber-50 rounded-3xl p-5 border-4 border-amber-400 shadow-2xl relative select-none animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <h3 className="text-lg font-black text-amber-900">
            {block.type === 'say'
              ? 'Wpisz tekst'
              : block.hasColorParam
              ? 'Wybierz kolor koperty'
              : block.hasSpeedParam
              ? 'Wybierz prędkość'
              : block.type === 'go_to_page'
              ? 'Wybierz stronę'
              : 'Wybierz liczbę'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 hover:bg-amber-300 flex items-center justify-center font-bold"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content based on parameter type */}
        <div className="mt-4">
          {/* TEXT (Say block) */}
          {block.type === 'say' && (
            <div className="space-y-4">
              <input
                type="text"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                maxLength={30}
                placeholder="Napisz coś..."
                className="w-full text-center text-xl font-bold p-3 bg-white border-3 border-amber-300 rounded-2xl focus:outline-none focus:border-amber-500 shadow-inner"
                autoFocus
              />

              <div>
                <p className="text-xs font-bold text-amber-800 mb-2">Szybkie zwroty:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickPhrases.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setTextVal(phrase);
                      }}
                      className="text-xs font-bold py-1.5 px-2 bg-white rounded-xl border border-amber-300 text-amber-950 hover:bg-amber-100 active:scale-95 transition-transform truncate text-left"
                    >
                      💬 {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COLOR (Envelopes) */}
          {block.hasColorParam && (
            <div className="py-2">
              <p className="text-xs font-bold text-amber-800 mb-3 text-center">
                Dotknij koloru koperty do wysłania / odbioru:
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(Object.keys(ENVELOPE_COLORS) as EnvelopeColor[]).map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedColor(col);
                    }}
                    className={`h-14 rounded-2xl border-4 transition-transform flex items-center justify-center shadow-md ${
                      selectedColor === col ? 'scale-110 ring-4 ring-amber-400 border-white' : 'border-white/60 active:scale-95'
                    }`}
                    style={{ backgroundColor: ENVELOPE_COLORS[col] }}
                  >
                    {selectedColor === col && <Check size={24} className="text-white drop-shadow-md" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SPEED */}
          {block.hasSpeedParam && (
            <div className="space-y-3 py-2">
              {[
                { id: 'slow', label: '🐢 Wolno (Żółwik)', sub: '350 ms na krok' },
                { id: 'medium', label: '🚶 Normalnie', sub: '220 ms na krok' },
                { id: 'fast', label: '⚡ Szybko (Błyskawica)', sub: '120 ms na krok' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedSpeed(s.id as 'slow' | 'medium' | 'fast');
                  }}
                  className={`w-full p-3 rounded-2xl border-3 flex items-center justify-between text-left font-bold transition-all ${
                    selectedSpeed === s.id
                      ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  <div>
                    <div className="text-sm">{s.label}</div>
                    <div className="text-[10px] opacity-75">{s.sub}</div>
                  </div>
                  {selectedSpeed === s.id && <Check size={20} />}
                </button>
              ))}
            </div>
          )}

          {/* GO TO PAGE */}
          {block.type === 'go_to_page' && (
            <div className="py-2">
              <p className="text-xs font-bold text-amber-800 mb-3 text-center">
                Wybierz numer sceny, do której ma przejść program:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedPage(i + 1);
                    }}
                    className={`h-16 rounded-2xl border-3 font-black text-xl flex flex-col items-center justify-center transition-all ${
                      selectedPage === i + 1
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md scale-105'
                        : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                    }`}
                  >
                    <span>Strona {i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NUMBER PAD */}
          {!block.hasColorParam &&
            !block.hasSpeedParam &&
            block.type !== 'say' &&
            block.type !== 'go_to_page' && (
              <div>
                {/* Number Display */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-full text-center text-3xl font-black py-2 px-4 bg-white border-3 border-amber-400 rounded-2xl shadow-inner text-amber-950">
                    {numVal}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 mb-3">
                  {[1, 2, 5, 10].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setNumVal(String(quick));
                      }}
                      className="flex-1 py-1.5 text-xs font-black bg-amber-200 text-amber-900 rounded-xl hover:bg-amber-300 active:scale-95"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                {/* Grid 1-9, 0, Backspace */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDigit(String(d))}
                      className="h-12 bg-white rounded-2xl font-black text-xl text-slate-800 border-2 border-amber-200 shadow-xs hover:bg-amber-100 active:bg-amber-300 active:scale-95 transition-transform flex items-center justify-center"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="h-12 bg-amber-100 rounded-2xl text-amber-900 border-2 border-amber-200 shadow-xs hover:bg-amber-200 active:scale-95 transition-transform flex items-center justify-center"
                    title="Usuń"
                  >
                    <Delete size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDigit('0')}
                    className="h-12 bg-white rounded-2xl font-black text-xl text-slate-800 border-2 border-amber-200 shadow-xs hover:bg-amber-100 active:bg-amber-300 active:scale-95 transition-transform flex items-center justify-center"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="h-12 bg-emerald-500 rounded-2xl text-white font-black border-2 border-emerald-600 shadow-md hover:bg-emerald-600 active:scale-95 transition-transform flex items-center justify-center"
                    title="Zatwierdź"
                  >
                    <Check size={22} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Action Save Button for non-numpad modes */}
        {(block.type === 'say' ||
          block.hasColorParam ||
          block.hasSpeedParam ||
          block.type === 'go_to_page') && (
          <button
            type="button"
            onClick={handleSave}
            className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-base rounded-2xl shadow-lg border-2 border-emerald-600 flex items-center justify-center gap-2 transition-transform"
          >
            <Check size={20} strokeWidth={3} />
            <span>Gotowe</span>
          </button>
        )}
      </div>
    </div>
  );
};
