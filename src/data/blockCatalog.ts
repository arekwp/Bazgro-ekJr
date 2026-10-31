import { BlockCategory, BlockType, ScriptBlock } from '../types/scratch';

export interface BlockDefinition {
  type: BlockType;
  category: BlockCategory;
  name: { pl: string; en: string };
  defaultParam?: number | string;
  isTrigger?: boolean;
  isEnd?: boolean;
  hasNumberParam?: boolean;
  hasTextParam?: boolean;
  hasColorParam?: boolean;
  hasSpeedParam?: boolean;
  hasPageParam?: boolean;
}

export const CATEGORY_COLORS: Record<BlockCategory, {
  bg: string;
  border: string;
  text: string;
  activeBg: string;
  lightBg: string;
}> = {
  trigger: {
    bg: '#F59E0B', // Amber / Yellow
    border: '#B45309',
    text: '#78350F',
    activeBg: '#D97706',
    lightBg: '#FEF3C7',
  },
  motion: {
    bg: '#3B82F6', // Blue
    border: '#1D4ED8',
    text: '#1E3A8A',
    activeBg: '#2563EB',
    lightBg: '#DBEAFE',
  },
  looks: {
    bg: '#A855F7', // Purple
    border: '#7E22CE',
    text: '#581C87',
    activeBg: '#9333EA',
    lightBg: '#F3E8FF',
  },
  sound: {
    bg: '#10B981', // Green
    border: '#047857',
    text: '#064E3B',
    activeBg: '#059669',
    lightBg: '#D1FAE5',
  },
  control: {
    bg: '#F97316', // Orange
    border: '#C2410C',
    text: '#7C2D12',
    activeBg: '#EA580C',
    lightBg: '#FFEDD5',
  },
  end: {
    bg: '#EF4444', // Red
    border: '#B91C1C',
    text: '#7F1D1D',
    activeBg: '#DC2626',
    lightBg: '#FEE2E2',
  },
};

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  // --- TRIGGER (Yellow) ---
  start_flag: {
    type: 'start_flag',
    category: 'trigger',
    name: { pl: 'Zielona Flaga (Start)', en: 'Green Flag (Start)' },
    isTrigger: true,
  },
  start_touch: {
    type: 'start_touch',
    category: 'trigger',
    name: { pl: 'Dotknij Postaci', en: 'Tap Character' },
    isTrigger: true,
  },
  start_bump: {
    type: 'start_bump',
    category: 'trigger',
    name: { pl: 'Zderzenie Postaci', en: 'Bump Character' },
    isTrigger: true,
  },
  start_message: {
    type: 'start_message',
    category: 'trigger',
    name: { pl: 'Odbierz Kopertę', en: 'Receive Envelope' },
    isTrigger: true,
    hasColorParam: true,
  },
  send_message: {
    type: 'send_message',
    category: 'trigger',
    name: { pl: 'Wyślij Kopertę', en: 'Send Envelope' },
    hasColorParam: true,
  },

  // --- MOTION (Blue) ---
  move_right: {
    type: 'move_right',
    category: 'motion',
    name: { pl: 'Ruch w Prawo', en: 'Move Right' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  move_left: {
    type: 'move_left',
    category: 'motion',
    name: { pl: 'Ruch w Lewo', en: 'Move Left' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  move_up: {
    type: 'move_up',
    category: 'motion',
    name: { pl: 'Ruch w Górę', en: 'Move Up' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  move_down: {
    type: 'move_down',
    category: 'motion',
    name: { pl: 'Ruch w Dół', en: 'Move Down' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  turn_right: {
    type: 'turn_right',
    category: 'motion',
    name: { pl: 'Obrót w Prawo', en: 'Turn Right' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  turn_left: {
    type: 'turn_left',
    category: 'motion',
    name: { pl: 'Obrót w Lewo', en: 'Turn Left' },
    defaultParam: 1,
    hasNumberParam: true,
  },
  hop: {
    type: 'hop',
    category: 'motion',
    name: { pl: 'Skok', en: 'Hop' },
    defaultParam: 2,
    hasNumberParam: true,
  },
  home: {
    type: 'home',
    category: 'motion',
    name: { pl: 'Wróć na Start', en: 'Go Home' },
  },

  // --- LOOKS (Purple) ---
  say: {
    type: 'say',
    category: 'looks',
    name: { pl: 'Powiedz Tekst', en: 'Say' },
    defaultParam: 'Cześć!',
    hasTextParam: true,
  },
  grow: {
    type: 'grow',
    category: 'looks',
    name: { pl: 'Powiększ', en: 'Grow' },
  },
  shrink: {
    type: 'shrink',
    category: 'looks',
    name: { pl: 'Pomniejsz', en: 'Shrink' },
  },
  reset_size: {
    type: 'reset_size',
    category: 'looks',
    name: { pl: 'Normalny Rozmiar', en: 'Reset Size' },
  },
  hide: {
    type: 'hide',
    category: 'looks',
    name: { pl: 'Schowaj', en: 'Hide' },
  },
  show: {
    type: 'show',
    category: 'looks',
    name: { pl: 'Pokaż', en: 'Show' },
  },

  // --- SOUND (Green) ---
  sound_pop: {
    type: 'sound_pop',
    category: 'sound',
    name: { pl: 'Dźwięk Pop', en: 'Pop Sound' },
  },
  sound_robot: {
    type: 'sound_robot',
    category: 'sound',
    name: { pl: 'Dźwięk Robota', en: 'Robot Sound' },
  },
  sound_boing: {
    type: 'sound_boing',
    category: 'sound',
    name: { pl: 'Sprężyna Boing', en: 'Boing Sound' },
  },
  sound_ding: {
    type: 'sound_ding',
    category: 'sound',
    name: { pl: 'Dzwonek Ding', en: 'Ding Sound' },
  },
  sound_meow: {
    type: 'sound_meow',
    category: 'sound',
    name: { pl: 'Miauknięcie Kota', en: 'Meow Sound' },
  },

  // --- CONTROL (Orange) ---
  wait: {
    type: 'wait',
    category: 'control',
    name: { pl: 'Czekaj', en: 'Wait' },
    defaultParam: 10, // 10 tenths = 1 second
    hasNumberParam: true,
  },
  stop: {
    type: 'stop',
    category: 'control',
    name: { pl: 'Zatrzymaj', en: 'Stop' },
    isEnd: true,
  },
  speed: {
    type: 'speed',
    category: 'control',
    name: { pl: 'Prędkość Ruchu', en: 'Set Speed' },
    hasSpeedParam: true,
  },
  repeat: {
    type: 'repeat',
    category: 'control',
    name: { pl: 'Powtórz Razy', en: 'Repeat' },
    defaultParam: 4,
    hasNumberParam: true,
  },

  // --- END (Red) ---
  end: {
    type: 'end',
    category: 'end',
    name: { pl: 'Koniec Programu', en: 'End' },
    isEnd: true,
  },
  forever: {
    type: 'forever',
    category: 'end',
    name: { pl: 'Powtarzaj w Nieskończoność', en: 'Repeat Forever' },
    isEnd: true,
  },
  go_to_page: {
    type: 'go_to_page',
    category: 'end',
    name: { pl: 'Przejdź do Sceny', en: 'Go to Page' },
    isEnd: true,
    hasPageParam: true,
    defaultParam: 1,
  },
};

export const CATEGORY_BLOCKS: Record<BlockCategory, BlockType[]> = {
  trigger: ['start_flag', 'start_touch', 'start_bump', 'start_message', 'send_message'],
  motion: ['move_right', 'move_left', 'move_up', 'move_down', 'turn_right', 'turn_left', 'hop', 'home'],
  looks: ['say', 'grow', 'shrink', 'reset_size', 'hide', 'show'],
  sound: ['sound_pop', 'sound_robot', 'sound_boing', 'sound_ding', 'sound_meow'],
  control: ['wait', 'stop', 'speed', 'repeat'],
  end: ['end', 'forever', 'go_to_page'],
};

export function createBlock(type: BlockType): ScriptBlock {
  const def = BLOCK_DEFINITIONS[type];
  const block: ScriptBlock = {
    id: `blk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    category: def.category,
    param: def.defaultParam,
  };

  if (def.hasColorParam) {
    block.hasColorParam = true;
    block.colorParam = 'orange';
  }
  if (def.hasSpeedParam) {
    block.hasSpeedParam = true;
    block.speedParam = 'medium';
  }
  if (def.hasPageParam) {
    block.targetPage = 1;
  }
  if (type === 'repeat') {
    block.innerBlocks = [];
  }

  return block;
}
