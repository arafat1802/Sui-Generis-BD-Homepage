import { jest } from '@jest/globals';
import { initThemeToggle, initMobileMenu, initContactForm, initScrollReveal } from '../src/scripts/ui.js';

describe('UI helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    window.localStorage.clear();
  });

  describe('initThemeToggle', () => {
    it('sets dark theme when saved', () => {
      document.body.innerHTML = '<button id="themeBtn"></button>';
      window.localStorage.setItem('theme', 'dark');

      initThemeToggle();

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('toggles theme on click and persists', () => {
      document.body.innerHTML = '<button id="themeBtn"></button>';
      document.documentElement.setAttribute('data-theme', 'dark');

      initThemeToggle();

      document.getElementById('themeBtn').click();

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(window.localStorage.getItem('theme')).toBe('light');
    });

    it('uses system preference when no saved theme', () => {
      document.body.innerHTML = '<button id="themeBtn"></button>';
      const media = () => ({ matches: true });

      initThemeToggle({ media });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('initMobileMenu', () => {
    it('toggles menu open/close on button click', () => {
      document.body.innerHTML = `
        <nav>
          <ul id="navMenu"><li><a href="/">Home</a></li></ul>
          <button id="mobileMenuBtn"></button>
        </nav>
      `;

      initMobileMenu();

      const btn = document.getElementById('mobileMenuBtn');
      const menu = document.getElementById('navMenu');

      btn.click();
      expect(btn.classList.contains('active')).toBe(true);
      expect(menu.classList.contains('active')).toBe(true);

      btn.click();
      expect(btn.classList.contains('active')).toBe(false);
      expect(menu.classList.contains('active')).toBe(false);
    });

    it('closes menu when clicking a link', () => {
      document.body.innerHTML = `
        <nav>
          <ul id="navMenu" class="active"><li><a href="/">Home</a></li></ul>
          <button id="mobileMenuBtn" class="active"></button>
        </nav>
      `;

      initMobileMenu();

      document.querySelector('#navMenu a').click();

      expect(document.getElementById('mobileMenuBtn').classList.contains('active')).toBe(false);
      expect(document.getElementById('navMenu').classList.contains('active')).toBe(false);
    });

    it('closes menu when clicking outside', () => {
      document.body.innerHTML = `
        <nav>
          <ul id="navMenu" class="active"><li><a href="/">Home</a></li></ul>
          <button id="mobileMenuBtn" class="active"></button>
        </nav>
        <div id="outside"></div>
      `;

      initMobileMenu();

      document.getElementById('outside').click();

      expect(document.getElementById('mobileMenuBtn').classList.contains('active')).toBe(false);
      expect(document.getElementById('navMenu').classList.contains('active')).toBe(false);
    });
  });

  describe('initContactForm', () => {
    it('calls onSubmit with form data and resets', () => {
      document.body.innerHTML = `
        <form id="contactForm">
          <input name="name" />
          <input name="email" />
        </form>
      `;

      const onSubmit = jest.fn();
      const { contactForm } = initContactForm({ onSubmit });

      contactForm.querySelector('[name="name"]').value = 'Arafat';
      contactForm.querySelector('[name="email"]').value = 'test@example.com';

      contactForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      expect(onSubmit).toHaveBeenCalledWith({ name: 'Arafat', email: 'test@example.com' });
      expect(contactForm.querySelector('[name="name"]').value).toBe('');
    });
  });

  describe('initScrollReveal', () => {
    it('reveals elements on intersection', () => {
      document.body.innerHTML = '<div class="animate-up"></div>';

      const mockObserve = jest.fn();
      const mockIntersectionObserver = jest.fn((cb) => {
        cb([{ target: document.querySelector('.animate-up'), isIntersecting: true }]);
        return { observe: mockObserve };
      });

      initScrollReveal({ win: { IntersectionObserver: mockIntersectionObserver }, doc: document });

      const el = document.querySelector('.animate-up');
      expect(el.style.opacity).toBe('1');
      expect(el.style.transform).toBe('translateY(0)');
    });
  });
});
