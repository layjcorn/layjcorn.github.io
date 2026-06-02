document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Logic ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                menuToggle.innerText = '✕'; 
            } else {
                menuToggle.innerText = '☰'; 
            }
        });
    }

// --- 3D Hero Kinematic Render Loop ---
    const modelViewer = document.getElementById('hero-model');
    const spinBtn = document.getElementById('spin-btn');
    
    if (modelViewer) {
        let scrollY = window.scrollY;
        
        // Physics variables for the button spin
        let burstRotation = 0;
        let burstVelocity = 0;
        
        // Listen for the spin button click
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                burstVelocity = 35; // Spike the speed
            });
        }

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        function renderLoop() {
            const time = performance.now() / 1000; 
            
            // 1. Calculate Scroll Progress (Clamped 0 to 1)
            const scrollProgress = Math.min(scrollY / window.innerHeight, 1.25);
            
            // The Dual-Axis Tumbling Math
            const scrollRotationY = scrollProgress * 360 / 1.25; 
            const scrollRotationX = scrollProgress * 0; 
            
            // 2. Process Burst Physics (The Button Spin)
            burstRotation += burstVelocity;
            burstVelocity *= 0.92; 
            if (burstVelocity < 0.1) burstVelocity = 0; 
            
            // 3. Base Idle Rotations
            const idleX = Math.sin(time * 1.5) * 1.5;  
            const idleY = Math.sin(time * 1.0) * 3;   
            const idleZ = Math.sin(time * 1.2) * 1.5;   
            
            // COMBINE: Add the 45-degree base offset to the Z-axis
            const baseZOffset = 145; // The starting angle
            
            const pitchX = scrollRotationX + idleX;   
            const tumbleY = scrollRotationY + idleY;  
            const topSpinZ = baseZOffset + burstRotation + idleZ; // Injected the offset here!
            
            // Inject back into the 3D engine: "Pitch(X) Yaw(Y) Roll(Z)"
            modelViewer.setAttribute('orientation', `${pitchX}deg ${tumbleY}deg ${topSpinZ}deg`);

            // 4. Dynamic Scaling
            const startScale = 0.3; 
            const endScale = 0.2;  
            const currentScale = startScale - (scrollProgress * (startScale - endScale));
            modelViewer.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
            
            // // 5. Dynamic Background Morph (Grey to Green)
            // // Starting Grey: rgb(233, 236, 239)  (#e9ecef)
            // // Ending Green: rgb(220, 240, 225)   (Subtle mint/sage green)
            
            // // Calculate the current RGB value based on scroll progress (0.0 to 1.0)
            // const r = Math.round(233 - (scrollProgress * 13));  // Drops from 233 to 220
            // const g = Math.round(236 + (scrollProgress * 4));   // Rises from 236 to 240
            // const b = Math.round(239 - (scrollProgress * 14));  // Drops from 239 to 225
            
            // // Inject the calculated gradient directly into the body's CSS
            // document.body.style.background = `linear-gradient(to bottom right, #ffffff, rgb(${r}, ${g}, ${b}))`;
            // document.body.style.backgroundAttachment = "fixed"; // Ensures the gradient doesn't stretch weirdly

            requestAnimationFrame(renderLoop);
        }
        
        // Ignite the loop
        renderLoop();
    }

    // --- Dynamic Text Reveal Animation ---
    const animatedTextContainers = document.querySelectorAll('.animate-text h1');
    
    // We want the last name to delay slightly so it cascades nicely after the first name
    let globalDelayMultiplier = 0;

    animatedTextContainers.forEach((h1) => {
        const text = h1.innerText;
        h1.innerHTML = ''; // Clear original solid text
        
        // Split into characters and rebuild
        text.split('').forEach((char) => {
            const span = document.createElement('span');
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.innerText = char;
                span.classList.add('letter');
                // Stagger the animation delay by 0.05 seconds per letter
                span.style.animationDelay = `${globalDelayMultiplier * 0.05}s`;
                globalDelayMultiplier++;
            }
            h1.appendChild(span);
        });
    });
    
});