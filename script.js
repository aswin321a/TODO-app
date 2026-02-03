// Initialization
window.onload = () => {
    fetchQuote();
    fetchWeather(9.93, 76.26, "Kochi");
};

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

// --- TAB SWITCHING (Unified Button Style) ---
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Filter logic can be added here
    });
});

// --- WEATHER & QUOTES (Same robust logic as before) ---
async function fetchWeather(lat, lon, label = "Current") {
    const tempText = document.getElementById('tempText');
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        tempText.textContent = `${label}: ${data.current_weather.temperature}°C`;
    } catch (err) { tempText.textContent = "Offline"; }
}

async function searchLocation() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
        const data = await res.json();
        if (data[0]) fetchWeather(data[0].lat, data[0].lon, city);
    } catch (err) { console.error("Search failed"); }
}

document.getElementById('searchCityBtn').addEventListener('click', searchLocation);

// --- TASK LOGIC ---
let tasks = [];
document.getElementById('addTaskBtn').addEventListener('click', () => {
    const input = document.getElementById('taskInput');
    if (!input.value) return;
    tasks.push({ id: Date.now(), text: input.value });
    input.value = '';
    renderTasks();
});

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map(t => `
        <li class="task-item">
            <span>${t.text}</span>
            <button onclick="deleteTask(${t.id})" style="color:var(--text-muted); background:none; border:none; cursor:pointer; font-size:1.2rem;">✕</button>
        </li>
    `).join('');
}

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
};