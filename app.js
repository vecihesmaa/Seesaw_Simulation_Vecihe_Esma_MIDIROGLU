/**
 * Seesaw Simulation - Final Version with Data Persistence
 */
(function initializeSeesaw() {
  const STORAGE_KEY = "seesaw_simulation_final_v3";

  // Cache UI elements for performance
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

  // Internal application state
  let state = {
    objects: [],
    history: ["Ready: click on the plank to drop the next weight."],
    nextMass: Math.floor(Math.random() * 10) + 1,
  };

  /**
   * PERSISTENCE LOGIC: Save state to Local Storage
   */
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /**
   * PERSISTENCE LOGIC: Load state from Local Storage
   */
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        state = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
  }

  /**
   * Generates a pop sound using Web Audio API.
   */
  function playPopSound(mass) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtx();
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      osc.frequency.setValueAtTime(450 - mass * 25, audio.currentTime);
      osc.type = "sine";

      gain.gain.setValueAtTime(0, audio.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audio.destination);

      osc.start();
      osc.stop(audio.currentTime + 0.2);
      osc.onended = function () {
        audio.close();
      };
    } catch (e) {
      console.log("Audio feedback skipped.");
    }
  }

  /**
   * Main render function: calculates physics and updates the DOM.
   */
  function updateSimulation() {
    let lMass = 0,
      rMass = 0;
    let lTorque = 0,
      rTorque = 0;

    state.objects.forEach(function (obj) {
      const distance = Math.abs(obj.offset);
      if (obj.offset < 0) {
        lMass += obj.mass;
        lTorque += obj.mass * distance;
      } else {
        rMass += obj.mass;
        rTorque += obj.mass * distance;
      }
    });

    const rawAngle = (rTorque - lTorque) / 10;
    let finalAngle = Math.max(-30, Math.min(30, rawAngle));

    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = finalAngle.toFixed(1);
    elements.nextLabel.textContent = state.nextMass;

    elements.wrapper.style.transform =
      "translate(-50%, -50%) rotate(" + finalAngle + "deg)";

    // Clean up and redraw objects
    elements.wrapper
      .querySelectorAll(".dropped-object")
      .forEach((item) => item.remove());

    state.objects.forEach(function (obj) {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = "calc(50% + " + obj.offset + "px)";
      div.style.backgroundColor = obj.color;
      const size = 22 + obj.mass * 2.8;
      div.style.width = size + "px";
      div.style.height = size + "px";
      div.textContent = obj.mass + "kg";
      elements.wrapper.appendChild(div);
    });

    elements.logBox.innerHTML = state.history
      .map((msg) => '<div class="log-entry">' + msg + "</div>")
      .reverse()
      .join("");

    // NEW: Save every time the simulation updates
    saveToStorage();
  }

  /**
   * Handle user clicks on the plank.
   */
  elements.plank.addEventListener("click", function (e) {
    const rect = elements.plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const offset = clickX - rect.width / 2;

    const mass = state.nextMass;
    const side = offset < 0 ? "left" : "right";
    const distancePx = Math.round(Math.abs(offset));

    state.objects.push({
      mass: mass,
      offset: offset,
      color: "hsl(" + Math.random() * 360 + ", 65%, 50%)",
    });

    state.history.push(
      mass + "kg dropped on " + side + " at " + distancePx + "px",
    );

    playPopSound(mass);
    state.nextMass = Math.floor(Math.random() * 10) + 1;
    updateSimulation();
  });

  /**
   * Resets the app and clears storage.
   */
  elements.resetBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to reset the simulation?")) {
      localStorage.removeItem(STORAGE_KEY); // Clear saved data
      state = {
        objects: [],
        history: ["Ready: click on the plank to drop the next weight."],
        nextMass: Math.floor(Math.random() * 10) + 1,
      };
      updateSimulation();
    }
  });

  // INITIAL LOAD
  loadFromStorage(); // Load existing data if any
  updateSimulation(); // First render
})();
