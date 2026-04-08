import React, { useState } from 'react';
import Toast from './Toast';

export default function AuthPage({ setUser, setPage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }
    if (mode === "register" && !form.name) {
      setError("Name is required.");
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/login" : "/api/register";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        
        const successMessage = mode === "login" 
          ? `👋 Welcome back, ${data.user.name}!` 
          : `🎉 Account created successfully!`;
        
        setToast({ message: successMessage, type: 'success' });
        
        setTimeout(() => {
          if (data.user.role === 'admin') {
            setPage("admin");
          } else {
            setPage("home");
          }
        }, 1500);
      } else {
        setToast({ message: data.message || 'Login failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: "Cannot connect to server. Make sure your backend is running!", type: 'error' });
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      
      <div style={{ width: "100%", maxWidth: 420, padding: 20 }} className="fade-up">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, color: "var(--gold)", letterSpacing: "0.08em", marginBottom: 8 }}>Seatify</h1>
          <p style={{ color: "var(--muted)", fontStyle: "italic", fontSize: 16 }}>Your premium cinema experience</p>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: 40 }}>
          <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "1px solid var(--border2)" }}>
            {["login", "register"].map(m => (
              <button 
                key={m} 
                onClick={() => { setMode(m); setError(""); }} 
                style={{ 
                  flex: 1, padding: "10px 0", background: "none", border: "none", 
                  borderBottom: mode === m ? "2px solid var(--gold)" : "2px solid transparent", 
                  color: mode === m ? "var(--gold)" : "var(--muted)", 
                  fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: "0.12em", 
                  textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s", marginBottom: -1 
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Full Name</label>
                <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            
            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>

            {error && <p style={{ color: "var(--danger)", fontSize: 13, fontStyle: "italic" }}>{error}</p>}
            
            <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: 14 }} onClick={handleSubmit}>
              {mode === "login" ? "Sign In" : "Create Account"} →
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 24, fontStyle: "italic" }}>
          Secure access via SQL database
        </p>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}