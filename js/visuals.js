/* Progressive visual enhancement. No marketing copy is rewritten. */
(function () {
  'use strict';
  var hero = document.querySelector('.hero');
  var inner = hero && hero.querySelector('.hero-inner');
  if (!inner) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = reduced.matches;
  var videos = [];
  var buttons = [];
  var pauseIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h3v12H3zm7 0h3v12h-3z"/></svg>';
  var playIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2l10 6-10 6z"/></svg>';
  function sync() {
    document.body.classList.toggle('motion-paused', paused || document.hidden);
    buttons.forEach(function (button) {
      button.innerHTML = paused ? playIcon : pauseIcon;
      button.setAttribute('aria-label', paused ? 'Play animations' : 'Pause animations');
      button.title = paused ? 'Play animations' : 'Pause animations';
    });
    videos.forEach(function (video) {
      if (paused || document.hidden || video.dataset.visible !== 'true') video.pause();
      else video.play().catch(function () { /* The poster remains visible when autoplay is unavailable. */ });
    });
  }
  function control(parent) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'motion-control';
    button.addEventListener('click', function () { paused = !paused; sync(); });
    parent.appendChild(button);
    buttons.push(button);
  }
  hero.classList.add('visual-hero');
  var copy = document.createElement('div');
  copy.className = 'hero-copy';
  while (inner.firstChild) copy.appendChild(inner.firstChild);
  inner.appendChild(copy);
  var art = document.createElement('div');
  art.className = 'hero-art';
  art.innerHTML = '<img src="assets/formation-sculpture.webp" width="1536" height="1024" alt="" fetchpriority="high"><div class="art-ticks" aria-hidden="true"></div><div class="art-orbit" aria-hidden="true"><div class="orbit-track"></div></div><div class="art-orbit o-two" aria-hidden="true"><div class="orbit-track"></div></div>';
  inner.appendChild(art);
  control(art);
  var discover = document.querySelector('#discover > .wrap');
  if (discover) {
    discover.classList.add('visual-editorial');
    var editorial = document.createElement('div');
    editorial.className = 'editorial-copy';
    while (discover.firstChild) editorial.appendChild(discover.firstChild);
    discover.appendChild(editorial);
    var figure = document.createElement('figure');
    figure.className = 'editorial-art';
    figure.innerHTML = '<img src="assets/career-worlds.webp" width="1024" height="1024" alt="" loading="lazy" decoding="async">';
    discover.appendChild(figure);
  }
  // A short, locally served motion study accompanies the existing universe copy.
  var sectionHead = document.querySelector('#universe .section-head');
  if (sectionHead) {
    var feature = document.createElement('div');
    feature.className = 'visual-feature';
    feature.style.marginBottom = '48px';
    sectionHead.parentNode.insertBefore(feature, sectionHead);
    feature.appendChild(sectionHead);
    var film = document.createElement('div');
    film.className = 'film-art';
    film.innerHTML = '<img src="assets/orbit-poster.webp" alt="" width="960" height="720" loading="lazy"><video muted loop playsinline preload="none" aria-hidden="true" poster="assets/orbit-poster.webp"><source src="assets/formation-orbit.webm" type="video/webm"></video>';
    feature.appendChild(film);
    var video = film.querySelector('video');
    video.muted = true;
    videos.push(video);
    video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    control(film);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { video.dataset.visible = String(entry.isIntersecting); });
        sync();
      }, { rootMargin: '100px' }).observe(film);
    } else video.dataset.visible = 'true';
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', function (event) { paused = event.matches; sync(); });
  // Suspend decorative motion when the hero leaves the viewport.
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
    art.classList.toggle('motion-paused', !entries[0].isIntersecting);
  }).observe(hero);
  sync();
}());
