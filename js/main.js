/* ===== Dr. Irakli Gasviani — site logic ===== */
(function () {
  'use strict';
  const cfg = SITE_CONFIG;
  let lang = localStorage.getItem('lang') || (new URLSearchParams(location.search)).get('lang') || 'ka';
  if (!I18N[lang]) lang = 'ru';

  /* ---------- Аналитика: GA4 + Meta Pixel ---------- */
  function loadAnalytics() {
    if (cfg.GA4_ID && cfg.GA4_ID !== 'G-XXXXXXXXXX') {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + cfg.GA4_ID;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', cfg.GA4_ID);
    }
    if (cfg.META_PIXEL_ID && cfg.META_PIXEL_ID !== '0000000000000000') {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', cfg.META_PIXEL_ID);
      fbq('track', 'PageView');
    }
  }
  // Единая функция отправки события в GA4 и Meta Pixel
  function track(event, params) {
    if (window.gtag) gtag('event', event, params || {});
    if (window.fbq) fbq('trackCustom', event, params || {});
  }

  /* ---------- Капча (reCAPTCHA v2) ---------- */
  let captchaReady = false;
  if (cfg.RECAPTCHA_SITE_KEY) {
    window.onCaptchaLoad = function () {
      grecaptcha.render('captchaContainer', { sitekey: cfg.RECAPTCHA_SITE_KEY });
      captchaReady = true;
    };
    const s = document.createElement('script');
    s.async = true; s.defer = true;
    s.src = 'https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit';
    document.head.appendChild(s);
  } else {
    console.warn('[config] RECAPTCHA_SITE_KEY не задан — форма работает без капчи. Для продакшена добавьте ключ в js/config.js');
  }

  /* ---------- Рендер динамических блоков ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderDynamic() {
    const d = I18N[lang];

    document.getElementById('servicesList').innerHTML = d.services.map((s, i) => `
      <div class="service reveal">
        <span class="service-num">0${i + 1}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`).join('');

    document.getElementById('stepsList').innerHTML = `
      <div class="steps-line"></div><div class="steps-progress" id="stepsProgress"></div>` +
      d.steps.map((s, i) => `
      <li class="step reveal${i === 0 ? ' active' : ''}" data-step="${i}">
        <span class="step-marker" aria-hidden="true"></span>
        <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
      </li>`).join('');

    document.getElementById('casesGrid').innerHTML = d.cases.map((c, i) => {
      const img = cfg.CASE_IMAGES[i] || cfg.CASE_IMAGES[0];
      const body = c.texts
        ? c.texts.map(p => `<p>${esc(p)}</p>`).join('')
        : `<dl>
            <dt>${d.t['cases.problem']}</dt><dd>${esc(c.problem)}</dd>
            <dt>${d.t['cases.solution']}</dt><dd>${esc(c.solution)}</dd>
            <dt>${d.t['cases.result']}</dt><dd>${esc(c.result)}</dd>
          </dl>`;
      const thumbs = img.after2 ? `
        <div class="ba-thumbs" role="group" aria-label="${d.t['cases.after']}">
          <button type="button" class="ba-thumb active" data-src="${img.after}"><img src="${img.after}" alt="" loading="lazy"></button>
          <button type="button" class="ba-thumb" data-src="${img.after2}"><img src="${img.after2}" alt="" loading="lazy"></button>
        </div>` : '';
      return `
      <article class="case reveal">
        <div class="ba-slider" data-case="${i + 1}">
          <img class="ba-before" src="${img.before}" alt="${esc(c.title)} — ${d.t['cases.before']}" loading="lazy" width="900" height="650">
          <div class="ba-after-wrap"><img src="${img.after}" alt="${esc(c.title)} — ${d.t['cases.after']}" loading="lazy" width="900" height="650"></div>
          <span class="ba-tag before">${d.t['cases.before']}</span>
          <span class="ba-tag after">${d.t['cases.after']}</span>
          <div class="ba-handle"></div>
        </div>
        ${thumbs}
        <div class="case-text">
          <h3>${esc(c.title)}</h3>
          ${body}
        </div>
      </article>`;
    }).join('');

    document.getElementById('advGrid').innerHTML = d.adv.map((a, i) => `
      <div class="adv-item reveal${i === 0 ? ' active' : ''}" data-adv="${i}">
        <span class="adv-num">0${i + 1}</span>
        <h3 class="adv-title">${esc(a.title)}</h3>
        <div class="adv-body"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>
      </div>`).join('');

    document.getElementById('reviewsGrid').innerHTML = `
      <div class="reviews-carousel">
        <div class="reviews-track" id="reviewsTrack">
          ${d.reviews.map(r => `
          <figure class="review">
            <div class="review-stars">★★★★★</div>
            <blockquote>«${esc(r.text)}»</blockquote><cite>${esc(r.author)}</cite>
          </figure>`).join('')}
        </div>
        <div class="carousel-nav">
          <button type="button" class="carousel-btn" id="revPrev" aria-label="Previous">←</button>
          <div class="carousel-dots" id="revDots">
            ${d.reviews.map((_, i) => `<button type="button" data-dot="${i}" class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}"></button>`).join('')}
          </div>
          <button type="button" class="carousel-btn" id="revNext" aria-label="Next">→</button>
        </div>
      </div>`;

    document.getElementById('faqList').innerHTML = d.faq.map(f => `
      <div class="faq-item reveal">
        <button type="button" class="faq-q" aria-expanded="false">
          <span>${esc(f.q)}</span><span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a"><p>${esc(f.a)}</p></div>
      </div>`).join('');

    initSliders();
    initFaq();
    initAdv();
    initSteps();
    initReviews();
    renderMarquee();
    observeReveals();
  }

  /* ---------- Смена языка ---------- */
  function applyLang(l) {
    lang = l;
    localStorage.setItem('lang', l);
    const d = I18N[l];
    document.documentElement.lang = l;
    document.title = d.meta.title;
    document.querySelector('meta[name="description"]').setAttribute('content', d.meta.desc);
    document.getElementById('og-title').setAttribute('content', d.meta.title);
    document.getElementById('og-desc').setAttribute('content', d.meta.desc);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = d.t[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    // в form.note есть ссылка на политику — пересобираем её с сохранением ссылки
    const note = document.querySelector('.form-note');
    if (note) {
      const linkText = { ru: 'политикой конфиденциальности', en: 'privacy policy', ka: 'კონფიდენციალურობის პოლიტიკას' }[l];
      const txt = d.t['form.note'];
      const link = '<a href="privacy.html" target="_blank">' + linkText + '</a>';
      note.innerHTML = txt.includes(linkText) ? txt.replace(linkText, link) : txt + ' ' + link;
    }
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
    renderDynamic();
  }

  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.lang !== lang) {
        applyLang(b.dataset.lang);
        track('language_switch', { language: b.dataset.lang });
      }
    });
  });

  /* ---------- Слайдеры до/после ---------- */
  function initSliders() {
    document.querySelectorAll('.ba-slider').forEach(sl => {
      const wrap = sl.querySelector('.ba-after-wrap');
      const handle = sl.querySelector('.ba-handle');
      const img = sl.querySelector('.ba-after-wrap img');
      const set = pct => {
        pct = Math.max(0, Math.min(100, pct));
        wrap.style.width = pct + '%';
        img.style.width = (10000 / pct || 100) + '%'; // удерживаем пропорции
        handle.style.left = pct + '%';
      };
      set(50);
      let dragging = false, tracked = false;
      const move = e => {
        if (!dragging) return;
        const r = sl.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        set(x / r.width * 100);
        if (!tracked) { tracked = true; track('case_view', { case_id: sl.dataset.case }); }
      };
      sl.addEventListener('pointerdown', e => { dragging = true; sl.setPointerCapture(e.pointerId); move(e); });
      sl.addEventListener('pointermove', move);
      ['pointerup', 'pointercancel'].forEach(ev => sl.addEventListener(ev, () => dragging = false));
    });

    // Переключение второго фото «после» (миниатюры под слайдером)
    document.querySelectorAll('.ba-thumbs').forEach(group => {
      const afterImg = group.closest('.case').querySelector('.ba-after-wrap img');
      group.querySelectorAll('.ba-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('.ba-thumb').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          afterImg.src = btn.dataset.src;
        });
      });
    });
  }

  /* ---------- FAQ аккордеон ---------- */
  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement, a = item.querySelector('.faq-a');
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
      });
    });
  }

  /* ---------- Преимущества: горизонтальный аккордеон ---------- */
  function initAdv() {
    document.querySelectorAll('.adv-item').forEach(item => {
      const activate = () => {
        document.querySelectorAll('.adv-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      };
      item.addEventListener('click', activate);
      item.addEventListener('mouseenter', () => { if (window.matchMedia('(hover:hover)').matches) activate(); });
    });
  }

  /* ---------- Этапы: интерактивный таймлайн ---------- */
  function initSteps() {
    const steps = Array.from(document.querySelectorAll('.step'));
    const progress = document.getElementById('stepsProgress');
    const update = idx => {
      steps.forEach((s, i) => s.classList.toggle('active', i <= idx));
      if (progress && steps.length) {
        const last = steps[steps.length - 1];
        const cur = steps[idx];
        progress.style.height = (cur.offsetTop + 30) + 'px';
      }
    };
    steps.forEach((s, i) => {
      s.addEventListener('click', () => update(i));
      s.addEventListener('mouseenter', () => { if (window.matchMedia('(hover:hover)').matches) update(i); });
    });
    update(0);
  }

  /* ---------- Отзывы: карусель ---------- */
  let revTimer = null;
  function initReviews() {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;
    const dots = Array.from(document.querySelectorAll('#revDots button'));
    const total = dots.length;
    let idx = 0;
    const go = i => {
      idx = (i + total) % total;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach((d, j) => d.classList.toggle('active', j === idx));
    };
    document.getElementById('revPrev').addEventListener('click', () => { go(idx - 1); restart(); });
    document.getElementById('revNext').addEventListener('click', () => { go(idx + 1); restart(); });
    dots.forEach(d => d.addEventListener('click', () => { go(+d.dataset.dot); restart(); }));
    // свайп
    let x0 = null;
    track.addEventListener('pointerdown', e => x0 = e.clientX);
    track.addEventListener('pointerup', e => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 40) { go(idx + (dx < 0 ? 1 : -1)); restart(); }
      x0 = null;
    });
    const restart = () => { clearInterval(revTimer); revTimer = setInterval(() => go(idx + 1), 6000); };
    restart();
    track.closest('.reviews-carousel').addEventListener('mouseenter', () => clearInterval(revTimer));
    track.closest('.reviews-carousel').addEventListener('mouseleave', restart);
  }

  /* ---------- Бегущая строка ---------- */
  function renderMarquee() {
    const d = I18N[lang];
    const words = [d.t['hero.slogan'], ...d.services.map(s => s.title)];
    const half = words.map(w => '<span>' + esc(w) + ' <i>✦</i></span>').join('');
    document.getElementById('marqueeTrack').innerHTML = half + half;
  }

  /* ---------- Reveal-анимация ---------- */
  let revealObserver;
  function observeReveals() {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
      }, { threshold: 0.12 });
    }
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }

  /* ---------- Контакты из конфига ---------- */
  function applyContacts() {
    const wa = document.getElementById('whatsappLink');
    wa.href = 'https://wa.me/' + cfg.WHATSAPP_NUMBER;
    document.getElementById('whatsappValue').textContent = cfg.PHONE_DISPLAY;
    const ph = document.getElementById('phoneLink');
    ph.href = 'tel:' + cfg.PHONE_LINK;
    document.getElementById('phoneValue').textContent = cfg.PHONE_DISPLAY;
    const ig = document.getElementById('instagramLink');
    ig.href = 'https://instagram.com/' + cfg.INSTAGRAM_USER;
    document.getElementById('instagramValue').textContent = '@' + cfg.INSTAGRAM_USER;
    document.getElementById('mapLink').href = cfg.MAP_URL;
  }

  // Отслеживание кликов по контактам
  document.querySelectorAll('[data-track]').forEach(a => {
    a.addEventListener('click', () => track(a.dataset.track, { lang }));
  });

  /* ---------- Форма → WhatsApp ---------- */
  document.getElementById('bookingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const err = document.getElementById('formError');
    const d = I18N[lang];
    const f = new FormData(this);
    const name = (f.get('name') || '').trim();
    const contact = (f.get('contact') || '').trim();
    const language = f.get('language');
    const message = (f.get('message') || '').trim();

    err.hidden = true;
    if (!name || !contact) { err.textContent = d.t['form.errorRequired']; err.hidden = false; return; }
    if (captchaReady && !grecaptcha.getResponse()) { err.textContent = d.t['form.errorCaptcha']; err.hidden = false; return; }

    const text = d.waMessage
      .replace('{name}', name).replace('{contact}', contact)
      .replace('{language}', language).replace('{message}', message || '—');
    track('form_submit', { lang, language });
    window.open('https://wa.me/' + cfg.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  /* ---------- Мобильное меню ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mobileNav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open'); navToggle.classList.remove('open');
  }));

  /* ---------- scroll_75 ---------- */
  let scrolled75 = false;
  window.addEventListener('scroll', () => {
    if (scrolled75) return;
    const h = document.documentElement;
    if ((h.scrollTop + h.clientHeight) / h.scrollHeight >= 0.75) {
      scrolled75 = true; track('scroll_75', { lang });
    }
  }, { passive: true });

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  loadAnalytics();
  applyContacts();
  applyLang(lang);
})();
