import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "13.13";
  const lon = searchParams.get("lon") || "77.57";

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code,is_day"
    );
    url.searchParams.set("hourly", "soil_moisture_0_to_1cm");
    url.searchParams.set("forecast_days", "1");
    url.searchParams.set("timezone", "Asia/Kolkata");

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Open-Meteo API returned ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Weather API proxy error:", error);
    // Return fallback weather data
    return NextResponse.json({
      current: {
        temperature_2m: 27.5,
        relative_humidity_2m: 72,
        rain: 2.4,
        wind_speed_10m: 8.5,
        weather_code: 2,
        is_day: 1,
      },
      hourly: {
        soil_moisture_0_to_1cm: Array(24).fill(0.38),
      },
      _fallback: true,
    });
  }
}
