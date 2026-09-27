// Ссылка на ваш Telegram — поменяйте здесь, и она обновится во всех кнопках
const TELEGRAM_URL = 'https://t.me/Mike71911';

document.querySelectorAll('[data-tg]').forEach((a) => { a.href = TELEGRAM_URL; });

// Год в футере
document.getElementById('year').textContent = new Date().getFullYear();

// Шапка: фон при скролле
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

const setMenu = (open) => {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('is-open', open);
  header.classList.toggle('menu-open', open);
};

burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Появление блоков при скролле
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Лёгкая «лесенка» для соседних элементов
  revealEls.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Мокап чата: сообщения появляются по очереди
const chat = document.getElementById('chatMock');
if (chat) {
  const msgs = chat.querySelectorAll('.msg');
  const play = () => {
    msgs.forEach((m, i) => setTimeout(() => m.classList.add('is-shown'), reduceMotion ? 0 : 400 + i * 900));
  };
  if ('IntersectionObserver' in window) {
    const chatIo = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { play(); chatIo.disconnect(); }
    }, { threshold: 0.4 });
    chatIo.observe(chat);
  } else {
    play();
  }
}

// FAQ: открыт только один пункт + плавное раскрытие
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach((item) => {
  const summary = item.querySelector('summary');

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = item.hasAttribute('open');

    faqItems.forEach((other) => {
      if (other !== item && other.hasAttribute('open')) toggle(other, false);
    });
    toggle(item, !isOpen);
  });

  function toggle(el, open) {
    const body = el.querySelector('.faq__answer');
    if (reduceMotion) { el.toggleAttribute('open', open); return; }

    if (open) {
      el.setAttribute('open', '');
      const h = body.scrollHeight;
      body.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
    } else {
      const h = body.scrollHeight;
      const anim = body.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 280, easing: 'ease-in' });
      anim.onfinish = () => el.removeAttribute('open');
    }
  }
});
