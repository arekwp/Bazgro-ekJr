import React from 'react';
import { BlockCategory, BlockType, ScriptBlock } from '../types/scratch';
import { CATEGORY_BLOCKS, CATEGORY_COLORS, BLOCK_DEFINITIONS, createBlock } from '../data/blockCatalog';
import { PuzzleBlock } from './PuzzleBlock';
import { sound } from '../utils/audio';

interface BlockPaletteProps {
  selectedCategory: BlockCategory;
  onSelectCategory: (cat: BlockCategory) => void;
  onAddBlockToWorkspace: (block: ScriptBlock) => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddBlockToWorkspace,
}) => {
  const categories: { id: BlockCategory; name: { pl: string; en: string }; icon: string }[] = [
    { id: 'trigger', name: { pl: 'Start', en: 'Trigger' }, icon: '🚩' },
    { id: 'motion', name: { pl: 'Ruch', en: 'Motion' }, icon: '➔' },
    { id: 'looks', name: { pl: 'Wygląd', en: 'Looks' }, icon: '💬' },
    { id: 'sound', name: { pl: 'Dźwięk', en: 'Sound' }, icon: '🔊' },
    { id: 'control', name: { pl: 'Czekaj', en: 'Control' }, icon: '⏱️' },
    { id: 'end', name: { pl: 'Koniec', en: 'End' }, icon: '⏹️' },
  ];

  const currentBlockTypes = CATEGORY_BLOCKS[selectedCategory] || [];

  const handlePaletteBlockClick = (type: BlockType) => {
    sound.playSnap();
    const newBlock = createBlock(type);
    onAddBlockToWorkspace(newBlock);
  };

  return (
    <div className="bg-amber-100/90 border-t-2 border-amber-300 flex flex-col shrink-0 select-none shadow-sm">
      {/* Category Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 overflow-x-auto border-b border-amber-200">
        {categories.map((cat) => {
          const colors = CATEGORY_COLORS[cat.id];
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sound.playPop();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap active:scale-95 shadow-xs ${
                isSelected
                  ? 'scale-105 shadow-md ring-2 ring-white text-white'
                  : 'opacity-70 hover:opacity-100 hover:scale-102 text-white'
              }`}
              style={{
                backgroundColor: isSelected ? colors.activeBg : colors.bg,
              }}
            >
              <span className="text-sm">{cat.icon}</span>
              <span className="drop-shadow-xs">{cat.name.pl}</span>
            </button>
          );
        })}
      </div>

      {/* Blocks Palette Shelf */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 overflow-x-auto min-h-[74px] bg-amber-50/60">
        {currentBlockTypes.map((type) => {
          const def = BLOCK_DEFINITIONS[type];
          const previewBlock = createBlock(type);

          return (
            <div
              key={type}
              className="flex flex-col items-center group relative cursor-pointer"
              onClick={() => handlePaletteBlockClick(type)}
              title={`${def.name.pl} (Dotknij, aby dodać)`}
            >
              <PuzzleBlock block={previewBlock} isPalette />
            </div>
          );
        })}
      </div>
    </div>
  );
};
