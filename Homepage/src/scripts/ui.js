export function initThemeToggle({
  buttonId = 'themeBtn',
  root = document.documentElement,
  storage = window.localStorage,
  media = window.matchMedia
} = {}) {
  const toggleBtn = document.getElementById(buttonId);
  if (!toggleBtn) {
    return { toggleBtn: null };
  }

  const savedTheme = storage.getItem('theme');
  const systemDark = media?.('(prefers-color-scheme: dark)')?.matches ?? false;

  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.setAttribute('data-theme', 'light');
  }

  const handleClick = () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', newTheme);
    storage.setItem('theme', newTheme);
  };

  toggleBtn.addEventListener('click', handleClick);

  return {
    toggleBtn,
    destroy() {
      toggleBtn.removeEventListener('click', handleClick);
    }
  };
}

export function initMobileMenu({
  menuId = 'navMenu',
  buttonId = 'mobileMenuBtn',
  doc = document
} = {}) {
  const mobileMenuBtn = doc.getElementById(buttonId);
  const navMenu = doc.getElementById(menuId);

  if (!mobileMenuBtn || !navMenu) {
    return { mobileMenuBtn: null, navMenu: null };
  }

  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMenu = () => {
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
  };

  const handleOutsideClick = (e) => {
    const target = e.target;
    if (!target.closest('nav') && navMenu.classList.contains('active')) {
      closeMenu();
    }
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  doc.addEventListener('click', handleOutsideClick);

  return {
    mobileMenuBtn,
    navMenu,
    destroy() {
      mobileMenuBtn.removeEventListener('click', toggleMenu);
      navMenu.querySelectorAll('a').forEach(link => {
        link.removeEventListener('click', closeMenu);
      });
      doc.removeEventListener('click', handleOutsideClick);
    }
  };
}

export function initContactForm({
  formId = 'contactForm',
  onSubmit,
  doc = document
} = {}) {
  const contactForm = doc.getElementById(formId);
  if (!contactForm) {
    return { contactForm: null };
  }

  const defaultSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log('Form submitted:', data);
    // eslint-disable-next-line no-alert
    alert("Thank you for your message! We'll get back to you within 24 hours.");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    (onSubmit ?? defaultSubmit)(data);
    contactForm.reset();
  };

  contactForm.addEventListener('submit', submitHandler);

  return {
    contactForm,
    destroy() {
      contactForm.removeEventListener('submit', submitHandler);
    }
  };
}

export function initScrollReveal({
  selector = '.animate-up',
  threshold = 0.2,
  doc = document,
  win = window
} = {}) {
  if (!('IntersectionObserver' in win)) {
    return { observer: null };
  }

  const observer = new win.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('draw-on-scroll')) {
          entry.target.classList.add('is-drawn');
        } else {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, { threshold });

  doc.querySelectorAll(selector).forEach(el => observer.observe(el));
  return { observer };
}
