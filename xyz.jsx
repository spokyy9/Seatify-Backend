import React, { useState, useEffect } from 'react';
import Toast from './Toast';

export default function AdminPage({ setPage }) {
    const [movies, setMovies] = useState([]);
    const [mode, setMode] = useState('list'); // 'list', 'add', 'edit'
    const [editingId, setEditingId] = useState(null);
    const [movie, setMovie] = useState({ 
        title: '', language: '', duration: '', genre: '', rated: '', image: '', trailer: '', desc: '' 
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [showTimes, setShowTimes] = useState([]);
    const [showForm, setShowForm] = useState({
        movieId: '',
        theatre: '',
        address: '',
        date: '',
        time: '',
        seatType: 'Standard',
        price: ''
    });

    // Fetch existing movies on mount
    useEffect(() => {
        const load = async () => {
            try {
                const [moviesRes, showsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/movies'),
                    fetch('http://localhost:5000/api/shows')
                ]);
                const moviesData = await moviesRes.json();
                const showsData = await showsRes.json();
                setMovies(Array.isArray(moviesData) ? moviesData : []);
                setShowTimes(Array.isArray(showsData) ? showsData : []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setMovies([]);
                setShowTimes([]);
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/movies/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movie)
            });
            if (res.ok) {
                setToast({ message: '🎬 Movie successfully added!', type: 'success' });
                setMovie({ title: '', language: '', duration: '', genre: '', rated: '', image: '', trailer: '', desc: '' });
                setMode('list');
                // Refresh the list
                const moviesRes = await fetch('http://localhost:5000/api/movies');
                const moviesData = await moviesRes.json();
                setMovies(Array.isArray(moviesData) ? moviesData : []);
            }
        } catch (err) {
            console.error("Connection error:", err);
            setToast({ message: 'Backend is not responding.', type: 'error' });
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/movies/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movie)
            });
            if (res.ok) {
                setToast({ message: '✅ Movie updated successfully!', type: 'success' });
                setMovie({ title: '', language: '', duration: '', genre: '', rated: '', image: '', trailer: '', desc: '' });
                setEditingId(null);
                setMode('list');
                // Refresh the list
                const moviesRes = await fetch('http://localhost:5000/api/movies');
                const moviesData = await moviesRes.json();
                setMovies(Array.isArray(moviesData) ? moviesData : []);
            }
        } catch (err) {
            console.error("Connection error:", err);
            setToast({ message: 'Backend is not responding.', type: 'error' });
        }
    };

    const startEdit = (m) => {
        setEditingId(m.id);
        setMovie({
            title: m.title,
            language: m.language,
            duration: m.duration,
            genre: m.genre,
            rated: m.rated,
            image: m.poster,
            trailer: m.trailer || '',
            desc: m.desc || ''
        });
        setMode('edit');
    };

    const cancelEdit = () => {
        setMovie({ title: '', language: '', duration: '', genre: '', rated: '', image: '', trailer: '', desc: '' });
        setEditingId(null);
        setMode('list');
    };

    const handleAddShowtime = async (e) => {
        e.preventDefault();
        if (!showForm.movieId || !showForm.theatre || !showForm.date || !showForm.time || !showForm.price) {
            setToast({ message: 'Please complete all showtime fields.', type: 'error' });
            return;
        }
        const movieItem = movies.find(m => m.id === Number(showForm.movieId));
        if (!movieItem) {
            setToast({ message: 'Movie not found. Choose a movie.', type: 'error' });
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/shows/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movieId: Number(showForm.movieId),
                    theatre: showForm.theatre,
                    address: showForm.address,
                    date: showForm.date,
                    time: showForm.time,
                    seatType: showForm.seatType,
                    price: Number(showForm.price),
                    duration: Number(movieItem.duration) || 120,
                    created_by: 'admin'
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Unable to add showtime');
            }

            const addedShow = {
                id: data.id,
                movieId: movieItem.id,
                movieTitle: movieItem.title,
                theatre: showForm.theatre,
                address: showForm.address,
                date: showForm.date,
                time: showForm.time,
                type: showForm.seatType,
                duration: Number(movieItem.duration) || 120,
                priceRegular: Number(showForm.price),
                pricePremium: Number(showForm.price),
                seatsTotal: 0,
                seatsBooked: 0,
                seatsAvailable: 0
            };

            setShowTimes(prev => [addedShow, ...prev]);
            setShowForm({ movieId: '', theatre: '', address: '', date: '', time: '', seatType: 'Standard', price: '' });
            setToast({ message: '🎟️ Showtime added successfully!', type: 'success' });
        } catch (err) {
            setToast({ message: err.message || 'Failed to add showtime.', type: 'error' });
        }
    };

    return (
        <div className="page" style={{ padding: '80px 40px 60px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 32, marginBottom: 6, color: 'var(--gold)' }}>Theatre Management</h2>
                <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginBottom: 40 }}>Add and manage your cinema's movie catalog</p>

                {/* Mode Tabs */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 40, borderBottom: '1px solid var(--border2)', paddingBottom: 16 }}>
                    <button
                        onClick={() => {
                            setMode('list');
                            cancelEdit();
                        }}
                        style={{
                            padding: '10px 20px',
                            background: mode === 'list' ? 'var(--gold)' : 'transparent',
                            color: mode === 'list' ? '#080810' : 'var(--muted)',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        📽️ All Movies
                    </button>
                    <button
                        onClick={() => {
                            setMode('add');
                            setMovie({ title: '', language: '', duration: '', genre: '', rated: '', image: '', trailer: '', desc: '' });
                        }}
                        style={{
                            padding: '10px 20px',
                            background: mode === 'add' ? 'var(--gold)' : 'transparent',
                            color: mode === 'add' ? '#080810' : 'var(--muted)',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        ➕ Add New Movie
                    </button>
                    <button
                        onClick={() => {
                            setMode('shows');
                        }}
                        style={{
                            padding: '10px 20px',
                            background: mode === 'shows' ? 'var(--gold)' : 'transparent',
                            color: mode === 'shows' ? '#080810' : 'var(--muted)',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            letterSpacing: '0.1em',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                    >
                        🗓️ Manage Showtimes
                    </button>
                    {mode === 'edit' && (
                        <button
                            onClick={() => {}}
                            style={{
                                padding: '10px 20px',
                                background: 'var(--gold)',
                                color: '#080810',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontFamily: "'DM Mono', monospace",
                                fontSize: 11,
                                letterSpacing: '0.1em',
                                fontWeight: 600,
                            }}
                        >
                            ✏️ Editing Movie
                        </button>
                    )}
                </div>

                {/* List Mode */}
                {mode === 'list' && (
                    <div>
                        {loading ? (
                            <p style={{ color: 'var(--muted)', textAlign: 'center' }}>Loading movies...</p>
                        ) : movies.length === 0 ? (
                            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>No movies yet. Add one to get started!</p>
                        ) : (
                            <div style={{ display: 'grid', gap: 16 }}>
                                {movies.map(m => (
                                    <div key={m.id} style={{
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border2)',
                                        borderRadius: 4,
                                        padding: 20,
                                        display: 'flex',
                                        gap: 20,
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        flexWrap: 'wrap'
                                    }}>
                                        {/* Movie Thumbnail */}
                                        <div style={{ width: 100, minWidth: 100, maxWidth: 100 }}>
                                            {m.poster ? (
                                                <img src={m.poster} alt={m.title} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 4 }} onError={e => { e.target.style.display = 'none'; }} />
                                            ) : (
                                                <div style={{ width: '100%', height: 150, background: 'var(--border2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 12 }}>No image</div>
                                            )}
                                        </div>
                                        
                                        {/* Movie Info */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: 18, marginBottom: 8 }}>{m.title}</h3>
                                            <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                                                {m.genre} • {m.language} • {m.duration} mins • {m.rated}
                                            </p>
                                            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                                                {m.desc ? m.desc.substring(0, 100) + '...' : 'No description'}
                                            </p>
                                        </div>
                                        
                                        {/* Edit Button */}
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <button
                                                onClick={() => startEdit(m)}
                                                style={{
                                                    padding: '8px 16px',
                                                    background: 'var(--gold)',
                                                    color: '#080810',
                                                    border: 'none',
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => e.target.style.opacity = '0.8'}
                                                onMouseLeave={e => e.target.style.opacity = '1'}
                                            >
                                                ✏️ Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Showtimes Management */}
                {mode === 'shows' && (
                    <div className="card" style={{ maxWidth: '760px', margin: '0 auto', padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <h2 style={{ color: 'var(--gold)', marginBottom: 20, fontFamily: "'Playfair Display', serif", fontSize: 22 }}>🗓️ Showtimes Management</h2>
                        <form onSubmit={handleAddShowtime} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Movie *</label>
                                <select className="input-field" value={showForm.movieId} onChange={e => setShowForm(prev => ({ ...prev, movieId: e.target.value }))} required>
                                    <option value="">Select movie</option>
                                    {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Theatre *</label>
                                <input className="input-field" value={showForm.theatre} onChange={e => setShowForm(prev => ({ ...prev, theatre: e.target.value }))} placeholder="Theatre name" required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Address or Venue</label>
                                <input className="input-field" value={showForm.address} onChange={e => setShowForm(prev => ({ ...prev, address: e.target.value }))} placeholder="Address for Google Maps" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Date *</label>
                                <input className="input-field" type="date" value={showForm.date} onChange={e => setShowForm(prev => ({ ...prev, date: e.target.value }))} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Time *</label>
                                <input className="input-field" type="time" value={showForm.time} onChange={e => setShowForm(prev => ({ ...prev, time: e.target.value }))} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Seat Type</label>
                                <select className="input-field" value={showForm.seatType} onChange={e => setShowForm(prev => ({ ...prev, seatType: e.target.value }))}>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="4DX">4DX</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>Price (₹) *</label>
                                <input className="input-field" type="number" value={showForm.price} onChange={e => setShowForm(prev => ({ ...prev, price: e.target.value }))} placeholder="Ticket price" required />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" className="btn btn-ghost" onClick={() => setShowForm({ movieId: '', theatre: '', address: '', date: '', time: '', seatType: 'Standard', price: '' })}>Reset</button>
                                <button type="submit" className="btn btn-gold">Add Showtime</button>
                            </div>
                        </form>

                        <div style={{ marginTop: 10 }}>
                            {showTimes.length === 0 ? (
                                <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No showtimes added yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {showTimes.map(show => (
                                        <div key={show.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 4, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <div>
                                                <strong>{show.movieTitle}</strong> @ {show.theatre} | {show.date} {show.time} | {show.seatType} | ₹{show.price}
                                                {show.address && (
                                                    <span style={{ marginLeft: 12, color: 'var(--muted)', fontSize: 12 }}>Address: {show.address}</span>
                                                )}
                                            </div>
                                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address || show.theatre)}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ lineHeight: 1.2 }}>Google Maps</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Add/Edit Form */}
                {(mode === 'add' || mode === 'edit') && (
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <h2 style={{ color: 'var(--gold)', marginBottom: '24px', fontFamily: "'Playfair Display', serif", fontSize: 24 }}>
                            {mode === 'add' ? '🎬 Add New Movie' : '✏️ Edit Movie'}
                        </h2>
                        <form onSubmit={mode === 'add' ? handleAdd : handleEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Movie Title *</label>
                                <input className="input-field" placeholder="Movie Title" value={movie.title} onChange={e => setMovie({...movie, title: e.target.value})} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Language</label>
                                <input className="input-field" placeholder="Language (e.g. English, Hindi)" value={movie.language} onChange={e => setMovie({...movie, language: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Duration</label>
                                <input className="input-field" placeholder="Duration (e.g. 120 mins)" value={movie.duration} onChange={e => setMovie({...movie, duration: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Genre</label>
                                <input className="input-field" placeholder="Genre (e.g. Sci-Fi, Drama)" value={movie.genre} onChange={e => setMovie({...movie, genre: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Rating</label>
                                <input className="input-field" placeholder="Rating (e.g. UA/A/U)" value={movie.rated} onChange={e => setMovie({...movie, rated: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Poster Image URL</label>
                                <input className="input-field" placeholder="https://example.com/image.jpg" value={movie.image} onChange={e => setMovie({...movie, image: e.target.value})} />
                                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>💡 Use direct image links: Unsplash, Imgur, IMDb poster URLs, or direct .jpg/.png links</p>
                                {movie.image && (
                                    <div style={{ marginTop: 12, borderRadius: 4, overflow: 'hidden', maxHeight: 200 }}>
                                        <img src={movie.image} alt="Preview" style={{ width: '100%', height: 'auto', maxHeight: 200, objectFit: 'cover', borderRadius: 4 }} onError={e => { e.target.style.display = 'none'; }} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Trailer YouTube Link</label>
                                <input className="input-field" placeholder="Trailer YouTube Link" value={movie.trailer} onChange={e => setMovie({...movie, trailer: e.target.value})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Description</label>
                                <textarea className="input-field" placeholder="Movie description..." value={movie.desc} onChange={e => setMovie({...movie, desc: e.target.value})} style={{ minHeight: '100px', fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-ghost" onClick={cancelEdit} style={{ padding: '10px 20px' }}>Cancel</button>
                                <button type="submit" className="btn btn-gold" style={{ padding: '10px 20px' }}>
                                    {mode === 'add' ? '➕ Add Movie' : '✅ Update Movie'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={5000}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}