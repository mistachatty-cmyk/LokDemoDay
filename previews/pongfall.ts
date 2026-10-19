// This preview uses PongFall's pinned simulation and renderer so the hub card
// shows the actual falling-arena match, with no controls or audio.
import { createWorld, stepWorld, type World } from '../games/pongfall/src/sim/world';
import { FIXED_DT } from '../games/pongfall/src/sim/tuning';
import { feedFx, createFx } from '../games/pongfall/src/render/eyes';
import { renderWorld, newCamera, stepCamera } from '../games/pongfall/src/render/draw';
import type { GameResult } from '../games/pongfall/src/sim/result';

const freshWorld = (seed: number): World => createWorld({ mode: 'classic', difficulty: 'chill', arenas: 0 }, seed);

export function createPreview() {
  let seed = 393;
  let world = freshWorld(seed);
  let camera = newCamera();
  camera.zoom = 0.5;
  const fx = createFx(true);
  fx.fogMode = 'low';
  let accumulator = 0;
  let simulatedMs = 0;
  const events = [] as World['events'];

  function reset() {
    world = freshWorld(++seed);
    camera = newCamera();
    camera.zoom = 0.5;
    accumulator = 0;
    fx.endAt = 0;
    fx.splats.length = 0;
    fx.stirs.length = 0;
  }

  return {
    paint(ctx: CanvasRenderingContext2D, width: number, height: number, elapsedMs: number, frozen = false) {
      const dprX = ctx.canvas.width / width;
      const dprY = ctx.canvas.height / height;
      ctx.setTransform(dprX, 0, 0, dprY, 0, 0);
      const dt = frozen ? 0 : Math.min(Math.max(0, elapsedMs / 1000), 0.075);
      if (!frozen && world.status === 'play') {
        accumulator += dt;
        while (accumulator >= FIXED_DT) {
          stepWorld(world);
          for (const event of world.events) events.push(event);
          world.events.length = 0;
          accumulator -= FIXED_DT;
        }
        simulatedMs += elapsedMs;
        feedFx(fx, world, events, dt, simulatedMs);
        events.length = 0;
      } else if (!frozen && world.status === 'over') {
        reset();
      }
      stepCamera(world, camera, width, height, dt);
      const hud: { paused: boolean; result: GameResult | null; best: number | null; user: string | null; trail: never[]; now: number; muted: boolean; perks: string[]; hints: boolean; gauge: boolean } = {
        paused: false, result: null, best: null, user: null, trail: [], now: simulatedMs,
        muted: true, perks: [], hints: false, gauge: false,
      };
      renderWorld(ctx, world, camera, width, height, hud, fx);
    },
  };
}
