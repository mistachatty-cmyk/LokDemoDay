/* Demo Day bookmarklet entry. UI and game layers stay on the host page; no page content is uploaded. */
(function () {
  const hostWindow = window;
  const previous = hostWindow.LokDemoDayPageChooser;
  if (previous) { if (document.currentScript?.dataset.autostart !== undefined) previous.toggle(); return; }

  const bundles = {
    'survivor-616': { url: 'https://survivor.gsix.online/demoday.js', api: 'Survivor616DemoDay' },
    'kinetic-souls': { url: 'https://demo.gsix.online/kinetic-page.js', api: 'KineticSoulsPage' },
  };
  let menu = null;
  function sensitivePage() {
    return /\b(login|sign-in|signin|checkout|payment|billing|account\/security)\b/i.test(location.pathname)
      || !!document.querySelector('input[type="password"],input[autocomplete="cc-number"],input[name*="card" i]');
  }
  function active() {
    if (hostWindow.Survivor616DemoDay?.isRunning()) return 'survivor-616';
    if (hostWindow.KineticSoulsPage?.isRunning()) return 'kinetic-souls';
    return null;
  }
  function close() { menu?.remove(); menu = null; }
  function stop() {
    hostWindow.Survivor616DemoDay?.stop(true);
    hostWindow.KineticSoulsPage?.stop();
  }
  function start(mode) {
    const bundle = bundles[mode];
    if (!bundle) return;
    close();
    stop();
    if (hostWindow[bundle.api]) {
      const result = hostWindow[bundle.api].start();
      if (!result?.ok) alert(result?.reason || 'This page cannot be played.');
      return;
    }
    const script = document.createElement('script');
    script.src = bundle.url;
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      const result = hostWindow[bundle.api]?.start();
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
      .choice small{display:block;font:700 11px ui-monospace,monospace;letter-spacing:.12em;color:#f09a79}.choice[data-mode="kinetic-souls"] small{color:#7be6ff}
      .choice strong{display:block;margin:14px 0;font:900 32px Impact,system-ui,sans-serif;text-transform:uppercase}.choice span{color:#c3c7d1;line-height:1.4}
      .close{border:1px solid #ffffff55;background:#ffffff12;color:#fff;padding:6px 10px;font-size:20px;cursor:pointer}
      @media(max-width:540px){.choices{grid-template-columns:1fr}.choice{min-height:120px}}
    </style><div class="shade"><div class="box" role="dialog" aria-modal="true" aria-labelledby="lok-page-title">
      <div class="head"><div><span class="kicker">LOK DEMO DAY / LIVE PAGE</span><h2 id="lok-page-title">Choose your game</h2></div><button class="close" type="button" aria-label="Close">&times;</button></div>
      <p>Play over this whole website. Leaving restores it.</p><div class="choices">
        <button class="choice" data-mode="survivor-616" type="button"><small>01 / SURVIVAL</small><strong>Survivor 616</strong><span>Outlast waves and break page elements.</span></button>
        <button class="choice" data-mode="kinetic-souls" type="button"><small>02 / MOMENTUM</small><strong>Kinetic Souls</strong><span>Dash, fire, and shatter live targets.</span></button>
      </div></div></div>`;
    shadow.querySelector('.close').addEventListener('click', close);
    shadow.querySelector('.shade').addEventListener('click', (event) => { if (event.target.classList.contains('shade')) close(); });
    shadow.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => start(button.dataset.mode)));
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
