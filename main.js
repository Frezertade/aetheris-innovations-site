document.addEventListener('DOMContentLoaded', () => {
  // Urgency Banner: show unless dismissed previously
  const urgencyBanner = document.getElementById('urgency-banner');
  if (urgencyBanner) {
    let dismissed = false;
    try { dismissed = localStorage.getItem('aetheris_urgency_dismissed') === '1'; } catch (_) {}
    if (dismissed) {
      urgencyBanner.style.display = 'none';
    } else {
      document.body.classList.add('has-urgency-banner');
      const closeBtn = urgencyBanner.querySelector('.urgency-banner-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          urgencyBanner.style.display = 'none';
          document.body.classList.remove('has-urgency-banner');
          try { localStorage.setItem('aetheris_urgency_dismissed', '1'); } catch (_) {}
        });
      }
    }
  }

  // Cursor Glow Effect
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  revealElements.forEach(el => {
    el.classList.add('reveal-ready'); // Make visible by default
    observer.observe(el);
  });

  // Client-side HTML includes (simple runtime include injector)
  async function loadIncludes() {
    const includeEls = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(includeEls).map(async el => {
      try {
        const path = el.getAttribute('data-include');
        // Normalize to absolute path from site root
        const url = path.startsWith('/') ? path : '/' + path;
        const res = await fetch(url);
        if (!res.ok) return;
        const text = await res.text();
        el.innerHTML = text;
        // Execute inline scripts inside the included fragment
        el.querySelectorAll('script').forEach(oldScript => {
          const script = document.createElement('script');
          if (oldScript.src) {
            script.src = oldScript.src;
          } else {
            script.textContent = oldScript.textContent;
          }
          document.body.appendChild(script);
          oldScript.remove();
        });
      } catch (e) {
        console.error('Include load failed for', el, e);
      }
    }));
  }

  // Load any HTML includes (e.g., shared footer)
  loadIncludes();

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact Form AJAX Submission
  const contactForm = document.querySelector('.contact-form-full');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const form = e.target;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Success - show thank you message
          form.innerHTML = `
            <div class="form-success">
              <div class="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </div>
          `;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        // Error - show error message and reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // Show error message
        const errorMsg = document.createElement('p');
        errorMsg.className = 'form-error';
        errorMsg.textContent = 'Something went wrong. Please try again or email us directly.';
        
        // Remove existing error if any
        const existingError = form.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        form.appendChild(errorMsg);
      }
    });
  }

  // Futuristic 3D Hero Canvas - Orbital Rings
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = () => window.innerWidth < 768;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = null;
    let rings = [];
    let particles = [];

    const createElements = () => {
      const mobile = isMobile();
      const baseRadius = Math.min(width, height) * (mobile ? 0.38 : 0.36);
      
      // Create orbital rings
      rings = [
        { radius: baseRadius * 0.6, tiltX: 0.8, tiltY: 0.2, speed: 0.0004, hue: 210, width: mobile ? 1.5 : 2 },
        { radius: baseRadius * 0.85, tiltX: 0.3, tiltY: 0.7, speed: -0.0003, hue: 260, width: mobile ? 1.2 : 1.8 },
        { radius: baseRadius * 1.1, tiltX: 0.6, tiltY: 0.5, speed: 0.00025, hue: 185, width: mobile ? 1 : 1.5 },
      ];

      // Create floating particles
      const particleCount = mobile ? 35 : 80;
      particles = Array.from({ length: particleCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const dist = baseRadius * (0.3 + Math.random() * 0.9);
        return {
          x: Math.cos(angle) * dist,
          y: (Math.random() - 0.5) * baseRadius * 1.2,
          z: Math.sin(angle) * dist,
          size: mobile ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3,
          hue: 190 + Math.random() * 80,
          speed: 0.0001 + Math.random() * 0.0003,
          phase: Math.random() * Math.PI * 2
        };
      });
    };

    const resize = () => {
      const rect = heroCanvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      heroCanvas.width = Math.floor(width * dpr);
      heroCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createElements();
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const mobile = isMobile();

      // Draw glowing core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.15);
      coreGrad.addColorStop(0, 'rgba(96, 165, 250, 0.25)');
      coreGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.1)');
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Draw orbital rings
      rings.forEach(ring => {
        const rotation = time * ring.speed;
        ctx.save();
        ctx.translate(cx, cy);
        
        // Create 3D tilt effect
        const tiltScale = 0.3 + ring.tiltX * 0.4;
        ctx.scale(1, tiltScale);
        ctx.rotate(rotation + ring.tiltY * Math.PI);

        // Ring glow
        const segments = mobile ? 60 : 100;
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const nextAngle = ((i + 1) / segments) * Math.PI * 2;
          const pulseAlpha = 0.3 + 0.4 * Math.sin(time * 0.001 + angle * 3);
          
          ctx.strokeStyle = `hsla(${ring.hue}, 85%, 65%, ${pulseAlpha})`;
          ctx.lineWidth = ring.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(0, 0, ring.radius, angle, nextAngle + 0.02);
          ctx.stroke();
        }
        ctx.restore();
      });

      // Draw floating particles with 3D projection
      const fov = Math.min(width, height) * 1.2;
      particles.forEach(p => {
        const angle = time * p.speed + p.phase;
        const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        const y = p.y + Math.sin(time * 0.001 + p.phase) * 15;
        
        const scale = fov / (fov + z);
        const screenX = cx + x * scale;
        const screenY = cy + y * scale;
        const size = p.size * scale;
        const alpha = 0.4 + scale * 0.5;

        // Particle glow
        const glowGrad = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 3);
        glowGrad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${alpha})`);
        glowGrad.addColorStop(0.4, `hsla(${p.hue}, 90%, 60%, ${alpha * 0.3})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = `hsla(${p.hue}, 95%, 80%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Center orb
      const orbPulse = 1 + 0.1 * Math.sin(time * 0.002);
      const orbSize = Math.min(width, height) * (mobile ? 0.06 : 0.05) * orbPulse;
      const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbSize);
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      orbGrad.addColorStop(0.3, 'rgba(96, 165, 250, 0.8)');
      orbGrad.addColorStop(0.7, 'rgba(192, 132, 252, 0.4)');
      orbGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, orbSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (time) => {
      draw(time);
      if (!prefersReducedMotion.matches) {
        animationId = requestAnimationFrame(render);
      }
    };

    const start = () => {
      if (animationId) cancelAnimationFrame(animationId);
      resize();
      render(performance.now());
    };

    start();

    window.addEventListener('resize', () => {
      resize();
      if (prefersReducedMotion.matches) {
        draw(0);
      }
    });

    prefersReducedMotion.addEventListener('change', () => {
      if (prefersReducedMotion.matches) {
        if (animationId) cancelAnimationFrame(animationId);
        draw(0);
        return;
      }
      start();
    });
  }

  // ============================================
  // AI Chat Assistant Widget
  // ============================================
  initChatWidget();
});

function initChatWidget() {
  // Suggested questions to lower the "what do I ask?" barrier
  const SUGGESTED_QUESTIONS = [
    'What is Money Magnet AI?',
    'How can AI help me get more leads?',
    'Can you automate my follow-up?',
    'Book a revenue audit'
  ];

  // Create chat widget HTML
  const chatHTML = `
    <div id="chat-widget" class="chat-widget">
      <div id="chat-welcome-bubble" class="chat-welcome-bubble" role="button" tabindex="0" aria-label="Open chat assistant">
        <button class="chat-welcome-close" aria-label="Dismiss">×</button>
        <strong>👋 This is the AI revenue assistant we build for businesses.</strong><br>
        Ask how Money Magnet AI captures leads and books calls.
      </div>
      <button id="chat-toggle" class="chat-toggle" aria-label="Open chat assistant">
        <svg class="chat-icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="chat-icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div id="chat-window" class="chat-window" style="display:none;">
        <div class="chat-header">
          <div class="chat-header-info">
            <div class="chat-avatar">🤖</div>
            <div>
              <div class="chat-title">Aetheris Assistant</div>
              <div class="chat-status">Ask me anything about our services</div>
            </div>
          </div>
          <button id="chat-close" class="chat-close" aria-label="Close chat">×</button>
        </div>

        <div id="chat-messages" class="chat-messages">
          <div class="chat-message assistant">
            <div class="message-content">
              Hi! 👋 I'm the Aetheris assistant — this is the kind of AI lead-capture experience we build into Money Magnet AI. I can explain our revenue systems, automation, custom software, or help you book a free audit. How can I help?
            </div>
          </div>
        </div>

        <div id="chat-suggestions" class="chat-suggestions">
          ${SUGGESTED_QUESTIONS.map(q => `<button type="button" class="chat-suggestion" data-question="${q.replace(/"/g, '&quot;')}">${q}</button>`).join('')}
        </div>

        <form id="chat-form" class="chat-form">
          <input
            type="text"
            id="chat-input"
            class="chat-input"
            placeholder="Type your message..."
            autocomplete="off"
          />
          <button type="submit" class="chat-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `;

  // Inject chat widget into the page
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  // Get elements
  const chatWidget = document.getElementById('chat-widget');
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const chatSuggestions = document.getElementById('chat-suggestions');
  const welcomeBubble = document.getElementById('chat-welcome-bubble');
  const welcomeCloseBtn = welcomeBubble.querySelector('.chat-welcome-close');
  const iconOpen = chatToggle.querySelector('.chat-icon-open');
  const iconClose = chatToggle.querySelector('.chat-icon-close');

  let chatHistory = [];
  let isOpen = false;
  let welcomeShown = false;

  // Dismiss welcome bubble and stop pulsing
  function dismissWelcome() {
    if (welcomeShown) {
      welcomeBubble.classList.remove('visible');
      chatToggle.classList.add('pulse-stopped');
      welcomeShown = false;
      try { localStorage.setItem('aetheris_chat_seen', '1'); } catch (_) {}
    }
  }

  // Show welcome bubble after delay on first visit
  const alreadySeen = (() => { try { return localStorage.getItem('aetheris_chat_seen') === '1'; } catch (_) { return false; } })();
  if (!alreadySeen) {
    setTimeout(() => {
      if (!isOpen) {
        welcomeBubble.classList.add('visible');
        welcomeShown = true;
      }
    }, 4500);
  } else {
    // Still stop the pulsing ring for returning visitors
    chatToggle.classList.add('pulse-stopped');
  }

  // Dismiss bubble on its close button (but don't open chat)
  welcomeCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissWelcome();
  });

  // Clicking the bubble itself opens the chat
  welcomeBubble.addEventListener('click', () => {
    dismissWelcome();
    if (!isOpen) toggleChat();
  });

  // Keyboard support for the bubble (Enter/Space)
  welcomeBubble.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dismissWelcome();
      if (!isOpen) toggleChat();
    }
  });

  // Toggle chat window
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    iconOpen.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    chatToggle.classList.toggle('active', isOpen);

    if (isOpen) {
      dismissWelcome();
      chatInput.focus();
    }
  }

  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  // Suggested-question chips → populate input and submit
  chatSuggestions.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-suggestion');
    if (!btn) return;
    const question = btn.dataset.question;
    if (!question) return;
    chatInput.value = question;
    chatSuggestions.style.display = 'none';
    chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  // Add message to chat
  function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    const formattedContent = role === 'assistant' ? formatMessage(content) : escapeHtml(content);
    messageDiv.innerHTML = `<div class="message-content">${formattedContent}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Format assistant message with proper styling
  function formatMessage(text) {
    // First escape HTML
    let formatted = escapeHtml(text);
    
    // Convert markdown-style bold **text** to <strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown-style bullet points
    formatted = formatted.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>)+/gs, '<ul>$&</ul>');
    
    // Convert numbered lists (1. 2. 3.)
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // Convert line breaks to <br> (but not inside lists)
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Clean up paragraph tags
    if (formatted.includes('</p><p>')) {
      formatted = '<p>' + formatted + '</p>';
    }
    
    // Convert URLs to clickable links. Strip trailing punctuation that's
    // almost certainly not part of the URL — e.g., when the LLM writes
    // "(https://example.com)" the closing paren shouldn't end up in the
    // href (Firebase Dynamic Links rejects calendar.app.google/...) as
    // an "invalid dynamic link"). Same for trailing . , ; : ! ? ] ' "
    formatted = formatted.replace(
      /(https?:\/\/[^\s<]+)/g,
      (match) => {
        const cleaned = match.replace(/[).,;:!?\]'"”]+$/, '');
        const trailing = match.slice(cleaned.length);
        return `<a href="${cleaned}" target="_blank" rel="noopener">${cleaned}</a>${trailing}`;
      }
    );
    
    // Convert email addresses to mailto links
    formatted = formatted.replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>'
    );
    
    return formatted;
  }

  // Add typing indicator
  function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Handle form submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    chatInput.disabled = true;

    // Hide suggestions once the conversation has started
    if (chatSuggestions) chatSuggestions.style.display = 'none';

    // Add to history
    chatHistory.push({ role: 'user', content: message });

    // Show typing indicator
    const typingIndicator = addTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          history: chatHistory.slice(-10) 
        })
      });

      // Remove typing indicator
      typingIndicator.remove();

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      
      // Add assistant response
      addMessage(data.reply, 'assistant');
      chatHistory.push({ role: 'assistant', content: data.reply });

    } catch (error) {
      typingIndicator.remove();
      addMessage('Sorry, I\'m having trouble connecting right now. Please email us at fkifle@aetherisinnovations.com or book a call at https://calendar.app.google/JajCvPZdws3fpAL18', 'assistant');
    }

    chatInput.disabled = false;
    chatInput.focus();
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat();
    }
  });
}

// ===================================
// TESTIMONIALS SLIDER
// ===================================
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.testimonial-nav-btn.prev');
  const nextBtn = document.querySelector('.testimonial-nav-btn.next');
  
  if (!track || cards.length === 0) return;
  
  let currentIndex = 0;
  let autoPlayInterval;
  
  const getCardsPerView = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  };
  
  const getMaxIndex = () => Math.max(0, cards.length - getCardsPerView());
  
  const updateSlider = () => {
    const cardWidth = cards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };
  
  const goToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
    updateSlider();
  };
  
  const nextSlide = () => {
    currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
    updateSlider();
  };
  
  const prevSlide = () => {
    currentIndex = currentIndex <= 0 ? getMaxIndex() : currentIndex - 1;
    updateSlider();
  };
  
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  };
  
  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };
  
  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); nextSlide(); startAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); prevSlide(); startAutoPlay(); });
  
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); });
  });
  
  // Pause on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
  
  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    startAutoPlay();
  }, { passive: true });
  
  // Handle resize
  window.addEventListener('resize', () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updateSlider();
  });
  
  // Initialize
  updateSlider();
  startAutoPlay();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTestimonialsSlider();
});
