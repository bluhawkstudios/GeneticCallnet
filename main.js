const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const aboutDropdown = document.getElementById('about-dropdown');

function updateNav() {
  nav?.classList.toggle('scrolled', window.scrollY > 24);
}

updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

function closeMenu() {
  navLinks?.classList.remove('open');
  hamburger?.classList.remove('active');
  hamburger?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

if (hamburger && navLinks) {
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'nav-links');
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

if (aboutDropdown) {
  const toggle = aboutDropdown.querySelector('.dropdown-toggle');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.addEventListener('click', event => {
    event.stopPropagation();
    const open = aboutDropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!aboutDropdown.contains(event.target)) {
      aboutDropdown.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    aboutDropdown?.classList.remove('open');
    if (typeof closeModal === 'function') closeModal();
  }
});

// Repair text that was saved with a legacy encoding.
const textFixes = new Map([
  ['â€“', '–'], ['â€”', '—'], ['â†’', '→'], ['Â©', '©'], ['Â·', '·'],
  ['â€¦', '…'], ['âœ…', '✓'], ['âœ•', '×'], ['âœ¨', '✦'],
  ['ðŸ”', '⌕'], ['ðŸ†', '✓'], ['ðŸ‘”', '◆'], ['ðŸ”„', '↻'],
  ['â±ï¸', '◷'], ['âœˆï¸', '✈'], ['ðŸš€', '↗'], ['ðŸ’¼', '▣'],
  ['ðŸ’¡', '✦'], ['ðŸ“š', '▤'], ['ðŸŽ‰', '✺'], ['ðŸ§ ', '◉'],
  ['ðŸ¦', '▦'], ['ðŸ’»', '⌘'], ['ðŸ­', '▥'], ['ðŸ›’', '◇'],
  ['ðŸŽ­', '◈'], ['ðŸ¢', '▧'], ['ðŸ‡®ðŸ‡³', 'IN'], ['ðŸ‡¦ðŸ‡ª', 'UAE'],
  ['âœ‰ï¸', '@'], ['ðŸŒ', '◉'], ['1â€“3', '1–3'], ['3â€“6', '3–6'], ['6â€“10', '6–10']
]);

const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const nodes = [];
while (walker.nextNode()) nodes.push(walker.currentNode);
nodes.forEach(node => {
  let value = node.nodeValue;
  textFixes.forEach((replacement, broken) => { value = value.split(broken).join(replacement); });
  node.nodeValue = value;
});
document.title = [...textFixes].reduce((value, [broken, replacement]) => value.split(broken).join(replacement), document.title);

// Floating WhatsApp shortcut across all pages.
if (!document.querySelector('.floating-whatsapp')) {
  const floatingWhatsApp = document.createElement('a');
  floatingWhatsApp.href = 'https://wa.link/q0jb32';
  floatingWhatsApp.className = 'floating-whatsapp';
  floatingWhatsApp.target = '_blank';
  floatingWhatsApp.rel = 'noopener';
  floatingWhatsApp.setAttribute('aria-label', 'Chat on WhatsApp');
  floatingWhatsApp.innerHTML = '<img src="WhatsApp_icon.png" alt="" />';
  document.body.appendChild(floatingWhatsApp);
}

// Progressive reveal, with a no-JS-safe default in CSS.
const revealTargets = document.querySelectorAll(
  '.why-card, .service-card, .svc-full-card, .adv-card, .leader-card, .industry-card, .number-card, .mv-card, .step, .contact-card'
);
if ('IntersectionObserver' in window) {
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transition = 'opacity .55s ease, transform .55s ease, border-color .28s ease, box-shadow .28s ease';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    });
  }, { threshold: .08 });
  revealTargets.forEach(el => observer.observe(el));
}

function handleFormSubmit(btn) {
  const fields = {
    name: document.getElementById('contact-name'),
    company: document.getElementById('contact-company'),
    email: document.getElementById('contact-email'),
    phone: document.getElementById('contact-phone'),
    service: document.getElementById('contact-service'),
    message: document.getElementById('contact-message')
  };

  const requiredFields = [fields.name, fields.email, fields.phone, fields.service, fields.message];
  const firstInvalid = requiredFields.find((field) => field && !field.checkValidity());
  if (firstInvalid) {
    firstInvalid.reportValidity();
    return;
  }

  const text = [
    'Hello Genetic Callnet,',
    '',
    'I would like to discuss a hiring requirement.',
    '',
    `Name: ${fields.name.value.trim()}`,
    `Company: ${fields.company.value.trim() || 'Not provided'}`,
    `Email: ${fields.email.value.trim()}`,
    `Phone: ${fields.phone.value.trim()}`,
    `Service Needed: ${fields.service.value}`,
    '',
    `Message: ${fields.message.value.trim()}`
  ].join('\n');

  btn.textContent = 'Opening WhatsApp…';
  btn.disabled = true;
  window.open(`https://wa.me/919833936564?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    const msg = document.getElementById('form-success');
    if (msg) {
      msg.textContent = '✅ WhatsApp opened with your message. Please tap send to complete.';
      msg.style.display = 'block';
    }
  }, 600);
}
