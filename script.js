let currentIndex = 0;
let isLoginMode = true;

// --- AUTH LOGIC (Frontend Only) ---
const authOverlay = document.getElementById('authOverlay');
const mainDashboard = document.getElementById('mainDashboard');
const authForm = document.getElementById('authForm');
const authMsg = document.getElementById('authMsg');

const showMessage = (text, type) => {
    authMsg.textContent = text;
    authMsg.className = `auth-message ${type}`;
};

const checkSession = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        authOverlay.style.display = 'none';
        mainDashboard.style.display = 'grid';
        initApp();
    }
};

document.getElementById('toggleAuth').onclick = (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    document.getElementById('authTitle').textContent = isLoginMode ? "Welcome Back" : "Create Account";
    document.getElementById('authSubmit').textContent = isLoginMode ? "Login" : "Register";
    e.target.textContent = isLoginMode ? "Register" : "Login";
};

authForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPass').value;

    if (isLoginMode) {
        const user = JSON.parse(localStorage.getItem(`user_${email}`));
        if (user && user.password === pass) {
            localStorage.setItem('isLoggedIn', 'true');
            location.reload();
        } else { showMessage("Invalid Credentials", "error"); }
    } else {
        localStorage.setItem(`user_${email}`, JSON.stringify({ password: pass }));
        showMessage("Account Created! Please Login.", "success");
    }
};

document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('isLoggedIn');
    location.reload();
};

// --- APP CORE ---
function initApp() {
    loadGallery();
    fetchQuote();
    fetchWeather(9.93, 76.26, "Kochi");
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
}

// Theme
document.getElementById('darkModeToggle').onchange = (e) => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Gallery
function loadGallery() {
    const container = document.getElementById('imageGallery');
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const img = document.createElement('img');
        img.src = `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000) + i}`;
        img.className = 'gallery-thumb';
        img.onclick = () => openModal(img.src);
        container.appendChild(img);
    }
}
document.getElementById('refreshGallery').onclick = loadGallery;

// Modal
const modal = document.getElementById('imageModal');
function openModal(src) {
    modal.style.display = "flex";
    document.getElementById('modalImg').src = src;
    document.body.style.overflow = "hidden";
}
document.querySelector('.modal-close').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

// Weather
async function fetchWeather(lat, lon, label) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    document.getElementById('tempText').textContent = `${label}: ${data.current_weather.temperature}°C`;
}

document.getElementById('searchCityBtn').onclick = async () => {
    const city = document.getElementById('cityInput').value;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
    const data = await res.json();
    if(data[0]) fetchWeather(data[0].lat, data[0].lon, city);
};

// Quote
async function fetchQuote() {
    const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://type.fit/api/quotes'));
    const json = await res.json();
    const quotes = JSON.parse(json.contents);
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quoteText').textContent = `"${q.text}"`;
    document.getElementById('quoteAuthor').textContent = `- ${q.author || "Unknown"}`;
}

// Tasks
document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if(!input.value) return;
    const li = document.createElement('li');
    li.innerHTML = `<span>${input.value}</span> <button onclick="this.parentElement.remove()" style="color:red; background:none; border:none; cursor:pointer; float:right;">✕</button>`;
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid var(--border)";
    document.getElementById('taskList').appendChild(li);
    input.value = '';
};

checkSession();