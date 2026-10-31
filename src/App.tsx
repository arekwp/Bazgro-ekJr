import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Project, ScenePage, CharacterInstance, ScriptBlock, ScriptChain, BlockCategory } from './types/scratch';
import { STARTER_PROJECTS } from './data/starterProjects';
import { createBlock } from './data/blockCatalog';
import { interpreter } from './utils/interpreter';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { Stage } from './components/Stage';
import { CharacterSelector } from './components/CharacterSelector';
import { SceneNavigator } from './components/SceneNavigator';
import { BlockPalette } from './components/BlockPalette';
import { ScriptingArea } from './components/ScriptingArea';
import { ParamEditorModal } from './components/NumericKeypad';
import { ProjectLibrary } from './components/ProjectLibrary';
import { GuideModal } from './components/GuideModal';
import { Eye, Code, ChevronUp, ChevronDown } from 'lucide-react';

const STORAGE_KEY = 'scratchjr_web_projects_v1';

export default function App() {
  // Load projects from localStorage or use starter projects
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return STARTER_PROJECTS;
  });

  // Current active project ID (null = show ProjectLibrary)
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
    return 'starter_robot_1';
  });

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory>('motion');

  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isPresentation, setIsPresentation] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null);

  const [editingBlock, setEditingBlock] = useState<ScriptBlock | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // History stack for Undo functionality (reverting last project modifications)
  const [history, setHistory] = useState<Project[]>([]);

  // Browser Fullscreen state (for hiding mobile address bar)
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState<boolean>(false);

  // Sync fullscreen state with document events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsBrowserFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleBrowserFullscreen = useCallback(() => {
    try {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => void;
      };
      const docEl = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => void;
      };

      const isFs = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      if (!isFs) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch {
      // browser prevented or not supported
    }
  }, []);

  // Mobile portrait view mode: 'both' | 'stage' | 'code'
  const [mobileViewTab, setMobileViewTab] = useState<'stage' | 'code'>('stage');

  // Stage size shrink toggle (shrinks stage to ~50% to give maximum space for blocks & scripts in landscape)
  const [isStageShrunk, setIsStageShrunk] = useState<boolean>(false);
  const touchStartYRef = useRef<number>(0);

  // Active Project Reference
  const currentProject = useMemo(() => {
    if (!currentProjectId) return null;
    return projects.find((p) => p.id === currentProjectId) || null;
  }, [projects, currentProjectId]);

  // Current Page Reference
  const currentPage: ScenePage | null = useMemo(() => {
    if (!currentProject || !currentProject.pages[activePageIndex]) {
      return currentProject?.pages[0] || null;
    }
    return currentProject.pages[activePageIndex];
  }, [currentProject, activePageIndex]);

  // Push current project snapshot onto the history stack before making a change
  const pushHistory = useCallback(() => {
    if (!currentProject) return;
    const snapshot: Project = JSON.parse(JSON.stringify(currentProject));
    setHistory((prev) => [...prev.slice(-25), snapshot]);
  }, [currentProject]);

  // Handle Undo: revert the last change made to the project
  const handleUndo = useCallback(() => {
    if (history.length === 0 || !currentProjectId) return;
    interpreter.stopAll();
    setIsRunning(false);
    setHighlightedBlockId(null);

    const prevSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === currentProjectId ? prevSnapshot : p))
    );

    if (activePageIndex >= prevSnapshot.pages.length) {
      setActivePageIndex(Math.max(0, prevSnapshot.pages.length - 1));
    }

    sound.playPop();
  }, [history, currentProjectId, activePageIndex]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // quota or private mode
    }
  }, [projects]);

  // Ensure valid selectedCharacterId whenever page changes
  useEffect(() => {
    if (currentPage && currentPage.characters.length > 0) {
      const exists = currentPage.characters.some((c) => c.id === selectedCharacterId);
      if (!exists) {
        setSelectedCharacterId(currentPage.characters[0].id);
      }
    } else {
      setSelectedCharacterId('');
    }
  }, [currentPage, selectedCharacterId]);

  // Selected Character Reference
  const selectedCharacter = useMemo(() => {
    if (!currentPage) return null;
    return currentPage.characters.find((c) => c.id === selectedCharacterId) || currentPage.characters[0] || null;
  }, [currentPage, selectedCharacterId]);

  // Update a character on the current page
  const updateCharacter = useCallback(
    (charId: string, updates: Partial<CharacterInstance>) => {
      if (!currentProjectId) return;
      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, pIdx) => {
              if (pIdx !== activePageIndex) return page;
              return {
                ...page,
                characters: page.characters.map((c) => {
                  if (c.id !== charId) return c;
                  return { ...c, ...updates };
                }),
              };
            }),
          };
        })
      );
    },
    [currentProjectId, activePageIndex]
  );

  // Run all scripts on Green Flag
  const handleRunGreenFlag = useCallback(() => {
    if (!currentPage) return;
    setIsRunning(true);
    sound.playStartChime();

    interpreter.runProjectFlag(
      currentPage.characters,
      updateCharacter,
      (blockId) => setHighlightedBlockId(blockId),
      (targetPageIndex) => {
        if (currentProject && currentProject.pages[targetPageIndex]) {
          setActivePageIndex(targetPageIndex);
        }
      },
      () => {
        setIsRunning(false);
        setHighlightedBlockId(null);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.65 },
        });
      }
    );
  }, [currentPage, updateCharacter, currentProject]);

  // Stop scripts
  const handleStop = useCallback(() => {
    interpreter.stopAll();
    setIsRunning(false);
    setHighlightedBlockId(null);
    if (currentPage) {
      currentPage.characters.forEach((char) => {
        if (char.speechText) {
          updateCharacter(char.id, { speechText: undefined });
        }
      });
    }
  }, [currentPage, updateCharacter]);

  // Reset characters to starting positions
  const handleResetPositions = useCallback(() => {
    handleStop();
    if (!currentPage) return;
    pushHistory();
    currentPage.characters.forEach((char) => {
      updateCharacter(char.id, {
        x: char.homeX,
        y: char.homeY,
        rotation: 0,
        scale: 1,
        visible: true,
        speechText: undefined,
      });
    });
    sound.playPop();
  }, [currentPage, handleStop, pushHistory, updateCharacter]);

  // Character touched on stage
  const handleCharacterTouch = useCallback(
    (char: CharacterInstance) => {
      if (!currentPage) return;
      const touchChains = char.scripts.filter(
        (s) => s.blocks.length > 0 && s.blocks[0].type === 'start_touch'
      );
      if (touchChains.length > 0) {
        touchChains.forEach((chain) => {
          interpreter.runSingleChain(
            chain,
            char,
            currentPage.characters,
            updateCharacter,
            (blockId) => setHighlightedBlockId(blockId),
            (targetPageIndex) => {
              if (currentProject && currentProject.pages[targetPageIndex]) {
                setActivePageIndex(targetPageIndex);
              }
            }
          );
        });
      } else {
        // default playful hop & beep on tap if no script defined
        sound.playRobot();
        updateCharacter(char.id, { y: Math.min(15, char.y + 1) });
        setTimeout(() => {
          updateCharacter(char.id, { y: Math.max(1, char.y) });
        }, 150);
      }
    },
    [currentPage, updateCharacter, currentProject]
  );

  // Add block from palette to workspace
  const handleAddBlockToWorkspace = useCallback(
    (newBlock: ScriptBlock) => {
      if (!selectedCharacter || !currentProjectId) return;
      sound.playSnap();
      pushHistory();

      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, pIdx) => {
              if (pIdx !== activePageIndex) return page;
              return {
                ...page,
                characters: page.characters.map((c) => {
                  if (c.id !== selectedCharacter.id) return c;
                  const scripts = [...c.scripts];

                  if (newBlock.category === 'trigger') {
                    // Triggers always start a new chain!
                    const newChain: ScriptChain = {
                      id: `chain_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                      blocks: [newBlock],
                    };
                    return { ...c, scripts: [...scripts, newChain] };
                  }

                  // Non-trigger block: append to the last chain or create a new chain with start_flag
                  if (scripts.length === 0) {
                    const defaultTrigger = createBlock('start_flag');
                    const newChain: ScriptChain = {
                      id: `chain_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                      blocks: [defaultTrigger, newBlock],
                    };
                    return { ...c, scripts: [newChain] };
                  }

                  const lastChainIndex = scripts.length - 1;
                  const lastChain = scripts[lastChainIndex];
                  const updatedBlocks = [...lastChain.blocks, newBlock];
                  scripts[lastChainIndex] = { ...lastChain, blocks: updatedBlocks };

                  return { ...c, scripts };
                }),
              };
            }),
          };
        })
      );
    },
    [selectedCharacter, currentProjectId, pushHistory, activePageIndex]
  );

  // Add a new empty script track
  const handleAddChain = useCallback(() => {
    if (!selectedCharacter || !currentProjectId) return;
    pushHistory();
    const defaultTrigger = createBlock('start_flag');
    const newChain: ScriptChain = {
      id: `chain_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      blocks: [defaultTrigger],
    };

    setProjects((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          updatedAt: Date.now(),
          pages: proj.pages.map((page, pIdx) => {
            if (pIdx !== activePageIndex) return page;
            return {
              ...page,
              characters: page.characters.map((c) => {
                if (c.id !== selectedCharacter.id) return c;
                return { ...c, scripts: [...c.scripts, newChain] };
              }),
            };
          }),
        };
      })
    );
  }, [selectedCharacter, currentProjectId, pushHistory, activePageIndex]);

  // Remove single block from a chain
  const handleRemoveBlock = useCallback(
    (chainId: string, blockIndex: number) => {
      if (!selectedCharacter || !currentProjectId) return;
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, pIdx) => {
              if (pIdx !== activePageIndex) return page;
              return {
                ...page,
                characters: page.characters.map((c) => {
                  if (c.id !== selectedCharacter.id) return c;
                  const scripts = c.scripts
                    .map((chain) => {
                      if (chain.id !== chainId) return chain;
                      const blocks = chain.blocks.filter((_, idx) => idx !== blockIndex);
                      return { ...chain, blocks };
                    })
                    .filter((chain) => chain.blocks.length > 0);
                  return { ...c, scripts };
                }),
              };
            }),
          };
        })
      );
    },
    [selectedCharacter, currentProjectId, pushHistory, activePageIndex]
  );

  // Delete an entire chain
  const handleDeleteChain = useCallback(
    (chainId: string) => {
      if (!selectedCharacter || !currentProjectId) return;
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, pIdx) => {
              if (pIdx !== activePageIndex) return page;
              return {
                ...page,
                characters: page.characters.map((c) => {
                  if (c.id !== selectedCharacter.id) return c;
                  return {
                    ...c,
                    scripts: c.scripts.filter((chain) => chain.id !== chainId),
                  };
                }),
              };
            }),
          };
        })
      );
    },
    [selectedCharacter, currentProjectId, pushHistory, activePageIndex]
  );

  // Test-run single chain
  const handleTestChain = useCallback(
    (chain: ScriptChain) => {
      if (!selectedCharacter || !currentPage) return;
      sound.playPop();
      interpreter.runSingleChain(
        chain,
        selectedCharacter,
        currentPage.characters,
        updateCharacter,
        (blockId) => setHighlightedBlockId(blockId),
        (targetPageIndex) => {
          if (currentProject && currentProject.pages[targetPageIndex]) {
            setActivePageIndex(targetPageIndex);
          }
        }
      );
    },
    [selectedCharacter, currentPage, updateCharacter, currentProject]
  );

  // Save edited parameter of a block
  const handleSaveParam = useCallback(
    (updates: Partial<ScriptBlock>) => {
      if (!editingBlock || !selectedCharacter || !currentProjectId) return;
      pushHistory();
      setProjects((prevProjects) =>
        prevProjects.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, pIdx) => {
              if (pIdx !== activePageIndex) return page;
              return {
                ...page,
                characters: page.characters.map((c) => {
                  if (c.id !== selectedCharacter.id) return c;
                  return {
                    ...c,
                    scripts: c.scripts.map((chain) => ({
                      ...chain,
                      blocks: chain.blocks.map((blk) => {
                        if (blk.id !== editingBlock.id) return blk;
                        return { ...blk, ...updates };
                      }),
                    })),
                  };
                }),
              };
            }),
          };
        })
      );
    },
    [editingBlock, selectedCharacter, currentProjectId, pushHistory, activePageIndex]
  );

  // Add new character to current scene
  const handleAddCharacter = useCallback(
    (templateId: string) => {
      if (!currentProjectId) return;
      pushHistory();
      const newChar: CharacterInstance = {
        id: `char_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        characterId: templateId,
        name: templateId === 'robot' ? 'Nowy Robot' : 'Nowa Postać',
        x: Math.floor(Math.random() * 10) + 5,
        y: Math.floor(Math.random() * 6) + 4,
        homeX: 10,
        homeY: 6,
        rotation: 0,
        scale: 1,
        visible: true,
        speed: 'medium',
        scripts: [
          {
            id: `chain_${Date.now()}`,
            blocks: [createBlock('start_touch'), createBlock('sound_pop'), createBlock('end')],
          },
        ],
      };

      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, idx) => {
              if (idx !== activePageIndex) return page;
              return {
                ...page,
                characters: [...page.characters, newChar],
              };
            }),
          };
        })
      );
      setSelectedCharacterId(newChar.id);
    },
    [currentProjectId, pushHistory, activePageIndex]
  );

  // Delete character from current scene
  const handleDeleteCharacter = useCallback(
    (charId: string) => {
      if (!currentProjectId || !currentPage) return;
      pushHistory();
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((page, idx) => {
              if (idx !== activePageIndex) return page;
              const remaining = page.characters.filter((c) => c.id !== charId);
              return { ...page, characters: remaining };
            }),
          };
        })
      );
    },
    [currentProjectId, currentPage, pushHistory, activePageIndex]
  );

  // Add new scene page
  const handleAddPage = useCallback(() => {
    if (!currentProjectId || !currentProject) return;
    if (currentProject.pages.length >= 4) return;
    pushHistory();

    const newPage: ScenePage = {
      id: `page_${Date.now()}`,
      name: `Scena ${currentProject.pages.length + 1}`,
      backgroundId: 'lab',
      characters: [
        {
          id: `char_page_${Date.now()}`,
          characterId: 'robot',
          name: 'Robot Bajt',
          x: 5,
          y: 5,
          homeX: 5,
          homeY: 5,
          rotation: 0,
          scale: 1,
          visible: true,
          speed: 'medium',
          scripts: [
            {
              id: `chain_${Date.now()}`,
              blocks: [createBlock('start_flag'), { ...createBlock('say'), param: 'Nowa scena!' }, createBlock('end')],
            },
          ],
        },
      ],
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== currentProjectId) return proj;
        return {
          ...proj,
          updatedAt: Date.now(),
          pages: [...proj.pages, newPage],
        };
      })
    );
    setActivePageIndex(currentProject.pages.length);
  }, [currentProjectId, currentProject, pushHistory]);

  // Delete a scene page
  const handleDeletePage = useCallback(
    (pageIndex: number) => {
      if (!currentProjectId || !currentProject || currentProject.pages.length <= 1) return;
      pushHistory();
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          const remaining = proj.pages.filter((_, idx) => idx !== pageIndex);
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: remaining,
          };
        })
      );
      setActivePageIndex((prev) => Math.max(0, prev - 1));
    },
    [currentProjectId, currentProject, pushHistory]
  );

  // Change background for current scene
  const handleChangeBackground = useCallback(
    (bgId: string) => {
      if (!currentProjectId) return;
      pushHistory();
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return {
            ...proj,
            updatedAt: Date.now(),
            pages: proj.pages.map((p, idx) => {
              if (idx !== activePageIndex) return p;
              return { ...p, backgroundId: bgId };
            }),
          };
        })
      );
    },
    [currentProjectId, pushHistory, activePageIndex]
  );

  // Rename project
  const handleRenameProject = useCallback(
    (newName: string) => {
      if (!currentProjectId) return;
      pushHistory();
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj.id !== currentProjectId) return proj;
          return { ...proj, name: newName, updatedAt: Date.now() };
        })
      );
    },
    [currentProjectId, pushHistory]
  );

  // Export project to downloadable JSON
  const handleExportProject = useCallback((projectToExport?: Project) => {
    const proj = projectToExport || currentProject;
    if (!proj) return;
    const jsonStr = JSON.stringify(proj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${proj.name.replace(/\s+/g, '_')}.scratchjr.json`;
    link.click();
    URL.revokeObjectURL(url);
    sound.playCheer();
  }, [currentProject]);

  // Create new project from library
  const handleCreateNewProject = useCallback(() => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: `Mój Projekt ${projects.length + 1}`,
      activePageIndex: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: [
        {
          id: `p_${Date.now()}`,
          name: 'Scena 1',
          backgroundId: 'grid',
          characters: [
            {
              id: `c_${Date.now()}`,
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
                  id: `ch_${Date.now()}`,
                  blocks: [
                    createBlock('start_flag'),
                    { ...createBlock('move_right'), param: 4 },
                    createBlock('sound_robot'),
                    { ...createBlock('say'), param: 'Działam!' },
                    createBlock('end'),
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    setProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setActivePageIndex(0);
    sound.playCheer();
  }, [projects.length]);

  // Duplicate a project
  const handleDuplicateProject = useCallback((source: Project) => {
    const copy: Project = {
      ...source,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${source.name} (Kopia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects((prev) => [copy, ...prev]);
    sound.playPop();
  }, []);

  // Delete project from library
  const handleDeleteProject = useCallback(
    (projId: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== projId));
      if (currentProjectId === projId) {
        setCurrentProjectId(null);
      }
      sound.playTrash();
    },
    [currentProjectId]
  );

  // Import project
  const handleImportProject = useCallback((imported: Project) => {
    setProjects((prev) => [imported, ...prev]);
    setCurrentProjectId(imported.id);
    setActivePageIndex(0);
  }, []);

  // If no project is open, show the Project Library (Home screen)
  if (!currentProject || !currentPage) {
    return (
      <div className="min-h-screen">
        <ProjectLibrary
          projects={projects}
          onOpenProject={(id) => {
            setCurrentProjectId(id);
            setActivePageIndex(0);
            setHistory([]);
          }}
          onCreateProject={() => {
            handleCreateNewProject();
            setHistory([]);
          }}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onExportProject={handleExportProject}
          onImportProject={(imported) => {
            handleImportProject(imported);
            setHistory([]);
          }}
          onOpenGuide={() => setShowGuide(true)}
        />
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-amber-50 select-none">
      {/* Top Header */}
      <Header
        projectName={currentProject.name}
        showGrid={showGrid}
        isPresentation={isPresentation}
        isRunning={isRunning}
        isBrowserFullscreen={isBrowserFullscreen}
        canUndo={history.length > 0}
        onUndo={handleUndo}
        onToggleBrowserFullscreen={handleToggleBrowserFullscreen}
        onGoHome={() => {
          handleStop();
          setCurrentProjectId(null);
          setHistory([]);
        }}
        onRenameProject={handleRenameProject}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onTogglePresentation={() => setIsPresentation(!isPresentation)}
        onResetPositions={handleResetPositions}
        onRunGreenFlag={handleRunGreenFlag}
        onStop={handleStop}
        onOpenGuide={() => setShowGuide(true)}
        onExportProject={() => handleExportProject(currentProject)}
        onImportProjectFromFile={(imported) => {
          handleImportProject(imported);
          setHistory([]);
          sound.playCheer();
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        }}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Fullscreen / Presentation Mode View */}
        {isPresentation ? (
          <div className="flex-1 p-2 sm:p-4 bg-slate-950 flex items-center justify-center">
            <div className="w-full h-full max-w-5xl aspect-[4/3] max-h-[85vh]">
              <Stage
                backgroundId={currentPage.backgroundId}
                characters={currentPage.characters}
                selectedCharacterId={selectedCharacterId}
                showGrid={showGrid}
                isPresentation={true}
                onSelectCharacter={setSelectedCharacterId}
                onUpdateCharacter={updateCharacter}
                onCharacterTouch={handleCharacterTouch}
              />
            </div>
          </div>
        ) : (
          /* Normal Editor View (Stage + Characters Left + Scenes Right + Coding Bottom) */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile View Toggle Switch for small portrait phones */}
            <div className="flex sm:hidden bg-amber-200 border-b border-amber-300 px-3 py-1 items-center justify-between">
              <span className="text-[11px] font-black text-amber-900 truncate">
                {selectedCharacter?.name}
              </span>
              <div className="flex items-center gap-1 bg-amber-300/80 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMobileViewTab('stage')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    mobileViewTab === 'stage' ? 'bg-white text-amber-950 shadow-xs' : 'text-amber-900'
                  }`}
                >
                  <Eye size={13} />
                  <span>Scena</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewTab('code')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                    mobileViewTab === 'code' ? 'bg-white text-amber-950 shadow-xs' : 'text-amber-900'
                  }`}
                >
                  <Code size={13} />
                  <span>Kod</span>
                </button>
              </div>
            </div>

            {/* Split Content: Top Stage row + Bottom Coding Workbench */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Upper Section: Characters (Left), Stage (Center), Scenes (Right) */}
              <div
                onWheel={(e) => {
                  // Scrolling down on the stage area shrinks the stage to 50%!
                  if (e.deltaY > 12) {
                    setIsStageShrunk(true);
                  } else if (e.deltaY < -12) {
                    setIsStageShrunk(false);
                  }
                }}
                onTouchStart={(e) => {
                  touchStartYRef.current = e.touches[0].clientY;
                }}
                onTouchEnd={(e) => {
                  const endY = e.changedTouches[0].clientY;
                  const delta = touchStartYRef.current - endY;
                  // Swiping up = wants more room for blocks below
                  if (delta > 25) setIsStageShrunk(true);
                  // Swiping down = wants larger stage
                  else if (delta < -25) setIsStageShrunk(false);
                }}
                className={`flex overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileViewTab === 'code' ? 'hidden sm:flex flex-1 sm:flex-none' : 'flex-1'
                } ${
                  isStageShrunk ? 'sm:h-[24%]' : 'sm:h-[48%]'
                }`}
              >
                {/* Left: Character Selector */}
                <CharacterSelector
                  characters={currentPage.characters}
                  selectedCharacterId={selectedCharacterId}
                  onSelectCharacter={setSelectedCharacterId}
                  onAddCharacter={handleAddCharacter}
                  onDeleteCharacter={handleDeleteCharacter}
                />

                {/* Center: Stage Canvas */}
                <div className="flex-1 p-1 sm:p-2 bg-amber-50 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full max-w-4xl aspect-[4/3] max-h-full">
                    <Stage
                      backgroundId={currentPage.backgroundId}
                      characters={currentPage.characters}
                      selectedCharacterId={selectedCharacterId}
                      showGrid={showGrid}
                      isPresentation={false}
                      onSelectCharacter={setSelectedCharacterId}
                      onUpdateCharacter={updateCharacter}
                      onCharacterTouch={handleCharacterTouch}
                      onDragStart={pushHistory}
                    />
                  </div>
                </div>

                {/* Right: Scene Navigator */}
                <SceneNavigator
                  pages={currentProject.pages}
                  activePageIndex={activePageIndex}
                  onSelectPage={setActivePageIndex}
                  onAddPage={handleAddPage}
                  onDeletePage={handleDeletePage}
                  onChangeBackground={handleChangeBackground}
                />
              </div>

              {/* Tactical Stage Resize / Scroll Handle Bar */}
              <div className="relative z-20 flex items-center justify-center bg-amber-200/90 border-t border-b border-amber-300 py-0.5 select-none shrink-0 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setIsStageShrunk((prev) => !prev);
                  }}
                  className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white hover:bg-amber-100 active:scale-95 text-amber-950 font-black text-[11px] border border-amber-400 shadow-xs transition-transform"
                  title={
                    isStageShrunk
                      ? 'Rozwiń planszę (Większa scena)'
                      : 'Przewiń w dół lub kliknij, aby zmniejszyć planszę o 50% i powiększyć listę kroków'
                  }
                >
                  {isStageShrunk ? (
                    <>
                      <ChevronDown size={14} className="text-amber-800" strokeWidth={3} />
                      <span>Rozwiń planszę (50% ➔ 100%)</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp size={14} className="text-amber-800" strokeWidth={3} />
                      <span>Zmniejsz planszę o 50% (Więcej miejsca na kroki)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Lower Section: Block Palette & Scripting Workbench */}
              <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileViewTab === 'stage' ? 'hidden sm:flex' : 'flex flex-1'
                } ${
                  isStageShrunk ? 'sm:h-[76%]' : 'sm:h-[52%]'
                }`}
              >
                {/* Palette */}
                <BlockPalette
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddBlockToWorkspace={handleAddBlockToWorkspace}
                />

                {/* Scripting Tracks Area */}
                {selectedCharacter && (
                  <ScriptingArea
                    characterName={selectedCharacter.name}
                    scripts={selectedCharacter.scripts}
                    activeBlockId={highlightedBlockId}
                    onTapParam={(blk) => setEditingBlock(blk)}
                    onAddChain={handleAddChain}
                    onRemoveBlock={handleRemoveBlock}
                    onDeleteChain={handleDeleteChain}
                    onTestChain={handleTestChain}
                    onScrollArea={(e) => {
                      if (e.currentTarget.scrollTop > 8 && !isStageShrunk) {
                        setIsStageShrunk(true);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Parameter Editing Modal (Numbers, Words, Colors, Speeds) */}
      {editingBlock && (
        <ParamEditorModal
          block={editingBlock}
          totalPages={currentProject.pages.length}
          onSave={handleSaveParam}
          onClose={() => setEditingBlock(null)}
        />
      )}

      {/* Help & Guide Modal */}
      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
