const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Navigation 
function initNav() {
  const navItems = $$('.nav-item');

  const toLowerPath = (window.location.pathname || '').toLowerCase();
  const isInPagesFolder = toLowerPath.includes('/pages/') || toLowerPath.includes('\\pages\\');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (!page) return;
      const pageMapInPages = {
        home: 'home.html',
        search: 'search.html',
        booking: 'booking.html',
        chat: 'chat.html',
        profile: 'profile.html',
      };

      const pageMapFromRoot = {
        home: 'pages/home.html',
        search: 'pages/search.html',
        booking: 'pages/booking.html',
        chat: 'pages/chat.html',
        profile: 'pages/profile.html',
      };

      const target = isInPagesFolder ? pageMapInPages[page] : pageMapFromRoot[page];
      if (target) window.location.href = target;
    });
  });
}

// Auth Page
function initAuth() {
  if (!$('.auth-card')) return;

  // Toggle password visibility
  const eyeBtn = $('.eye-toggle');
  const pwdInput = $('#password');
  if (eyeBtn && pwdInput) {
    eyeBtn.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      eyeBtn.innerHTML = isText
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  }

  // Sign up / Log in toggle
  const signupLink = $('.signup-link');
  const formTitle = $('.form-title');
  const loginBtn = $('.login-btn');
  const subtitleEl = $('.auth-subtitle');
  let isLogin = true;

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      if (formTitle) formTitle.textContent = isLogin ? 'Get Started now' : 'Create Account';
      if (loginBtn) loginBtn.textContent = isLogin ? 'Log In' : 'Sign Up';
      if (subtitleEl) subtitleEl.textContent = isLogin
        ? 'Create an account or log in to explore our app.'
        : 'Fill in your details to get started.';
      signupLink.textContent = isLogin ? 'Sign Up' : 'Log In';
      const toggleText = signupLink.previousSibling;
      if (toggleText) toggleText.textContent = isLogin ? "Don't have an account? " : 'Already have an account? ';
    });
  }

  // Login button → go to home
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      window.location.href = 'Pages/home.html';
    });
  }
}

// Home Page 
function initHome() {
  if (!$('.home-page')) return;

  // Search bar redirect
  const searchBar = $('.home-search-bar');
  if (searchBar) {
    searchBar.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  }

  // Category cards
  const catCards = $$('.category-card');
  catCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      if (cat === 'taxi') {
        window.location.href = 'taxi.html';
      } else {
        window.location.href = `search.html?category=${cat}`;
      }
    });
  });

  initFavoriteToggle();

  const findBtn = $('.find-helper-btn');
  if (findBtn) {
    findBtn.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  }
}

// Search Page 
function initSearch() {
  if (!$('.search-page')) return;

  // Filter pills
  const pills = $$('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterHelpers(pill.dataset.filter);
    });
  });

  // Activate pill from URL param
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('category');
  if (cat) {
    const target = $(`[data-filter="${cat}"]`);
    if (target) {
      pills.forEach(p => p.classList.remove('active'));
      target.classList.add('active');
      filterHelpers(cat);
    }
  }

  initFavoriteToggle();

  // Search input live filter
  const searchInput = $('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      $$('.helper-card').forEach(card => {
        const name = card.querySelector('.helper-name')?.textContent.toLowerCase() || '';
        card.style.display = name.includes(query) ? '' : 'none';
      });
    });
  }
}

function filterHelpers(filter) {
  $$('.helper-card').forEach(card => {
    if (!filter || filter === 'all') {
      card.style.display = '';
    } else {
      const badge = card.querySelector('.service-badge')?.textContent.toLowerCase() || '';
      card.style.display = badge.includes(filter) ? '' : 'none';
    }
  });
}

// Booking Page 
function initBooking() {
  if (!$('.booking-page')) return;

  const tabs = $$('.booking-tab');
  const panels = $$('.booking-panel');

  function setActiveTab(tabValue) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabValue));
    panels.forEach(p => p.classList.toggle('active', p.id === `panel-${tabValue}`));
  }

  // Activate from URL param: ?tab=history | upcoming
  const params = new URLSearchParams(window.location.search);
  const urlTab = params.get('tab');
  if (urlTab) {
    // Only accept existing tab values
    const allowed = new Set(tabs.map(t => t.dataset.tab));
    if (allowed.has(urlTab)) setActiveTab(urlTab);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabValue = tab.dataset.tab;
      setActiveTab(tabValue);
    });
  });

  // View Details buttons
  $$('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showModal(btn.closest('.booking-card').querySelector('.service-title')?.textContent || 'Booking');
    });
  });
}

function showModal(title) {
  let modal = $('#detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'detail-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close">&times;</button>
        <h3 class="modal-title"></h3>
        <p class="modal-body">Your booking details for <strong></strong> are confirmed. Your caregiver will arrive at the scheduled time. You can contact them via the Chat section.</p>
        <button class="modal-cta" onclick="document.getElementById('detail-modal').classList.remove('open')">Got it!</button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
  }
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body strong').textContent = title;
  modal.classList.add('open');
}

// ---------- Chat Page ----------
function initChat() {
  if (!$('.chat-page')) return;

  const chatItems = $$('.chat-item');
  chatItems.forEach(item => {
    item.addEventListener('click', () => {
      openChatThread(item);
    });
  });

  const searchInput = $('.chat-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      chatItems.forEach(item => {
        const name = item.querySelector('.chat-name')?.textContent.toLowerCase() || '';
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }
}

function openChatThread(item) {
  const name = item.querySelector('.chat-name')?.textContent || 'Helper';
  const badge = item.querySelector('.chat-badge-service')?.textContent || '';
  const avatar = item.querySelector('.chat-avatar')?.src || '';

  let thread = $('#chat-thread');
  if (!thread) {
    thread = document.createElement('div');
    thread.id = 'chat-thread';
    thread.className = 'chat-thread-overlay';
    document.body.appendChild(thread);
  }

  thread.innerHTML = `
    <div class="thread-header">
      <button class="thread-back">&larr;</button>
      <img class="thread-avatar" src="${avatar}" alt="${name}">
      <div class="thread-info"><strong>${name}</strong><span>${badge}</span></div>
    </div>
    <div class="thread-messages" id="thread-msgs">
      <div class="msg msg-in"><p>Hi! How can I help with your pet? 🐾</p><span class="msg-time">10:00 AM</span></div>
      <div class="msg msg-out"><p>Hello! I'd like to confirm tomorrow's booking.</p><span class="msg-time">10:02 AM</span></div>
      <div class="msg msg-in"><p>Of course! All confirmed for tomorrow. Your pet is in good hands! 🐶</p><span class="msg-time">10:03 AM</span></div>
    </div>
    <div class="thread-input-area">
      <input type="text" class="thread-input" placeholder="Type a message...">
      <button class="thread-send">&#9658;</button>
    </div>`;

  thread.classList.add('open');

  thread.querySelector('.thread-back').addEventListener('click', () => thread.classList.remove('open'));

  const sendBtn = thread.querySelector('.thread-send');
  const inputEl = thread.querySelector('.thread-input');
  function sendMsg() {
    const text = inputEl.value.trim();
    if (!text) return;
    const msgs = $('#thread-msgs');
    const div = document.createElement('div');
    div.className = 'msg msg-out';
    div.innerHTML = `<p>${text}</p><span class="msg-time">Now</span>`;
    msgs.appendChild(div);
    inputEl.value = '';
    msgs.scrollTop = msgs.scrollHeight;
  }
  sendBtn.addEventListener('click', sendMsg);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

  // Remove unread badge
  const badge2 = item.querySelector('.unread-badge');
  if (badge2) badge2.remove();
}

// Profile Page 
function initProfile() {
  if (!$('.profile-page')) return;

  const logoutBtn = $('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out?')) {
        window.location.href = '../index.html';
      }
    });
  }
}

// Taxi Page
function initTaxi() {
  if (!$('.taxi-page')) return;

  // Ride type selection
  const ridecards = $$('.ride-card');
  ridecards.forEach(card => {
    card.addEventListener('click', () => {
      ridecards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Booking form submit
  const bookBtn = $('.book-taxi-btn');
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const pickup = $('#pickup')?.value.trim();
      const dest = $('#destination')?.value.trim();
      const date = $('#taxi-date')?.value;
      if (!pickup || !dest || !date) {
        alert('Please fill in all required fields before booking.');
        return;
      }
      const ride = $('.ride-card.selected .ride-title')?.textContent || 'Standard';
      window.location.href = 'taxi-confirm.html';
      // alert(`🐾 Booking confirmed!\nService: ${ride}\nPickup: ${pickup}\nDestination: ${dest}\nDate: ${date}\n\nYour pet taxi is on the way!`);
    });
  }
}

function initFavoriteToggle() {
  $$('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.innerHTML = btn.classList.contains('active')
        ? `<svg viewBox="0 0 24 24" fill="#ff6b8a" stroke="#ff6b8a" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
    });
  });
}

// Scroll-reveal animation
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
}

// ---------- Taxi Confirm Page ----------
function initTaxiConfirm() {
  if (!$('.taxi-confirm-page')) return;

  const confirmBtn = $('.tc-confirm-btn');
  const backBtn = $('.tc-back-btn');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'taxi.html';
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      window.location.href = 'taxi-tracking.html';
    });
  }
}

// ---------- Taxi Tracking Page ----------
function initTaxiTracking() {
  if (!$('.taxi-tracking-page')) return;

  const backBtn = $('.tt-back-btn');
  const speechEl = $('#tt-speech');
  const banner = $('#tt-banner');
  const bannerLabel = document.getElementById('tt-banner-label');
  const etaTime = $('#tt-eta-time');
  const etaSupport = $('#tt-eta-support');
  const etaLabel = $('#tt-banner-label');
  const viewDetailsBtn = $('#tt-view-details');

  const safeLabelEl = bannerLabel || null;

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'taxi-confirm.html';
    });
  }

  if (viewDetailsBtn) viewDetailsBtn.classList.remove('show');

  // After 3 seconds: Driver On The Way -> Trip in Progress (label: Trip duration)
  setTimeout(() => {
    const title = $('.tt-title');
    if (title) title.textContent = 'Trip Completed';

    // Hide Cancel button after driver is on the way
    const cancelBtn = $('.tt-cancel-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';

    // Update speech/banner
    if (speechEl) speechEl.textContent = 'Trip Completed';
    if (banner) {
      banner.classList.add('in-progress');
    }

    // Change banner label to requested text
    const bannerLabelEl = $('.tt-banner-label');
    if (bannerLabelEl) bannerLabelEl.textContent = 'Trip duration';

    if (safeLabelEl) safeLabelEl.textContent = 'Trip duration:';
    if (etaTime) etaTime.textContent = '7 min';
    if (etaSupport) etaSupport.textContent = 'We hope your pet had a great ride!';
    if (etaLabel) etaLabel.textContent = 'In Progress';

    if (viewDetailsBtn) viewDetailsBtn.classList.add('show');
  }, 3000);

  // CTA
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener('click', () => {
      window.location.href = 'taxi-complete.html';
    });
  }
}

// ---------- Taxi Complete Page ----------
function initTaxiComplete() {
  if (!$('.tx-complete-page')) return;

  const backBtn = $('.tcx-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = 'booking.html?tab=history';
    });
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAuth();
  initHome();
  initSearch();
  initBooking();
  initChat();
  initProfile();
  initTaxi();
  initTaxiConfirm();
  initTaxiTracking();
  initTaxiComplete();
  initScrollReveal();
});
