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

    // --- 3D Hero Scroll Animation ---
    const modelViewer = document.getElementById('hero-model');
    
    if (modelViewer) {
        window.addEventListener('scroll', () => {
            // Map scroll Y position to a rotation angle. 
            // Adjust the 0.25 multiplier to make it spin faster or slower.
            const rotation = window.scrollY * 0.25; 
            
            // Update the model's physical Y-axis orientation: "X Y Z"
            modelViewer.setAttribute('orientation', `0deg ${rotation}deg 0deg`);
        });
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