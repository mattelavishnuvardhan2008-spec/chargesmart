# ⚡ ChargeSmart

ChargeSmart is a full-stack, production-ready EV charging platform. It features a dual-portal system: an **EV Driver Portal** for finding and booking chargers, and a **Station Operator Portal** for managing stations and viewing analytics.

## 🔗 Live Demo
- **URL:** [https://chargesmart.vercel.app](https://chargesmart.vercel.app)
- *(Note: The backend uses Vercel Serverless Functions, so the first request may take 1-2 seconds to spin up).*

---

## ✨ Features

### 🔐 Authentication & Security
- Secure Sign-up and Login with password hashing (`bcrypt`).
- JWT-based authentication stored in secure, `httpOnly` cookies.
- Role-based access control (RBAC): Drivers and Operators have completely separate dashboards and API permissions.

### 🚗 EV Driver Portal
- **Find Stations:** Browse your own database network or toggle to **Public Discovery** to see real, live charging stations in India via the Open Charge Map API.
- **Bookings:** Book a specific port for a specific time slot. The database automatically prevents double-booking.
- **History & Dashboard:** View upcoming reservations, past charging sessions, and quick stats.

### 🏢 Station Operator Portal
- **Station Management:** Add new charging stations to the Cloudflare D1 database, or delete existing ones.
- **Booking Management:** View all customer reservations across the network.
- **Analytics:** View live utilization metrics and network statistics.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router DOM (v7)
- Lucide React (Icons)
- Vanilla CSS (Custom Design System)

**Backend & Database:**
- Python 3.12 (FastAPI)
- Cloudflare D1 (Serverless SQLite)
- `httpx` (for Cloudflare API & Open Charge Map requests)
- `bcrypt` & `python-jose` (for security)

**Hosting:**
- Vercel (Frontend & Serverless Python Backend)

---

## 📂 Project Structure

```text
chargesmart/
├── api/
│   └── index.py              # FastAPI backend & Cloudflare D1 integration
├── src/
│   ├── components/           # Reusable UI (e.g., BookingModal)
│   ├── context/              # React Context (AuthProvider)
│   ├── layouts/              # Driver & Admin sidebar layouts
│   ├── lib/                  # API fetch wrapper
│   └── pages/                # React views (Login, User pages, Admin pages)
├── schema.sql                # Cloudflare D1 Database structure
├── seed.sql                  # Initial dummy data for stations
├── vercel.json               # Vercel routing configuration
├── requirements.txt          # Python dependencies
└── pyproject.toml            # Python version configuration
