# PayFlowPro — Premium Merchant Services & Payment Processing HTML5 Template

**PayFlowPro** is a modern, responsive, commercial-grade HTML5/CSS3/Vanilla JavaScript template engineered specifically for **Merchant Service Providers, Payment Processing Facilitators, POS Hardware Distributors, FinTech Platforms, and SaaS Digital Gateways**.

---

## 🌟 Key Features

- **Zero Build Tools or Dependencies**: Runs instantly by opening `.html` files in any modern browser. No Node.js, PHP, or compilation required.
- **Dual Homepage Concepts**:
  - **Home 1 (`index.html`)**: General merchant services, omnichannel POS terminals, and retail payment processing.
  - **Home 2 (`home-2.html`)**: Developer-first payment infrastructure, multi-acquiring routing, and recurring SaaS subscriptions.
- **Complete Merchant Admin Dashboard (`admin/`)**:
  - Live KPI metric status blocks.
  - Interactive **Chart.js** Area and Doughnut charts with automated Dark Mode adaptation.
  - Searchable and filterable transaction ledgers with CSV export triggers.
  - Virtual Terminal for manual card authorizations.
  - POS Hardware Fleet Diagnostics (WiFi/Cellular, Battery, Ping).
  - Settlements, Customer CRM, Orders, Reports, Support Inbox, and API Settings.
- **Full Theme & Direction System**:
  - **Dark Mode**: Smooth contrast surface inversions with persistent `localStorage` memory.
  - **Bi-Directional RTL Support**: Complete layout mirroring for Arabic and Hebrew locales.
- **8 Dedicated Service Detail Pages**:
  - Credit Card Processing, POS Systems, Online Payments, Mobile Payments, Payment Gateway APIs, Recurring Subscriptions, Fraud Protection (3DS2), and Merchant Analytics.
- **Interactive Blog System**:
  - Client-side real-time title/excerpt search.
  - Dynamic category pill filtering (`Processing`, `Security`, `SaaS`, `POS`).
  - 4 comprehensive editorial article pages.
- **FormSubmit.co Contact Integration**: Working serverless email submission on `contact.html`.
- **Marketplace Standard Code**: Clean semantic HTML5, CSS Custom Properties (Design Tokens), Bootstrap 5.3 CDN, and Bootstrap Icons.

---

## 📁 File Structure

```text
payflowpro/
│
├── index.html                           # Home 1: General Merchant Services
├── home-2.html                          # Home 2: SaaS & Digital Infrastructure
├── about.html                           # About Us, Leadership & Timeline
├── services.html                        # Master Services Directory
├── pricing.html                         # Pricing Calculator & Feature Matrix
├── contact.html                         # Contact Us + FormSubmit.co Integration
├── blog.html                            # Blog Archive with Live Filter & Search
├── 404.html                             # Custom Error 404 Page
├── login.html                           # Merchant Portal Login Form
├── forgot-password.html                 # Merchant Password Reset Portal
├── register.html                        # Merchant Account Onboarding Form
├── coming-soon.html                     # Pre-launch Countdown Page
├── maintenance.html                     # Scheduled Maintenance Status
│
├── services/                            # Dedicated Service Detail Pages
│   ├── payment-processing.html          # Interchange-Plus Card Processing
│   ├── pos-systems.html                 # Smart POS Hardware & Terminals
│   ├── online-payments.html             # Hosted Checkouts & Payment Links
│   ├── mobile-payments.html             # Tap-to-Pay & Wireless mPOS
│   ├── payment-gateway.html             # REST API & Tokenization Gateway
│   ├── recurring-billing.html           # Subscription & Dunning Engine
│   ├── fraud-protection.html            # 3D Secure 2.0 & Chargeback Shield
│   └── merchant-analytics.html          # Revenue Intelligence & Telemetry
│
├── blog/                                # Dedicated Article Detail Pages
│   ├── payment-processing.html          # Interchange-Plus vs Tiered Pricing
│   ├── payment-security.html            # PCI-DSS 4.0 Compliance Checklist
│   ├── saas-payments.html               # Multi-Acquiring Gateway Routing
│   └── pos-guide.html                   # Next-Gen Smart POS Terminals
│
├── admin/                               # Merchant Portal Dashboard
│   ├── index.html                       # Dashboard Overview & Charts
│   ├── transactions.html                # Live Transaction Ledger & CSV Export
│   ├── payments.html                    # Virtual Terminal (Direct Card Entry)
│   ├── orders.html                      # Omnichannel Order Fulfillment
│   ├── customers.html                   # Merchant Customer Directory
│   ├── settlements.html                 # Batch Payouts & Linked Banks
│   ├── reports.html                     # Monthly Statements & 1099-K Taxes
│   ├── terminals.html                   # Hardware Fleet Monitor & Pairing
│   ├── messages.html                    # Support Ticket Center & Disputes
│   ├── analytics.html                   # Channel Revenue Distributions
│   └── settings.html                    # Profile, 2FA & API Key Management
│
├── assets/
│   ├── css/
│   │   ├── style.css                    # Design Tokens, Components & UI
│   │   ├── responsive.css               # Media Queries (320px – 1920px)
│   │   ├── dark.css                     # Comprehensive Dark Theme System
│   │   └── rtl.css                      # RTL Layout & Typography Overrides
│   │
│   └── js/
│       ├── main.js                      # Sticky Header, Counters, Toggles & Toasts
│       ├── theme.js                     # Dark/Light Engine with LocalStorage
│       ├── rtl.js                       # RTL/LTR Direction Engine
│       ├── blog.js                      # Client-side Search & Category Filters
│       ├── dashboard.js                 # Admin Sidebar, Chart.js & Table Filters
│       └── validation.js                # Form Validation & Password Toggles
│
└── README.md                            # Complete Documentation
```

---

## 🎨 Customizing Brand Colors

All brand colors, fonts, and elevations are centralized in [`assets/css/style.css`](file:///d:/Merchent%20Services%20&%20Payment%20processing%20provider/assets/css/style.css):

```css
:root {
  --primary-color: #0d3880;     /* Deep Fintech Navy Blue */
  --secondary-color: #0066ff;   /* Royal Blue Accent */
  --accent-color: #00d2ff;      /* High-Tech Cyan */
  --dark-color: #0a1128;        /* Midnight Dark Base */
  --light-color: #f8fafc;       /* Clean Light Background */
  --card-bg: #ffffff;           /* Card Surface */
  --success-color: #10b981;     /* Approved / Green */
  --danger-color: #ef4444;      /* Declined / Red */
}
```

---

## ✉️ Configuring FormSubmit.co on `contact.html`

The contact form is configured to work without any backend server using FormSubmit.co.

Open [`contact.html`](file:///d:/Merchent%20Services%20&%20Payment%20processing%20provider/contact.html) and update line 96:

```html
<!-- Replace YOUR_EMAIL@example.com with your active recipient inbox -->
<form action="https://formsubmit.co/your-inbox@domain.com" method="POST" class="needs-validation" novalidate>
```

---

## 🌓 Dark Mode & RTL Engine Usage

Both Dark Mode and RTL switches persist preferences in the user's browser:
- `payflow_theme`: stores `'light'` or `'dark'`.
- `payflow_dir`: stores `'ltr'` or `'rtl'`.

Any new elements added will automatically inherit proper colors and mirrored text alignment.

---

## 🔒 Demo Data & Compliance Disclaimer

All customer profiles, credit card numbers (`4242 •••• •••• 4242`), merchant transaction volumes, company names (`Northstar Retail`, `Brightline Foods`, `Apex Digital`), and API keys in this template are **fictional mock data** created for front-end demonstration purposes only.
