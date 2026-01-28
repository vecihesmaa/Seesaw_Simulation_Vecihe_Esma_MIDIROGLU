# Seesaw Simulation

**[ Live Demo](https://vecihesmaa.github.io/Seesaw_Simulation_Vecihe_Esma_MIDIROGLU/)**

A high-performance, web-based physics simulation demonstrating torque, equilibrium, and persistent state management. This project was developed as a technical case study with a focus on **clean architecture**, **state-driven logic**, and **sensory feedback**.

---

## Architectural Decisions & Logic

In building this simulation, I prioritized scalability and physical accuracy. Here are the core pillars of my approach:

### 1. State-Driven Architecture (Single Source of Truth)

A key decision was to separate the **Application State** from the **DOM manipulation**.

- **Why?** Instead of direct DOM updates during user interaction, the app updates a central `state` object first. The UI then synchronizes with this data via a dedicated render cycle.
- **Benefit:** This made implementing features like **Data Persistence** and **Action Logs** seamless, as the rendering logic is entirely decoupled from the business logic.

### 2. Physics Engine: Torque over Simple Mass

Real-world balance isn't just about weight; it's about **Torque** ($\tau = r \times F$).

- I implemented a system where the distance from the pivot point directly affects the tilt.
- **Trade-off:** To ensure visual stability and prevent the plank from "flipping" in the UI, I applied **clamping logic**, limiting the maximum rotation to **30 degrees**.

### 3. Data Persistence (Session Recovery)

To ensure the user doesn't lose progress on a page refresh, I implemented a synchronization layer with **LocalStorage**.

- Every state change is serialized into JSON and saved automatically.
- On page load, the app recovers the previous session's weights, history logs, and tilt angle from the browser's memory.

### 4. Lightweight Sensory Feedback

I utilized the **Web Audio API** to synthesize sounds in real-time without using any external audio assets.

- **The Logic:** The oscillator frequency is mapped to the object's mass—heavier objects generate lower, deeper tones.
- **Outcome:** A zero-asset, high-performance solution that provides an intuitive auditory sense of weight.

---

## Technical Stack & Optimizations

- **Vanilla JavaScript:** Wrapped in an IIFE to prevent global scope pollution and maintain encapsulation.
- **DOM Caching:** I cached all necessary UI elements at the start to minimize expensive `document.getElementById` calls during the simulation updates.
- **CSS3 Hardware Acceleration:** Using `transform: rotate()` for smooth, high-FPS animations of the plank.

---

## AI-Assisted Components

While developing the simulation, I utilized AI to research and refine specific technical aspects:

- **Web Audio API:** I consulted AI to quickly access technical documentation for synthesizing a library-free 'pop' sound, ensuring a lightweight audio solution.
- **HTML Trigger Logic:** I used AI support to refine the event trigger mechanisms and synchronization, ensuring the most stable version was deployed to the Live Demo.

---

## Physics Formula

The simulation determines the tilt angle based on the net torque difference:
$$\tau_{net} = \sum (m_{right} \times d_{right}) - \sum (m_{left} \times d_{left})$$
The resulting value is then scaled and clamped to provide a natural-looking equilibrium for the user interface.

---

## Key Features

- **Persistent Progress:** Automatically saves and restores your simulation state using LocalStorage.
- **Dynamic Logs:** Real-time tracking of every interaction with detailed side and distance data.
- **Adaptive Audio:** Dynamic pitch shifting based on object mass for better immersion.
- **Reset Logic:** A safe reset mechanism that clears both the UI and the browser's persistent storage.

---

## How to Run

1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Click on the plank to start the simulation.
