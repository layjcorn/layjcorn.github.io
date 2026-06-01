document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        // Toggles the 'active' class to slide the menu in and out
        sidebar.classList.toggle('active');
        
        // Change the icon visually when open vs closed
        if (sidebar.classList.contains('active')) {
            menuToggle.innerText = '✕'; // Close icon
        } else {
            menuToggle.innerText = '☰'; // Hamburger icon
        }
    });
});