import React, { useState } from 'react';
export default function ResalePage({ resaleListings, setPage, user, setCheckoutData }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [buyModal, setBuyModal] = useState(null);
  const [bought, setBought] = useState([]);

  const allMovies = ["All", ...new Set(resaleListings.map(r => r.movieTitle))];
  let filtered = resaleListings.filter(r => !bought.includes(r.id) && (filter === "All" || r.movieTitle === filter));
  if (sortBy === "priceLow") filtered = [...filtered].sort((a, b) => a.askingPrice - b.askingPrice);
  if (sortBy === "priceHigh") filtered = [...filtered].sort((a, b) => b.askingPrice - a.askingPrice);

  const handleBuy = () => {
    // Format resale ticket for checkout
    const checkoutData = {
      show: {
        movie: {
          title: buyModal.movieTitle,
          poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400"
        },
        theatre: buyModal.theatre,
        date: buyModal.date,
        time: buyModal.time,
        type: buyModal.type,
        priceRegular: buyModal.askingPrice,
        pricePremium: buyModal.askingPrice
      },
      seats: [{
        id: buyModal.seat,
        type: buyModal.type,
        status: "available"
      }],
      total: buyModal.askingPrice
    };
    
    setCheckoutData(checkoutData);
    setBought(prev => [...prev, buyModal.id]);
    setBuyModal(null);
    setPage("checkout");
  };

  return (
    <div className="page" style={{ padding: "80px 40px 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
            <h2 style={{ fontSize: 36 }}>Resale Market</h2>
            <span className="resale-tag">Beta</span>
          </div>
          <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Buy tickets from other users at fair prices — no scalping, community-driven.</p>
        </div>

        {/* How it works */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, marginBottom: 36, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
          {[
            { icon: "🎟️", title: "List Your Ticket", desc: "Go to My Tickets and list any booking" },
            { icon: "💰", title: "Set Fair Price", desc: "Price must be ≤ original ticket price" },
            { icon: "🤝", title: "Buyer Purchases", desc: "Another user buys from the marketplace" },
            { icon: "💳", title: "Instant Transfer", desc: "Money credited to your account" },
          ].map(step => (
            <div key={step.title} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
              <h4 style={{ fontSize: 14, marginBottom: 4 }}>{step.title}</h4>
              <p style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
            {allMovies.map(m => (
              <button key={m} className={`btn ${filter === m ? "btn-gold" : "btn-ghost"}`} style={{ padding: "7px 14px" }} onClick={() => setFilter(m)}>{m === "All" ? "All Films" : m}</button>
            ))}
          </div>
          <select className="input-field" style={{ maxWidth: 180 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎭</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No listings available</h3>
            <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Check back soon or browse movies to book fresh tickets.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filtered.map(listing => {
              const disc = Math.round((1 - listing.askingPrice / listing.originalPrice) * 100);
              return (
                <div key={listing.id} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 4, padding: 24, display: "flex", gap: 20, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", transition: "border-color 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border)"} onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border2)"}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <span className="resale-tag">Resale</span>
                      {disc > 0 && <span className="badge badge-green">{disc}% off</span>}
                    </div>
                    <h3 style={{ fontSize: 20, marginBottom: 4 }}>{listing.movieTitle}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>{listing.theatre}</p>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>{listing.time} · {listing.date}</p>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>Seat <span style={{ color: "var(--cream)" }}>{listing.seat}</span> · {listing.type}</p>
                    <p style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginTop: 8 }}>Seller: {listing.seller} · Listed {listing.listedAt}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)", textDecoration: "line-through", marginBottom: 2 }}>₹{listing.originalPrice}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "var(--gold)", marginBottom: 12 }}>₹{listing.askingPrice}</div>
                    <button className="btn btn-gold" onClick={() => setBuyModal(listing)}>Buy Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 40, padding: 20, border: "1px solid rgba(201,168,76,0.15)", borderRadius: 4, background: "rgba(201,168,76,0.03)" }}>
          <p style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: "var(--muted)", letterSpacing: "0.05em" }}>
            🛡️ Seatify Resale Guarantee: All tickets are verified authentic. Sellers cannot list above original price. A 2% platform fee applies on each resale transaction.
          </p>
        </div>
      </div>

      {/* Buy Modal */}
      {buyModal && (
        <div className="modal-overlay" onClick={() => setBuyModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 24, marginBottom: 4 }}>Confirm Purchase</h3>
            <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 24 }}>Review your resale ticket details before payment</p>
            <div style={{ background: "var(--surface2)", borderRadius: 4, padding: 20, marginBottom: 24 }}>
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>{buyModal.movieTitle}</h4>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>{buyModal.theatre} · {buyModal.time} · {buyModal.date}</p>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Seat {buyModal.seat} ({buyModal.type})</p>
              <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>Seller: {buyModal.seller}</p>
              <hr className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Ticket Price</span>
                <span>₹{buyModal.askingPrice}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ color: "var(--muted)" }}>Platform Fee (2%)</span>
                <span>₹{Math.round(buyModal.askingPrice * 0.02)}</span>
              </div>
              <hr className="divider" />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>
                <span>Total to Pay</span>
                <span>₹{buyModal.askingPrice + Math.round(buyModal.askingPrice * 0.02)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }} onClick={handleBuy}>Proceed to Payment →</button>
              <button className="btn btn-ghost" onClick={() => setBuyModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
