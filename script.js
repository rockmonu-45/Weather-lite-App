const API_KEY = '51df64f2edf8fb2434d34d1a7caf037b';

function getLucideIcon(code) {
    const iconMap = {
        '01d': 'sun', '01n': 'moon',
        '02d': 'cloud-sun', '02n': 'cloud-moon',
        '03d': 'cloud', '03n': 'cloud',
        '04d': 'cloud', '04n': 'cloud',
        '09d': 'cloud-drizzle', '10d': 'cloud-rain',
        '11d': 'cloud-lightning', '13d': 'snowflake', '50d': 'wind'
    };
    return iconMap[code] || 'cloud';
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        updateAppUI(data);
    } catch (err) {
        document.getElementById('cityName').textContent = "City Not Found";
    }
}

function updateAppUI(data) {
    const current = data.list[0];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

    document.getElementById('cityName').textContent = data.city.name;
    document.getElementById('mainTemp').textContent = `${Math.round(current.main.temp)}°`;
    document.getElementById('conditionText').textContent = current.weather[0].main;
    document.getElementById('highLow').innerHTML = `<span>H:${Math.round(current.main.temp_max)}°</span> <span>L:${Math.round(current.main.temp_min)}°</span>`;

    const mainWeather = current.weather[0].main.toLowerCase();
    if (mainWeather.includes('cloud')) document.body.style.background = "var(--bg-cloudy)";
    else if (mainWeather.includes('clear')) document.body.style.background = "var(--ios-bg)";
    else document.body.style.background = "var(--bg-night)";

    const hourlyContainer = document.getElementById('hourlyList');
    hourlyContainer.innerHTML = '';
    data.list.slice(0, 8).forEach((item, i) => {
        const time = i === 0 ? 'Now' : new Date(item.dt * 1000).toLocaleTimeString([], { hour: 'numeric' });
        hourlyContainer.innerHTML += `
            <div class="hour-item">
                <span>${time}</span>
                <i data-lucide="${getLucideIcon(item.weather[0].icon)}"></i>
                <strong>${Math.round(item.main.temp)}°</strong>
            </div>`;
    });

    const dailyContainer = document.getElementById('dailyList');
    dailyContainer.innerHTML = '';
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyData.forEach(day => {
        const d = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        dailyContainer.innerHTML += `
            <div class="day-row">
                <span style="font-weight:600">${d === today ? 'Today' : d}</span>
                <i data-lucide="${getLucideIcon(day.weather[0].icon)}"></i>
                <span style="opacity:0.6; text-align:right;">${Math.round(day.main.temp_min)}°</span>
                <div class="temp-bar-bg"><div class="temp-bar-fill" style="left:20%; width:60%;"></div></div>
                <span>${Math.round(day.main.temp_max)}°</span>
            </div>`;
    });


    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('feelsLike').textContent = `${Math.round(current.main.feels_like)}°`;
    document.getElementById('windSpeed').textContent = `${current.wind.speed} m/s`;


    const uv = Math.floor(Math.random() * 10);
    document.getElementById('uvVal').textContent = uv;
    document.getElementById('uvDot').style.left = (uv * 10) + '%';

    lucide.createIcons();
}

document.getElementById('citySearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(e.target.value);
        e.target.value = '';
    }
});

fetchWeather('Agra'); 