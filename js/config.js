/* =====================================================================
 * CONFIG — все контакты и ключи в одном месте.
 * Заказчику: замените значения ниже на реальные — больше нигде в коде
 * ничего править не нужно.
 * ===================================================================== */

const SITE_CONFIG = {

  // Базовый URL сайта (для canonical / hreflang / sitemap).
  // На GitHub Pages: 'https://username.github.io/repo-name/'
  // При переезде на свой домен — просто поменяйте эту строку.
  BASE_URL: './',

  // --- Контакты (заглушки — заменить!) ---
  WHATSAPP_NUMBER: '79057774999',          // только цифры, без +, пробелов и скобок
  PHONE_DISPLAY: '+7 905 777-49-99',
  PHONE_LINK: '+79057774999',
  INSTAGRAM_USER: 'dr.gasviani',            // без @
  MAP_URL: 'https://maps.google.com/?q=Dentagram+Clinic,+18+Adam+Mitskevichi+St,+Tbilisi',

  // --- Аналитика (вставьте свои ID — события начнут уходить автоматически) ---
  GA4_ID: 'G-XXXXXXXXXX',                   // Google Analytics 4 Measurement ID
  META_PIXEL_ID: '0000000000000000',        // Meta (Facebook/Instagram) Pixel ID

  // --- Капча (reCAPTCHA v2) ---
  // Получите ключи на https://www.google.com/recaptcha/admin/create (тип: v2 checkbox)
  // и вставьте site key сюда. Пока здесь заглушка, форма работает без капчи
  // (и выводит предупреждение в консоль) — для продакшена ключ обязателен.
  RECAPTCHA_SITE_KEY: '',

  // --- Фото кейсов до/после ---
  // Замените файлы в assets/img/ (или пути ниже) на реальные фото.
  // Тексты кейсов правятся в js/i18n.js (массивы CASES).
  CASE_IMAGES: [
    { before: 'assets/img/case-1-before.jpg', after: 'assets/img/case-1-after.jpg' },
    { before: 'assets/img/case-2-before.jpg', after: 'assets/img/case-2-after.jpg' },
    { before: 'assets/img/case-3-before.jpg', after: 'assets/img/case-3-after.jpg' },
  ],
};
