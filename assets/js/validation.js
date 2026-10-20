/**
 * PayFlowPro - Advanced Frontend Form Validation & Authentication Engine
 * Pure client-side validation adhering to standard RFC/DNS email specifications
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /**
   * Comprehensive Email Syntax Validation
   * Evaluates standard business email formats, multi-level domains, plus-addressing,
   * length restrictions (254 chars max, 64 chars local part max, 63 chars per domain label),
   * and specific syntax error categories.
   * 
   * Returns: { isValid: boolean, message: string }
   */
  function validateEmailAddress(rawEmail) {
    if (typeof rawEmail !== 'string') {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    // 1. Trim leading and trailing whitespace
    const trimmed = rawEmail.trim();

    // Empty input check
    if (trimmed.length === 0) {
      return { isValid: false, message: 'Please enter your business email address.' };
    }

    // 10. Check for spaces or invalid whitespace inside the address
    if (/\s/.test(trimmed)) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    // 13. Total email length exceeding 254 characters: reject
    if (trimmed.length > 254) {
      return { isValid: false, message: 'Email address is too long.' };
    }

    // 3 & 4. Check @ symbol presence and count
    const atIndices = [];
    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '@') {
        atIndices.push(i);
      }
    }

    if (atIndices.length === 0) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    if (atIndices.length > 1) {
      return { isValid: false, message: 'Please enter an email address with only one @ symbol.' };
    }

    const atIndex = atIndices[0];
    const localPart = trimmed.substring(0, atIndex);
    const domainPart = trimmed.substring(atIndex + 1);

    // 2. Missing username before @
    if (!localPart || localPart.length === 0) {
      return { isValid: false, message: 'Enter an email address with a username before @.' };
    }

    // 14. Local part exceeding 64 characters: reject
    if (localPart.length > 64) {
      return { isValid: false, message: 'Email address is too long.' };
    }

    // 8. Leading or trailing dots in the local part
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    // 7. Consecutive dots in local part
    if (localPart.includes('..')) {
      return { isValid: false, message: 'Consecutive dots are not allowed.' };
    }

    // 11. Invalid characters in local part
    // Standard permitted local characters: letters, digits, and . ! # $ % & ' * + / = ? ^ _ ` { | } ~ -
    const validLocalRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    if (!validLocalRegex.test(localPart)) {
      return { isValid: false, message: 'Please enter a valid email address.' };
    }

    // 5. Missing domain after @
    if (!domainPart || domainPart.length === 0) {
      return { isValid: false, message: 'Enter a valid domain after @.' };
    }

    // 7. Consecutive dots in domain
    if (domainPart.includes('..')) {
      return { isValid: false, message: 'Consecutive dots are not allowed.' };
    }

    // 8. Leading or trailing dots in domain
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      return { isValid: false, message: 'Enter a complete email domain, such as company.com.' };
    }

    // 6. Missing domain extension (must contain at least one dot separating domain and TLD)
    if (!domainPart.includes('.')) {
      return { isValid: false, message: 'Enter a complete email domain, such as company.com.' };
    }

    const domainLabels = domainPart.split('.');

    // Domain labels check (e.g., mail.company.co.in)
    for (let i = 0; i < domainLabels.length; i++) {
      const label = domainLabels[i];

      // Empty label
      if (!label || label.length === 0) {
        return { isValid: false, message: 'Please enter a valid email domain.' };
      }

      // 12. Domain labels exceeding permitted DNS length (63 characters)
      if (label.length > 63) {
        return { isValid: false, message: 'Email address is too long.' };
      }

      // 9. Domain labels beginning or ending with a hyphen: reject
      if (label.startsWith('-') || label.endsWith('-')) {
        return { isValid: false, message: 'Please enter a valid email domain.' };
      }

      // 11. Invalid characters in domain label (letters, digits, hyphens allowed)
      const validLabelRegex = /^[a-zA-Z0-9-]+$/;
      if (!validLabelRegex.test(label)) {
        return { isValid: false, message: 'Please enter a valid email domain.' };
      }
    }

    // TLD check (the last label) - must be at least 2 alphabetic characters (e.g. com, org, in, co)
    const tld = domainLabels[domainLabels.length - 1];
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
      return { isValid: false, message: 'Enter a complete email domain, such as company.com.' };
    }

    return { isValid: true, message: '' };
  }

  // 1. Password Visibility Toggle
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'bi bi-eye-slash-fill';
          btn.setAttribute('aria-label', 'Hide password');
        } else {
          input.type = 'password';
          if (icon) icon.className = 'bi bi-eye-fill';
          btn.setAttribute('aria-label', 'Show password');
        }
      }
    });
  });

  // 2. Login Form Controller with Advanced Validation
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const emailInput = document.getElementById('loginEmailInput');
    const passwordInput = document.getElementById('loginPasswordInput');
    const emailFeedback = document.getElementById('emailFeedback');
    const passwordFeedback = document.getElementById('passwordFeedback');
    const authAlert = document.getElementById('authAlert');

    // Check for registration success redirect
    const urlParams = new URLSearchParams(window.location.search);
    const hasRegisteredParam = urlParams.get('registered') === 'true';
    const storedSuccess = sessionStorage.getItem('signupSuccess');

    if (hasRegisteredParam || storedSuccess) {
      sessionStorage.removeItem('signupSuccess');
      if (authAlert) {
        authAlert.className = 'alert alert-success mb-3 d-flex align-items-center gap-2 shadow-sm';
        authAlert.innerHTML = '<i class="bi bi-check-circle-fill fs-5 text-success"></i><div><strong>Account registered successfully!</strong> Welcome to PayFlowPro. Please sign in with your credentials.</div>';
        authAlert.classList.remove('d-none');
      }
    }

    let hasAttemptedSubmit = false;

    // Helper: update email field validation UI
    function renderEmailState(showErrorIfInvalid = false) {
      if (!emailInput || !emailFeedback) return false;
      const rawVal = emailInput.value;
      const trimmedVal = rawVal.trim();

      // Reset state when field is completely empty
      if (rawVal.length === 0) {
        emailInput.classList.remove('is-valid', 'is-invalid');
        emailInput.setAttribute('aria-invalid', 'false');
        if (hasAttemptedSubmit) {
          emailInput.classList.add('is-invalid');
          emailInput.setAttribute('aria-invalid', 'true');
          emailFeedback.textContent = 'Please enter your business email address.';
          emailFeedback.classList.remove('d-none');
          return false;
        } else {
          emailFeedback.textContent = '';
          emailFeedback.classList.add('d-none');
          return false;
        }
      }

      const res = validateEmailAddress(trimmedVal);

      if (res.isValid) {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        emailInput.setAttribute('aria-invalid', 'false');
        emailFeedback.textContent = '';
        emailFeedback.classList.add('d-none');
        return true;
      } else {
        emailInput.classList.remove('is-valid');
        if (showErrorIfInvalid || hasAttemptedSubmit) {
          emailInput.classList.add('is-invalid');
          emailInput.setAttribute('aria-invalid', 'true');
          emailFeedback.textContent = res.message;
          emailFeedback.classList.remove('d-none');
        } else {
          emailInput.classList.remove('is-invalid');
          emailInput.setAttribute('aria-invalid', 'false');
          emailFeedback.textContent = '';
          emailFeedback.classList.add('d-none');
        }
        return false;
      }
    }

    // Helper: update password field validation UI
    function renderPasswordState(showErrorIfInvalid = false) {
      if (!passwordInput || !passwordFeedback) return false;
      const val = passwordInput.value;

      if (!val || val.length === 0) {
        passwordInput.classList.remove('is-valid');
        if (showErrorIfInvalid || hasAttemptedSubmit) {
          passwordInput.classList.add('is-invalid');
          passwordInput.setAttribute('aria-invalid', 'true');
          passwordFeedback.textContent = 'Please enter your password.';
          passwordFeedback.classList.remove('d-none');
          return false;
        } else {
          passwordInput.classList.remove('is-invalid');
          passwordInput.setAttribute('aria-invalid', 'false');
          passwordFeedback.textContent = '';
          passwordFeedback.classList.add('d-none');
          return false;
        }
      } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.setAttribute('aria-invalid', 'false');
        passwordFeedback.textContent = '';
        passwordFeedback.classList.add('d-none');
        return true;
      }
    }

    // Event: Real-time while typing/pasting
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (authAlert) authAlert.classList.add('d-none');
        // Clear previous error on correction
        renderEmailState(hasAttemptedSubmit);
      });

      emailInput.addEventListener('blur', () => {
        if (emailInput.value.trim().length > 0 || hasAttemptedSubmit) {
          renderEmailState(true);
        }
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        if (authAlert) authAlert.classList.add('d-none');
        renderPasswordState(hasAttemptedSubmit);
      });

      passwordInput.addEventListener('blur', () => {
        if (passwordInput.value.length > 0 || hasAttemptedSubmit) {
          renderPasswordState(true);
        }
      });
    }

    // Event: Form Submission (Click or Enter key)
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hasAttemptedSubmit = true;

      const isEmailValid = renderEmailState(true);
      const isPasswordValid = renderPasswordState(true);

      if (!isEmailValid || !isPasswordValid) {
        if (authAlert) {
          authAlert.classList.add('d-none');
        }
        if (!isEmailValid && emailInput) {
          emailInput.focus();
        } else if (!isPasswordValid && passwordInput) {
          passwordInput.focus();
        }
        return;
      }

      // Both fields pass frontend validation
      const submitBtn = document.getElementById('loginSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Verifying...';
      }

      setTimeout(() => {
        if (authAlert) {
          authAlert.className = 'alert alert-success mb-3 d-flex align-items-center justify-content-center text-center gap-2';
          authAlert.innerHTML = '<i class="bi bi-check-circle-fill flex-shrink-0"></i><span>Login successful! Welcome to PayFlowPro.</span>';
          authAlert.classList.remove('d-none');
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i><span>Signed In</span>';
        }
      }, 600);
    });

    // 2b. Single Sign-On (SSO) Handlers
    const ssoGoogleBtn = document.getElementById('ssoGoogleBtn');
    const ssoAppleBtn = document.getElementById('ssoAppleBtn');

    function triggerSSOAuth(provider, btn) {
      if (!btn) return;
      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...`;
      if (authAlert) authAlert.classList.add('d-none');

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        if (authAlert) {
          authAlert.className = 'alert alert-success mb-3 d-flex align-items-center justify-content-center text-center gap-2 shadow-sm';
          authAlert.innerHTML = `<i class="bi bi-check-circle-fill flex-shrink-0"></i><span>Authenticated with ${provider}! Welcome to PayFlowPro.</span>`;
          authAlert.classList.remove('d-none');
        }
      }, 800);
    }

    if (ssoGoogleBtn) {
      ssoGoogleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSSOAuth('Google', ssoGoogleBtn);
      });
    }

    if (ssoAppleBtn) {
      ssoAppleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        triggerSSOAuth('Apple', ssoAppleBtn);
      });
    }
  }

  // 3. Other forms validation (e.g., Register, Contact)
  const otherForms = document.querySelectorAll('form:not(#loginForm)');
  otherForms.forEach(form => {
    form.addEventListener('submit', (event) => {
      if (form.id === 'registerForm') {
        event.preventDefault();
        event.stopPropagation();
        const emailInput = form.querySelector('input[type="email"]');
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const emailRes = validateEmailAddress(emailVal);

        const regAlert = document.getElementById('regAlert');

        if (!emailRes.isValid) {
          form.classList.add('was-validated');
          if (emailInput) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            emailInput.focus();
          }
          if (regAlert) {
            regAlert.className = 'alert alert-danger mb-3';
            regAlert.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> ${emailRes.message}`;
            regAlert.classList.remove('d-none');
          }
          return;
        }

        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }

        form.classList.add('was-validated');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing registration...';
        }

        setTimeout(() => {
          if (regAlert) {
            regAlert.className = 'alert alert-success mt-3 mb-0 d-flex align-items-center gap-2';
            regAlert.innerHTML = '<i class="bi bi-check-circle-fill"></i><span>Account registered successfully! Redirecting to sign in...</span>';
            regAlert.classList.remove('d-none');
          }
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i><span>Registration Complete</span>';
          }
          try {
            sessionStorage.setItem('signupSuccess', 'Account registered successfully! Welcome to PayFlowPro. Please sign in with your credentials.');
          } catch (e) {
            // fallback if storage disabled
          }
          setTimeout(() => {
            window.location.href = 'login.html?registered=true';
          }, 400);
        }, 500);
      } else if (form.id === 'contactForm' || form.classList.contains('contact-form')) {
        event.preventDefault();
        event.stopPropagation();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }
        form.classList.add('was-validated');
        if (typeof showToast === 'function') {
          showToast('Thank you! Your merchant inquiry has been sent to our specialists.', 'success');
        } else {
          alert('Thank you! Your merchant inquiry has been sent to our specialists.');
        }
        form.reset();
        form.classList.remove('was-validated');
      }
    });
  });
});
