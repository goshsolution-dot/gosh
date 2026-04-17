# GOSH Solutions Platform

Monorepo scaffold for the GOSH Solutions MVP platform.

## Structure

- `backend/` - Express API with Sequelize ORM and layered architecture
- `frontend/` - React + Vite UI scaffold for MVP pages

## Getting Started

1. Run `npm install`
2. Copy `backend/.env.example` to `backend/.env` and update values
3. Start backend: `npm run dev:backend`
4. Start frontend: `npm run dev:frontend`

## MVP Scope

- Solutions + industries listing
- Demo request and discussion booking
- Payment submission by transaction reference
- Hosting service request form
- Basic admin route with JWT login
