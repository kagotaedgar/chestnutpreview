/* Chestnut site script. Progressive enhancement only: the site reads fine without it. */
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    });
  }


  // Client-experience carousel
  document.querySelectorAll('.testimonial-carousel').forEach(function(root){
    var slides=Array.prototype.slice.call(root.querySelectorAll('.testimonial-slide'));
    var dots=Array.prototype.slice.call(root.querySelectorAll('.testimonial-dots button'));
    if(!slides.length)return; var index=0, timer;
    function show(n){index=(n+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('is-active',k===index);s.setAttribute('aria-hidden',k===index?'false':'true')});dots.forEach(function(d,k){d.classList.toggle('is-active',k===index)});restart();}
    function restart(){clearInterval(timer);timer=setInterval(function(){show(index+1)},7000);}
    root.querySelector('.testimonial-prev').addEventListener('click',function(){show(index-1)});
    root.querySelector('.testimonial-next').addEventListener('click',function(){show(index+1)});
    dots.forEach(function(d,k){d.addEventListener('click',function(){show(k)})});
    root.addEventListener('mouseenter',function(){clearInterval(timer)});root.addEventListener('mouseleave',restart);show(0);
  });

  // Analytics events (only fire if gtag exists)
  function track(name, params) { if (window.gtag) window.gtag('event', name, params || {}); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    if (h.indexOf('tel:') === 0) track('phone_click');
    else if (h.indexOf('wa.me') > -1) track('whatsapp_click');
    else if (h.indexOf('mailto:') === 0) track('email_click');
  });

  // Conditional fields on the quote form
  var cover = document.getElementById('cover');
  function syncConditional() {
    if (!cover) return;
    var group = cover.options[cover.selectedIndex] ? cover.options[cover.selectedIndex].getAttribute('data-group') : '';
    document.querySelectorAll('.conditional').forEach(function (el) {
      el.hidden = el.getAttribute('data-for').split(' ').indexOf(group) === -1;
    });
  }
  if (cover) {
    var q = new URLSearchParams(location.search).get('cover');
    if (q) { for (var i = 0; i < cover.options.length; i++) { if (cover.options[i].value === q) cover.selectedIndex = i; } }
    cover.addEventListener('change', syncConditional);
    syncConditional();
  }

  // Forms: validation, then delivery by whichever route is configured
  document.querySelectorAll('form[data-chestnut-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    function say(kind, msg) { status.className = 'form-status show ' + kind; status.textContent = msg; status.focus(); }
    function fieldErr(input, msg) {
      var box = input.closest('.field'); var err = box && box.querySelector('.err');
      if (msg) { input.setAttribute('aria-invalid', 'true'); if (err) err.textContent = msg; }
      else { input.removeAttribute('aria-invalid'); if (err) err.textContent = ''; }
    }
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return; // honeypot
      var bad = null;
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        if (el.closest('[hidden]')) return;
        var v = (el.value || '').trim(), msg = '';
        if (el.required && el.type === 'checkbox' && !el.checked) msg = 'Please tick this box to continue.';
        else if (el.required && el.type !== 'checkbox' && !v) msg = 'This field is required.';
        else if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) msg = 'Enter a valid email address.';
        else if (el.type === 'tel' && v && !/^[+\d][\d\s\-()]{6,}$/.test(v)) msg = 'Enter a valid phone number.';
        fieldErr(el, msg); if (msg && !bad) bad = el;
      });
      if (bad) { bad.focus(); say('bad', 'Please check the highlighted fields.'); return; }

      var data = {}; new FormData(form).forEach(function (v, k) { if (k !== 'website') data[k] = v; });
      data._form = form.getAttribute('data-chestnut-form'); data._page = location.pathname;
      var endpoint = form.getAttribute('data-endpoint'), email = form.getAttribute('data-email');

      if (endpoint) {
        say('warn', 'Sending...');
        fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); syncConditional(); track('form_submit', { form: data._form }); say('ok', 'Thank you. Your enquiry has been sent. An advisor will get back to you.'); })
          .catch(function () { say('bad', 'We could not send your enquiry. Please try again, or contact us directly using the details on this page.'); });
      } else if (email) {
        var lines = Object.keys(data).filter(function (k) { return k.charAt(0) !== '_' && data[k]; }).map(function (k) { return k + ': ' + data[k]; });
        location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(form.getAttribute('data-subject') || 'Enquiry') + '&body=' + encodeURIComponent(lines.join('\n'));
        track('form_submit', { form: data._form, route: 'mailto' });
        say('warn', 'Your email app should now open with your enquiry filled in. Nothing is sent until you press send in your email app. This website does not store your details.');
      } else {
        say('warn', 'Your details look complete, but this form is not connected to an inbox yet, so nothing has been sent or stored. Please use the contact details on this site instead.');
      }
    });
  });
})();
