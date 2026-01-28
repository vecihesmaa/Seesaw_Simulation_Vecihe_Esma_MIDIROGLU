/**
 * Seesaw Simulation - Logic & Persistence
 * Manages torque calculations and local storage syncing.
 */
(function simulationStepTwo() {
  const STORAGE_KEY = "seesaw_session_v1";

  const elements = {
    plank: document.getElementById("plank"),
    wrapper: document.getElementById("plankWrapper"),
    leftLabel: document.getElementById("leftTotal"),
    rightLabel: document.getElementById("rightTotal"),
    angleLabel: document.getElementById("tiltAngle"),
    nextLabel: document.getElementById("nextWeight"),
    logBox: document.getElementById("logList"),
  };

  // Central state for the application
  let state = {
    objects: [],
    history: [],
    nextMass: Math.floor(Math.random() * 10) + 1,
  };

  // Requirement: Save state to avoid losing data on refresh
  const saveToStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const loadFromStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        state = JSON.parse(data);
      } catch (err) {
        console.error("Storage data invalid.");
      }
    }
  };

  /**
   * Requirement: Compute torque for each side
   * torque = sum(weight * distance)
   */
  const getPhysics = () => {
    let lMass = 0,
      rMass = 0;
    let lTorque = 0,
      rTorque = 0;

    state.objects.forEach((obj) => {
      const distance = Math.abs(obj.offset);
      if (obj.offset < 0) {
        lMass += obj.mass;
        lTorque += obj.mass * distance;
      } else {
        rMass += obj.mass;
        rTorque += obj.mass * distance;
      }
    });

    // Exact formula from case requirement: capped at +/- 30 degrees
    const tilt = (rTorque - lTorque) / 10;
    const finalAngle = Math.max(-30, Math.min(30, tilt));

    return { lMass, rMass, finalAngle };
  };

  const updateUI = () => {
    const { lMass, rMass, finalAngle } = getPhysics();

    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = finalAngle.toFixed(1);
    elements.nextLabel.textContent = state.nextMass;

    // Smoothly tilt the plank wrapper [cite: 38]
    elements.wrapper.style.transform = `translateX(-50%) rotate(${finalAngle}deg)`;

    // Clear and redraw all objects
    elements.wrapper
      .querySelectorAll(".dropped-object")
      .forEach((el) => el.remove());
    state.objects.forEach((obj) => {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = `calc(50% + ${obj.offset}px)`;
      div.style.backgroundColor = obj.color;

      const size = 18 + obj.mass * 2;
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.textContent = obj.mass;

      elements.wrapper.appendChild(div);
    });

    // Update action history log
    if (state.history.length > 0) {
      elements.logBox.innerHTML = state.history
        .map((entry) => `<div class="log-entry">${entry}</div>`)
        .reverse()
        .join("");
    }
  };

  // Interaction handler limited to the plank area [cite: 39]
  elements.plank.addEventListener("click", (e) => {
    const rect = elements.plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const offset = clickX - rect.width / 2;

    const massToDrop = state.nextMass;
    const side = offset < 0 ? "Left" : "Right";

    state.objects.push({
      mass: massToDrop,
      offset: offset,
      color: `hsl(${Math.random() * 360}, 65%, 45%)`,
    });

    state.history.push(`Added ${massToDrop}kg on ${side} side.`);
    state.nextMass = Math.floor(Math.random() * 10) + 1; // Prepare for next click [cite: 11]

    saveToStorage();
    updateUI();
  });

  // Run on startup
  loadFromStorage();
  updateUI();
})();
