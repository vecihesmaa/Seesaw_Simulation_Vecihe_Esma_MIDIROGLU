/**
 * Seesaw Simulation - Initial Logic
 * This module handles the basic physics and object placement.
 */
(function initialSimulation() {
  // Cache DOM elements for better performance
  const elements = {
    plank: document.getElementById("plank"),
    wrapper: document.getElementById("plankWrapper"),
    leftLabel: document.getElementById("leftTotal"),
    rightLabel: document.getElementById("rightTotal"),
    angleLabel: document.getElementById("tiltAngle"),
  };

  // Application state - stores all active objects on the plank
  let objects = [];

  /**
   * Calculates physics based on torque: T = mass * distance
   * The plank tilts based on the torque difference between sides.
   */
  const calculatePhysics = () => {
    let lMass = 0,
      rMass = 0;
    let lTorque = 0,
      rTorque = 0;

    objects.forEach((obj) => {
      const distance = Math.abs(obj.offset);

      // Determine side based on offset (negative is left, positive is right)
      if (obj.offset < 0) {
        lMass += obj.mass;
        lTorque += obj.mass * distance;
      } else {
        rMass += obj.mass;
        rTorque += obj.mass * distance;
      }
    });

    // Apply formula from requirements: tilt = (rightTorque - leftTorque) / 10
    // We cap the tilt at 30 degrees as per the case specs
    const rawAngle = (rTorque - lTorque) / 10;
    const angle = Math.max(-30, Math.min(30, rawAngle));

    return { lMass, rMass, angle };
  };

  /**
   * Updates the UI and re-renders all objects on the plank
   */
  const render = () => {
    const { lMass, rMass, angle } = calculatePhysics();

    // Update stats dashboard
    elements.leftLabel.textContent = lMass.toFixed(1);
    elements.rightLabel.textContent = rMass.toFixed(1);
    elements.angleLabel.textContent = angle.toFixed(1);

    // Apply rotation to the plank wrapper
    elements.wrapper.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    // Clear existing objects before re-rendering
    elements.wrapper
      .querySelectorAll(".dropped-object")
      .forEach((el) => el.remove());

    objects.forEach((obj) => {
      const div = document.createElement("div");
      div.className = "dropped-object";
      div.style.left = `calc(50% + ${obj.offset}px)`;

      // Dynamic sizing based on mass (optional polish)
      const size = 18 + obj.mass * 2;
      div.style.width = `${size}px`;
      div.style.height = `${size}px`;
      div.textContent = obj.mass;

      elements.wrapper.appendChild(div);
    });
  };

  /**
   * Listener for clicks on the plank to drop new weights
   */
  elements.plank.addEventListener("click", (e) => {
    const rect = elements.plank.getBoundingClientRect();

    // Calculate offset relative to the center of the plank
    const clickX = e.clientX - rect.left;
    const offset = clickX - rect.width / 2;

    // Push new object with random mass (1-10kg)
    objects.push({
      mass: Math.floor(Math.random() * 10) + 1,
      offset: offset,
      color: `hsl(${Math.random() * 360}, 60%, 50%)`, // Basic random color
    });

    render();
  });
})();
