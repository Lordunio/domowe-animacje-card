/* White Ghosts Card 1.1.0. Original code and SVG artwork. MIT license. */
(() => {
  'use strict';
  const TAG = 'white-ghosts-card', KEY = 'white-ghosts-card:v1';
  if (customElements.get(TAG)) return;
  const DEFAULTS = { title: 'Białe duszki', ghosts: 3, duration: 14, size: 110,
    interval_min: 5, interval_max: 15, schedule_start: '00:00', schedule_end: '00:00', character: 'ghosts', corner: 'random' };
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
    for (const [key, choices] of Object.entries({ character:['ghosts','robot'], corner:['random','bottom-right','bottom-left','top-right','top-left'] })) {
      if (input[key] !== undefined) {
        if (!choices.includes(input[key])) throw new Error(key + ': wybierz jedną z dostępnych opcji.');
        out[key] = input[key];
      }
    }
    if (input.title === undefined && out.character === 'robot') out.title = 'Domowy pomocnik';
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
  // A friendly original house robot; not an official Home Assistant mascot.
  function robotSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" fill="none">
      <ellipse cx="121" cy="264" rx="65" ry="9" fill="#14283e" opacity=".15"/>
      <path d="M99 235v18m42-18v18" stroke="#bfd2df" stroke-width="17" stroke-linecap="round"/>
      <rect x="81" y="249" width="36" height="15" rx="7.5" fill="#e9f1f7"/><rect x="127" y="249" width="36" height="15" rx="7.5" fill="#e9f1f7"/>
      <path d="M81 173q-20 6-22 35" stroke="#c6d7e5" stroke-width="13" stroke-linecap="round"/>
      <circle cx="58" cy="212" r="12" fill="#f5f9fc"/>
      <g class="wave-arm">
        <path d="M158 176q33-2 37-36" stroke="#bed5e4" stroke-width="14" stroke-linecap="round"/>
        <path d="M187 137l-5-15m12 14v-19m7 20 4-16m-1 24 10-7" stroke="#f8fcff" stroke-width="8" stroke-linecap="round"/>
        <ellipse cx="196" cy="141" rx="15" ry="17" fill="#edf6fc"/>
        <path d="M186 146l-10-7" stroke="#edf6fc" stroke-width="9" stroke-linecap="round"/>
      </g>
      <rect x="78" y="155" width="86" height="85" rx="31" fill="#dae8f2"/>
      <rect x="78" y="155" width="77" height="78" rx="28" fill="#f9fcff"/>
      <rect x="102" y="177" width="38" height="36" rx="12" fill="#16a9e0"/>
      <path d="m111 194 10-9 10 9m-17-2v11h14v-11" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="114" cy="224" r="2.5" fill="#bdd5e5"/><circle cx="123" cy="224" r="2.5" fill="#bdd5e5"/>
      <path d="M120 64V47" stroke="#bfd9e9" stroke-width="7" stroke-linecap="round"/>
      <path d="m105 36 15-13 15 13v15h-30Z" fill="#1bb5ec"/>
      <path d="M120 31v13m-6-5 6 5 6-5" stroke="white" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="55" y="91" width="13" height="31" rx="6.5" fill="#15a8dd"/><rect x="173" y="91" width="13" height="31" rx="6.5" fill="#15a8dd"/>
      <g class="robot-head">
        <rect x="64" y="61" width="113" height="100" rx="35" fill="#d5e5f0"/>
        <rect x="64" y="61" width="105" height="94" rx="33" fill="#f9fcff"/>
        <rect x="76" y="77" width="86" height="64" rx="23" fill="#113d58"/>
        <path d="M87 91q8-8 21-7" stroke="#28708c" stroke-width="4" stroke-linecap="round" opacity=".55"/>
        <g class="robot-eyes"><path d="M94 108q6-10 12 0m28 0q6-10 12 0" stroke="#79e9ff" stroke-width="6" stroke-linecap="round"/></g>
        <path d="M111 122q9 9 18 0" stroke="#79e9ff" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="88" cy="119" rx="6" ry="3" fill="#23acd6" opacity=".4"/><ellipse cx="151" cy="119" rx="6" ry="3" fill="#23acd6" opacity=".4"/>
      </g>
    </svg>`;
  }
  const ROBOT_CSS = `
    .robot svg { display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(0 8px 12px #0d38552b); }
    .wave-arm { transform-origin:158px 176px;animation:hello-wave 1s ease-in-out infinite; }
    .robot-head { transform-origin:120px 150px;animation:hello-head 3s ease-in-out infinite; }
    .robot-eyes { transform-box:fill-box;transform-origin:center;animation:hello-blink 4s infinite; }
    @keyframes hello-wave { 0%,100% { transform:rotate(-12deg); } 50% { transform:rotate(18deg); } }
    @keyframes hello-head { 0%,100% { transform:rotate(-3deg); } 50% { transform:rotate(3deg); } }
    @keyframes hello-blink { 0%,43%,47%,100% { transform:scaleY(1); } 45% { transform:scaleY(.12); } }
    @media(prefers-reduced-motion:reduce) { .wave-arm,.robot-head,.robot-eyes { animation:none!important; } }
  `;
  class GhostRuntime extends EventTarget {
    constructor() {
      super(); this.config = { ...DEFAULTS }; this.enabled = false; this.storageOK = true;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
        if (saved) { this.config = normalize(saved.config); this.base = normalize(saved.base || saved.config); this.enabled = saved.enabled === true; }
      } catch { this.storageOK = false; }
      this.base = this.base || { ...this.config };
      this.reduced.addEventListener('change', () => { this.stopFlight(); this.schedule(); });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stopFlight();
        this.schedule();
      });
      window.addEventListener('storage', event => {
        if (event.key !== KEY) return;
        try {
          const saved = JSON.parse(event.newValue || 'null');
          this.config = normalize(saved?.config); this.base = normalize(saved?.base || saved?.config); this.enabled = saved?.enabled === true;
          this.stopFlight(); this.schedule();
        } catch { /* Ignore invalid settings from other scripts. */ }
      });
      this.schedule();
    }
    persist() {
      try { localStorage.setItem(KEY, JSON.stringify({ config: this.config, base: this.base, enabled: this.enabled })); }
      catch { this.storageOK = false; }
    }
    configure(config) {
      // YAML is the baseline. Saved UI settings survive reloads while that baseline is unchanged.
      if (JSON.stringify(config) === JSON.stringify(this.base)) return;
      this.base = { ...config }; this.config = { ...config };
      this.stopFlight(); this.persist(); this.schedule();
    }
    applySettings(config) {
      this.config = normalize(config); this.stopFlight(); this.persist(); this.schedule();
    }
    resetSettings() { this.applySettings(this.base); }
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
        const due = this.next.getTime();
        this.timer = setTimeout(() => {
          if (!document.hidden && Date.now() - due < 60000 && inHours(new Date(), this.config)) this.fly();
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
    showRobot(config) {
      if (document.hidden || !document.body) return;
      this.stopFlight();
      const layer = document.createElement('div');
      layer.setAttribute('aria-hidden', 'true');
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
      const root = layer.attachShadow({ mode:'open' });
      root.innerHTML = '<style>:host{pointer-events:none!important}.robot{position:absolute;pointer-events:none}'+ROBOT_CSS+'</style>';
      const robot = document.createElement('div'); robot.className = 'robot';
      robot.innerHTML = robotSVG();
      const corners = ['bottom-right','bottom-left','top-right','top-left'];
      const corner = config.corner === 'random' ? corners[Math.floor(Math.random()*4)] : config.corner;
      const left = corner.endsWith('left'), top = corner.startsWith('top');
      robot.dataset.corner = corner;
      robot.style.width = Math.min(config.size,window.innerWidth*.4,window.innerHeight*.5)+'px';
      robot.style[left ? 'left' : 'right'] = 'max(12px, env(safe-area-inset-'+(left ? 'left' : 'right')+'))';
      robot.style[top ? 'top' : 'bottom'] = 'max(12px, env(safe-area-inset-'+(top ? 'top' : 'bottom')+'))';
      root.append(robot); document.body.append(layer); this.layer = layer;
      const frames = this.reduced.matches
        ? [{opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.85},{opacity:0}]
        : [{transform:'translateY('+(top ? '-130%' : '130%')+')',opacity:0},
          {transform:'translateY(0)',opacity:1,offset:.09},
          {transform:'translateY(0)',opacity:1,offset:.91},
          {transform:'translateY('+(top ? '-130%' : '130%')+')',opacity:0}];
      const duration = this.reduced.matches ? 2000 : config.duration*1000;
      this.animations.push(robot.animate(frames,{duration,fill:'both',easing:'ease-in-out'}));
      this.cleanup = setTimeout(() => this.stopFlight(),duration+100);
    }
    fly(config = this.config) {
      if (config.character === 'robot') return this.showRobot(config);
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
  const FORM_FIELDS = `
    <label class="wide">Nazwa karty<input name="title" maxlength="100" type="text"></label>
    <label>Postać<select name="character"><option value="ghosts">Białe duszki</option><option value="robot">Machający robocik</option></select></label>
    <label>Róg ekranu (robocik)<select name="corner"><option value="random">Losowy róg</option><option value="bottom-right">Prawy dolny</option><option value="bottom-left">Lewy dolny</option><option value="top-right">Prawy górny</option><option value="top-left">Lewy górny</option></select></label>
    <label>Odstęp: minimum (min)<input name="interval_min" type="number" min="1" max="1440" step="any" required></label>
    <label>Odstęp: maksimum (min)<input name="interval_max" type="number" min="1" max="1440" step="any" required></label>
    <label>Aktywne od<input name="schedule_start" type="time" required></label>
    <label>Aktywne do<input name="schedule_end" type="time" required></label>
    <label>Czas wyświetlania (s)<input name="duration" type="number" min="5" max="60" step="any" required></label>
    <label>Rozmiar (px)<input name="size" type="number" min="40" max="220" step="1" required></label>
    <label data-ghost-count>Liczba duszków<input name="ghosts" type="number" min="1" max="8" step="1" required></label>
  `;
  const FORM_STYLE = `
    .fields { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px; }
    .wide { grid-column:1/-1; }
    label { display:flex;flex-direction:column;gap:6px;min-width:0;font-size:12px;color:var(--secondary-text-color,#a9b3c7); }
    input,select { display:block;box-sizing:border-box;width:100%;min-width:0;min-height:44px;border:1px solid var(--divider-color,#8794a44d);border-radius:10px;padding:9px;background:var(--ha-card-background,var(--card-background-color,#202635));color:var(--primary-text-color,#eef2fa);font:inherit;font-size:16px; }
    input:focus-visible,select:focus-visible,summary:focus-visible { outline:2px solid var(--primary-color,#21aadd);outline-offset:2px; }
    fieldset { border:0;padding:0;margin:0;min-width:0; }
    .hint,.notice { font-size:12px;line-height:1.6;color:var(--secondary-text-color,#a9b3c7); }
    .notice.error { color:var(--error-color,#f07c86); }
    .notice:empty { display:none; }
    [hidden] { display:none!important; }
    .form-actions { display:flex;gap:10px;flex-wrap:wrap;margin-top:16px; }
    .form-actions button { flex:1 1 120px; }
    @media(max-width:360px) { .fields { gap:12px 8px; } }
  `;
  function fillForm(form, config) {
    for (const [key,value] of Object.entries(config)) {
      const field = form.elements.namedItem(key);
      if (field) field.value = String(value);
    }
    adjustForm(form);
  }
  function adjustForm(form) {
    const robot = form.elements.namedItem('character').value === 'robot';
    form.querySelector('[data-ghost-count]').hidden = robot;
    form.elements.namedItem('corner').disabled = !robot;
  }
  function readForm(form) {
    const out = {};
    for (const key of Object.keys(DEFAULTS)) {
      const value = form.elements.namedItem(key).value;
      out[key] = ['ghosts','duration','size','interval_min','interval_max'].includes(key) ? Number(value) : value;
    }
    return normalize(out);
  }
  class WhiteGhostsCard extends HTMLElement {
    constructor() {
      super(); this.attachShadow({mode:'open'});
      this.update = () => this.renderState();
    }
    static getStubConfig() { return {...DEFAULTS}; }
    static getConfigElement() { return document.createElement('white-ghosts-card-editor'); }
    setConfig(input) {
      this.config = normalize(input);
      if (this.isConnected && !this.preview) runtime.configure(this.config);
      this.dirty = false; this.render();
    }
    set hass(value) { this._hass = value; }
    set preview(value) { this._preview = value; this.renderState(); }
    get preview() { return this._preview === true; }
    get effectiveConfig() { return this.preview || !this.isConnected ? this.config : runtime.config; }
    connectedCallback() {
      runtime.addEventListener('change',this.update);
      if (this.config && !this.preview) runtime.configure(this.config);
      this.renderState();
    }
    disconnectedCallback() { runtime.removeEventListener('change',this.update); }
    getCardSize() { return 5; }
    getGridOptions() { return {columns:12,rows:'auto',min_columns:6}; }
    render() {
      this.shadowRoot.innerHTML = `<style>
        :host { display:block; }
        ha-card { display:block;padding:22px;box-sizing:border-box;border-radius:var(--ha-card-border-radius,20px);background:var(--ha-card-background,var(--card-background-color,#202635));color:var(--primary-text-color,#eef2fa);font-family:var(--paper-font-body1_-_font-family,system-ui,sans-serif); }
        header { display:flex;align-items:center;gap:12px; }
        header>div:last-child { min-width:0; }
        .icon { flex:0 0 48px;width:48px;height:56px; }
        .icon svg { display:block;width:100%;height:100%; }
        h2 { margin:0;font-size:20px;font-weight:600;letter-spacing:-.4px;overflow-wrap:anywhere; }
        .sub { color:var(--secondary-text-color,#a9b3c7);font-size:13px;margin:5px 0 0;line-height:1.5; }
        .actions { display:flex;flex-wrap:wrap;gap:10px;margin-top:20px; }
        button { flex:1 1 120px;min-height:44px;border-radius:12px;padding:11px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;border:1px solid var(--divider-color,#8794a44d);background:transparent;color:inherit; }
        .test,.save { background:var(--primary-color,#a2bafb);color:var(--text-primary-color,#151e35);border-color:transparent; }
        button:focus-visible { outline:3px solid var(--primary-color,#a2bafb);outline-offset:3px; }
        button:disabled { opacity:.5;cursor:default; }
        .status { min-height:32px;line-height:1.6;margin:16px 0 0;color:var(--secondary-text-color,#a9b3c7);font-size:12px; }
        details { border-top:1px solid var(--divider-color,#8794a433);margin-top:12px; }
        summary { min-height:44px;display:list-item;align-content:center;font-size:14px;cursor:pointer; }
        details form { padding-top:12px; }
        ${FORM_STYLE}
      </style><ha-card>
        <header><div class="icon" aria-hidden="true"></div><div><h2></h2><p class="sub"></p></div></header>
        <div class="actions"><button class="toggle" type="button"></button><button class="test" type="button"></button></div>
        <p class="status" aria-live="polite"></p>
        <details><summary>Ustawienia</summary>
          <form><fieldset><div class="fields">${FORM_FIELDS}</div>
            <p class="hint">Jednakowe odstępy = stała częstotliwość. Jednakowe godziny = cała doba. Ustawienia zapisują się w tej przeglądarce.</p>
            <div class="form-actions"><button class="save" type="submit">Zapisz ustawienia</button><button class="reset" type="button">Przywróć z YAML</button></div>
          </fieldset><p class="notice" role="status" aria-live="polite"></p></form>
        </details>
      </ha-card>`;
      const root = this.shadowRoot, form = root.querySelector('form');
      root.querySelector('.toggle').addEventListener('click',()=>runtime.toggle());
      root.querySelector('.test').addEventListener('click',()=>runtime.fly(this.effectiveConfig));
      form.addEventListener('input',()=>{this.dirty = true;});
      form.addEventListener('change',()=>{this.dirty = true;adjustForm(form);});
      form.addEventListener('submit',event=>{
        event.preventDefault(); if (this.preview) return;
        try {
          const config = readForm(form); this.dirty = false; runtime.applySettings(config);
          this.message('Zapisano ustawienia. Możesz kliknąć „Pokaż teraz”.');
        } catch (error) { this.message(error.message,true); }
      });
      root.querySelector('.reset').addEventListener('click',()=>{
        this.dirty = false; runtime.resetSettings(); this.message('Przywrócono ustawienia z konfiguracji YAML karty.');
      });
      this.iconCharacter = null; this.renderState();
    }
    message(text,error=false) {
      const notice = this.shadowRoot.querySelector('.notice');
      notice.textContent = text; notice.classList.toggle('error',error);
      notice.setAttribute('role',error ? 'alert' : 'status');
    }
    renderState() {
      const root = this.shadowRoot, button = root.querySelector('.toggle');
      if (!button || !this.config) return;
      const config = this.effectiveConfig, robot = config.character === 'robot';
      root.querySelector('h2').textContent = config.title;
      if (this.iconCharacter !== config.character) {
        root.querySelector('.icon').innerHTML = robot ? robotSVG() : ghostSVG(); this.iconCharacter = config.character;
      }
      root.querySelector('.sub').textContent = (robot ? 'Machający pomocnik' : 'Białe duszki') +
        (config.interval_min === config.interval_max ? ` • co ${config.interval_min} min` : ` • co ${config.interval_min}–${config.interval_max} min`) +
        ` • ${config.schedule_start === config.schedule_end ? 'cała doba' : config.schedule_start+'–'+config.schedule_end}`;
      root.querySelector('.test').textContent = 'Pokaż teraz';
      button.disabled = this.preview; button.setAttribute('aria-pressed',String(runtime.enabled));
      button.textContent = runtime.enabled ? 'Wyłącz animacje' : 'Włącz animacje';
      let status = 'Automatyczne animacje są wyłączone. Możesz przetestować postać.';
      if (this.preview) status = 'Podgląd karty. Ustawienia włączysz po zapisaniu karty.';
      else if (runtime.enabled && runtime.reduced.matches) status = 'System ogranicza ruch. Automatyczne animacje są wstrzymane.';
      else if (runtime.enabled && runtime.next) status = `Następna wizyta: ${runtime.next.toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}.`;
      else if (runtime.enabled) status = 'Animacje są wstrzymane, gdy zakładka jest w tle.';
      if (!runtime.storageOK) status += ' Nie udało się odczytać lub zapisać ustawień przeglądarki.';
      root.querySelector('.status').textContent = status;
      root.querySelector('fieldset').disabled = this.preview;
      if (!this.dirty) fillForm(root.querySelector('form'),config);
    }
  }
  class WhiteGhostsEditor extends HTMLElement {
    constructor() { super(); this.attachShadow({mode:'open'}); }
    setConfig(config) {
      this.original = config; this.config = normalize(config);
      this.shadowRoot.innerHTML = `<style>:host{display:block;padding:12px;color:var(--primary-text-color);font-family:system-ui,sans-serif}button{min-height:44px;padding:10px 16px;border:0;border-radius:10px;background:var(--primary-color,#21aadd);color:var(--text-primary-color,#fff);font:inherit;cursor:pointer}${FORM_STYLE}</style>
        <form><div class="fields">${FORM_FIELDS}</div><p class="hint">Te wartości zapisują się w konfiguracji karty. Ustawienia zmienione na pulpicie są lokalne dla przeglądarki.</p><div class="form-actions"><button type="submit">Zastosuj w konfiguracji</button></div><p class="notice" role="status"></p></form>`;
      const form = this.shadowRoot.querySelector('form'); fillForm(form,this.config);
      form.addEventListener('change',()=>adjustForm(form));
      form.addEventListener('submit',event=>{
        event.preventDefault(); const notice = form.querySelector('.notice');
        try {
          const config = {...this.original,...readForm(form),type:'custom:'+TAG};
          this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
          notice.textContent = 'Zastosowano. Zapisz kartę w Home Assistant.';notice.classList.remove('error');
        } catch(error) { notice.textContent = error.message;notice.classList.add('error'); }
      });
    }
    set hass(value) { this._hass = value; }
  }
  customElements.define('white-ghosts-card-editor',WhiteGhostsEditor);
  customElements.define(TAG, WhiteGhostsCard);
  window.customCards = window.customCards || [];
  window.customCards.push({type:TAG,name:'Duszki i domowy pomocnik',preview:true,description:'Duszki lub machający robocik. Godziny, częstotliwość i rozmiar ustawisz w karcie.'});
})();

