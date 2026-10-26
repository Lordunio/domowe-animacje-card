/* White Ghosts Card 1.0.0. Original code and SVG artwork. MIT license. */
(() => {
  'use strict';
  const TAG = 'white-ghosts-card', KEY = 'white-ghosts-card:v1';
  if (customElements.get(TAG)) return;
  const DEFAULTS = { title: 'Białe duszki', ghosts: 3, duration: 14, size: 110,
    interval_min: 5, interval_max: 15, schedule_start: '00:00', schedule_end: '00:00' };
  function normalize(input = {}) {
    const out = { ...DEFAULTS };
    if (input.title !== undefined) out.title = String(input.title).slice(0, 100);
    for (const [key, min, max] of [['ghosts',1,8],['duration',5,60],['size',40,220],['interval_min',1,1440],['interval_max',1,1440]]) {
      if (input[key] === undefined) continue;
      if (typeof input[key] !== 'number' || !Number.isFinite(input[key]) || input[key] < min || input[key] > max)
        throw new Error(`${key}: podaj liczbę od ${min} do ${max}.`);
      out[key] = key === 'ghosts' ? Math.round(input[key]) : input[key];
    }
    for (const key of ['schedule_start', 'schedule_end']) {
      if (input[key] === undefined) continue;
      if (typeof input[key] !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input[key]))
        throw new Error(`${key}: użyj godziny HH:MM.`);
      out[key] = input[key];
    }
    if (out.interval_min > out.interval_max) throw new Error('interval_min nie może być większe od interval_max.');
    return out;
  }
  const minute = value => Number(value.slice(0,2)) * 60 + Number(value.slice(3));
  function inHours(date, config) {
    const start = minute(config.schedule_start), end = minute(config.schedule_end);
    const now = date.getHours() * 60 + date.getMinutes();
    return start === end || (start < end ? now >= start && now < end : now >= start || now < end);
  }
  function nextAllowed(date, config) {
    if (inHours(date, config)) return date;
    const next = new Date(date), start = minute(config.schedule_start);
    next.setHours(Math.floor(start / 60), start % 60, 0, 0);
    if (next <= date) next.setDate(next.getDate() + 1);
    return next;
  }
  function ghostSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 172" fill="none">
      <path d="M27 83C27 44 45 16 77 16c34 0 50 28 50 67 0 25 4 45 13 65-13 2-18-14-28-11-10 3-9 20-21 19-12-1-12-18-23-17-11 1-12 19-23 17-12-2-11-19-20-21-8-2-13 10-18 8 15-22 20-39 20-60Z" fill="#dde5f1"/>
      <path d="M30 80c0-36 17-60 46-60 28 0 42 22 42 58 0 25 3 43 10 59-7-6-11-8-17-6-13 4-10 18-19 18-9 0-10-19-24-16-13 3-13 17-21 16-7-1-8-18-19-20-4-1-7 0-10 2 9-18 12-32 12-51Z" fill="white"/>
      <ellipse cx="60" cy="77" rx="8" ry="12" fill="#202738"/><ellipse cx="94" cy="77" rx="8" ry="12" fill="#202738"/>
      <ellipse cx="62" cy="74" rx="2.6" ry="3.4" fill="white"/><ellipse cx="96" cy="74" rx="2.6" ry="3.4" fill="white"/>
      <path d="M70 99q7 9 14 0" stroke="#202738" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="46" cy="94" rx="8" ry="4" fill="#f2cbd5" opacity=".65"/><ellipse cx="108" cy="94" rx="8" ry="4" fill="#f2cbd5" opacity=".65"/>
    </svg>`;
  }
  class GhostRuntime extends EventTarget {
    constructor() {
      super(); this.config = { ...DEFAULTS }; this.enabled = false; this.storageOK = true;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (saved) { this.config = normalize(saved.config); this.enabled = saved.enabled === true; }
      } catch { this.storageOK = false; }
      this.reduced.addEventListener('change', () => { this.stopFlight(); this.schedule(); });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stopFlight();
        this.schedule();
      });
      window.addEventListener('storage', event => {
        if (event.key !== KEY) return;
        try {
          const saved = JSON.parse(event.newValue || 'null');
          this.config = normalize(saved?.config); this.enabled = saved?.enabled === true;
          this.stopFlight(); this.schedule();
        } catch { /* Ignore invalid settings from other scripts. */ }
      });
      this.schedule();
    }
    persist() {
      try { localStorage.setItem(KEY, JSON.stringify({ config: this.config, enabled: this.enabled })); }
      catch { this.storageOK = false; }
    }
    configure(config) {
      if (JSON.stringify(config) === JSON.stringify(this.config)) return;
      this.config = config; this.persist(); this.schedule();
    }
    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled) this.stopFlight();
      this.persist(); this.schedule();
    }
    schedule() {
      clearTimeout(this.timer); this.next = null;
      if (this.enabled && !document.hidden && !this.reduced.matches) {
        const c = this.config;
        const delay = (c.interval_min + Math.random() * (c.interval_max - c.interval_min)) * 60000;
        this.next = nextAllowed(new Date(Date.now() + delay), c);
        this.timer = setTimeout(() => {
          if (!document.hidden && inHours(new Date(), this.config)) this.fly();
          this.schedule();
        }, Math.max(1000, this.next.getTime() - Date.now()));
      }
      this.dispatchEvent(new Event('change'));
    }
    stopFlight() {
      clearTimeout(this.cleanup);
      for (const animation of this.animations || []) animation.cancel();
      this.animations = []; this.layer?.remove(); this.layer = null;
    }
    fly(config = this.config) {
      if (document.hidden || !document.body) return;
      this.stopFlight();
      const layer = document.createElement('div');
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
      const root = layer.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>
        :host { pointer-events:none!important; }
        .ghost { position:absolute;left:0;top:0;will-change:transform; }
        .body { width:100%;height:100%;filter:drop-shadow(0 0 13px #ffffff75);animation:bob 2.8s ease-in-out infinite alternate; }
        svg { display:block;width:100%;height:100%; }
        @keyframes bob { from { transform:translateY(-9px) rotate(-6deg); } to { transform:translateY(9px) rotate(6deg); } }
        @media(prefers-reduced-motion:reduce) { .body { animation:none; } }
      </style>`;
      const width = window.innerWidth, height = window.innerHeight;
      const reverse = Math.random() > .5, base = height * (.25 + Math.random() * .42);
      const duration = this.reduced.matches ? 2000 : config.duration * 1000;
      let finish = duration;
      for (let i = 0; i < config.ghosts; i++) {
        const node = document.createElement('div'); node.className = 'ghost';
        const size = Math.min(config.size * (.8 + Math.random() * .35), width * .3, height * .3);
        node.style.width = `${size}px`; node.style.height = `${size * 172 / 150}px`;
        node.innerHTML = `<div class="body">${ghostSVG()}</div>`;
        node.firstElementChild.style.animationDelay = `-${i * .7}s`; root.append(node);
        const y = Math.max(18, Math.min(height - size * 1.15 - 18, base + (i % 3 - 1) * size * .65));
        const delay = this.reduced.matches ? 0 : i * 650;
        let frames;
        if (this.reduced.matches) {
          node.style.left = `${(i + 1) * width / (config.ghosts + 1) - size / 2}px`; node.style.top = `${y}px`;
          frames = [{ opacity:0 }, { opacity:1, offset:.25 }, { opacity:1, offset:.75 }, { opacity:0 }];
        } else {
          frames = [0,.25,.5,.75,1].map((t, index) => {
            const x = reverse ? width + size - (width + size * 3) * t : -size * 2 + (width + size * 3) * t;
            return { transform:`translate3d(${x}px,${y + Math.sin(t * Math.PI * 2 + i) * 24}px,0)`, opacity:index === 0 || index === 4 ? 0 : .98, offset:t };
          });
        }
        this.animations.push(node.animate(frames, { duration, delay, fill:'both', easing:'linear' }));
        finish = Math.max(finish, duration + delay);
      }
      document.body.append(layer); this.layer = layer;
      this.cleanup = setTimeout(() => this.stopFlight(), finish + 100);
    }
  }
  const runtimeKey = Symbol.for('white-ghosts-card.runtime.v1');
  const runtime = window[runtimeKey] || (window[runtimeKey] = new GhostRuntime());
  class WhiteGhostsCard extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode:'open' }); this.update = () => this.renderState(); }
    static getStubConfig() { return { ...DEFAULTS }; }
    setConfig(input) {
      this.config = normalize(input); this.render();
      if (this.isConnected && !this.preview) runtime.configure(this.config);
    }
    set hass(value) { this._hass = value; }
    set preview(value) { this._preview = value; this.renderState(); }
    get preview() { return this._preview === true; }
    connectedCallback() {
      runtime.addEventListener('change', this.update);
      if (this.config && !this.preview) runtime.configure(this.config);
      this.renderState();
    }
    disconnectedCallback() { runtime.removeEventListener('change', this.update); }
    getCardSize() { return 4; }
    getGridOptions() { return { columns:12, rows:'auto', min_columns:6 }; }
    render() {
      this.shadowRoot.innerHTML = `<style>
        :host { display:block; }
        ha-card { display:block;padding:22px;box-sizing:border-box;border-radius:var(--ha-card-border-radius,20px);background:var(--ha-card-background,var(--card-background-color,#202635));color:var(--primary-text-color,#eef2fa);font-family:var(--paper-font-body1_-_font-family,system-ui,sans-serif); }
        header { display:flex;align-items:center;gap:12px; }
        .icon { flex:0 0 48px;width:48px;height:55px;filter:drop-shadow(0 0 8px #ffffff20); }
        .icon svg { width:100%;height:100%; }
        h2 { margin:0;font-size:20px;font-weight:600;letter-spacing:-.4px;overflow-wrap:anywhere; }
        .sub { color:var(--secondary-text-color,#a9b3c7);font-size:13px;margin:5px 0 0; }
        .actions { display:flex;flex-wrap:wrap;gap:10px;margin-top:22px; }
        button { flex:1 1 130px;min-height:44px;border-radius:12px;padding:11px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;border:1px solid var(--divider-color,#ffffff25);background:transparent;color:inherit; }
        .test { background:var(--primary-color,#a2bafb);color:var(--text-primary-color,#151e35);border-color:transparent; }
        button:focus-visible { outline:3px solid var(--primary-color,#a2bafb);outline-offset:3px; }
        button:disabled { opacity:.5;cursor:default; }
        .status { min-height:34px;line-height:1.5;margin:17px 0 0;color:var(--secondary-text-color,#a9b3c7);font-size:12px; }
      </style><ha-card>
        <header><div class="icon" aria-hidden="true">${ghostSVG()}</div><div><h2></h2><p class="sub"></p></div></header>
        <div class="actions"><button class="toggle" type="button"></button><button class="test" type="button">Pokaż duszki</button></div>
        <p class="status" aria-live="polite"></p>
      </ha-card>`;
      this.shadowRoot.querySelector('h2').textContent = this.config.title;
      this.shadowRoot.querySelector('.sub').textContent = `Białe duszki • losowo co ${this.config.interval_min}–${this.config.interval_max} min`;
      this.shadowRoot.querySelector('.toggle').addEventListener('click', () => runtime.toggle());
      this.shadowRoot.querySelector('.test').addEventListener('click', () => runtime.fly(this.config));
      this.renderState();
    }
    renderState() {
      const button = this.shadowRoot.querySelector('.toggle'); if (!button) return;
      button.disabled = this.preview; button.setAttribute('aria-pressed', String(runtime.enabled));
      button.textContent = runtime.enabled ? 'Wyłącz przeloty' : 'Włącz przeloty';
      let status = 'Automatyczne przeloty są wyłączone. Możesz przetestować animację.';
      if (this.preview) status = 'Podgląd karty. Automatyczne przeloty włączysz po jej zapisaniu.';
      else if (runtime.enabled && runtime.reduced.matches) status = 'System ogranicza animacje. Automatyczne przeloty są wstrzymane.';
      else if (runtime.enabled && runtime.next) status = `Następne duszki: ${runtime.next.toLocaleString('pl-PL', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}.`;
      else if (runtime.enabled) status = 'Przeloty są wstrzymane, gdy karta przeglądarki jest w tle.';
      if (!runtime.storageOK) status += ' Nie udało się odczytać lub zapisać ustawień przeglądarki.';
      this.shadowRoot.querySelector('.status').textContent = status;
    }
  }
  customElements.define(TAG, WhiteGhostsCard);
  window.customCards = window.customCards || [];
  window.customCards.push({ type:TAG, name:'Białe duszki', preview:true, description:'Białe duszki przelatujące nad pulpitem. Konfiguracja w YAML.' });
})();
