# Exam API - Backend (MERN)

A backend service for an online exam system built with **Node.js**, **Express**, and **MongoDB**.  
Supports **JWT authentication with cookies**, question fetching from OpenTDB API, and exam result submission.

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Gangadhar184/LeadMasterAI-Tech-Solutions-Assignment.git
   cd server

    Install dependencies
     npm install

     Run the Backend
     cd server
     npx nodemon src/index.js


## API Routes

Authentication (Cookie-based JWT)

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/signup` | Register a new user         |
| POST   | `/api/auth/login`    | Login user & set JWT cookie |
| POST   | `/api/auth/logout`   | Logout & clear cookie       |

## Exam Routes

| Method | Endpoint              | Description                            | Auth Required |
| ------ | --------------------- | -------------------------------------- | ------------- |
| GET    | `/api/exam/questions` | Fetch 10 random questions from OpenTDB | ✅             |
| POST   | `/api/exam/submit`    | Submit answers & store results         | ✅             |

## Folder Structure

```bash
server/
├── src/
│   ├── config/         # Configuration files (DB)
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── services/        # External API calls / helpers
│   ├── middlewares/     # Auth middleware
│   └── index.js         # Entry point
└── package.json



