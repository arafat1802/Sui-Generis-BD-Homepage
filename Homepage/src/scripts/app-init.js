import { initThemeToggle, initMobileMenu, initScrollReveal, initContactForm } from './ui.js';

initThemeToggle();
initMobileMenu();
initScrollReveal({ selector: '.animate-up, .draw-on-scroll' });
initContactForm();

// Initialize SVG stroke animation if present
const strokePaths = document.querySelectorAll('.stroke');
if (strokePaths.length > 0) {
  strokePaths.forEach(path => {
    const length = path.getTotalLength?.();
    if (length) {
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    }
  });
}
