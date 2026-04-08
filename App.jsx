import { useState, useEffect, useRef } from "react";
import Navbar from './Navbar';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import MoviePage from './MoviePage';
import SeatPage from './SeatPage';
import CheckoutPage from './Checkout'; // Check if file is Checkout.jsx or CheckoutPage.jsx
import BookingsPage from './BookingPage';
import ResalePage from './ResalePage';
import AdminPage from './xyz'; 
// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOVIES = [
  { id: 1, title: "Interstellar Odyssey", genre: "Sci-Fi", language: "English", duration: 169, rated: "UA", rating: 9.1, poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80", desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id: 2, title: "Crimson Shadows", genre: "Thriller", language: "English", duration: 118, rated: "A", rating: 8.4, poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80", banner: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&q=80", desc: "A detective unravels a web of lies in a city where nothing is what it seems." },
  { id: 3, title: "The Last Frontier", genre: "Action", language: "English", duration: 143, rated: "UA", rating: 7.8, poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&q=80", banner: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&q=80", desc: "In a world torn apart by conflict, one soldier must choose between duty and conscience." },
  { id: 4, title: "Velvet Dreams", genre: "Romance", language: "Hindi", duration: 132, rated: "U", rating: 8.0, poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=400&q=80", banner: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=1200&q=80", desc: "Two strangers meet at the crossroads of fate and find love in the most unexpected corners." },
  { id: 5, title: "Neon Requiem", genre: "Horror", language: "English", duration: 105, rated: "A", rating: 7.5, poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80", banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&q=80", desc: "A group of friends discover an abandoned city with a dark secret buried beneath its streets." },
  { id: 6, title: "Solar Winds", genre: "Animation", language: "English", duration: 95, rated: "U", rating: 8.6, poster: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80", banner: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80", desc: "A young girl embarks on a magical journey across the cosmos to find her lost brother." },
];

const THEATRES = [
  { id: 1, name: "Seatify IMAX", location: "Mangaluru City Centre", screens: 8 },
  { id: 2, name: "StarPlex Premium", location: "Hampankatta", screens: 5 },
  { id: 3, name: "Galaxy Cinema", location: "Lalbagh", screens: 6 },
];

const generateShows = (movieId) => {
  const times = ["09:30 AM", "12:45 PM", "03:15 PM", "06:30 PM", "09:45 PM"];
  const types = ["Standard", "IMAX", "4DX", "Premium"];
  return THEATRES.flatMap((theatre, ti) =>
    times.slice(0, 3 + ti).map((time, si) => ({
      id: `${movieId}-${theatre.id}-${si}`,
      movieId,
      theatreId: theatre.id,
      theatre: theatre.name,
      location: theatre.location,
      time,
      date: new Date(Date.now() + (si % 3) * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      type: types[si % types.length],
      priceRegular: 180 + ti * 40,
      pricePremium: 320 + ti * 60,
      screenId: `S${theatre.id}-${(si % 3) + 1}`,
    }))
  );
};

const generateSeats = () => {
  const rows = ["A","B","C","D","E","F","G","H"];
  const seats = [];
  rows.forEach((row, ri) => {
    for (let n = 1; n <= 12; n++) {
      const isPremium = ri < 3;
      const isBooked = Math.random() < 0.25;
      seats.push({ id: `${row}${n}`, row, num: n, type: isPremium ? "Premium" : "Regular", status: isBooked ? "booked" : "available" });
    }
  });
  return seats;
};

const RESALE_LISTINGS = [
  { id: "r1", movieTitle: "Interstellar Odyssey", theatre: "Seatify IMAX", date: "05 Apr 2026", time: "06:30 PM", seat: "C7", type: "Premium", askingPrice: 280, originalPrice: 320, seller: "Rahul M.", listedAt: "2 hours ago", status: "available" },
  { id: "r2", movieTitle: "Crimson Shadows", theatre: "StarPlex Premium", date: "06 Apr 2026", time: "09:45 PM", seat: "E4", type: "Regular", askingPrice: 150, originalPrice: 180, seller: "Priya K.", listedAt: "5 hours ago", status: "available" },
  { id: "r3", movieTitle: "The Last Frontier", theatre: "Galaxy Cinema", date: "05 Apr 2026", time: "03:15 PM", seat: "B9", type: "Premium", askingPrice: 300, originalPrice: 380, seller: "Arjun S.", listedAt: "1 day ago", status: "available" },
  { id: "r4", movieTitle: "Velvet Dreams", theatre: "Seatify IMAX", date: "07 Apr 2026", time: "12:45 PM", seat: "F11", type: "Regular", askingPrice: 160, originalPrice: 180, seller: "Sneha R.", listedAt: "3 hours ago", status: "available" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080810;
    --surface: #0f0f1a;
    --surface2: #161625;
    --surface3: #1e1e30;
    --gold: #C9A84C;
    --gold-light: #E2C46E;
    --gold-dim: rgba(201,168,76,0.15);
    --cream: #EDE8DF;
    --muted: #7A7490;
    --danger: #E05252;
    --success: #52C07A;
    --border: rgba(201,168,76,0.12);
    --border2: rgba(255,255,255,0.06);
  }

  body { background: var(--bg); color: var(--cream); font-family: 'Cormorant Garamond', serif; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--surface); } ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }

  .grain { position: fixed; inset: 0; pointer-events: none; z-index: 9999; opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  h1,h2,h3,h4,h5 { font-family: 'Playfair Display', serif; }

  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; border-radius: 2px; border: none; cursor: pointer; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; transition: all 0.2s; }
  .btn-gold { background: var(--gold); color: #080810; }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }
  .btn-outline { background: transparent; color: var(--gold); border: 1px solid var(--gold); }
  .btn-outline:hover { background: var(--gold-dim); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border2); }
  .btn-ghost:hover { color: var(--cream); border-color: var(--border); }
  .btn-danger { background: rgba(224,82,82,0.15); color: var(--danger); border: 1px solid rgba(224,82,82,0.3); }
  .btn-danger:hover { background: rgba(224,82,82,0.25); }

  .input-field { width: 100%; background: var(--surface3); border: 1px solid var(--border); color: var(--cream); padding: 12px 16px; font-family: 'Cormorant Garamond', serif; font-size: 16px; border-radius: 2px; outline: none; transition: border-color 0.2s; }
  .input-field:focus { border-color: var(--gold); }
  .input-field::placeholder { color: var(--muted); }

  .card { background: var(--surface); border: 1px solid var(--border2); border-radius: 4px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
  .card:hover { transform: translateY(-4px); border-color: var(--border); }

  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 1px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
  .badge-gold { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,168,76,0.2); }
  .badge-green { background: rgba(82,192,122,0.12); color: var(--success); border: 1px solid rgba(82,192,122,0.2); }
  .badge-red { background: rgba(224,82,82,0.12); color: var(--danger); border: 1px solid rgba(224,82,82,0.2); }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(8,8,16,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--gold); letter-spacing: 0.05em; cursor: pointer; }
  .nav-logo span { color: var(--cream); }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-link { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: color 0.2s; border: none; background: none; padding: 4px 0; position: relative; }
  .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width 0.2s; }
  .nav-link:hover, .nav-link.active { color: var(--cream); }
  .nav-link:hover::after, .nav-link.active::after { width: 100%; }

  .page { padding-top: 64px; min-height: 100vh; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-up-d1 { animation: fadeUp 0.5s ease 0.1s both; }
  .fade-up-d2 { animation: fadeUp 0.5s ease 0.2s both; }
  .fade-up-d3 { animation: fadeUp 0.5s ease 0.3s both; }

  .seat { width: 34px; height: 28px; border-radius: 6px 6px 2px 2px; cursor: pointer; border: none; transition: all 0.15s; position: relative; }
  .seat-available-regular { background: var(--surface3); border: 1px solid rgba(255,255,255,0.1); }
  .seat-available-regular:hover { background: rgba(201,168,76,0.3); border-color: var(--gold); }
  .seat-available-premium { background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.3); }
  .seat-available-premium:hover { background: rgba(201,168,76,0.35); border-color: var(--gold); }
  .seat-selected { background: var(--gold) !important; border-color: var(--gold-light) !important; }
  .seat-booked { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); cursor: not-allowed; opacity: 0.4; }

  .hero-banner { position: relative; height: 480px; overflow: hidden; }
  .hero-banner img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.3); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(8,8,16,0.95) 40%, transparent); }
  .hero-content { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 60px; }

  .ticket { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; position: relative; }
  .ticket::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--gold); }
  .ticket-notch { display: flex; align-items: center; justify-content: space-between; padding: 0 20px; margin: 0 16px; border-top: 1px dashed var(--border2); }
  .ticket-notch::before, .ticket-notch::after { content: ''; width: 16px; height: 16px; border-radius: 50%; background: var(--bg); position: absolute; }
  .ticket-notch::before { left: -8px; } .ticket-notch::after { right: -8px; }

  .resale-tag { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; background: rgba(224,82,82,0.1); color: #FF8080; border: 1px solid rgba(224,82,82,0.2); border-radius: 1px; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }

  .divider { border: none; border-top: 1px solid var(--border2); margin: 24px 0; }

  .star { color: var(--gold); }

  select.input-field option { background: var(--surface2); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(8,8,16,0.85); backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeUp 0.2s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 36px; max-width: 480px; width: 100%; }
`;








// ─── MOVIE DETAIL PAGE ───────────────────────────────────────────────────────


// ─── SEAT SELECTION PAGE ──────────────────────────────────────────────────────

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────


// ─── MY BOOKINGS PAGE ─────────────────────────────────────────────────────────

// ─── RESALE MARKET PAGE ───────────────────────────────────────────────────────

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [resaleListings, setResaleListings] = useState(RESALE_LISTINGS);

  const addBooking = (b) => setBookings(prev => [b, ...prev]);
  const listForResale = (booking) => {
    const listing = {
      id: `r${Date.now()}`,
      movieTitle: booking.movie.title,
      theatre: booking.show.theatre,
      date: booking.show.date,
      time: booking.show.time,
      seat: booking.seats.map(s => s.id).join(", "),
      type: booking.seats[0]?.type || "Regular",
      askingPrice: booking.askingPrice,
      originalPrice: booking.total,
      seller: user?.name || "You",
      listedAt: "just now",
      status: "available",
    };
    setResaleListings(prev => [listing, ...prev]);
  };

 return (
    <>
      <style>{style}</style>
      <div className="grain" />
      {!user ? (
        // Pass setPage here so AuthPage can redirect to Admin or Home
        <AuthPage setUser={setUser} setPage={setPage} />
      ) : (
        <>
          <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />
          
          {/* 1. Add the Admin Page back in */}
          {page === "admin" && <AdminPage setPage={setPage} />}
          
          {/* 2. Pass MOVIES to HomePage */}
          {page === "home" && <HomePage setPage={setPage} setSelectedMovie={setSelectedMovie} movies={MOVIES} />}
          
          {/* 3. Pass functions to other pages */}
          {page === "movie" && selectedMovie && <MoviePage movie={selectedMovie} setPage={setPage} setSelectedShow={setSelectedShow} generateShows={generateShows} />}
          
          {page === "seats" && selectedShow && <SeatPage show={selectedShow} setPage={setPage} setCheckoutData={setCheckoutData} generateSeats={generateSeats} />}
          
          {page === "checkout" && <CheckoutPage data={checkoutData} setPage={setPage} addBooking={addBooking} />}
          
          {page === "bookings" && <BookingsPage bookings={bookings} setPage={setPage} listForResale={listForResale} />}
          
          {/* 4. Pass resaleListings to ResalePage */}
          {page === "resale" && <ResalePage resaleListings={resaleListings} setPage={setPage} user={user} setCheckoutData={setCheckoutData} />}
        </>
      )}
    </>
  );
}
