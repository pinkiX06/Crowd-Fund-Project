# CrowdReview - Crowdsourced Review Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for reviewing and rating local businesses.

## Features

- **Browse Businesses** — Search and filter by category, city.
- **User Authentication** — Register/login with JWT-based auth.
- **Submit Reviews** — Rate businesses on quality, service, and value (1-5 stars).
- **Photo Uploads** — Attach up to 5 photos per review.
- **Review Approval Workflow** — Admin must approve/reject reviews before they go live.
- **Rating Aggregation** — Automatic average calculation across all approved reviews.
- **Admin Dashboard** — Stats overview, manage pending reviews, approve/reject with notes.
- **Responsive Design** — Works on desktop and mobile.

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose schemas (User, Business, Review)
│   ├── routes/          # Express API routes (auth, businesses, reviews, admin)
│   ├── middleware/       # Auth (JWT) and file upload (Multer) middleware
│   ├── server.js        # Express app entry point
│   ├── seed.js          # Database seeder with sample data
│   └── .env             # Environment variables
├── frontend/
│   └── src/
│       ├── components/  # Navbar, Stars
│       ├── context/     # AuthContext (React Context + JWT)
│       ├── pages/       # Home, Businesses, BusinessDetail, Login, Register, MyReviews, AdminDashboard
│       └── utils/       # Axios API client
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)

## Getting Started

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

Edit `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/crowdfund
JWT_SECRET=your_secret_key_here
PORT=5000
```

### 3. Create uploads directory

```bash
mkdir backend/uploads
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

This creates sample data with these login credentials:

| Role  | Email                    | Password    |
|-------|--------------------------|-------------|
| Admin | admin@crowdreview.com    | admin123    |
| User  | alice@example.com        | password123 |
| User  | bob@example.com          | password123 |
| User  | carol@example.com        | password123 |

### 5. Start the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```



## API Endpoints
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Auth
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |

### Businesses
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/businesses            | List (search/filter/page)|
| GET    | /api/businesses/categories | Get all categories       |
| GET    | /api/businesses/:id        | Get single business      |
| POST   | /api/businesses            | Create (admin only)      |
| PUT    | /api/businesses/:id        | Update (admin only)      |
| DELETE | /api/businesses/:id        | Delete (admin only)      |

### Reviews
| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| GET    | /api/reviews/business/:businessId | Get approved reviews    |
| GET    | /api/reviews/my                   | Get user's own reviews  |
| POST   | /api/reviews                      | Submit review (auth)    |

### Admin
| Method | Endpoint                          | Description             |
|--------|-----------------------------------|-------------------------|
| GET    | /api/admin/reviews                | List reviews by status  |
| PUT    | /api/admin/reviews/:id/approve    | Approve review          |
| PUT    | /api/admin/reviews/:id/reject     | Reject review           |
| GET    | /api/admin/stats                  | Dashboard statistics    |
