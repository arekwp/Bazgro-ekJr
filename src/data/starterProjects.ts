import { Project } from '../types/scratch';
import { createBlock } from './blockCatalog';

export const STARTER_PROJECTS: Project[] = [
  {
    id: 'starter_robot_1',
    name: 'Pierwsze Kroki Robota',
    activePageIndex: 0,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    pages: [
      {
        id: 'page_1',
        name: 'Siatka Robotyki',
        backgroundId: 'grid',
        characters: [
          {
            id: 'char_robot_1',
            characterId: 'robot',
            name: 'Robot Bajt',
            x: 4,
            y: 4,
            homeX: 4,
            homeY: 4,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'medium',
            scripts: [
              {
                id: 'script_flag_1',
                blocks: [
                  createBlock('start_flag'),
                  { ...createBlock('say'), param: 'Ruszam do celu!' },
                  { ...createBlock('move_right'), param: 5 },
                  createBlock('sound_robot'),
                  { ...createBlock('move_up'), param: 4 },
                  { ...createBlock('hop'), param: 2 },
                  createBlock('end'),
                ],
              },
              {
                id: 'script_touch_1',
                blocks: [
                  createBlock('start_touch'),
                  { ...createBlock('say'), param: 'Bip-bip! Działam!' },
                  createBlock('sound_robot'),
                  createBlock('end'),
                ],
              },
            ],
          },
          {
            id: 'char_star_1',
            characterId: 'star',
            name: 'Złoty Cel',
            x: 15,
            y: 11,
            homeX: 15,
            homeY: 11,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'medium',
            scripts: [
              {
                id: 'script_star_touch',
                blocks: [
                  createBlock('start_touch'),
                  createBlock('sound_ding'),
                  { ...createBlock('hop'), param: 3 },
                  createBlock('end'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'starter_space_2',
    name: 'Wyprawa w Kosmos',
    activePageIndex: 0,
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
    pages: [
      {
        id: 'space_p1',
        name: 'Start Rakiety',
        backgroundId: 'lab',
        characters: [
          {
            id: 'char_rocket_1',
            characterId: 'rocket',
            name: 'Rakieta',
            x: 10,
            y: 4,
            homeX: 10,
            homeY: 4,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'fast',
            scripts: [
              {
                id: 'script_launch',
                blocks: [
                  createBlock('start_flag'),
                  { ...createBlock('say'), param: '3... 2... 1... START!' },
                  createBlock('sound_boing'),
                  { ...createBlock('move_up'), param: 6 },
                  { ...createBlock('go_to_page'), targetPage: 2 },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'space_p2',
        name: 'Księżyc i Łazik',
        backgroundId: 'space',
        characters: [
          {
            id: 'char_rover_1',
            characterId: 'rover',
            name: 'Łazik',
            x: 4,
            y: 4,
            homeX: 4,
            homeY: 4,
            rotation: 0,
            scale: 0.9,
            visible: true,
            speed: 'slow',
            scripts: [
              {
                id: 'script_rover_move',
                blocks: [
                  createBlock('start_flag'),
                  { ...createBlock('move_right'), param: 6 },
                  createBlock('sound_robot'),
                  { ...createBlock('say'), param: 'Odkryłem nową planetę!' },
                  createBlock('end'),
                ],
              },
            ],
          },
          {
            id: 'char_alien_1',
            characterId: 'alien',
            name: 'Kosmita Zik',
            x: 16,
            y: 5,
            homeX: 16,
            homeY: 5,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'medium',
            scripts: [
              {
                id: 'script_alien_dance',
                blocks: [
                  createBlock('start_flag'),
                  { ...createBlock('wait'), param: 15 },
                  { ...createBlock('hop'), param: 2 },
                  { ...createBlock('say'), param: 'Witaj na Księżycu!' },
                  createBlock('end'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'starter_meadow_3',
    name: 'Kot i Żabka na Łące',
    activePageIndex: 0,
    createdAt: Date.now() - 10800000,
    updatedAt: Date.now() - 10800000,
    pages: [
      {
        id: 'meadow_p1',
        name: 'Łąka',
        backgroundId: 'park',
        characters: [
          {
            id: 'char_cat_1',
            characterId: 'cat',
            name: 'Kotek Tik',
            x: 4,
            y: 4,
            homeX: 4,
            homeY: 4,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'medium',
            scripts: [
              {
                id: 'script_cat_walk',
                blocks: [
                  createBlock('start_flag'),
                  { ...createBlock('move_right'), param: 6 },
                  createBlock('sound_meow'),
                  { ...createBlock('say'), param: 'Cześć Żabko!' },
                  createBlock('end'),
                ],
              },
            ],
          },
          {
            id: 'char_frog_1',
            characterId: 'frog',
            name: 'Żabka Kumka',
            x: 14,
            y: 4,
            homeX: 14,
            homeY: 4,
            rotation: 0,
            scale: 1,
            visible: true,
            speed: 'fast',
            scripts: [
              {
                id: 'script_frog_bump',
                blocks: [
                  createBlock('start_bump'),
                  createBlock('sound_boing'),
                  { ...createBlock('hop'), param: 3 },
                  { ...createBlock('say'), param: 'Kum, kum!' },
                  createBlock('end'),
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
