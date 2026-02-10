let currentIndex = 0;
let tasks = [];

// --- INITIALIZATION ---
window.onload = () => {
    loadGallery();
    fetchQuote();
    fetchWeather(9.93, 76.26, "Kochi");
    
    // Theme Check
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
};

// --- THEME LOGIC ---
document.getElementById('darkModeToggle').onchange = (e) => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// --- RANDOM GALLERY LOGIC ---
function loadGallery() {
    const container = document.getElementById('imageGallery');
    container.innerHTML = '';
    const imgCount = 8;

    for (let i = 0; i < imgCount; i++) {
        const img = document.createElement('img');
        const randomId = Math.floor(Math.random() * 1000);
        img.src = `https://picsum.photos/600/600?random=${randomId + i}`;
        img.alt = "Random Inspiration";
        img.className = 'gallery-thumb';
        
        img.onclick = () => {
            currentIndex = i;
            openModal(img);
        };
        container.appendChild(img);
    }
}
document.getElementById('refreshGallery').onclick = loadGallery;

// --- MODAL LOGIC ---
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');

function openModal(imgElement) {
    modal.style.display = "flex";
    modalImg.src = imgElement.src;
    document.getElementById('modalCaption').textContent = imgElement.alt;
    document.body.style.overflow = "hidden";
}

document.querySelector('.modal-close').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

document.querySelector('.next').onclick = () => {
    const imgs = document.querySelectorAll('.gallery-thumb');
    currentIndex = (currentIndex + 1) % imgs.length;
    openModal(imgs[currentIndex]);
};

document.querySelector('.prev').onclick = () => {
    const imgs = document.querySelectorAll('.gallery-thumb');
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    openModal(imgs[currentIndex]);
};

// Close on ESC
window.onkeydown = (e) => { if(e.key === "Escape") document.querySelector('.modal-close').onclick(); };

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
    const text = document.getElementById('quoteText');
    try {
        const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://type.fit/api/quotes'));
        const json = await res.json();
        const quotes = JSON.parse(json.contents);
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        text.textContent = `"${q.text}"`;
        document.getElementById('quoteAuthor').textContent = `- ${q.author || "Anonymous"}`;
    } catch (e) { text.textContent = "Keep moving forward."; }
}
document.getElementById('getQuoteBtn').onclick = fetchQuote;

// --- TASK LIST ---
document.getElementById('addTaskBtn').onclick = () => {
    const input = document.getElementById('taskInput');
    if(!input.value) return;
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `<span>${input.value}</span><button onclick="this.parentElement.remove()" style="color:red; background:none; border:none; cursor:pointer;">✕</button>`;
    document.getElementById('taskList').appendChild(li);
    input.value = '';
};