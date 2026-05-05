// ============================================
// Aetheris Analytics, A/B Testing & CX Module
// ============================================

// Configuration - Replace with your actual IDs
const ANALYTICS_CONFIG = {
  // Google Analytics 4 - Get from: analytics.google.com
  GA_MEASUREMENT_ID: 'G-H8H9B4X0W6',
  
  // Microsoft Clarity - Get from: clarity.microsoft.com
  CLARITY_PROJECT_ID: 'v434m7u6ot',
  
  // PostHog - Get from: posthog.com (optional, for A/B testing)
  POSTHOG_API_KEY: 'phc_3QxjWOvuhXETkgzi4EyskWYwHNLhvv5UqG11NFLCX7K',
  POSTHOG_HOST: 'https://app.posthog.com'
};

// ============================================
// Cookie Consent Management
// ============================================
const CookieConsent = {
  COOKIE_NAME: 'aetheris_cookie_consent',
  COOKIE_DURATION: 365, // days
  
  // Get current consent status
  getConsent: function() {
    const consent = localStorage.getItem(this.COOKIE_NAME);
    return consent ? JSON.parse(consent) : null;
  },
  
  // Save consent preferences
  saveConsent: function(preferences) {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(this.COOKIE_NAME, JSON.stringify(consent));
    return consent;
  },
  
  // Check if user has given consent
  hasConsent: function() {
    return this.getConsent() !== null;
  },
  
  // Check if analytics is allowed
  isAnalyticsAllowed: function() {
    const consent = this.getConsent();
    return consent && consent.analytics === true;
  },
  
  // Create and show cookie banner
  showBanner: function() {
    if (this.hasConsent()) return;
    
    const bannerHTML = `
      <div id="cookie-banner" class="cookie-banner">
        <div class="cookie-content">
          <div class="cookie-text">
            <h3>🍪 We value your privacy</h3>
            <p>We use cookies to enhance your browsing experience and analyze site traffic. Choose which cookies you'd like to allow.</p>
          </div>
          <div class="cookie-options">
            <label class="cookie-option">
              <input type="checkbox" id="cookie-essential" checked disabled />
              <span class="cookie-option-info">
                <strong>Essential</strong>
                <small>Required for basic website functionality</small>
              </span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" id="cookie-analytics" />
              <span class="cookie-option-info">
                <strong>Analytics</strong>
                <small>Help us understand how visitors use our site (Google Analytics)</small>
              </span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" id="cookie-experience" />
              <span class="cookie-option-info">
                <strong>Experience</strong>
                <small>Session recordings & heatmaps to improve UX (Microsoft Clarity)</small>
              </span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" id="cookie-personalization" />
              <span class="cookie-option-info">
                <strong>Personalization</strong>
                <small>A/B testing & personalized experiences (PostHog)</small>
              </span>
            </label>
          </div>
          <div class="cookie-buttons">
            <button id="cookie-save" class="cookie-btn cookie-btn-secondary">Save Preferences</button>
            <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Accept All</button>
          </div>
          <div class="cookie-links">
            <a href="/privacy.html">Privacy Policy</a> · <a href="/terms.html">Terms of Service</a>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    
    // Add event listeners
    document.getElementById('cookie-accept').addEventListener('click', () => {
      this.acceptAll();
    });
    
    document.getElementById('cookie-save').addEventListener('click', () => {
      this.savePreferences();
    });
  },
  
  // Hide banner
  hideBanner: function() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('cookie-banner-hidden');
      setTimeout(() => banner.remove(), 300);
    }
  },
  
  // Hide modal
  hideModal: function() {
    const modal = document.getElementById('cookie-modal');
    if (modal) {
      modal.classList.add('cookie-modal-hidden');
      setTimeout(() => modal.remove(), 300);
    }
  },
  
  // Accept all cookies
  acceptAll: function() {
    this.saveConsent({
      essential: true,
      analytics: true,
      experience: true,
      personalization: true
    });
    this.hideBanner();
    this.hideModal();
    initTrackingServices();
  },
  
  // Save user preferences from checkboxes
  savePreferences: function() {
    const analytics = document.getElementById('cookie-analytics')?.checked || false;
    const experience = document.getElementById('cookie-experience')?.checked || false;
    const personalization = document.getElementById('cookie-personalization')?.checked || false;
    
    this.saveConsent({
      essential: true,
      analytics: analytics,
      experience: experience,
      personalization: personalization
    });
    this.hideBanner();
    this.hideModal();
    
    if (analytics || experience || personalization) {
      initTrackingServices();
    }
  },
  
  // Show settings modal (for managing preferences later)
  showSettings: function() {
    const consent = this.getConsent() || { essential: true, analytics: false, experience: false, personalization: false };
    
    const modalHTML = `
      <div id="cookie-modal" class="cookie-modal">
        <div class="cookie-modal-content">
          <div class="cookie-modal-header">
            <h3>🍪 Cookie Preferences</h3>
            <button id="cookie-modal-close" class="cookie-modal-close">×</button>
          </div>
          <div class="cookie-modal-body">
            <p>Manage your cookie preferences. Essential cookies cannot be disabled as they are required for the website to function.</p>
            <div class="cookie-options">
              <label class="cookie-option">
                <input type="checkbox" id="cookie-essential" checked disabled />
                <span class="cookie-option-info">
                  <strong>Essential</strong>
                  <small>Required for basic website functionality</small>
                </span>
              </label>
              <label class="cookie-option">
                <input type="checkbox" id="cookie-analytics" ${consent.analytics ? 'checked' : ''} />
                <span class="cookie-option-info">
                  <strong>Analytics</strong>
                  <small>Help us understand how visitors use our site (Google Analytics)</small>
                </span>
              </label>
              <label class="cookie-option">
                <input type="checkbox" id="cookie-experience" ${consent.experience ? 'checked' : ''} />
                <span class="cookie-option-info">
                  <strong>Experience</strong>
                  <small>Session recordings & heatmaps to improve UX (Microsoft Clarity)</small>
                </span>
              </label>
              <label class="cookie-option">
                <input type="checkbox" id="cookie-personalization" ${consent.personalization ? 'checked' : ''} />
                <span class="cookie-option-info">
                  <strong>Personalization</strong>
                  <small>A/B testing & personalized experiences (PostHog)</small>
                </span>
              </label>
            </div>
          </div>
          <div class="cookie-modal-footer">
            <button id="cookie-modal-save" class="cookie-btn cookie-btn-secondary">Save Preferences</button>
            <button id="cookie-modal-accept" class="cookie-btn cookie-btn-primary">Accept All</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('cookie-modal-close').addEventListener('click', () => this.hideModal());
    document.getElementById('cookie-modal-save').addEventListener('click', () => this.savePreferences());
    document.getElementById('cookie-modal-accept').addEventListener('click', () => this.acceptAll());
    
    // Close on backdrop click
    document.getElementById('cookie-modal').addEventListener('click', (e) => {
      if (e.target.id === 'cookie-modal') this.hideModal();
    });
  },
  
  // Reject non-essential cookies
  rejectNonEssential: function() {
    this.saveConsent({
      essential: true,
      analytics: false,
      experience: false,
      personalization: false
    });
    this.hideBanner();
  },
  
  // Revoke consent (for privacy settings page)
  revokeConsent: function() {
    localStorage.removeItem(this.COOKIE_NAME);
    // Clear analytics cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('_ga') || name.startsWith('_clarity') || name.startsWith('ph_')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });
    window.location.reload();
  }
};

// Make CookieConsent available globally
window.CookieConsent = CookieConsent;

// ============================================
// 1. Google Analytics 4 Setup
// ============================================
function initGoogleAnalytics() {
  // gtag.js is loaded inline from each page's <head> (per Google's manual
  // install recommendation). window.gtag is therefore already present and
  // Analytics.track() below will forward custom events to GA4 automatically.
  if (typeof window.gtag === 'function') {
    console.log('[Analytics] gtag present — GA4 (' + ANALYTICS_CONFIG.GA_MEASUREMENT_ID + ') ready');
  } else {
    console.log('[Analytics] gtag not loaded — check the inline snippet in <head>');
  }
}

// ============================================
// 2. Microsoft Clarity Setup (Free Heatmaps & Session Recording)
// ============================================
function initClarity() {
  const consent = CookieConsent.getConsent();
  if (!consent || !consent.experience) {
    console.log('[Analytics] Microsoft Clarity not consented - skipping');
    return;
  }
  
  if (ANALYTICS_CONFIG.CLARITY_PROJECT_ID === 'xxxxxxxxxx') {
    console.log('[Analytics] Microsoft Clarity not configured - skipping');
    return;
  }

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", ANALYTICS_CONFIG.CLARITY_PROJECT_ID);

  console.log('[Analytics] Microsoft Clarity initialized');
}

// ============================================
// 3. PostHog Setup (A/B Testing & Feature Flags)
// ============================================
function initPostHog() {
  const consent = CookieConsent.getConsent();
  if (!consent || !consent.personalization) {
    console.log('[Analytics] PostHog not consented - skipping');
    return;
  }
  
  if (ANALYTICS_CONFIG.POSTHOG_API_KEY === 'phc_xxxxxxxxxxxxxxxxxxxx') {
    console.log('[Analytics] PostHog not configured - skipping');
    return;
  }

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  
  posthog.init(ANALYTICS_CONFIG.POSTHOG_API_KEY, {
    api_host: ANALYTICS_CONFIG.POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true
  });

  console.log('[Analytics] PostHog initialized');
}

// ============================================
// 4. Custom Event Tracking
// ============================================
const Analytics = {
  // Track custom events
  track: function(eventName, properties = {}) {
    // Google Analytics
    if (window.gtag) {
      gtag('event', eventName, properties);
    }
    
    // PostHog
    if (window.posthog) {
      posthog.capture(eventName, properties);
    }
    
    console.log('[Analytics] Event tracked:', eventName, properties);
  },

  // Track page views (for SPAs)
  pageView: function(pageName, pageUrl) {
    if (window.gtag) {
      gtag('config', ANALYTICS_CONFIG.GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: pageUrl || window.location.href
      });
    }
    
    if (window.posthog) {
      posthog.capture('$pageview', { $current_url: pageUrl });
    }
  },

  // Track conversions
  conversion: function(conversionType, value = 0, currency = 'USD') {
    this.track('conversion', {
      conversion_type: conversionType,
      value: value,
      currency: currency
    });
  },

  // Track CTA clicks
  ctaClick: function(ctaName, ctaLocation) {
    this.track('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      page: window.location.pathname
    });
  },

  // Track form submissions
  formSubmit: function(formName, formData = {}) {
    this.track('form_submit', {
      form_name: formName,
      ...formData
    });
  },

  // Track scroll depth
  scrollDepth: function(percentage) {
    this.track('scroll_depth', {
      depth_percentage: percentage,
      page: window.location.pathname
    });
  },

  // Identify user (for returning visitors)
  identify: function(userId, traits = {}) {
    if (window.posthog) {
      posthog.identify(userId, traits);
    }
    
    if (window.gtag) {
      gtag('set', 'user_properties', traits);
    }
  }
};

// ============================================
// 5. A/B Testing Helper
// ============================================
const ABTest = {
  // Get feature flag value
  getVariant: function(flagName, defaultValue = false) {
    if (window.posthog && posthog.isFeatureEnabled) {
      return posthog.getFeatureFlag(flagName) || defaultValue;
    }
    return defaultValue;
  },

  // Check if feature is enabled
  isEnabled: function(flagName) {
    if (window.posthog && posthog.isFeatureEnabled) {
      return posthog.isFeatureEnabled(flagName);
    }
    return false;
  },

  // Run callback when feature flags are loaded
  onReady: function(callback) {
    if (window.posthog && posthog.onFeatureFlags) {
      posthog.onFeatureFlags(callback);
    } else {
      // If PostHog isn't configured, run callback immediately
      callback();
    }
  },

  // Run A/B test with variants
  run: function(testName, variants, callback) {
    const variant = this.getVariant(testName, 'control');
    
    if (variants[variant]) {
      variants[variant]();
    } else if (variants.control) {
      variants.control();
    }
    
    // Track which variant was shown
    Analytics.track('ab_test_impression', {
      test_name: testName,
      variant: variant
    });

    if (callback) callback(variant);
  }
};

// ============================================
// 6. Customer Experience Tracking
// ============================================
const CXTracking = {
  // Track time on page
  startTime: Date.now(),
  
  // Initialize CX tracking
  init: function() {
    this.trackScrollDepth();
    this.trackEngagement();
    this.trackExitIntent();
    this.trackTimeOnPage();
  },

  // Track scroll depth milestones
  trackScrollDepth: function() {
    const milestones = [25, 50, 75, 90, 100];
    const tracked = new Set();

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone);
          Analytics.scrollDepth(milestone);
        }
      });
    }, { passive: true });
  },

  // Track user engagement (clicks, hovers on key elements)
  trackEngagement: function() {
    // Track CTA button clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const text = target.textContent.trim();
      const href = target.getAttribute('href');
      const classList = Array.from(target.classList).join(' ');

      // Track primary CTAs
      if (target.classList.contains('btn-primary') || 
          target.classList.contains('cta-button') ||
          text.toLowerCase().includes('book') ||
          text.toLowerCase().includes('get started') ||
          text.toLowerCase().includes('contact')) {
        Analytics.ctaClick(text, window.location.pathname);
      }

      // Track outbound links
      if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
        Analytics.track('outbound_link', {
          url: href,
          text: text
        });
      }

      // Track calendar bookings (Google Calendar — was Calendly)
      if (href && (href.includes('calendar.app.google') || href.includes('calendar.google.com') || href.includes('calendly'))) {
        Analytics.conversion('calendar_booking_click');
      }
    });

    // Track pricing card interactions (pointer + keyboard)
    document.querySelectorAll('.pricing-card').forEach((card, index) => {
      // make cards focusable so keyboard users can trigger events
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');

      const getPlanName = () => {
        return card.dataset.plan ||
          card.querySelector('.pricing-tier')?.textContent?.trim() ||
          card.querySelector('h3')?.textContent?.trim() ||
          `Plan ${index + 1}`;
      };

      const trackHover = () => {
        const planName = getPlanName();
        Analytics.track('pricing_card_hover', { plan: planName });
      };

      // Pointer hover (mouse)
      card.addEventListener('pointerenter', trackHover);

      // Keyboard focus (accessibility)
      card.addEventListener('focusin', trackHover);
    });
  },

  // Track exit intent
  trackExitIntent: function() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseout', (e) => {
      if (exitIntentShown) return;
      
      // Check if mouse left the viewport from the top
      if (e.clientY < 10 && e.relatedTarget === null) {
        exitIntentShown = true;
        Analytics.track('exit_intent', {
          page: window.location.pathname,
          time_on_page: Math.round((Date.now() - this.startTime) / 1000)
        });
      }
    });
  },

  // Track time on page when leaving
  trackTimeOnPage: function() {
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
      Analytics.track('page_time', {
        page: window.location.pathname,
        seconds: timeOnPage
      });
    });

    // Also track when visibility changes (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
        Analytics.track('page_visibility_hidden', {
          page: window.location.pathname,
          seconds: timeOnPage
        });
      }
    });
  },

  // Track form field interactions
  trackFormFields: function(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const fields = form.querySelectorAll('input, textarea, select');
    const interacted = new Set();

    fields.forEach(field => {
      field.addEventListener('focus', () => {
        if (!interacted.has(field.name)) {
          interacted.add(field.name);
          Analytics.track('form_field_focus', {
            form: formSelector,
            field: field.name || field.id
          });
        }
      });
    });

    form.addEventListener('submit', () => {
      Analytics.formSubmit(formSelector, {
        fields_filled: interacted.size,
        total_fields: fields.length
      });
    });
  }
};

// ============================================
// 7. Initialize Tracking Services (after consent)
// ============================================
function initTrackingServices() {
  if (!CookieConsent.isAnalyticsAllowed()) {
    console.log('[Analytics] Analytics not allowed - skipping initialization');
    return;
  }
  
  // Initialize tracking services
  initGoogleAnalytics();
  initClarity();
  initPostHog();

  // Initialize CX tracking
  CXTracking.init();

  console.log('[Analytics] All analytics modules initialized');
}

// ============================================
// 8. Main Initialization
// ============================================
function initAnalytics() {
  // Make utilities available globally (even without consent)
  window.Analytics = Analytics;
  window.ABTest = ABTest;
  window.CXTracking = CXTracking;
  
  // Check for existing consent
  if (CookieConsent.isAnalyticsAllowed()) {
    // User has already consented - initialize tracking
    initTrackingServices();
  } else if (!CookieConsent.hasConsent()) {
    // No consent yet - show banner
    CookieConsent.showBanner();
  }
  // If hasConsent but !isAnalyticsAllowed, user rejected - do nothing
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnalytics);
} else {
  initAnalytics();
}

// Export for module usage
export { Analytics, ABTest, CXTracking, CookieConsent, initAnalytics, ANALYTICS_CONFIG };
