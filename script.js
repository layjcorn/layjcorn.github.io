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
    
    if (modelViewer) {
        let scrollY = window.scrollY;
        
        // Passively track the scroll position without forcing immediate renders
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        function renderLoop() {
            const time = performance.now() / 1000; 
            
            // 1. Calculate Progress FIRST (0 at top, exactly 1.0 when docked)
            const scrollProgress = Math.min(scrollY / window.innerHeight, 1);
            
            // 2. Base Rotations (Now strictly tied to our clamped progress limit)
            // Multiplying by 360 means it does exactly 1 full spin before docking.
            const scrollRotation = scrollProgress * 360; 
            
            const pitch = Math.sin(time * 1.5) * 1.5;  
            const idleYaw = Math.sin(time * 1.0) * 3;   
            const roll = Math.sin(time * 1.2) * 1.5;   
            
            const finalYaw = scrollRotation + idleYaw;
            modelViewer.setAttribute('orientation', `${pitch}deg ${finalYaw}deg ${roll}deg`);
            
            // 3. Dynamic Scaling (The "Landing" effect)
            const startScale = 0.3; 
            const endScale = 0.15;  
            
            const currentScale = startScale - (scrollProgress * (startScale - endScale));
            modelViewer.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
            
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