"use client";

import { useEffect, useState } from "react";
import { formatTemperatureC } from "@/lib/weather";

type WeatherDaily = {
  time: string;
  weathercode: number | null;
  description: string | null;
  tmax: number | null;
  tmin: number | null;
  pop: number | null;
};

type WeatherResponse = {
  location: {
    query: string;
    name: string;
    admin: string | null;
    country: string | null;
    latitude: number;
    longitude: number;
    timezone: string | null;
  };
  current: {
    temperature: number | null;
    windspeed: number | null;
    winddirection: number | null;
    weathercode: number | null;
    time: string | null;
    description: string | null;
  } | null;
  daily: WeatherDaily[];
};

export default function Page() {
  const [query, setQuery] = useState("Przedwoj?w");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherResponse | null>(null);

  async function loadWeather(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "B??d");
      }
      setData(json);
    } catch (e: any) {
      setError(e.message || "B??d");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWeather("Przedwoj?w");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container">
      <h1>Prognoza pogody</h1>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          loadWeather(query.trim());
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wpisz miejscowo?? (np. Przedwoj?w)"
          aria-label="Miejscowo??"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Szukam..." : "Poka? pogod?"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {data && (
        <section className="results">
          <header>
            <h2>
              {data.location.name}
              {data.location.admin ? `, ${data.location.admin}` : ""}
              {data.location.country ? `, ${data.location.country}` : ""}
            </h2>
            <p className="meta">
              {data.location.timezone ? `Strefa czasowa: ${data.location.timezone}` : ""}
            </p>
          </header>

          {data.current && (
            <div className="current">
              <div className="current-item">
                <div className="label">Teraz</div>
                <div className="value temp">{formatTemperatureC(data.current.temperature)}</div>
                <div className="desc">{data.current.description || "?"}</div>
              </div>
              <div className="current-item">
                <div className="label">Wiatr</div>
                <div className="value">{data.current.windspeed ? `${Math.round(data.current.windspeed)} km/h` : "-"}</div>
              </div>
            </div>
          )}

          {data.daily?.length > 0 && (
            <div className="days">
              {data.daily.slice(0, 5).map((d) => (
                <div className="day" key={d.time}>
                  <div className="day-date">{new Date(d.time).toLocaleDateString("pl-PL", { weekday: "short", day: "2-digit", month: "2-digit" })}</div>
                  <div className="day-desc">{d.description || "?"}</div>
                  <div className="day-temps">
                    <span className="tmax">{formatTemperatureC(d.tmax)}</span>
                    <span className="tmin">{formatTemperatureC(d.tmin)}</span>
                  </div>
                  <div className="day-pop">{d.pop != null ? `${d.pop}%` : "-"} opad?w</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="footer">Dane: Open-Meteo</footer>
    </main>
  );
}
