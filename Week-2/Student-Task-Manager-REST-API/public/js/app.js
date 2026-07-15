// ==========================================
// Ved Presents App Logic - API handlers & DOM binds
// ==========================================

const API_BASE = ''; // Relative paths since we serve frontend from the same server

// Circle Circumference for Completion Rate Ring
const CIRCLE_RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// DOM Elements
const taskListContainer = document.getElementById('task-list-container');
const emptyState = document.getElementById('task-empty-state');
const displayedCount = document.getElementById('displayed-count');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const btnClearCompleted = document.getElementById('btn-clear-completed');
const subjectTagsList = document.getElementById('subject-tags-list');

// Stats Counters
const valTotalTasks = document.getElementById('val-total-tasks');
const valActiveTasks = document.getElementById('val-active-tasks');
const valOverdueTasks = document.getElementById('val-overdue-tasks');
const valCompletionRate = document.getElementById('val-completion-rate');
const progressCircle = document.querySelector('.progress-ring__circle');

// Theme Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const bodyEl = document.body;

// Modal Elements
const taskModal = document.getElementById('task-modal');
const btnAddTask = document.getElementById('btn-add-task');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');

// Form Inputs
const inputTaskId = document.getElementById('task-id');
const inputTitle = document.getElementById('form-title');
const inputDescription = document.getElementById('form-description');
const inputSubject = document.getElementById('form-subject');
const inputDeadline = document.getElementById('form-deadline');
const inputPriority = document.getElementById('form-priority');
const inputStatus = document.getElementById('form-status');

// Toast Notification
const toast = document.getElementById('toast');

// Application State
let activeFilters = {
    search: '',
    statuses: ['Pending', 'In Progress', 'Completed'], // Checked by default
    priority: 'All',
    subject: 'All'
};
let currentSort = 'deadline-asc';
let editingTaskId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Setup Circle SVG
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${CIRCUMFERENCE} ${CIRCUMFERENCE}`;
        progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
    }

    // Set Default Date in form to today
    const today = new Date().toISOString().split('T')[0];
    inputDeadline.value = today;

    // Load Theme Preference
    initTheme();

    // Start Live Clock
    startClock();

    // Load Data
    refreshData();

    // Bind Event Listeners
    bindEvents();
});

// ==========================================
// Theme Management
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    bodyEl.className = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = bodyEl.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    bodyEl.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// ==========================================
// Live Clock Widget
// ==========================================
function startClock() {
    const clockTime = document.getElementById('clock-time');
    
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        clockTime.textContent = `${hrs}:${mins}:${secs}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ==========================================
// Fetching Data from API
// ==========================================
async function refreshData() {
    try {
        await Promise.all([
            fetchTasks(),
            fetchStats(),
            fetchSubjects()
        ]);
    } catch (err) {
        console.error("Error refreshing data:", err);
        showToast("Error loading data from server", "error");
    }
}

// Build query parameter URL
function buildTaskUrl() {
    let url = `${API_BASE}/tasks?`;
    
    // Search
    if (activeFilters.search) {
        url += `search=${encodeURIComponent(activeFilters.search)}&`;
    }
    
    // Priority
    if (activeFilters.priority !== 'All') {
        url += `priority=${encodeURIComponent(activeFilters.priority)}&`;
    }

    // Subject
    if (activeFilters.subject !== 'All') {
        url += `subject=${encodeURIComponent(activeFilters.subject)}&`;
    }

    // Sorting
    const [sortBy, order] = currentSort.split('-');
    url += `sortBy=${sortBy}&order=${order}`;

    return url;
}

// Fetch and Render Task Cards
async function fetchTasks() {
    const url = buildTaskUrl();
    const response = await fetch(url);
    const allTasks = await response.json();
    
    // Front-end Filtering by Status checkbox (multiple values checked)
    // Note: status check matches activeFilters.statuses
    const filteredTasks = allTasks.filter(task => {
        return activeFilters.statuses.includes(task.status);
    });

    renderTasks(filteredTasks);
}

// Fetch and Render Statistics
async function fetchStats() {
    const response = await fetch(`${API_BASE}/tasks/stats`);
    const stats = await response.json();
    
    // Update Stats counters
    valTotalTasks.textContent = stats.totalTasks;
    valActiveTasks.textContent = stats.pendingTasks + stats.inProgressTasks;
    valOverdueTasks.textContent = stats.overdueTasks;
    valCompletionRate.textContent = `${stats.completionRate}%`;

    // Highlight Overdue Card if overdue exists
    const overdueCard = document.getElementById('stat-overdue');
    if (stats.overdueTasks > 0) {
        overdueCard.classList.add('pulse-danger');
    } else {
        overdueCard.classList.remove('pulse-danger');
    }

    // Update SVG Progress Ring
    updateProgressRing(stats.completionRate);
}

// Update Animated Circular Progress
function updateProgressRing(percent) {
    if (!progressCircle) return;
    const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = offset;
}

// Fetch all subjects and render the sidebar subject tags list
async function fetchSubjects() {
    const response = await fetch(`${API_BASE}/tasks`);
    const allTasks = await response.json();
    
    // Distinct subjects
    const subjects = ['All'];
    allTasks.forEach(task => {
        if (task.subject && !subjects.includes(task.subject)) {
            subjects.push(task.subject);
        }
    });

    renderSubjectTags(subjects);
}

// ==========================================
// Rendering Logic
// ==========================================

// Render Task List
function renderTasks(tasks) {
    taskListContainer.innerHTML = '';
    displayedCount.textContent = tasks.length;

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const todayStr = new Date().toISOString().split('T')[0];

    tasks.forEach(task => {
        const card = document.createElement('div');
        const isCompleted = task.status === 'Completed';
        
        // Priority classes
        const priorityClass = task.priority ? `priority-${task.priority.toLowerCase()}` : 'priority-medium';
        const cardClass = `task-card glass ${priorityClass} ${isCompleted ? 'completed' : ''}`;
        
        // Calculate due date status
        let deadlineHtml = '';
        if (task.deadline) {
            let isOverdue = !isCompleted && task.deadline < todayStr;
            let isToday = !isCompleted && task.deadline === todayStr;
            let dateClass = isOverdue ? 'overdue' : (isToday ? 'due-today' : '');
            let iconClass = isOverdue ? 'fa-solid fa-triangle-exclamation' : 'fa-regular fa-calendar';
            
            deadlineHtml = `
                <span class="task-tag-deadline ${dateClass}">
                    <i class="${iconClass}"></i>
                    ${isOverdue ? 'Overdue: ' : ''}${formatDate(task.deadline)}
                </span>
            `;
        }

        // Status badge format
        const statusClean = task.status.replace(/\s+/g, '').toLowerCase();
        const statusBadgeClass = `task-badge-status status-${statusClean}`;

        card.className = cardClass;
        card.setAttribute('data-id', task.id);
        card.innerHTML = `
            <div class="task-checkbox" onclick="toggleTaskStatus(${task.id})"></div>
            <div class="task-content">
                <div class="task-title-row">
                    <h3 class="task-title">${escapeHTML(task.title)}</h3>
                    <span class="${statusBadgeClass}">${task.status}</span>
                </div>
                ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}
                <div class="task-tags-row">
                    <span class="task-tag-subject">
                        <i class="fa-solid fa-tag"></i> ${escapeHTML(task.subject || 'General')}
                    </span>
                    <span class="task-badge-priority ${priorityClass}">
                        <i class="fa-solid fa-circle"></i> ${task.priority}
                    </span>
                    ${deadlineHtml}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-action" onclick="openEditModal(${task.id})" title="Edit Task">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <button class="btn-action btn-delete" onclick="deleteTask(${task.id})" title="Delete Task">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;

        taskListContainer.appendChild(card);
    });
}

// Render Subject Tags
function renderSubjectTags(subjects) {
    // Save current active subject selection
    let activeSubject = activeFilters.subject;
    
    // Fall back to "All" if the active subject filter has been deleted
    if (!subjects.includes(activeSubject)) {
        activeFilters.subject = 'All';
        activeSubject = 'All';
    }
    
    // Clear and build tags list
    subjectTagsList.innerHTML = '';
    
    subjects.forEach(subject => {
        const span = document.createElement('span');
        span.className = `subject-tag ${activeSubject === subject ? 'active' : ''}`;
        span.setAttribute('data-subject', subject);
        span.textContent = subject;
        
        span.addEventListener('click', () => {
            document.querySelectorAll('.subject-tag').forEach(t => t.classList.remove('active'));
            span.classList.add('active');
            activeFilters.subject = subject;
            fetchTasks();
        });

        subjectTagsList.appendChild(span);
    });
}

// ==========================================
// Event Binding & DOM Actions
// ==========================================
function bindEvents() {
    // Theme Toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Search input (Debounced)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            activeFilters.search = e.target.value.trim();
            fetchTasks();
        }, 300);
    });

    // Status Filter Checkboxes
    const statusCheckboxes = document.querySelectorAll('input[name="status-filter"]');
    statusCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const allCheckbox = document.getElementById('filter-status-all');
            
            if (cb.value === 'All') {
                if (cb.checked) {
                    // Check all other checkboxes
                    statusCheckboxes.forEach(item => {
                        if (item.value !== 'All') item.checked = false;
                    });
                    activeFilters.statuses = ['Pending', 'In Progress', 'Completed'];
                } else {
                    // Unchecking all? Prevent it by keeping active status
                    cb.checked = true;
                }
            } else {
                // If a specific status is checked
                allCheckbox.checked = false;
                
                const checkedBoxes = Array.from(statusCheckboxes)
                    .filter(item => item.value !== 'All' && item.checked)
                    .map(item => item.value);

                if (checkedBoxes.length === 0) {
                    allCheckbox.checked = true;
                    activeFilters.statuses = ['Pending', 'In Progress', 'Completed'];
                } else {
                    activeFilters.statuses = checkedBoxes;
                }
            }
            fetchTasks();
        });
    });

    // Priority Filter Radios
    const priorityRadios = document.querySelectorAll('input[name="priority-filter"]');
    priorityRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            activeFilters.priority = e.target.value;
            fetchTasks();
        });
    });

    // Sort Dropdown Selector
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        fetchTasks();
    });

    // Modal Triggers
    btnAddTask.addEventListener('click', () => openAddModal());
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);
    
    // Modal background click to close
    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });

    // Form Submit (Add/Edit save)
    taskForm.addEventListener('submit', handleFormSubmit);

    // Clear Completed Button
    btnClearCompleted.addEventListener('click', clearCompletedTasks);
}

// ==========================================
// CRUD / Modal Controller Actions
// ==========================================

// Open Modal for Add
function openAddModal() {
    editingTaskId = null;
    modalTitle.textContent = 'Add New Task';
    inputTaskId.value = '';
    
    // Reset Form fields
    taskForm.reset();
    inputStatus.value = 'Pending';
    inputPriority.value = 'Medium';
    
    // Preset date to today
    const today = new Date().toISOString().split('T')[0];
    inputDeadline.value = today;

    // Reset validations
    document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('invalid'));

    taskModal.classList.remove('hidden');
}

// Open Modal for Edit (Populate details)
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`);
        if (!response.ok) throw new Error("Task not found");
        
        const task = await response.json();
        
        editingTaskId = id;
        modalTitle.textContent = 'Edit Task Details';
        inputTaskId.value = task.id;
        inputTitle.value = task.title;
        inputDescription.value = task.description || '';
        inputSubject.value = task.subject || '';
        inputDeadline.value = task.deadline || '';
        inputPriority.value = task.priority || 'Medium';
        inputStatus.value = task.status || 'Pending';

        // Reset validations
        document.querySelectorAll('.form-group').forEach(fg => fg.classList.remove('invalid'));

        taskModal.classList.remove('hidden');
    } catch (err) {
        console.error(err);
        showToast("Could not retrieve task details", "error");
    }
}

// Close Dialog
function closeModal() {
    taskModal.classList.add('hidden');
}

// Form Handler (Validation & Submit API)
async function handleFormSubmit(e) {
    e.preventDefault();

    // Simple visual validations
    let isValid = true;
    
    const titleGroup = inputTitle.closest('.form-group');
    if (!inputTitle.value.trim()) {
        titleGroup.classList.add('invalid');
        isValid = false;
    } else {
        titleGroup.classList.remove('invalid');
    }

    const deadlineGroup = inputDeadline.closest('.form-group');
    if (!inputDeadline.value) {
        deadlineGroup.classList.add('invalid');
        isValid = false;
    } else {
        deadlineGroup.classList.remove('invalid');
    }

    if (!isValid) return;

    // Build payload
    const payload = {
        title: inputTitle.value.trim(),
        description: inputDescription.value.trim(),
        subject: inputSubject.value.trim() || 'General',
        deadline: inputDeadline.value,
        priority: inputPriority.value,
        status: inputStatus.value
    };

    try {
        let response;
        if (editingTaskId) {
            // Edit PUT
            response = await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            // Create POST
            response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to save task");

        closeModal();
        showToast(editingTaskId ? "Task updated successfully!" : "Task created successfully!");
        refreshData();
    } catch (err) {
        console.error(err);
        showToast(err.message, "error");
    }
}

// Check/Uncheck Complete Toggle API
async function toggleTaskStatus(id) {
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error("Could not toggle status");
        
        const data = await response.json();
        
        // Locate card and apply visual animation
        const card = document.querySelector(`.task-card[data-id="${id}"]`);
        if (card) {
            const willBeCompleted = data.task.status === 'Completed';
            if (willBeCompleted) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        }

        showToast(`Task status set to "${data.task.status}"`);
        refreshData();
    } catch (err) {
        console.error(err);
        showToast("Error updating task status", "error");
    }
}

// Delete Task API
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const card = document.querySelector(`.task-card[data-id="${id}"]`);
        
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Could not delete task");

        // Slide/Fade animation out
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9) translateY(10px)';
            setTimeout(() => card.remove(), 300);
        }

        showToast("Task deleted successfully");
        refreshData();
    } catch (err) {
        console.error(err);
        showToast("Error deleting task", "error");
    }
}

// Bulk Clear Completed API
async function clearCompletedTasks() {
    if (!confirm("Are you sure you want to clear all completed tasks?")) return;

    try {
        const response = await fetch(`${API_BASE}/tasks/clear-completed`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error("Failed to clear tasks");
        
        const data = await response.json();
        
        showToast(data.message);
        refreshData();
    } catch (err) {
        console.error(err);
        showToast("Error clearing completed tasks", "error");
    }
}

// ==========================================
// Helper Utility Functions
// ==========================================

// Formatting Date strings (YYYY-MM-DD -> Textual Month)
function formatDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    // Using UTC components to prevent timezone offsets shifting local dates
    const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    const options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
}

// Basic HTML escaping protection
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Display Toast alert
let toastTimeout;
function showToast(message, type = 'success') {
    toast.className = `toast ${type}`;
    const icon = toast.querySelector('.toast-icon');
    const msgSpan = toast.querySelector('.toast-message');
    
    msgSpan.textContent = message;
    
    if (type === 'success') {
        icon.className = 'toast-icon fa-solid fa-circle-check';
    } else {
        icon.className = 'toast-icon fa-solid fa-triangle-exclamation';
    }

    toast.classList.remove('hidden');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}
