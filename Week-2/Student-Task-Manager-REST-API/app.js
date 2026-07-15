const express = require("express");
const tasks = require("./tasks");

const app = express();

app.use(express.json());

// Enable CORS for external API testing (e.g. Postman, live-server)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

// Serve frontend static files from the 'public' folder
app.use(express.static("public"));

// Helper route to check API status
app.get("/api/health", (req, res) => {
    res.send("Student Task Manager REST API is Running!");
});

// GET - Retrieve tasks with search, filter, and sort capabilities
app.get("/tasks", (req, res) => {
    let filteredTasks = [...tasks];
    const { search, status, priority, subject, sortBy, order } = req.query;

    // 1. Search query (matches title, description, subject)
    if (search) {
        const query = search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            (task.title && task.title.toLowerCase().includes(query)) ||
            (task.description && task.description.toLowerCase().includes(query)) ||
            (task.subject && task.subject.toLowerCase().includes(query))
        );
    }

    // 2. Filter by status
    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status.toLowerCase() === status.toLowerCase());
    }

    // 3. Filter by priority
    if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority.toLowerCase() === priority.toLowerCase());
    }

    // 4. Filter by subject
    if (subject) {
        filteredTasks = filteredTasks.filter(task => task.subject.toLowerCase() === subject.toLowerCase());
    }

    // 5. Sorting
    if (sortBy) {
        const sortOrder = order && order.toLowerCase() === 'desc' ? -1 : 1;
        filteredTasks.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            // Custom ordering for priority (High > Medium > Low)
            if (sortBy === 'priority') {
                const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
                valA = priorityWeight[a.priority] || 0;
                valB = priorityWeight[b.priority] || 0;
            }

            if (valA === undefined) return 1;
            if (valB === undefined) return -1;

            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * sortOrder;
            }
            return (valA - valB) * sortOrder;
        });
    }

    res.json(filteredTasks);
});

// GET - Retrieve statistical summary (must be before /tasks/:id)
app.get("/tasks/stats", (req, res) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "Completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
    const pendingTasks = tasks.filter(t => t.status === "Pending").length;
    
    // Check if task is overdue (status is not Completed and deadline is in the past)
    const todayStr = new Date().toISOString().split('T')[0];
    const overdueTasks = tasks.filter(t => t.status !== "Completed" && t.deadline && t.deadline < todayStr).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Group task count by subject
    const subjectCounts = {};
    tasks.forEach(t => {
        const sub = t.subject || "General";
        subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
    });

    res.json({
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completionRate,
        subjectCounts
    });
});

// GET - Retrieve task by ID
app.get("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});

// POST - Add a new task
app.post("/tasks", (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    // Generate safe next ID
    const nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

    const newTask = {
        id: nextId,
        title: req.body.title,
        description: req.body.description || "",
        subject: req.body.subject || "General",
        deadline: req.body.deadline || new Date().toISOString().split('T')[0],
        status: req.body.status || "Pending",
        priority: req.body.priority || "Medium",
        created_at: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// POST - Clear all completed tasks (bulk action)
app.post("/tasks/clear-completed", (req, res) => {
    const initialLength = tasks.length;
    
    // Modify tasks array in-place to preserve exported reference
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (tasks[i].status === "Completed") {
            tasks.splice(i, 1);
        }
    }

    const clearedCount = initialLength - tasks.length;

    res.json({
        message: `Cleared ${clearedCount} completed tasks successfully`,
        clearedCount: clearedCount
    });
});

// PUT - Update a task
app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.subject !== undefined) task.subject = req.body.subject;
    if (req.body.deadline !== undefined) task.deadline = req.body.deadline;
    if (req.body.status !== undefined) task.status = req.body.status;
    if (req.body.priority !== undefined) task.priority = req.body.priority;

    res.json({
        message: "Task updated successfully",
        task: task
    });
});

// PATCH - Toggle status of a task between Pending/In Progress and Completed
app.patch("/tasks/:id/toggle", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.status = task.status === "Completed" ? "Pending" : "Completed";

    res.json({
        message: `Task status updated to ${task.status}`,
        task: task
    });
});

// DELETE - Delete a task
app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});