# 🏥 Healthcare Wellness & Preventive Care Portal

A MERN-based web application.  
The portal focuses on **wellness tracking**, **preventive care**, **secure authentication**, and **role-based access** for patients and healthcare providers.

---

## 🚀 Project Overview

This portal enables:

### 👤 Patients

- Track daily wellness goals (steps, active calories,sleep, active time)
- View preventive care reminders
- See “Health Tip of the Day”
- Manage their health profile

### 🩺 Healthcare Providers

- View assigned patients
- Monitor each patient's wellness compliance

### 🌍 Public Users

- View general health information like:
  - COVID-19 updates
  - Seasonal flu prevention

---

## 🎯 MVP Features

### 🔐 1. Secure Authentication

- Register/Login for **patients** and **providers**
- JWT authentication with expiration
- Password hashing (bcrypt)
- Role-based access control
- Consent checkbox during registration

### 📊 2. Patient Dashboard

- Steps tracker with progress bar
- Sleep hours tracker
- Active time tracker
- Preventive care reminders
- Health Tip of the Day section
- Clean UI

### 👤 3. Profile Management

- View personal health information
- Edit details (age, allergies, medications, etc.)

### 🩺 4. Provider Dashboard

- List of patients assigned to provider
- Compliance overview (steps/sleep/activity)
- Click patient card for detailed stats

### 🌐 5. Public Health Info Page

- COVID-19 guidelines
- Seasonal flu prevention
- Static info cards with “Read More”

### 🔒 6. Privacy & Security

- JWT + bcrypt hashing
- Environment variables for sensitive data
- Basic request logging
- Data access restrictions per role
- Basic HIPAA-aligned practices (access control, encryption)

---

## 🛠️ Tech Stack

| Layer      | Tools                                       |
| ---------- | ------------------------------------------- |
| Frontend   | ReactJS / Tailwind                          |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB                                     |
| Auth       | JWT, bcrypt                                 |
| Deployment | Vercel (frontend), Render/Railway (backend) |

---

## 🏗️ Architecture

- **React frontend** for UI
- **Express backend** for REST API
- **MongoDB Atlas** for cloud NoSQL storage
- **JWT Authentication** for secured routes
- Clean separation of:
  - Frontend
  - Backend
  - Database
  - Config & middleware

---

## 📁 Folder Structure

/frontend
/client
/src
/components
/pages
/services
/hooks
App.js

/server
/src
/config
/controllers
/routes
/middleware
/models
server.js

---

## 🔌 API Endpoints

### AUTH

- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`

### PATIENT

- GET `/patient/profile`
- PATCH `/patient/profile`
- GET `/patient/goals`
- POST `/patient/goals`
- GET `/patient/reminders`
- POST `/patient/reminders`

### PROVIDER

- GET `/provider/patients`
- GET `/provider/patient/:id`

### PUBLIC

- GET `/public/info`

---

## 📌 Summary

This project fulfills the HCL Hackathon requirements by delivering:

- Secure authentication
- Patient & provider dashboards
- Wellness goal tracking
- Preventive care reminders
- Public health info page
- Proper architecture & cloud deployment

A complete, functional, and scalable **Healthcare Wellness & Preventive Care Portal**.

---
