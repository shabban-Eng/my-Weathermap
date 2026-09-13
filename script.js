const apiKey = "ee6652d828d23e5781f2593366137818";

let currentLang = "ar";
let currentCityName = "Gaza";
let selectedCountryKey = null; // مفتاح الدولة الثابت بالإنكليزية لضمان عدم الضياع
let weatherDetailChart = null;

const chartModalOverlay = document.getElementById("chartModalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const chartModalTitle = document.getElementById("chartModalTitle");
const chartCanvas = document.getElementById("weatherDetailChart");

closeModalBtn.addEventListener("click", () => {
  chartModalOverlay.classList.remove("active");
});

chartModalOverlay.addEventListener("click", (e) => {
  if (e.target === chartModalOverlay) {
    chartModalOverlay.classList.remove("active");
  }
});

// هيكلة منظمة تعتمد على مفاتيح ثابتة للدول مع أسمائها بكلتا اللغتين
const worldData = {
  palestine: {
    name: { ar: "فلسطين", en: "Palestine" },
    cities: {
      ar: ["غزة", "القدس", "رام الله", "الخليل", "نابلس"],
      en: ["Gaza", "Jerusalem", "Ramallah", "Hebron", "Nablus"],
    },
  },
  egypt: {
    name: { ar: "مصر", en: "Egypt" },
    cities: {
      ar: ["القاهرة", "الإسكندرية", "الجيزة", "الأقصر", "أسوان", "شرم الشيخ"],
      en: ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Sharm El-Sheikh"],
    },
  },
  saudi: {
    name: { ar: "السعودية", en: "Saudi Arabia" },
    cities: {
      ar: [
        "الرياض",
        "جدة",
        "مكة المكرمة",
        "المدينة المنورة",
        "الدمام",
        "الخبر",
      ],
      en: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
    },
  },
  uae: {
    name: { ar: "الإمارات", en: "UAE" },
    cities: {
      ar: ["دبي", "أبوظبي", "الشارقة", "عجمان", "العين"],
      en: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain"],
    },
  },
  jordan: {
    name: { ar: "الأردن", en: "Jordan" },
    cities: {
      ar: ["عمان", "إربد", "الزرقاء", "العقبة", "مأدبا"],
      en: ["Amman", "Irbid", "Zarqa", "Aqaba", "Madaba"],
    },
  },
  morocco: {
    name: { ar: "المغرب", en: "Morocco" },
    cities: {
      ar: ["الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة"],
      en: ["Casablanca", "Rabat", "Marrakesh", "Fez", "Tangier"],
    },
  },
  algeria: {
    name: { ar: "الجزائر", en: "Algeria" },
    cities: {
      ar: ["الجزائر", "وهران", "قسنطينة", "عنابة"],
      en: ["Algiers", "Oran", "Constantine", "Annaba"],
    },
  },
  iraq: {
    name: { ar: "العراق", en: "Iraq" },
    cities: {
      ar: ["بغداد", "البصرة", "أربيل", "الموصل", "النجف"],
      en: ["Baghdad", "Basra", "Erbil", "Mosul", "Najaf"],
    },
  },
  lebanon: {
    name: { ar: "لبنان", en: "Lebanon" },
    cities: {
      ar: ["بيروت", "طرابلس", "صيدا", "جونيه"],
      en: ["Beirut", "Tripoli", "Sidon", "Jounieh"],
    },
  },
  turkey: {
    name: { ar: "تركيا", en: "Turkey" },
    cities: {
      ar: ["إسطنبول", "أنقرة", "إزمير", "أنطاليا", "بورصة"],
      en: ["Istanbul", "Ankara", "Izmir", "Antalya", "Bursa"],
    },
  },
  usa: {
    name: { ar: "الولايات المتحدة", en: "USA" },
    cities: {
      ar: ["نيويورك", "لوس أنجلوس", "شيكاغو", "هيوسون", "ميامي"],
      en: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"],
    },
  },
  uk: {
    name: { ar: "المملكة المتحدة", en: "UK" },
    cities: {
      ar: ["لندن", "مانشستر", "برمنغهام", "ليفربول", "إدنبرة"],
      en: ["London", "Manchester", "Birmingham", "Liverpool", "Edinburgh"],
    },
  },
};

const translations = {
  ar: {
    title: "تطبيق الطقس الشامل",
    searchLabel: "الدولة أو المدينة",
    placeholderCountry: "اختر أو ابحث عن دولة...",
    placeholderCity: (countryName) => `اختر مدينة في ${countryName}...`,
    backToCountries: "← العودة لقائمة الدول",
    humidity: "الرطوبة",
    wind: "الرياح",
    forecastTitle: "توقعات الأيام القادمة",
    errorText: "حدث خطأ أثناء جلب بيانات الطقس.",
    newsHeaderTitle: "رصد أخبار الطقس والكوارث عالمياً",
    loadingNews: "جاري جلب أحدث الأخبار...",
    brand: "مقياس",
  },
  en: {
    title: "Comprehensive Weather App",
    searchLabel: "Country or City",
    placeholderCountry: "Select or search country...",
    placeholderCity: (countryName) => `Select city in ${countryName}...`,
    backToCountries: "← Back to Countries",
    humidity: "Humidity",
    wind: "Wind",
    forecastTitle: "5-Day Forecast",
    errorText: "Error fetching weather data.",
    newsHeaderTitle: "Global Weather & Disaster News",
    loadingNews: "Fetching latest news...",
    brand: "MIQYAS",
  },
};

const weatherAlertCities = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Riyadh", ar: "الرياض" },
  { en: "Dubai", ar: "دبي" },
  { en: "Amman", ar: "عمّان" },
  { en: "Baghdad", ar: "بغداد" },
  { en: "Beirut", ar: "بيروت" },
  { en: "Damascus", ar: "دمشق" },
  { en: "Istanbul", ar: "إسطنبول" },
  { en: "Casablanca", ar: "الدار البيضاء" },
  { en: "Algiers", ar: "الجزائر" },
  { en: "Gaza", ar: "غزة" },
  { en: "Jerusalem", ar: "القدس" },
  { en: "London", ar: "لندن" },
  { en: "Moscow", ar: "موسكو" },
  { en: "New York", ar: "نيويورك" },
  { en: "Tokyo", ar: "طوكيو" },
];

const htmlRoot = document.getElementById("htmlRoot");
const searchBoxContainer = document.getElementById("searchBoxContainer");
const citySearchInput = document.getElementById("citySearchInput");
const dropdownList = document.getElementById("dropdownList");
const tempElement = document.getElementById("temp");
const cityElement = document.getElementById("cityName");
const descElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const errorMsg = document.getElementById("errorMsg");
const weatherIcon = document.getElementById("weatherIcon");
const forecastContainer = document.getElementById("forecastContainer");

const currentDateEl = document.getElementById("currentDate");
const currentTimeEl = document.getElementById("currentTime");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const langToggleBtn = document.getElementById("langToggleBtn");

window.addEventListener("DOMContentLoaded", () => {
  detectUserLocation();
  fetchRealDisasterNews();
  setInterval(fetchRealDisasterNews, 600000);
});

function detectUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=${currentLang}`,
          );
          if (res.ok) {
            const data = await res.json();
            currentCityName = data.name;
            citySearchInput.value = `${data.name}, ${data.sys.country}`;
            fetchWeather(currentCityName);
            fetchForecast(currentCityName);
            return;
          }
        } catch (e) {
          console.log("Location weather fetch error");
        }
        fallbackDefaultCity();
      },
      () => fallbackDefaultCity(),
    );
  } else {
    fallbackDefaultCity();
  }
}

function fallbackDefaultCity() {
  currentCityName = "Gaza";
  citySearchInput.value = "Gaza, PS";
  fetchWeather("Gaza");
  fetchForecast("Gaza");
}

themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggleBtn.innerHTML = document.body.classList.contains("light-mode")
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

langToggleBtn.addEventListener("click", () => {
  currentLang = currentLang === "ar" ? "en" : "ar";

  htmlRoot.setAttribute("lang", currentLang);
  htmlRoot.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

  // تغيير شكل الزر ليكون واضحاً مثل أداة الترجمة
  if (currentLang === "en") {
    langToggleBtn.innerHTML =
      '<i class="fa-solid fa-globe"></i> Arabic (ترجمة)';
  } else {
    langToggleBtn.innerHTML = '<i class="fa-solid fa-globe"></i> English';
  }

  selectedCountryKey = null;
  citySearchInput.value = "";
  citySearchInput.placeholder = translations[currentLang].placeholderCountry;
  dropdownList.classList.remove("active");

  updateStaticTexts();

  if (currentCityName) {
    fetchWeather(currentCityName);
    fetchForecast(currentCityName);
  }

  fetchRealDisasterNews();
});

function updateStaticTexts() {
  const t = translations[currentLang];
  document.getElementById("pageTitle").textContent = t.title;
  document.getElementById("searchLabel").textContent = t.searchLabel;
  citySearchInput.placeholder = t.placeholderCountry;
  document.getElementById("humidityLabel").textContent = t.humidity;
  document.getElementById("windLabel").textContent = t.wind;
  document.getElementById("forecastTitle").textContent = t.forecastTitle;
  document.getElementById("errorMsg").textContent = t.errorText;
  document.getElementById("newsHeaderTitle").textContent = t.newsHeaderTitle;
  document.getElementById("brandLabel").textContent = t.brand;

  const loadingNewsEl = document.getElementById("loadingNewsText");
  if (loadingNewsEl) loadingNewsEl.textContent = t.loadingNews;
}

searchBoxContainer.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!selectedCountryKey) {
    showCountriesList();
  } else {
    showCitiesList(selectedCountryKey);
  }
});

citySearchInput.addEventListener("click", (e) => {
  e.stopPropagation();
});

citySearchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.trim().toLowerCase();

  if (!selectedCountryKey) {
    const matchedKeys = Object.keys(worldData).filter((key) => {
      const cNameAr = worldData[key].name.ar.toLowerCase();
      const cNameEn = worldData[key].name.en.toLowerCase();
      return cNameAr.includes(keyword) || cNameEn.includes(keyword);
    });
    showCountriesList(matchedKeys);
  } else {
    const citiesList = worldData[selectedCountryKey].cities[currentLang] || [];
    const matchedCities = citiesList.filter((city) =>
      city.toLowerCase().includes(keyword),
    );
    showCitiesList(selectedCountryKey, matchedCities);
  }
});

function showCountriesList(keysToDisplay = null) {
  dropdownList.innerHTML = "";
  const keys = keysToDisplay || Object.keys(worldData);

  keys.forEach((key) => {
    const countryObj = worldData[key];
    const displayName = countryObj.name[currentLang];

    const div = document.createElement("div");
    div.classList.add("dropdown-item");
    div.textContent = displayName;
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedCountryKey = key;
      citySearchInput.value = "";
      citySearchInput.placeholder =
        translations[currentLang].placeholderCity(displayName);
      showCitiesList(key);
    });
    dropdownList.appendChild(div);
  });
  dropdownList.classList.add("active");
}

function showCitiesList(countryKey, citiesToDisplay = null) {
  dropdownList.innerHTML = "";
  const countryObj = worldData[countryKey];
  const displayName = countryObj.name[currentLang];

  const backDiv = document.createElement("div");
  backDiv.classList.add("dropdown-item", "back-option");
  backDiv.textContent = translations[currentLang].backToCountries;
  backDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedCountryKey = null;
    citySearchInput.value = "";
    citySearchInput.placeholder = translations[currentLang].placeholderCountry;
    showCountriesList();
  });
  dropdownList.appendChild(backDiv);

  const cities = citiesToDisplay || countryObj.cities[currentLang] || [];

  cities.forEach((city) => {
    const div = document.createElement("div");
    div.classList.add("dropdown-item");
    div.textContent = city;
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      citySearchInput.value = `${city}, ${displayName}`;
      dropdownList.classList.remove("active");
      selectedCountryKey = null;
      currentCityName = city;
      fetchWeather(city);
      fetchForecast(city);
    });
    dropdownList.appendChild(div);
  });
  dropdownList.classList.add("active");
}

window.addEventListener("click", () => {
  dropdownList.classList.remove("active");
});

function updateClock() {
  const now = new Date();
  const locale = currentLang === "ar" ? "ar-EG" : "en-US";
  currentDateEl.textContent = now.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  currentTimeEl.textContent = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
setInterval(updateClock, 1000);
updateClock();

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=${currentLang}`,
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    cityElement.textContent = data.name + ", " + data.sys.country;
    tempElement.textContent = Math.round(data.main.temp) + "°C";
    descElement.textContent = data.weather[0].description;
    humidityElement.textContent = data.main.humidity + "%";

    const windSpeed =
      currentLang === "ar"
        ? Math.round(data.wind.speed * 3.6) + " كم/س"
        : Math.round((data.wind.speed * 3.6) / 1.609) + " mph";
    windElement.textContent = windSpeed;

    updateIcon(data.weather[0].main.toLowerCase(), weatherIcon);
    errorMsg.style.display = "none";
  } catch (error) {
    errorMsg.style.display = "block";
  }
}

async function fetchForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=${currentLang}`,
    );
    if (!response.ok) throw new Error("Forecast not found");
    const res = await response.json();

    forecastContainer.innerHTML = "";
    const dailyData = res.list.filter((reading) =>
      reading.dt_txt.includes("12:00:00"),
    );

    let selectedForecastCard = null;

    dailyData.forEach((day) => {
      const date = new Date(day.dt * 1000);
      const locale = currentLang === "ar" ? "ar-EG" : "en-US";
      const dayName = date.toLocaleDateString(locale, { weekday: "short" });
      const temp = Math.round(day.main.temp);
      const weatherMain = day.weather[0].main.toLowerCase();
      const description = day.weather[0].description;
      const humidity = day.main.humidity;
      const windSpeedNum = day.wind.speed;

      let iconClass = "fa-cloud-sun";
      if (weatherMain.includes("cloud")) iconClass = "fa-cloud";
      else if (weatherMain.includes("rain")) iconClass = "fa-cloud-rain";
      else if (weatherMain.includes("clear")) iconClass = "fa-sun";
      else if (weatherMain.includes("snow")) iconClass = "fa-snowflake";

      const card = document.createElement("div");
      card.classList.add("forecast-card");
      card.innerHTML = `
        <p>${dayName}</p>
        <i class="fa-solid ${iconClass}"></i>
        <span>${temp}°C</span>
      `;

      card.addEventListener("click", () => {
        if (card === selectedForecastCard) {
          card.classList.remove("active-forecast");
          selectedForecastCard = null;
          fetchWeather(currentCityName);
        } else {
          document
            .querySelectorAll(".forecast-card")
            .forEach((c) => c.classList.remove("active-forecast"));
          card.classList.add("active-forecast");
          selectedForecastCard = card;

          tempElement.textContent = temp + "°C";
          descElement.textContent = description;
          humidityElement.textContent = humidity + "%";

          const windFormatted =
            currentLang === "ar"
              ? Math.round(windSpeedNum * 3.6) + " كم/س"
              : Math.round((windSpeedNum * 3.6) / 1.609) + " mph";
          windElement.textContent = windFormatted;

          updateIcon(weatherMain, weatherIcon);
        }
      });

      forecastContainer.appendChild(card);
    });
  } catch (error) {
    console.log("Forecast fetch error");
  }
}

function updateIcon(weatherMain, element) {
  if (weatherMain.includes("cloud")) {
    element.innerHTML =
      '<i class="fa-solid fa-cloud" style="color: #4b6584;"></i>';
  } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
    element.innerHTML =
      '<i class="fa-solid fa-cloud-rain" style="color: #0984e3;"></i>';
  } else if (weatherMain.includes("clear")) {
    element.innerHTML =
      '<i class="fa-solid fa-sun" style="color: #e1b12c;"></i>';
  } else if (weatherMain.includes("snow")) {
    element.innerHTML =
      '<i class="fa-solid fa-snowflake" style="color: #00cec9;"></i>';
  } else {
    element.innerHTML =
      '<i class="fa-solid fa-cloud-sun" style="color: #f39c12;"></i>';
  }
}

async function fetchWeatherAlertsNews() {
  const results = await Promise.allSettled(
    weatherAlertCities.map((city) =>
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city.en)}&units=metric&appid=${apiKey}&lang=${currentLang}`,
      ).then((res) => {
        if (!res.ok) throw new Error("city forecast failed");
        return res.json().then((data) => ({ city, data }));
      }),
    ),
  );

  const alerts = [];
  const nowTs = Date.now();
  const dateFormatted = new Date(nowTs).toLocaleDateString(
    currentLang === "ar" ? "ar-EG" : "en-US",
    { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
  );

  results.forEach((r) => {
    if (r.status !== "fulfilled" || !r.value.data.list?.length) return;

    const { city, data } = r.value;
    const cityName = currentLang === "ar" ? city.ar : city.en;
    const now = data.list[0];
    const tempNow = now.main.temp;
    const weatherMain = now.weather[0].main;
    const next24h = data.list.slice(0, 8);
    const temps = next24h.map((r) => r.main.temp);
    const maxNext = Math.max(...temps);
    const minNext = Math.min(...temps);
    const rainVolume = now.rain?.["3h"] || 0;

    let alert = null;

    if (weatherMain === "Snow") {
      alert = {
        title:
          currentLang === "ar"
            ? `تساقط ثلوج في ${cityName}، الحرارة حالياً ${Math.round(tempNow)}°`
            : `Snowfall in ${cityName}, currently ${Math.round(tempNow)}°C`,
        category: currentLang === "ar" ? "ثلوج" : "Snow",
        icon: "fa-snowflake",
        score: 3,
      };
    } else if (tempNow <= 0) {
      alert = {
        title:
          currentLang === "ar"
            ? `انخفاض حاد بدرجة الحرارة في ${cityName} إلى ${Math.round(tempNow)}°`
            : `Sharp cold drop in ${cityName} to ${Math.round(tempNow)}°C`,
        category: currentLang === "ar" ? "انخفاض حرارة" : "Cold Drop",
        icon: "fa-temperature-arrow-down",
        score: 3,
      };
    } else if (tempNow >= 40) {
      alert = {
        title:
          currentLang === "ar"
            ? `ارتفاع حاد بدرجة الحرارة في ${cityName} إلى ${Math.round(tempNow)}°`
            : `Extreme heat in ${cityName} at ${Math.round(tempNow)}°C`,
        category: currentLang === "ar" ? "ارتفاع حرارة" : "Heat Spike",
        icon: "fa-temperature-arrow-up",
        score: 3,
      };
    } else if (
      weatherMain === "Thunderstorm" ||
      (weatherMain === "Rain" && rainVolume >= 3)
    ) {
      alert = {
        title:
          currentLang === "ar"
            ? `أمطار غزيرة ورعدية على ${cityName}`
            : `Heavy rain/storms over ${cityName}`,
        category: currentLang === "ar" ? "أمطار غزيرة" : "Heavy Rain",
        icon: "fa-cloud-showers-heavy",
        score: 2,
      };
    } else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
      alert = {
        title:
          currentLang === "ar"
            ? `أمطار متوقعة على ${cityName}`
            : `Rain expected over ${cityName}`,
        category: currentLang === "ar" ? "أمطار" : "Rain",
        icon: "fa-cloud-rain",
        score: 1,
      };
    } else if (maxNext - tempNow >= 7) {
      alert = {
        title:
          currentLang === "ar"
            ? `ارتفاع مفاجئ متوقع بدرجات الحرارة في ${cityName} خلال الساعات القادمة`
            : `Sudden temperature rise expected in ${cityName} within hours`,
        category: currentLang === "ar" ? "ارتفاع مفاجئ" : "Sudden Rise",
        icon: "fa-temperature-arrow-up",
        score: 2,
      };
    } else if (tempNow - minNext >= 7) {
      alert = {
        title:
          currentLang === "ar"
            ? `انخفاض مفاجئ متوقع بدرجات الحرارة في ${cityName} خلال الساعات القادمة`
            : `Sudden temperature drop expected in ${cityName} within hours`,
        category: currentLang === "ar" ? "انخفاض مفاجئ" : "Sudden Drop",
        icon: "fa-temperature-arrow-down",
        score: 2,
      };
    }

    if (alert) {
      alerts.push({ ...alert, timestamp: nowTs, dateFormatted });
    }
  });

  return alerts;
}

document.querySelectorAll(".details .col").forEach((col) => {
  col.style.cursor = "pointer";
  col.addEventListener("click", () => {
    if (!currentCityName) return;
    const isWind = col.querySelector(".fa-wind") !== null;
    fetch24HourChartData(currentCityName, isWind ? "wind" : "humidity");
  });
});

async function fetch24HourChartData(city, type) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=${currentLang}`,
    );
    if (!response.ok) throw new Error("Failed to fetch chart data");
    const data = await response.json();

    const next24Hours = data.list.slice(0, 8);
    const labels = next24Hours.map((item) => {
      return item.dt_txt.split(" ")[1].substring(0, 5);
    });

    let chartData = [];
    let labelTitle = "";
    let borderColor = "";
    let backgroundColor = "";

    const isArabic = currentLang === "ar";
    const isWind = type === "wind";

    if (isWind) {
      chartData = next24Hours.map((item) => {
        const speed = item.wind.speed;
        return isArabic
          ? Math.round(speed * 3.6)
          : Math.round((speed * 3.6) / 1.609);
      });
      labelTitle = isArabic ? "سرعة الرياح" : "Wind Speed";
      borderColor = "#59aecb";
      backgroundColor = "rgba(89, 174, 203, 0.15)";
    } else {
      chartData = next24Hours.map((item) => Number(item.main.humidity));
      labelTitle = isArabic ? "نسبة الرطوبة" : "Humidity";
      borderColor = "#e8a33d";
      backgroundColor = "rgba(232, 163, 61, 0.15)";
    }

    chartModalTitle.textContent = isArabic
      ? `توقعات 24 ساعة لـ ${data.city.name}`
      : `24-Hour Forecast for ${data.city.name}`;
    chartModalOverlay.classList.add("active");

    renderSmoothChart(
      labels,
      chartData,
      labelTitle,
      borderColor,
      backgroundColor,
      isArabic,
      isWind,
    );
  } catch (error) {
    console.log("Error loading chart data", error);
  }
}

function renderSmoothChart(
  labels,
  data,
  labelTitle,
  borderColor,
  backgroundColor,
  isArabic,
  isWind,
) {
  if (weatherDetailChart) {
    weatherDetailChart.destroy();
  }

  const unitLabel = isWind ? (isArabic ? "كم/س" : "km/h") : "%";
  const ctx = chartCanvas.getContext("2d");

  weatherDetailChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: labelTitle,
          data: data,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: borderColor,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#8fa1bc" },
          title: {
            display: true,
            text: isArabic ? "الوقت (الساعة)" : "Time (Hour)",
            color: "#8fa1bc",
            font: { family: "Cairo", size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "#8fa1bc",
            callback: function (value) {
              return value + " " + unitLabel;
            },
          },
          title: {
            display: true,
            text: labelTitle,
            color: "#8fa1bc",
            font: { family: "Cairo", size: 11 },
          },
        },
      },
    },
  });
}

async function fetchRealDisasterNews() {
  const newsContainer = document.getElementById("newsContainer");
  try {
    const [nasaRes, usgsRes] = await Promise.all([
      fetch("https://eonet.gsfc.nasa.gov/api/v3/events?limit=50&status=open"),
      fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      ),
    ]);

    const nasaData = await nasaRes.json();
    const usgsData = await usgsRes.json();

    let allEvents = [];

    if (nasaData.events) {
      nasaData.events.forEach((event) => {
        const title = event.title;
        const category = event.categories[0]?.title || "Natural Event";
        const dateString =
          event.geometry[0]?.date || event.sources?.[0]?.date || Date.now();
        const timestamp = new Date(dateString).getTime();

        let catArabic = category;
        let iconClass = "fa-triangle-exclamation";
        let importanceScore = 1;

        if (
          category.includes("Severe Storms") ||
          category.includes("Cyclones") ||
          category.includes("Hurricanes")
        ) {
          catArabic = "إعصار وعاصفة جوية خطيرة";
          iconClass = "fa-hurricane";
          importanceScore = 5;
        } else if (category.includes("Volcanoes")) {
          catArabic = "ثوران بركاني نشط";
          iconClass = "fa-volcano";
          importanceScore = 5;
        } else if (category.includes("Floods")) {
          catArabic = "فيضان واسع النطاق";
          iconClass = "fa-water";
          importanceScore = 4;
        } else if (category.includes("Wildfires")) {
          catArabic = "حريق غابات هائل";
          iconClass = "fa-fire";
          importanceScore = 3;
        } else if (
          category.includes("Snow") ||
          category.includes("Severe Weather")
        ) {
          catArabic = "عاصفة ثلجية وبرد قارس";
          iconClass = "fa-snowflake";
          importanceScore = 3;
        } else {
          catArabic = "حالة جوية";
          iconClass = "fa-cloud-sun";
          importanceScore = 2;
        }

        allEvents.push({
          title: title,
          category: currentLang === "ar" ? catArabic : category,
          icon: iconClass,
          timestamp: timestamp,
          score: importanceScore,
          dateFormatted: new Date(timestamp).toLocaleDateString(
            currentLang === "ar" ? "ar-EG" : "en-US",
            {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
        });
      });
    }

    if (usgsData.features) {
      usgsData.features.forEach((quake) => {
        const mag = quake.properties.mag;
        const place = quake.properties.place;
        const timestamp = quake.properties.time;

        if (mag === null || mag < 4.0) return;

        let formattedPlace = place;
        if (currentLang === "ar") {
          const match = place.match(/([\d\.]+)\s*km\s*([A-Z]+)\s*of\s*(.+)/i);
          if (match) {
            formattedPlace = `يبعد ${match[1]} كم باتجاه ${match[2]} عن ${match[3]}`;
          }
        }

        let quakeScore = mag >= 6.0 ? 6 : mag >= 5.0 ? 5 : 3;

        allEvents.push({
          title: formattedPlace,
          category:
            currentLang === "ar" ? `زلزال بقوة ${mag}` : `Earthquake M ${mag}`,
          icon: "fa-house-chimney-crack",
          timestamp: timestamp,
          score: quakeScore,
          dateFormatted: new Date(timestamp).toLocaleDateString(
            currentLang === "ar" ? "ar-EG" : "en-US",
            {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            },
          ),
        });
      });
    }

    allEvents.sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);
    const weatherAlerts = await fetchWeatherAlertsNews();
    weatherAlerts.sort(
      (a, b) => b.score - a.score || b.timestamp - a.timestamp,
    );

    const topWeatherAlerts = weatherAlerts.slice(0, 13);
    const topDisasters = allEvents.slice(0, 5);

    newsContainer.innerHTML = "";
    const topEvents = [...topWeatherAlerts, ...topDisasters].sort(
      (a, b) => b.score - a.score || b.timestamp - a.timestamp,
    );

    if (topEvents.length > 0) {
      topEvents.forEach((ev) => {
        const card = document.createElement("div");
        card.classList.add("news-card");
        card.innerHTML = `
          <h4><i class="fa-solid ${ev.icon}"></i> ${ev.category}</h4>
          <p style="direction: ltr; text-align: right; unicode-bidi: isolate;">${ev.title}</p>
          <span class="news-time">${currentLang === "ar" ? "التاريخ:" : "Date:"} ${ev.dateFormatted}</span>
        `;
        newsContainer.appendChild(card);
      });
    } else {
      newsContainer.innerHTML = `<p class="loading-news">${currentLang === "ar" ? "لا توجد أخبار مسجلة حالياً." : "No news recorded right now."}</p>`;
    }
  } catch (error) {
    newsContainer.innerHTML = `<p class="loading-news">${currentLang === "ar" ? "تعذر جلب الأخبار." : "Could not fetch news."}</p>`;
  }
}
