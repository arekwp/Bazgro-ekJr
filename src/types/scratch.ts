/**
 * Type definitions for ScratchJr Web Clone
 */

export type BlockCategory = 'trigger' | 'motion' | 'looks' | 'sound' | 'control' | 'end';

export type EnvelopeColor = 'yellow' | 'orange' | 'red' | 'purple' | 'blue' | 'green';

export type TriggerBlockType =
  | 'start_flag'     // Start on Green Flag
  | 'start_touch'    // Start on Character Tap
  | 'start_bump'     // Start on collision with another character
  | 'start_message'  // Start when receiving colored envelope
  | 'send_message';  // Send colored envelope

export type MotionBlockType =
  | 'move_right'
  | 'move_left'
  | 'move_up'
  | 'move_down'
  | 'turn_right'
  | 'turn_left'
  | 'hop'
  | 'home';

export type LooksBlockType =
  | 'say'
  | 'grow'
  | 'shrink'
  | 'reset_size'
  | 'hide'
  | 'show';

export type SoundBlockType =
  | 'sound_pop'
  | 'sound_robot'
  | 'sound_boing'
  | 'sound_ding'
  | 'sound_meow';

export type ControlBlockType =
  | 'wait'
  | 'stop'
  | 'speed'
  | 'repeat';

export type EndBlockType =
  | 'end'
  | 'forever'
  | 'go_to_page';

export type BlockType =
  | TriggerBlockType
  | MotionBlockType
  | LooksBlockType
  | SoundBlockType
  | ControlBlockType
  | EndBlockType;

export interface ScriptBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  param?: number | string; // Steps, degrees, wait tenths, or speech text
  colorParam?: EnvelopeColor; // For start_message / send_message
  speedParam?: 'slow' | 'medium' | 'fast'; // For speed block
  targetPage?: number; // 1, 2, 3, 4 for go_to_page
  innerBlocks?: ScriptBlock[]; // For repeat block
  hasColorParam?: boolean;
  hasSpeedParam?: boolean;
}

export interface ScriptChain {
  id: string;
  blocks: ScriptBlock[];
}

export interface CharacterInstance {
  id: string;
  characterId: string; // references template in characters.ts
  name: string;
  x: number; // Grid column: 1 to 20 (can be fractional during animation)
  y: number; // Grid row: 1 to 15 (1 at bottom or top, we use 1 at bottom, 15 at top standard Cartesian)
  homeX: number;
  homeY: number;
  rotation: number; // degrees (0 = normal)
  scale: number; // 1.0 = normal
  visible: boolean;
  speechText?: string;
  speed: 'slow' | 'medium' | 'fast';
  scripts: ScriptChain[];
}

export interface ScenePage {
  id: string;
  name: string;
  backgroundId: string;
  characters: CharacterInstance[];
}

export interface Project {
  id: string;
  name: string;
  pages: ScenePage[];
  activePageIndex: number;
  createdAt: number;
  updatedAt: number;
}
