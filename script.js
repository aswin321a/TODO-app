let currentIndex = 0;
let tasks = [];

// --- INITIALIZATION ---
window.onload = () => {
    loadGallery();
    fetchQuote();
    fetchWeather(9.93, 76.26, "Kochi");
    
    // Persistent Theme Check
    const savedTheme = localStorage.getItem('user-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
};

// --- THEME ENGINE ---
document.getElementById('darkModeToggle').onchange = (e) => {
    const isDark = e.target.checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('user-theme', isDark ? 'dark' : 'light');
};

// --- RANDOM GALLERY ---
function loadGallery() {
    const container = document.getElementById('imageGallery');
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const img = document.createElement('img');
        const randomId = Math.floor(Math.random() * 1000);
        img.src = `https://picsum.photos/600/600?random=${randomId + i}`;
        img.alt = "Gallery Inspiration";
        img.className = 'gallery-thumb';
        img.onclick = () => { currentIndex = i; openModal(img.src, img.alt); };
        container.appendChild(img);
    }
}
document.getElementById('refreshGallery').onclick = loadGallery;

// --- MODAL LOGIC ---
const modal = document.getElementById('imageModal');
function openModal(src, alt) {
    modal.style.display = "flex";
    document.getElementById('modalImg').src = src;
    document.getElementById('modalCaption').textContent = alt;
    document.body.style.overflow = "hidden";
}
document.querySelector('.modal-close').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};
document.querySelector('.next').onclick = () => {
    const imgs = document.querySelectorAll('.gallery-thumb');
    currentIndex = (currentIndex + 1) % imgs.length;
    openModal(imgs[currentIndex].src, imgs[currentIndex].alt);
};
document.querySelector('.prev').onclick = () => {
    const imgs = document.querySelectorAll('.gallery-thumb');
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    openModal(imgs[currentIndex].src, imgs[currentIndex].alt);
};

// --- WEATHER & QUOTES ---
async function fetchWeather(lat, lon, label) {
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        document.getElementById('tempText').textContent = `${label}: ${data.current_weather.temperature}°C`;
    } catch (e) { document.getElementById('tempText').textContent = "Weather Error"; }
}

document.getElementById('searchCityBtn').onclick = async () => {
    const city = document.getElementById('cityInput').value;
    if(!city) return;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
    const data = await res.json();
    if(data[0]) fetchWeather(data[0].lat, data[0].lon, city);
};

async function fetchQuote() {
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://type.fit/api/quotes'));
        const json = await res.json();
        const quotes = JSON.parse(json.contents);
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quoteText').textContent = `"${q.text}"`;
        document.getElementById('quoteAuthor').textContent = `- ${q.author || "Anonymous"}`;
    } catch (e) { document.getElementById('quoteText').textContent = "Keep moving forward."; }
}

// --- TASKS ---
document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if(!input.value) return;
    const li = document.createElement('li');
    li.className = 'task-item';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.padding = '15px';
    li.style.borderBottom = '1px solid var(--border)';
    li.innerHTML = `<span>${input.value}</span><button onclick="this.parentElement.remove()" style="color:red; background:none; border:none; cursor:pointer;">✕</button>`;
    document.getElementById('taskList').appendChild(li);
    input.value = '';
};