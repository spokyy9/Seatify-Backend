import React, { useState } from 'react';
export default function MoviePage({ movie, setPage, setSelectedShow, generateShows }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTheatre, setSelectedTheatre] = useState("All");
  const shows = generateShows(movie.id);

  const dates = [...new Set(shows.map(s => s.date))];
  const activeDate = selectedDate || dates[0];
  const filteredShows = shows.filter(s => s.date === activeDate && (selectedTheatre === "All" || s.theatre === selectedTheatre));
  const theatres = [...new Set(shows.map(s => s.theatre))];

  const typeColors = { Standard: "var(--muted)", IMAX: "#60C0FF", "4DX": "#B060FF", Premium: "var(--gold)" };

  return (
    <div className="page">
      {/* Banner */}
      <div style={{ height: 320, position: "relative", overflow: "hidden" }}>
        <img src={movie.banner} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.25)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg))" }} />
        <button className="btn btn-ghost" style={{ position: "absolute", top: 20, left: 40 }} onClick={() => setPage("home")}>← Back</button>
      </div>

      <div style={{ padding: "0 40px 60px", marginTop: -120, position: "relative" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-end", marginBottom: 48 }}>
          <img src={movie.poster} alt={movie.title} style={{ width: 160, borderRadius: 4, border: "2px solid var(--border)", flexShrink: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span className="badge badge-gold">{movie.genre}</span>
              <span className="badge badge-gold">{movie.language}</span>
              <span className="badge badge-gold">{movie.rated}</span>
            </div>
            <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>{movie.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--muted)", marginBottom: 12 }}>
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>★ {movie.rating}</span>
              <span>·</span><span>{movie.duration} minutes</span>
            </div>
            <p style={{ color: "rgba(237,232,223,0.7)", fontSize: 17, fontStyle: "italic", maxWidth: 520, lineHeight: 1.7 }}>{movie.desc}</p>
          </div>
        </div>

        <h2 style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Select Date</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {dates.map(d => (
            <button key={d} className={`btn ${activeDate === d ? "btn-gold" : "btn-ghost"}`} style={{ padding: "8px 20px" }} onClick={() => setSelectedDate(d)}>{d}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
          {["All", ...theatres].map(t => (
            <button key={t} className={`btn ${selectedTheatre === t ? "btn-outline" : "btn-ghost"}`} style={{ padding: "7px 16px" }} onClick={() => setSelectedTheatre(t)}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredShows.length === 0 && <p style={{ color: "var(--muted)", fontStyle: "italic" }}>No shows available for this selection.</p>}
          {filteredShows.map(show => (
            <div key={show.id} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 4, padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600 }}>{show.theatre}</h3>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: typeColors[show.type] || "var(--muted)", padding: "2px 8px", border: `1px solid ${typeColors[show.type] || "var(--border2)"}`, borderRadius: 1 }}>{show.type}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: 14, fontFamily: "'DM Mono',monospace" }}>{show.location} · Screen {show.screenId}</p>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--cream)" }}>{show.time}</div>
                  <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>{show.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginBottom: 4 }}>From ₹{show.priceRegular}</div>
                  <button className="btn btn-gold" onClick={() => { setSelectedShow({ ...show, movie }); setPage("seats"); }}>Select Seats</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}