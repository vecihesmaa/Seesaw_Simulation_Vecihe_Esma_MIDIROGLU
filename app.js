/**
 * Seesaw Simulation  - Final Version
 * Logic: Torque-based physics with audio feedback and action logging.
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
   * Generates a pop sound using Web Audio API.
   * Pitch varies based on the mass of the object.
   */
  function playPopSound(mass) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audio = new AudioCtx();
      const osc = audio.createOscillator();
      const gain = audio.createGain();

      // Adjust frequency: heavier objects produce lower tones
      osc.frequency.setValueAtTime(450 - mass * 25, audio.currentTime);
      osc.type = "sine";

      // Prevent audio clipping with a quick gain envelope
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
      console.log("Audio feedback skipped due to browser policy.");
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

    // Calculate total mass and torque for both sides
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

    // Determine the raw tilt angle from torque difference
    const rawAngle = (rTorque - lTorque) / 10;

    // Clamp angle to a maximum of 30 degrees (Manual clamping for natural look)
    let finalAngle = rawAngle;
    if (finalAngle > 30) {
      finalAngle = 30;
    } else if (finalAngle < -30) {
      finalAngle = -30;
    }

    // Update the dashboard statistics
    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = finalAngle.toFixed(1);
    elements.nextLabel.textContent = state.nextMass;

    elements.wrapper.style.transform =
      "translate(-50%, -50%) rotate(" + finalAngle + "deg)";

    // Clean up existing objects and redraw current state
    const currentItems = elements.wrapper.querySelectorAll(".dropped-object");
    currentItems.forEach(function (item) {
      item.remove();
    });

    state.objects.forEach(function (obj) {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = "calc(50% + " + obj.offset + "px)";
      div.style.backgroundColor = obj.color;

      // Scaling circle size based on its mass
      const size = 22 + obj.mass * 2.8;
      div.style.width = size + "px";
      div.style.height = size + "px";
      div.textContent = obj.mass + "kg";

      elements.wrapper.appendChild(div);
    });

    // Refresh the action log history
    elements.logBox.innerHTML = state.history
      .map(function (msg) {
        return '<div class="log-entry">' + msg + "</div>";
      })
      .reverse()
      .join("");
  }

  /**
   * Handle user clicks on the plank to spawn new objects.
   */
  elements.plank.addEventListener("click", function (e) {
    const rect = elements.plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const offset = clickX - rect.width / 2; // Position relative to center

    const mass = state.nextMass;
    const side = offset < 0 ? "left" : "right";
    const distancePx = Math.round(Math.abs(offset));

    // Push new data to the objects array
    state.objects.push({
      mass: mass,
      offset: offset,
      color: "hsl(" + Math.random() * 360 + ", 65%, 50%)",
    });

    // Log the event with detailed description
    const logText =
      mass +
      "kg dropped on " +
      side +
      " side at " +
      distancePx +
      "px from center";
    state.history.push(logText);

    // Audio feedback and re-render
    playPopSound(mass);
    state.nextMass = Math.floor(Math.random() * 10) + 1;
    updateSimulation();
  });

  /**
   * Clears the board and resets the app state.
   */
  elements.resetBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to reset the simulation?")) {
      state = {
        objects: [],
        history: ["Ready: click on the plank to drop the next weight."],
        nextMass: Math.floor(Math.random() * 10) + 1,
      };
      updateSimulation();
    }
  });

  // Initial trigger
  updateSimulation();
})();
