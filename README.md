# 🌿 जय भारत बुद्ध वैदिकी (Jay Bharat Buddh Vaidhiki)
### Authentic Ayurvedic Care, Medicine Store & Clinic Platform

A high-performance, full-featured web application built for an Ayurvedic healthcare center and online medicine store located in Sikriganj, Gorakhpur.

**Project Live Link:** (https://jaibharat-buddha-ayurved.vercel.app/)

**for Admin Pannel**
**email** : admin@ayurved.com
**password** : admin123


---

## ✨ Key Features

- **🌿 E-Commerce Store**: Browse authentic Ayurvedic medicines with category filters, medicine details, benefits, dosage, ingredients, and cart management.
- **⚡ ImageKit CDN Integration**: Fast client-side image uploads and dynamic web optimization (WebP/AVIF, responsive thumbnailing) to maintain zero database storage overhead.
- **📅 Vaidya Appointment Booking**: Online consultation appointment scheduling with preferred date/time slots.
- **🔒 User Authentication**: Secure patient signup, login, session persistence, and order history tracking.
- **⚙️ Admin Management Panel**:
  - Medicine inventory (CRUD operations, stock tracking, image management).
  - Category manager (icons, ordering, descriptions).
  - Appointment manager (status tracking, patient records).
  - Customer order fulfillment tracker.
- **📱 Fully Responsive Design**: Mobile-first design with smooth infinite announcement marquee, compact mobile menu, and clean navigation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **CDN & Media Server**: ImageKit CDN (HMAC-SHA1 authentication)
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Auth)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ayurved.git
   cd ayurved
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your Supabase and ImageKit credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Typecheck & Production Build**:
   ```bash
   npm run typecheck
   npm run build
   ```

---

## 🌐 Environment Variables Guide

| Variable | Description |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon publishable API key |
| `VITE_IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `VITE_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint (`https://ik.imagekit.io/...`) |
| `VITE_IMAGEKIT_PRIVATE_KEY` | ImageKit private key for signature authentication |

---

## 📄 License & Ownership

Developed for **Jay Bharat Buddh Vaidhiki** (Sikriganj, Gorakhpur). All rights reserved.
