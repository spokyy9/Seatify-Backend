import React, { useState } from 'react';
export default function CheckoutPage({ data, setPage, addBooking }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState({ method: "card", cardNum: "", expiry: "", cvv: "", upiId: "" });
  const [done, setDone] = useState(false);

  if (!data) return null;
  const { show, seats, total } = data;
  const convenience = Math.round(total * 0.05);
  const grandTotal = total + convenience;

  const handlePay = () => {
    if (payment.method === "card" && (!payment.cardNum || !payment.expiry || !payment.cvv)) return;
    if (payment.method === "upi" && !payment.upiId) return;
    const booking = {
      id: `BK${Date.now()}`,
      movie: show.movie,
      show,
      seats,
      total: grandTotal,
      paymentMethod: payment.method,
      bookedAt: new Date().toLocaleString(),
      status: "confirmed",
    };
    addBooking(booking);
    setDone(true);
  };

  if (done) return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", maxWidth: 440, padding: 20 }} className="fade-up">
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(82,192,122,0.15)", border: "2px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>✓</div>
        <h2 style={{ fontSize: 32, marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ color: "var(--muted)", fontStyle: "italic", marginBottom: 32 }}>Your tickets have been booked. Enjoy the show!</p>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: 24, marginBottom: 32, textAlign: "left" }}>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", marginBottom: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>Booking Summary</p>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>{show.movie.title}</h3>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{show.theatre}</p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>{show.time} · {show.date}</p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Seats: {seats.map(s => s.id).join(", ")}</p>
          <hr className="divider" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "var(--muted)" }}>Total Paid</span>
            <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 20 }}>₹{grandTotal}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-gold" onClick={() => setPage("bookings")}>View My Tickets</button>
          <button className="btn btn-ghost" onClick={() => setPage("home")}>Browse More</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ padding: "80px 20px 60px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24 }} onClick={() => setPage("seats")}>← Back to Seats</button>
        <h2 style={{ fontSize: 32, marginBottom: 8 }}>Checkout</h2>

        {/* Steps */}
        <div style={{ display: "flex", gap: 0, marginBottom: 40, alignItems: "center" }}>
          {["Order Summary", "Payment"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => i < step && setStep(i + 1)}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i + 1 ? "var(--success)" : step === i + 1 ? "var(--gold)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: "'DM Mono',monospace", color: step >= i + 1 ? "#080810" : "var(--muted)", transition: "all 0.3s" }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", color: step === i + 1 ? "var(--cream)" : "var(--muted)", letterSpacing: "0.08em" }}>{s}</span>
              </div>
              {i < 1 && <div style={{ width: 60, height: 1, background: "var(--border2)", margin: "0 16px" }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Left */}
          <div>
            {step === 1 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 4, padding: 28 }} className="fade-up">
                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Order Summary</h3>
                <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <img src={show.movie.poster} alt="" style={{ width: 80, borderRadius: 2 }} />
                  <div>
                    <h4 style={{ fontSize: 18, marginBottom: 4 }}>{show.movie.title}</h4>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>{show.theatre}</p>
                    <p style={{ color: "var(--muted)", fontSize: 14 }}>{show.time} · {show.date} · {show.type}</p>
                  </div>
                </div>
                <hr className="divider" />
                {seats.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                    <span style={{ color: "var(--muted)" }}>Seat {s.id} ({s.type})</span>
                    <span>₹{s.type === "Premium" ? show.pricePremium : show.priceRegular}</span>
                  </div>
                ))}
                <hr className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 15 }}>
                  <span style={{ color: "var(--muted)" }}>Convenience Fee</span>
                  <span>₹{convenience}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 700, color: "var(--gold)", marginTop: 12 }}>
                  <span>Total</span><span>₹{grandTotal}</span>
                </div>
                <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 24, padding: 14 }} onClick={() => setStep(2)}>Continue to Payment →</button>
              </div>
            )}

            {step === 2 && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 4, padding: 28 }} className="fade-up">
                <h3 style={{ fontSize: 20, marginBottom: 24 }}>Payment Method</h3>
                <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                  {["card", "upi", "netbanking", "wallet"].map(m => (
                    <button key={m} className={`btn ${payment.method === m ? "btn-gold" : "btn-ghost"}`} style={{ padding: "8px 16px" }} onClick={() => setPayment(p => ({ ...p, method: m }))}>{m === "netbanking" ? "Net Banking" : m.toUpperCase()}</button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Card Number</label>
                      <input className="input-field" placeholder="1234 5678 9012 3456" maxLength={19} value={payment.cardNum} onChange={e => setPayment(p => ({ ...p, cardNum: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() }))} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Expiry</label>
                        <input className="input-field" placeholder="MM/YY" maxLength={5} value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>CVV</label>
                        <input className="input-field" placeholder="•••" maxLength={3} type="password" value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                )}
                {payment.method === "upi" && (
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>UPI ID</label>
                    <input className="input-field" placeholder="yourname@upi" value={payment.upiId} onChange={e => setPayment(p => ({ ...p, upiId: e.target.value }))} />
                  </div>
                )}
                {payment.method === "netbanking" && (
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Select Bank</label>
                    <select className="input-field">
                      <option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Kotak Mahindra</option>
                    </select>
                  </div>
                )}
                {payment.method === "wallet" && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Paytm", "PhonePe", "Google Pay", "Amazon Pay"].map(w => (
                      <button key={w} className="btn btn-ghost" style={{ padding: "10px 20px" }}>{w}</button>
                    ))}
                  </div>
                )}

                <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 28, padding: 14, fontSize: 13 }} onClick={handlePay}>
                  Pay ₹{grandTotal} Securely →
                </button>
                <p style={{ textAlign: "center", fontSize: 12, fontFamily: "'DM Mono',monospace", color: "var(--muted)", marginTop: 12 }}>🔒 256-bit encrypted · Secured by RazorPay</p>
              </div>
            )}
          </div>

          {/* Right – Mini summary */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: 4, padding: 24, position: "sticky", top: 80 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Your Order</p>
            <h4 style={{ fontSize: 18, marginBottom: 4 }}>{show.movie.title}</h4>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>{show.time} · {show.date}</p>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>Seats: {seats.map(s => s.id).join(", ")}</p>
            <hr className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>
              <span>Total</span><span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}