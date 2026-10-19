import { createWorld, issue, stepWorld, type World } from '../games/pongfall/src/sim/world';
import { FIXED_DT } from '../games/pongfall/src/sim/tuning';
import { createFx, feedFx } from '../games/pongfall/src/render/eyes';
import { newCamera, renderWorld, stepCamera } from '../games/pongfall/src/render/draw';
import type { GameResult } from '../games/pongfall/src/sim/result';
import { createPageWorldTransform } from '../site/pongfall-page-world.mjs';
import { createPageTouchActions } from '../site/pongfall-page-input.mjs';
import { drawThroughPageApertures, getPageDamageApertures } from '../site/pongfall-page-compositor.mjs';
import { canPlayPage, scanPageTargetRects } from '../site/pongfall-page-targets.mjs';

declare global { interface Window { PongFallPageMode?: { start(): { ok: boolean; reason?: string }; stop(): void; isRunning(): boolean } } }

type PageTarget = { element: Element; x: number; y: number; width: number; height: number; damage: number; destroyed: boolean; lastHitTick: number };
const MAX_PAGE_TARGETS = 500;
const TARGET_DAMAGE = 3;
const TARGET_HIT_COOLDOWN = 14;

class PongFallPage {
  host: HTMLDivElement;
  root: ShadowRoot;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  hud: HTMLElement;
  status: HTMLElement;
  targets = new Map<Element, PageTarget>();
  observer: MutationObserver;
  resizeObserver: ResizeObserver;
  world: World;
  touchActions: ReturnType<typeof createPageTouchActions>;
  camera = newCamera();
  fx = createFx(matchMedia('(prefers-reduced-motion: reduce)').matches);
  running = true;
  paused = false;
  frameId = 0;
  previous = performance.now();
  accumulator = 0;
  scanAt = 0;
  dpr = 1;
  width = 1;
  height = 1;
  scale = 1;
  originX: number;
  originY: number;
  keys = new Set<string>();
  lastMoveY = Number.NaN;
  targetBreaks = 0;
  completed = false;

  constructor() {
    if (!canPlayPage(location, document)) throw new Error('Demo Day skips sign-in, account security, and payment pages.');
    if (typeof ResizeObserver !== 'function' || typeof MutationObserver !== 'function') {
      throw new Error('This browser is missing a page observer needed by PongFall.');
    }
    this.originX = scrollX + innerWidth / 2;
    this.originY = scrollY + innerHeight / 2;
    this.world = createWorld({ mode: 'classic', difficulty: 'chill', arenas: 0 }, Date.now() >>> 0);
    this.touchActions = createPageTouchActions({
      onThrust: () => { if (this.running && !this.paused) issue(this.world, { k: 'thrust', side: 0 }); },
      onPower: () => { if (this.running && !this.paused) issue(this.world, { k: 'power', side: 0 }); },
    });
    this.fx.fogMode = 'low';
    this.host = document.createElement('div');
    this.host.id = 'lok-pongfall-page';
    this.host.dataset.lokNondestructible = '';
    this.host.style.cssText = 'position:fixed;inset:0;z-index:2147483646;pointer-events:none';
    this.root = this.host.attachShadow({ mode: 'open' });
    this.root.innerHTML = `<style>
      :host{all:initial}*{box-sizing:border-box}.canvas{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;image-rendering:pixelated}
      .hud{position:fixed;top:12px;left:12px;right:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;color:#e9f2ff;font:700 12px/1.4 ui-monospace,Consolas,monospace;text-shadow:0 1px 3px #000;pointer-events:none}
      .card,.actions{background:linear-gradient(135deg,#0b111dee,#111b2dee);border:1px solid #4aa8ff99;box-shadow:0 0 0 1px #0009,0 10px 30px #0009;padding:10px 12px}
      .card{max-width:min(520px,58vw);border-left:3px solid #4aa8ff}.brand{color:#79bdff;letter-spacing:.12em;font-size:10px}.score{font-size:19px;color:#fff;margin-top:4px}.meta{color:#aab8ca;margin-top:3px}.actions{display:flex;gap:6px;pointer-events:auto}
      button{border:1px solid #526b88;background:#18263b;color:#edf6ff;padding:9px 10px;font:900 10px ui-monospace,Consolas,monospace;letter-spacing:.04em;cursor:pointer}button:hover,button:focus-visible{border-color:#8bd0ff;outline:2px solid #8bd0ff}button[data-exit]{color:#ffb8a6;border-color:#b16d64}
      .status{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);max-width:calc(100vw - 24px);padding:7px 10px;background:#080d16dd;border:1px solid #4aa8ff77;color:#d7e9ff;font:700 11px ui-monospace,Consolas,monospace;text-align:center;pointer-events:none}
      @media(max-width:640px){.hud{flex-direction:column;align-items:stretch}.card{max-width:none}.actions{justify-content:flex-start;flex-wrap:wrap}.status{bottom:78px}}
      @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}
    </style><canvas class="canvas" aria-hidden="true"></canvas>
      <div class="hud"><div class="card"><div class="brand">PONGFALL // LIVE PAGE ARENA</div><div class="score" data-score>0 : 0</div><div class="meta">W/S or move pointer · double-tap thrust · two-finger tap pinball · P pause</div><div class="meta" data-depth>DEPTH 0 M · TARGETS 0</div></div>
      <div class="actions"><button type="button" data-pause>P PAUSE</button><button type="button" data-reset>NEW RUN</button><button type="button" data-exit>RESTORE PAGE</button></div></div>
      <div class="status" data-status role="status">Move the pointer or press W/S. Source game art appears through damaged page targets.</div>`;
    this.canvas = this.root.querySelector('canvas')!;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      this.host.remove();
      throw new Error('This browser cannot create the PongFall page canvas.');
    }
    this.ctx = ctx;
    this.hud = this.root.querySelector('[data-score]')!;
    this.status = this.root.querySelector('[data-status]')!;
    document.body.append(this.host);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(document.documentElement);
    this.resize();
    this.observer = new MutationObserver(() => { this.scanAt = 0; });
    this.observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'hidden', 'class', 'style'] });
    this.root.querySelector('[data-pause]')!.addEventListener('click', () => this.togglePause());
    this.root.querySelector('[data-reset]')!.addEventListener('click', () => this.reset());
    this.root.querySelector('[data-exit]')!.addEventListener('click', () => this.stop());
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerup', this.onPointerUp, { passive: true });
    window.addEventListener('pointercancel', this.onPointerCancel, { passive: true });
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.releaseKeys);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.scanTargets();
    this.frameId = requestAnimationFrame(this.frame);
  }

  resize() {
    this.width = Math.max(1, innerWidth); this.height = Math.max(1, innerHeight);
    this.originX = scrollX + this.width / 2;
    this.dpr = Math.min(2, devicePixelRatio || 1);
    this.canvas.width = Math.round(this.width * this.dpr); this.canvas.height = Math.round(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`; this.canvas.style.height = `${this.height}px`;
    this.scale = this.width / 640;
  }

  scanTargets() {
    const view = { scrollX, scrollY, width: this.width, height: this.height };
    const found = scanPageTargetRects(document, view, { maxCandidates: 1800, maxTargets: 180 });
    for (const item of found) {
      if (this.targets.has(item.element)) continue;
      if (this.targets.size >= MAX_PAGE_TARGETS) break;
      this.targets.set(item.element, { ...item, damage: 0, destroyed: false, lastHitTick: -TARGET_HIT_COOLDOWN });
    }
    for (const [element, target] of this.targets) {
      if (!element.isConnected) { this.targets.delete(element); continue; }
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) { target.x = rect.left + scrollX; target.y = rect.top + scrollY; target.width = rect.width; target.height = rect.height; }
    }
    this.scanAt = performance.now() + 700;
  }

  transform() { return createPageWorldTransform({ originX: this.originX, originY: this.originY, scale: this.scale }); }

  isInteractivePointer(event: PointerEvent) {
    return event.composedPath().some(node => node instanceof Element
      && (node.matches('a,button,input,textarea,select,label,summary,iframe,video,audio,[contenteditable="true"],[role="button"],[role="link"]')
        || Boolean(node.closest('[data-lok-nondestructible],[data-lok-page-ui]'))));
  }

  onPointerDown = (event: PointerEvent) => {
    if (this.isInteractivePointer(event)) return;
    this.touchActions.pointerDown({ pointerId: event.pointerId, pointerType: event.pointerType, x: event.clientX, y: event.clientY });
  };

  onPointerUp = (event: PointerEvent) => { this.touchActions.pointerUp({ pointerId: event.pointerId, pointerType: event.pointerType }); };
  onPointerCancel = (event: PointerEvent) => { this.touchActions.pointerCancel(event.pointerId); };

  onPointerMove = (event: PointerEvent) => {
    if (this.paused || !this.running) return;
    if (event.pointerType === 'touch') {
      this.touchActions.pointerMove({ pointerId: event.pointerId, x: event.clientX, y: event.clientY });
      if (!event.isPrimary || this.isInteractivePointer(event)) return;
    }
    const worldPoint = this.transform().toWorld({ x: scrollX + event.clientX, y: scrollY + event.clientY }, this.world.scroll);
    if (!worldPoint || Math.abs(worldPoint.y - this.lastMoveY) < 1) return;
    this.lastMoveY = worldPoint.y;
    issue(this.world, { k: 'move', side: 0, y: worldPoint.y });
  };

  onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const key = event.key.toLowerCase();
    if (['w', 's', ' ', 'e', 'p', 'r', 'escape'].includes(key)) event.preventDefault();
    if (key === 'p' || key === 'escape') { if (!event.repeat) this.togglePause(); return; }
    if (key === 'r') { if (!event.repeat) this.reset(); return; }
    if (key === ' ') { if (!event.repeat && !this.paused) issue(this.world, { k: 'thrust', side: 0 }); return; }
    if (key === 'e') { if (!event.repeat && !this.paused) issue(this.world, { k: 'power', side: 0 }); return; }
    if (key === 'w' || key === 's') this.keys.add(key);
  };

  onKeyUp = (event: KeyboardEvent) => { this.keys.delete(event.key.toLowerCase()); };
  releaseKeys = () => { this.keys.clear(); this.touchActions.reset(); };
  onVisibility = () => {
    this.previous = performance.now(); this.accumulator = 0;
    if (document.hidden) this.releaseKeys();
  };

  togglePause() {
    if (!this.running || this.world.status !== 'play') return;
    this.paused = !this.paused;
    this.previous = performance.now();
    this.root.querySelector('[data-pause]')!.textContent = this.paused ? 'RESUME' : 'P PAUSE';
    this.status.textContent = this.paused ? 'PAUSED · press P to resume or Restore Page to leave.' : 'Match running · the live page is the arena.';
  }

  reset() {
    if (!this.running) return;
    this.world = createWorld({ mode: 'classic', difficulty: 'chill', arenas: 0 }, Date.now() >>> 0);
    this.fx = createFx(matchMedia('(prefers-reduced-motion: reduce)').matches); this.fx.fogMode = 'low';
    this.paused = false; this.completed = false; this.targetBreaks = 0; this.accumulator = 0;
    for (const target of this.targets.values()) { target.damage = 0; target.destroyed = false; target.lastHitTick = -TARGET_HIT_COOLDOWN; }
    this.root.querySelector('[data-pause]')!.textContent = 'P PAUSE';
    this.status.textContent = 'New Classic match · Player vs PongFall source NPC.';
  }

  damageTargets() {
    const transform = this.transform();
    for (const target of this.targets.values()) {
      if (target.destroyed || this.world.tick - target.lastHitTick < TARGET_HIT_COOLDOWN) continue;
      const rect = transform.targetToWorld(target, this.world.scroll);
      if (!rect) continue;
      for (const ball of this.world.balls) {
        if (ball.x + 10 < rect.x || ball.x - 10 > rect.x + rect.width || ball.y + 10 < rect.y || ball.y - 10 > rect.y + rect.height) continue;
        const speed = Math.hypot(ball.vx, ball.vy);
        target.damage = Math.min(TARGET_DAMAGE, target.damage + Math.max(0.2, Math.min(0.6, speed / 1800)));
        target.lastHitTick = this.world.tick;
        if (target.damage >= TARGET_DAMAGE) { target.destroyed = true; this.targetBreaks++; }
        break;
      }
    }
  }

  frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.075, Math.max(0, (now - this.previous) / 1000)); this.previous = now;
    if (!document.hidden && !this.paused && this.world.status === 'play') {
      this.accumulator += dt;
      while (this.accumulator >= FIXED_DT) {
        const direction = (this.keys.has('s') ? 1 : 0) - (this.keys.has('w') ? 1 : 0);
        if (direction) issue(this.world, { k: 'move', side: 0, y: this.world.sides[0].paddleY + direction * 80 });
        stepWorld(this.world);
        const events = this.world.events.splice(0);
        feedFx(this.fx, this.world, events, FIXED_DT, now);
        this.damageTargets();
        this.accumulator -= FIXED_DT;
      }
    }
    if (now >= this.scanAt) this.scanTargets();
    stepCamera(this.world, this.camera, this.width, this.height, document.hidden ? 0 : dt);
    const score = `${this.world.sides[0].score} : ${this.world.sides[1].score}`;
    this.hud.textContent = score;
    this.root.querySelector('[data-depth]')!.textContent = `DEPTH ${Math.floor(this.world.scroll / 10)} M · TARGETS ${this.targetBreaks} / ${this.targets.size}`;
    this.draw(now);
    if (this.world.status === 'over' && !this.completed) this.finish();
    this.frameId = requestAnimationFrame(this.frame);
  };

  draw(now: number) {
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    const view = { scrollX, scrollY, width: this.width, height: this.height };
    const apertures = getPageDamageApertures([...this.targets.values()].map(target => ({ ...target, reveal: target.damage / TARGET_DAMAGE })), view);
    if (!apertures.length) {
      this.status.textContent = `Break page content with the PongFall ball · ${this.world.sides[0].score} : ${this.world.sides[1].score}`;
      return;
    }
    drawThroughPageApertures(ctx, apertures, targetCtx => {
      const ratio = this.scale / Math.max(0.05, this.camera.zoom);
      const x = this.originX - scrollX - this.width * ratio / 2;
      const y = this.originY + this.world.scroll - scrollY - this.height * ratio / 2;
      targetCtx.setTransform(this.dpr * ratio, 0, 0, this.dpr * ratio, this.dpr * x, this.dpr * y);
      const hud: { paused: boolean; result: GameResult | null; best: number | null; user: string | null; trail: never[]; now: number; muted: boolean; perks: string[]; hints: boolean; gauge: boolean } = {
        paused: this.paused, result: null, best: null, user: null, trail: [], now, muted: true, perks: [], hints: false, gauge: false,
      };
      renderWorld(targetCtx, this.world, this.camera, this.width, this.height, hud, this.fx);
    });
  }

  finish() {
    this.completed = true;
    const result = this.world.winner === 0 ? 'Player wins' : this.world.winner === 1 ? 'PongFall NPC wins' : 'Draw';
    this.status.textContent = `${result} · ${this.world.sides[0].score} : ${this.world.sides[1].score} · ${this.targetBreaks} page targets broken · New Run to play again.`;
    this.root.querySelector('[data-reset]')!.textContent = 'REMATCH';
  }

  stop() {
    if (!this.running) return;
    this.running = false; cancelAnimationFrame(this.frameId);
    this.observer.disconnect(); this.resizeObserver.disconnect(); this.keys.clear();
    window.removeEventListener('pointerdown', this.onPointerDown); window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp); window.removeEventListener('pointercancel', this.onPointerCancel);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp); window.removeEventListener('blur', this.releaseKeys);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.host.remove();
    active = null;
  }
}

let active: PongFallPage | null = null;
window.PongFallPageMode = {
  start() {
    if (active?.running) return { ok: true };
    try { active = new PongFallPage(); return { ok: true }; }
    catch (error) { return { ok: false, reason: error instanceof Error ? error.message : 'PongFall could not start on this page.' }; }
  },
  stop() { active?.stop(); },
  isRunning() { return Boolean(active?.running); },
};
