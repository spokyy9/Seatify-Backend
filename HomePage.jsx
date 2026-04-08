import React, { useState, useEffect } from 'react';

export default function HomePage({ setPage, setSelectedMovie }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const genres = ["All", "Sci-Fi", "Thriller", "Action", "Romance", "Horror", "Animation", "Comedy", "Drama"];

  // ── Fetch movies from backend on mount ──────────────────────────────────────
useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          
          // 🪄 MAP THE SQL COLUMNS TO REACT PROPS
          const formattedMovies = data.map(dbMovie => ({
            id: dbMovie.id || dbMovie.movie_id,
            title: dbMovie.title, 
            genre: dbMovie.genre,
            language: dbMovie.language,
            duration: dbMovie.duration,
            rated: dbMovie.rated,
            poster: dbMovie.poster,
            banner: dbMovie.banner,
            trailer: dbMovie.trailer,
            rating: dbMovie.rating || 0,
            desc: dbMovie.desc || "" // Backend returns 'desc' from database
          }));

          // OPTION A: Show ONLY real database movies
          setMovies(formattedMovies);

          // OPTION B: If you want to see BOTH real movies AND demo movies, 
          // delete the line above and uncomment the line below:
          // setMovies([...formattedMovies, ...DEMO_MOVIES]);

        } else {
          setMovies(DEMO_MOVIES);
        }
        setLoading(false);
      })
      .catch(() => {
        setMovies(DEMO_MOVIES);
        setLoading(false);
        setError("Could not reach server — showing demo data.");
      });
  }, []);

  // ── Auto-rotate featured movie every 5 seconds ─────────────────────────────
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const filtered = movies.filter(m =>
    (filter === "All" || m.genre === filter) &&
    m.title?.toLowerCase().includes(search.toLowerCase())
  );

  const featured = movies[featuredIndex] || movies[0];

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", flexDirection: "column", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "2px solid var(--border2)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--muted)", fontStyle: "italic" }}>Loading films...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── No movies at all ─────────────────────────────────────────────────────────
  if (!featured) {
    return (
      <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🎬</div>
        <h3 style={{ fontSize: 22 }}>No films available yet</h3>
        <p style={{ color: "var(--muted)", fontStyle: "italic" }}>An admin needs to add movies first.</p>
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="page">
      {error && (
        <div style={{ background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.2)", color: "#FF8080", padding: "10px 40px", fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="hero-banner" style={{ position: "relative" }}>
        <img src={featured.banner || featured.poster} alt={featured.title} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div style={{ maxWidth: 520 }}>
            <div className="fade-up" style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {featured.genre    && <span className="badge badge-gold">{featured.genre}</span>}
              {featured.language && <span className="badge badge-gold">{featured.language}</span>}
              {featured.rated    && <span className="badge badge-gold">{featured.rated}</span>}
            </div>
            <h1 className="fade-up-d1" style={{ fontSize: 52, lineHeight: 1.1, marginBottom: 16, fontWeight: 900 }}>
              {featured.title}
            </h1>
            {featured.desc && (
              <p className="fade-up-d2" style={{ color: "rgba(237,232,223,0.7)", fontSize: 18, marginBottom: 8, lineHeight: 1.6, fontStyle: "italic" }}>
                {featured.desc}
              </p>
            )}
            <div className="fade-up-d2" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, color: "var(--gold)" }}>
              {featured.rating > 0 && (
                <>
                  <span style={{ fontSize: 20 }}>★</span>
                  <span style={{ fontSize: 18, fontWeight: 600 }}>{featured.rating}</span>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>/ 10</span>
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>·</span>
                </>
              )}
              {featured.duration && (
                <span style={{ color: "var(--muted)", fontSize: 14 }}>{featured.duration} min</span>
              )}
            </div>
            <div className="fade-up-d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-gold" onClick={() => { setSelectedMovie(featured); setPage("movie"); }}>
                Book Tickets
              </button>
              {featured.trailer && (
                <button className="btn btn-outline" onClick={() => window.open(featured.trailer, "_blank")}>
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        {movies.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => setFeaturedIndex(prev => (prev - 1 + movies.length) % movies.length)}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(201,168,76,0.2)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "12px 16px",
                cursor: "pointer",
                borderRadius: 2,
                fontSize: 18,
                transition: "all 0.2s",
                zIndex: 10,
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(201,168,76,0.4)"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(201,168,76,0.2)"; }}
            >
              ❮
            </button>

            {/* Next Button */}
            <button
              onClick={() => setFeaturedIndex(prev => (prev + 1) % movies.length)}
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(201,168,76,0.2)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "12px 16px",
                cursor: "pointer",
                borderRadius: 2,
                fontSize: 18,
                transition: "all 0.2s",
                zIndex: 10,
              }}
              onMouseEnter={e => { e.target.style.background = "rgba(201,168,76,0.4)"; }}
              onMouseLeave={e => { e.target.style.background = "rgba(201,168,76,0.2)"; }}
            >
              ❯
            </button>

            {/* Dot Indicators */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                alignItems: "center",
                zIndex: 10,
              }}
            >
              {movies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  style={{
                    width: idx === featuredIndex ? 24 : 12,
                    height: 8,
                    borderRadius: 4,
                    background: idx === featuredIndex ? "var(--gold)" : "rgba(201,168,76,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                />
              ))}
            </div>

            {/* Movie Counter */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 24,
                background: "rgba(201,168,76,0.15)",
                border: "1px solid var(--gold)",
                color: "var(--gold)",
                padding: "8px 16px",
                borderRadius: 2,
                fontSize: 12,
                fontFamily: "'DM Mono',monospace",
                letterSpacing: "0.1em",
                zIndex: 10,
              }}
            >
              {featuredIndex + 1} / {movies.length}
            </div>
          </>
        )}
      </div>

      {/* ── Movie Grid ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "48px 40px" }}>

        {/* Filters */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <input
            className="input-field"
            style={{ maxWidth: 260 }}
            placeholder="Search films..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {genres.map(g => (
              <button
                key={g}
                className={`btn ${filter === g ? "btn-gold" : "btn-ghost"}`}
                style={{ padding: "7px 16px" }}
                onClick={() => setFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }}>
          Now Showing — {filtered.length} Film{filtered.length !== 1 ? "s" : ""}
        </h2>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)", fontStyle: "italic" }}>
            No films match your search.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
            {filtered.map((movie, i) => (
              <div
                key={movie.id}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => { setSelectedMovie(movie); setPage("movie"); }}
              >
                <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                    onError={e => { e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80"; }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,16,0.9) 0%, transparent 60%)" }} />
                  {movie.rated && (
                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                      <span className="badge badge-gold">{movie.rated}</span>
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 14, left: 14, right: 14 }}>
                    {movie.rating > 0 && (
                      <div style={{ color: "var(--gold)", fontSize: 13, marginBottom: 4 }}>★ {movie.rating}</div>
                    )}
                    <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{movie.title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'DM Mono',monospace", marginTop: 4 }}>
                      {movie.genre}{movie.duration ? ` · ${movie.duration}m` : ""}
                    </p>
                  </div>
                </div>
                <div style={{ padding: 14 }}>
                  <button
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center", padding: "9px 0" }}
                    onClick={e => { e.stopPropagation(); setSelectedMovie(movie); setPage("movie"); }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Fallback demo movies (shown when DB is empty or backend is down) ──────────
const DEMO_MOVIES = [
  {
    id: 1, title: "Interstellar Odyssey", genre: "Sci-Fi", language: "English",
    duration: 169, rated: "UA", rating: 9.1,
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
    desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailer: null,
  },
  {
    id: 2, title: "Crimson Shadows", genre: "Thriller", language: "English",
    duration: 118, rated: "A", rating: 8.4,
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&q=80",
    desc: "A detective unravels a web of lies in a city where nothing is what it seems.",
    trailer: null,
  },
  {
    id: 3, title: "The Last Frontier", genre: "Action", language: "English",
    duration: 143, rated: "UA", rating: 7.8,
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80",
    desc: "In a world torn apart by conflict, one soldier must choose between duty and conscience.",
    trailer: null,
  },
  {
    id: 4, title: "Velvet Dreams", genre: "Romance", language: "Hindi",
    duration: 132, rated: "U", rating: 8.0,
    poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=1200&q=80",
    desc: "Two strangers meet at the crossroads of fate and find love in the most unexpected corners.",
    trailer: null,
  },
  {
    id: 5, title: "Neon Requiem", genre: "Horror", language: "English",
    duration: 105, rated: "A", rating: 7.5,
    poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&q=80",
    desc: "A group of friends discover an abandoned city with a dark secret buried beneath its streets.",
    trailer: null,
  },
  {
    id: 6, title: "Solar Winds", genre: "Animation", language: "English",
    duration: 95, rated: "U", rating: 8.6,
    poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80",
    banner: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    desc: "A young girl embarks on a magical journey across the cosmos to find her lost brother.",
    trailer: null,
  },
];