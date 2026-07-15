# 📅 Hack-O-Week (Odd Semester 2026-27)

## Week 2 - Student Task Manager with Responsive UI

### 📌 Project Overview

This project is developed as part of the **Hack-O-Week (Odd Semester 2026-27)** program.

For **Week 2**, the existing **Student Task Manager REST API** was enhanced by developing a **responsive and interactive frontend** using **HTML, CSS, and JavaScript**. The project now provides a user-friendly interface for managing student tasks while continuing to use the backend REST API developed in Week 1.

The application allows users to create, view, update, delete, and manage tasks directly through a modern web interface.

---

# 🎯 Objective

- Build a responsive frontend for the existing REST API.
- Improve user experience with an intuitive interface.
- Integrate frontend and backend seamlessly.
- Learn DOM manipulation and asynchronous API calls.
- Enhance the project with better usability and design.

---

# 🛠 Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript (ES6)
- REST API
- JSON
- Fetch API
- Git & GitHub

---

# 📂 Project Structure

```
Student-Task-Manager-REST-API
│
├── public
│   ├── css
│   │   └── style.css
│   ├── js
│   │   └── app.js
│   └── index.html
│
├── app.js
├── tasks.js
├── package.json
├── package-lock.json
└── README.md
```

---

# ✨ Features

- Responsive UI for Desktop, Tablet, and Mobile devices
- View all student tasks
- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Dynamic task rendering
- Real-time interaction with REST APIs
- Clean and modern user interface
- Improved user experience

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

# 🎨 UI Improvements

- Responsive layout using modern CSS
- Improved spacing and typography
- Interactive forms
- Better button styling
- Mobile-friendly design
- Dynamic task cards
- Smooth user interactions
- Organized interface for better accessibility

---

# 📬 Testing

- Tested all REST API endpoints successfully.
- Verified frontend-backend integration.
- Tested CRUD operations through the web interface.
- Checked responsiveness across different screen sizes.

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

Open your browser and visit:

```
http://localhost:3000
```

---

# 📖 Concepts Learned in Week 2

- Frontend Development Basics
- Responsive Web Design
- HTML5 & CSS3
- JavaScript DOM Manipulation
- Fetch API
- API Integration
- Event Handling
- Responsive Layout Design
- Client-Server Communication
- Full Stack Integration

---

# 🔮 Future Improvements

- MongoDB Database Integration
- User Authentication & Authorization
- JWT Security
- Search and Filter Tasks
- Task Categories
- Priority Levels
- Due Date Notifications
- Dark Mode
- Drag & Drop Task Management
- Cloud Deployment

---

# 📌 Week 2 Summary

✅ Designed and developed a responsive frontend

✅ Integrated frontend with the Week 1 REST API

✅ Implemented task management through the UI

✅ Enhanced user experience with a clean interface

✅ Tested complete CRUD functionality

✅ Optimized the application for different screen sizes

✅ Uploaded the updated project to GitHub

---

## 👨‍💻 Author

**Vedant Nawghare**

Hack-O-Week (Odd Semester 2026-27)
