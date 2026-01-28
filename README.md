# Seesaw Simulation

**[ Live Demo](https://vecihesmaa.github.io/Seesaw_Simulation_Vecihe_Esma_MIDIROGLU/)**

A web-based physics simulation that demonstrates torque, equilibrium, and interactive UI elements. This project was developed as a technical case study focusing on clean code, physics logic, and user experience.

## My Thinking Process & Logic

When I first approached this project, here is how I structured my thoughts:

1.  **Dynamic Equilibrium:** I decided to use the center of the plank as the (0,0) point. Every click calculates a relative offset from this center. This makes the physics calculations much more intuitive as left-side drops have negative values and right-side drops have positive values.
2.  **Torque over Simple Weight:** Instead of just summing up weights, I implemented a torque-based system ($Torque = Mass \times Distance$). This ensures that a small weight far from the center can tilt the plank more than a heavy weight close to the center, just like in real life.
3.  **Visual vs. Logic Separation:** I kept the simulation state (the data) separate from the rendering logic. This allowed me to easily add features like action logging and audio feedback without breaking the core physics.
4.  **Sensory Feedback:** To make the simulation more interactive, I integrated the Web Audio API. I designed it so that the "pitch" of the sound changes based on the weight, giving the user an auditory sense of the mass being dropped.

## AI-Assisted Components

While developing the simulation, I utilized AI to research and refine specific technical aspects:

- **Web Audio API:** I consulted AI to quickly access technical documentation for synthesizing a library-free 'pop' sound, ensuring a lightweight audio solution.
- **HTML Trigger Logic:** I used AI support to refine the event trigger mechanisms and synchronization, ensuring the most stable version was deployed to the Live Demo.

## Key Features

- **Physics Engine:** Real-time torque calculation with a maximum tilt limit of 30 degrees for visual stability.
- **Interactive UI:** Weights are randomized (1kg-10kg) for each drop to keep the simulation dynamic.
- **Audio Feedback:** Adaptive sound frequency (pitch) based on object mass.
- **Action Logs:** A detailed history tracking every drop's weight, side, and exact position.

## Technical Stack

- **JavaScript (Vanilla):** Core engine, Web Audio API, and DOM manipulation.
- **HTML5 & CSS3:** Responsive layout with smooth CSS transitions for the plank rotation.

## Development Stages

- **Phase 1:** UI structure and core rotation logic.
- **Phase 2:** Torque calculations and object placement.
- **Phase 3:** Integration of Audio API and detailed logging system.
- **Phase 4:** Final refinements, code optimization, and documentation.

## Physics Formula Used

The simulation calculates the balance using:
$$\sum \tau_{left} = \sum (m_i \times d_i) \quad vs \quad \sum \tau_{right} = \sum (m_j \times d_j)$$

## How to Run

1. Clone the repository.
2. Open `index.html` in any modern web browser.
3. Click on the plank to start the simulation.
