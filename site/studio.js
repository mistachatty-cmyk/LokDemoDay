const canvas = document.getElementById('studio-canvas');
const ctx = canvas.getContext('2d');
const status = document.getElementById('studio-status');
const timeline = document.getElementById('studio-timeline');
const mute = document.getElementById('studio-mute');
const playButton = document.getElementById('studio-play');
const progressSummary = document.getElementById('progress-summary');
const progressBadges = document.getElementById('progress-badges');
const STORAGE_KEY = 'lok:demoday:studio:v1';
const BADGES = [
  { id: 'first-break', title: 'First Break', test: (p) => p.breaks >= 1 },
  { id: 'first-clear', title: 'First Clear', test: (p) => p.runs >= 1 },
  { id: 'five-clears', title: 'Wrecking Crew', test: (p) => p.runs >= 5 },
  { id: 'rift-fragment', title: 'Rift Fragment', test: (p) => p.runs >= 3 },
];

function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      runs: Math.max(0, Math.min(100000, Number(raw.runs) || 0)),
      breaks: Math.max(0, Math.min(1000000, Number(raw.breaks) || 0)),
      best: Math.max(0, Math.min(100, Number(raw.best) || 0)),
      xp: Math.max(0, Math.min(10000000, Number(raw.xp) || 0)),
    };
  } catch { return { runs: 0, breaks: 0, best: 0, xp: 0 }; }
}
const progress = loadProgress();
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Private browsing can block storage. */ }
  progressSummary.innerHTML = `<div><strong>${progress.runs}</strong><span>Scenes cleared</span></div><div><strong>${progress.best}%</strong><span>Best destruction</span></div><div><strong>${Math.floor(progress.xp / 100) + 1}</strong><span>Sandbox level</span></div>`;
  progressBadges.replaceChildren(...BADGES.map((badge) => {
    const item = document.createElement('span');
    item.className = badge.test(progress) ? 'progress-badge earned' : 'progress-badge';
    item.textContent = `${badge.test(progress) ? '✦' : '◇'} ${badge.title}`;
    return item;
  }));
}
saveProgress();

let media = null;
let mediaUrl = null;
let tiles = [];
let running = true;
let finished = false;
let runId = crypto.randomUUID();
let dragging = null;
let pointerDown = false;
let lastTime = 0;
const COLS = 12;
const ROWS = 7;

function starterMap(kind) {
  const offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  const c = offscreen.getContext('2d');
  c.fillStyle = kind === 'neon' ? '#101329' : '#eee3cf';
  c.fillRect(0, 0, offscreen.width, offscreen.height);
  if (kind === 'neon') {
    for (let i = 0; i < 16; i++) {
      const x = i * 70 - 20;
      const h = 90 + (i * 71 % 220);
      c.fillStyle = i % 2 ? '#333056' : '#253855';
      c.fillRect(x, 540 - h, 56, h);
      c.fillStyle = i % 3 ? '#bda8ff' : '#f58a73';
      for (let y = 550 - h; y < 500; y += 27) c.fillRect(x + 13, y, 6, 10);
    }
    c.fillStyle = '#d8c9ff';
    c.font = 'bold 58px Impact, sans-serif';
    c.fillText('BREAK THE SIGNAL', 145, 150);
  } else {
    c.strokeStyle = '#b8a893';
    for (let x = 40; x < 960; x += 45) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 540); c.stroke(); }
    for (let y = 35; y < 540; y += 45) { c.beginPath(); c.moveTo(0, y); c.lineTo(960, y); c.stroke(); }
    c.fillStyle = '#44372f';
    c.font = 'bold 72px Impact, sans-serif';
    c.fillText('MAKE A MESS', 240, 210);
    c.font = '24px sans-serif';
    c.fillText('Then put it back together.', 333, 260);
  }
  return offscreen;
}

function resetScene(source, message) {
  if (media instanceof HTMLVideoElement) media.pause();
  media = source;
  tiles = [];
  const w = canvas.width / COLS;
  const h = canvas.height / ROWS;
  for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
    tiles.push({ x: col * w, y: row * h, homeX: col * w, homeY: row * h, w, h, vx: 0, vy: 0, angle: 0, spin: 0, broken: false });
  }
  finished = false;
  runId = crypto.randomUUID();
  running = true;
  playButton.textContent = 'PAUSE';
  if (media instanceof HTMLVideoElement) { media.muted = mute.checked; void media.play().catch(() => { status.textContent = 'Press Play to start your video.'; }); }
  status.textContent = message;
}

function destroyAt(x, y) {
  if (!media || !running) return;
  let newlyBroken = 0;
  for (const tile of tiles) {
    const cx = tile.x + tile.w / 2;
    const cy = tile.y + tile.h / 2;
    const distance = Math.hypot(cx - x, cy - y);
    if (distance > 100 || tile.broken) continue;
    tile.broken = true;
    const force = (100 - distance) / 100;
    tile.vx = (cx - x) * 0.055 + (Math.random() - 0.5) * 5;
    tile.vy = (cy - y) * 0.055 - 4 * force;
    tile.spin = (Math.random() - 0.5) * 0.06;
    newlyBroken++;
  }
  if (!newlyBroken) return;
  progress.breaks += newlyBroken;
  progress.xp += newlyBroken * 3;
  const percent = Math.round(tiles.filter((tile) => tile.broken).length / tiles.length * 100);
  progress.best = Math.max(progress.best, percent);
  if (percent >= 60 && !finished) {
    finished = true;
    progress.runs++;
    progress.xp += 100;
    status.textContent = `Scene cleared — ${percent}% broken. +100 XP. Rebuild to create another run.`;
    if (window.parent !== window) {
      const payload = { type: 'lok:demoday:run', version: 1, runId, gameKey: 'studio', score: percent, xp: 100, completedAt: new Date().toISOString() };
      for (const origin of ['https://gsix.online', 'http://localhost:3000']) window.parent.postMessage(payload, origin);
    }
  } else status.textContent = `${percent}% broken. Drag while paused to rearrange the pieces.`;
  saveProgress();
}

function draw(timestamp) {
  const delta = Math.min(2, (timestamp - lastTime) / 16.67 || 1);
  lastTime = timestamp;
  ctx.fillStyle = '#0a0c14';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (media) {
    const sourceWidth = media instanceof HTMLVideoElement ? media.videoWidth : media.width;
    const sourceHeight = media instanceof HTMLVideoElement ? media.videoHeight : media.height;
    if (sourceWidth && sourceHeight) for (const tile of tiles) {
      if (running && tile.broken && tile !== dragging) {
        tile.x += tile.vx * delta;
        tile.y += tile.vy * delta;
        tile.vy += 0.15 * delta;
        tile.vx *= 0.995;
        tile.angle += tile.spin * delta;
      }
      ctx.save();
      ctx.translate(tile.x + tile.w / 2, tile.y + tile.h / 2);
      ctx.rotate(tile.angle);
      ctx.drawImage(media, tile.homeX / canvas.width * sourceWidth, tile.homeY / canvas.height * sourceHeight, tile.w / canvas.width * sourceWidth, tile.h / canvas.height * sourceHeight, -tile.w / 2, -tile.h / 2, tile.w, tile.h);
      ctx.strokeStyle = tile.broken ? '#f8dcac' : '#ffffff13';
      ctx.strokeRect(-tile.w / 2, -tile.h / 2, tile.w, tile.h);
      ctx.restore();
    }
  }
  if (media instanceof HTMLVideoElement && Number.isFinite(media.duration) && media.duration > 0 && !timeline.matches(':active')) timeline.value = String(Math.round(media.currentTime / media.duration * 1000));
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function position(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
}
canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  pointerDown = true;
  const point = position(event);
  if (!running) dragging = [...tiles].reverse().find((tile) => Math.abs(point.x - tile.x - tile.w / 2) < tile.w / 2 && Math.abs(point.y - tile.y - tile.h / 2) < tile.h / 2) || null;
  else destroyAt(point.x, point.y);
});
canvas.addEventListener('pointermove', (event) => {
  if (!pointerDown) return;
  const point = position(event);
  if (dragging) { dragging.x = point.x - dragging.w / 2; dragging.y = point.y - dragging.h / 2; }
  else destroyAt(point.x, point.y);
});
canvas.addEventListener('pointerup', () => { pointerDown = false; dragging = null; });
canvas.addEventListener('pointercancel', () => { pointerDown = false; dragging = null; });

function togglePlay() {
  running = !running;
  playButton.textContent = running ? 'PAUSE' : 'PLAY';
  if (media instanceof HTMLVideoElement) {
    if (running) void media.play().catch(() => { status.textContent = 'Your browser needs a click to play this video.'; });
    else media.pause();
  }
}
playButton.addEventListener('click', togglePlay);
window.addEventListener('keydown', (event) => {
  if (event.code !== 'Space' || !document.getElementById('studio').contains(document.activeElement)) return;
  if (document.activeElement instanceof HTMLInputElement) return;
  event.preventDefault();
  togglePlay();
});
document.getElementById('studio-rebuild').addEventListener('click', () => { if (media) resetScene(media, 'Scene rebuilt. Click or drag to break it again.'); });
document.getElementById('studio-export').addEventListener('click', () => {
  if (!media) return;
  const link = document.createElement('a');
  link.download = `lok-demo-day-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});
document.getElementById('studio-record').addEventListener('click', () => {
  if (!media) return;
  if (!window.MediaRecorder || !canvas.captureStream) { status.textContent = 'This browser cannot record canvas clips. Export an image instead.'; return; }
  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) { status.textContent = 'This browser cannot record WebM clips. Export an image instead.'; return; }
  const recordButton = document.getElementById('studio-record');
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  recorder.onstop = () => {
    stream.getTracks().forEach((track) => track.stop());
    recordButton.disabled = false;
    const url = URL.createObjectURL(new Blob(chunks, { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `lok-demo-day-${Date.now()}.webm`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    status.textContent = 'Clip saved to your downloads.';
  };
  recorder.onerror = () => { stream.getTracks().forEach((track) => track.stop()); recordButton.disabled = false; status.textContent = 'Recording failed. Export an image instead.'; };
  recordButton.disabled = true;
  status.textContent = 'Recording eight seconds of your sandbox…';
  recorder.start();
  setTimeout(() => { if (recorder.state !== 'inactive') recorder.stop(); }, 8000);
});
timeline.addEventListener('input', () => {
  if (media instanceof HTMLVideoElement && Number.isFinite(media.duration)) media.currentTime = Number(timeline.value) / 1000 * media.duration;
});
mute.addEventListener('change', () => { if (media instanceof HTMLVideoElement) media.muted = mute.checked; });

document.querySelectorAll('[data-studio-map]').forEach((button) => button.addEventListener('click', () => {
  if (mediaUrl) { URL.revokeObjectURL(mediaUrl); mediaUrl = null; }
  timeline.disabled = true;
  timeline.value = '0';
  resetScene(starterMap(button.dataset.studioMap), `${button.textContent} loaded. Click or drag to break it.`);
}));
document.getElementById('studio-file').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!/^(image\/(png|jpeg|webp|gif)|video\/(mp4|webm))$/.test(file.type) || file.size > 100 * 1024 * 1024) {
    status.textContent = 'Choose a PNG, JPG, WebP, GIF, MP4 or WebM file up to 100 MB.';
    return;
  }
  if (mediaUrl) URL.revokeObjectURL(mediaUrl);
  mediaUrl = URL.createObjectURL(file);
  if (file.type.startsWith('image/')) {
    const image = new Image();
    image.onload = () => { timeline.disabled = true; resetScene(image, `${file.name} loaded locally. Click or drag to break it.`); };
    image.onerror = () => { status.textContent = 'Could not read this image.'; };
    image.src = mediaUrl;
  } else {
    const video = document.createElement('video');
    video.playsInline = true;
    video.loop = true;
    video.muted = mute.checked;
    video.onloadedmetadata = () => { timeline.disabled = false; resetScene(video, `${file.name} loaded locally. Its fragments keep playing.`); };
    video.onerror = () => { status.textContent = 'Could not read this video.'; };
    video.src = mediaUrl;
  }
});

document.getElementById('studio-open-url').addEventListener('click', () => {
  let url;
  try { url = new URL(document.getElementById('studio-url').value); } catch { status.textContent = 'Enter a complete HTTPS website URL.'; return; }
  if (url.protocol !== 'https:') { status.textContent = 'Use an HTTPS website URL.'; return; }
  window.open(url.href, '_blank', 'noopener,noreferrer');
  status.textContent = 'Website opened. Use the Demo Day bookmarklet on that page; some sites block outside scripts.';
});
document.getElementById('studio-open-youtube').addEventListener('click', () => {
  let url;
  try { url = new URL(document.getElementById('studio-youtube').value); } catch { status.textContent = 'Enter a YouTube video URL.'; return; }
  const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : /(^|\.)youtube\.com$/.test(url.hostname) ? url.searchParams.get('v') : null;
  if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) { status.textContent = 'Enter a standard YouTube watch or youtu.be link.'; return; }
  const host = document.getElementById('studio-youtube-player');
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${id}?controls=1`;
  frame.title = 'YouTube video player';
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen = true;
  host.replaceChildren(frame);
  host.hidden = false;
  status.textContent = 'YouTube plays in its official player. Use an owned video file for destructible playing shards.';
});

document.querySelector('[data-studio-map="neon"]').click();
