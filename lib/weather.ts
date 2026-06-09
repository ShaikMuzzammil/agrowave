const BASE = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather(lat: number, lon: number, apiKey: string) {
  try {
    const res = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Weather API failed");
    return await res.json();
  } catch (e) { return null; }
}

export async function getForecast(lat: number, lon: number, apiKey: string) {
  try {
    const res = await fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Forecast API failed");
    return await res.json();
  } catch (e) { return null; }
}

export function getMockWeather() {
  return {
    main: { temp: 33, feels_like: 36, humidity: 62, pressure: 1012 },
    weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
    wind: { speed: 12, deg: 240 },
    name: "Hyderabad Farm", dt: Date.now() / 1000,
  };
}

export function getMockForecast() {
  const list = Array.from({ length: 7 }, (_, i) => ({
    dt: Date.now() / 1000 + i * 86400,
    main: { temp_max: 35 + Math.random() * 4, temp_min: 24 + Math.random() * 3, humidity: 50 + Math.random() * 30 },
    weather: [{ main: i % 3 === 0 ? "Rain" : "Clear", description: i % 3 === 0 ? "light rain" : "clear sky", icon: i % 3 === 0 ? "10d" : "01d" }],
    pop: i % 3 === 0 ? 0.8 : 0.1,
    wind: { speed: 8 + Math.random() * 10 },
  }));
  return { list };
}