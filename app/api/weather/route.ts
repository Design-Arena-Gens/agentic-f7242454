import { NextRequest } from "next/server";
import { getWeatherCodeDescriptionPl } from "@/lib/weather";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return new Response(JSON.stringify({ error: "Brak parametru q (miejsce)." }), { status: 400 });
    }

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=pl&format=json`;
    const geoRes = await fetch(geoUrl, { next: { revalidate: 3600 } });
    if (!geoRes.ok) {
      return new Response(JSON.stringify({ error: "B??d geokodowania." }), { status: 502 });
    }
    const geo = await geoRes.json();
    if (!geo || !geo.results || geo.results.length === 0) {
      return new Response(JSON.stringify({ error: "Nie znaleziono lokalizacji." }), { status: 404 });
    }

    const place = geo.results[0];
    const { latitude, longitude, name, country, admin1 } = place;

    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const fcRes = await fetch(forecastUrl, { next: { revalidate: 900 } });
    if (!fcRes.ok) {
      return new Response(JSON.stringify({ error: "B??d pobierania prognozy." }), { status: 502 });
    }
    const fc = await fcRes.json();

    const current = fc.current_weather ? {
      temperature: fc.current_weather.temperature ?? null,
      windspeed: fc.current_weather.windspeed ?? null,
      winddirection: fc.current_weather.winddirection ?? null,
      weathercode: fc.current_weather.weathercode ?? null,
      time: fc.current_weather.time ?? null,
      description: typeof fc.current_weather.weathercode === 'number' ? getWeatherCodeDescriptionPl(fc.current_weather.weathercode) : null
    } : null;

    const daily = fc.daily ? (fc.daily.time || []).map((time: string, idx: number) => {
      const code = fc.daily.weathercode?.[idx] ?? null;
      return {
        time,
        weathercode: code,
        description: typeof code === 'number' ? getWeatherCodeDescriptionPl(code) : null,
        tmax: fc.daily.temperature_2m_max?.[idx] ?? null,
        tmin: fc.daily.temperature_2m_min?.[idx] ?? null,
        pop: fc.daily.precipitation_probability_max?.[idx] ?? null
      };
    }) : [];

    const payload = {
      location: {
        query: q,
        name,
        admin: admin1 || null,
        country: country || null,
        latitude,
        longitude,
        timezone: fc.timezone || null
      },
      current,
      daily
    };

    return new Response(JSON.stringify(payload), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Nieoczekiwany b??d." }), { status: 500 });
  }
}
