// --- STATE MANAGEMENT ---
let tasks = [];

// --- DOM ELEMENTS ---
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const darkModeToggle = document.getElementById('darkModeToggle');

// --- DARK MODE LOGIC ---
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme on startup
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// --- TASK CRUD LOGIC ---

// Capture Input
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    
    // Validation
    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
}

// Rendering with document.createElement (Safe DOM practice)
function renderTasks() {
    taskList.innerHTML = ''; 

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'toggle-complete';

        const span = document.createElement('span');
        span.textContent = task.text;
        span.style.marginLeft = "12px";

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.className = 'delete-btn';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    
    console.log("Tasks State:", tasks);
}

// Event Delegation for Delete and Complete
taskList.addEventListener('click', (e) => {
    // Get the parent LI id
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;
    const id = Number(taskItem.dataset.id);

    // Handle Delete
    if (e.target.classList.contains('delete-btn')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }

    // Handle Toggle Complete
    if (e.target.classList.contains('toggle-complete')) {
        const task = tasks.find(t => t.id === id);
        task.completed = !task.completed;
        renderTasks();
    }
});

// Clear Completed
document.getElementById('clearCompleted').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});