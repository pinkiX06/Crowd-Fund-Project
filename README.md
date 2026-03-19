
# CrowdReview - Crowdsourced Review Platform

A full-stack MERN (MongoDB, Express, Node.js,React) application for reviewing and rating local businesses.

## Features

- **Browse Businesses** — Search and filter by category, city.
- **User Authentication** — Register/login with JWT-based auth.
- **Submit Reviews** — Rate businesses on quality, service, and value (1-5 stars).
- **Photo Uploads** — Attach up to 5 photos per review.
- **Review Approval Workflow** — Admin must approve/reject reviews before they go live.
- **Rating Aggregation** — Automatic average calculation across all approved reviews.
- **Admin Dashboard** — Stats overview, manage pending reviews, approve/reject with notes.
- **Responsive Design** — Works on desktop and mobile.
## ScreenShots
<img width="1536" height="926" alt="image" src="https://github.com/user-attachments/assets/87233c74-8950-4e34-89cd-9c0666179ab6" />

<img width="1656" height="915" alt="image" src="https://github.com/user-attachments/assets/f180ee5d-c6aa-47f4-a799-9fa8b286ef1e" />

<img width="1746" height="982" alt="image" src="https://github.com/user-attachments/assets/418643f6-07c4-44d9-b997-5f49e2f95da2" />

<img width="1509" height="927" alt="image" src="https://github.com/user-attachments/assets/a460c552-90e6-49da-ab89-c02272a82e2f" />

<img width="1624" height="901" alt="image" src="https://github.com/user-attachments/assets/ffd9f5d5-7dc1-4646-b794-1b7e805d5133" />

<img width="1527" height="468" alt="image" src="https://github.com/user-attachments/assets/3c734993-26fa-4a4d-8d65-ce8d7ce978d2" />

<img width="1614" height="914" alt="image" src="https://github.com/user-attachments/assets/316af4db-3b54-4093-893a-f7b261375354" />

<img width="1613" height="984" alt="image" src="https://github.com/user-attachments/assets/122ac556-5392-484f-9c49-9a4d77bb3c8d" />

## Admin Interface
<img width="1591" height="914" alt="image" src="https://github.com/user-attachments/assets/c8d34436-02f3-473a-8f17-3bd1ab5d9dc8" />

<img width="1636" height="968" alt="image" src="https://github.com/user-attachments/assets/1c480853-a9d6-4335-a760-264dd5a94570" />

<img width="1582" height="919" alt="image" src="https://github.com/user-attachments/assets/3bad8fdd-7fee-42d2-bc40-29b74cec2ef2" />

<img width="1654" height="922" alt="image" src="https://github.com/user-attachments/assets/94f6177f-cb44-4aa6-b93a-85be633160a5" />

<img width="1620" height="976" alt="image" src="https://github.com/user-attachments/assets/b9ef5621-9295-4969-b38e-f912bfabd8fe" />

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
│       └── utils/      
 # Axios API client
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
