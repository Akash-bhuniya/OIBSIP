// Fade-in on scroll animation
function revealOnScroll() {
    var elements = document.querySelectorAll('.fade-in');
    var windowHeight = window.innerHeight;
    elements.forEach(function(el) {
        var position = el.getBoundingClientRect().top;
        if (position < windowHeight - 60) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
