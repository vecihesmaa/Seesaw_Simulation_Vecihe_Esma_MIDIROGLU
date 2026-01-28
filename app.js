(function () {
  const STORAGE_KEY = "seesaw_data";
  const elements = {
    plank: document.getElementById("plank"),
    wrapper: document.getElementById("plankWrapper"),
    leftLabel: document.getElementById("leftTotal"),
    rightLabel: document.getElementById("rightTotal"),
    angleLabel: document.getElementById("tiltAngle"),
    nextLabel: document.getElementById("nextWeight"),
    logBox: document.getElementById("logList"),
    resetBtn: document.getElementById("resetBtn"),
  };

  let state = {
    objects: [],
    history: [],
    nextMass: Math.floor(Math.random() * 10) + 1,
  };

  const load = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = JSON.parse(saved);
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  const updateUI = () => {
    let lMass = 0,
      rMass = 0,
      lTorque = 0,
      rTorque = 0;

    state.objects.forEach((obj) => {
      const dist = Math.abs(obj.offset);
      if (obj.offset < 0) {
        lMass += obj.mass;
        lTorque += obj.mass * dist;
      } else {
        rMass += obj.mass;
        rTorque += obj.mass * dist;
      }
    });

    const angle = Math.max(-30, Math.min(30, (rTorque - lTorque) / 10));

    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = angle.toFixed(1);
    elements.nextLabel.textContent = state.nextMass;

    // Dönme merkezi korunarak açı verilir
    elements.wrapper.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Objeleri temizle ve yeniden çiz
    elements.wrapper
      .querySelectorAll(".dropped-object")
      .forEach((el) => el.remove());
    state.objects.forEach((obj) => {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = `calc(50% + ${obj.offset}px)`;
      div.style.backgroundColor = obj.color;
      const size = 22 + obj.mass * 2.5;
      div.style.width = div.style.height = `${size}px`;
      div.textContent = `${obj.mass}kg`;
      elements.wrapper.appendChild(div);
    });

    elements.logBox.innerHTML = state.history
      .map((m) => `<div class="log-entry">${m}</div>`)
      .reverse()
      .join("");
  };

  elements.plank.addEventListener("click", (e) => {
    const rect = elements.plank.getBoundingClientRect();
    const offset = e.clientX - rect.left - rect.width / 2;

    state.objects.push({
      mass: state.nextMass,
      offset: offset,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });

    state.history.push(
      `${state.nextMass}kg dropped at ${Math.round(offset)}px`,
    );
    state.nextMass = Math.floor(Math.random() * 10) + 1;

    save();
    updateUI();
  });

  elements.resetBtn.onclick = () => {
    if (confirm("Reset simulation?")) {
      state = {
        objects: [],
        history: [],
        nextMass: Math.floor(Math.random() * 10) + 1,
      };
      save();
      updateUI();
    }
  };

  load();
  updateUI();
})();
