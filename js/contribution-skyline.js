(function () {
  "use strict";

  /* ══════════ Config ══════════ */
  const UNIT = "venda";
  const UNIT_PLURAL = "vendas";
  const HEIGHT_SCALE = 1;
  const DURATION = 1300;
  const WEEK_START = 0;
  const ORBIT = true;
  const LOCALE = "pt-BR";
  const SEED = 7;

  /* ── Parâmetros de vendas (faixa 25–80/dia, com contraste visual) ── */
  const SALES = {
    MIN: 25,              // piso diário: dia com venda nunca vende menos que isso
    AVG: 42,              // centro da faixa (referência p/ equilíbrio das cores)
    PEAK: 80,             // teto dos picos
    MAX: 80,              // teto rígido: nenhum dia passa disso
    WEEKEND_FACTOR: 0.55, // fim de semana vende um pouco menos (sem furar o piso)
    ACTIVE_WEEKDAY: 0.85, // chance de haver venda num dia útil
    ACTIVE_WEEKEND: 0.55, // chance de haver venda no fim de semana
    PEAK_CHANCE: 0.18,    // % dos dias ativos que viram pico perto de 80
    LOW_CHANCE: 0.28,     // % dos dias ativos que viram baixa demanda (10–15)
    LOW_VALUES: [10, 13, 14, 15] // valores sorteados nos dias de baixa demanda
  };

  /* ══════════ Funções puras ══════════ */
  const DAY_MS = 86400000;
  const clamp01 = (v) => (v > 0 ? (v < 1 ? v : 1) : 0);
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (x) => { const t = clamp01(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const smoothstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);

  const dayMs = (v) => {
    if (typeof v === "number") return Math.floor(v / DAY_MS) * DAY_MS;
    if (typeof v === "string") {
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
      if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
      v = new Date(v);
    }
    return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
  };

  const rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const generateContributions = (endMs, seed = 7, days = 371) => {
    const r = rng(seed);
    const out = [];
    for (let i = 0; i < days; i++) {
      const ms = endMs - (days - 1 - i) * DAY_MS;
      const dow = new Date(ms).getUTCDay();

      // ✅ Domingos têm movimento fraco: só 8 ou 10 vendas
      if (dow === 0) {
        out.push({ date: toKey(ms), count: r() < 0.5 ? 8 : 10 });
        continue;
      }

      const weekend = dow === 6;
      const pActive = weekend ? SALES.ACTIVE_WEEKEND : SALES.ACTIVE_WEEKDAY;
      let count = 0;

      if (r() < pActive) {
        const roll = r();
        if (roll < SALES.LOW_CHANCE) {
          // Dia de baixa demanda: 10, 13, 14 ou 15 vendas
          count = SALES.LOW_VALUES[Math.floor(r() * SALES.LOW_VALUES.length)];
        } else {
          const r2 = (roll - SALES.LOW_CHANCE) / (1 - SALES.LOW_CHANCE);
          if (r2 < 0.30) {
            // Pico: tende a encostar no teto (58–80)
            count = Math.round(SALES.PEAK * (0.72 + r() * 0.28));
          } else if (r2 < 0.68) {
            // Faixa média-alta (45–70)
            count = Math.round(SALES.MIN + r() * (SALES.PEAK - SALES.MIN) * 0.82);
          } else {
            // Faixa média-baixa (25–45)
            count = Math.round(SALES.MIN + r() * 20);
          }
          // Sábado vende um pouco menos, mas nunca abaixo do piso
          if (weekend) count = Math.max(SALES.MIN, Math.round(count * SALES.WEEKEND_FACTOR));
        }
      }

      // 🔒 Respeita o teto (o piso de 25 não afeta os dias de baixa demanda)
      count = Math.min(count, SALES.MAX);

      out.push({ date: toKey(ms), count });
    }
    return out;
  };

  const levelOf = (count, busy) => count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4));

  const buildGrid = (data, endMs, weekStart = 0) => {
    const counts = new Map();
    for (const d of data) {
      if (!d || typeof d.date !== "string") continue;
      const ms = dayMs(d.date);
      const c = Number(d.count);
      if (!Number.isFinite(ms) || !(c > 0) || !Number.isFinite(c)) continue;
      const k = toKey(ms);
      counts.set(k, (counts.get(k) ?? 0) + c);
    }
    let start = endMs - 364 * DAY_MS;
    start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * DAY_MS;
    const cells = [];
    for (let ms = start, i = 0; ms <= endMs; ms += DAY_MS, i++) {
      const date = toKey(ms);
      cells.push({ date, count: counts.get(date) ?? 0, level: 0, week: Math.floor(i / 7), day: i % 7 });
    }
    const nz = cells.map((c) => c.count).filter((c) => c > 0).sort((a, b) => a - b);
    const busy = nz.length ? nz[Math.floor(0.95 * (nz.length - 1))] : 0;
    for (const c of cells) c.level = levelOf(c.count, busy);
    return { cells, weeks: cells.length ? cells[cells.length - 1].week + 1 : 0, max: nz.length ? nz[nz.length - 1] : 0 };
  };

  const computeStats = (cells) => {
    let total = 0, best = 0; let bestDate = null;
    let run = 0; let runStart = null;
    let longest = { days: 0, start: null, end: null };
    for (const c of cells) {
      total += c.count;
      if (c.count > best) { best = c.count; bestDate = c.date; }
      if (c.count > 0) { if (run === 0) runStart = c.date; run++; if (run > longest.days) longest = { days: run, start: runStart, end: c.date }; }
      else run = 0;
    }
    let j = cells.length - 1;
    if (j >= 0 && cells[j].count === 0) j--;
    const endAt = j;
    while (j >= 0 && cells[j].count > 0) j--;
    const days = endAt - j;
    const current = days > 0 ? { days, start: cells[j + 1].date, end: cells[endAt].date } : { days: 0, start: null, end: null };
    return { total, first: cells.length ? cells[0].date : null, last: cells.length ? cells[cells.length - 1].date : null, busiest: { count: best, date: bestDate }, longest, current };
  };

  const monthLabels = (cells, weeks, locale = "en-US") => {
    const fmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
    const out = []; let prev = -1;
    for (let w = 0; w < weeks; w++) {
      const c = cells[w * 7]; if (!c) break;
      const m = +c.date.slice(5, 7);
      if (m !== prev) out.push({ week: w, label: fmt.format(dayMs(c.date)) });
      prev = m;
    }
    if (out.length > 1 && out[1].week - out[0].week < 3) out.shift();
    return out;
  };

  const barHeight = (count, max, scale = 1) => count > 0 && max > 0 ? 0.4 + Math.pow(count / max, 0.85) * 7.2 * scale : 0.2;
  const WAVE = 0.42;
  const riseAt = (t, week, weeks, day) => {
    const d = (weeks > 1 ? week / (weeks - 1) : 0) * 0.36 + (day / 6) * 0.06;
    return easeOutCubic((t - d) / (1 - WAVE));
  };

  const YAW_3D = Math.PI / 4;
  const ELEV_3D = (34 * Math.PI) / 180;
  const YAW_RANGE = [(8 * Math.PI) / 180, (82 * Math.PI) / 180];
  const ELEV_RANGE = [(18 * Math.PI) / 180, (62 * Math.PI) / 180];

  const camera = (e, dYaw = 0, dElev = 0) => {
    const yaw = Math.min(YAW_RANGE[1], Math.max(0, lerp(0, YAW_3D + dYaw, e)));
    const elev = lerp(Math.PI / 2, Math.min(ELEV_RANGE[1], Math.max(ELEV_RANGE[0], ELEV_3D + dElev)), e);
    return { cs: Math.cos(yaw), sn: Math.sin(yaw), se: Math.sin(elev), ce: Math.cos(elev) };
  };
  const project = (c, x, y, z) => [x * c.cs - y * c.sn, (x * c.sn + y * c.cs) * c.se - z * c.ce];
  const mixRGB = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const luminance = (c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

  const PALETTES = {
    github: { light: ["#c6e48b", "#7bc96f", "#239a3b", "#196127"], dark: ["#0e4429", "#006d32", "#26a641", "#39d353"] },
    halloween: { light: ["#ffee4a", "#ffc501", "#fe9600", "#b33c00"], dark: ["#631c03", "#bd561d", "#fa7a18", "#fddf68"] },
    ocean: { light: ["#b8e3f5", "#6ec3eb", "#2a8fd1", "#0b4f8a"], dark: ["#0c2d4a", "#12508a", "#2a88d8", "#7cc7ff"] },
    ember: { light: ["#fde2c4", "#fbad6e", "#f06b3a", "#b3261e"], dark: ["#4a1a10", "#8f2f16", "#e0572a", "#ffa46b"] },
    grape: { light: ["#e4d4fb", "#b794f4", "#805ad5", "#44337a"], dark: ["#2d1f4f", "#553c9a", "#8b5cf6", "#c4b5fd"] },
    mono: { light: ["#d4d4d4", "#a3a3a3", "#525252", "#171717"], dark: ["#333333", "#5c5c5c", "#a3a3a3", "#fafafa"] },
    brand: { light: ["#dbe4ff", "#91a7ff", "#3b5bdb", "#1f3aa6"], dark: ["#16264f", "#2f4ac0", "#4c6fff", "#a5b8ff"] }
  };
  const resolvePalette = (p, dark) => {
    const name = typeof p === "string" ? p : "brand";
    const src = PALETTES[name] ? PALETTES[name] : PALETTES.brand;
    return dark ? src.dark : src.light;
  };
  const PALETTE = "brand";

  /* ══════════ Cor ══════════ */
  const FG_FALLBACK = [23, 23, 23];
  const BG_FALLBACK = [255, 255, 255];
  let probe = null;
  const toRGB = (color, fallback) => {
    if (!probe) { const c = document.createElement("canvas"); c.width = c.height = 1; probe = c.getContext("2d", { willReadFrequently: true }); }
    if (!probe) return fallback;
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "rgba(0,0,0,0)";
    probe.fillStyle = color;
    probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data;
    if (d[3] < 8) return fallback;
    return [d[0], d[1], d[2]];
  };
  const rgbString = (r, g, b) => "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";

  const pointInQuad = (p, o, x, y) => {
    let sign = 0;
    for (let k = 0; k < 4; k++) {
      const ax = p[o + k * 2], ay = p[o + k * 2 + 1];
      const bx = p[o + ((k + 1) % 4) * 2], by = p[o + ((k + 1) % 4) * 2 + 1];
      const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
      if (Math.abs(cross) < 1e-9) continue;
      const s = cross > 0 ? 1 : -1;
      if (sign === 0) sign = s; else if (s !== sign) return false;
    }
    return sign !== 0;
  };
  const quadPath = (ctx, p, o, r) => {
    if (r < 0.3) {
      ctx.moveTo(p[o], p[o + 1]); ctx.lineTo(p[o + 2], p[o + 3]); ctx.lineTo(p[o + 4], p[o + 5]); ctx.lineTo(p[o + 6], p[o + 7]); ctx.closePath(); return;
    }
    ctx.moveTo((p[o + 6] + p[o]) / 2, (p[o + 7] + p[o + 1]) / 2);
    for (let k = 0; k < 4; k++) { const b = (k + 1) % 4; ctx.arcTo(p[o + k * 2], p[o + k * 2 + 1], p[o + b * 2], p[o + b * 2 + 1], r); }
    ctx.closePath();
  };

  /* ══════════ Model ══════════ */
  const end = dayMs(new Date());
  const data = generateContributions(end, SEED);
  const grid = buildGrid(data, end, WEEK_START);
  const model = { cells: grid.cells, weeks: grid.weeks, max: grid.max, stats: computeStats(grid.cells), months: monthLabels(grid.cells, grid.weeks, LOCALE) };

  /* ══════════ Formatters ══════════ */
  const nf = new Intl.NumberFormat(LOCALE);
  const df = new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric", timeZone: "UTC" });
  const dfy = new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const dfl = new Intl.DateTimeFormat(LOCALE, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  const noun = (n) => (n === 1 ? UNIT : UNIT_PLURAL);

  /* ══════════ DOM ══════════ */
  const root = document.getElementById("skyline-root");
  const stage = document.getElementById("skyline-stage");
  const canvas = document.getElementById("skyline-canvas");
  const tip = document.getElementById("skyline-tip");
  const ctx = canvas.getContext("2d");
  const toggle = document.getElementById("skyline-toggle");
  const announceEl = document.getElementById("sk-announce");

  /* ══════════ Estado ══════════ */
  let view = "3d";
  let activeIdx = -1;
  let legendLevel = -1;

  /* ══════════ Estado do engine ══════════ */
  let t = 0, target = 0, entered = false;
  let yaw = 0, elev = 0, yawGoal = 0, elevGoal = 0;
  let W = 0, H2 = 0, H3 = 0, Hmax = 0, lastH = -1, dpr = 1, gutter = 30, labelW = 30;
  let font = "10px sans-serif";
  const col = new Float32Array(15), colGoal = new Float32Array(15);
  let colReady = false, fg = FG_FALLBACK, bg = BG_FALLBACK, isDark = false;
  let n = 0, weeks = 0;
  let wk, dy, lv, hgt, zs, hover, dim, polys, faces, order;
  let months = [], weekdayRows = [];
  let hovered = -1, pinned = -1, tipW = 0, raf = 0, last = 0;

  /* ══════════ Engine ══════════ */
  function load() {
    n = model.cells.length; weeks = model.weeks;
    if (!wk || wk.length !== n) {
      wk = new Float32Array(n); dy = new Float32Array(n); lv = new Uint8Array(n); hgt = new Float32Array(n);
      zs = new Float32Array(n); hover = new Float32Array(n); dim = new Float32Array(n);
      polys = new Float32Array(n * 24); faces = new Uint8Array(n);
      order = Array.from({ length: n }, (_, i) => i);
    }
    for (let i = 0; i < n; i++) {
      const c = model.cells[i];
      wk[i] = c.week; dy[i] = c.day; lv[i] = c.level; hgt[i] = barHeight(c.count, model.max, HEIGHT_SCALE);
    }
    months = model.months;
    const wf = new Intl.DateTimeFormat(LOCALE, { weekday: "short", timeZone: "UTC" });
    weekdayRows = [];
    for (let d = 0; d < 7 && d < n; d++) {
      const dow = new Date(dayMs(model.cells[d].date)).getUTCDay();
      if (dow === 1 || dow === 3 || dow === 5) weekdayRows.push({ day: d, label: wf.format(dayMs(model.cells[d].date)) });
    }
    if (hovered >= n) hovered = -1;
    if (pinned >= n) pinned = -1;
  }

  function updateThemeDOM(all) {
    const sw = all.map((c) => rgbString(c[0], c[1], c[2]));
    root.style.setProperty("--sky-accent", sw[4]);
    const wrap = document.getElementById("skyline-swatches");
    const names = ["Sem " + UNIT_PLURAL, "Leve", "Moderado", "Intenso", "Máximo"];
    if (wrap.children.length === 0) {
      for (let i = 0; i < 5; i++) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "sw";
        b.setAttribute("aria-label", "Destacar dias " + names[i].toLowerCase());
        b.title = names[i];
        b.addEventListener("mouseenter", () => { legendLevel = i; kick(); });
        b.addEventListener("focus", () => { legendLevel = i; kick(); });
        b.addEventListener("blur", () => { legendLevel = -1; kick(); });
        b.addEventListener("click", () => { legendLevel = legendLevel === i ? -1 : i; kick(); });
        wrap.appendChild(b);
      }
      wrap.addEventListener("mouseleave", () => { legendLevel = -1; kick(); });
    }
    for (let i = 0; i < 5; i++) wrap.children[i].style.background = sw[i];
    updateStats();
  }

  function retheme() {
    const cs = getComputedStyle(root);
    fg = toRGB(cs.color, FG_FALLBACK) || FG_FALLBACK;
    const b = toRGB(cs.backgroundColor, null);
    bg = b || (luminance(fg) > 0.5 ? [10, 10, 10] : BG_FALLBACK);
    isDark = luminance(bg) < 0.45;
    font = "400 10px " + (cs.fontFamily || "sans-serif");
    const pal = resolvePalette(PALETTE, isDark);
    const empty = mixRGB(bg, fg, isDark ? 0.11 : 0.075);
    const all = [empty].concat(pal.map((c) => toRGB(c, FG_FALLBACK) || FG_FALLBACK));
    for (let k = 0; k < 5; k++) for (let ch = 0; ch < 3; ch++) colGoal[k * 3 + ch] = all[k][ch];
    if (!colReady) { col.set(colGoal); colReady = true; }
    ctx.font = font;
    labelW = Math.ceil(Math.max(20, ...weekdayRows.map((r) => ctx.measureText(r.label).width))) + 8;
    updateThemeDOM(all);
    kick();
  }

  function extent(cam, e, full) {
    const w = lerp(0.78, 0.9, e);
    const off = (1 - w) / 2;
    let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
    const add = (x, y, z) => { const p = project(cam, x, y, z); if (p[0] < minx) minx = p[0]; if (p[0] > maxx) maxx = p[0]; if (p[1] < miny) miny = p[1]; if (p[1] > maxy) maxy = p[1]; };
    for (let i = 0; i < n; i++) {
      const x0 = wk[i] + off, y0 = dy[i] + off;
      const z = full ? hgt[i] * e : zs[i];
      add(x0, y0, z); add(x0 + w, y0, z); add(x0, y0 + w, z);
      add(x0 + w, y0 + w, 0); add(x0, y0 + w, 0); add(x0 + w, y0, 0);
    }
    add(0, 7 + 1.5 * e, 0); add(weeks, 7 + 1.5 * e, 0);
    return { minx, maxx, miny, maxy };
  }

  function relayout() {
    const w = Math.round(stage.clientWidth);
    if (!w || !n) return;
    W = w;
    gutter = W < 520 ? 0 : labelW;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const b2 = extent(camera(0), 0, true);
    H2 = 20 + 4 + ((b2.maxy - b2.miny) / (b2.maxx - b2.minx)) * (W - gutter - 4);
    const b3 = extent(camera(1), 1, true);
    const natural = ((b3.maxy - b3.miny) / (b3.maxx - b3.minx)) * (W - 40) + 40;
    H3 = Math.max(Math.min(natural, W * 0.72, 620), Math.min(natural, 240));
    Hmax = Math.ceil(Math.max(H2, H3));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(Hmax * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = Hmax + "px";
    lastH = -1;
    draw();
  }

  function draw() {
    if (!W || !n) return;
    const e = easeInOutCubic(t);
    const cam = camera(e, yaw, elev);
    const Hc = lerp(H2, H3, e);
    if (Math.abs(Hc - lastH) > 0.2) { stage.style.height = Hc.toFixed(1) + "px"; lastH = Hc; }
    for (let i = 0; i < n; i++) zs[i] = riseAt(t, wk[i], weeks, dy[i]) * hgt[i];
    const b = extent(cam, e, false);
    const pad = lerp(2, 20, e);
    const left = pad + gutter * (1 - e);
    const top = pad + 20 * (1 - e);
    const aw = W - left - pad, ah = Hc - top - pad;
    const bw = Math.max(1e-6, b.maxx - b.minx), bh = Math.max(1e-6, b.maxy - b.miny);
    const s = Math.min(aw / bw, ah / bh);
    const ox = left + (aw - bw * s) / 2 - b.minx * s;
    const oy = top + (ah - bh * s) / 2 - b.miny * s;
    const cs = cam.cs, sn = cam.sn, se = cam.se, ce = cam.ce;
    const px = (x, y) => ox + (x * cs - y * sn) * s;
    const py = (x, y, z) => oy + ((x * sn + y * cs) * se - z * ce) * s;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, Hmax);

    order.sort((a, c) => (wk[a] + 0.5) * sn + (dy[a] + 0.5) * cs - ((wk[c] + 0.5) * sn + (dy[c] + 0.5) * cs));

    const w = lerp(0.78, 0.9, e);
    const off = (1 - w) / 2;
    const radius = lerp(0.17, 0.03, e) * s;
    const outline = (1 - e) * 0.07;
    const lift = 0.7 * e;
    const ex = col[0], ey = col[1], ez = col[2];

    for (let k = 0; k < n; k++) {
      const i = order[k];
      const x0 = wk[i] + off, y0 = dy[i] + off, x1 = x0 + w, y1 = y0 + w;
      const z = zs[i] + hover[i] * lift;
      const o = i * 24;
      polys[o] = px(x0, y0); polys[o + 1] = py(x0, y0, z);
      polys[o + 2] = px(x1, y0); polys[o + 3] = py(x1, y0, z);
      polys[o + 4] = px(x1, y1); polys[o + 5] = py(x1, y1, z);
      polys[o + 6] = px(x0, y1); polys[o + 7] = py(x0, y1, z);
      polys[o + 8] = px(x0, y1); polys[o + 9] = py(x0, y1, 0);
      polys[o + 10] = px(x1, y1); polys[o + 11] = py(x1, y1, 0);
      polys[o + 12] = polys[o + 4]; polys[o + 13] = polys[o + 5];
      polys[o + 14] = polys[o + 6]; polys[o + 15] = polys[o + 7];
      polys[o + 16] = px(x1, y0); polys[o + 17] = py(x1, y0, 0);
      polys[o + 18] = polys[o + 10]; polys[o + 19] = polys[o + 11];
      polys[o + 20] = polys[o + 4]; polys[o + 21] = polys[o + 5];
      polys[o + 22] = polys[o + 2]; polys[o + 23] = polys[o + 3];

      const tall = z * ce * s;
      let f = 0;
      if (tall > 0.35 && w * cs * s > 0.35) f |= 1;
      if (tall > 0.35 && w * sn * s > 0.35) f |= 2;
      faces[i] = f;

      const L = lv[i] * 3;
      let r = col[L], g = col[L + 1], bl = col[L + 2];
      const d = dim[i];
      if (d > 0.002) { r += (ex - r) * 0.72 * d; g += (ey - g) * 0.72 * d; bl += (ez - bl) * 0.72 * d; }
      const hv = hover[i];
      if (hv > 0.002) { const m = 0.16 * hv; r += (fg[0] - r) * m; g += (fg[1] - g) * m; bl += (fg[2] - bl) * m; }
      if (f & 1) { ctx.beginPath(); quadPath(ctx, polys, o + 8, 0); ctx.fillStyle = rgbString(r * 0.84, g * 0.84, bl * 0.84); ctx.fill(); }
      if (f & 2) { ctx.beginPath(); quadPath(ctx, polys, o + 16, 0); ctx.fillStyle = rgbString(r * 0.68, g * 0.68, bl * 0.68); ctx.fill(); }
      ctx.beginPath(); quadPath(ctx, polys, o, radius);
      ctx.fillStyle = rgbString(r, g, bl); ctx.fill();
      if (outline > 0.004) {
        ctx.strokeStyle = "rgba(" + fg[0] + "," + fg[1] + "," + fg[2] + "," + outline.toFixed(3) + ")";
        ctx.lineWidth = 1; ctx.stroke();
      }
      if (hv > 0.02) {
        ctx.strokeStyle = "rgba(" + fg[0] + "," + fg[1] + "," + fg[2] + "," + (0.85 * hv).toFixed(3) + ")";
        ctx.lineWidth = 1.5; ctx.stroke();
      }
    }

    const muted = mixRGB(bg, fg, 0.55);
    ctx.font = font;
    const a2 = 1 - smoothstep(0, 0.4, e);
    const a3 = smoothstep(0.62, 1, e);
    if (a2 > 0.004) {
      ctx.fillStyle = "rgba(" + Math.round(muted[0]) + "," + Math.round(muted[1]) + "," + Math.round(muted[2]) + "," + a2.toFixed(3) + ")";
      ctx.textAlign = "left"; ctx.textBaseline = "bottom";
      let edge = -Infinity;
      for (const m of months) {
        const x = px(m.week + off, -0.3);
        const tw = ctx.measureText(m.label).width;
        if (x < edge || x + tw > W) continue;
        ctx.fillText(m.label, x, py(m.week + off, -0.3, 0) - 3);
        edge = x + tw + 6;
      }
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      if (gutter > 0) for (const r of weekdayRows) ctx.fillText(r.label, px(0, r.day + 0.5) - 6, py(0, r.day + 0.5, 0));
    }
    if (a3 > 0.004) {
      ctx.fillStyle = "rgba(" + Math.round(muted[0]) + "," + Math.round(muted[1]) + "," + Math.round(muted[2]) + "," + a3.toFixed(3) + ")";
      ctx.textAlign = "left"; ctx.textBaseline = "top";
      let edge = -Infinity;
      for (const m of months) {
        const x = px(m.week + 0.5, 7.3);
        if (x < edge || x + ctx.measureText(m.label).width > W) continue;
        ctx.fillText(m.label, x, py(m.week + 0.5, 7.3, 0) + 2);
        edge = x + ctx.measureText(m.label).width + 10;
      }
    }

    if (activeIdx >= 0 && activeIdx < n) {
      const i = activeIdx;
      const z = zs[i] + hover[i] * lift;
      const tx = px(wk[i] + 0.5, dy[i] + 0.5);
      const ty = Math.min(py(wk[i] + off, dy[i] + off, z), py(wk[i] + off + w, dy[i] + off, z), py(wk[i] + off, dy[i] + off + w, z));
      const half = tipW / 2;
      const cx = Math.min(W - half - 2, Math.max(half + 2, tx));
      tip.style.transform = "translate(" + (cx - half).toFixed(1) + "px," + (ty - 8).toFixed(1) + "px) translateY(-100%)";
      tip.style.setProperty("--arrow", (tx - cx + half).toFixed(1) + "px");
    }
  }

  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    let moving = false;

    if (t !== target) {
      const step = (dt * 1000) / Math.max(1, DURATION);
      t = target > t ? Math.min(target, t + step) : Math.max(target, t - step);
      moving = true;
    }
    const ko = 1 - Math.exp(-dt * 12);
    yaw += (yawGoal - yaw) * ko;
    elev += (elevGoal - elev) * ko;
    if (Math.abs(yawGoal - yaw) > 1e-4 || Math.abs(elevGoal - elev) > 1e-4) moving = true;
    else { yaw = yawGoal; elev = elevGoal; }

    const kc = 1 - Math.exp(-dt * 7);
    for (let k = 0; k < 15; k++) {
      const d = colGoal[k] - col[k];
      if (Math.abs(d) > 0.4) { col[k] += d * kc; moving = true; } else col[k] = colGoal[k];
    }
    const kh = 1 - Math.exp(-dt * 16);
    const kd = 1 - Math.exp(-dt * 10);
    for (let i = 0; i < n; i++) {
      const hg = i === activeIdx ? 1 : 0;
      const dg = legendLevel >= 0 && lv[i] !== legendLevel ? 1 : 0;
      if (Math.abs(hg - hover[i]) < 0.003) hover[i] = hg; else { hover[i] += (hg - hover[i]) * kh; moving = true; }
      if (Math.abs(dg - dim[i]) < 0.003) dim[i] = dg; else { dim[i] += (dg - dim[i]) * kd; moving = true; }
    }

    draw();
    if (moving) raf = requestAnimationFrame(tick);
  }

  function kick() { if (raf) return; last = performance.now(); raf = requestAnimationFrame(tick); }
  function setTarget() {
    const goal = view === "3d" ? 1 : 0;
    if (!entered) return;
    if (goal !== target) {
      target = goal;
      if (goal === 0) { yawGoal = 0; elevGoal = 0; }
      canvas.style.cursor = ORBIT && target === 1 ? "grab" : "default";
      kick();
    }
  }
  function engineKick() { setTarget(); kick(); }

  function updateTooltip(i) {
    if (i >= 0) {
      const c = model.cells[i];
      tip.querySelector(".tip-strong").textContent = c.count ? nf.format(c.count) + " " + noun(c.count) : "Sem " + UNIT_PLURAL;
      tip.querySelector(".tip-date").textContent = " em " + dfy.format(dayMs(c.date));
      tip.style.opacity = "1";
      tip.setAttribute("aria-hidden", "false");
      tipW = tip.offsetWidth;
      draw();
    } else {
      tip.style.opacity = "0";
      tip.setAttribute("aria-hidden", "true");
    }
  }

  function refreshActive() {
    const next = hovered >= 0 ? hovered : pinned;
    if (next === activeIdx) return;
    activeIdx = next;
    updateTooltip(next);
    kick();
  }

  function hit(x, y) {
    for (let k = n - 1; k >= 0; k--) {
      const i = order[k];
      const o = i * 24;
      if (pointInQuad(polys, o, x, y)) return i;
      if (faces[i] & 1 && pointInQuad(polys, o + 8, x, y)) return i;
      if (faces[i] & 2 && pointInQuad(polys, o + 16, x, y)) return i;
    }
    return -1;
  }
  const local = (ev) => { const r = canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };

  let drag = null;
  const onDown = (ev) => {
    if (ev.button !== 0) return;
    const can = ORBIT && target === 1;
    drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, yaw: yawGoal, elev: elevGoal, moved: false, orbit: can, mouse: ev.pointerType === "mouse" };
    if (can) { try { canvas.setPointerCapture(ev.pointerId); } catch (e) {} }
  };
  const onMove = (ev) => {
    if (drag && drag.orbit && ev.pointerId === drag.id) {
      const dx = ev.clientX - drag.x, dyy = ev.clientY - drag.y;
      if (drag.moved || Math.hypot(dx, dyy) > 4) {
        drag.moved = true;
        yawGoal = Math.min(YAW_RANGE[1] - YAW_3D, Math.max(YAW_RANGE[0] - YAW_3D, drag.yaw + dx * 0.006));
        if (drag.mouse) elevGoal = Math.min(ELEV_RANGE[1] - ELEV_3D, Math.max(ELEV_RANGE[0] - ELEV_3D, drag.elev + dyy * 0.004));
        canvas.style.cursor = "grabbing";
        hovered = -1; refreshActive(); kick(); return;
      }
    }
    if (ev.pointerType !== "mouse") return;
    const p = local(ev);
    const i = hit(p[0], p[1]);
    if (i !== hovered) { hovered = i; refreshActive(); }
    canvas.style.cursor = ORBIT && target === 1 ? "grab" : i >= 0 ? "pointer" : "default";
  };
  const onUp = (ev) => {
    if (!drag || ev.pointerId !== drag.id) return;
    const wasMoved = drag.moved;
    drag = null;
    if (canvas.hasPointerCapture && canvas.hasPointerCapture(ev.pointerId)) canvas.releasePointerCapture(ev.pointerId);
    canvas.style.cursor = ORBIT && target === 1 ? "grab" : "default";
    if (wasMoved) return;
    const p = local(ev);
    const i = hit(p[0], p[1]);
    pinned = i === pinned ? -1 : i;
    if (ev.pointerType !== "mouse") hovered = -1;
    refreshActive();
  };
  const onCancel = () => { drag = null; };
  const onLeave = () => { if (drag) return; hovered = -1; refreshActive(); };
  const onDbl = () => { yawGoal = 0; elevGoal = 0; kick(); };
  const onKey = (ev) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Escape", "Enter", " "];
    if (!keys.includes(ev.key) || !n) return;
    ev.preventDefault();
    if (ev.key === "Escape") { pinned = -1; hovered = -1; refreshActive(); return; }
    let i = pinned >= 0 ? pinned : activeIdx >= 0 ? activeIdx : n - 1;
    if (ev.key === "Enter" || ev.key === " ") return;
    if (pinned >= 0 || activeIdx >= 0) {
      if (ev.key === "ArrowLeft") i -= 7;
      if (ev.key === "ArrowRight") i += 7;
      if (ev.key === "ArrowUp") i -= 1;
      if (ev.key === "ArrowDown") i += 1;
      if (ev.key === "Home") i = 0;
      if (ev.key === "End") i = n - 1;
    }
    i = Math.max(0, Math.min(n - 1, i));
    pinned = i; hovered = -1; refreshActive();
    const c = model.cells[i];
    announceEl.textContent = (c.count ? nf.format(c.count) + " " + noun(c.count) : "Sem " + UNIT_PLURAL) + " em " + dfl.format(dayMs(c.date));
  };
  const onBlur = () => { pinned = -1; refreshActive(); };

  /* ══════════ Stats / toggle / layout ══════════ */
  const range = (a, b, withYear = false) => {
    if (!a || !b) return "—";
    const f = withYear ? dfy : df;
    return f.format(dayMs(a)) + " — " + f.format(dayMs(b));
  };

  function updateStats() {
    const s = model.stats;
    const totalU = noun(s.total);
    document.getElementById("sk-title-num").textContent = nf.format(s.total);
    document.getElementById("sk-title-unit").textContent = totalU;

    const blocks = [
      { val: nf.format(s.total), unit: totalU, sub: range(s.first, s.last, true) },
      { val: nf.format(s.busiest.count), unit: noun(s.busiest.count), sub: s.busiest.date ? df.format(dayMs(s.busiest.date)) : "—" },
      { val: nf.format(s.longest.days), unit: s.longest.days === 1 ? "dia" : "dias", sub: range(s.longest.start, s.longest.end) },
      { val: nf.format(s.current.days), unit: s.current.days === 1 ? "dia" : "dias", sub: range(s.current.start, s.current.end) }
    ];
    for (let i = 0; i < 4; i++) {
      document.getElementById("s" + (i + 1) + "-val").textContent = blocks[i].val;
      document.getElementById("s" + (i + 1) + "-unit").textContent = blocks[i].unit;
      document.getElementById("s" + (i + 1) + "-sub").textContent = blocks[i].sub;
      document.getElementById("c" + (i + 1) + "-val").textContent = blocks[i].val;
      document.getElementById("c" + (i + 1) + "-unit").textContent = blocks[i].unit;
      document.getElementById("c" + (i + 1) + "-sub").textContent = blocks[i].sub;
    }
    syncStatsLayout();
  }

  function syncStatsLayout() {
    const wide = W >= 560;
    const corners = wide && view === "3d";
    document.getElementById("corner-tr").classList.toggle("hidden", !corners);
    document.getElementById("corner-bl").classList.toggle("hidden", !corners);
    document.getElementById("corner-tr").setAttribute("aria-hidden", String(!corners));
    document.getElementById("corner-bl").setAttribute("aria-hidden", String(!corners));
    document.getElementById("skyline-stats").classList.toggle("collapsed", corners);
  }

  function updateToggleUI() {
    const is3d = view === "3d";
    toggle.classList.toggle("is-3d", is3d);
    toggle.querySelectorAll("button").forEach((b) => {
      const on = b.dataset.view === view;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    const hints = document.getElementById("skyline-hint").children;
    for (let i = 0; i < hints.length; i++) hints[i].classList.toggle("on", i === (is3d && ORBIT ? 1 : 0));
    const canvasLabel = nf.format(model.stats.total) + " " + noun(model.stats.total) + " entre " + range(model.stats.first, model.stats.last, true) + ", mostrado como " + (is3d ? "skyline 3D" : "mapa de calor") + ". Use as setas do teclado para ler dias individuais.";
    canvas.setAttribute("aria-label", canvasLabel);
    canvas.style.touchAction = is3d && ORBIT ? "pan-y" : "auto";
    syncStatsLayout();
  }

  function setView(v) { if (view === v) return; view = v; updateToggleUI(); engineKick(); }

  /* ══════════ Init ══════════ */
  load();
  retheme();
  relayout();
  updateToggleUI();
  updateStats();

  const enter = () => {
    if (entered) return;
    entered = true;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) t = target;
    setTarget();
  };
  let io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { enter(); io && io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(stage);
  } else enter();

  new ResizeObserver(() => { if (Math.round(stage.clientWidth) !== W) relayout(); }).observe(stage);

  function rethemeSafe() { retheme(); }
  const mo = new MutationObserver(rethemeSafe);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", rethemeSafe);
  }

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("dblclick", onDbl);
  canvas.addEventListener("keydown", onKey);
  canvas.addEventListener("blur", onBlur);

  toggle.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  /* ══════════ Tema do site ══════════ */
  const themeBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const applyTheme = (dark) => {
    document.body.classList.toggle("dark-mode", dark);
    themeIcon.innerHTML = dark
      ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  };
  themeBtn.addEventListener("click", () => applyTheme(!document.body.classList.contains("dark-mode")));
})();
