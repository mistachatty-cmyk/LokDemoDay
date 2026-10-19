// Fighter definitions and drawing come from the reviewed Classic and KS2 sources.
import { spawnCharacter as spawnClassic, renderChar as renderClassic } from '../games/kinetic-official/classic/src/pages/KineticSouls';
import { spawnCharacter as spawnKS2 } from '../games/kinetic-official/ks2/src/systems/Spawner';
import { renderChar as renderKS2 } from '../games/kinetic-official/ks2/src/render/DrawEntities';
import type { Character as KS2Character } from '../games/kinetic-official/ks2/src/game/types';

type Fighter = KS2Character & { previewHp: number };

export function createPreview(variant: 'classic' | 'ks2') {
  const fighters: Fighter[] = [];
  let elapsed = 0;
  let nextSpawn = 0;
  let impacts: Array<{ x: number; y: number; age: number }> = [];
  const ks2 = variant === 'ks2';

  function spawn(team: 1 | 2) {
    const type = ks2 ? (team === 1 ? 'assassin' : 'vanguard') : 'standard';
    const x = team === 1 ? 45 : 355;
    const y = 65 + Math.random() * 105;
    const fighter = (ks2
      ? spawnKS2(team, 'none', fighters, false, false, 'standard', 1, x, y, type)
      : spawnClassic(team, 'none', fighters as never, false, false, 'standard', 1, x, y)) as Fighter;
    fighter.vx = (team === 1 ? 1 : -1) * (2.8 + Math.random() * 1.7);
    fighter.vy = (Math.random() - .5) * 3;
    fighter.previewHp = fighter.hp;
    fighters.push(fighter);
  }

  for (let i = 0; i < 3; i++) { spawn(1); spawn(2); }
  return {
    paint(ctx: CanvasRenderingContext2D, width: number, height: number, elapsedMs: number, frozen = false) {
      const dt = frozen ? 0 : Math.min(elapsedMs / (1000 / 60), 2);
      elapsed += elapsedMs;
      if (!frozen && elapsed > nextSpawn) {
        nextSpawn = elapsed + 1000;
        if (fighters.length < 12) { spawn(1); spawn(2); }
      }
      ctx.setTransform(ctx.canvas.width / width, 0, 0, ctx.canvas.height / height, 0, 0);
      ctx.fillStyle = ks2 ? '#101527' : '#171421';
      ctx.fillRect(0, 0, width, height);
      ctx.save();
      ctx.scale(width / 400, height / 220);
      ctx.strokeStyle = ks2 ? '#66d8e322' : '#c7a3f52b';
      for (let x = 0; x <= 400; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 220); ctx.stroke(); }
      for (let y = 0; y <= 220; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke(); }
      for (const fighter of fighters) {
        if (dt) {
          fighter.x += fighter.vx * dt * 2.6;
          fighter.y += fighter.vy * dt * 2.6;
          if (fighter.x < 25 || fighter.x > 375) fighter.vx *= -1;
          if (fighter.y < 45 || fighter.y > 195) fighter.vy *= -1;
          fighter.angle += fighter.angularV * dt;
        }
        if (ks2) renderKS2(ctx, fighter, false, 1, 'classic', false, false, elapsed, 'block');
        else renderClassic(ctx, fighter as never, false, 1, 'overdrive', false, false, elapsed);
        ctx.fillStyle = fighter.team === 1 ? '#f58b9b' : '#8de5f4';
        ctx.fillRect(fighter.x - 13, fighter.y - 43, 26 * Math.max(.1, fighter.previewHp / fighter.maxHp), 3);
      }
      if (dt) for (let a = 0; a < fighters.length; a++) for (let b = a + 1; b < fighters.length; b++) {
        const left = fighters[a]!, right = fighters[b]!;
        if (left.team === right.team || Math.hypot(left.x - right.x, left.y - right.y) > 36) continue;
        left.vx *= -1; right.vx *= -1;
        left.previewHp -= .45 * dt; right.previewHp -= .45 * dt;
        if (impacts.length < 12) impacts.push({ x: (left.x + right.x) / 2, y: (left.y + right.y) / 2, age: 0 });
      }
      impacts = impacts.filter(hit => hit.age < 14);
      for (const hit of impacts) {
        hit.age += dt;
        ctx.strokeStyle = `rgba(255,232,175,${Math.max(0, 1 - hit.age / 14)})`;
        ctx.beginPath(); ctx.arc(hit.x, hit.y, 5 + hit.age * 1.4, 0, Math.PI * 2); ctx.stroke();
      }
      for (let i = fighters.length - 1; i >= 0; i--) if (fighters[i]!.previewHp <= 0) fighters.splice(i, 1);
      ctx.restore();
    },
  };
}
