(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Reveal phone number client-side so it isn't in the static HTML for scrapers.
  var phoneLink = document.getElementById('phoneLink');
  if (phoneLink && phoneLink.dataset.tel) {
    try {
      var num = atob(phoneLink.dataset.tel);
      phoneLink.textContent = num;
      phoneLink.href = 'tel:' + num.replace(/\s+/g, '');
    } catch (e) { /* leave the "Phone" fallback linking to #contact */ }
  }

  // Mobile nav
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('hidden') === false;
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Word-by-word hero split
  var hero = document.getElementById('hero');
  if (hero) {
    hero.querySelectorAll('[data-line]').forEach(function (line) {
      var words = line.textContent.split(' ');
      line.textContent = '';
      words.forEach(function (w, i) {
        var wrap = document.createElement('span');
        wrap.className = 'word';
        var inner = document.createElement('span');
        inner.textContent = w;
        inner.style.transitionDelay = (i * 45) + 'ms';
        wrap.appendChild(inner);
        line.appendChild(wrap);
        if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    });
    requestAnimationFrame(function () {
      setTimeout(function () { hero.classList.add('hero-in'); }, 120);
    });
  }

  // Generic reveals
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = el.dataset.delay ? Number(el.dataset.delay) : 0;
        setTimeout(function () { el.classList.add('in'); }, delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  document.querySelectorAll('.space-y-12 > .reveal, .divide-y > .reveal').forEach(function (el, i) {
    el.dataset.delay = String((i % 4) * 80);
  });

  // Magnetic buttons (pointer devices only)
  var finePointer = window.matchMedia('(pointer:fine)').matches;
  if (finePointer) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var strength = 0.35;
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2);
        var y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (x * strength) + 'px, ' + (y * strength) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = 'translate(0,0)'; });
    });
  }

  // Scroll progress bar
  var progress = document.getElementById('progress');
  if (progress) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      progress.style.transform = 'scaleX(' + p + ')';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // Scroll-spy: light up nav links + section dots
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('header nav a'));
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      var label = entry.target.querySelector('.sticky-label');
      if (label) label.classList.add('active');
      navLinks.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('text-ink', on);
        a.classList.toggle('text-muted', !on);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });

  // Cursor spotlight — hero + content sections (pointer devices only)
  if (finePointer) {
    document.querySelectorAll('.spotlight').forEach(function (sp) {
      var host = sp.parentElement;
      if (!host) return;
      host.addEventListener('mouseenter', function () { sp.classList.add('on'); });
      host.addEventListener('mouseleave', function () { sp.classList.remove('on'); });
      host.addEventListener('mousemove', function (e) {
        var r = host.getBoundingClientRect();
        sp.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        sp.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Contact form — posts to contact.php (PHPMailer + smtp-config.php on the server)
  var form = document.getElementById('contactForm');
  if (!form) return;
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.classList.remove('is-error', 'is-success', 'is-info');
    if (kind) status.classList.add('is-' + kind);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypots — real people leave these empty.
    if (form.website.value || form.company.value) return;

    if (!form.checkValidity()) {
      setStatus('Please complete the required fields.', 'error');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', 'info');

    fetch(form.getAttribute('action') || 'contact.php', {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: new FormData(form),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.ok) {
          form.reset();
          setStatus('Thanks — your message is on its way.', 'success');
        } else {
          setStatus((result.data && result.data.error) || 'Something went wrong. Please try again.', 'error');
        }
      })
      .catch(function () {
        setStatus('Could not send right now. Please email nk@karni.net.au directly.', 'error');
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
