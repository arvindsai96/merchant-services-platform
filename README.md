# PayFlowPro — Merchant Services & Payment Processing Platform

A commercial-grade, responsive HTML5 / CSS3 / Vanilla JavaScript web platform engineered for **Merchant Service Providers, Payment Processing Facilitators, POS Hardware Distributors, FinTech Platforms, and SaaS Digital Gateways**.

---

## 🚀 Live Demo & Repository
- **Repository**: [https://github.com/arvindsai96/merchant-services-platform](https://github.com/arvindsai96/merchant-services-platform)
- **Author**: [@arvindsai96](https://github.com/arvindsai96)

---

## 🌟 Key Features

- **Zero Build Tools or Dependencies**: Runs instantly by opening `.html` files in any modern web browser or via static local server. No complex build pipelines required.
- **Dual Homepage Concepts**:
  - **Home 1 (`index.html`)**: Omnichannel merchant services, retail payment processing, and smart POS terminals.
  - **Home 2 (`home-2.html`)**: Developer-first payment infrastructure, multi-acquiring routing, webhooks, and recurring SaaS billing.
- **Merchant Admin & Analytics Dashboard (`admin/`)**:
  - Real-time KPI metric cards & status badges.
  - Interactive **Chart.js** Area and Doughnut charts with automated dark theme adaptation.
  - Live filterable transaction ledgers with CSV export.
  - Virtual Terminal for manual card authorizations.
  - POS Hardware Fleet Diagnostics (WiFi/Cellular, Battery, Ping).
  - Payouts, Customer CRM, Reports, Support Inbox, and Developer API Settings.
- **Full Theme & Direction System**:
  - **Dark Mode**: High-contrast dark theme with persistent `localStorage` preference.
  - **Bi-Directional RTL Support**: Complete layout mirroring for Arabic/Hebrew locales.
- **8 Dedicated Service Detail Pages**:
  - Credit Card Processing, Smart POS Systems, Online Payments, Mobile Payments, Payment Gateway APIs, Recurring Subscriptions, Fraud Protection (3DS2), and Merchant Analytics.
- **Industry Solutions**:
  - Tailored landing pages for E-commerce, Retail, SaaS, B2B Wholesale, Healthcare, and Hospitality.
- **Interactive Blog & Resource Hub**:
  - Client-side real-time search & dynamic category pill filtering.
  - In-depth fintech articles on interchange pricing, PCI-DSS 4.0, smart dunning, and payment security.
- **Zero-Backend Form Integration**:
  - Configured with FormSubmit.co on `contact.html` for immediate serverless email routing.

---

## 📁 Project Structure

```text
merchant-services-platform/
│
├── index.html                           # Home 1: General Merchant Services
├── home-2.html                          # Home 2: SaaS & Payment Infrastructure
├── about.html                           # Company Profile, Leadership & Timeline
├── services.html                        # Master Services Directory
├── solutions.html                       # Industry Solutions Directory
├── pricing.html                         # Transparent Pricing & Cost Calculator
├── contact.html                         # Contact Form (FormSubmit.co ready)
├── blog.html                            # Blog Archive with Search & Category Filters
├── 404.html                             # Custom Error 404 Page
├── login.html                           # Merchant Portal Login Form
├── forgot-password.html                 # Merchant Password Reset Portal
├── register.html                        # Merchant Account Onboarding Form
├── coming-soon.html                     # Pre-launch Countdown Page
├── maintenance.html                     # Scheduled Maintenance Status
├── user-dashboard.html                  # Customer Self-Service Portal
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
├── solutions/                           # Industry Vertical Landing Pages
│   ├── ecommerce.html                   # E-Commerce & Marketplaces
│   ├── retail.html                      # Multi-Location Retail
│   ├── saas.html                        # SaaS & Digital Platforms
│   ├── b2b.html                         # B2B Wholesale & Net-30 Invoicing
│   ├── healthcare.html                  # Healthcare & Patient Portals
│   └── hospitality.html                 # Restaurants & Hospitality POS
│
├── blog/                                # Dedicated Editorial Articles
│   ├── payment-processing.html          # Interchange-Plus vs Tiered Pricing
│   ├── payment-security.html            # PCI-DSS 4.0 Compliance Checklist
│   ├── saas-payments.html               # Multi-Acquiring Gateway Routing
│   ├── pos-guide.html                   # Next-Gen Smart POS Terminals
│   ├── 3d-secure-guide.html             # Biometric 3DS2 Guide
│   ├── chargeback-fraud.html            # Chargeback Mitigation Strategies
│   ├── cloud-kitchen-pos.html           # Cloud Kitchen POS Architectures
│   ├── durbin-amendment.html            # Durbin Amendment Debit Regulations
│   ├── metered-billing.html             # Usage-Based & Metered Billing
│   ├── settlement-windows.html          # Same-Day ACH & Settlement Windows
│   ├── smart-dunning.html               # AI Smart Dunning & Retry Logic
│   └── tap-to-pay.html                  # Apple/Google Tap-to-Pay on COTS
│
├── admin/                               # Merchant Administration Dashboard
│   ├── index.html                       # Dashboard Overview & Live Charts
│   ├── transactions.html                # Live Transaction Ledger & CSV Export
│   ├── payments.html                    # Virtual Terminal (Card Entry)
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
│   │   ├── style.css                    # Core Design System, Variables & Components
│   │   ├── responsive.css               # Responsive Breakpoints (320px – 1920px)
│   │   ├── dark.css                     # Dark Theme Design System
│   │   └── rtl.css                      # Bi-Directional RTL Overrides
│   ├── js/
│   │   ├── main.js                      # Sticky Header, Counters, Toggles & UI Logic
│   │   ├── theme.js                     # Dark/Light Mode Engine with LocalStorage
│   │   ├── rtl.js                       # RTL/LTR Direction Engine
│   │   ├── blog.js                      # Client-side Search & Category Filters
│   │   ├── dashboard.js                 # Admin Sidebar, Chart.js & Data Tables
│   │   ├── sandbox.js                   # Developer Sandbox & Interactive Tools
│   │   └── validation.js                # Form Validation & Field Masking
│   ├── images/                          # High-Res Visual Assets & Icons
│   └── docs/                            # Sample PDF Merchant Handbooks
│
├── .gitignore                           # Git Ignore Rules
└── README.md                            # Repository Documentation
```

---

## 🎨 Design System & Customization

All styling variables (colors, typography, spacing, border radiuses) are configured in [`assets/css/style.css`](file:///d:/Merchent%20Services%20&%20Payment%20processing%20provider/assets/css/style.css):

```css
:root {
  --primary-color: #0d3880;     /* Deep Fintech Navy Blue */
  --secondary-color: #0066ff;   /* Royal Blue Accent */
  --accent-color: #00d2ff;      /* High-Tech Cyan */
  --dark-color: #0a1128;        /* Midnight Dark Base */
  --light-color: #f8fafc;       /* Clean Light Surface */
  --card-bg: #ffffff;           /* Card Background */
  --success-color: #10b981;     /* Approved / Success */
  --danger-color: #ef4444;      /* Declined / Alert */
}
```

---

## ⚡ Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arvindsai96/merchant-services-platform.git
   cd merchant-services-platform
   ```

2. **Run locally:**
   - Double-click [`index.html`](file:///d:/Merchent%20Services%20&%20Payment%20processing%20provider/index.html) in your browser, or
   - Use VS Code **Live Server** extension, or
   - Run any simple local server:
     ```bash
     # Using Python
     python -m http.server 8000

     # Or using Node npx
     npx serve .
     ```
   - Open `http://localhost:8000` in your browser.

---

## 🌓 Dark Mode & RTL Support

Preferences are automatically stored in the browser:
- `payflow_theme`: `'light'` | `'dark'`
- `payflow_dir`: `'ltr'` | `'rtl'`

---

## 🔒 License & Disclaimer

All customer profiles, mock cards, transaction data, company references, and API keys shown throughout this platform are fictional demo data created for template demonstration and UI/UX testing purposes.
