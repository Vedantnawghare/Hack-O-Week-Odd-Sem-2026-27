# 📅 Hack-O-Week (Odd Semester 2026-27)

## Week 1 - Student Task Manager REST API

### 📌 Project Overview

This project is developed as part of the **Hack-O-Week (Odd Semester 2026-27)** program.

For **Week 1**, we built a **Student Task Manager REST API** using **Node.js** and **Express.js**. The project demonstrates the fundamentals of Backend Development and REST API concepts by implementing complete CRUD (Create, Read, Update, Delete) operations.

The API allows users to manage student tasks such as assignments, projects, and deadlines.

---

# 🎯 Objective

- Learn Backend Development fundamentals.
- Understand REST API architecture.
- Learn HTTP methods.
- Build a simple CRUD application.
- Test APIs using Postman.

---

# 🛠 Technologies Used

- Node.js
- Express.js
- JavaScript
- REST API
- JSON
- Postman
- Git & GitHub

---

# 📂 Project Structure

```
Student-Task-Manager-REST-API
│
├── app.js
├── tasks.js
├── package.json
├── package-lock.json
└── README.md
```

---

# ✨ Features

- View all student tasks
- View a task using its ID
- Add a new task
- Update an existing task
- Delete a task
- JSON-based API responses
- Tested using Postman

---

# 🌐 REST API Endpoints

## GET - Get all tasks

```
GET /tasks
```

Returns all available tasks.

---

## GET - Get task by ID

```
GET /tasks/:id
```

Returns a specific task.

Example:

```
GET /tasks/1
```

---

## POST - Add a new task

```
POST /tasks
```

Example JSON:

```json
{
    "title": "Complete Java Assignment",
    "subject": "Java",
    "deadline": "2026-07-15",
    "status": "Pending"
}
```

---

## PUT - Update a task

```
PUT /tasks/:id
```

Example:

```
PUT /tasks/1
```

---

## DELETE - Delete a task

```
DELETE /tasks/:id
```

Example:

```
DELETE /tasks/1
```

---

# 📬 Testing

All API endpoints were tested successfully using **Postman**.

---

# 🚀 How to Run the Project

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

or

```bash
npm run dev
```

The server runs on:

```
http://localhost:3000
```

---

# 📖 Concepts Learned in Week 1

- Introduction to Backend Development
- Node.js Basics
- Express.js Framework
- REST API Fundamentals
- HTTP Methods (GET, POST, PUT, DELETE)
- CRUD Operations
- JSON Data Handling
- API Testing using Postman
- Git & GitHub Basics

---

# 🔮 Future Improvements

- Connect MongoDB Database
- User Authentication
- JWT Security
- Input Validation
- React Frontend
- Search and Filter Tasks
- User Login System

---

# 📌 Week 1 Summary

✅ Set up a Node.js project

✅ Installed and configured Express.js

✅ Created a REST API server

✅ Implemented complete CRUD operations

✅ Tested APIs using Postman

✅ Uploaded the project to GitHub

---

## 👨‍💻 Author

**Vedant Nawghare**

Hack-O-Week (Odd Semester 2026-27)