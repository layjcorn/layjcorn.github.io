# Richard Townsley's Mechanical Engineering Portfolio

A personal mechanical engineering portfolio highlighting hardware-software integration, mechatronics, and mechanical design. Built from scratch; lightweight, zero-dependencies.

## Features

* **Interactive 3D Rendering**: Implements Google's `<model-viewer>` to allow complex CAD assembly viewing in-browser.
* **Kinematic Animations**: JavaScript loop applies continuous, physics-based idle rotations (pitch, yaw, roll) to the 3D elements.
* **Responsive Architecture**: Fully responsive CSS Grid + Flexbox layouts for widescreen desktop or mobile viewports.
* **Performance Optimized**: Planar Decimation and Google Draco compression to showcase heavily engineered mechanical assemblies with minimal bandwidth overhead.

## Technology Stack

* **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
* **3D Web Integration**: `<model-viewer>` component
* **Asset Pipeline**: SOLIDWORKS, OnShape, Blender

## Running Locally

Because this project dynamically fetches local 3D model files (`.glb`), opening the `index.html` file directly from your file explorer may cause CORS security blocks in modern browsers. 

To view and edit the site locally, you must serve it through a local web server.

**Option 1: Python (Terminal/Command Prompt)**
If you have Python installed, open your terminal in the root project directory and run:
```bash
python -m http.server 8000
