# 🎓 InternHub
A full-stack Internship Management System built with MERN Stack and Microservices Architecture.

## 👥 Team
| Member | Role | Service |
|--------|------|---------|
| Upeksha (Leader) | Auth + Frontend | auth-service (Port 5001) |
| jayani | Vacancy Management | vacancy-service (Port 5002) |
| diyana | Study Materials | study-material-service (Port 5003) |
| ruwandi| Quiz Management | quiz-service (Port 5004) |

## 🏗️ Architecture
- **Frontend:** React + Vite + Tailwind CSS (Port 5173)
- **Auth Service:** Express + MongoDB (Port 5001)
- **Vacancy Service:** Express + MongoDB (Port 5002)
- **Study Material Service:** Express + MongoDB (Port 5003)
- **Quiz Service:** Express + MongoDB (Port 5004)
- **API Gateway:** Express (Port 5000)

## 🚀 Features
- ✅ Student Registration & Login
- ✅ JWT Authentication
- ✅ Student Dashboard
- ✅ Internship Vacancy Listings
- ✅ Student Applications
- ✅ Study Materials
- ✅ Quizzes & Progress Tracking
- ✅ Admin Dashboard

## 🛠️ Tech Stack
- MongoDB Atlas
- Express.js
- React.js
- Node.js
- Tailwind CSS
- JWT Authentication

## ⚙️ Setup Instructions
1. Clone the repo
2. cd into each service and run `npm install`
3. Create `.env` from `.env.example`
4. Run `npm run dev` in each service
5. Run `npm run dev` in client folder
