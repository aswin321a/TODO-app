// --- STATE MANAGEMENT ---
let tasks = [];
let currentFilter = 'all';

// --- THEME LOGIC ---
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// --- REGISTRATION VALIDATION ---
const regForm = document.getElementById('registrationForm');
const fields = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirm: document.getElementById('confirmPassword')
};

const setStatus = (input, message, status) => {
    const errorDisplay = input.nextElementSibling;
    input.style.borderColor = status === 'error' ? 'var(--error-red)' : 'var(--success-green)';
    errorDisplay.textContent = status === 'error' ? message : '';
};

regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (fields.username.value.length < 3) { setStatus(fields.username, 'Name too short', 'error'); isValid = false; }
    else { setStatus(fields.username, '', 'success'); }

    if (!fields.email.value.includes('@')) { setStatus(fields.email, 'Invalid email', 'error'); isValid = false; }
    else { setStatus(fields.email, '', 'success'); }

    if (fields.password.value.length < 6) { setStatus(fields.password, 'Min 6 chars', 'error'); isValid = false; }
    else { setStatus(fields.password, '', 'success'); }

    if (fields.confirm.value !== fields.password.value || !fields.confirm.value) { 
        setStatus(fields.confirm, 'Passwords mismatch', 'error'); isValid = false; 
    } else { setStatus(fields.confirm, '', 'success'); }

    if (isValid) alert('Registration Successful!');
});

// --- TASK LOGIC ---
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const tabGroup = document.getElementById('tabGroup');

const renderTasks = () => {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (currentFilter === 'today') filteredTasks = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.innerHTML = `
            <div class="task-content" style="display:flex; align-items:center; gap:12px;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <div class="task-info">
                    <span style="${task.completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${task.text}</span>
                    <span class="task-time">Created: ${task.createdAt}</span>
                </div>
            </div>
            <button onclick="deleteTask(${task.id})" style="background:none; border:none; cursor:pointer; color:var(--error-red);">✕</button>
        `;
        taskList.appendChild(li);
    });
};

const addTask = () => {
    const val = taskInput.value.trim();
    if (!val) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    tasks.push({ id: Date.now(), text: val, completed: false, createdAt: timeStr });
    taskInput.value = '';
    renderTasks();
};

tabGroup.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }
});

window.toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderTasks();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};

document.getElementById('clearCompleted').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTask());

renderTasks();