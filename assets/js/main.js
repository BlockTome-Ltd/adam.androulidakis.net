// Decrypt-style reveal for [data-scramble] 
(() => {
  const els = document.querySelectorAll('[data-scramble]');
  if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const GLYPHS = '01#/\\<>[]{}_=+*%';

  function scramble(el) {
    const final = el.textContent;
    const dur = 350 + final.length * 55;
    const start = performance.now();
    let last = 0;

    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      if (p < 1 && now - last < 45) return requestAnimationFrame(tick);
      last = now;
      const settled = Math.floor(p * final.length);
      let out = final.slice(0, settled);
      for (let i = settled; i < final.length; i++) {
        out += final[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Keep the real text available to assistive tech while glyphs churn
  els.forEach((el) => {
    const host = el.closest('h1, h2') || el;
    if (!host.hasAttribute('aria-label')) host.setAttribute('aria-label', host.textContent.trim().replace(/\s+/g, ' '));
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      scramble(e.target);
    });
  }, { threshold: 0.4 });

  els.forEach((el) => io.observe(el));
})();
