// Skills mapped onto the defence-in-depth layers
const LAYERS = {
  code: {
    note: "Writing the software itself",
    skills: ["C# and ASP.NET Core", "React", "Tailwind CSS", "Java", "REST APIs with Swagger", "SQL Server"]
  },
  pipeline: {
    note: "Getting code from commit to release safely",
    skills: ["Git and GitHub", "Secrets kept out of source control", "Bash scripting", "Code review"]
  },
  infra: {
    note: "The systems the software runs on, and how they are tested",
    skills: ["Linux command line", "Kali Linux", "Penetration testing practice", "FIDO2 / WebAuthn"]
  },
  people: {
    note: "The humans who build and use it",
    skills: ["Project management", "UX wireframing", "Security awareness", "Teaching and mentoring"]
  }
};
const ORDER = ["code", "pipeline", "infra", "people"];

const tabs = Array.from(document.querySelectorAll(".layer-tabs [role=tab]"));
const rings = Array.from(document.querySelectorAll(".ring"));
const panel = document.getElementById("panel");

function select(layer, focus) {
  const idx = ORDER.indexOf(layer);
  tabs.forEach(t => {
    const on = t.dataset.layer === layer;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    if (on) {
      panel.setAttribute("aria-labelledby", t.id);
      if (focus) t.focus();
    }
  });
  rings.forEach(r => {
    const rIdx = ORDER.indexOf(r.dataset.layer);
    r.classList.toggle("active", rIdx === idx);
    r.classList.toggle("inside", rIdx < idx);
  });
  const d = LAYERS[layer];
  panel.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = d.note;
  const ul = document.createElement("ul");
  d.skills.forEach(s => { const li = document.createElement("li"); li.textContent = s; ul.appendChild(li); });
  panel.append(p, ul);
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
rings.forEach(r => r.addEventListener("click", () => select(r.dataset.layer)));

select("code");
document.getElementById("year").textContent = new Date().getFullYear();
