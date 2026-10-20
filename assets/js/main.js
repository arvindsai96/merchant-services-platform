/**
 * PayFlowPro - Main Interactive Engine
 * Handles Navbar, Counters, Pricing Toggles, Accordions, Back-to-Top
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Sticky Header Scroll Effect & Navbar Management
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  function updateHeaderScroll() {
    if (window.scrollY > 20) {
      if (header) header.classList.add('scrolled');
      if (backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
      if (header) header.classList.remove('scrolled');
      if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Auto-close mobile navbar collapse when clicking links
  const navbarCollapse = document.getElementById('navbarContent');
  if (navbarCollapse) {
    const navLinks = navbarCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .header-auth-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show') && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        }
      });
    });
  }

  // 1b. Enhanced Hover & Keyboard accessibility for Desktop Dropdowns
  const dropdownItems = document.querySelectorAll('.site-header .nav-item.dropdown');
  dropdownItems.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    let hoverTimeout;

    function openDropdown() {
      if (window.innerWidth >= 992) {
        clearTimeout(hoverTimeout);
        dropdown.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('show');
      }
    }

    function closeDropdown() {
      if (window.innerWidth >= 992) {
        hoverTimeout = setTimeout(() => {
          dropdown.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('show');
        }, 120);
      }
    }

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', closeDropdown);

    // Keyboard accessibility
    dropdown.addEventListener('focusin', openDropdown);
    dropdown.addEventListener('focusout', (e) => {
      if (!dropdown.contains(e.relatedTarget)) {
        closeDropdown();
      }
    });

    // On mobile / small screens, keep Bootstrap default touch/click behavior
  });

  // Smooth section navigation with exact sticky navbar height offset
  function getNavbarHeightOffset() {
    return (header ? header.offsetHeight : 70) + 12;
  }

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href*="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const hash = href.substring(hashIndex);
    if (!hash || hash.length <= 1) return;

    const path = href.substring(0, hashIndex);
    const currentPageFile = window.location.pathname.split('/').pop() || 'index.html';
    const isSamePage = !path || path === currentPageFile || path === window.location.href.split('#')[0];

    if (isSamePage) {
      try {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();
          const scrollY = window.scrollY !== undefined ? window.scrollY : (window.pageYOffset || 0);
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + scrollY - getNavbarHeightOffset();

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });

          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, hash);
          }
        }
      } catch (err) {
        // Fallback for non-standard selector
      }
    }
  });

  // Handle URL hash on initial page load
  if (window.location.hash) {
    setTimeout(() => {
      try {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          const scrollY = window.scrollY !== undefined ? window.scrollY : (window.pageYOffset || 0);
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + scrollY - getNavbarHeightOffset();
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Fallback
      }
    }, 150);
  }

  // 2. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (!el.hasAttribute('data-target')) {
            obs.unobserve(el);
            return;
          }

          const target = parseFloat(el.getAttribute('data-target') || '0');
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const useComma = el.getAttribute('data-comma') === 'true';
          const duration = 2000;
          const startTime = performance.now();

          function formatVal(num, dec) {
            const rounded = parseFloat(num).toFixed(dec);
            if (useComma) {
              const parts = rounded.split('.');
              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              return parts.join('.');
            }
            return rounded;
          }

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = formatVal(target * easeProgress, decimals);

            el.textContent = `${prefix}${currentVal}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${formatVal(target, decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => observer.observe(el));
  }

  // 3. Pricing Period Toggle (Monthly / Annual with 20% discount)
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      const isAnnual = e.target.checked;
      const prices = document.querySelectorAll('.pricing-price-val');
      const periods = document.querySelectorAll('.pricing-period-val');

      prices.forEach(el => {
        const monthly = el.getAttribute('data-monthly');
        const annual = el.getAttribute('data-annual');
        if (isAnnual && annual) {
          el.textContent = annual;
        } else if (!isAnnual && monthly) {
          el.textContent = monthly;
        }
      });

      periods.forEach(el => {
        el.textContent = isAnnual ? '/year' : '/month';
      });
    });
  }

  // 4. Global Toast Notification Helper
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(container);
    }

    const toastId = 'toast_' + Date.now();
    const bgClass = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : 'bg-dark text-white';

    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 show shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center gap-2">
            <i class="bi bi-info-circle-fill"></i> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastElem = document.getElementById(toastId);
    setTimeout(() => {
      if (toastElem) {
        toastElem.classList.remove('show');
        setTimeout(() => toastElem.remove(), 300);
      }
    }, 4000);
  };

  // 5. Clickable Card Delegation
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.custom-card');
    if (card) {
      // Don't trigger if user clicked an interactive child directly (button, input, anchor)
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
        return;
      }
      const primaryLink = card.querySelector('a[href]');
      if (primaryLink && primaryLink.getAttribute('href') && primaryLink.getAttribute('href') !== '#') {
        const href = primaryLink.getAttribute('href');
        const target = primaryLink.getAttribute('target');
        if (target === '_blank') {
          window.open(href, '_blank');
        } else {
          window.location.href = href;
        }
      }
    }
  });

  // 6. Graphical Country Code Dropdown Picker Controller
  const countryPickerGroup = document.querySelector('.country-picker-input-group');
  if (countryPickerGroup) {
    const dropdownBtn = countryPickerGroup.querySelector('#countryPickerDropdownBtn');
    const flagImg = countryPickerGroup.querySelector('.country-flag-icon');
    const nameDisplay = countryPickerGroup.querySelector('.country-name-display');
    const codeDisplay = countryPickerGroup.querySelector('.country-code-display');
    const hiddenInput = countryPickerGroup.querySelector('#countryCodeInput');
    const phoneInput = countryPickerGroup.querySelector('input[type="tel"]');
    const searchInput = countryPickerGroup.querySelector('.country-search-field');
    const options = countryPickerGroup.querySelectorAll('.country-option');

    // Handle Country Selection
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const country = opt.getAttribute('data-country') || 'USA';
        const code = opt.getAttribute('data-code') || '+1';
        const flag = opt.getAttribute('data-flag') || 'us';

        if (flagImg) {
          flagImg.src = `https://flagcdn.com/w40/${flag}.png`;
          flagImg.alt = `${country} Flag`;
        }
        if (nameDisplay) nameDisplay.textContent = country;
        if (codeDisplay) codeDisplay.textContent = `(${code})`;
        if (hiddenInput) hiddenInput.value = code;

        options.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        // Close dropdown via bootstrap
        if (dropdownBtn && typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
          const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownBtn);
          if (bsDropdown) bsDropdown.hide();
        }

        if (phoneInput) phoneInput.focus();
      });
    });

    // Country Search Filter within Dropdown
    if (searchInput) {
      searchInput.addEventListener('click', (e) => e.stopPropagation());
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        options.forEach(opt => {
          const country = (opt.getAttribute('data-country') || '').toLowerCase();
          const code = (opt.getAttribute('data-code') || '').toLowerCase();
          if (country.includes(query) || code.includes(query)) {
            opt.style.display = 'flex';
          } else {
            opt.style.display = 'none';
          }
        });
      });
    }
  }

  // 7. Global Footer Newsletter Form Submission
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        const email = input.value.trim();
        if (typeof showToast === 'function') {
          showToast(`Thank you for subscribing! Updates will be sent to ${email}.`, 'success');
        }
        form.reset();
      }
    });
  });

  // 8. Global Statement Audit Upload Handler (No redirection, instant aligned feedback)
  const statementUploadBtns = document.querySelectorAll(
    '#uploadStatementBtn, #pricingUploadStatementBtn, #durbinUploadBtn, .upload-statement-btn'
  );

  statementUploadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.statement-audit-banner, #statementAuditCard, #pricingAuditContainer, .p-4') || document;
      const successBox = card.querySelector('#statementSuccessMsg, #pricingStatementSuccessMsg, #durbinSuccessMsg, .statement-audit-success-box');
      const fileInput = card.querySelector('input[type="file"]');

      if (successBox) {
        successBox.classList.remove('d-none');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (!btn.getAttribute('data-original-html')) {
        btn.setAttribute('data-original-html', btn.innerHTML);
      }
      btn.innerHTML = '<i class="bi bi-check-circle-fill text-success me-1"></i> Statement Submitted';
      btn.classList.add('disabled');

      if (typeof showToast === 'function') {
        showToast('Merchant statement uploaded successfully! Audit ticket is queued for 24h review.', 'success');
      }

      // Handle close button
      if (successBox) {
        const closeBtn = successBox.querySelector('.btn-close');
        if (closeBtn && !closeBtn.hasAttribute('data-has-listener')) {
          closeBtn.setAttribute('data-has-listener', 'true');
          closeBtn.addEventListener('click', () => {
            successBox.classList.add('d-none');
            const orig = btn.getAttribute('data-original-html');
            if (orig) {
              btn.innerHTML = orig;
              btn.classList.remove('disabled');
            }
          });
        }
      }

      // If file input exists, listen for file change
      if (fileInput && !fileInput.hasAttribute('data-has-listener')) {
        fileInput.setAttribute('data-has-listener', 'true');
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) {
            const fileName = fileInput.files[0].name;
            const details = card.querySelector('#statementUploadDetails');
            if (details) {
              details.innerHTML = `File <strong>${fileName}</strong> received securely. Our financial underwriting team is analyzing your processing rates and will deliver your line-by-line Interchange-Plus audit report within <strong>24 hours</strong>.`;
            }
            if (successBox) successBox.classList.remove('d-none');
          }
        });
      }
    });
  });

  // Safety net: catch any link or button containing "Upload Statement" to guarantee zero redirection
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (!el) return;
    const text = (el.textContent || '').trim().toLowerCase();
    if (text.includes('upload statement') || text.includes('audit my debit fees')) {
      e.preventDefault();
      e.stopPropagation();
      const parentCard = el.closest('.statement-audit-banner, #statementAuditCard, #pricingAuditContainer, .p-4, div');
      const targetBtn = parentCard ? parentCard.querySelector('.upload-statement-btn') : null;
      if (targetBtn && targetBtn !== el) {
        targetBtn.click();
      } else {
        const successBox = parentCard ? parentCard.querySelector('.statement-audit-success-box, #statementSuccessMsg') : null;
        if (successBox) {
          successBox.classList.remove('d-none');
        }
        if (typeof showToast === 'function') {
          showToast('Merchant statement uploaded successfully! Our financial team will deliver your audit within 24 hours.', 'success');
        }
      }
    }
  });

  // 9. Global PDF Handbook Downloader (Direct local device download, zero redirection)
  const PDF_HANDBOOK_B64 = "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiAvRjIgNSAwIFIgPj4gPj4gL0NvbnRlbnRzIDYgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkID4+CmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKNiAwIG9iago8PCAvTGVuZ3RoIDIxMDggPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgo1MCA3MzAgVGQKKFBheUZsb3dQcm8gLSAyMDI2IE1lcmNoYW50IEZlZSBIYW5kYm9vaykgVGoKMCAtMjQgVGQKL0YyIDEwIFRmCihDb21wcmVoZW5zaXZlIDIwMjYgSW50ZXJjaGFuZ2UgUmF0ZSBUYWJsZXMgYW5kIFN0YXRlbWVudCBBdWRpdCBHdWlkZSkgVGoKMCAtMzYgVGQKL0YxIDEzIFRmCigxLiBFeGVjdXRpdmUgT3ZlcnZpZXc6IEludGVyY2hhbmdlLVBsdXMgdnMgRmxhdC1SYXRlIFByaWNpbmcpIFRqCjAgLTE4IFRkCi9GMiAxMCBUZgooSW50ZXJjaGFuZ2UtUGx1cyBwcmljaW5nIHBhc3NlcyB0cnVlIHdob2xlc2FsZSBjYXJkIGJyYW5kIGludGVyY2hhbmdlIGNvc3RzIHRocm91Z2ggZGlyZWN0bHksKSBUagowIC0xNCBUZAooc3VwcGxlbWVudGVkIGJ5IGEgZml4ZWQsIHRyYW5zcGFyZW50IHByb2Nlc3NvciBtYXJnaW4gKGUuZy4gKzAuMTUlICsgJDAuMDggcGVyIHRyYW5zYWN0aW9uKS4pIFRqCjAgLTE0IFRkCihVbmxpa2UgYmxlbmRlZCBmbGF0IHJhdGVzIChlLmcuIDIuOSUgKyAkMC4zMCksIGludGVyY2hhbmdlIHByaWNpbmcgcHJlc2VydmVzIG1lcmNoYW50IHByb2ZpdCBtYXJnaW5zKSBUagowIC0xNCBUZAooYnkgZWxpbWluYXRpbmcgdW5kaXNjbG9zZWQgbm9uLXF1YWxpZmllZCBtYXJrdXBzIG9uIGRlYml0IGFuZCBzdGFuZGFyZCBjcmVkaXQgdHJhbnNhY3Rpb25zLikgVGoKMCAtMjggVGQKL0YxIDEzIFRmCigyLiAyMDI2IENvcmUgSW50ZXJjaGFuZ2UgQmVuY2htYXJrIFNjaGVkdWxlcykgVGoKMCAtMTggVGQKL0YyIDEwIFRmCiggICogVmlzYSBDb25zdW1lciBTd2lwZWQvVGFwIENvcmUgQ3JlZGl0OiAxLjUxJSArICQwLjEwKSBUagowIC0xNCBUZAooICAqIFZpc2EgUmVndWxhdGVkIERlYml0IChEdXJiaW4gQW1lbmRtZW50IENhcCk6IDAuMDUlICsgJDAuMjEgKyAkMC4wMSBmcmF1ZCBwcmV2ZW50aW9uKSBUagowIC0xNCBUZAooICAqIE1hc3RlcmNhcmQgTWVyaXQgSUlJIFJldGFpbCBCYXNlOiAxLjU4JSArICQwLjEwKSBUagowIC0xNCBUZAooICAqIE1hc3RlcmNhcmQgUmVndWxhdGVkIERlYml0OiAwLjA1JSArICQwLjIyKSBUagowIC0xNCBUZAooICAqIERpc2NvdmVyIFJldGFpbCBFbGVjdHJvbmljOiAxLjU2JSArICQwLjEwKSBUagowIC0xNCBUZAooICAqIEFtZXJpY2FuIEV4cHJlc3MgT3B0Qmx1ZSBXaG9sZXNhbGUgVGllciAxOiAxLjYwJSArICQwLjEwKSBUagowIC0xNCBUZAooICAqIENvbW1lcmNpYWwgLyBCMkIgTGV2ZWwgMiAmIExldmVsIDM6IDEuODUlICsgJDAuMTAgKFJlcXVpcmVzIEl0ZW1pemVkIFRheCBEYXRhKSkgVGoKMCAtMjggVGQKL0YxIDEzIFRmCigzLiBTdGF0ZW1lbnQgRm9yZW5zaWMgQXVkaXQgQ2hlY2tsaXN0OiA1IEhpZGRlbiBKdW5rIEZlZXMgdG8gRWxpbWluYXRlKSBUagowIC0xOCBUZAovRjIgMTAgVGYKKCAgWzFdIFRpZXJlZCBEb3duZ3JhZGVzOiBOb24tUXVhbGlmaWVkIHN1cmNoYXJnZXMgcmFuZ2luZyBmcm9tIDEuNTAlIHRvIDIuODAlIGFib3ZlIGJhc2UuKSBUagowIC0xNCBUZAooICBbMl0gTW9udGhseSBQQ0kgTm9uLVZhbGlkYXRpb24gRmVlczogUGVuYWx0aWVzIG9mICQxOS45NSB0byAkOTkuOTUgcGVyIE1JRCBwZXIgbW9udGguKSBUagowIC0xNCBUZAooICBbM10gQmF0Y2ggU2V0dGxlbWVudCBTdXJjaGFyZ2VzOiBQZXItYmF0Y2ggY2xlYXJhbmNlIGZlZXMgZXhjZWVkaW5nICQwLjEwLikgVGoKMCAtMTQgVGQKKCAgWzRdIEluZmxhdGVkIEdhdGV3YXkgJiBQb3J0YWwgU3VyY2hhcmdlczogTWFya3VwcyBleGNlZWRpbmcgc3RhbmRhcmQgJDE1LSQyNS9tbyBnYXRld2F5IGNvc3RzLikgVGoKMCAtMTQgVGQKKCAgWzVdIExpcXVpZGF0ZWQgRGFtYWdlcyAmIEVhcmx5IFRlcm1pbmF0aW9uOiBDYW5jZWxsYXRpb24gcGVuYWx0aWVzIGV4Y2VlZGluZyAkMjk1LikgVGoKMCAtMzAgVGQKL0YxIDExIFRmCihQdWJsaXNoZWQgYnkgUGF5Rmxvd1BybyBVbmRlcndyaXRpbmcgJiBQYXltZW50IFN0cmF0ZWd5IEdyb3VwKSBUagowIC0xNCBUZAovRjIgOSBUZgooVG8gcmVxdWVzdCB5b3VyIGZyZWUgMjQtaG91ciBmb3JlbnNpYyBzdGF0ZW1lbnQgYXVkaXQsIGNvbnRhY3QgYXVkaXRAcGF5Zmxvd3Byby5jb20pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDcKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjUxIDAwMDAwIG4gCjAwMDAwMDAzMjYgMDAwMDAgbiAKMDAwMDAwMDM5NiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDcgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjI1NTYKJSVFT0YK";

  function downloadLocalPdf(filename = 'PayFlowPro-Merchant-Fee-Handbook-2026.pdf') {
    try {
      const binaryString = atob(PDF_HANDBOOK_B64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = filename;
      downloadAnchor.style.display = 'none';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      setTimeout(() => {
        if (downloadAnchor.parentNode) {
          document.body.removeChild(downloadAnchor);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1500);
      return true;
    } catch (err) {
      console.warn('Blob download error:', err);
      return false;
    }
  }

  const pdfDownloadBtns = document.querySelectorAll('#downloadPdfBtn, .download-pdf-btn');

  pdfDownloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const fileName = btn.getAttribute('download') || 'PayFlowPro-Merchant-Fee-Handbook-2026.pdf';
      downloadLocalPdf(fileName);

      // Card feedback
      const card = btn.closest('.handbook-download-card, .custom-card') || document;
      const successBadge = card.querySelector('#pdfDownloadSuccessMsg, .pdf-download-success');
      if (successBadge) {
        successBadge.classList.remove('d-none');
      }

      // Visual feedback on button
      const originalText = btn.getAttribute('data-original-html') || btn.innerHTML;
      if (!btn.getAttribute('data-original-html')) {
        btn.setAttribute('data-original-html', originalText);
      }
      btn.innerHTML = '<i class="bi bi-check2-circle text-success me-1"></i> Downloaded!';
      btn.classList.add('border-success', 'text-success');

      if (typeof showToast === 'function') {
        showToast('Merchant Fee Handbook (PDF) downloaded to your local device.', 'success');
      }

      setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-download me-1"></i> Download Free PDF';
        btn.classList.remove('border-success', 'text-success');
      }, 3500);
    });
  });

  // Safety net: catch any click on links or buttons mentioning "Download Free PDF"
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (!el) return;
    const text = (el.textContent || '').trim().toLowerCase();
    if (text.includes('download free pdf') || text.includes('download merchant fee handbook')) {
      e.preventDefault();
      e.stopPropagation();
      const parentCard = el.closest('.custom-card, div');
      const targetBtn = parentCard ? parentCard.querySelector('.download-pdf-btn') : null;
      if (targetBtn && targetBtn !== el) {
        targetBtn.click();
      } else {
        downloadLocalPdf('PayFlowPro-Merchant-Fee-Handbook-2026.pdf');
        if (typeof showToast === 'function') {
          showToast('Merchant Fee Handbook (PDF) downloaded to your local device.', 'success');
        }
      }
    }
  });
});


