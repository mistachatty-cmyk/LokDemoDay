/* Session-only user media target for the live webpage arena. No file is uploaded. */
(function () {
  if (window.LokDemoDayMedia) return;
  let target = null;
  let panel = null;
  let objectUrl = null;

  function clear() {
    if (target instanceof HTMLVideoElement) target.pause();
    target?.remove();
    panel?.remove();
    target = panel = null;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }

  function addFile(file) {
    if (!(file instanceof File)) return { ok: false, reason: 'Choose an image or video file.' };
    const isImage = file.type.startsWith('image/');
    const isVideo = ['video/mp4', 'video/webm', 'video/ogg'].includes(file.type);
    if (!isImage && !isVideo) return { ok: false, reason: 'Use an image, MP4, WebM, or Ogg video.' };
    if (file.size > 120 * 1024 * 1024) return { ok: false, reason: 'Use a file smaller than 120 MB.' };
    clear();
    objectUrl = URL.createObjectURL(file);
    target = document.createElement(isVideo ? 'video' : 'img');
    target.dataset.lokPageMediaTarget = '';
    target.src = objectUrl;
    target.style.cssText = `position:absolute;left:${Math.round(scrollX + innerWidth * 0.32)}px;top:${Math.round(scrollY + innerHeight * 0.23)}px;width:min(420px,40vw);max-height:42vh;object-fit:contain;z-index:2147483644;border:3px solid #8ceeff;box-shadow:0 12px 42px #000b;background:#06111c;cursor:move`;
    if (isImage) target.alt = 'Personal image target in the live-page arena';
    else {
      target.muted = true; target.loop = true; target.playsInline = true; target.controls = true;
      target.addEventListener('loadeddata', () => { target.play().catch(() => {}); }, { once: true });
    }

    // Put the media first in light DOM so each game's page scanner sees it early.
    document.body.prepend(target);
    let dragging = null;
    target.addEventListener('pointerdown', (event) => {
      if (isVideo && !event.altKey) return; // Leave video controls usable; Alt+drag moves a video.
      dragging = { x: event.clientX, y: event.clientY, left: target.offsetLeft, top: target.offsetTop };
      target.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    target.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      target.style.left = `${Math.max(0, Math.min(scrollX + innerWidth - 40, dragging.left + event.clientX - dragging.x))}px`;
      target.style.top = `${Math.max(0, Math.min(scrollY + innerHeight - 40, dragging.top + event.clientY - dragging.y))}px`;
    });
    target.addEventListener('pointerup', () => { dragging = null; });
    target.addEventListener('pointercancel', () => { dragging = null; });

    panel = document.createElement('div');
    panel.dataset.lokPageMediaUi = '';
    panel.style.cssText = 'position:fixed;bottom:14px;left:14px;z-index:2147483645';
    const shadow = panel.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>:host{all:initial}.box{max-width:min(350px,calc(100vw - 28px));padding:10px 12px;background:#081320ed;border:1px solid #83eafa;color:#effaff;font:12px/1.45 system-ui,sans-serif;box-shadow:0 8px 28px #0008}.title{font-weight:800;letter-spacing:.04em}.tip{color:#b3c5cb;margin:5px 0 8px}button{border:1px solid #8ceeff;background:#193548;color:#fff;padding:5px 9px;cursor:pointer}</style><div class="box"><div class="title">PERSONAL MEDIA TARGET</div><div class="tip"></div><button type="button">Remove media</button></div>`;
    shadow.querySelector('.tip').textContent = `${file.name} stays on this device for this session. ${isVideo ? 'Use the video controls; Alt+drag to move.' : 'Drag to move.'} Then choose a game to wreck it.`;
    shadow.querySelector('button').addEventListener('click', clear);
    document.body.appendChild(panel);
    return { ok: true };
  }

  window.LokDemoDayMedia = { addFile, clear, isActive: () => !!target };
})();
