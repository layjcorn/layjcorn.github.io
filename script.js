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

    // --- 1. Expanding Gallery & Shared 3D Stage Logic (Tier 1) ---
    const gallery = document.getElementById('project-gallery');
    const cards = document.querySelectorAll('.gallery-card');
    const sharedModelViewer = document.getElementById('shared-model-viewer');
    
    if (gallery && cards.length > 0) {
        const defaultCard = document.querySelector('.gallery-card[data-default="true"]');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // 1. Handle accordion expansion
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // 2. Handle 3D model swapping
                if (sharedModelViewer) {
                    const newModel = card.getAttribute('data-model');
                    // Only update if it's a different model to prevent reloading flashes
                    if (newModel && sharedModelViewer.getAttribute('src') !== newModel) {
                        sharedModelViewer.setAttribute('src', newModel);
                    }
                }
            });
        });

        gallery.addEventListener('mouseleave', () => {
            // Revert to default card and default model when mouse leaves gallery
            cards.forEach(c => c.classList.remove('active'));
            if (defaultCard) {
                defaultCard.classList.add('active');
                
                if (sharedModelViewer) {
                    const defaultModel = defaultCard.getAttribute('data-model');
                    if (defaultModel) {
                        sharedModelViewer.setAttribute('src', defaultModel);
                    }
                }
            }
        });
    }

    // --- 2. Tag Overflow Logic (Tier 2 Grid) ---
    const MAX_TAGS = 4;
    const tagContainers = document.querySelectorAll('.tag-container');
    
    tagContainers.forEach(container => {
        const tags = Array.from(container.querySelectorAll('.skill-tag'));
        
        if (tags.length > MAX_TAGS) {
            let hiddenCount = 0;
            
            tags.forEach((tag, index) => {
                if (index >= MAX_TAGS) {
                    tag.style.display = 'none';
                    hiddenCount++;
                }
            });
            
            if (hiddenCount > 0) {
                const overflowTag = document.createElement('span');
                overflowTag.classList.add('skill-tag');
                overflowTag.textContent = `+${hiddenCount} more`;
                container.appendChild(overflowTag);
            }
        }
    });
});

// Handles tag overflow for the project cards
document.addEventListener("DOMContentLoaded", () => {
  const MAX_TAGS = 4;
  
  const tagContainers = document.querySelectorAll('.tag-container');
  
  tagContainers.forEach(container => {
    const tags = Array.from(container.querySelectorAll('.skill-tag'));
    
    if (tags.length > MAX_TAGS) {
      let hiddenCount = 0;
      
      // Hide tags beyond the maximum threshold
      tags.forEach((tag, index) => {
        if (index >= MAX_TAGS) {
          tag.style.display = 'none';
          hiddenCount++;
        }
      });
      
      // Create and append the '+N more' pill
      if (hiddenCount > 0) {
        const overflowTag = document.createElement('span');
        overflowTag.classList.add('skill-tag');
        overflowTag.textContent = `+${hiddenCount} more`;
        container.appendChild(overflowTag);
      }
    }
  });
});

