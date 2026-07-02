(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('hidden') === false;
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.add('hidden');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = 'text-sm ' + (kind === 'error' ? 'text-clay-dark' : kind === 'success' ? 'text-green-700' : 'text-ink/60');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      company: form.company.value.trim(), // honeypot
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Please fill in your name, email and message.', 'error');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', 'info');

    fetch('../api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data.ok) {
          form.reset();
          setStatus('Thanks — your message is on its way. I\'ll be in touch soon.', 'success');
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
