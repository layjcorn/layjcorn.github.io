document.addEventListener('DOMContentLoaded', () => {
    
    const modelViewer = document.getElementById('hero-model');
    const scrollIndicator = document.getElementById('scroll-indicator');

    // --- Scroll Fade Logic for Indicator ---
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Map scroll position (0 to 300px) to an opacity value (1 to 0)
            const opacity = Math.max(1 - (scrollY / 300), 0);
            scrollIndicator.style.opacity = opacity.toFixed(2);
        });
    }

    // --- 3D Hero Idle Render Loop ---
    if (modelViewer) {
        function renderLoop() {
            const time = performance.now() / 1000; 
            
            // Base Idle Rotations (The "breathing" effect)
            const idleX = Math.sin(time * 1.5) * 1.5;  
            const idleY = Math.sin(time * 1.0) * 3;   
            const idleZ = Math.sin(time * 1.2) * 1.5;   
            
            // The starting angle offset
            const baseZOffset = 15; 
            
            const pitchX = idleX;   
            const tumbleY = idleY;  
            const topSpinZ = baseZOffset + idleZ; 
            
            // Inject back into the 3D engine: "Pitch(X) Yaw(Y) Roll(Z)"
            modelViewer.setAttribute('orientation', `${pitchX}deg ${tumbleY}deg ${topSpinZ}deg`);
            
            requestAnimationFrame(renderLoop);
        }
        
        // Ignite the loop
        renderLoop();
    }

    // --- Expanding Gallery Logic ---
    const gallery = document.getElementById('project-gallery');
    const cards = document.querySelectorAll('.gallery-card');
    
    if (gallery && cards.length > 0) {
        // Find the card we designated as the default
        const defaultCard = document.querySelector('.gallery-card[data-default="true"]');

        cards.forEach(card => {
            // When mouse enters a card, make it active and deactivate others
            card.addEventListener('mouseenter', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        // When the mouse leaves the entire gallery area, return to the default card
        gallery.addEventListener('mouseleave', () => {
            cards.forEach(c => c.classList.remove('active'));
            if (defaultCard) {
                defaultCard.classList.add('active');
            }
        });
    }
});