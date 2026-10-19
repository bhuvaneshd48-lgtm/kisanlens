/* ────────── Open-Meteo Live Weather Service ────────── */

export interface WeatherData {
  temperature: number;      // °C
  humidity: number;         // %
  rainfall: number;         // mm
  soilMoisture: number;     // m³/m³ → displayed as %
  windSpeed: number;        // km/h
  weatherCode: number;
  isDay: boolean;
  fetchedAt: number;
}

// Default coordinates: Bengaluru / Karnataka agricultural belt
const DEFAULT_LAT = 13.13;
const DEFAULT_LON = 77.57;

export async function fetchLiveWeather(
  lat: number = DEFAULT_LAT,
  lon: number = DEFAULT_LON
): Promise<WeatherData> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat.toString());
    url.searchParams.set("longitude", lon.toString());
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code,is_day");
    url.searchParams.set("hourly", "soil_moisture_0_to_1cm");
    url.searchParams.set("forecast_days", "1");
    url.searchParams.set("timezone", "Asia/Kolkata");

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

    const data = await res.json();
    const current = data.current;
    const soilMoistureArr = data.hourly?.soil_moisture_0_to_1cm;
    const soilMoisture = soilMoistureArr
      ? soilMoistureArr[Math.min(new Date().getHours(), soilMoistureArr.length - 1)]
      : 0.35;

    return {
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m),
      rainfall: Math.round(current.rain * 10) / 10,
      soilMoisture: Math.round(soilMoisture * 100),
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      fetchedAt: Date.now(),
    };
  } catch (err) {
    console.error("Weather fetch failed, using fallback:", err);
    // Fallback data for offline/demo mode
    return {
      temperature: 27.5,
      humidity: 72,
      rainfall: 2.4,
      soilMoisture: 38,
      windSpeed: 8.5,
      weatherCode: 2,
      isDay: true,
      fetchedAt: Date.now(),
    };
  }
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Rime Fog 🌫️",
    51: "Light Drizzle 🌦️",
    53: "Moderate Drizzle 🌧️",
    55: "Dense Drizzle 🌧️",
    61: "Slight Rain 🌦️",
    63: "Moderate Rain 🌧️",
    65: "Heavy Rain ⛈️",
    71: "Slight Snow ❄️",
    73: "Moderate Snow 🌨️",
    75: "Heavy Snow ❄️",
    80: "Slight Showers 🌦️",
    81: "Moderate Showers 🌧️",
    82: "Violent Showers ⛈️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm + Hail ⛈️",
    99: "Thunderstorm + Heavy Hail ⛈️",
  };
  return descriptions[code] || "Unknown";
}
