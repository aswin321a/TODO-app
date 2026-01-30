let tasks = [];
let currentFilter = 'all';

// --- THEME PERSISTENCE ---
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// --- WEATHER API (Search + Geo) ---
async function fetchWeather(lat, lon, label = "Current") {
    const tempText = document.getElementById('tempText');
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        tempText.textContent = `📍 ${label}: ${data.current_weather.temperature}°C`;
    } catch (err) { tempText.textContent = "Weather Error"; }
}

async function searchCity() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const data = await res.json();
        if (data[0]) fetchWeather(data[0].lat, data[0].lon, city);
        else document.getElementById('tempText').textContent = "City not found";
    } catch (err) { document.getElementById('tempText').textContent = "Search Error"; }
}

function useMyLocation() {
    navigator.geolocation.getCurrentPosition(
        p => fetchWeather(p.coords.latitude, p.coords.longitude, "Local"),
        () => document.getElementById('tempText').textContent = "Location Denied"
    );
}

document.getElementById('searchCityBtn').addEventListener('click', searchCity);
document.getElementById('geoBtn').addEventListener('click', useMyLocation);

// --- QUOTE LOGIC (Async Fetch) ---
async function fetchQuote() {
    const text = document.getElementById('quoteText');
    const auth = document.getElementById('quoteAuthor');
    const loader = document.getElementById('quoteLoader');
    loader.style.display = "block";
    text.textContent = "";
    auth.textContent = "";

    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://type.fit/api/quotes'));
        const json = await res.json();
        const quotes = JSON.parse(json.contents);
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        text.textContent = `"${q.text}"`;
        auth.textContent = `- ${q.author || "Anonymous"}`;
    } catch (err) {
        text.textContent = "Keep pushing forward!";
        auth.textContent = "- Motivational Bot";
    } finally { loader.style.display = "none"; }
}

document.getElementById('getQuoteBtn').addEventListener('click', fetchQuote);

// --- TASK LOGIC ---
const renderTasks = () => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    let filtered = tasks;
    if (currentFilter === 'today') filtered = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})" style="width:18px; height:18px;">
                <div>
                    <span style="${task.completed ? 'text-decoration:line-through; opacity:0.5' : ''}">${task.text}</span>
                    <span class="task-time">${task.createdAt}</span>
                </div>
            </div>
            <button onclick="deleteTask(${task.id})" style="background:none; border:none; color:var(--error); cursor:pointer; font-size:1.1rem;">✕</button>
        `;
        taskList.appendChild(li);
    });
};

window.toggleTask = (id) => {
    const t = tasks.find(x => x.id === id);
    t.completed = !t.completed;
    renderTasks();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(x => x.id !== id);
    renderTasks();
};

document.getElementById('addTaskBtn').addEventListener('click', () => {
    const input = document.getElementById('taskInput');
    if (!input.value.trim()) return;
    tasks.push({ 
        id: Date.now(), 
        text: input.value.trim(), 
        completed: false, 
        createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    });
    input.value = '';
    renderTasks();
});

document.getElementById('tabGroup').addEventListener('click', (e) => {
    if (e.target.classList.contains('tab')) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTasks();
    }
});

document.getElementById('clearCompleted').addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});

// Initialization
window.onload = () => {
    fetchQuote();
    fetchWeather(9.9312, 76.2673, "Kochi"); // Default startup city
};