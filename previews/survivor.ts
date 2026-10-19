// Demo Day uses Survivor 616's pinned simulation and renderer, not a traced imitation.
import { AREAS } from '@/game/data/areas';
import { CHARACTERS } from '@/game/data/characters';
import { createWorld, stepWorld, rollUpgradeChoices, applyUpgrade, type World } from '@/game/engine/world';
import { renderWorld } from '@/game/render/draw';
import { SILENT_FRAME } from '@/game/audio/beatBus';

export function createPreview() {
  const area = AREAS.find(item => item.id === 'monroe-strip') ?? AREAS[0]!;
  const character = CHARACTERS.find(item => item.id === 'shade') ?? CHARACTERS[0]!;
  let world: World;
  let clock = 0;

  function advance() {
    clock += 1 / 60;
    const nearest = world.enemies.filter(enemy => !enemy.dying).reduce<typeof world.enemies[number] | null>((best, enemy) =>
      !best || Math.hypot(enemy.x - world.player.x, enemy.y - world.player.y) < Math.hypot(best.x - world.player.x, best.y - world.player.y) ? enemy : best, null);
    const dx = nearest ? nearest.x - world.player.x : Math.cos(clock * .8);
    const dy = nearest ? nearest.y - world.player.y : Math.sin(clock * .7);
    const distance = Math.hypot(dx, dy) || 1;
    const moveX = nearest && distance < 110 ? -dx / distance : dx / distance;
    const moveY = nearest && distance < 110 ? -dy / distance : dy / distance;
    stepWorld(world, 1 / 60, { moveX, moveY, ultimate: false, audio: SILENT_FRAME });
    if (world.pendingLevelUps > 0) {
      const choice = rollUpgradeChoices(world)[0];
      if (choice) applyUpgrade(world, choice);
    }
  }
  function reset() {
    world = createWorld(area, character, character.stats, 616);
    clock = 0;
    // Begin at a live combat beat, after the opening walk toward the first wave.
    for (let i = 0; i < 480 && world.outcome === 'running'; i++) advance();
  }
  reset();

  return {
    paint(ctx: CanvasRenderingContext2D, width: number, height: number, elapsedMs: number, frozen = false) {
      if (world.outcome !== 'running' || world.time > 36) {
        reset();
      }
      if (!frozen) {
        // The same fixed step, automatic attacks, enemy waves, damage and pickups as a run.
        const steps = Math.min(3, Math.max(1, Math.round(elapsedMs / (1000 / 60))));
        for (let i = 0; i < steps; i++) {
          advance();
          if (world.outcome !== 'running') break;
        }
      }
      renderWorld(ctx, world, { width, height, dpr: ctx.canvas.width / width, targetViewOverride: 650 });
    },
  };
}
