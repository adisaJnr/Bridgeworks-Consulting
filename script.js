var contactEmail = 'info@bridgeworksconsultingltd.com';
var formEndpoint = 'https://formspree.io/f/xkjgyraz';
var formMarkup = '<form class="f" novalidate><label>Full name<input name="name" autocomplete="name"><span class="err"></span></label><label>Email<input name="email" type="email" autocomplete="email"><span class="err"></span></label><label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label><label>Service of interest<select name="svc"><option>Business Advisory &amp; Strategy</option><option>HR &amp; Talent Solutions</option><option>Training &amp; Capacity Development</option><option>MSME Development &amp; Access to Finance</option></select></label><label>Message<textarea name="msg" rows="4"></textarea><span class="err"></span></label><p class="note">When you submit, your request will be sent securely to our team.</p><button class="btn gold" type="submit">Send message</button><p class="form-status" role="status"></p></form>';

function deliver(subject, fields, status, onSuccess) {
  var body = Object.keys(fields).map(function (key) {
    return key + ': ' + fields[key];
  }).join('\n');
  var mailto = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

  status.textContent = 'Sending...';

  fetch(formEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(Object.assign({ subject: subject }, fields))
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Form service rejected the submission.');
    }

    status.textContent = 'Thank you. Your message has been sent.';
    if (onSuccess) {
      onSuccess();
    }
  }).catch(function () {
    status.textContent = 'Sending failed, so your message has not been delivered. ';
    var fallback = document.createElement('a');
    fallback.href = mailto;
    fallback.className = 'email-action';
    fallback.textContent = 'Send it by email instead';
    status.appendChild(fallback);
    status.appendChild(document.createTextNode(', or write to ' + contactEmail + '.'));
  });
}

document.querySelector('.menu').addEventListener('click', function () {
  var menu = document.getElementById('menu');
  var isOpen = menu.classList.toggle('open');
  this.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('#menu a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.getElementById('menu').classList.remove('open');
    document.querySelector('.menu').setAttribute('aria-expanded', 'false');
  });
});

['cf', 'mf'].forEach(function (id) {
  var container = document.getElementById(id);
  container.innerHTML = formMarkup;

  var form = container.querySelector('form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var fields = form.elements;
    var status = form.querySelector('.form-status');
    status.textContent = '';
    var isValid = true;

    function setError(name, message) {
      var error = fields[name].parentNode.querySelector('.err');
      var hasError = Boolean(message);
      error.textContent = message;
      fields[name].setAttribute('aria-invalid', String(hasError));
      isValid = isValid && !hasError;
    }

    setError('name', fields.name.value.trim().length < 2 ? 'Enter your name.' : '');
    setError('email', /^\S+@\S+\.\S+$/.test(fields.email.value) ? '' : 'Enter a valid email address.');
    setError('msg', fields.msg.value.trim().length < 10 ? 'Tell us a little more (10+ characters).' : '');

    if (isValid) {
      deliver('Enquiry: ' + fields.svc.value, {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        service: fields.svc.value,
        message: fields.msg.value.trim()
      }, status, function () {
        form.reset();
      });
    }
  });
});

var bookingDialog = document.getElementById('bm');
document.querySelectorAll('[data-book]').forEach(function (link) {
  link.addEventListener('click', function (event) {
    event.preventDefault();
    bookingDialog.showModal();
  });
});

document.getElementById('bx').addEventListener('click', function () {
  bookingDialog.close();
});

bookingDialog.addEventListener('click', function (event) {
  if (event.target === bookingDialog) {
    bookingDialog.close();
  }
});

var isDark = matchMedia('(prefers-color-scheme: dark)').matches;
document.getElementById('tg').addEventListener('click', function () {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

var testimonials = [
  [
    'Bridgeworks Consulting provided practical advice and hands-on support that helped us streamline our operations and grow our business. Their team truly understands the challenges of SMEs.',
    'Managing Director, Retail Business, Lagos'
  ],
  [
    'Their HR and training support gave our team clear structure and real confidence in how we work.',
    'Operations Lead, Logistics Company, Abuja'
  ],
  [
    'We came in with an idea and left with a funding-ready plan and a clear path to growth.',
    'Founder, Agribusiness Startup, Enugu'
  ]
];
var currentTestimonial = 0;

function showTestimonial() {
  document.getElementById('qt').textContent = '\u201C' + testimonials[currentTestimonial][0] + '\u201D';
  document.getElementById('qa').textContent = '\u2014 ' + testimonials[currentTestimonial][1];
}

document.getElementById('prev').addEventListener('click', function () {
  currentTestimonial = (currentTestimonial + testimonials.length - 1) % testimonials.length;
  showTestimonial();
});

document.getElementById('next').addEventListener('click', function () {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial();
});

showTestimonial();

document.getElementById('sb').addEventListener('click', function () {
  var email = document.getElementById('em').value;
  var status = document.getElementById('msg');
  status.textContent = '';

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    status.textContent = 'Enter a valid email address.';
    return;
  }

  deliver('Newsletter subscription', {
    email: email.trim(),
    request: 'Please add this email address to the Newsletter list.'
  }, status, function () {
    document.getElementById('em').value = '';
  });
});
