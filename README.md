# Chandan Transportation Services

A full-stack transportation booking and operations application for Jharkhand-based taxi services.

## Stack

- Frontend: React + Vite + TypeScript + Tailwind
- Backend: Node.js + Express + TypeScript
- Database: MongoDB with in-memory fallback for local development

## Quick start

1. Install dependencies:
   - `npm install`
   - `npm --prefix backend install`
   - `npm --prefix frontend install`
2. Copy the backend environment template:
   - `cp backend/.env.example backend/.env`
3. Seed the database:
   - `npm run seed:backend`
4. Start the backend:
   - `npm run dev:backend`
5. Start the frontend:
   - `npm run dev:frontend`

## Default admin login

- Email: `admin@chandantransport.in`
- Password: `Admin@123`

## Useful scripts

- `npm run build:backend`
- `npm run build:frontend`
- `npm run test:backend`
- `npm run test:frontend`

## Notes

- The backend falls back to an in-memory MongoDB instance automatically when no MongoDB server is available.
- The frontend calls the backend at `http://localhost:5000/api/v1` by default.
- Public service, route, and vehicle-category listings are loaded from the API. Booking estimates and final fare validation remain server-side.
- Corporate rates and additional-charge policies are public only when an administrator marks the stored values active and verified. Manage rate entries at `/admin/catalog`; manage services at `/admin/services`.
- Corporate quote requests are stored as inquiries and can be reviewed and status-updated at `/admin/inquiries`.
- Website content and contact details can be edited at `/admin/settings`; contact information and business copy are public only after their respective verification switches are enabled.
- Customer registration is available at `/register`. Customer account and booking-history pages require login; administration pages also enforce backend roles.

## Before publishing

- The approved CT Services logo is stored at `frontend/src/assets/images/ct-services-logo.jpg` and is used in the navigation, homepage, footer, login page, and favicon.
- Verify the supplied phone numbers, email, website, pricing, and service claims with the business before adding them to public settings. Unverified contact details and reference prices are not displayed.
- Rotate the seeded administrator password before deploying outside a local development environment.
