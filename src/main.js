import gsap from "gsap";
import "./style.css";

const WORDS = [
  // calm
  "keep",
  "calm",
  "stay",
  "positive",
  "and",
  "continue",
  "slow",
  "breathe",
  "soft",
  "mind",
  "still",
  "✦",
  "Π",
  "zen",
  "Π",

  // high energy
  "go",
  "louder",
  "faster",
  "burn",
  "bright",
  "never",
  "stop",
  "moving",
  "⚡",
  "Π",
  "vroom",

  // criticize
  "people",
  "are",
  "nothing",
  "just",
  "judges",
  "in",
  "a",
  "society",
  "of",
  "opinions",
  "¯\\_(ツ)_/¯",
  "lol",
  "hmm",

  // development
  "ship",
  "it",
  "then",
  "refactor",
  "later",
  "bug",
  "is",
  "a",
  "feature",
  "{ }",
  "</>",
  "404",

  // ui / ux
  "good",
  "ux",
  "is",
  "invisible",
  "bad",
  "ui",
  "is",
  "loud",
  "pixels",
  "have",
  "feelings",
  "Π",
  "px",
  "kern",

  // gaming
  "press",
  "start",
  "one",
  "more",
  "round",
  "respawn",
  "level",
  "up",
  "gg",
  "Π",
  "▲●■",
  "+1",
  "xp",

  // focus
  "high",
  "energy",
  "low",
  "ego",
  "pure",
  "focus",
  "create",
  "break",
  "rules",
  "repeat",
  "∞",
  "zzz",
  "???",

  // build
  "build",
  "things",
  "that",
  "matter",
  "not",
  "just",
  "noise",
  "※",
  "beep",
];

const THEMES = {
  dark: { bg: "#111111", fg: "#f4f1ea" },
  light: { bg: "#f0eadb", fg: "#0b0b0f" },
  // violet: { bg: "#1a0f3d", fg: "#f4f1ea" },
  violet: { bg: "#083D2A", fg: "#EED6C8" },
};

const COLOR_PAIRS = [
  { name: "acid lime", fg: "#0b0b0f", bg: "#c6ff3d", blockedIn: [] },
  { name: "hot pink", fg: "#ffe9f3", bg: "#ff2e88", blockedIn: [] },
  { name: "amber", fg: "#1a1200", bg: "#ffb703", blockedIn: [] },
  { name: "mint", fg: "#072b2b", bg: "#7cf5d4", blockedIn: [] },
  { name: "sky", fg: "#0a2540", bg: "#9ad1ff", blockedIn: [] },
  { name: "tangerine", fg: "#fffbe6", bg: "#ff5a1f", blockedIn: [] },
  { name: "ink cyan", fg: "#00e5ff", bg: "#0b0b0f", blockedIn: ["dark"] },
  { name: "paper", fg: "#1a1a1a", bg: "#f4f1ea", blockedIn: ["light"] },
  { name: "blush", fg: "#ff4d6d", bg: "#fff0f3", blockedIn: ["light"] },
  { name: "butter", fg: "#2b1a00", bg: "#f6e27a", blockedIn: ["light"] },
  { name: "forest glow", fg: "#b8ff9f", bg: "#0f2b1a", blockedIn: ["dark"] },
  { name: "wine", fg: "#ffd6a5", bg: "#2a0f1f", blockedIn: ["dark", "violet"] },
  { name: "deep indigo", fg: "#f4f1ea", bg: "#2b1b6b", blockedIn: ["violet"] },
  {
    name: "electric violet",
    fg: "#ffffff",
    bg: "#6c3bff",
    blockedIn: ["violet"],
  },
];

let currentTheme = "dark";
let lastPair = null;

function pickPair(theme) {
  const pool = COLOR_PAIRS.filter(
    (p) => !p.blockedIn.includes(theme) && p !== lastPair,
  );
  return (lastPair = pool[Math.floor(Math.random() * pool.length)]);
}

const LastMouse = {
  x: 0,
  y: 0,
};

const Mouse = {
  x: 0,
  y: 0,
};

let LastTime = 0;
let CurrentTime = 0;

let ItemIdx = 0;

const Main = document.querySelector("main");

// ---------- theme buttons ----------
const Icons = [...document.querySelectorAll(".theme-icons .icon")];
const themeNames = Object.keys(THEMES); // dark, light, violet -> icon 0, 1, 2

function applyTheme(name, instant = false) {
  currentTheme = name;
  const { bg, fg } = THEMES[name];

  gsap.to(Main, {
    backgroundColor: bg,
    color: fg,
    duration: instant ? 0 : 0.4,
    ease: "power2.out",
  });

  Icons.forEach((icon, i) =>
    icon.classList.toggle("active", themeNames[i] === name),
  );
}

Icons.forEach((icon, i) => {
  icon.querySelector(".icon-bg").style.background = THEMES[themeNames[i]].bg;
  icon.addEventListener("click", () => applyTheme(themeNames[i]));
});

applyTheme("dark", true);

// ---------- no-spawn zone around the name + theme buttons ----------
const NO_SPAWN_RADIUS = 60;
const guardEls = [document.querySelector("nav > a"), ...Icons];
let guardRects = [];

function measureGuards() {
  guardRects = guardEls.map((el) => el.getBoundingClientRect());
}
measureGuards();
window.addEventListener("resize", measureGuards);

// distance from the cursor to the nearest edge of each element
function nearGuard(x, y) {
  return guardRects.some((r) => {
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.hypot(dx, dy) < NO_SPAWN_RADIUS;
  });
}

// ---------- mouse trail ----------
window.addEventListener("mousemove", (e) => {
  Mouse.x = e.clientX;
  Mouse.y = e.clientY;

  CurrentTime = performance.now();
  const deltaTime = CurrentTime - LastTime;

  const Dx = Mouse.x - LastMouse.x;
  const Dy = Mouse.y - LastMouse.y;

  const D = Math.sqrt(Dx * Dx + Dy * Dy);
  const blocked = nearGuard(Mouse.x, Mouse.y);

  if (!blocked && (D > 36 || deltaTime > 250)) {
    const word = WORDS[ItemIdx];
    const colorPair = pickPair(currentTheme);

    const TextItem = document.createElement("div");
    TextItem.classList.add("text-item");

    const Dot = document.createElement("div");
    Dot.classList.add("dot");

    const para = document.createElement("p");
    para.textContent = word;

    const Rotation = Math.random() * 20 - 10;

    gsap.set(TextItem, {
      x: Mouse.x,
      y: Mouse.y,
      xPercent: -50, // centre the chip on the cursor
      yPercent: -50,
      scale: 0,
      rotation: Rotation * 0.4,
      opacity: 0,
      color: colorPair.fg,
      backgroundColor: colorPair.bg,
      pointerEvents: "none",
    });

    gsap.set(TextItem, {
      x: Mouse.x,
      y: Mouse.y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      rotation: Rotation, // final rotation set once, not animated
      opacity: 0,
      color: colorPair.fg,
      backgroundColor: colorPair.bg,
      pointerEvents: "none",
      force3D: true, // keep it on its own GPU layer the whole time
    });

    const tl = gsap.timeline({
      defaults: { force3D: true },
      onComplete() {
        tl.kill();
        TextItem.remove();
      },
    });

    tl.to(TextItem, {
      scale: 1,
      duration: 1.05,
      ease: "power3.out", // smooth settle, no overshoot wobble
    })
      .to(TextItem, { opacity: 1, duration: 0.2, ease: "power1.out" }, 0)
      .to(TextItem, {
        scale: 0,
        duration: 0.5,
        ease: "power3.in",
      });
    TextItem.appendChild(Dot);
    TextItem.appendChild(para);

    Main.appendChild(TextItem);

    LastTime = CurrentTime;
    ItemIdx++;
    ItemIdx = ItemIdx % WORDS.length;
  }

  LastMouse.x = Mouse.x;
  LastMouse.y = Mouse.y;
});
