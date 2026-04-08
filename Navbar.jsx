import React, { useState } from 'react';
export default function Navbar({ page, setPage, user, setUser }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>Seati<span>fy</span></div>
      {user && (
        <div className="nav-links">
            {user.role === 'admin' && (
  <button 
    className={`nav-link ${page === "admin" ? "active" : ""}`} 
    onClick={() => setPage("admin")}
  >
    Management
  </button>
)}
          <button className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Films</button>
          <button className={`nav-link ${page === "bookings" ? "active" : ""}`} onClick={() => setPage("bookings")}>My Tickets</button>
          <button className={`nav-link ${page === "resale" ? "active" : ""}`} onClick={() => setPage("resale")}>Resale Market</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "var(--cream)", fontFamily: "'Playfair Display',serif" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{user.role}</div>
            </div>
            <button className="btn btn-ghost" style={{ padding: "6px 14px" }} onClick={() => setUser(null)}>Exit</button>
          </div>
        </div>
      )}
    </nav>
  );
}