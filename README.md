# Сайт Ираклия Гасвиани — инструкция

Статический одностраничный сайт (без сборки): HTML + CSS + vanilla JS.
Просто загрузите содержимое этой папки в репозиторий GitHub и включите
GitHub Pages (Settings → Pages → Deploy from branch → main, root).

## Что куда заливать

Всё содержимое папки — в корень репозитория:

```
index.html      — главная страница
privacy.html    — политика конфиденциальности (EN)
css/style.css   — стили
js/config.js    — ⚙️ КОНФИГ: контакты, аналитика, капча (править здесь!)
js/i18n.js      — 📝 ВСЕ ТЕКСТЫ на RU / EN / KA (править здесь!)
js/main.js      — логика (обычно трогать не нужно)
assets/img/     — фото
robots.txt, sitemap.xml
```

## Перед публикацией — чек-лист

Всё делается в двух файлах: `js/config.js` и `js/i18n.js`.

1. **js/config.js**
   - `WHATSAPP_NUMBER` — номер врача (только цифры, напр. `995577123456`);
   - `PHONE_DISPLAY` / `PHONE_LINK` — телефон;
   - `INSTAGRAM_USER` — ник без @;
   - `MAP_URL` — ссылка на Google Maps;
   - `GA4_ID` — ID Google Analytics 4 (G-…), иначе аналитика не собирается;
   - `META_PIXEL_ID` — ID пикселя Meta;
   - `RECAPTCHA_SITE_KEY` — ключ reCAPTCHA v2 (checkbox),
     получить: https://www.google.com/recaptcha/admin/create
     (добавьте домен сайта в список разрешённых). Без ключа форма
     работает без капчи — для продакшена так делать не надо;
   - `BASE_URL` — адрес сайта (для canonical/hreflang).

2. **robots.txt и sitemap.xml** — замените `https://username.github.io/repo-name/`
   на реальный адрес.

3. **js/i18n.js** — замените все заглушки в квадратных скобках [так]:
   образование, стаж, цены, сроки, график. Тестовые отзывы — обязательно
   заменить на реальные.

4. **Фото** — положите свои файлы в `assets/img/`:
   - `hero.jpg` — главное фото;
   - `about.jpg`, `work-1..3.jpg` — блок «О враче»;
   - `case-1-before.jpg` / `case-1-after.jpg` и т.д. — кейсы до/после.
   Формат JPG, до ~300 КБ на файл. Пути можно поменять в `js/config.js`
   (массив `CASE_IMAGES`).

## Как добавить кейс / отзыв / вопрос

В `js/i18n.js` в каждом языке (`ru`, `en`, `ka`) есть массивы:
`cases`, `reviews`, `faq`, `services`, `steps`, `adv`.
Скопируйте один блок `{…}` и отредактируйте — на сайте появится новый элемент.
Для нового кейса добавьте фото в `assets/img/` и запись в `CASE_IMAGES` (config.js).

## Аналитика: события

После ввода GA4_ID / META_PIXEL_ID автоматически отправляются:
`form_submit`, `whatsapp_click`, `phone_click`, `instagram_click`,
`map_click`, `case_view`, `scroll_75`, `language_switch`.
В интерфейсах GA4/Meta отметьте нужные как конверсии.

## Локальный просмотр

```
python3 -m http.server 8000
```
и открыть http://localhost:8000
