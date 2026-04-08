import React, { useState } from 'react';
export default function SeatPage({ show, setPage, setCheckoutData, generateSeats }) {
  const [seats] = useState(generateSeats);
  const [selected, setSelected] = useState([]);

  const toggle = (seat) => {
    if (seat.status === "booked") return;
    setSelected(prev => prev.find(s => s.id === seat.id) ? prev.filter(s => s.id !== seat.id) : [...prev, seat]);
  };

  const total = selected.reduce((sum, s) => sum + (s.type === "Premium" ? show.pricePremium : show.priceRegular), 0);
  const rows = [...new Set(seats.map(s => s.row))];

  return (
    <div className="page" style={{ padding: "80px 20px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => setPage("movie")}>← Back to Shows</button>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{show.movie.title}</h2>
          <p style={{ color: "var(--muted)", fontFamily: "'DM Mono',monospace", fontSize: 13 }}>{show.theatre} · {show.time} · {show.date} · {show.type}</p>
        </div>

        {/* Screen */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", width: "70%", height: 6, background: "linear-gradient(to right, transparent, var(--gold), transparent)", borderRadius: 3, marginBottom: 8 }} />
          <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase" }}>Screen this side</div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 32, flexWrap: "wrap" }}>
          {[
            { color: "var(--surface3)", border: "rgba(255,255,255,0.1)", label: "Available – Regular" },
            { color: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.3)", label: "Available – Premium" },
            { color: "var(--gold)", border: "var(--gold-light)", label: "Selected" },
            { color: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.05)", label: "Booked", dim: true },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 20, height: 16, borderRadius: "4px 4px 1px 1px", background: l.color, border: `1px solid ${l.border}`, opacity: l.dim ? 0.4 : 1 }} />
              <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Seat Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          {rows.map(row => (
            <div key={row} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 20, textAlign: "center", fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>{row}</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {seats.filter(s => s.row === row).map(seat => {
                  const isSel = selected.find(s => s.id === seat.id);
                  let cls = "seat ";
                  if (seat.status === "booked") cls += "seat-booked";
                  else if (isSel) cls += "seat-selected";
                  else cls += `seat-available-${seat.type.toLowerCase()}`;
                  return (
                    <button key={seat.id} className={cls} title={`${seat.id} – ${seat.type} – ₹${seat.type === "Premium" ? show.pricePremium : show.priceRegular}`} onClick={() => toggle(seat)} />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {selected.length > 0 && (
          <div style={{ marginTop: 40, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginBottom: 4 }}>Selected Seats</p>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{selected.map(s => s.id).join(", ")}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginBottom: 4 }}>Total</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)" }}>₹{total}</p>
            </div>
            <button className="btn btn-gold" style={{ padding: "14px 32px" }} onClick={() => { setCheckoutData({ show, seats: selected, total }); setPage("checkout"); }}>
              Proceed to Payment →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
