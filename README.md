# ChatLedger AI — Multi-Tenant WhatsApp-First AI Operations, Invoicing & Lead Management SaaS

ChatLedger AI is an enterprise-grade, scalable, multi-tenant SaaS platform built to help small and medium businesses (clinics, salons, coaching institutes, real estate agencies, local retailers, and service consultants) manage their entire customer communication, appointment booking, and UPI payments through WhatsApp and an intelligent AI assistant.

---

## 🌟 Application Architecture & Portals

The application delivers separate, independent frontend experiences connected to a centralized NestJS backend with strict tenant-level PostgreSQL data isolation:

1. **Public Marketing Website (`http://localhost:3000`)**
   - Hero section with live interactive WhatsApp assistant demo
   - ROI Profit Calculator based on response speed & monthly inquiries
   - Pre-configured industry solutions (Clinics, Salons, Coaching, Real Estate)
   - SaaS Pricing plans & 14-day free trial registration

2. **Business Owner Dashboard (`http://localhost:3000/dashboard`)**
   - White-first enterprise design system with 5 appearance presets
   - Global **`Cmd+K`** Command Palette
   - 16 modular sections including:
     - Overview Analytics (KPIs, lead acquisition trends, conversion rate)
     - WhatsApp Shared Team Inbox (3-column layout with 1-click Human Handover)
     - AI Assistant Center (Personality, hours, guardrails, and tool playground)
     - CRM Leads (Kanban Board + Table View with duplicate prevention)
     - Customer 360 Directory (LTV, past visits, tags)
     - Appointments (Collision-free transactional slot booking)
     - Visual Workflow Automations (Triggers, conditions, and actions)
     - WhatsApp Broadcast Campaigns (Approved Meta templates & delivery tracking)
     - Tasks & Follow-ups
     - Customer Payments (Razorpay payment links with 18% GST and invoice receipts)
     - Executive Reports & Analytics
     - Team Members & RBAC Permissions
     - Knowledge Base (FAQs, document text chunking & RAG embeddings)
     - Integrations (Meta WhatsApp Cloud API v19.0, Razorpay, Google Calendar)
     - SaaS Subscription & Billing (Starter, Growth, Professional, Enterprise)
     - Business Settings & Working Hours

3. **Employee Workspace (`http://localhost:3000/workspace`)**
   - Focused interface for staff agents (receptionists, support agents, sales reps)
   - Manage assigned customer chats with real WhatsApp replies and internal staff notes
   - Track individual daily performance targets, bookings, and follow-ups

4. **SaaS Super Admin Console (`http://localhost:3000/admin`)**
   - Platform governance & ecosystem oversight
   - MRR, total tenant directory, industry distribution, suspend/reactivate tenants
   - AI token usage & OpenAI expense accounting
   - Multi-tenant data privacy safeguards enforced
   - Customer support triage tickets & platform audit logs

5. **Customer WhatsApp Experience Simulator (`http://localhost:3000/whatsapp-simulator`)**
   - High-fidelity smartphone mockup running WhatsApp
   - Dispatches simulated incoming Meta Webhooks to `POST /api/v1/whatsapp/simulate-incoming`
   - Real-time AI Assistant responses citing available slots, prices, and locations
   - Instantly updates the Business Owner shared team inbox!

6. **Razorpay Trusted Checkout Portal (`http://localhost:3000/pay/:id`)**
   - Standalone customer payment portal for WhatsApp invoices
   - Instant UPI apps (Google Pay, PhonePe, Paytm, BHIM), dynamic QR scan, and Cards
   - Automated 18% GST tax calculation and instant WhatsApp confirmation receipt

7. **Centralized Backend REST API & OpenAPI Docs**
   - Base URL: `http://localhost:4000/api/v1`
   - Interactive Swagger API Documentation: `http://localhost:4000/api/docs`

---

## 🔐 Seeded Demo Accounts & Credentials

| Role | Email | Password | Access Portal |
|---|---|---|---|
| **Business Owner** (Doctor/Admin) | `doctor.sharma@apexclinic.com` | `Password123!` | `/dashboard` |
| **Front Desk Reception** | `reception@apexclinic.com` | `Password123!` | `/workspace` |
| **Support Specialist** | `support@apexclinic.com` | `Password123!` | `/workspace` |
| **Super Admin** | `admin@nexaflow.ai` | `AdminPassword123!` | `/admin` |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18
- PostgreSQL 16
- Redis 7+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp apps/backend/.env.example apps/backend/.env
```

### 3. Database Migration & Seed
```bash
cd apps/backend
npx prisma db push
npm run seed
```

### 4. Run Development Servers
```bash
# Terminal 1 - Backend API (Port 4000)
cd apps/backend && npm run start:dev

# Terminal 2 - Next.js Frontend (Port 3000)
cd apps/web && npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📄 License
Proprietary & Confidential. All rights reserved.
