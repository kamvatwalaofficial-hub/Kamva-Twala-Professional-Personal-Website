// Kamva Twala — site behaviour. Kept in this file (no inline scripts) so the
// Content Security Policy in index.html can block all inline code.
document.documentElement.classList.add("js");

// ------------------------------------------------------------------ skills by layer
const LAYERS = {
  code: {
    note: "Writing the software itself",
    skills: ["C# and ASP.NET Core", "React", "Tailwind CSS", "Java", "Python", "JavaScript", "REST APIs with Swagger", "SQL Server"]
  },
  pipeline: {
    note: "Getting code from commit to release safely",
    skills: ["Git and GitHub", "GitHub Actions CI/CD", "Dependency scanning (npm audit, Dependabot)", "Secrets kept out of source control", "Bash scripting"]
  },
  infra: {
    note: "The systems the software runs on, and how they are tested",
    skills: ["Linux command line", "Kali Linux", "Nmap", "Wireshark", "Burp Suite", "Penetration testing practice", "FIDO2 / WebAuthn"]
  },
  people: {
    note: "Leading the people and decisions that keep it secure",
    skills: ["Project leadership", "Information security management", "Community security assessments", "Security awareness", "Teaching and mentoring", "UX wireframing"]
  }
};
const ORDER = ["people", "infra", "pipeline", "code"]; // outside to inside

const tabs = Array.from(document.querySelectorAll(".layer-tabs [role=tab]"));
const panel = document.getElementById("panel");
const readoutCells = Array.from(document.querySelectorAll(".readout [data-layer]"));
let selectedLayer = "code";
let redraw = () => {};

function select(layer, focus) {
  selectedLayer = layer;
  tabs.forEach(t => {
    const on = t.dataset.layer === layer;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    if (on) {
      panel.setAttribute("aria-labelledby", t.id);
      if (focus) t.focus();
    }
  });
  readoutCells.forEach(c => c.classList.toggle("is-selected", c.dataset.layer === layer));
  const d = LAYERS[layer];
  const p = document.createElement("p");
  p.textContent = d.note;
  const ul = document.createElement("ul");
  d.skills.forEach(s => { const li = document.createElement("li"); li.textContent = s; ul.appendChild(li); });
  panel.replaceChildren(p, ul);
  redraw();
}

tabs.forEach(t => {
  t.addEventListener("click", () => select(t.dataset.layer));
  t.addEventListener("keydown", e => {
    const i = tabs.indexOf(t);
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); select(tabs[n].dataset.layer, true); }
  });
});

// ------------------------------------------------------------------ defence-in-depth simulation
(function defence() {
  const canvas = document.getElementById("defence-canvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  const color = name => css.getPropertyValue(name).trim();
  const C = { bg: color("--bg"), line: color("--line"), scan: color("--scan"), signal: color("--signal"),
              threat: color("--threat"), ink: color("--ink"), soft: color("--ink-soft") };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Ring radii as a fraction of half the canvas, and the chance each layer stops a threat that reaches it.
  const RINGS = [
    { layer: "people",   label: "People & process", r: 0.94, stop: 0.3 },
    { layer: "infra",    label: "Infrastructure",   r: 0.71, stop: 0.36 },
    { layer: "pipeline", label: "Pipeline",         r: 0.48, stop: 0.45 },
    { layer: "code",     label: "Code",             r: 0.25, stop: 1 }
  ];
  const counts = { people: 0, infra: 0, pipeline: 0, code: 0 };
  const countEls = Object.fromEntries(ORDER.map(l => [l, document.getElementById("count-" + l)]));
  let packets = [], flashes = [], size = 0, dpr = 1, sweep = 0, last = 0, spawnTimer = 0, running = false, visible = true;

  function resize() {
    const w = canvas.getBoundingClientRect().width || 480;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    size = w;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(w * dpr);
    draw();
  }

  function spawn() {
    const a = Math.random() * Math.PI * 2;
    packets.push({ a, r: 1.04, v: 0.2 + Math.random() * 0.14, passed: 0 });
  }

  function step(dt) {
    sweep = (sweep + dt * 0.9) % (Math.PI * 2);
    spawnTimer -= dt;
    if (spawnTimer <= 0) { spawn(); spawnTimer = 0.25 + Math.random() * 0.35; }
    for (const p of packets) {
      p.r -= p.v * dt;
      const ring = RINGS[p.passed];
      if (ring && p.r <= ring.r) {
        if (Math.random() < ring.stop) {
          p.dead = true;
          counts[ring.layer]++;
          flashes.push({ a: p.a, r: ring.r, t: 0, layer: ring.layer });
          const el = countEls[ring.layer];
          if (el) el.textContent = counts[ring.layer];
        } else {
          p.passed++;
        }
      }
    }
    packets = packets.filter(p => !p.dead);
    for (const f of flashes) f.t += dt;
    flashes = flashes.filter(f => f.t < 0.6);
  }

  function draw() {
    const W = canvas.width, h = W / 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, W);
    ctx.translate(h, h);
    const R = h * 0.98;

    // radar sweep
    if (!reduceMotion && ctx.createConicGradient) {
      const g = ctx.createConicGradient(sweep, 0, 0);
      g.addColorStop(0, "rgba(79, 209, 197, 0.22)");
      g.addColorStop(0.12, "rgba(79, 209, 197, 0)");
      g.addColorStop(1, "rgba(79, 209, 197, 0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, R * RINGS[0].r, 0, Math.PI * 2); ctx.fill();
    }

    // rings, outside in
    RINGS.forEach(ring => {
      const sel = ring.layer === selectedLayer;
      ctx.beginPath();
      ctx.arc(0, 0, R * ring.r, 0, Math.PI * 2);
      if (sel) { ctx.fillStyle = "rgba(79, 209, 197, 0.08)"; ctx.fill(); }
      ctx.lineWidth = (sel ? 2.5 : 1.25) * dpr;
      ctx.strokeStyle = sel ? C.scan : "rgba(79, 209, 197, 0.35)";
      ctx.shadowColor = C.scan; ctx.shadowBlur = sel ? 14 * dpr : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // core
    ctx.beginPath(); ctx.arc(0, 0, R * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = C.scan; ctx.shadowColor = C.scan; ctx.shadowBlur = 18 * dpr; ctx.fill(); ctx.shadowBlur = 0;

    // labels, set just inside the top of each ring
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    RINGS.forEach(ring => {
      const sel = ring.layer === selectedLayer;
      ctx.font = `${sel ? 700 : 500} ${Math.max(10, size * 0.03) * dpr}px "IBM Plex Mono", ui-monospace, monospace`;
      ctx.fillStyle = sel ? C.ink : C.soft;
      ctx.fillText(ring.label, 0, -R * ring.r + 6 * dpr);
    });

    // threats
    for (const p of packets) {
      const x = Math.cos(p.a) * R * p.r, y = Math.sin(p.a) * R * p.r;
      ctx.beginPath(); ctx.arc(x, y, 3.2 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = C.threat; ctx.shadowColor = C.threat; ctx.shadowBlur = 10 * dpr; ctx.fill(); ctx.shadowBlur = 0;
      // short trail
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(Math.cos(p.a) * R * (p.r + 0.05), Math.sin(p.a) * R * (p.r + 0.05));
      ctx.strokeStyle = "rgba(255, 107, 91, 0.45)"; ctx.lineWidth = 2 * dpr; ctx.stroke();
    }

    // blocked: a shield flash where the layer stopped the threat
    for (const f of flashes) {
      const k = f.t / 0.6, x = Math.cos(f.a) * R * f.r, y = Math.sin(f.a) * R * f.r;
      ctx.beginPath(); ctx.arc(x, y, (4 + 14 * k) * dpr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(242, 179, 61, ${1 - k})`; ctx.lineWidth = 2 * dpr; ctx.stroke();
    }
  }
  redraw = draw;

  function frame(t) {
    if (!running) return;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    step(dt);
    draw();
    requestAnimationFrame(frame);
  }
  function start() { if (running || reduceMotion || !visible || document.hidden) return; running = true; last = 0; requestAnimationFrame(frame); }
  function stop() { running = false; }

  // Select a layer by tapping its ring.
  canvas.addEventListener("click", e => {
    const b = canvas.getBoundingClientRect();
    const dx = e.clientX - b.left - b.width / 2, dy = e.clientY - b.top - b.height / 2;
    const d = Math.hypot(dx, dy) / (b.width / 2 * 0.98);
    const hit = [...RINGS].reverse().find(r => d <= r.r);
    if (hit) select(hit.layer);
  });

  // Only animate while the hero is on screen and the tab is visible.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }).observe(canvas);
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener("resize", resize);

  resize();
  if (reduceMotion) {
    // A still picture: a few threats caught at each layer, no movement.
    flashes = []; packets = [
      { a: 0.6, r: 1.02 }, { a: 2.4, r: 0.83 }, { a: 4.1, r: 0.6 }, { a: 5.3, r: 0.36 }
    ];
    draw();
  } else {
    start();
  }
})();

select("code");

// ------------------------------------------------------------------ navbar: menu + scroll state
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-header nav");

if (header) {
  // Give the header a solid, blurred background once the page is scrolled.
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (toggle && nav && header) {
  const setOpen = open => {
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });
  // Close when tapping outside the header.
  document.addEventListener("click", e => {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setOpen(false);
  });
}

// ------------------------------------------------------------------ navbar: grouped dropdowns
(function navGroups() {
  const groups = Array.from(document.querySelectorAll(".nav-group"));
  if (!groups.length) return;
  const desktop = window.matchMedia("(min-width: 60.001rem)");

  const setGroup = (g, open) => {
    g.classList.toggle("is-open", open);
    g.querySelector(".nav-group-btn").setAttribute("aria-expanded", String(open));
  };
  const closeAll = except => groups.forEach(g => { if (g !== except) setGroup(g, false); });

  groups.forEach(g => {
    const btn = g.querySelector(".nav-group-btn");
    btn.addEventListener("click", () => {
      const open = !g.classList.contains("is-open");
      if (desktop.matches) closeAll(g);   // one open at a time on desktop
      setGroup(g, open);
    });
    // Mouse: open on hover, close on leave (desktop only).
    g.addEventListener("mouseenter", () => { if (desktop.matches) { closeAll(g); setGroup(g, true); } });
    g.addEventListener("mouseleave", () => { if (desktop.matches) setGroup(g, false); });
    // Keyboard: close the group once focus leaves it (desktop only).
    g.addEventListener("focusout", e => {
      if (desktop.matches && !g.contains(e.relatedTarget)) setGroup(g, false);
    });
    // Selecting a destination closes its group.
    g.querySelectorAll(".nav-menu a").forEach(a => a.addEventListener("click", () => setGroup(g, false)));
  });

  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(null); });
  document.addEventListener("click", e => { if (!e.target.closest(".nav-group")) closeAll(null); });
  desktop.addEventListener("change", () => closeAll(null));
})();

// ------------------------------------------------------------------ highlight the section in view
const navLinks = Array.from(document.querySelectorAll('.site-header nav a[href^="#"]'));
const sections = navLinks.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const navGroupEls = Array.from(document.querySelectorAll(".nav-group"));
if ("IntersectionObserver" in window && sections.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + entry.target.id));
      navLinks.forEach(a => { if (a.hasAttribute("aria-current")) a.setAttribute("aria-current", "true"); });
      // Light up the parent group whose section is in view.
      navGroupEls.forEach(g => g.classList.toggle("is-active", !!g.querySelector('a[aria-current="true"]')));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => io.observe(s));
}

// ------------------------------------------------------------------ media card fallback
// If a cover photo fails to load, remove it so the coloured cover shows instead.
document.querySelectorAll(".press-cover img").forEach(img => {
  const drop = () => img.remove();
  if (img.complete && img.naturalWidth === 0) drop();
  else img.addEventListener("error", drop, { once: true });
});

document.getElementById("year").textContent = new Date().getFullYear();

// ------------------------------------------------------------------ skills filter + search
(function skills() {
  const section = document.getElementById("skills");
  if (!section) return;
  const filters = Array.from(section.querySelectorAll(".skill-filter"));
  const groups = Array.from(section.querySelectorAll(".skill-group"));
  const search = document.getElementById("skill-search-input");
  const status = section.querySelector(".skill-status");
  const empty = section.querySelector(".skill-empty");
  const clear = document.getElementById("skill-clear");
  let category = "all";

  function apply() {
    const q = (search.value || "").trim().toLowerCase();
    let shown = 0;
    groups.forEach(group => {
      const inCategory = category === "all" || group.dataset.category === category;
      let groupVisible = 0;
      group.querySelectorAll(".skill").forEach(skill => {
        const hay = (skill.dataset.name + " " + skill.textContent).toLowerCase();
        const match = inCategory && (q === "" || hay.includes(q));
        skill.hidden = !match;
        if (match) groupVisible++;
      });
      group.hidden = groupVisible === 0;
      shown += groupVisible;
    });
    empty.hidden = shown !== 0;
    status.textContent = shown + (shown === 1 ? " skill shown" : " skills shown");
  }

  filters.forEach(btn => btn.addEventListener("click", () => {
    category = btn.dataset.filter;
    filters.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
    apply();
  }));
  search.addEventListener("input", apply);
  if (clear) clear.addEventListener("click", () => { search.value = ""; search.focus(); apply(); });
  apply();
})();
