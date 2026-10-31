import { CharacterInstance, ScriptBlock, ScriptChain, EnvelopeColor } from '../types/scratch';
import { sound } from './audio';

export type UpdateCharacterFn = (charId: string, updates: Partial<CharacterInstance>) => void;
export type HighlightBlockFn = (blockId: string | null) => void;
export type GoToPageFn = (pageIndex: number) => void;

interface ExecutionContext {
  character: CharacterInstance;
  updateCharacter: UpdateCharacterFn;
  highlightBlock: HighlightBlockFn;
  broadcastMessage: (color: EnvelopeColor) => void;
  checkCollisions: (charId: string) => void;
  goToPage: GoToPageFn;
  signal: AbortSignal;
}

export class ScriptInterpreter {
  private abortController: AbortController | null = null;
  private runningChains = new Set<string>();

  get isRunning() {
    return this.runningChains.size > 0;
  }

  stopAll() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.runningChains.clear();
  }

  async runProjectFlag(
    characters: CharacterInstance[],
    updateCharacter: UpdateCharacterFn,
    highlightBlock: HighlightBlockFn,
    goToPage: GoToPageFn,
    onFinish?: () => void
  ) {
    this.stopAll();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    sound.playStartChime();

    const triggerChains: { char: CharacterInstance; chain: ScriptChain }[] = [];
    characters.forEach((char) => {
      char.scripts.forEach((chain) => {
        if (chain.blocks.length > 0 && chain.blocks[0].type === 'start_flag') {
          triggerChains.push({ char, chain });
        }
      });
    });

    if (triggerChains.length === 0) {
      if (onFinish) onFinish();
      return;
    }

    const broadcast = (color: EnvelopeColor) => {
      characters.forEach((c) => {
        c.scripts.forEach((ch) => {
          if (
            ch.blocks.length > 0 &&
            ch.blocks[0].type === 'start_message' &&
            ch.blocks[0].colorParam === color
          ) {
            this.executeChain(ch, {
              character: c,
              updateCharacter,
              highlightBlock,
              broadcastMessage: broadcast,
              checkCollisions: checkBumps,
              goToPage,
              signal,
            }).catch(() => {});
          }
        });
      });
    };

    const checkBumps = (movedCharId: string) => {
      const moved = characters.find((c) => c.id === movedCharId);
      if (!moved) return;
      characters.forEach((target) => {
        if (target.id !== movedCharId) {
          const dx = Math.abs(moved.x - target.x);
          const dy = Math.abs(moved.y - target.y);
          if (dx < 1.6 && dy < 1.6) {
            // Collision detected! Trigger target bump scripts
            target.scripts.forEach((ch) => {
              if (ch.blocks.length > 0 && ch.blocks[0].type === 'start_bump') {
                this.executeChain(ch, {
                  character: target,
                  updateCharacter,
                  highlightBlock,
                  broadcastMessage: broadcast,
                  checkCollisions: checkBumps,
                  goToPage,
                  signal,
                }).catch(() => {});
              }
            });
          }
        }
      });
    };

    const promises = triggerChains.map(({ char, chain }) =>
      this.executeChain(chain, {
        character: char,
        updateCharacter,
        highlightBlock,
        broadcastMessage: broadcast,
        checkCollisions: checkBumps,
        goToPage,
        signal,
      })
    );

    try {
      await Promise.allSettled(promises);
    } finally {
      highlightBlock(null);
      if (onFinish) onFinish();
    }
  }

  async runSingleChain(
    chain: ScriptChain,
    char: CharacterInstance,
    characters: CharacterInstance[],
    updateCharacter: UpdateCharacterFn,
    highlightBlock: HighlightBlockFn,
    goToPage: GoToPageFn
  ) {
    if (!this.abortController || this.abortController.signal.aborted) {
      this.abortController = new AbortController();
    }
    const signal = this.abortController.signal;

    const broadcast = (color: EnvelopeColor) => {
      characters.forEach((c) => {
        c.scripts.forEach((ch) => {
          if (
            ch.blocks.length > 0 &&
            ch.blocks[0].type === 'start_message' &&
            ch.blocks[0].colorParam === color
          ) {
            this.executeChain(ch, {
              character: c,
              updateCharacter,
              highlightBlock,
              broadcastMessage: broadcast,
              checkCollisions: checkBumps,
              goToPage,
              signal,
            }).catch(() => {});
          }
        });
      });
    };

    const checkBumps = (movedCharId: string) => {
      const moved = characters.find((c) => c.id === movedCharId);
      if (!moved) return;
      characters.forEach((target) => {
        if (target.id !== movedCharId) {
          const dx = Math.abs(moved.x - target.x);
          const dy = Math.abs(moved.y - target.y);
          if (dx < 1.6 && dy < 1.6) {
            target.scripts.forEach((ch) => {
              if (ch.blocks.length > 0 && ch.blocks[0].type === 'start_bump') {
                this.executeChain(ch, {
                  character: target,
                  updateCharacter,
                  highlightBlock,
                  broadcastMessage: broadcast,
                  checkCollisions: checkBumps,
                  goToPage,
                  signal,
                }).catch(() => {});
              }
            });
          }
        }
      });
    };

    await this.executeChain(chain, {
      character: char,
      updateCharacter,
      highlightBlock,
      broadcastMessage: broadcast,
      checkCollisions: checkBumps,
      goToPage,
      signal,
    });
    highlightBlock(null);
  }

  private async sleep(ms: number, signal: AbortSignal): Promise<void> {
    if (signal.aborted) throw new Error('Aborted');
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve();
      }, ms);
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new Error('Aborted'));
        },
        { once: true }
      );
    });
  }

  private async executeChain(chain: ScriptChain, ctx: ExecutionContext) {
    if (chain.blocks.length === 0) return;
    this.runningChains.add(chain.id);

    try {
      let isForever = false;
      do {
        isForever = false;
        // Skip trigger block (index 0) if it is a trigger
        const startIndex = chain.blocks[0].category === 'trigger' ? 1 : 0;

        for (let i = startIndex; i < chain.blocks.length; i++) {
          if (ctx.signal.aborted) return;
          const block = chain.blocks[i];
          ctx.highlightBlock(block.id);

          await this.executeBlock(block, ctx);

          if (block.type === 'forever') {
            isForever = true;
            break;
          }
          if (block.type === 'stop' || block.type === 'end') {
            break;
          }
        }
      } while (isForever && !ctx.signal.aborted);
    } catch {
      // Aborted or cancelled cleanly
    } finally {
      this.runningChains.delete(chain.id);
    }
  }

  private async executeBlock(block: ScriptBlock, ctx: ExecutionContext) {
    const { character, updateCharacter, signal, broadcastMessage, checkCollisions, goToPage } = ctx;

    // Determine speed delay: slow = 350ms, medium = 220ms, fast = 120ms
    const speedDelays = { slow: 350, medium: 220, fast: 120 };
    const stepDuration = speedDelays[character.speed] || 220;

    switch (block.type) {
      case 'move_right': {
        const steps = Number(block.param) || 1;
        for (let s = 0; s < steps; s++) {
          if (signal.aborted) return;
          character.x = Math.min(20, Math.round((character.x + 1) * 10) / 10);
          updateCharacter(character.id, { x: character.x });
          checkCollisions(character.id);
          await this.sleep(stepDuration, signal);
        }
        break;
      }
      case 'move_left': {
        const steps = Number(block.param) || 1;
        for (let s = 0; s < steps; s++) {
          if (signal.aborted) return;
          character.x = Math.max(1, Math.round((character.x - 1) * 10) / 10);
          updateCharacter(character.id, { x: character.x });
          checkCollisions(character.id);
          await this.sleep(stepDuration, signal);
        }
        break;
      }
      case 'move_up': {
        const steps = Number(block.param) || 1;
        for (let s = 0; s < steps; s++) {
          if (signal.aborted) return;
          character.y = Math.min(15, Math.round((character.y + 1) * 10) / 10);
          updateCharacter(character.id, { y: character.y });
          checkCollisions(character.id);
          await this.sleep(stepDuration, signal);
        }
        break;
      }
      case 'move_down': {
        const steps = Number(block.param) || 1;
        for (let s = 0; s < steps; s++) {
          if (signal.aborted) return;
          character.y = Math.max(1, Math.round((character.y - 1) * 10) / 10);
          updateCharacter(character.id, { y: character.y });
          checkCollisions(character.id);
          await this.sleep(stepDuration, signal);
        }
        break;
      }
      case 'turn_right': {
        const times = Number(block.param) || 1;
        for (let t = 0; t < times; t++) {
          if (signal.aborted) return;
          character.rotation = (character.rotation + 30) % 360;
          updateCharacter(character.id, { rotation: character.rotation });
          await this.sleep(stepDuration * 0.8, signal);
        }
        break;
      }
      case 'turn_left': {
        const times = Number(block.param) || 1;
        for (let t = 0; t < times; t++) {
          if (signal.aborted) return;
          character.rotation = (character.rotation - 30 + 360) % 360;
          updateCharacter(character.id, { rotation: character.rotation });
          await this.sleep(stepDuration * 0.8, signal);
        }
        break;
      }
      case 'hop': {
        const height = Number(block.param) || 2;
        sound.playBoing();
        const originalY = character.y;
        character.y = Math.min(15, character.y + height);
        updateCharacter(character.id, { y: character.y });
        await this.sleep(stepDuration * 1.2, signal);
        character.y = originalY;
        updateCharacter(character.id, { y: originalY });
        await this.sleep(stepDuration * 0.8, signal);
        break;
      }
      case 'home': {
        character.x = character.homeX;
        character.y = character.homeY;
        character.rotation = 0;
        character.scale = 1;
        character.visible = true;
        character.speechText = undefined;
        updateCharacter(character.id, {
          x: character.x,
          y: character.y,
          rotation: 0,
          scale: 1,
          visible: true,
          speechText: undefined,
        });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'say': {
        const text = String(block.param || 'Cześć!');
        character.speechText = text;
        updateCharacter(character.id, { speechText: text });
        sound.speak(text);
        await this.sleep(1800, signal);
        character.speechText = undefined;
        updateCharacter(character.id, { speechText: undefined });
        break;
      }
      case 'grow': {
        character.scale = Math.min(2.5, Math.round((character.scale + 0.25) * 100) / 100);
        updateCharacter(character.id, { scale: character.scale });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'shrink': {
        character.scale = Math.max(0.4, Math.round((character.scale - 0.25) * 100) / 100);
        updateCharacter(character.id, { scale: character.scale });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'reset_size': {
        character.scale = 1.0;
        updateCharacter(character.id, { scale: 1.0 });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'hide': {
        character.visible = false;
        updateCharacter(character.id, { visible: false });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'show': {
        character.visible = true;
        updateCharacter(character.id, { visible: true });
        sound.playPop();
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'sound_pop': {
        sound.playPop();
        await this.sleep(200, signal);
        break;
      }
      case 'sound_robot': {
        sound.playRobot();
        await this.sleep(350, signal);
        break;
      }
      case 'sound_boing': {
        sound.playBoing();
        await this.sleep(350, signal);
        break;
      }
      case 'sound_ding': {
        sound.playDing();
        await this.sleep(450, signal);
        break;
      }
      case 'sound_meow': {
        sound.playMeow();
        await this.sleep(500, signal);
        break;
      }
      case 'wait': {
        const tenths = Number(block.param) || 10;
        await this.sleep(tenths * 100, signal);
        break;
      }
      case 'speed': {
        const speed = block.speedParam || 'medium';
        character.speed = speed;
        updateCharacter(character.id, { speed });
        break;
      }
      case 'send_message': {
        const color = block.colorParam || 'orange';
        sound.playDing();
        broadcastMessage(color);
        await this.sleep(stepDuration, signal);
        break;
      }
      case 'go_to_page': {
        const target = (Number(block.targetPage) || 1) - 1;
        sound.playStartChime();
        goToPage(target);
        break;
      }
      default:
        break;
    }
  }
}

export const interpreter = new ScriptInterpreter();
