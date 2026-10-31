import React from 'react';
import { ScriptBlock, ScriptChain } from '../types/scratch';
import { PuzzleBlock } from './PuzzleBlock';
import { sound } from '../utils/audio';
import { Plus, Trash2, Play } from 'lucide-react';

interface ScriptingAreaProps {
  characterName: string;
  scripts: ScriptChain[];
  activeBlockId: string | null;
  onTapParam: (block: ScriptBlock) => void;
  onAddChain: () => void;
  onRemoveBlock: (chainId: string, blockIndex: number) => void;
  onDeleteChain: (chainId: string) => void;
  onTestChain: (chain: ScriptChain) => void;
}

export const ScriptingArea: React.FC<ScriptingAreaProps> = ({
  characterName,
  scripts,
  activeBlockId,
  onTapParam,
  onAddChain,
  onRemoveBlock,
  onDeleteChain,
  onTestChain,
}) => {
  return (
    <div className="flex-1 bg-amber-50/90 p-2 sm:p-3 overflow-y-auto select-none min-h-[160px] flex flex-col justify-between">
      {/* Script Chains List */}
      <div className="flex flex-col gap-4">
        {scripts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-amber-800/60 font-bold text-center gap-2">
            <span className="text-3xl">🧩</span>
            <p className="text-sm">
              Wybierz bloczek z palety powyżej, aby zaprogramować: <strong className="text-amber-950">{characterName}</strong>
            </p>
          </div>
        ) : (
          scripts.map((chain, chainIndex) => (
            <div
              key={chain.id}
              className="flex items-center gap-1 sm:gap-2 p-2 bg-white/70 rounded-2xl border-2 border-amber-200 shadow-xs relative overflow-x-auto min-h-[90px]"
            >
              {/* Chain Action Controls (Test Play & Delete Chain) */}
              <div className="flex flex-col items-center gap-1 pr-1 border-r border-amber-200 shrink-0">
                <button
                  type="button"
                  onClick={() => onTestChain(chain)}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                  title="Przetestuj ten skrypt"
                >
                  <Play size={16} fill="white" className="ml-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playTrash();
                    onDeleteChain(chain.id);
                  }}
                  className="w-7 h-7 rounded-full bg-amber-100 hover:bg-red-100 text-amber-800 hover:text-red-600 flex items-center justify-center active:scale-90 transition-colors"
                  title="Usuń cały ten ciąg bloczków"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Horizontal sequence of snapped blocks */}
              <div className="flex items-center gap-0.5 overflow-x-auto py-1">
                {chain.blocks.map((block, bIdx) => (
                  <div key={block.id} className="relative group">
                    <PuzzleBlock
                      block={block}
                      isActive={activeBlockId === block.id}
                      onTapParam={() => onTapParam(block)}
                    />

                    {/* Small delete block button on hover/touch */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playTrash();
                        onRemoveBlock(chain.id, bIdx);
                      }}
                      className="absolute -top-1.5 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 sm:opacity-0 active:scale-90 transition-opacity z-40 text-[9px] font-bold"
                      title="Usuń ten bloczek"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer bar with Add New Script Track */}
      <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onAddChain();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300 hover:bg-amber-400 active:scale-95 text-amber-950 font-black text-xs border border-amber-400 shadow-xs transition-transform"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Nowy ciąg bloczków</span>
        </button>

        <span className="text-[11px] font-bold text-amber-800/80 hidden sm:inline">
          Dotknij bloczka, aby zmienić liczbę lub słowo · Dotknij zielonego trójkąta, aby przetestować
        </span>
      </div>
    </div>
  );
};
