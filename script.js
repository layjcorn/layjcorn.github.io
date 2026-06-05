document.addEventListener('DOMContentLoaded', () => {
    
    // --- Universal 3D Kinematic Render Loop ---
    const idleModels = document.querySelectorAll('.idle-model');
    
    if (idleModels.length > 0) {
        function renderLoop() {
            const time = performance.now() / 1000; 
            
            const idleX = Math.sin(time * 1.5) * 1.5;  
            const idleY = Math.sin(time * 1.0) * 3;   
            const idleZ = Math.sin(time * 1.2) * 1.5;   
            
            const baseZOffset = 15; 
            
            const pitchX = idleX;   
            const tumbleY = idleY;  
            const topSpinZ = baseZOffset + idleZ; 
            
            idleModels.forEach(model => {
                model.setAttribute('orientation', `${pitchX}deg ${tumbleY}deg ${topSpinZ}deg`);
            });
            
            requestAnimationFrame(renderLoop);
        }
        renderLoop();
    }

    // --- Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;

        // Generate Dots dynamically based on number of slides
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(document.querySelectorAll('.carousel-dot'));

        function updateCarousel() {
            // Move the track based on current index
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
            updateCarousel();
        });
    }

    // --- Tag Overflow Logic (Tier 2 Grid) ---
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