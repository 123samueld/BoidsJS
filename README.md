# 🐦 BoidsJS

A JavaScript simulation inspired by **Craig Reynolds' Boids algorithm**, which models the collective behavior of flocking birds. This project visualizes simple rules that lead to emergent group motion — a classic example of artificial life and swarm intelligence.

## ✨ Features

- Pure JavaScript & HTML5 `<canvas>` implementation
- Real-time simulation of flocking behavior
- Lightweight and browser-based — no dependencies

## 📜 What Are Boids?

"Boids" is an artificial life program developed by Craig Reynolds in 1986. It simulates the flocking behavior of birds using three simple rules:

1. **Separation** – avoid crowding neighbors  
2. **Alignment** – steer towards average heading of neighbors  
3. **Cohesion** – move toward the average position of neighbors  

From these rules, complex and natural-looking flocking behavior emerges.

## 🚀 Getting Started

No install required! Just follow these steps:

1. **Download** this repository as a ZIP:  
   - Click the green **"Code"** button above, then **"Download ZIP"**  
2. **Unzip** the folder to your computer  
3. **Open** `index.html` in your preferred browser  

The simulation will run automatically.

## 🛠️ Development Notes

- Customize visuals and logic in `index.js`  
- Styling is handled in `index.css`  
- The canvas is centered and styled with a metallic border to make it pop visually  

## 🧠 Improvements for Future Versions

### 🔬 Physics

- Introduce **gradual angle turning** instead of snapping directly to target direction
- Implement **velocity vectors** and **mass/inertia** for more natural movement
- Fine-tune the weighting between Separation, Alignment, and Cohesion
- Improve handling of **edge wrapping** or explore bounded vs. unbounded spaces

### 🧱 File Structure

- Maintain a clearer separation of concerns:
  - One file for **initial setup** (canvas, constants, asset loading)
  - One file for **entity logic and data structures**
  - One file for **drawing**
  - One file for **Boid behaviors**
  - One file for **simulation control (main loop)**

- Avoid tight coupling between files — pass in values like agent count explicitly
- Consider using **ES modules** properly with a local server to avoid CORS/import issues
