# Lagos Digital Levy Pass & IGR Transparency Portal

[![Live Production](https://img.shields.io/badge/Azure_App_Service-Live_Production-065F46?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://lagos-digital-levy-portal-g8hdf8d5bxg5gxhn.westus3-01.azurewebsites.net)
[![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18_+_Vite-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-Automated_CI%2FCD-1D4ED8?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/osegbeg/GoMyCode-MSc-Program)

> **MSc in Computer Science: Software Engineering — Final Capstone Project**  
> **Author:** Golden-Joe Osegbe  
> **Institution:** GoMyCode  
> **Live Production Portal:** https://lagos-digital-levy-portal-g8hdf8d5bxg5gxhn.westus3-01.azurewebsites.net  
> **Video Presentation & Live Demo:** `https://drive.google.com/file/d/1a-SDaqE-YiHLjbMyHJoGIGF347i3dlwZ/view?usp=sharing`

---

## 1. Executive Overview

The **Lagos Digital Levy Pass & IGR Transparency Portal** is a cloud-native civic technology platform built to modernize daily operational levy compliance for informal commercial transport operators (*Danfo*, *Korope*, *Keke Napep*, *Okada*) and open-market traders across Lagos State.

In Lagos's informal transit sector—which handles over 20 million daily passenger trips—manual cash-based street ticketing creates three systemic problems:
1. **Multi-Point Street Extortion (*"Owo Da"*):** Drivers receive untraceable paper receipts and are routinely coerced into paying multiple times within a single day along the same corridor.
2. **Internally Generated Revenue (IGR) Leakage:** Dispersed cash collections cannot be reconciled in real time against active fleet sizes, resulting in significant municipal revenue loss.
3. **Commuter Plate-Traceability Blind Spot:** While cash collection does not cause *"one-chance"* commercial bus crime, the lack of a centralized, publicly verifiable daily pass leaves commuters with no fast way to confirm whether a vehicle's license plate is legitimately registered and active before boarding.

This platform resolves these challenges by issuing **tamper-evident 24-hour digital passes (`LGS-IGR-*`)**, enforcing **anti-extortion duplicate-billing guards (`HTTP 409 Conflict`)**, decoupling payment issuance from **zero-cash roadside verification**, and exposing real-time **corridor-level IGR analytics**.

---

## 2. Core Features & Stakeholder Portals

| Portal Role | Key Capabilities |
| :--- | :--- |
| **1. Operator Portal & Digital Wallet** | • Generates 24-hour digital levy passes (`LGS-IGR-XXXXXX`) with automatic corridor tariff lookup.<br>• **Anti-Extortion Duplicate Guard:** Blocks duplicate billing (`HTTP 409 Conflict`) if an `ACTIVE` pass already exists for the vehicle plate and zone.<br>• Live countdown timer (`ACTIVE` vs. `EXPIRED`), digital pass wallet history, and one-click 24-hour renewal. |
| **2. Field Officer & Commuter Lookup** | • Instant zero-cash compliance verification by **vehicle plate number**, **operator ID**, or **pass reference code**.<br>• Allows commuters to verify commercial bus registration before boarding to deter *"one-chance"* risks.<br>• Automatically appends every lookup into an immutable **Verification Audit Log**. |
| **3. IGR Transparency Admin Dashboard** | • Real-time KPI cards: Total Remitted IGR (`NGN`), Total Passes Issued, Active Passes, and Expired Passes.<br>• Filterable master remittance ledger by Lagos corridor, status, or keyword.<br>• Centralized management of official state tariff schedules (`PUT /api/rates/:id`). |

> **Phase-1 Scope Boundary:** Third-party payment gateway settlement (Paystack / Flutterwave / Interswitch webhooks) is intentionally simulated upon pass confirmation in Phase 1 to focus engineering validation on core domain invariants, duplicate-levy prevention, audit trail immutability, and automated cloud CI/CD delivery.

---

## 3. System Architecture

The application uses a **Single-Origin Full-Stack Layered Architecture** deployed on **Microsoft Azure App Service (Linux, Node 20 LTS)**. Serving the compiled React Single-Page Application directly from Express.js eliminates Cross-Origin Resource Sharing (CORS) preflight latency on mobile networks and consolidates TLS termination under a single HTTPS endpoint.

```mermaid
flowchart TB
    subgraph Azure["Microsoft Azure App Service (Linux • Node.js 20 LTS • Single-Origin HTTPS)"]
        subgraph Client["Client Tier — React 18 + Vite SPA (/dist)"]
            UI1["1. Operator Portal & Wallet"]
            UI2["2. Officer & Commuter Lookup"]
            UI3["3. IGR Transparency Admin"]
        end

        subgraph API["Application & API Tier — Node.js 20 + Express.js"]
            EP1["Tariff Engine & Pass Issuance\n(POST /api/passes)"]
            EP2["Anti-Extortion Duplicate Guard\n(HTTP 409 Conflict)"]
            EP3["24h Lifecycle Evaluator &\nReal-Time IGR Aggregator"]
            EP4["Compliance Verifier &\nImmutable Audit Logger"]
        end

        Repo["Data Access Repository Abstraction (server/db.js)"]

        Client <-->|"Same-Origin HTTPS / JSON REST (/api/*)"| API
        API <--> Repo
    end

    Repo -->|"Primary (MONGODB_URI set)"| Mongo[("MongoDB Atlas Cloud\n(rates • passes • verificationLogs)")]
    Repo -->|"Resilient Fallback Mode"| JSON[("Local JSON Persistence\n(data/store.json)")]

    4. Technology Stack
Frontend: React 18, Vite 5, Custom Responsive Civic CSS (client/src/styles.css)

Backend: Node.js 20 LTS, Express.js 4.21, CORS, Dotenv

Persistence Layer: Dual-Mode Repository (server/db.js) supporting MongoDB Atlas (Mongoose 8.8) with indexed schemas and automatic fallback to Local JSON Storage (data/store.json)

Testing: Node.js Native Test Runner (node:test & node:assert/strict)

CI/CD & Cloud Hosting: GitHub Actions (.github/workflows/azure-deploy.yml) + Microsoft Azure App Service (Linux F1)

├── .github/
│   └── workflows/
│       └── azure-deploy.yml        # Automated CI/CD pipeline (test -> build -> Azure deploy)
├── client/
│   ├── src/
│   │   ├── App.jsx                 # Multi-role tabbed UI (Operator, Officer/Commuter, IGR Admin)
│   │   ├── main.jsx                # React 18 entry point
│   │   └── styles.css              # Civic design system & responsive layout
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── db.js                       # Repository abstraction (MongoDB Atlas + JSON store fallback)
│   ├── server.js                   # Express REST API & static SPA asset server
│   ├── tests/
│   │   └── api.test.js             # Automated API integration test suite
│   └── package.json
└── README.md


## Local Setup & Running Automated Tests
Prerequisites
Node.js 20 LTS or higher and npm

1. Clone and Install Dependencies
Bash
git clone [https://github.com/osegbeg/GoMyCode-MSc-Program.git](https://github.com/osegbeg/GoMyCode-MSc-Program.git)
cd GoMyCode-MSc-Program

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
2. Configure Environment Variables (Optional)
By default, the application runs out-of-the-box with zero external setup using data/store.json. To connect to MongoDB Atlas, create server/.env:

Code snippet
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lagos_levy_portal
3. Run Automated Integration Tests
Bash
cd server
npm test
Runs node --test tests/api.test.js, verifying /api/health, pass creation (201), anti-extortion duplicate blocking (409), and compliance audit logging.

4. Run in Development or Production Mode
Bash
# Build React frontend into client/dist
cd client && npm run build

# Start unified Express API + SPA server
cd ../server && npm start
Open http://localhost:5000 in your browser.


Phase-2 Roadmap
Live Payment Gateway Webhooks: Direct integration with Paystack, Flutterwave, and Interswitch for automated settlement reconciliation.

Telco USSD Accessibility (*...#): Offline pass generation and SMS receipt delivery for drivers using non-smartphone feature phones.

Cryptographic Offline QR Verification: HMAC-SHA256 signed QR codes allowing field marshals to verify passes offline in low-connectivity corridors.

Role-Based Access Control (RBAC): OAuth 2.0 / JWT authentication separating OPERATOR, ENFORCEMENT_OFFICER, and IGR_ADMIN privileges.