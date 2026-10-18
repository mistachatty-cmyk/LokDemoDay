/* Demo Day bookmarklet entry. UI and game layers stay on the host page; no page content is uploaded. */
(function () {
  const hostWindow = window;
  const previous = hostWindow.LokDemoDayPageChooser;
  if (previous) { if (document.currentScript?.dataset.autostart !== undefined) previous.toggle(); return; }
  const bundleOrigin = new URL(document.currentScript?.src || location.href).origin;

  const bundles = {
    'survivor-616': { url: 'https://survivor.gsix.online/demoday.js', api: 'Survivor616DemoDay' },
    'kinetic-souls': { url: `${bundleOrigin}/kinetic-official-page.js`, api: 'KineticSoulsOfficialPage' },
    'experimental-shooter': { url: `${bundleOrigin}/kinetic-page.js`, api: 'KineticSoulsPage' },
  };
  let menu = null;
  let mediaLoading = null;
  function loadMediaTools() {
    if (hostWindow.LokDemoDayMedia) return Promise.resolve(hostWindow.LokDemoDayMedia);
    if (!mediaLoading) mediaLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${bundleOrigin}/page-media.js`;
      script.referrerPolicy = 'no-referrer';
      script.onload = () => hostWindow.LokDemoDayMedia ? resolve(hostWindow.LokDemoDayMedia) : reject(new Error('Media tools did not initialize.'));
      script.onerror = () => reject(new Error('This site blocks the media tools.'));
      document.head.appendChild(script);
    }).catch((error) => { mediaLoading = null; throw error; });
    return mediaLoading;
  }
  function sensitivePage() {
    return /\b(login|sign-in|signin|checkout|payment|billing|account\/security)\b/i.test(location.pathname)
      || !!document.querySelector('input[type="password"],input[autocomplete="cc-number"],input[name*="card" i]');
  }
  function active() {
    if (hostWindow.Survivor616DemoDay?.isRunning()) return 'survivor-616';
    if (hostWindow.KineticSoulsOfficialPage?.isRunning()) return 'kinetic-souls';
    if (hostWindow.KineticSoulsPage?.isRunning()) return 'kinetic-souls';
    return null;
  }
  function close() { menu?.remove(); menu = null; }
  function stop() {
    hostWindow.Survivor616DemoDay?.stop(true);
    hostWindow.KineticSoulsOfficialPage?.stop();
    hostWindow.KineticSoulsPage?.stop();
  }
  function start(mode, variant = 'classic') {
    const bundle = bundles[mode];
    if (!bundle) return;
    close();
    stop();
    if (hostWindow[bundle.api]) {
      const result = hostWindow[bundle.api].start({ variant });
      if (!result?.ok) alert(result?.reason || 'This page cannot be played.');
      return;
    }
    const script = document.createElement('script');
    script.src = bundle.url;
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      const result = hostWindow[bundle.api]?.start({ variant });
      if (!result?.ok) alert(result?.reason || 'This game could not start on this page.');
    };
    script.onerror = () => { script.remove(); alert('This site blocks Demo Day game scripts. Try another page or play at demo.gsix.online.'); };
    document.head.appendChild(script);
  }
  function open() {
    if (sensitivePage()) { alert('Demo Day skips sign-in and payment pages.'); return; }
    if (menu) return;
    menu = document.createElement('div');
    menu.dataset.lokDemoDayChooser = '';
    menu.style.cssText = 'position:fixed;inset:0;z-index:2147483647';
    const shadow = menu.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>
      :host{all:initial}.shade{position:fixed;inset:0;display:grid;place-items:center;background:#03050bdc;font:14px system-ui,sans-serif;color:#f5f5ff}
      .box{width:min(620px,calc(100vw - 28px));max-height:90vh;overflow:auto;padding:24px;border:2px solid #e99f7f;background:linear-gradient(145deg,#1b1e2c,#0e111b);box-shadow:0 24px 90px #000c}
      .kicker{color:#f09a79;font:700 13px ui-monospace,monospace;letter-spacing:.13em}.head{display:flex;justify-content:space-between;gap:16px}
      h2{font:900 clamp(32px,6vw,56px) Impact,system-ui,sans-serif;text-transform:uppercase;margin:8px 0 10px}p{line-height:1.5;color:#bfc2ce;margin:0 0 18px}
      .choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.choice{min-height:170px;padding:20px;text-align:left;border:1px solid #ffffff43;background:#172032;color:#fff;cursor:pointer}
      .choice:hover,.choice:focus-visible{border-color:#f09a79;outline:none}.choice[data-mode="kinetic-souls"]:hover,.choice[data-mode="kinetic-souls"]:focus-visible{border-color:#7be6ff}
      .choice[data-variant="classic"]{border-color:#7be6ff;box-shadow:inset 0 0 0 1px #7be6ff66}
      .choice small{display:block;font:700 11px ui-monospace,monospace;letter-spacing:.12em;color:#f09a79}.choice[data-mode="kinetic-souls"] small{color:#7be6ff}
      .choice strong{display:block;margin:14px 0;font:900 32px Impact,system-ui,sans-serif;text-transform:uppercase}.choice span{color:#c3c7d1;line-height:1.4}
      .close{border:1px solid #ffffff55;background:#ffffff12;color:#fff;padding:6px 10px;font-size:20px;cursor:pointer}
      .media{margin-top:14px;padding:13px;border:1px dashed #7be6ff;background:#102638}.media label{display:block;font-weight:800;cursor:pointer}.media input{display:block;margin-top:8px;max-width:100%;color:#fff}.media p{font-size:12px;margin:7px 0 0}
      @media(max-width:540px){.choices{grid-template-columns:1fr}.choice{min-height:120px}}
    </style><div class="shade"><div class="box" role="dialog" aria-modal="true" aria-labelledby="lok-page-title">
      <div class="head"><div><span class="kicker">LOK DEMO DAY / LIVE PAGE</span><h2 id="lok-page-title">Choose your game</h2></div><button class="close" type="button" aria-label="Close">&times;</button></div>
      <p>Play over this whole website. Leaving restores it.</p><div class="choices">
        <button class="choice" data-mode="survivor-616" type="button"><small>01 / SURVIVAL</small><strong>Survivor 616</strong><span>Outlast waves and break page elements.</span></button>
        <button class="choice" data-mode="kinetic-souls" type="button"><small>02 / TEAM BATTLE</small><strong>Kinetic Souls</strong><span>Spawn left and right teams to battle across this page.</span></button>
      </div><details class="media"><summary>Experimental</summary><button type="button" data-mode="experimental-shooter">Page shooter experiment</button></details><div class="media"><label for="lok-page-media-file">Add your image or video to this page</label><input id="lok-page-media-file" type="file" accept="image/*,video/mp4,video/webm,video/ogg"><p role="status">Private to this browser session. Move it, then choose a game.</p></div></div></div>`;
    shadow.querySelector('.close').addEventListener('click', close);
    shadow.querySelector('.shade').addEventListener('click', (event) => { if (event.target.classList.contains('shade')) close(); });
    shadow.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
      if (button.dataset.mode !== 'kinetic-souls') { start(button.dataset.mode); return; }
      shadow.querySelector('#lok-page-title').textContent = 'Choose Kinetic Souls';
      shadow.querySelector('.choices').innerHTML = `<button class="choice" data-variant="classic" type="button"><small>01 / HIGHLIGHTED</small><strong>Classic (1)</strong><span>Original team-spawning auto battle.</span></button><button class="choice" data-variant="ks2" type="button"><small>02 / ALPHA</small><strong>KS2</strong><span>Expanded fighters and modifiers.</span></button>`;
      shadow.querySelectorAll('[data-variant]').forEach((choice) => choice.addEventListener('click', () => start('kinetic-souls', choice.dataset.variant)));
      shadow.querySelector('[data-variant="classic"]').focus();
    }));
    shadow.querySelector('#lok-page-media-file').addEventListener('change', async (event) => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      const status = shadow.querySelector('.media p');
      try {
        const result = (await loadMediaTools()).addFile(file);
        status.textContent = result.ok ? `${file.name} is on this page. Move it, then choose a game.` : result.reason;
      } catch (error) { status.textContent = error.message; }
      event.currentTarget.value = '';
    });
    document.body.appendChild(menu);
    shadow.querySelector('[data-mode]').focus();
  }
  function toggle() {
    if (menu) { close(); return; }
    if (active()) { stop(); return; }
    open();
  }
  hostWindow.LokDemoDayPageChooser = { open, toggle, close };
  if (document.currentScript?.dataset.autostart !== undefined) open();
})();
