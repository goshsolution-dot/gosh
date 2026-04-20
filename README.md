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

## MVP Features

### Public Website
- **Solutions Listing**: Browse software solutions by industry
- **Industry Filtering**: Filter solutions by Education, Retail, Health industries
- **Demo Requests**: Request demos for available solutions
- **Discussion Booking**: Book consultation discussions
- **Payment Submission**: Submit payments with transaction references
- **Hosting Requests**: Request hosting services (AWS, GCP, Azure)

### Admin Dashboard
- **Login System**: JWT-based admin authentication
- **Dashboard Overview**: Summary statistics (solutions, customers, bookings, payments)
- **Records Management**: View all bookings, payments, customers, and solutions
- **Tabbed Interface**: Organized data views with tables

## API Endpoints

### Public Endpoints
- `GET /api/industries` - Get all industries with solutions
- `GET /api/solutions` - Get solutions (filter by industry)
- `GET /api/solutions/:id` - Get specific solution
- `POST /api/demo-requests` - Submit demo request
- `POST /api/discussions` - Submit discussion booking
- `POST /api/payments` - Submit payment reference
- `POST /api/hosting-requests` - Submit hosting request

### Admin Endpoints (JWT Required)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/overview` - Dashboard statistics
- `GET /api/admin/records` - All system records

## Database Schema

- **Industries**: id, name
- **Solutions**: id, name, description, industry_id, demo_link, demo_available
- **Customers**: id, name, email, phone
- **Bookings**: id, type, customer_id, solution_id, requested_date, message, provider, service_details
- **Payments**: id, customer_id, amount, transaction_reference, service

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Sequelize, SQLite
- **Frontend**: React, TypeScript, Vite, React Router
- **Database**: SQLite (development), ScyllaDB (production per requirements)
- **Authentication**: JWT for admin access
