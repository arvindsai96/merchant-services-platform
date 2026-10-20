/**
 * PayFlowPro - Interactive Live API Sandbox & Developer Playground Engine
 * Pure client-side simulation of RESTful Payment Gateway APIs, Idempotency, and Webhooks
 * Zero server-side or Python dependencies.
 */
(() => {
  'use strict';

  // State Management for the Sandbox Simulator
  const state = {
    currentEndpoint: 'charges',
    currentScenario: 'visa_success',
    apiKey: 'sk_test_51NxPayFlow984102941',
    isKeyVisible: false,
    headers: {
      'Authorization': 'Bearer sk_test_51NxPayFlow984102941',
      'Content-Type': 'application/json',
      'Idempotency-Key': 'idem_' + Math.random().toString(36).substring(2, 11),
      'PayFlow-Version': '2026-04-01'
    },
    lastResponse: null
  };

  // Endpoint Definitions & Presets
  const endpoints = {
    charges: {
      method: 'POST',
      url: 'https://api.payflowpro.com/v1/charges',
      name: 'Process Payment Charge',
      docUrl: 'services/payment-gateway.html',
      defaultPayload: {
        amount: 4900,
        currency: 'usd',
        customer: 'cus_84920412',
        payment_method: 'pm_card_visa_4242',
        capture: true,
        routing: {
          smart_retry: true,
          failover_acquirer: 'auto'
        },
        metadata: {
          order_id: 'ORD-94821',
          store: 'Northstar Flagship #01'
        }
      }
    },
    customers: {
      method: 'POST',
      url: 'https://api.payflowpro.com/v1/customers',
      name: 'Tokenize Customer & Vault Card',
      defaultPayload: {
        name: 'Alex Mercer',
        email: 'alex.mercer@northstarretail.com',
        phone: '+1-555-019-2831',
        payment_method: 'pm_card_visa_4242',
        address: {
          line1: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'OR',
          postal_code: '97477',
          country: 'US'
        },
        metadata: {
          crm_account_id: 'CRM-77189'
        }
      }
    },
    subscriptions: {
      method: 'POST',
      url: 'https://api.payflowpro.com/v1/subscriptions',
      name: 'Create Recurring Billing Subscription',
      defaultPayload: {
        customer: 'cus_84920412',
        plan: 'plan_growth_annual',
        billing_cycle_anchor: 'now',
        collection_method: 'charge_automatically',
        smart_dunning: {
          max_retries: 4,
          retry_interval_days: [1, 3, 5]
        },
        metadata: {
          tier: 'Growth Enterprise'
        }
      }
    },
    refunds: {
      method: 'POST',
      url: 'https://api.payflowpro.com/v1/refunds',
      name: 'Issue Immediate Charge Refund',
      defaultPayload: {
        charge: 'ch_3N8x7f2eZvKYlo2C10',
        amount: 4900,
        reason: 'requested_by_customer',
        reverse_transfer: true,
        metadata: {
          ticket_id: 'SUP-40192'
        }
      }
    }
  };

  // Preset Test Scenarios
  const scenarios = {
    visa_success: {
      endpoint: 'charges',
      name: 'Visa Contactless (Approved)',
      payload: {
        amount: 4900,
        currency: 'usd',
        customer: 'cus_84920412',
        payment_method: 'pm_card_visa_4242',
        capture: true,
        routing: {
          smart_retry: true,
          failover_acquirer: 'auto'
        },
        metadata: {
          order_id: 'ORD-94821',
          store: 'Northstar Flagship #01'
        }
      },
      responseGenerator: (payload, latency) => ({
        status: 200,
        statusText: 'OK',
        body: {
          id: 'ch_' + Math.random().toString(36).substring(2, 14),
          object: 'charge',
          amount: payload.amount || 4900,
          amount_refunded: 0,
          currency: payload.currency || 'usd',
          paid: true,
          status: 'succeeded',
          captured: true,
          payment_method: {
            id: 'pm_card_visa_4242',
            type: 'card',
            card: {
              brand: 'visa',
              funding: 'credit',
              last4: '4242',
              exp_month: 12,
              exp_year: 2028,
              country: 'US',
              cvc_check: 'pass',
              avs_check: 'pass'
            }
          },
          routing: {
            selected_acquirer: 'acq_chase_paymentech',
            attempts: 1,
            failover_triggered: false,
            latency_ms: latency
          },
          risk_evaluation: {
            score: 0.02,
            level: 'low',
            rule_triggered: 'none',
            radar_outcome: 'approved'
          },
          receipt_url: 'https://payflowpro.com/receipts/rcpt_' + Math.random().toString(36).substring(2, 10),
          metadata: payload.metadata || {},
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'charge.succeeded',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    mastercard_success: {
      endpoint: 'charges',
      name: 'Mastercard 3DS (Approved)',
      payload: {
        amount: 12000,
        currency: 'usd',
        customer: 'cus_99410245',
        payment_method: 'pm_card_mastercard_5555',
        capture: true,
        routing: {
          smart_retry: true,
          failover_acquirer: 'auto'
        },
        metadata: {
          order_id: 'ORD-94822',
          channel: 'web_checkout'
        }
      },
      responseGenerator: (payload, latency) => ({
        status: 200,
        statusText: 'OK',
        body: {
          id: 'ch_' + Math.random().toString(36).substring(2, 14),
          object: 'charge',
          amount: payload.amount || 12000,
          amount_refunded: 0,
          currency: payload.currency || 'usd',
          paid: true,
          status: 'succeeded',
          captured: true,
          payment_method: {
            id: 'pm_card_mastercard_5555',
            type: 'card',
            card: {
              brand: 'mastercard',
              funding: 'credit',
              last4: '5555',
              exp_month: 8,
              exp_year: 2029,
              country: 'US',
              cvc_check: 'pass',
              three_d_secure: {
                version: '2.2.0',
                authenticated: true,
                liability_shifted: true
              }
            }
          },
          routing: {
            selected_acquirer: 'acq_first_data',
            attempts: 1,
            failover_triggered: false,
            latency_ms: latency
          },
          risk_evaluation: {
            score: 0.01,
            level: 'low',
            radar_outcome: 'approved'
          },
          receipt_url: 'https://payflowpro.com/receipts/rcpt_' + Math.random().toString(36).substring(2, 10),
          metadata: payload.metadata || {},
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'charge.succeeded',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    card_declined: {
      endpoint: 'charges',
      name: 'Card Declined (Insufficient Funds)',
      payload: {
        amount: 8500,
        currency: 'usd',
        customer: 'cus_33019284',
        payment_method: 'pm_card_declined_insufficient_funds',
        capture: true,
        routing: {
          smart_retry: false
        },
        metadata: {
          order_id: 'ORD-94823'
        }
      },
      responseGenerator: (payload, latency) => ({
        status: 402,
        statusText: 'Payment Required',
        body: {
          error: {
            type: 'card_error',
            code: 'card_declined',
            decline_code: 'insufficient_funds',
            message: 'Your card has insufficient funds to complete this transaction.',
            param: 'payment_method',
            doc_url: 'https://payflowpro.com/docs/error-codes#card_declined',
            charge_id: 'ch_' + Math.random().toString(36).substring(2, 14),
            decline_details: {
              network_status: 'declined_by_issuer',
              advice_code: 'do_not_honor',
              network_decline_code: '51'
            }
          }
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'charge.failed',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    three_d_secure_required: {
      endpoint: 'charges',
      name: '3D Secure 2.0 Challenge Required',
      payload: {
        amount: 35000,
        currency: 'eur',
        customer: 'cus_77192041',
        payment_method: 'pm_card_three_d_secure_required',
        routing: {
          smart_retry: true
        },
        metadata: {
          order_id: 'ORD-94824'
        }
      },
      responseGenerator: (payload, latency) => ({
        status: 200,
        statusText: 'OK',
        body: {
          id: 'ch_' + Math.random().toString(36).substring(2, 14),
          object: 'charge',
          amount: payload.amount || 35000,
          currency: 'eur',
          paid: false,
          status: 'requires_action',
          next_action: {
            type: 'redirect_to_url',
            redirect_to_url: {
              url: 'https://api.payflowpro.com/v1/3ds/authenticate?challenge_token=tok_3ds_' + Math.random().toString(36).substring(2, 10),
              return_url: 'https://merchant.example.com/checkout/complete'
            },
            use_3d_secure: {
              ds_transaction_id: 'ds_' + Math.random().toString(36).substring(2, 12),
              protocol_version: '2.2.0'
            }
          },
          payment_method: {
            id: 'pm_card_three_d_secure_required',
            type: 'card',
            card: {
              brand: 'visa',
              last4: '3000',
              country: 'DE'
            }
          },
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'charge.requires_action',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    customer_vault: {
      endpoint: 'customers',
      name: 'Create Customer & Vault Token',
      payload: endpoints.customers.defaultPayload,
      responseGenerator: (payload, latency) => ({
        status: 201,
        statusText: 'Created',
        body: {
          id: 'cus_' + Math.random().toString(36).substring(2, 14),
          object: 'customer',
          name: payload.name || 'Alex Mercer',
          email: payload.email || 'alex.mercer@northstarretail.com',
          phone: payload.phone || '+1-555-019-2831',
          default_source: 'card_tok_' + Math.random().toString(36).substring(2, 12),
          vault_status: 'active',
          pci_compliance_level: 'PCI-DSS Level 1 Encrypted',
          sources: {
            total_count: 1,
            data: [
              {
                id: 'card_tok_' + Math.random().toString(36).substring(2, 12),
                brand: 'visa',
                last4: '4242',
                fingerprint: 'fp_9b2a7x104m'
              }
            ]
          },
          currency: 'usd',
          delinquent: false,
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'customer.created',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    subscription_create: {
      endpoint: 'subscriptions',
      name: 'Recurring Subscription Setup',
      payload: endpoints.subscriptions.defaultPayload,
      responseGenerator: (payload, latency) => ({
        status: 200,
        statusText: 'OK',
        body: {
          id: 'sub_' + Math.random().toString(36).substring(2, 14),
          object: 'subscription',
          customer: payload.customer || 'cus_84920412',
          plan: {
            id: payload.plan || 'plan_growth_annual',
            amount: 4900,
            currency: 'usd',
            interval: 'month',
            interval_count: 1
          },
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 86400),
          smart_dunning_enabled: true,
          latest_invoice: 'in_' + Math.random().toString(36).substring(2, 12),
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'customer.subscription.created',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    },

    refund_charge: {
      endpoint: 'refunds',
      name: 'Full Refund ($49.00 USD)',
      payload: endpoints.refunds.defaultPayload,
      responseGenerator: (payload, latency) => ({
        status: 200,
        statusText: 'OK',
        body: {
          id: 're_' + Math.random().toString(36).substring(2, 14),
          object: 'refund',
          amount: payload.amount || 4900,
          currency: 'usd',
          charge: payload.charge || 'ch_3N8x7f2eZvKYlo2C10',
          status: 'succeeded',
          reason: payload.reason || 'requested_by_customer',
          balance_transaction: 'txn_refund_' + Math.random().toString(36).substring(2, 10),
          created: Math.floor(Date.now() / 1000)
        },
        webhook: {
          id: 'evt_' + Math.random().toString(36).substring(2, 14),
          type: 'charge.refunded',
          created: Math.floor(Date.now() / 1000),
          api_version: '2026-04-01'
        }
      })
    }
  };

  /**
   * JSON Syntax Highlighting Function
   */
  function syntaxHighlightJson(jsonObj) {
    if (typeof jsonObj !== 'string') {
      jsonObj = JSON.stringify(jsonObj, null, 2);
    }
    // Escape HTML special characters
    jsonObj = jsonObj.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return jsonObj.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-str';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  /**
   * Initialize and Bind UI
   */
  document.addEventListener('DOMContentLoaded', () => {
    const modalEl = document.getElementById('liveSandboxModal');
    if (!modalEl) return;

    // Elements
    const endpointSelect = document.getElementById('sandboxEndpointSelect');
    const methodBadge = document.getElementById('sandboxMethodBadge');
    const urlDisplay = document.getElementById('sandboxUrlDisplay');
    const executeBtn = document.getElementById('sandboxExecuteBtn');
    const payloadTextarea = document.getElementById('sandboxPayloadJson');
    const responseBodyPre = document.getElementById('sandboxResponseBody');
    const webhookBodyPre = document.getElementById('sandboxWebhookBody');
    const responseHeadersPre = document.getElementById('sandboxResponseHeaders');
    const statusBadge = document.getElementById('sandboxStatusBadge');
    const latencyBadge = document.getElementById('sandboxLatencyBadge');
    const timestampDisplay = document.getElementById('sandboxTimestampDisplay');
    const copyResponseBtn = document.getElementById('sandboxCopyResponseBtn');
    const copyCurlBtn = document.getElementById('sandboxCopyCurlBtn');
    const copyApiKeyBtn = document.getElementById('sandboxCopyApiKeyBtn');
    const toggleApiKeyBtn = document.getElementById('sandboxToggleApiKeyBtn');
    const apiKeyDisplay = document.getElementById('sandboxApiKeyDisplay');
    const scenarioChipsContainer = document.getElementById('sandboxScenarioChips');
    const idempotencyInput = document.getElementById('sandboxIdempotencyInput');

    // Interactive Form Inputs (Visual Builder tab)
    const formAmount = document.getElementById('sandboxFormAmount');
    const formAmountSymbol = document.getElementById('sandboxAmountCurrencySymbol');
    const formCurrency = document.getElementById('sandboxFormCurrency');
    const formCustomer = document.getElementById('sandboxFormCustomer');
    const formCard = document.getElementById('sandboxFormCard');
    const formOrderId = document.getElementById('sandboxFormOrderId');
    const formSmartRetry = document.getElementById('sandboxFormSmartRetry');

    // Comprehensive Currency Symbol Map
    const currencySymbols = {
      usd: '$',
      eur: '€',
      gbp: '£',
      cad: '$',
      jpy: '¥',
      aud: '$',
      inr: '₹',
      cny: '¥',
      chf: 'CHF',
      sgd: 'S$',
      hkd: 'HK$',
      nzd: 'NZ$',
      sek: 'kr',
      nok: 'kr',
      brl: 'R$',
      mxn: '$'
    };

    /**
     * Resolve currency symbol from currency code
     */
    function getCurrencySymbol(curr) {
      if (!curr) return '$';
      const clean = String(curr).trim().toLowerCase();
      return currencySymbols[clean] || '$';
    }

    /**
     * Synchronize currency symbol badge/button and dropdown across the UI
     */
    function updateCurrencyDisplay(currencyCode) {
      const code = (currencyCode || 'usd').toLowerCase();
      const symbol = getCurrencySymbol(code);

      if (formAmountSymbol) {
        formAmountSymbol.textContent = symbol;
        formAmountSymbol.setAttribute('title', `Current currency: ${code.toUpperCase()} (${symbol}). Click to cycle currency.`);
        formAmountSymbol.setAttribute('aria-label', `Currency symbol ${symbol}`);
      }

      if (formCurrency && formCurrency.value !== code) {
        const optionExists = Array.from(formCurrency.options).some(opt => opt.value === code);
        if (optionExists) {
          formCurrency.value = code;
        }
      }

      const resImageAmt = document.getElementById('resImageAmtDisplay');
      if (resImageAmt && formAmount) {
        const val = parseFloat(formAmount.value || '49.00').toFixed(2);
        resImageAmt.textContent = `${symbol}${val} ${code.toUpperCase()}`;
      }
    }

    /**
     * Render Interactive Visual Holographic Card & Clearance Slip
     */
    function renderVisualCard(result, payload) {
      const brandBadge = document.getElementById('visualCardBrandBadge');
      const cardNum = document.getElementById('visualCardNumberDisplay');
      const cardHolder = document.getElementById('visualCardHolderDisplay');
      const cardExp = document.getElementById('visualCardExpDisplay');
      const resultStatus = document.getElementById('visualResultStatusBadge');
      const resultAmount = document.getElementById('visualResultAmountDisplay');
      const resultTxnId = document.getElementById('visualResultTxnIdDisplay');
      const resultAcquirer = document.getElementById('visualResultAcquirerDisplay');
      const resultRisk = document.getElementById('visualResultRiskDisplay');
      const resImageAmt = document.getElementById('resImageAmtDisplay');
      const resImageAcquirer = document.getElementById('resImageAcquirerDisplay');
      const resImageLatency = document.getElementById('resImageLatency');
      const resImageAuth = document.getElementById('resImageAuthCode');

      if (!result || !result.body) return;

      const body = result.body;
      const isSuccess = result.status >= 200 && result.status < 300;
      const isDeclined = result.status === 402 || (body.error && body.error.code === 'card_declined');
      const is3DS = body.status === 'requires_action';

      // 1. Status Badge
      if (resultStatus) {
        if (isSuccess && !is3DS) {
          resultStatus.innerHTML = '<span class="badge bg-success-subtle text-success border border-success"><i class="bi bi-check-circle-fill me-1"></i> Approved &amp; Cleared</span>';
        } else if (isDeclined) {
          resultStatus.innerHTML = '<span class="badge bg-danger-subtle text-danger border border-danger"><i class="bi bi-x-circle-fill me-1"></i> Declined: ' + (body.error ? body.error.decline_code : 'Insufficient Funds') + '</span>';
        } else if (is3DS) {
          resultStatus.innerHTML = '<span class="badge bg-warning-subtle text-warning border border-warning"><i class="bi bi-shield-exclamation me-1"></i> 3D Secure Challenge Required</span>';
        } else {
          resultStatus.innerHTML = '<span class="badge bg-info-subtle text-info border border-info"><i class="bi bi-info-circle-fill me-1"></i> Processed: ' + (body.status || 'Active') + '</span>';
        }
      }

      // 2. Amount with dynamic currency symbol
      const cur = (body.currency || (payload && payload.currency) || 'USD').toUpperCase();
      const sym = getCurrencySymbol(cur);
      let formattedAmt = sym + '49.00 ' + cur;
      if (body.amount !== undefined) {
        formattedAmt = sym + (body.amount / 100).toFixed(2) + ' ' + cur;
      } else if (payload && payload.amount) {
        formattedAmt = sym + (payload.amount / 100).toFixed(2) + ' ' + cur;
      }

      if (resultAmount) {
        resultAmount.textContent = formattedAmt;
      }
      if (resImageAmt) {
        resImageAmt.textContent = formattedAmt;
      }

      // 3. Txn ID & Auth Code
      const txnId = body.id || (body.error && body.error.charge_id) || 'ch_' + Math.random().toString(36).substring(2, 12);
      if (resultTxnId) {
        resultTxnId.textContent = txnId;
      }
      if (resImageAuth) {
        resImageAuth.textContent = 'AUTH-' + Math.floor(100000 + Math.random() * 900000);
      }

      // 4. Card Brand & Number
      const pm = body.payment_method;
      const cardInfo = pm && pm.card ? pm.card : null;
      if (brandBadge) {
        if (cardInfo && cardInfo.brand) {
          brandBadge.textContent = cardInfo.brand.toUpperCase() + ' ' + (cardInfo.funding ? cardInfo.funding.toUpperCase() : 'CARD');
        } else if (state.currentScenario === 'mastercard_success') {
          brandBadge.textContent = 'MASTERCARD 3DS';
        } else {
          brandBadge.textContent = 'VISA CONTACTLESS';
        }
      }

      if (cardNum) {
        if (cardInfo && cardInfo.last4) {
          cardNum.textContent = '•••• •••• •••• ' + cardInfo.last4;
        } else if (state.currentScenario === 'mastercard_success') {
          cardNum.textContent = '•••• •••• •••• 5555';
        } else if (state.currentScenario === 'card_declined') {
          cardNum.textContent = '•••• •••• •••• 0002';
        } else if (state.currentScenario === 'three_d_secure_required') {
          cardNum.textContent = '•••• •••• •••• 3000';
        } else {
          cardNum.textContent = '•••• •••• •••• 4242';
        }
      }

      // 5. Cardholder & Exp
      if (cardHolder && payload && payload.customer) {
        cardHolder.textContent = payload.customer === 'cus_84920412' ? 'Alex Mercer' : 'Marcus Vance';
      }

      // 6. Acquirer & Latency Display
      const acquirerName = (body.routing && body.routing.selected_acquirer) ? body.routing.selected_acquirer.replace('acq_', '').replace('_', ' ').toUpperCase() : 'Chase Paymentech';
      if (resultAcquirer) {
        resultAcquirer.textContent = acquirerName + ' (Optimal Route)';
      }
      if (resImageAcquirer) {
        resImageAcquirer.textContent = acquirerName;
      }
      if (resImageLatency && body.routing && body.routing.latency_ms) {
        resImageLatency.textContent = body.routing.latency_ms + ' ms';
      }

      // 7. Risk Score
      if (resultRisk) {
        if (body.risk_evaluation) {
          resultRisk.textContent = body.risk_evaluation.score + ' (' + body.risk_evaluation.level.toUpperCase() + ')';
          resultRisk.className = body.risk_evaluation.level === 'low' ? 'badge bg-success-subtle text-success' : 'badge bg-warning-subtle text-warning';
        } else if (isDeclined) {
          resultRisk.textContent = 'High / Card Issuer Block';
          resultRisk.className = 'badge bg-danger-subtle text-danger';
        } else {
          resultRisk.textContent = '0.02 (Low Risk)';
          resultRisk.className = 'badge bg-success-subtle text-success';
        }
      }
    }

    /**
     * Update URL Bar and Headers
     */
    function updateEndpointUI(endpointKey) {
      const ep = endpoints[endpointKey];
      if (!ep) return;
      state.currentEndpoint = endpointKey;

      if (methodBadge) {
        methodBadge.textContent = ep.method;
        methodBadge.className = `badge font-monospace ${ep.method === 'POST' ? 'bg-primary' : 'bg-success'}`;
      }
      if (urlDisplay) {
        urlDisplay.textContent = ep.url;
      }
    }

    /**
     * Populate Form Fields from Payload
     */
    function syncPayloadToForm(payload) {
      if (!payload) return;
      if (formAmount && payload.amount !== undefined) {
        formAmount.value = (payload.amount / 100).toFixed(2);
      }
      if (payload.currency) {
        updateCurrencyDisplay(payload.currency);
      } else if (formCurrency) {
        updateCurrencyDisplay(formCurrency.value || 'usd');
      }
      if (formCustomer && payload.customer) {
        formCustomer.value = payload.customer;
      }
      if (formCard && payload.payment_method) {
        formCard.value = payload.payment_method;
      }
      if (formOrderId && payload.metadata && payload.metadata.order_id) {
        formOrderId.value = payload.metadata.order_id;
      }
      if (formSmartRetry && payload.routing && payload.routing.smart_retry !== undefined) {
        formSmartRetry.checked = payload.routing.smart_retry;
      }
    }

    /**
     * Sync Form Fields into JSON Payload
     */
    function syncFormToPayload() {
      let currentPayload = {};
      try {
        currentPayload = JSON.parse(payloadTextarea.value || '{}');
      } catch (e) {
        currentPayload = endpoints[state.currentEndpoint].defaultPayload;
      }

      if (state.currentEndpoint === 'charges') {
        const amt = parseFloat(formAmount ? formAmount.value : '49.00');
        currentPayload.amount = Math.round((isNaN(amt) ? 49 : amt) * 100);
        if (formCurrency) {
          currentPayload.currency = formCurrency.value;
          updateCurrencyDisplay(formCurrency.value);
        }
        if (formCustomer) currentPayload.customer = formCustomer.value;
        if (formCard) currentPayload.payment_method = formCard.value;
        if (!currentPayload.metadata) currentPayload.metadata = {};
        if (formOrderId) currentPayload.metadata.order_id = formOrderId.value;
        if (!currentPayload.routing) currentPayload.routing = {};
        if (formSmartRetry) currentPayload.routing.smart_retry = formSmartRetry.checked;
      }

      payloadTextarea.value = JSON.stringify(currentPayload, null, 2);
    }

    /**
     * Load a Scenario
     */
    function loadScenario(scenarioKey) {
      const sc = scenarios[scenarioKey];
      if (!sc) return;
      state.currentScenario = scenarioKey;

      // Switch endpoint
      if (endpointSelect) {
        endpointSelect.value = sc.endpoint;
      }
      updateEndpointUI(sc.endpoint);

      // Set Payload
      const formatted = JSON.stringify(sc.payload, null, 2);
      if (payloadTextarea) {
        payloadTextarea.value = formatted;
      }
      syncPayloadToForm(sc.payload);

      // Active chip styling
      if (scenarioChipsContainer) {
        const chips = scenarioChipsContainer.querySelectorAll('.scenario-chip');
        chips.forEach(chip => {
          if (chip.getAttribute('data-scenario') === scenarioKey) {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });
      }

      // Generate a fresh Idempotency Key
      const newIdem = 'idem_' + Math.random().toString(36).substring(2, 11);
      state.headers['Idempotency-Key'] = newIdem;
      if (idempotencyInput) {
        idempotencyInput.value = newIdem;
      }
    }

    /**
     * Execute Simulated API Call
     */
    function executeApiCall() {
      if (!executeBtn) return;

      // Read current payload safely
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(payloadTextarea.value || '{}');
      } catch (err) {
        if (typeof showToast === 'function') {
          showToast('Invalid JSON Payload. Please check syntax.', 'danger');
        } else {
          alert('Invalid JSON Payload: ' + err.message);
        }
        return;
      }

      // Button loading state
      const originalHtml = executeBtn.innerHTML;
      executeBtn.disabled = true;
      executeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Calling Gateway...';

      // Realistic Latency Simulation: 280ms - 460ms
      const simulatedDelay = Math.floor(Math.random() * 180) + 280;
      const reportedLatency = Math.floor(Math.random() * 18) + 28; // Wire latency in ms

      setTimeout(() => {
        // Find matching generator or fallback
        const sc = scenarios[state.currentScenario];
        let result = null;

        if (sc && sc.endpoint === state.currentEndpoint) {
          result = sc.responseGenerator(parsedPayload, reportedLatency);
        } else {
          // Dynamic generator for modified / custom calls
          result = {
            status: 200,
            statusText: 'OK',
            body: {
              id: 'req_' + Math.random().toString(36).substring(2, 14),
              object: state.currentEndpoint,
              status: 'processed',
              payload_received: parsedPayload,
              latency_ms: reportedLatency,
              created: Math.floor(Date.now() / 1000)
            },
            webhook: {
              id: 'evt_' + Math.random().toString(36).substring(2, 14),
              type: `${state.currentEndpoint}.updated`,
              created: Math.floor(Date.now() / 1000),
              api_version: '2026-04-01'
            }
          };
        }

        state.lastResponse = result;

        // Render Status Code Badge
        if (statusBadge) {
          if (result.status >= 200 && result.status < 300) {
            statusBadge.className = 'badge bg-success-subtle text-success border border-success fw-bold';
            statusBadge.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> ${result.status} ${result.statusText}`;
          } else {
            statusBadge.className = 'badge bg-danger-subtle text-danger border border-danger fw-bold';
            statusBadge.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${result.status} ${result.statusText}`;
          }
        }

        // Render Latency & Time
        if (latencyBadge) {
          latencyBadge.innerHTML = `<i class="bi bi-lightning-charge-fill me-1 text-warning"></i> ${reportedLatency} ms`;
        }
        if (timestampDisplay) {
          const now = new Date();
          timestampDisplay.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        }

        // Render Highlighted Response Body
        if (responseBodyPre) {
          responseBodyPre.innerHTML = syntaxHighlightJson(result.body);
        }

        // Render Webhook Payload
        if (webhookBodyPre) {
          const webhookPayload = {
            id: result.webhook.id,
            object: 'event',
            api_version: result.webhook.api_version,
            created: result.webhook.created,
            type: result.webhook.type,
            data: {
              object: result.body
            },
            delivery: {
              status: 'delivered',
              destination: 'https://api.northstarretail.com/webhooks/payflow',
              http_status: 200,
              attempts: 1,
              signature_header: 't=' + Math.floor(Date.now() / 1000) + ',v1=' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
            }
          };
          webhookBodyPre.innerHTML = syntaxHighlightJson(webhookPayload);
        }

        // Render HTTP Response Headers
        if (responseHeadersPre) {
          const headersText = [
            `HTTP/1.1 ${result.status} ${result.statusText}`,
            `Date: ${new Date().toUTCString()}`,
            `Content-Type: application/json; charset=utf-8`,
            `Connection: keep-alive`,
            `x-payflow-request-id: req_${Math.random().toString(36).substring(2, 14)}`,
            `x-payflow-version: 2026-04-01`,
            `x-idempotency-key: ${state.headers['Idempotency-Key']}`,
            `x-processing-time-ms: ${reportedLatency}`,
            `strict-transport-security: max-age=31536000; includeSubDomains`,
            `access-control-allow-origin: *`
          ].join('\n');
          responseHeadersPre.textContent = headersText;
        }

        // Render Visual Holographic Card & Clearance Slip
        renderVisualCard(result, parsedPayload);

        // Restore button state
        executeBtn.disabled = false;
        executeBtn.innerHTML = originalHtml;

        // Feedback toast
        if (typeof showToast === 'function') {
          if (result.status === 200 || result.status === 201) {
            showToast(`API Request succeeded (${result.status} ${result.statusText}) in ${reportedLatency}ms`, 'success');
          } else {
            showToast(`API Response: ${result.status} ${result.statusText} (${result.body.error ? result.body.error.message : 'Error'})`, 'danger');
          }
        }
      }, simulatedDelay);
    }

    // Bind Endpoint Selector Change
    if (endpointSelect) {
      endpointSelect.addEventListener('change', (e) => {
        const epKey = e.target.value;
        updateEndpointUI(epKey);
        const defaultPayload = endpoints[epKey] ? endpoints[epKey].defaultPayload : {};
        if (payloadTextarea) {
          payloadTextarea.value = JSON.stringify(defaultPayload, null, 2);
        }
        syncPayloadToForm(defaultPayload);
      });
    }

    // Bind Scenario Chips Click
    if (scenarioChipsContainer) {
      scenarioChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.scenario-chip');
        if (!chip) return;
        const targetUrl = chip.getAttribute('data-url') || chip.getAttribute('href');
        const scKey = chip.getAttribute('data-scenario');

        // If scenario key exists, remember active scenario state
        if (scKey) {
          try {
            sessionStorage.setItem('payflowpro_active_scenario', scKey);
          } catch (err) {}
        }

        // When user clicks any of the scenario buttons, redirect to the relevant page
        if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('javascript:')) {
          window.location.href = targetUrl;
          return;
        }

        e.preventDefault();
        if (scKey) {
          loadScenario(scKey);
        }
      });
    }

    // Bind Currency Dropdown Changes (both change and input events)
    if (formCurrency) {
      const handleCurrencyChange = () => {
        updateCurrencyDisplay(formCurrency.value);
        syncFormToPayload();
      };
      formCurrency.addEventListener('change', handleCurrencyChange);
      formCurrency.addEventListener('input', handleCurrencyChange);
    }

    // Bind Currency Symbol Button Click (cycles currencies for instant switching)
    if (formAmountSymbol && formCurrency) {
      formAmountSymbol.addEventListener('click', (e) => {
        e.preventDefault();
        const options = Array.from(formCurrency.options);
        if (!options.length) return;
        const currentIndex = formCurrency.selectedIndex;
        const nextIndex = (currentIndex + 1) % options.length;
        formCurrency.selectedIndex = nextIndex;
        updateCurrencyDisplay(formCurrency.value);
        syncFormToPayload();
        if (formAmount) formAmount.focus();
      });
    }

    // Bind Other Form Input Changes -> Sync to JSON
    [formAmount, formCustomer, formCard, formOrderId].forEach(elem => {
      if (elem) {
        elem.addEventListener('input', syncFormToPayload);
      }
    });
    if (formSmartRetry) {
      formSmartRetry.addEventListener('change', syncFormToPayload);
    }

    // Reverse-sync JSON editor changes into Visual Builder
    if (payloadTextarea) {
      payloadTextarea.addEventListener('input', () => {
        try {
          const parsed = JSON.parse(payloadTextarea.value);
          if (parsed && typeof parsed === 'object') {
            if (parsed.currency) {
              updateCurrencyDisplay(parsed.currency);
            }
            if (parsed.amount !== undefined && formAmount) {
              formAmount.value = (parsed.amount / 100).toFixed(2);
            }
          }
        } catch (_) {
          // Ignore invalid JSON while user is actively typing
        }
      });
    }

    // Ensure currency symbol is initialized immediately
    updateCurrencyDisplay(formCurrency ? formCurrency.value : 'usd');

    // Bind Execute Button Click
    if (executeBtn) {
      executeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        executeApiCall();
      });
    }

    // Copy Response JSON
    if (copyResponseBtn) {
      copyResponseBtn.addEventListener('click', () => {
        if (!state.lastResponse) {
          if (typeof showToast === 'function') showToast('Please execute an API request first.', 'info');
          return;
        }
        const text = JSON.stringify(state.lastResponse.body, null, 2);
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') {
            showToast('Response JSON copied to clipboard!', 'success');
          }
        }).catch(() => {
          alert('Copied to clipboard!');
        });
      });
    }

    // Copy cURL Command
    if (copyCurlBtn) {
      copyCurlBtn.addEventListener('click', () => {
        const ep = endpoints[state.currentEndpoint];
        const rawJson = payloadTextarea ? payloadTextarea.value.replace(/'/g, "'\\''") : '{}';
        const curlCmd = `curl -X ${ep.method} "${ep.url}" \\\n  -H "Authorization: Bearer ${state.apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -H "Idempotency-Key: ${state.headers['Idempotency-Key']}" \\\n  -d '${rawJson}'`;
        
        navigator.clipboard.writeText(curlCmd).then(() => {
          if (typeof showToast === 'function') {
            showToast('cURL command copied to clipboard!', 'success');
          }
        }).catch(() => {
          alert('cURL copied!');
        });
      });
    }

    // Copy API Key
    if (copyApiKeyBtn) {
      copyApiKeyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(state.apiKey).then(() => {
          if (typeof showToast === 'function') {
            showToast('Sandbox API key copied to clipboard!', 'success');
          }
        }).catch(() => {
          alert('API key copied!');
        });
      });
    }

    // Toggle API Key Visibility
    if (toggleApiKeyBtn && apiKeyDisplay) {
      toggleApiKeyBtn.addEventListener('click', () => {
        state.isKeyVisible = !state.isKeyVisible;
        if (state.isKeyVisible) {
          apiKeyDisplay.textContent = state.apiKey;
          toggleApiKeyBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
        } else {
          apiKeyDisplay.textContent = 'sk_test_•••••••••••••••••••••••••';
          toggleApiKeyBtn.innerHTML = '<i class="bi bi-eye"></i>';
        }
      });
    }

    // Keyboard Shortcut inside Modal: Ctrl+Enter / Cmd+Enter executes
    modalEl.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeApiCall();
      }
    });

    // Global Triggers: Any button with data-sandbox-trigger or class btn-try-sandbox opens the modal
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btnTrySandbox, #btnTestInConsole, .btn-try-sandbox, [data-sandbox-trigger]');
      if (trigger) {
        e.preventDefault();
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      }
    });

    // Initial setup on modal shown: auto-run the default scenario if first time
    modalEl.addEventListener('shown.bs.modal', () => {
      if (!state.lastResponse) {
        loadScenario('visa_success');
        executeApiCall();
      }
    });

    // Auto-open modal if URL has #sandbox
    if (window.location.hash === '#sandbox') {
      setTimeout(() => {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      }, 300);
    }
  });
})();
