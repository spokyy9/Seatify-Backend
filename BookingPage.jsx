import React, { useState } from 'react';
export default function BookingsPage({ bookings, setPage, listForResale }) {
  const [listingId, setListingId] = useState(null);
  const [resalePrice, setResalePrice] = useState("");
  const [listed, setListed] = useState([]);

  const handleList = (booking) => {
    if (!resalePrice || isNaN(resalePrice)) return;
    listForResale({ ...booking, askingPrice: Number(resalePrice) });
    setListed(prev => [...prev, booking.id]);
    setListingId(null);
    setResalePrice("");
  };

  return (
    <div className="page" style={{ padding: "80px 40px 60px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: 36, marginBottom: 6 }}>My Tickets</h2>
        <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 40 }}>All your confirmed bookings</p>

        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <h3 style={{ fontSize: 22, marginBottom: 8 }}>No tickets yet</h3>
            <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 24 }}>Book your first movie experience</p>
            <button className="btn btn-gold" onClick={() => setPage("home")}>Browse Films</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {bookings.map(booking => {
              const isListed = listed.includes(booking.id);
              return (
                <div key={booking.id} className="ticket" style={{ padding: "24px 24px 24px 32px" }}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <img src={booking.movie.poster} alt="" style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 2 }} />
                      <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                          <span className="badge badge-green">Confirmed</span>
                          {isListed && <span className="resale-tag">Listed for Resale</span>}
                        </div>
                        <h3 style={{ fontSize: 20, marginBottom: 4 }}>{booking.movie.title}</h3>
                        <p style={{ color: "var(--muted)", fontSize: 14 }}>{booking.show.theatre}</p>
                        <p style={{ color: "var(--muted)", fontSize: 14 }}>{booking.show.time} · {booking.show.date} · {booking.show.type}</p>
                        <p style={{ color: "var(--muted)", fontSize: 14 }}>Seats: <span style={{ color: "var(--cream)" }}>{booking.seats.map(s => s.id).join(", ")}</span></p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginBottom: 4 }}>Total Paid</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>₹{booking.total}</div>
                      {!isListed && (
                        <button className="btn btn-danger" style={{ fontSize: 11 }} onClick={() => setListingId(booking.id)}>
                          Resell Ticket
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resale Panel */}
                  {listingId === booking.id && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px dashed var(--border2)" }} className="fade-up">
                      <p style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>List This Ticket for Resale</p>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginBottom: 6 }}>Your Asking Price (₹)</label>
                          <input className="input-field" type="number" placeholder={`Max ₹${booking.total} (original)`} value={resalePrice} onChange={e => setResalePrice(e.target.value)} />
                          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>Set a price at or below original. Buyers see your listing on the Resale Market.</p>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button className="btn btn-gold" onClick={() => handleList(booking)}>List Now</button>
                          <button className="btn btn-ghost" onClick={() => setListingId(null)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border2)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>Booking ID: {booking.id}</span>
                    <span style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)" }}>Paid via {booking.paymentMethod.toUpperCase()} · {booking.bookedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
