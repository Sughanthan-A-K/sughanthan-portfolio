"use client";

import { useEffect, useRef } from "react";
import { CATALOG } from "@/data/starCatalog";

type RGB = [number, number, number];
const DEG = Math.PI / 180;

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let rng: () => number = Math.random;
function rand(a: number, b: number) { return a + rng() * (b - a); }
function randInt(a: number, b: number) { return Math.floor(rand(a, b)); }

function getIsDark() {
  if (typeof window === "undefined") return true;
  return document.documentElement.classList.contains("dark");
}

const OBS_LAT = 11.0 * DEG;
const SIN_LAT = Math.sin(OBS_LAT);
const COS_LAT = Math.cos(OBS_LAT);
const LST_SCROLL_RANGE = 90;
const GC_RA = 266.4;

function eqToAltAz(raDeg: number, decDeg: number, lstDeg: number): { alt: number; az: number } {
  const ha = (lstDeg - raDeg) * DEG;
  const dec = decDeg * DEG;
  const sinDec = Math.sin(dec);
  const sinAlt = SIN_LAT * sinDec + COS_LAT * Math.cos(dec) * Math.cos(ha);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
  const cosAlt = Math.cos(alt);
  let az = 0;
  if (cosAlt > 1e-8) {
    const sinAz = -Math.cos(dec) * Math.sin(ha) / cosAlt;
    const cosAz = (sinDec - SIN_LAT * sinAlt) / (COS_LAT * cosAlt);
    az = Math.atan2(sinAz, cosAz);
  }
  return { alt, az };
}

function projectToScreen(
  alt: number, az: number, cx: number, cy: number, scale: number,
): { sx: number; sy: number; visible: boolean } {
  if (alt < -5 * DEG) return { sx: 0, sy: 0, visible: false };
  const zd = Math.max(0, Math.PI / 2 - alt);
  const r = (zd / (Math.PI / 2)) * scale;
  return { sx: cx + r * Math.sin(az), sy: cy - r * Math.cos(az), visible: true };
}

const NGP_DEC_R = 27.12825 * DEG;
const NGP_RA_D = 192.85948;
const L_NCP_R = 122.93192 * DEG;
const SIN_NGP = Math.sin(NGP_DEC_R);
const COS_NGP = Math.cos(NGP_DEC_R);

function galToEq(lDeg: number, bDeg: number): { ra: number; dec: number } {
  const l = lDeg * DEG;
  const b = bDeg * DEG;
  const sinB = Math.sin(b), cosB = Math.cos(b);
  const dl = L_NCP_R - l;
  const sinDec = sinB * SIN_NGP + cosB * COS_NGP * Math.cos(dl);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));
  const y = cosB * Math.sin(dl);
  const x = sinB * COS_NGP - cosB * SIN_NGP * Math.cos(dl);
  const ra = ((Math.atan2(y, x) / DEG + NGP_RA_D) % 360 + 360) % 360;
  return { ra, dec: dec / DEG };
}

interface MWBlob {
  ra: number; dec: number;
  ra2: number; dec2: number;
  angSize: number;
  color: RGB;
  alpha: number;
  aspect: number;
}
interface MWStar {
  ra: number; dec: number;
  radius: number;
  alpha: number;
  color: RGB;
}

function initMWBand(): { blobs: MWBlob[]; microStars: MWStar[] } {
  const blobs: MWBlob[] = [];
  const microStars: MWStar[] = [];
  const mobile = isMobileDevice();
  const blobScale = mobile ? 0.4 : 1;

  const layers: { colors: RGB[]; bSpread: number; alpha: number; count: number; angScale: number }[] = [
    { colors: [[100, 130, 200], [80, 110, 185], [120, 145, 210]], bSpread: 18, alpha: 0.14, count: 220, angScale: 14 },
    { colors: [[160, 100, 200], [140, 80, 180], [180, 120, 220], [130, 90, 170]], bSpread: 12, alpha: 0.15, count: 230, angScale: 11 },
    { colors: [[200, 160, 90], [180, 140, 70], [210, 170, 100], [190, 150, 80]], bSpread: 6, alpha: 0.17, count: 200, angScale: 9 },
    { colors: [[240, 220, 170], [255, 240, 200], [230, 210, 160]], bSpread: 4, alpha: 0.20, count: 160, angScale: 7 },
    { colors: [[220, 80, 80], [200, 60, 90], [240, 100, 100], [180, 50, 70]], bSpread: 9, alpha: 0.10, count: 100, angScale: 9 },
    { colors: [[80, 180, 200], [60, 160, 190], [100, 200, 210]], bSpread: 10, alpha: 0.09, count: 80, angScale: 9 },
    { colors: [[240, 240, 255], [255, 255, 255], [220, 225, 245]], bSpread: 4, alpha: 0.19, count: 120, angScale: 6 },
  ];

  for (const layer of layers) {
    const count = Math.round(layer.count * blobScale);
    for (let i = 0; i < count; i++) {
      const u = rand(0, 1);
      const l = u < 0.55 ? rand(-70, 70) : rand(70, 290);
      const b = (rand(-1, 1) + rand(-1, 1)) * layer.bSpread * 0.5;
      const lNorm = Math.min(Math.abs(l), Math.abs(l - 360), Math.abs(l + 360)) / 180;
      const centerBoost = 1 - lNorm * 0.5;
      const bFade = Math.exp(-(b * b) / (layer.bSpread * layer.bSpread * 0.5));
      const a = layer.alpha * centerBoost * bFade * rand(0.5, 1.0);
      if (a < 0.001) continue;
      const eq = galToEq(((l % 360) + 360) % 360, b);
      const eq2 = galToEq(((l + 3) % 360 + 360) % 360, b);
      blobs.push({
        ra: eq.ra, dec: eq.dec,
        ra2: eq2.ra, dec2: eq2.dec,
        angSize: rand(layer.angScale * 0.5, layer.angScale * 1.3),
        color: layer.colors[randInt(0, layer.colors.length)],
        alpha: a,
        aspect: rand(0.3, 0.55),
      });
    }
  }

  const microStarCount = isMobileDevice() ? 1500 : 5000;
  for (let i = 0; i < microStarCount; i++) {
    const u = rand(0, 1);
    const l = u < 0.5
      ? rand(-60, 60)
      : rand(60, 300);
    const b = (rand(-1, 1) + rand(-1, 1)) * 4;
    const lNorm = Math.min(Math.abs(l), Math.abs(l - 360), Math.abs(l + 360)) / 180;
    const densityBoost = 1 - lNorm * 0.6;
    const eq = galToEq(((l % 360) + 360) % 360, b);
    const tint = rng();
    const color: RGB = tint < 0.4
      ? [240, 240, 255]
      : tint < 0.65
        ? [255, 250, 230]
        : tint < 0.85
          ? [255, 240, 200]
          : [255, 220, 180];
    microStars.push({
      ra: eq.ra, dec: eq.dec,
      radius: rand(0.4, 1.0),
      alpha: rand(0.5, 0.9) * densityBoost,
      color,
    });
  }

  return { blobs, microStars };
}

interface Star {
  ra: number; dec: number;
  radius: number;
  phase: number;
  twinkleSpeed: number;
  scintOffset: number;
  maxAlpha: number;
  color: RGB;
  burst: number;
  burstDecay: number;
  burstCooldown: number;
  burstChance: number;
}

function createCatalogStar(ra: number, dec: number, mag: number, bv: number): Star {
  let color: RGB;
  if (bv < -0.1)      color = [200, 215, 255];
  else if (bv < 0.15)  color = [220, 230, 255];
  else if (bv < 0.4)   color = [255, 255, 255];
  else if (bv < 0.7)   color = [255, 250, randInt(220, 240)];
  else if (bv < 1.1)   color = [255, randInt(200, 220), randInt(140, 170)];
  else                  color = [255, randInt(170, 190), randInt(110, 140)];

  return {
    ra, dec,
    radius: Math.max(0.4, 2.8 - mag * 0.45),
    phase: rand(0, Math.PI * 2),
    twinkleSpeed: rand(0.025, 0.06),
    scintOffset: rand(0, 100),
    maxAlpha: Math.max(0.35, Math.min(0.85, 0.95 - mag * 0.1)),
    color,
    burst: 0,
    burstDecay: rand(0.008, 0.02),
    burstCooldown: randInt(1200, 3600),
    burstChance: mag < 1.5 ? rand(0.0002, 0.001) : rand(0.00005, 0.0004),
  };
}

function createFillerStar(): Star {
  const ra = rand(0, 360);
  const dec = Math.asin(rand(-1, 1)) / DEG;
  const tint = rng();
  const color: RGB = tint < 0.35
    ? [255, 255, 255]
    : tint < 0.55
      ? [220, 230, 255]
      : tint < 0.75
        ? [255, 250, randInt(220, 240)]
        : tint < 0.90
          ? [255, randInt(200, 220), randInt(140, 170)]
          : [255, randInt(170, 190), randInt(110, 140)];
  return {
    ra, dec,
    radius: rand(0.3, 0.7),
    phase: rand(0, Math.PI * 2),
    twinkleSpeed: rand(0.025, 0.06),
    scintOffset: rand(0, 100),
    maxAlpha: rand(0.2, 0.45),
    color,
    burst: 0,
    burstDecay: rand(0.008, 0.02),
    burstCooldown: randInt(1200, 3600),
    burstChance: rand(0.00002, 0.0002),
  };
}

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024);
}

function initStars(): Star[] {
  const mobile = isMobileDevice();
  const catalog = CATALOG.map(([ra, dec, mag, bv]) => createCatalogStar(ra, dec, mag, bv))
    .filter(s => mobile ? s.maxAlpha > 0.35 : true);
  const fillerCount = mobile ? 80 : 200;
  const fillers = Array.from({ length: fillerCount }, () => createFillerStar());
  return [...catalog, ...fillers];
}

function getMoonPosition(): { ra: number; dec: number; phase: number; isWaxing: boolean } {
  const now = new Date();
  const yr = now.getFullYear(), mo = now.getMonth() + 1;
  const d = now.getDate() + now.getHours() / 24 + now.getMinutes() / 1440;
  const jd = 367 * yr - Math.floor(7 * (yr + Math.floor((mo + 9) / 12)) / 4)
    + Math.floor(275 * mo / 9) + d + 1721013.5;
  const T = (jd - 2451545.0) / 36525;
  const L0 = (218.3165 + 481267.8813 * T) % 360;
  const M = (134.9634 + 477198.8676 * T) % 360;
  const D = (297.8502 + 445267.1115 * T) % 360;
  const F = (93.2720 + 483202.0175 * T) % 360;
  const Ms = (357.5291 + 35999.0503 * T) % 360;
  const Mr = M * DEG, Dr = D * DEG, Fr = F * DEG, Msr = Ms * DEG;
  const lon = L0 + 6.289 * Math.sin(Mr) - 1.274 * Math.sin(2 * Dr - Mr)
    - 0.658 * Math.sin(2 * Dr) + 0.214 * Math.sin(2 * Mr)
    - 0.186 * Math.sin(Msr) - 0.114 * Math.sin(2 * Fr);
  const lat = 5.128 * Math.sin(Fr) + 0.281 * Math.sin(Mr + Fr)
    - 0.278 * Math.sin(Fr - Mr) - 0.173 * Math.sin(2 * Dr - Fr);
  const obliquity = 23.4393 * DEG;
  const lonR = lon * DEG, latR = lat * DEG;
  const ra = Math.atan2(
    Math.sin(lonR) * Math.cos(obliquity) - Math.tan(latR) * Math.sin(obliquity),
    Math.cos(lonR),
  );
  const dec = Math.asin(
    Math.sin(latR) * Math.cos(obliquity)
    + Math.cos(latR) * Math.sin(obliquity) * Math.sin(lonR),
  );
  let sunLon = (280.466 + 36000.770 * T) % 360;
  sunLon += 1.915 * Math.sin(Msr) + 0.020 * Math.sin(2 * Msr);
  const elong = Math.acos(
    Math.max(-1, Math.min(1, Math.cos((lon - sunLon) * DEG) * Math.cos(latR))),
  );
  const phase = (1 + Math.cos(elong)) / 2;
  const lonDiff = (((lon - sunLon) % 360) + 360) % 360;
  const RAD = 180 / Math.PI;
  return { ra: ((ra * RAD) % 360 + 360) % 360, dec: dec * RAD, phase, isWaxing: lonDiff < 180 };
}

interface Cloud {
  x: number; y: number; vx: number;
  width: number; height: number;
  opacity: number; seed: number;
}
function spawnCloud(w: number, h: number): Cloud {
  const goRight = Math.random() < 0.5;
  return {
    x: goRight ? -w * 0.3 : w * 1.3,
    y: rand(h * 0.05, h * 0.65),
    vx: (goRight ? 1 : -1) * rand(0.006, 0.018),
    width: rand(w * 0.18, w * 0.45),
    height: rand(25, 70),
    opacity: rand(0.015, 0.04),
    seed: Math.random() * 1000,
  };
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  speed: number;
  life: number; maxLife: number;
  tailLen: number;
  brightness: number;
  active: boolean;
}
function spawnShootingStar(w: number, viewH: number): ShootingStar {
  const angle = rand(0, Math.PI * 2);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const speed = rand(8, 16);
  let x: number, y: number;
  if (Math.abs(cos) >= Math.abs(sin)) {
    if (cos > 0) { x = -10; y = rand(viewH * 0.05, viewH * 0.6); }
    else { x = w + 10; y = rand(viewH * 0.05, viewH * 0.6); }
  } else {
    if (sin > 0) { x = rand(0, w); y = -10; }
    else { x = rand(0, w); y = viewH + 10; }
  }
  return {
    x, y, vx: cos * speed, vy: sin * speed, speed,
    life: 0, maxLife: rand(12, 48), tailLen: rand(40, 100),
    brightness: rand(0.7, 1), active: true,
  };
}

interface Airplane {
  x: number; y: number;
  vx: number; vy: number;
  baseVx: number; baseVy: number;
  blinkPhase: number; blinkSpeed: number;
  strobePhase: number; strobeSpeed: number;
  active: boolean;
  life: number; maxLife: number;
  size: number; type: number;
  rotorPhase: number; nearFactor: number;
}
const AC_DEFS: number[][] = [
  [0.65, 0.95, 0.32, 0.52, 0.09, 0.075],
  [0.70, 1.00, 0.34, 0.54, 0.10, 0.085],
  [0.50, 0.72, 0.18, 0.32, 0.11, 0.10],
  [0.80, 1.10, 0.28, 0.48, 0.07, 0.05],
  [1.05, 1.50, 0.52, 0.82, 0.14, 0.07],
];
const AC_WEIGHTS = [30, 30, 15, 15, 10];
const AC_SHAPES: number[][] = [
  [10, 11, 12, 3.5, 1.0, 4.5],
  [7, 8, 9, 2.5, 0.5, 3.5],
  [5, 6, 6, 2.0, 0.5, 2.5],
  [6, 7, 11, 0.5, -0.5, 3.5],
  [3, 6, 0, 0, 0, 1.5],
];
function spawnAirplane(w: number, viewH: number): Airplane {
  const roll = Math.random() * 100;
  let cum = 0, type = 0;
  for (let i = 0; i < 5; i++) { cum += AC_WEIGHTS[i]; if (roll < cum) { type = i; break; } }
  const baseDir = rng() < 0.5 ? 0 : Math.PI;
  const spread = type === 4 ? Math.PI / 3 : Math.PI / 4;
  const angle = baseDir + rand(-spread, spread);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  let x: number, y: number;
  if (Math.abs(cos) >= Math.abs(sin)) {
    if (cos > 0) { x = -20; y = rand(viewH * 0.05, viewH * 0.7); }
    else { x = w + 20; y = rand(viewH * 0.05, viewH * 0.7); }
  } else {
    if (sin > 0) { x = rand(0, w); y = -20; }
    else { x = rand(0, w); y = viewH + 20; }
  }
  const d = AC_DEFS[type];
  const size = rand(d[0], d[1]);
  const sizeFrac = d[1] > d[0] ? (size - d[0]) / (d[1] - d[0]) : 0.5;
  const speed = d[2] + sizeFrac * (d[3] - d[2]);
  const maxDist = Math.sqrt(w * w + viewH * viewH) + 80;
  return {
    x, y, vx: cos * speed, vy: sin * speed,
    baseVx: cos * speed, baseVy: sin * speed,
    blinkPhase: rand(0, Math.PI * 2), blinkSpeed: d[4],
    strobePhase: rand(0, Math.PI * 2), strobeSpeed: d[5],
    active: true, life: 0, maxLife: maxDist / speed,
    size, type, rotorPhase: rand(0, Math.PI * 2),
    nearFactor: rand(0.3, 0.7),
  };
}

interface Satellite {
  x: number; y: number;
  vx: number; vy: number;
  brightness: number;
  active: boolean;
  life: number; maxLife: number;
}
function spawnSatellite(w: number, viewH: number): Satellite {
  const angle = rand(0, Math.PI * 2);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const speed = rand(0.14, 0.28);
  let x: number, y: number;
  if (Math.abs(cos) >= Math.abs(sin)) {
    if (cos > 0) { x = -5; y = rand(0, viewH * 0.6); }
    else { x = w + 5; y = rand(0, viewH * 0.6); }
  } else {
    if (sin > 0) { x = rand(0, w); y = -5; }
    else { x = rand(0, w); y = viewH + 5; }
  }
  const maxDist = Math.sqrt(w * w + viewH * viewH) + 20;
  return { x, y, vx: cos * speed, vy: sin * speed, brightness: rand(0.35, 0.85), active: true, life: 0, maxLife: maxDist / speed };
}

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const airplanesRef = useRef<Airplane[]>([]);
  const satellitesRef = useRef<Satellite[]>([]);
  const animRef = useRef(0);
  const isDarkRef = useRef(true);
  const timersRef = useRef({ shootingStar: 0, airplane: 0, satellite: 0 });
  const fadeInRef = useRef(0);
  const frameCountRef = useRef(0);
  const firstEffectDoneRef = useRef(false);
  const mwBlobsRef = useRef<MWBlob[]>([]);
  const mwMicroStarsRef = useRef<MWStar[]>([]);
  const lastTimeRef = useRef(0);
  const baseLSTRef = useRef(0);
  const moonRef = useRef<{ ra: number; dec: number; phase: number; isWaxing: boolean } | null>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const prevScrollFracRef = useRef(0);
  const cinematicOffsetRef = useRef(0);
  const cinematicStartRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      isDarkRef.current = getIsDark();
      const w = window.innerWidth;
      const h = window.innerHeight;

      const seed = Math.floor(Math.random() * 2147483647) + 1;
      localStorage.setItem('nightsky-seed', String(seed));
      localStorage.setItem('nightsky-dims', JSON.stringify({ w, h }));

      rng = mulberry32(seed);
      starsRef.current = initStars();
      const mw = initMWBand();
      mwBlobsRef.current = mw.blobs;
      mwMicroStarsRef.current = mw.microStars;
      rng = Math.random;

      baseLSTRef.current = GC_RA;
      moonRef.current = getMoonPosition();

      /* Cinematic sky sweep: start with virtual scroll offset that decays to 0 */
      cinematicOffsetRef.current = 0.35;
      cinematicStartRef.current = performance.now() + 300; /* brief pause before sweep */
      cloudsRef.current = [spawnCloud(w, h), spawnCloud(w, h), spawnCloud(w, h)];
      shootingStarsRef.current = [];
      airplanesRef.current = [];
      satellitesRef.current = [];
    };

    resize();
    init();

    const saveState = () => {
      try {
        localStorage.setItem('nightsky-state', JSON.stringify({
          airplanes: airplanesRef.current.filter(a => a.active).map(a => ({
            x: a.x, y: a.y, vx: a.vx, vy: a.vy,
            blinkPhase: a.blinkPhase, blinkSpeed: a.blinkSpeed,
            strobePhase: a.strobePhase, strobeSpeed: a.strobeSpeed,
            life: a.life, maxLife: a.maxLife,
            size: a.size, type: a.type, rotorPhase: a.rotorPhase
          })),
          satellites: satellitesRef.current.filter(s => s.active).map(s => ({
            x: s.x, y: s.y, vx: s.vx, vy: s.vy,
            brightness: s.brightness, life: s.life, maxLife: s.maxLife
          })),
          timers: timersRef.current,
          frameCount: frameCountRef.current,
          firstEffectDone: firstEffectDoneRef.current,
          timestamp: Date.now()
        }));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) { /* ignore */ }
    };

    const obs = new MutationObserver(() => {
      setTimeout(() => { isDarkRef.current = getIsDark(); }, 100);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 200); };
    window.addEventListener("resize", onResize);

    const onVisChange = () => {
      if (document.visibilityState === 'hidden') {
        saveState();
      } else {
        baseLSTRef.current = GC_RA;
        moonRef.current = getMoonPosition();
        shootingStarsRef.current = [];
        lastTimeRef.current = 0;
      }
    };
    const onBeforeUnload = () => saveState();
    document.addEventListener('visibilitychange', onVisChange);
    window.addEventListener('beforeunload', onBeforeUnload);


    const drawStar = (s: Star, sx: number, sy: number, altDim: number, dt: number) => {
      s.phase += s.twinkleSpeed * dt;

      if (s.burstCooldown > 0) {
        s.burstCooldown -= dt;
      } else if (s.burst <= 0 && Math.random() < s.burstChance) {
        s.burst = rand(0.5, 0.8);
        s.burstCooldown = randInt(1800, 5400);
      }
      if (s.burst > 0) s.burst = Math.max(0, s.burst - s.burstDecay * dt);

      const p = s.phase, o = s.scintOffset;
      const scint = Math.sin(p) * 0.35
        + Math.sin(p * 2.31 + o) * 0.25
        + Math.sin(p * 5.17 + o * 0.7) * 0.22
        + Math.sin(p * 11.3 + o * 1.3) * 0.18;
      const baseAlpha = (scint * 0.3 + 0.65) * s.maxAlpha;
      const burstAlpha = s.burst * (1 - s.maxAlpha * 0.3);
      const alpha = Math.min(1, (baseAlpha + burstAlpha) * altDim);
      if (alpha < 0.02) return;

      const [r, g, b] = s.color;
      const sizeBoost = 1 + s.burst * 1.8;

      /* Glow */
      const glowR = s.radius * 5 * sizeBoost;
      const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      gr.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.2})`);
      gr.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.04})`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
      ctx.fill();

      /* Sparkle crosshair */
      if (s.radius > 1 || s.burst > 0.2) {
        const sparkleAlpha = s.burst > 0.2 ? alpha * 0.5 : alpha * 0.35;
        const len = s.radius * (3.5 + s.burst * 6) * alpha;
        ctx.strokeStyle = `rgba(${r},${g},${b},${sparkleAlpha})`;
        ctx.lineWidth = 0.4 + s.burst * 0.8;
        ctx.beginPath();
        ctx.moveTo(sx - len, sy); ctx.lineTo(sx + len, sy);
        ctx.moveTo(sx, sy - len); ctx.lineTo(sx, sy + len);
        ctx.stroke();

        if (s.burst > 0.35) {
          const dLen = len * 0.6;
          ctx.strokeStyle = `rgba(${r},${g},${b},${s.burst * 0.4})`;
          ctx.lineWidth = 0.3;
          ctx.beginPath();
          ctx.moveTo(sx - dLen, sy - dLen); ctx.lineTo(sx + dLen, sy + dLen);
          ctx.moveTo(sx + dLen, sy - dLen); ctx.lineTo(sx - dLen, sy + dLen);
          ctx.stroke();
        }
      }

      const coreR = s.radius * (0.6 + s.burst * 0.6);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, coreR, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawMoon = (mx: number, my: number) => {
      const moon = moonRef.current;
      if (!moon) return;
      const mr = 12;

      const glowR = mr * 5;
      const glow = ctx.createRadialGradient(mx, my, mr * 0.8, mx, my, glowR);
      glow.addColorStop(0, "rgba(255,248,230,0.10)");
      glow.addColorStop(0.4, "rgba(255,248,230,0.03)");
      glow.addColorStop(1, "rgba(255,248,230,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mx, my, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(35,38,48,0.85)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();

      if (moon.phase < 0.01) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.clip();

      const k = moon.phase;
      const sweep = Math.abs(2 * k - 1) * mr;
      const isGibbous = k > 0.5;

      ctx.fillStyle = "rgba(255,252,240,0.92)";
      ctx.beginPath();
      if (moon.isWaxing) {
        ctx.arc(mx, my, mr, -Math.PI / 2, Math.PI / 2, false);
        ctx.ellipse(mx, my, sweep, mr, 0, Math.PI / 2, -Math.PI / 2, !isGibbous);
      } else {
        ctx.arc(mx, my, mr, Math.PI / 2, -Math.PI / 2, false);
        ctx.ellipse(mx, my, sweep, mr, 0, -Math.PI / 2, Math.PI / 2, !isGibbous);
      }
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.10;
      ctx.fillStyle = "rgba(80,80,90,1)";
      const craters: number[][] = [[-0.2, -0.3, 0.15], [0.15, 0.25, 0.12], [-0.1, 0.4, 0.1], [0.3, -0.1, 0.08]];
      for (const [ccx, ccy, cr] of craters) {
        ctx.beginPath();
        ctx.arc(mx + ccx * mr, my + ccy * mr, cr * mr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = fadeInRef.current;
      ctx.restore();
    };


    const drawShootingStar = (ss: ShootingStar, dt: number) => {
      ss.life += dt;
      ss.x += ss.vx * dt;
      ss.y += ss.vy * dt;
      if (ss.life >= ss.maxLife) { ss.active = false; return; }
      const progress = ss.life / ss.maxLife;
      const fade = progress < 0.15 ? progress / 0.15 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
      const alpha = fade * ss.brightness;
      const angle = Math.atan2(ss.vy, ss.vx);
      const tailX = ss.x - Math.cos(angle) * ss.tailLen * fade;
      const tailY = ss.y - Math.sin(angle) * ss.tailLen * fade;
      const tg = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      tg.addColorStop(0, "rgba(255,255,255,0)");
      tg.addColorStop(0.7, `rgba(255,255,255,${alpha * 0.3})`);
      tg.addColorStop(1, `rgba(255,255,255,${alpha * 0.8})`);
      ctx.strokeStyle = tg;
      ctx.lineWidth = 1.0;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(ss.x, ss.y);
      ctx.stroke();
      const hg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 3.5);
      hg.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
      hg.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.25})`);
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawAirplane = (ap: Airplane, dt: number) => {
      ap.life += dt;
      const progress = ap.life / ap.maxLife;
      const depthCurve = Math.sin(progress * Math.PI);
      const depthScale = 1.0 + ap.nearFactor * depthCurve;
      ap.vx = ap.baseVx * depthScale;
      ap.vy = ap.baseVy * depthScale;
      ap.x += ap.vx * dt;
      ap.y += ap.vy * dt;
      if (ap.life >= ap.maxLife) { ap.active = false; return; }
      ap.blinkPhase += ap.blinkSpeed * dt;
      ap.strobePhase += ap.strobeSpeed * dt;
      ap.rotorPhase += 0.3 * dt;

      const t = ap.type;
      const s = ap.size * depthScale;
      const dir = Math.atan2(ap.vy, ap.vx);
      const perp = dir + Math.PI / 2;
      const sh = AC_SHAPES[t] || AC_SHAPES[0];
      const isHeli = t === 4;
      const altFactor = 0.35 + 0.5 * Math.min(1, (ap.size - 0.4) / 1.1);
      const lightAlpha = Math.min(1, altFactor * (0.6 + 0.4 * depthCurve));

      const wingR = isHeli ? 3 * s : sh[2] * s;
      const tailDist = sh[1] * s;
      const lx = ap.x + Math.cos(perp) * wingR;
      const ly = ap.y + Math.sin(perp) * wingR;
      const rx = ap.x - Math.cos(perp) * wingR;
      const ry = ap.y - Math.sin(perp) * wingR;
      const tailX = ap.x - Math.cos(dir) * tailDist;
      const tailY = ap.y - Math.sin(dir) * tailDist;

      let strobeOn = false;
      if (ap.strobeSpeed > 0) {
        const sp = ap.strobePhase % (Math.PI * 2);
        strobeOn = sp > 5.8 && sp < 5.95;
      }

      ctx.fillStyle = 'rgba(5,8,15,0.85)';
      ctx.strokeStyle = 'rgba(5,8,15,0.85)';
      ctx.lineWidth = Math.max(0.8, 1.0 * s);
      ctx.lineCap = 'round';

      if (isHeli) {
        const bodyL = 4 * s, bodyW = 2 * s;
        const tBX = ap.x - Math.cos(dir) * 6 * s;
        const tBY = ap.y - Math.sin(dir) * 6 * s;
        ctx.beginPath(); ctx.ellipse(ap.x, ap.y, bodyL, bodyW, dir, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ap.x - Math.cos(dir) * bodyL, ap.y - Math.sin(dir) * bodyL); ctx.lineTo(tBX, tBY); ctx.stroke();
        const trSpan = 1.5 * s;
        ctx.beginPath(); ctx.moveTo(tBX + Math.cos(perp) * trSpan, tBY + Math.sin(perp) * trSpan); ctx.lineTo(tBX - Math.cos(perp) * trSpan, tBY - Math.sin(perp) * trSpan); ctx.stroke();
        const rotorR = 7 * s;
        ctx.strokeStyle = 'rgba(5,8,15,0.3)';
        ctx.beginPath(); ctx.arc(ap.x, ap.y, rotorR, 0, Math.PI * 2); ctx.stroke();
        const rAng = ap.rotorPhase;
        ctx.beginPath(); ctx.moveTo(ap.x + Math.cos(rAng) * rotorR, ap.y + Math.sin(rAng) * rotorR); ctx.lineTo(ap.x - Math.cos(rAng) * rotorR, ap.y - Math.sin(rAng) * rotorR); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ap.x + Math.cos(rAng + Math.PI / 2) * rotorR, ap.y + Math.sin(rAng + Math.PI / 2) * rotorR); ctx.lineTo(ap.x - Math.cos(rAng + Math.PI / 2) * rotorR, ap.y - Math.sin(rAng + Math.PI / 2) * rotorR); ctx.stroke();
      } else {
        const fuseF = sh[0], fuseR = sh[1], wSpan = sh[2], wSweep = sh[3], wBack = sh[4], tSpan = sh[5];
        const nX = ap.x + Math.cos(dir) * fuseF * s, nY = ap.y + Math.sin(dir) * fuseF * s;
        const tX = ap.x - Math.cos(dir) * fuseR * s, tY = ap.y - Math.sin(dir) * fuseR * s;
        ctx.beginPath(); ctx.moveTo(nX, nY); ctx.lineTo(tX, tY); ctx.stroke();
        if (wSpan > 0) {
          const wRX = ap.x - Math.cos(dir) * wBack * s, wRY = ap.y - Math.sin(dir) * wBack * s;
          const wLTX = wRX + Math.cos(perp) * wSpan * s - Math.cos(dir) * wSweep * s;
          const wLTY = wRY + Math.sin(perp) * wSpan * s - Math.sin(dir) * wSweep * s;
          const wRTX = wRX - Math.cos(perp) * wSpan * s - Math.cos(dir) * wSweep * s;
          const wRTY = wRY - Math.sin(perp) * wSpan * s - Math.sin(dir) * wSweep * s;
          ctx.beginPath(); ctx.moveTo(wLTX, wLTY); ctx.lineTo(wRX, wRY); ctx.lineTo(wRTX, wRTY); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        if (tSpan > 0) {
          const tsLX = tX + Math.cos(perp) * tSpan * s, tsLY = tY + Math.sin(perp) * tSpan * s;
          const tsRX = tX - Math.cos(perp) * tSpan * s, tsRY = tY - Math.sin(perp) * tSpan * s;
          ctx.beginPath(); ctx.moveTo(tsLX, tsLY); ctx.lineTo(tX, tY); ctx.lineTo(tsRX, tsRY); ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        if (t === 3) {
          ctx.fillStyle = 'rgba(5,8,15,0.3)';
          const pDist = wSpan * 0.4 * s;
          const wRX = ap.x - Math.cos(dir) * wBack * s, wRY = ap.y - Math.sin(dir) * wBack * s;
          for (const sign of [1, -1]) {
            const pX = wRX + Math.cos(perp) * pDist * sign, pY = wRY + Math.sin(perp) * pDist * sign;
            ctx.beginPath(); ctx.arc(pX, pY, 2 * s, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      const drawLight = (x: number, y: number, coreR: number, glowR: number, r: number, g: number, b: number, a: number) => {
        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(0.15, `rgba(${r},${g},${b},${a * 0.7})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.25})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, glowR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)},${a})`;
        ctx.beginPath(); ctx.arc(x, y, coreR, 0, Math.PI * 2); ctx.fill();
      };

      drawLight(lx, ly, Math.max(0.8, 1.0 * s), Math.max(3, 4 * s), 255, 30, 30, lightAlpha);
      drawLight(rx, ry, Math.max(0.8, 1.0 * s), Math.max(3, 4 * s), 30, 255, 30, lightAlpha);
      drawLight(tailX, tailY, Math.max(0.6, 0.7 * s), Math.max(2.5, 3 * s), 255, 255, 255, lightAlpha * 0.9);
      const beaconVal = Math.sin(ap.blinkPhase);
      if (beaconVal > 0.5) {
        const bAlpha = (beaconVal - 0.5) * 2 * lightAlpha;
        drawLight(ap.x, ap.y, Math.max(0.8, 1.0 * s), Math.max(4, 5 * s), 255, 20, 20, bAlpha);
      }
      if (strobeOn) {
        const stPts: [number, number][] = isHeli
          ? [[ap.x + Math.cos(perp) * 2 * s, ap.y + Math.sin(perp) * 2 * s],
             [ap.x - Math.cos(perp) * 2 * s, ap.y - Math.sin(perp) * 2 * s]]
          : [[lx, ly], [rx, ry]];
        for (const [sx2, sy2] of stPts) {
          drawLight(sx2, sy2, Math.max(1.0, 1.2 * s), Math.max(5, 7 * s), 255, 255, 255, lightAlpha);
        }
      }
    };

    const drawSatellite = (sat: Satellite, dt: number) => {
      sat.life += dt;
      sat.x += sat.vx * dt;
      sat.y += sat.vy * dt;
      if (sat.life >= sat.maxLife) { sat.active = false; return; }
      const alpha = sat.brightness;
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath(); ctx.arc(sat.x, sat.y, 1.1, 0, Math.PI * 2); ctx.fill();
      const sg = ctx.createRadialGradient(sat.x, sat.y, 0, sat.x, sat.y, 5);
      sg.addColorStop(0, `rgba(255,255,255,${alpha * 0.25})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(sat.x, sat.y, 5, 0, Math.PI * 2); ctx.fill();
    };

    const drawClouds = (w: number, h: number, dt: number) => {
      const clouds = cloudsRef.current;
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.vx * dt;
        if (c.vx > 0 && c.x > w + c.width) { clouds[i] = spawnCloud(w, h); clouds[i].x = -clouds[i].width; continue; }
        if (c.vx < 0 && c.x < -c.width) { clouds[i] = spawnCloud(w, h); clouds[i].x = w + clouds[i].width * 0.1; continue; }
        for (let j = 0; j < 5; j++) {
          const frac = j / 4;
          const bx = c.x + frac * c.width;
          const by = c.y + Math.sin(c.seed + frac * 5) * c.height * 0.5;
          const bw = c.width * 0.3;
          const bh = c.height * (0.7 + 0.3 * Math.sin(c.seed + j));
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, bw);
          g.addColorStop(0, `rgba(180,190,210,${c.opacity})`);
          g.addColorStop(0.5, `rgba(180,190,210,${c.opacity * 0.4})`);
          g.addColorStop(1, "rgba(180,190,210,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(bx, by, bw, bh, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const animate = (now: number) => {
      const dt = lastTimeRef.current ? Math.min((now - lastTimeRef.current) / 16.667, 3) : 1;
      lastTimeRef.current = now;
      const w = window.innerWidth;
      const viewH = window.innerHeight;
      ctx.clearRect(0, 0, w, viewH);

      if (!isDarkRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      fadeInRef.current = Math.min(1, fadeInRef.current + 0.014);
      ctx.globalAlpha = fadeInRef.current;

      const scrollY = window.scrollY;
      const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFrac = Math.min(1, scrollY / scrollMax);

      /* Cinematic sky sweep: virtual offset decays from initial value to 0 */
      if (cinematicOffsetRef.current > 0.001) {
        const elapsed = (performance.now() - cinematicStartRef.current) / 1000;
        const dur = 5.0;
        if (elapsed < dur) {
          const t = elapsed / dur;
          /* Ease-out only: starts at full speed, decelerates smoothly to land */
          const ease = 1 - Math.pow(1 - t, 4);
          cinematicOffsetRef.current = (1 - ease) * 0.35;
        } else {
          cinematicOffsetRef.current = 0;
        }
      }
      const effectiveScrollFrac = Math.min(1, scrollFrac + cinematicOffsetRef.current);

      const lstDeg = ((baseLSTRef.current + effectiveScrollFrac * LST_SCROLL_RANGE) % 360 + 360) % 360;
      const cx = w / 2;
      const cy = viewH / 2;
      const scale = Math.max(w, viewH) * 0.32;

      const scrollDelta = effectiveScrollFrac - prevScrollFracRef.current;
      prevScrollFracRef.current = effectiveScrollFrac;
      if (Math.abs(scrollDelta) > 0.0001) {
        const dLST = scrollDelta * LST_SCROLL_RANGE * DEG;
        const dx = -dLST * scale;
        const dy = dLST * scale * 0.3;
        for (const ap of airplanesRef.current) {
          ap.x += dx; ap.y += dy;
        }
        for (const sat of satellitesRef.current) {
          sat.x += dx; sat.y += dy;
        }
        for (const ss of shootingStarsRef.current) {
          ss.x += dx; ss.y += dy;
        }
      }

      const mwBlobs = mwBlobsRef.current;
      for (let i = 0; i < mwBlobs.length; i++) {
        const bl = mwBlobs[i];
        const aa = eqToAltAz(bl.ra, bl.dec, lstDeg);
        if (aa.alt < -5 * DEG) continue;
        const p = projectToScreen(aa.alt, aa.az, cx, cy, scale);
        if (!p.visible) continue;
        if (p.sx < -200 || p.sx > w + 200 || p.sy < -200 || p.sy > viewH + 200) continue;
        const aa2 = eqToAltAz(bl.ra2, bl.dec2, lstDeg);
        const p2 = projectToScreen(aa2.alt, aa2.az, cx, cy, scale);
        const tilt = p2.visible ? Math.atan2(p2.sy - p.sy, p2.sx - p.sx) : 0;
        const r = (bl.angSize / 90) * scale;
        const [cr, cg, cb] = bl.color;
        const a = bl.alpha * (aa.alt > 0 ? Math.min(1, aa.alt / (8 * DEG)) : 0.3);
        if (a < 0.001) continue;
        const gr = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r);
        gr.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`);
        gr.addColorStop(0.4, `rgba(${cr},${cg},${cb},${a * 0.55})`);
        gr.addColorStop(0.7, `rgba(${cr},${cg},${cb},${a * 0.18})`);
        gr.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.ellipse(p.sx, p.sy, r, r * bl.aspect, tilt, 0, Math.PI * 2);
        ctx.fill();
      }
      const mwStars = mwMicroStarsRef.current;
      for (let i = 0; i < mwStars.length; i++) {
        const ms = mwStars[i];
        const aa = eqToAltAz(ms.ra, ms.dec, lstDeg);
        if (aa.alt < 0) continue;
        const p = projectToScreen(aa.alt, aa.az, cx, cy, scale);
        if (!p.visible) continue;
        if (p.sx < -5 || p.sx > w + 5 || p.sy < -5 || p.sy > viewH + 5) continue;
        const dim = Math.min(1, aa.alt / (10 * DEG));
        const [mr, mg, mb] = ms.color;
        ctx.fillStyle = `rgba(${mr},${mg},${mb},${ms.alpha * dim})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, ms.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const aa = eqToAltAz(s.ra, s.dec, lstDeg);
        if (aa.alt < -2 * DEG) continue;
        const p = projectToScreen(aa.alt, aa.az, cx, cy, scale);
        if (!p.visible) continue;
        if (p.sx < -30 || p.sx > w + 30 || p.sy < -30 || p.sy > viewH + 30) continue;
        const altDim = aa.alt > 0 ? Math.min(1, aa.alt / (15 * DEG)) * 0.3 + 0.7 : 0.4;
        drawStar(s, p.sx, p.sy, altDim, dt);
      }

      const moon = moonRef.current;
      if (moon) {
        const mAA = eqToAltAz(moon.ra, moon.dec, lstDeg);
        if (mAA.alt > -2 * DEG) {
          const mp = projectToScreen(mAA.alt, mAA.az, cx, cy, scale);
          if (mp.visible && mp.sx > -60 && mp.sx < w + 60 && mp.sy > -60 && mp.sy < viewH + 60) {
            drawMoon(mp.sx, mp.sy);
          }
        }
      }

      frameCountRef.current++;
      if (frameCountRef.current % 60 === 0) saveState();

      if (!firstEffectDoneRef.current) {
        if (frameCountRef.current >= 180) {
          firstEffectDoneRef.current = true;
          shootingStarsRef.current.push({
            x: rand(w * 0.2, w * 0.6), y: rand(viewH * 0.05, viewH * 0.25),
            vx: Math.cos(0.5) * 7.92, vy: Math.sin(0.5) * 7.92, speed: 7.92,
            life: 0, maxLife: 80, tailLen: 90, brightness: 1, active: true,
          });
        }
      } else {
        timersRef.current.shootingStar += dt;
        if (timersRef.current.shootingStar > rand(600, 1800)) {
          timersRef.current.shootingStar = 0;
          shootingStarsRef.current.push(spawnShootingStar(w, viewH));
        }
        timersRef.current.airplane += dt;
        if (timersRef.current.airplane > rand(300, 700) && airplanesRef.current.length < 2) {
          timersRef.current.airplane = 0;
          const existing = airplanesRef.current.filter(a => a.active).map(a => a.type);
          let ap = spawnAirplane(w, viewH);
          for (let tries = 0; tries < 5 && existing.includes(ap.type); tries++) ap = spawnAirplane(w, viewH);
          airplanesRef.current.push(ap);
        }
        timersRef.current.satellite += dt;
        if (timersRef.current.satellite > rand(360, 840) && satellitesRef.current.length === 0) {
          timersRef.current.satellite = 0;
          satellitesRef.current.push(spawnSatellite(w, viewH));
        }
      }

      airplanesRef.current.forEach(ap => drawAirplane(ap, dt));
      airplanesRef.current = airplanesRef.current.filter(a => a.active);

      shootingStarsRef.current.forEach(ss => drawShootingStar(ss, dt));
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.active);

      drawClouds(w, viewH, dt);

      satellitesRef.current.forEach(sat => drawSatellite(sat, dt));
      satellitesRef.current = satellitesRef.current.filter(s => s.active);

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      obs.disconnect();
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
