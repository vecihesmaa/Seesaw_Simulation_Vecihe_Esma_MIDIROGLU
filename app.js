/**
 * Seesaw Simulation Engine
 * Version: 3.0 (Final)
 * Features: Web Audio API, Detailed Activity Logs, Physics-based Torque Calculation
 */
(function finalSeesawEngine() {
  // Unique key for local storage persistence
  const STORAGE_KEY = "seesaw_simulation_final_v3";

  // DOM Element Cache - Mapping HTML IDs to JS variables
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

  // Application state management
  let state = {
    objects: [],
    history: ["Ready: click on the plank to drop the next weight."],
    nextMass: Math.floor(Math.random() * 10) + 1,
  };

  /**
   * Synthesizes a 'Pop' sound using the Web Audio API.
   * Higher mass results in a lower frequency (deeper sound).
   * @param {number} mass - The weight of the dropped object.
   */
  const playPopSound = (mass) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtx();
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      // Frequency modulation based on mass (Heavier = Deeper)
      osc.frequency.setValueAtTime(450 - mass * 25, audio.currentTime);
      osc.type = "sine";

      // Envelope control to prevent clicking sounds
      gain.gain.setValueAtTime(0, audio.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start();
      osc.stop(audio.currentTime + 0.2);

      // Cleanup audio context after playback
      osc.onended = () => audio.close();
    } catch (e) {
      console.warn("Audio Context blocked: Requires user interaction first.");
    }
  };

  /**
   * Updates the simulation physics and reflects changes in the UI.
   * Calculates total mass and torque for both sides.
   */
  const updateSimulation = () => {
    let lMass = 0,
      rMass = 0,
      lTorque = 0,
      rTorque = 0;

    // Calculate mass and torque for each object on the plank
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

    // Determine tilt angle based on torque difference (Max +/- 30 degrees)
    const rawAngle = (rTorque - lTorque) / 10;
    const finalAngle = Math.max(-30, Math.min(30, rawAngle));

    // Update dashboard metrics
    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = finalAngle.toFixed(1);
    elements.nextLabel.textContent = state.nextMass;

    // Animate the rotation of the plank group
    elements.wrapper.style.transform = `translate(-50%, -50%) rotate(${finalAngle}deg)`;

    // Redraw dropped objects on the plank
    elements.wrapper
      .querySelectorAll(".dropped-object")
      .forEach((el) => el.remove());
    state.objects.forEach((obj) => {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = `calc(50% + ${obj.offset}px)`;
      div.style.backgroundColor = obj.color;

      // Dynamic scaling: Size depends on mass
      const size = 22 + obj.mass * 2.8;
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.textContent = `${obj.mass}kg`;

      elements.wrapper.appendChild(div);
    });

    // Render detailed action logs
    elements.logBox.innerHTML = state.history
      .map((msg) => `<div class="log-entry">${msg}</div>`)
      .reverse() // Display most recent activity at the top
      .join("");
  };

  /**
   * Event Listener: Handle clicks on the plank to drop objects.
   */
  elements.plank.addEventListener("click", (e) => {
    const rect = elements.plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const offset = clickX - rect.width / 2; // Distance from center

    const mass = state.nextMass;
    const side = offset < 0 ? "left" : "right";
    const distancePx = Math.round(Math.abs(offset));

    // Update state with new object data
    state.objects.push({
      mass: mass,
      offset: offset,
      color: `hsl(${Math.random() * 360}, 65%, 50%)`,
    });

    // Append formatted log entry
    state.history.push(
      `${mass}kg dropped on ${side} side at ${distancePx}px from center`,
    );

    // Trigger audio and refresh UI
    playPopSound(mass);
    state.nextMass = Math.floor(Math.random() * 10) + 1; // Generate next weight
    updateSimulation();
  });

  /**
   * Reset Button Event: Wipes all data and clears simulation.
   */
  elements.resetBtn.addEventListener("click", () => {
    if (confirm("Reset simulation to initial state?")) {
      state = {
        objects: [],
        history: ["Ready: click on the plank to drop the next weight."],
        nextMass: Math.floor(Math.random() * 10) + 1,
      };
      updateSimulation();
    }
  });

  // Initialize the simulation on page load
  updateSimulation();
})();
