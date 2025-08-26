Employee Leave Management System (ELMS)

A full-stack web application to manage employee leave requests with real-time approval, rejection, location tracking, and analytics.

Project Overview

ELMS is designed to streamline leave management for organizations. Employees can apply for leaves with geolocation tracking, and administrators can approve, reject, and monitor leaves efficiently.

Key Highlights:

Location logging for leave applications.

Email notifications for status updates.

Export leave history to PDF/Excel.

Interactive analytics for admin dashboard.

🛠 Technology Stack
Layer	Technology / Tool
Frontend	React 19, Tailwind CSS, Axios, Recharts, React Toastify
Backend	Node.js, Express.js, MongoDB
Deployment	Docker, Render, Jenkins (CI/CD)
Maps & Geo	Google Maps API
⚙️ Features
Employee

Apply for leave (with reason and type).

Auto log location (latitude, longitude, IP).

View applied leave status.

View leave history in calendar.

Export leave data (PDF/Excel).

Admin

Approve/reject leave requests.

Monitor leave locations on Google Maps.

Export leave data for auditing.

View analytics of leave trends (charts/statistics).

HR

Approve/reject leave requests.

Export leave data for auditing.

View analytics of leave trends (charts/statistics).

Search/filter leave requests by employee, type, status, or date.

Project Structure
/backend       --> Node.js + Express backend, MongoDB models, APIs
/frontend      --> React frontend with Tailwind CSS
.gitignore
Jenkinsfile    --> CI/CD pipeline
docker-compose.yml
render.yaml    --> Render deployment configuration

Setup Instructions
Backend
cd backend
npm install
cp .env.example .env  # configure MongoDB URI and Google Maps API key
nodemon server.js

Frontend
cd frontend
npm install
npm run dev


Access: Open http://localhost:5173 in your browser (default Vite port).

📄 License

This project is licensed under the MIT License - see the LICENSE
 file for details.
