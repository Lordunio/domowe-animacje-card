/* Domowe Animacje 1.2.1. Original code and SVG artwork. MIT license. */
(() => {
  'use strict';
  const TAG = 'domowe-animacje-card', LEGACY_TAG = 'white-ghosts-card', KEY = 'white-ghosts-card:v1';
  if (customElements.get(TAG)) return;
  const DEFAULTS = { title: 'Domowe Animacje', ghosts: 3, duration: 14, size: 110,
    interval_min: 5, interval_max: 15, schedule_start: '00:00', schedule_end: '00:00', character: 'ghosts', corner: 'random', direction: 'random', random_pool: ['ghosts','robot','santa','bunny','butterflies','cars'] };
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
    for (const [key, choices] of Object.entries({ character:[...CHARACTERS,'random'], direction:['random','left-to-right','right-to-left'], corner:['random','bottom-right','bottom-left','top-right','top-left'] })) {
      if (input[key] !== undefined) {
        if (!choices.includes(input[key])) throw new Error(key + ': wybierz jedną z dostępnych opcji.');
        out[key] = input[key];
      }
    }
    if(input.random_pool !== undefined) {
      if(!Array.isArray(input.random_pool) || input.random_pool.length===0 || input.random_pool.some(kind=>!CHARACTERS.includes(kind)))
        throw new Error('W trybie losowym zaznacz przynajmniej jedną dostępną animację.');
      out.random_pool = [...new Set(input.random_pool)];
    } else out.random_pool = [...DEFAULTS.random_pool];
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
  const CHARACTERS = ['ghosts','robot','santa','bunny','butterflies','cars'];
  const LABELS = {ghosts:'Białe duszki',robot:'Machający robocik',santa:'Mikołaj z saniami',bunny:'Wielkanocny króliczek',butterflies:'Motylki',cars:'Wyścigówki',random:'Losowo z wybranych'};
  let sleighArtworkId = 0;
  function santaSVG() {
    const id = 'domowe-sleigh-'+(++sleighArtworkId);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 300" fill="none">
      <defs>
        <linearGradient id="${id}-coat" x1="188" y1="135" x2="280" y2="209" gradientUnits="userSpaceOnUse"><stop stop-color="#f35a5e"/><stop offset=".55" stop-color="#d83348"/><stop offset="1" stop-color="#a51e38"/></linearGradient>
        <linearGradient id="${id}-sleigh" x1="112" y1="175" x2="313" y2="253" gradientUnits="userSpaceOnUse"><stop stop-color="#ed5261"/><stop offset=".58" stop-color="#d9344d"/><stop offset="1" stop-color="#a51f3d"/></linearGradient>
        <linearGradient id="${id}-fur" x1="192" y1="88" x2="250" y2="147" gradientUnits="userSpaceOnUse"><stop stop-color="#fffdf5"/><stop offset="1" stop-color="#e5e5df"/></linearGradient>
        <linearGradient id="${id}-deer" x1="553" y1="147" x2="644" y2="218" gradientUnits="userSpaceOnUse"><stop stop-color="#cf9a64"/><stop offset=".55" stop-color="#b97946"/><stop offset="1" stop-color="#925b37"/></linearGradient>
        <linearGradient id="${id}-gold" x1="70" y1="219" x2="329" y2="275" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe8a0"/><stop offset=".5" stop-color="#dcab4f"/><stop offset="1" stop-color="#f8d77d"/></linearGradient>
        <radialGradient id="${id}-nose" cx=".3" cy=".25" r=".8"><stop stop-color="#ff8b80"/><stop offset=".4" stop-color="#eb534f"/><stop offset="1" stop-color="#bd303c"/></radialGradient>
      </defs>
      <g fill="#ffe4a1"><path d="m33 181 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"/><path d="m56 130 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"/><circle cx="17" cy="146" r="2.4"/><circle cx="22" cy="218" r="2.7"/><circle cx="52" cy="235" r="1.8"/></g>
      <path d="M297 165C372 174 434 164 507 165M297 172C373 186 441 177 509 173" stroke="#bd8846" stroke-width="3" stroke-linecap="round"/>
      <path d="M297 164C372 173 434 163 507 164" stroke="#f3d495" stroke-width="1.3" stroke-linecap="round"/>
      <g class="sleigh-vehicle">
        <path d="M114 234v32m188-34v34" stroke="#bc873b" stroke-width="9" stroke-linecap="round"/>
        <path d="M77 266h258q30 0 31-28" stroke="url(#${id}-gold)" stroke-width="11" stroke-linecap="round"/>
        <path d="M81 263h248q23 0 25-14" stroke="#fff0b8" stroke-width="2.1" stroke-linecap="round" opacity=".7"/>
        <path d="M155 177q-31-12-21-43 2-12 19-20l-5-12 19-4 9 15q26 17 22 40l-4 27Z" fill="#997a43"/><path d="m148 111 28-6" stroke="#e0b963" stroke-width="5" stroke-linecap="round"/>
        <rect x="86" y="147" width="49" height="46" rx="5" fill="#38ad9e"/><path d="M109 147v46M86 163h49" stroke="#ffe7a8" stroke-width="7"/>
        <path d="M108 147q-19-17-20-4 0 8 20 4 19-19 22-7 1 9-22 7Z" fill="#ffe7a8"/>
        <rect x="130" y="158" width="38" height="36" rx="4" fill="#9a79c8"/><path d="M148 158v36M130 172h38" stroke="#efc77d" stroke-width="5"/>
        <g class="santa-body">
          <path d="M190 180q-7-40 34-47 45-5 58 42l-9 33h-81Z" fill="url(#${id}-coat)" stroke="#a52d3c" stroke-width="2"/>
          <path d="M207 143q-11 13-10 29" stroke="#ff9d91" stroke-width="5" stroke-linecap="round" opacity=".55"/>
          <path d="M232 146v55" stroke="url(#${id}-fur)" stroke-width="13" stroke-linecap="round"/>
          <path d="M191 180q41 9 88-2l-2 17q-43 10-87-1Z" fill="#3c3438"/>
          <rect x="227" y="179" width="25" height="20" rx="4" fill="url(#${id}-gold)"/><rect x="233" y="184" width="13" height="10" rx="1.5" fill="#4c3d35"/>
          <path d="M255 164q16 15 34 7" stroke="#bc293d" stroke-width="20" stroke-linecap="round"/>
          <path d="m280 175 5-17" stroke="#f8f2e7" stroke-width="10" stroke-linecap="round"/><path d="M289 169q11-9 16-2-1 9-15 11" fill="#f2dfbd"/>
          <g class="santa-wave">
            <path d="M270 156q29-3 34-34" stroke="#bc293d" stroke-width="21" stroke-linecap="round"/>
            <path d="M271 153q24-4 27-29" stroke="#eb4a54" stroke-width="12" stroke-linecap="round"/>
            <path d="m294 124 19 3" stroke="#fff5e8" stroke-width="11" stroke-linecap="round"/>
            <path d="M299 121q-6-14-1-23 4-9 8-1l1 8q9-10 14-3 6 10-7 24Z" fill="#fff9ef" stroke="#e0dfd5" stroke-width="1.6"/>
          </g>
          <ellipse cx="224" cy="93" rx="35" ry="38" fill="#f5c5a2"/>
          <ellipse cx="192" cy="96" rx="7" ry="10" fill="#efb08e"/><ellipse cx="257" cy="97" rx="7" ry="10" fill="#efb08e"/>
          <path d="M193 90q-1 18 12 30l-3 15q21 18 44-1l-3-17q14-10 13-25-2 28-31 27-27-1-32-29Z" fill="url(#${id}-fur)"/>
          <path d="M196 105q-12 12-1 25-2 13 12 17 7 13 20 9 13 3 20-9 15-4 11-17 9-13 0-24-9 27-31 25-22 1-31-26Z" fill="url(#${id}-fur)"/>
          <path d="M210 137q15 11 29-1" stroke="#d8d8d1" stroke-width="2" stroke-linecap="round" opacity=".55"/>
          <path d="M205 90q5-4 11 0m18 0q6-4 11 1" stroke="#fffcf1" stroke-width="4.5" stroke-linecap="round"/>
          <ellipse cx="212" cy="98" rx="3.2" ry="4" fill="#3e3540"/><ellipse cx="239" cy="99" rx="3.2" ry="4" fill="#3e3540"/>
          <circle cx="213" cy="97" r="1" fill="white"/><circle cx="240" cy="98" r="1" fill="white"/>
          <ellipse cx="202" cy="108" rx="7" ry="4.5" fill="#ee9e8e" opacity=".75"/><ellipse cx="249" cy="109" rx="6" ry="4" fill="#ee9e8e" opacity=".75"/>
          <ellipse cx="226" cy="110" rx="9" ry="6.5" fill="#eea68b"/>
          <path d="M225 116q-10-6-19 4 7 7 20-1 12 8 21 0-12-9-22-3Z" fill="#fffaf0"/>
          <path d="M220 123q7 7 14-1" stroke="#a65b5a" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M186 79C188 53 199 30 225 29c22-1 37 15 45 34l13 13-13 12c-24-10-55-11-84-9Z" fill="#c83349" stroke="#a92b3f" stroke-width="1.8"/>
          <path d="M195 65q8-28 30-29 18-1 32 18" stroke="#ef6870" stroke-width="6" stroke-linecap="round" opacity=".75"/>
          <path d="M187 80q38-7 79 4" stroke="#f8f5eb" stroke-width="15" stroke-linecap="round"/>
          <path d="M190 78q35-4 71 4" stroke="#fffdf5" stroke-width="5" stroke-linecap="round"/>
          <circle cx="286" cy="76" r="12" fill="#eeeae0"/><circle cx="283" cy="72" r="9" fill="#fffaf0"/>
        </g>
        <path d="M68 186h231q33-1 37-35h22v54q-2 43-57 47H130q-53-2-62-66Z" fill="#9f2340" stroke="#8d263e" stroke-width="2.2"/>
        <path d="M75 191h222q29-1 44-25v39q-2 36-44 38H129q-44-1-54-52Z" fill="url(#${id}-sleigh)"/>
        <path d="M78 190h220q32-2 42-29" stroke="url(#${id}-gold)" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M103 218h144" stroke="#f4c76e" stroke-width="3.4" stroke-linecap="round"/>
        <path d="m148 211 2 5 6 2-6 2-2 5-2-5-6-2 6-2Z" fill="#ffe3a0"/>
        <path d="M285 225q22-3 22-19-1-10-10-8-8 3-4 10" stroke="#f7d280" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M86 199q5 20 15 27" stroke="#ff9f98" stroke-width="4" stroke-linecap="round" opacity=".6"/>
      </g>
      <g class="reindeer-legs">
        <g class="reindeer-leg reindeer-hind-far"><path d="M553 195q-9 22 1 36l-22 12" stroke="#8d5d3d" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="m531 240-1 10 16 1 2-7" fill="#4e3931"/></g>
        <g class="reindeer-leg reindeer-front-far"><path d="M619 196q20 18 11 35l24 9" stroke="#8d5d3d" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="m650 236-3 9 17 4 3-8" fill="#4e3931"/></g>
      </g>
      <path class="reindeer-tail" d="M529 178q-23 5-24-17 12-1 26 13Z" fill="#b87d4f" stroke="#8e603d" stroke-width="2"/>
      <path d="M526 174q6-29 47-31 45-2 66 23 7 31-13 43-29 20-73 1-29-11-27-36Z" fill="url(#${id}-deer)" stroke="#8d5e3d" stroke-width="2.4"/>
      <path d="M537 162q22-14 50-10" stroke="#e1b580" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M557 200q31 13 60-1-15 21-40 16Z" fill="#ddb88a"/>
      <path d="M631 178C641 158 641 137 650 122c3-7 8-10 14-9l14 24c-5 17-11 37-22 54-7 10-16 11-23 2Z" fill="url(#${id}-deer)" stroke="#8d5e3d" stroke-width="2.4"/>
      <path d="M667 146c7 4 4 14 0 23-5 13-11 23-18 28l-8-6c12-13 17-28 19-42Z" fill="#efd3ac"/>
      <g class="reindeer-legs">
        <g class="reindeer-leg reindeer-hind-near"><path d="M549 198q-3 18-19 29l23 22" stroke="#8d5d3d" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/><path d="M549 197q-3 18-19 29l23 22" stroke="#bf8653" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="m548 245 1 12 20-1-3-9Z" fill="#5b4033"/><path d="m554 247 5 7" stroke="#8e7057" stroke-width="2"/></g>
        <g class="reindeer-leg reindeer-front-near"><path d="M629 195q-2 20 18 29l-8 25" stroke="#8d5d3d" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M629 195q-2 20 18 29l-8 25" stroke="#c58c58" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="m635 245-2 12 21 3 1-10Z" fill="#5b4033"/><path d="m642 249 4 7" stroke="#8e7057" stroke-width="2"/></g>
      </g>
      <path d="M654 117q-23-1-36-23 25-6 49 13Z" fill="#b27b4c" stroke="#8d5e3d" stroke-width="2.2"/><path d="m630 99 25 12" stroke="#e7bc91" stroke-width="5" stroke-linecap="round"/>
      <path d="M680 107q3-22 30-28-1 23-20 36Z" fill="#bd8855" stroke="#8d5e3d" stroke-width="2.2"/><path d="m696 91-9 17" stroke="#e7bc91" stroke-width="5" stroke-linecap="round"/>
      <path d="M666 105q-13-19-12-42 1-26-9-42m9 43-21-14-5-15m26 12 13-15m-12 47-23-8-9-13" stroke="#76533d" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M685 103q9-20 9-43 0-26 11-41m-11 42 21-14 7-15m-26 13-11-14m5 51 22-9 9-13" stroke="#8c603d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M684 94q6-16 7-33m6-5 15-10" stroke="#bb9468" stroke-width="2" stroke-linecap="round" opacity=".8"/>
      <path d="M654 113q17-21 42-6l16 17q30 3 32 19-1 19-27 18l-26-10q-23 8-35-8-8-13-2-30Z" fill="#c28c59" stroke="#8d5e3d" stroke-width="2.4"/>
      <path d="M661 116q11-11 25-7" stroke="#e2b886" stroke-width="4" stroke-linecap="round"/>
      <path d="M709 131q20-3 31 5 11 21-18 23l-20-8Z" fill="#e9c59b"/>
      <ellipse cx="739" cy="141" rx="11.5" ry="10" fill="url(#${id}-nose)"/><ellipse cx="736" cy="137" rx="4" ry="2.6" fill="#ffd2bd" opacity=".75"/>
      <ellipse cx="684" cy="125" rx="6" ry="8" fill="#f6e8d2"/><ellipse cx="686" cy="126" rx="4.3" ry="6.5" fill="#342a2a"/><circle cx="687" cy="123.5" r="1.9" fill="white"/>
      <path d="M680 113q5-4 10 1" stroke="#81543c" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="691" cy="143" rx="7" ry="3.5" fill="#d99a7a" opacity=".5"/>
      <path d="M718 151q9 5 17-1" stroke="#87533e" stroke-width="2" stroke-linecap="round"/>
      <path d="M649 151q10 8 23 8l-4 10q-12-1-23-8Z" fill="#c52d42" stroke="#a22537" stroke-width="1.6"/>
      <circle cx="659" cy="169" r="6" fill="url(#${id}-gold)" stroke="#c3984a" stroke-width="1.2"/><path d="m656 171 6-1" stroke="#936e36" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M552 151q-7 27 1 57" stroke="#8e4438" stroke-width="8"/><path d="M551 152q-6 25 1 54" stroke="#d2a162" stroke-width="4"/>
      <path d="M508 165q51 17 121 5" stroke="#87523b" stroke-width="4" stroke-linecap="round"/><circle cx="555" cy="174" r="5" fill="#e7bd6d"/>
    </svg>`;
  }

  function bunnySVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 250" fill="none">
      <ellipse cx="106" cy="232" rx="76" ry="8" fill="#2c455e" opacity=".12"/>
      <circle cx="46" cy="176" r="22" fill="#e2e8f4"/><ellipse cx="93" cy="178" rx="48" ry="52" fill="#edf2fc"/>
      <ellipse cx="96" cy="184" rx="27" ry="34" fill="white"/>
      <ellipse cx="70" cy="223" rx="29" ry="13" fill="#dfe8f4"/><ellipse cx="120" cy="223" rx="30" ry="13" fill="#edf2fc"/>
      <g class="bunny-ears"><ellipse cx="84" cy="56" rx="17" ry="46" transform="rotate(-12 84 56)" fill="#edf2fc"/><ellipse cx="123" cy="52" rx="17" ry="46" transform="rotate(12 123 52)" fill="#edf2fc"/><ellipse cx="84" cy="56" rx="8" ry="32" transform="rotate(-12 84 56)" fill="#f2b6cd"/><ellipse cx="123" cy="52" rx="8" ry="32" transform="rotate(12 123 52)" fill="#f2b6cd"/></g>
      <ellipse cx="105" cy="112" rx="46" ry="39" fill="#f8fbff"/><ellipse cx="87" cy="109" rx="5" ry="8" fill="#324358"/><ellipse cx="123" cy="109" rx="5" ry="8" fill="#324358"/>
      <circle cx="89" cy="106" r="1.7" fill="white"/><circle cx="125" cy="106" r="1.7" fill="white"/>
      <path d="m98 122 7 7 7-7Z" fill="#eb98b7"/><path d="M105 129v5m-10 0q5 7 10 0 5 7 10 0" stroke="#526078" stroke-width="2.5" stroke-linecap="round"/>
      <path d="m70 120-16-4m16 12-18 3m86-11 16-4m-16 12 18 3" stroke="#b4bed1" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="77" cy="124" rx="9" ry="4" fill="#f1c8da"/><ellipse cx="132" cy="124" rx="9" ry="4" fill="#f1c8da"/>
      <path d="m88 151 17 8-17 8Zm34 0-17 8 17 8Z" fill="#78cbbb"/><circle cx="105" cy="159" r="4" fill="#42ac9f"/>
      <path d="M139 170q10-50 42-8" stroke="#c49462" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="153" cy="171" rx="12" ry="18" fill="#a58cdb"/><path d="m145 169 15 4" stroke="#efdefc" stroke-width="3"/>
      <ellipse cx="174" cy="171" rx="12" ry="20" fill="#7fcdb4"/><path d="m166 171 16-1" stroke="#fff0a8" stroke-width="4"/>
      <path d="M134 178h56l-7 36h-42Z" fill="#d4a76c"/><path d="m145 184 4 22m10-22v22m12-22-4 22m-28-10h45" stroke="#b98752" stroke-width="3"/>
      <path d="M127 163q10 16 22 13" stroke="#e3ebf8" stroke-width="15" stroke-linecap="round"/>
    </svg>`;
  }
  function butterflySVG(index=0) {
    const colors = [['#aa8aea','#dbcbff','#7753bd'],['#f19a53','#ffe0ad','#cc6c39'],['#5fc6cf','#bbf0ef','#329aa8'],['#ec8fbd','#ffd0e8','#b55993']][index%4];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 160" fill="none">
      <g class="wing-left"><path d="M89 84C68 6 3 17 20 72c4 15 20 19 31 22-42 8-29 55 1 47 23-5 29-31 37-57Z" fill="${colors[0]}" stroke="${colors[2]}" stroke-width="3"/><path d="M79 77C58 32 25 33 35 60c7 17 25 18 44 17Zm-5 21c-38-3-31 29-16 21Z" fill="${colors[1]}"/><circle cx="34" cy="48" r="4" fill="white" opacity=".7"/></g>
      <g class="wing-right"><path d="M91 84C112 6 177 17 160 72c-4 15-20 19-31 22 42 8 29 55-1 47-23-5-29-31-37-57Z" fill="${colors[0]}" stroke="${colors[2]}" stroke-width="3"/><path d="M101 77c21-45 54-44 44-17-7 17-25 18-44 17Zm5 21c38-3 31 29 16 21Z" fill="${colors[1]}"/><circle cx="146" cy="48" r="4" fill="white" opacity=".7"/></g>
      <path d="m86 63-8-14m16 14 8-14" stroke="#34445d" stroke-width="3" stroke-linecap="round"/><circle cx="77" cy="47" r="3" fill="#34445d"/><circle cx="103" cy="47" r="3" fill="#34445d"/>
      <ellipse cx="90" cy="91" rx="7" ry="30" fill="#34445d"/><circle cx="90" cy="67" r="9" fill="#34445d"/>
    </svg>`;
  }
  function carSVG(index=0) {
    const colors = [['#ee4e62','#af2542'],['#30b1ef','#1777b9'],['#f2b846','#c18a29'],['#936de2','#6848ad']][index%4];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 145" fill="none">
      <path d="M7 82h37M0 96h28M12 111h29" stroke="${colors[0]}" stroke-width="4" stroke-linecap="round" opacity=".5"/>
      <ellipse cx="161" cy="124" rx="113" ry="7" fill="#29374f" opacity=".13"/>
      <path d="M55 80 91 47h91l41 32 42 9 12 29H43l4-30Z" fill="${colors[1]}"/>
      <path d="m57 79 35-28h88l42 32 42 10 7 18H48l4-24Z" fill="${colors[0]}"/>
      <path d="m98 54-23 25h58V54Zm43 0v25h65l-30-25Z" fill="#173e5c"/>
      <path d="m109 57-17 18m71-18-15 18" stroke="#70c8e6" stroke-width="4" opacity=".55"/>
      <path d="M130 83h14v28h-14Z" fill="#fff5e1"/><path d="M151 83h7v28h-7Z" fill="#fff5e1"/>
      <path d="M222 94h38" stroke="#ffedb0" stroke-width="6" stroke-linecap="round"/><path d="M53 91h10" stroke="#ffcad2" stroke-width="5" stroke-linecap="round"/>
      <path d="M56 77V64m-10-1h33" stroke="${colors[1]}" stroke-width="7" stroke-linecap="round"/>
      <path d="M44 116h231" stroke="${colors[1]}" stroke-width="5" stroke-linecap="round"/>
      <g class="car-wheel"><circle cx="91" cy="112" r="22" fill="#263044"/><circle cx="91" cy="112" r="13" fill="#c6d5e4"/><circle cx="91" cy="112" r="5" fill="#5a718d"/><path d="M91 101v22m-11-11h22" stroke="#60758f" stroke-width="3"/></g>
      <g class="car-wheel"><circle cx="226" cy="112" r="22" fill="#263044"/><circle cx="226" cy="112" r="13" fill="#c6d5e4"/><circle cx="226" cy="112" r="5" fill="#5a718d"/><path d="M226 101v22m-11-11h22" stroke="#60758f" stroke-width="3"/></g>
    </svg>`;
  }
  function sceneSVG(kind,index=0) {
    return ({ghosts:ghostSVG,robot:robotSVG,santa:santaSVG,bunny:bunnySVG,butterflies:butterflySVG,cars:carSVG,random:robotSVG}[kind] || ghostSVG)(index);
  }
  function chooseCharacter(pool,last,random=Math.random()) {
    const choices = pool.length > 1 ? pool.filter(kind=>kind!==last) : pool;
    return choices[Math.min(choices.length-1,Math.floor(random*choices.length))];
  }
  const SCENE_CSS = `
    .traveller { position:absolute;left:0;top:0;will-change:transform; }
    .traveller svg { display:block;width:100%;height:auto;overflow:visible;filter:drop-shadow(0 4px 8px #16325126); }
    .art { transform-origin:50% 80%; }
    .ghosts .art { animation:ghost-float 2.8s ease-in-out infinite alternate; }
    @keyframes ghost-float { from{transform:translateY(-9px) rotate(-6deg)} to{transform:translateY(9px) rotate(6deg)} }
    .santa .art { animation:festive-float 2.5s ease-in-out infinite; }
    .santa-wave { transform-origin:270px 156px;animation:santa-hello 1.1s ease-in-out infinite alternate; }
    .reindeer-leg { transform-box:view-box; }
    .reindeer-hind-near { transform-origin:549px 198px;animation:reindeer-stride-a .7s ease-in-out infinite alternate; }
    .reindeer-front-near { transform-origin:629px 195px;animation:reindeer-stride-b .7s ease-in-out infinite alternate; }
    .reindeer-hind-far { transform-origin:553px 195px;animation:reindeer-stride-b .7s ease-in-out infinite alternate; }
    .reindeer-front-far { transform-origin:619px 196px;animation:reindeer-stride-a .7s ease-in-out infinite alternate; }
    .reindeer-tail { transform-origin:529px 178px;animation:reindeer-tail .9s ease-in-out infinite alternate; }
    .bunny .art { animation:bunny-hop .85s ease-in-out infinite; }
    .bunny-ears { transform-origin:105px 100px;animation:bunny-ears .85s ease-in-out infinite; }
    .butterflies .wing-left,.butterflies .wing-right { transform-origin:90px 84px;animation:butterfly-flap .24s ease-in-out infinite alternate; }
    .cars .art { animation:car-suspension .2s ease-in-out infinite alternate; }
    .car-wheel { transform-box:fill-box;transform-origin:center;animation:car-wheel .32s linear infinite; }
    @keyframes festive-float { 0%,100% {transform:translateY(-4px) rotate(-.65deg)} 50% {transform:translateY(4px) rotate(.65deg)} }
    @keyframes santa-hello { from{transform:rotate(-7deg)} to{transform:rotate(9deg)} }
    @keyframes reindeer-stride-a { from{transform:rotate(-13deg)} to{transform:rotate(15deg)} }
    @keyframes reindeer-stride-b { from{transform:rotate(13deg)} to{transform:rotate(-15deg)} }
    @keyframes reindeer-tail { from{transform:rotate(-5deg)} to{transform:rotate(8deg)} }
    @keyframes bunny-hop { 0%,100%{transform:translateY(0) scale(1.03,.97)} 50%{transform:translateY(-28px) scale(.98,1.02)} }
    @keyframes bunny-ears { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(6deg)} }
    @keyframes butterfly-flap { from{transform:scaleX(.22)} to{transform:scaleX(1)} }
    @keyframes car-suspension { from{transform:translateY(-1px)} to{transform:translateY(1px)} }
    @keyframes car-wheel { to{transform:rotate(360deg)} }
    @media(prefers-reduced-motion:reduce) { .traveller * {animation:none!important} }
  `;
  function planScene(config,width,height,reduced=false,random=Math.random) {
    const kind = config.character;
    const count = ['ghosts','butterflies','cars'].includes(kind) ? config.ghosts : 1;
    const ratio = {ghosts:172/150,santa:300/760,bunny:250/220,butterflies:160/180,cars:145/300}[kind];
    const reverse = config.direction === 'right-to-left' || (config.direction === 'random' && random()>.5);
    const scale = {ghosts:1,santa:3,bunny:1.05,butterflies:.7,cars:1.55}[kind];
    const airborne = ['ghosts','santa','butterflies'].includes(kind);
    const items = [];
    for(let i=0;i<count;i++) {
      const variation = kind === 'butterflies' ? .8+random()*.35 : 1;
      const w = Math.min(config.size*scale*variation,width*(reduced ? .85/count : .8),height*.32/ratio);
      const h = w*ratio;
      let y;
      if(kind === 'cars') y = height-h-18-(i%2)*h*.85;
      else if(kind === 'bunny') y = height-h-20;
      else y = height*(kind === 'santa' ? .2+random()*.18 : .2+random()*.48);
      y = Math.max(12,Math.min(height-h-12,y));
      const duration = reduced ? 2000 : config.duration*1000*(kind === 'cars' && i%2 ? .8 : 1);
      const delay = reduced ? 0 : i*(kind === 'cars' ? 400 : 350);
      const staticX = (i+1)*width/(count+1)-w/2;
      const frames = reduced ? [{opacity:0},{opacity:1,offset:.2},{opacity:1,offset:.8},{opacity:0}]
        : [0,.25,.5,.75,1].map((t,index)=>{
          const x = reverse ? width+12-(width+w+24)*t : -w-12+(width+w+24)*t;
          const dy = airborne ? Math.sin(t*Math.PI*2+i)*(kind==='butterflies' ? Math.min(35,height*.05) : kind==='ghosts' ? 24 : 12) : 0;
          return {transform:`translate3d(${x}px,${y+dy}px,0)`,opacity:index===0||index===4 ? 0 : 1,offset:t};
        });
      items.push({kind,index:i,width:w,height:h,y,staticX,reverse,duration,delay,frames});
    }
    return items;
  }

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
      // A product rename alone must not discard locally saved timing or character choices.
      const previousDefaultTitles = ['Białe duszki','Domowy pomocnik'];
      if(config.title === 'Domowe Animacje' && previousDefaultTitles.includes(this.base.title) &&
        JSON.stringify({...this.base,title:config.title}) === JSON.stringify(config)) {
        this.base = {...config};
        if(previousDefaultTitles.includes(this.config.title)) this.config = {...this.config,title:config.title};
        this.persist();this.schedule();return;
      }
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
    showScene(config) {
      if(document.hidden || !document.body) return;
      this.stopFlight();
      const layer = document.createElement('div');layer.setAttribute('aria-hidden','true');
      layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
      const root = layer.attachShadow({mode:'open'});
      root.innerHTML = '<style>:host{pointer-events:none!important}'+SCENE_CSS+'</style>';
      let finish = 0;
      for(const item of planScene(config,window.innerWidth,window.innerHeight,this.reduced.matches)) {
        const node = document.createElement('div');node.className = 'traveller '+item.kind;
        node.style.width = item.width+'px';
        if(this.reduced.matches) {node.style.left=item.staticX+'px';node.style.top=item.y+'px';}
        node.innerHTML = '<div class="flip" style="transform:scaleX('+(item.reverse ? -1 : 1)+')"><div class="art">'+sceneSVG(item.kind,item.index)+'</div></div>';
        root.append(node);
        this.animations.push(node.animate(item.frames,{duration:item.duration,delay:item.delay,fill:'both',easing:'linear'}));
        finish = Math.max(finish,item.duration+item.delay);
      }
      document.body.append(layer);this.layer = layer;
      this.cleanup = setTimeout(()=>this.stopFlight(),finish+100);
    }
    fly(config = this.config) {
      if(document.hidden || !document.body) return;
      if(config.character === 'random') {
        const character = chooseCharacter(config.random_pool,this.lastCharacter);
        return this.fly({...config,character});
      }
      this.lastCharacter = config.character;
      if(config.character === 'robot') return this.showRobot(config);
      return this.showScene(config);
    }
  }
  const runtimeKey = Symbol.for('white-ghosts-card.runtime.v1');
  const runtime = window[runtimeKey] || (window[runtimeKey] = new GhostRuntime());
  const FORM_FIELDS = `
    <label class="wide">Nazwa karty<input name="title" maxlength="100" type="text"></label>
    <label>Animacja<select name="character">${Object.entries(LABELS).map(([value,label])=>'<option value="'+value+'">'+label+'</option>').join('')}</select></label>
    <label>Róg ekranu (robocik)<select name="corner"><option value="random">Losowy róg</option><option value="bottom-right">Prawy dolny</option><option value="bottom-left">Lewy dolny</option><option value="top-right">Prawy górny</option><option value="top-left">Lewy górny</option></select></label>
    <label>Kierunek ruchu<select name="direction"><option value="random">Losowy kierunek</option><option value="left-to-right">Z lewej do prawej</option><option value="right-to-left">Z prawej do lewej</option></select></label>
    <div class="wide random-pool" data-random-pool><span>Animacje w losowaniu</span><div class="pool-options">${CHARACTERS.map(kind=>'<label class="check"><input type="checkbox" name="random_pool" value="'+kind+'">'+LABELS[kind]+'</label>').join('')}</div></div>
    <label>Odstęp: minimum (min)<input name="interval_min" type="number" min="1" max="1440" step="any" required></label>
    <label>Odstęp: maksimum (min)<input name="interval_max" type="number" min="1" max="1440" step="any" required></label>
    <label>Aktywne od<input name="schedule_start" type="time" required></label>
    <label>Aktywne do<input name="schedule_end" type="time" required></label>
    <label>Czas wyświetlania (s)<input name="duration" type="number" min="5" max="60" step="any" required></label>
    <label>Rozmiar (px)<input name="size" type="number" min="40" max="220" step="1" required></label>
    <label data-ghost-count>Liczba duszków / motylków / aut<input name="ghosts" type="number" min="1" max="8" step="1" required></label>
  `;
  const FORM_STYLE = `
    .fields { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px; }
    .wide { grid-column:1/-1; }
    .random-pool>span { display:block;font-size:12px;color:var(--secondary-text-color,#a9b3c7);margin-bottom:6px; }
    .pool-options { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 8px; }
    .pool-options label.check { flex-direction:row;align-items:center;gap:8px;min-height:44px; }
    .pool-options input[type=checkbox] { width:20px;min-height:20px;flex:0 0 20px;margin:0;padding:0;accent-color:var(--primary-color,#21aadd); }
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
      if(key === 'random_pool') {
        for(const checkbox of form.querySelectorAll('[name="random_pool"]')) checkbox.checked = value.includes(checkbox.value);
        continue;
      }
      const field = form.elements.namedItem(key);
      if (field) field.value = String(value);
    }
    adjustForm(form);
  }
  function adjustForm(form) {
    const kind = form.elements.namedItem('character').value;
    form.querySelector('[data-ghost-count]').hidden = !['ghosts','butterflies','cars','random'].includes(kind);
    form.querySelector('[data-random-pool]').hidden = kind !== 'random';
    form.elements.namedItem('corner').disabled = !['robot','random'].includes(kind);
    form.elements.namedItem('direction').disabled = kind === 'robot';
  }
  function readForm(form) {
    const out = {};
    for (const key of Object.keys(DEFAULTS)) {
      if(key === 'random_pool') {
        out[key] = Array.from(form.querySelectorAll('[name="random_pool"]')).filter(field=>field.checked).map(field=>field.value);
        continue;
      }
      const value = form.elements.namedItem(key).value;
      out[key] = ['ghosts','duration','size','interval_min','interval_max'].includes(key) ? Number(value) : value;
    }
    if(out.character !== 'random' && out.random_pool.length === 0) out.random_pool = [...DEFAULTS.random_pool];
    return normalize(out);
  }
  class WhiteGhostsCard extends HTMLElement {
    constructor() {
      super(); this.attachShadow({mode:'open'});
      this.update = () => this.renderState();
    }
    static getStubConfig() { return normalize(); }
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
      const config = this.effectiveConfig;
      root.querySelector('h2').textContent = config.title;
      if (this.iconCharacter !== config.character) {
        root.querySelector('.icon').innerHTML = sceneSVG(config.character); this.iconCharacter = config.character;
      }
      root.querySelector('.sub').textContent = LABELS[config.character] +
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
          const config = {...this.original,...readForm(form),type:this.original.type || 'custom:'+TAG};
          this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
          notice.textContent = 'Zastosowano. Zapisz kartę w Home Assistant.';notice.classList.remove('error');
        } catch(error) { notice.textContent = error.message;notice.classList.add('error'); }
      });
    }
    set hass(value) { this._hass = value; }
  }
  customElements.define('white-ghosts-card-editor',WhiteGhostsEditor);
  customElements.define(TAG, WhiteGhostsCard);
  if(!customElements.get(LEGACY_TAG)) customElements.define(LEGACY_TAG,class extends WhiteGhostsCard {});
  window.customCards = window.customCards || [];
  window.customCards.push({type:TAG,name:'Domowe Animacje',preview:true,description:'Duszki, robocik, Mikołaj, króliczek, motylki i wyścigówki. Pełne ustawienia w karcie.'});
})();

