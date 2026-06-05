document.addEventListener('DOMContentLoaded', () => {
    
    // --- Universal 3D Kinematic Render Loop ---
    const idleModels = document.querySelectorAll('.idle-model');
    const spinBtn = document.getElementById('spin-btn');
    
    if (idleModels.length > 0) {
        
        let burstRotation = 0;
        let burstVelocity = 0;
        
        if (spinBtn) {
            spinBtn.addEventListener('click', () => {
                burstVelocity = 35; 
            });
        }

        function renderLoop() {
            const time = performance.now() / 1000; 
            
            // Process Burst Physics
            burstRotation += burstVelocity;
            burstVelocity *= 0.92; 
            if (burstVelocity < 0.1) burstVelocity = 0; 
            
            // Base Idle Rotations
            const idleX = Math.sin(time * 1.5) * 1.5;  
            const idleY = Math.sin(time * 1.0) * 3;   
            const idleZ = Math.sin(time * 1.2) * 1.5;   
            
            const baseZOffset = 15; 
            
            const pitchX = idleX;   
            const tumbleY = idleY;  
            const topSpinZ = baseZOffset + burstRotation + idleZ; 
            
            // Inject into EVERY model on the page
            idleModels.forEach(model => {
                model.setAttribute('orientation', `${pitchX}deg ${tumbleY}deg ${topSpinZ}deg`);
            });
            
            requestAnimationFrame(renderLoop);
        }
        
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





// MOWER-GUARD.HTML INTERACTIVE SCHEMATIC LOGIC

