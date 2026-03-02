import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingBag, X, ChevronRight, ChevronLeft, User, Menu, Search, Check, Package, TrendingUp, Users, AlertCircle, LogOut, Plus, Minus, Eye, BarChart2, Settings, Bell, ArrowRight, Home, Grid, Heart } from "lucide-react";

// ─────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg: #080808;
      --surface: #111111;
      --surface2: #1a1a1a;
      --surface3: #222222;
      --gold: #C9A96E;
      --gold-light: #E8C98A;
      --text: #F0EBE1;
      --muted: #888880;
      --subtle: #333330;
      --red: #E05C5C;
      --green: #5CAB7D;
      --radius: 14px;
      --radius-sm: 8px;
    }
    
    html, body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
    
    .serif { font-family: 'Cormorant Garamond', serif; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--subtle); border-radius: 2px; }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes slideUpDrawer { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes notif { from { opacity: 0; transform: translateX(120%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes crossfade { 0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; } }
    
    .fade-in { animation: fadeIn 0.6s ease forwards; }
    .slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .slide-down { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    .btn-primary {
      background: var(--gold);
      color: #000;
      border: none;
      padding: 14px 32px;
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 8px 30px rgba(201,169,110,0.35); }
    .btn-primary:active { transform: translateY(0); }
    
    .btn-ghost {
      background: transparent;
      color: var(--text);
      border: 1px solid var(--subtle);
      padding: 12px 28px;
      border-radius: 100px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
    
    .btn-icon {
      background: none; border: none; cursor: pointer;
      color: var(--text); transition: all 0.2s ease; padding: 8px;
      border-radius: 50%;
    }
    .btn-icon:hover { color: var(--gold); background: rgba(201,169,110,0.1); }
    
    .input-field {
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--subtle);
      color: var(--text);
      padding: 14px 16px;
      border-radius: var(--radius-sm);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease;
    }
    .input-field:focus { border-color: var(--gold); }
    .input-field::placeholder { color: var(--muted); }
    
    select.input-field option { background: var(--surface2); }
    
    .card {
      background: var(--surface);
      border-radius: var(--radius);
      border: 1px solid var(--subtle);
    }
    
    .gold-text { color: var(--gold); }
    .muted-text { color: var(--muted); }
    
    /* Product card hover */
    .product-card { cursor: pointer; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .product-card:hover { transform: translateY(-6px); }
    .product-card:hover .product-img { transform: scale(1.04); }
    .product-img { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); width: 100%; height: 100%; object-fit: cover; }
    
    /* Overlay gradient */
    .hero-overlay {
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.85) 100%);
    }
    
    /* Size chip */
    .size-chip {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--subtle);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      color: var(--text);
    }
    .size-chip:hover:not(.disabled) { border-color: var(--gold); color: var(--gold); }
    .size-chip.selected { background: var(--gold); color: #000; border-color: var(--gold); font-weight: 600; }
    .size-chip.disabled { opacity: 0.3; cursor: not-allowed; text-decoration: line-through; }
    
    /* Color swatch */
    .color-swatch {
      width: 28px; height: 28px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }
    .color-swatch.selected { border-color: var(--gold); transform: scale(1.2); }
    .color-swatch:hover:not(.selected) { transform: scale(1.1); }
    
    /* Notification */
    .notif-toast {
      animation: notif 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: var(--surface2);
      border: 1px solid var(--gold);
      border-radius: var(--radius-sm);
      padding: 14px 18px;
      max-width: 320px;
      backdrop-filter: blur(20px);
    }
    
    /* Cart drawer */
    .cart-drawer-desktop {
      animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .cart-drawer-mobile {
      animation: slideUpDrawer 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Mobile bottom nav */
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-nav { display: flex !important; }
      .desktop-only { display: none !important; }
    }
    @media (min-width: 769px) {
      .mobile-nav { display: none !important; }
      .mobile-only { display: none !important; }
    }
    
    /* Live dot */
    .live-dot {
      width: 8px; height: 8px;
      background: var(--green);
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    /* Shimmer skeleton */
    .skeleton {
      background: linear-gradient(90deg, var(--surface2) 25%, var(--surface3) 50%, var(--surface2) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }
    
    /* Divider */
    .divider { height: 1px; background: var(--subtle); width: 100%; }
    
    /* Tag */
    .tag {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 100px;
    }
    
    /* Slideshow */
    .slide { position: absolute; inset: 0; transition: opacity 1s ease; }
    
    /* Admin stat card */
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--subtle);
      border-radius: var(--radius);
      padding: 24px;
    }
    
    /* Scrollable horizontal */
    .scroll-x { overflow-x: auto; scrollbar-width: none; }
    .scroll-x::-webkit-scrollbar { display: none; }
    
    /* Image placeholder art */
    .img-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cormorant Garamond', serif;
      font-size: 11px;
      letter-spacing: 3px;
      color: rgba(255,255,255,0.2);
      text-transform: uppercase;
    }
    
    /* Backdrop */
    .backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 200;
    }
    
    /* Progress bar */
    .progress-bar {
      height: 2px;
      background: var(--gold);
      border-radius: 1px;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `}</style>
);

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const CURRENCIES = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.00063 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.00050 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.00057 },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", rate: 0.0097 },
];

const COLORS = [
  { name: "Obsidian", hex: "#1a1a1a" },
  { name: "Ivory", hex: "#F5F0E8" },
  { name: "Sahara", hex: "#C9A96E" },
  { name: "Forest", hex: "#3D5A47" },
  { name: "Crimson", hex: "#8B2035" },
  { name: "Slate", hex: "#4A5568" },
];

const PRODUCTS = [
  { id: 1, name: "AGBADA WIDE-LEG TROUSERS", category: "pants", price: 85000, description: "Crafted from premium woven cotton-linen blend inspired by traditional Agbada fabric. Wide-leg silhouette with deep side pockets and a refined high-rise waist. Elevated Nigerian craftsmanship for the modern wardrobe.", images: ["p1a", "p1b", "p1c"], colors: ["Obsidian", "Ivory", "Sahara"], sizes: { S: 3, M: 0, L: 5, XL: 2, XXL: 0 } },
  { id: 2, name: "ADIRE TAILORED JOGGERS", category: "pants", price: 65000, description: "Adire-inspired joggers with hand-dyed indigo patterns on structured fleece. A perfect marriage of Yoruba textile tradition and contemporary streetwear.", images: ["p2a", "p2b"], colors: ["Forest", "Obsidian"], sizes: { S: 4, M: 7, L: 3, XL: 0, XXL: 2 } },
  { id: 3, name: "OKÈ-ARÒ CARGO PANTS", category: "pants", price: 72000, description: "Six-pocket utility pants in heavyweight canvas with contrast stitching. Cut for ease of movement with tapered ankle and adjustable waist tie.", images: ["p3a", "p3b", "p3c"], colors: ["Slate", "Sahara", "Obsidian"], sizes: { S: 0, M: 2, L: 0, XL: 4, XXL: 1 } },
  { id: 4, name: "SENATORIAL LINEN SHIRT", category: "shirts", price: 58000, description: "Single-origin Aso-oke woven linen in a relaxed boxy cut. Mandarin collar with mother-of-pearl buttons and subtle tonal embroidery at the chest pocket.", images: ["p4a", "p4b"], colors: ["Ivory", "Sahara", "Crimson"], sizes: { S: 6, M: 4, L: 2, XL: 3, XXL: 1 } },
  { id: 5, name: "VØLAN LONGSLEEVE", category: "shirts", price: 48000, description: "Premium heavyweight jersey in our signature Vølan weave. Dropped shoulders with ribbed cuffs and a curved hem. The essential Lagos wardrobe staple.", images: ["p5a", "p5b", "p5c"], colors: ["Obsidian", "Crimson", "Slate", "Forest"], sizes: { S: 8, M: 10, L: 6, XL: 4, XXL: 3 } },
  { id: 6, name: "OWAMBE SILK SHIRT", category: "shirts", price: 95000, description: "Pure silk charmeuse in celebratory jewel tones. Fluid drape, notch collar and a relaxed open front. Handwashed and softened for immediate luxury.", images: ["p6a", "p6b"], colors: ["Crimson", "Sahara", "Obsidian"], sizes: { S: 2, M: 3, L: 0, XL: 1, XXL: 0 } },
  { id: 7, name: "HARMATTAN OVERSIZED HOODIE", category: "hoodies", price: 78000, description: "400gsm brushed fleece in a generous oversized silhouette. Inspired by the dry Harmattan season — heavy, enveloping, warm. Features a kangaroo pocket with concealed zip.", images: ["p7a", "p7b", "p7c"], colors: ["Obsidian", "Sahara", "Ivory"], sizes: { S: 5, M: 8, L: 6, XL: 3, XXL: 4 } },
  { id: 8, name: "LAGOS NOIR PULLOVER", category: "hoodies", price: 68000, description: "Street-ready pullover in double-faced neoprene. Subtle tonal branding at the chest, split hem and premium YKK half-zip closure.", images: ["p8a", "p8b"], colors: ["Obsidian", "Forest", "Slate"], sizes: { S: 3, M: 5, L: 4, XL: 2, XXL: 0 } },
  { id: 9, name: "VICTORIA ISLAND SHERPA", category: "hoodies", price: 112000, description: "Sherpa-lined zip hoodie with a heavyweight shell and ultra-plush interior. Oversized fit with dropped cuffs. Limited run — once sold out, it's gone.", images: ["p9a", "p9b", "p9c"], colors: ["Ivory", "Sahara"], sizes: { S: 1, M: 2, L: 0, XL: 1, XXL: 0 } },
];

const SLIDE_GRADIENTS = [
  "linear-gradient(135deg, #1a1a0e 0%, #3D2B1F 40%, #8B5E3C 100%)",
  "linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #2d6a8e 100%)",
  "linear-gradient(135deg, #1a0a0a 0%, #3D1515 40%, #7a2d2d 100%)",
  "linear-gradient(135deg, #0a1a0a 0%, #1a3d1a 40%, #2d5a2d 100%)",
];

const SLIDE_TEXTS = ["NEW SEASON", "COLLECTIONS 2025", "MADE IN LAGOS", "WEAR YOUR ROOTS"];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT — Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

const SHIPPING_TIERS = {
  Lagos: 5000,
  "Ogun": 7000, "Oyo": 7000, "Osun": 7000, "Ondo": 7000, "Ekiti": 7000,
  "Rivers": 8000, "Edo": 8000, "Delta": 8000, "Bayelsa": 8500, "Akwa Ibom": 8500, "Cross River": 8500,
  default: 9000
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmtPrice = (naira, currency) => {
  const converted = naira * currency.rate;
  if (currency.code === "NGN") return `${currency.symbol}${converted.toLocaleString("en-NG")}`;
  return `${currency.symbol}${converted.toFixed(2)}`;
};

const getShipping = (state) => SHIPPING_TIERS[state] || SHIPPING_TIERS.default;

const isAllSoldOut = (sizes) => Object.values(sizes).every(s => s === 0);

const PlaceholderImage = ({ id, height = "100%", gradient, label = "" }) => {
  const gradients = {
    p1a: "linear-gradient(160deg, #2a2018 0%, #5c4020 100%)",
    p1b: "linear-gradient(160deg, #1a1a1a 0%, #3d3020 100%)",
    p1c: "linear-gradient(160deg, #2a1810 0%, #4d2a10 100%)",
    p2a: "linear-gradient(160deg, #0a1a2a 0%, #1a3a5a 100%)",
    p2b: "linear-gradient(160deg, #0a0a0a 0%, #1a2a1a 100%)",
    p3a: "linear-gradient(160deg, #1a1a2a 0%, #2a2a4a 100%)",
    p3b: "linear-gradient(160deg, #2a1a0a 0%, #5a3a1a 100%)",
    p3c: "linear-gradient(160deg, #0a0a0a 0%, #2a2a2a 100%)",
    p4a: "linear-gradient(160deg, #2a2010 0%, #6a5020 100%)",
    p4b: "linear-gradient(160deg, #1a0a0a 0%, #4a1a1a 100%)",
    p5a: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 100%)",
    p5b: "linear-gradient(160deg, #2a0a0a 0%, #5a1a1a 100%)",
    p5c: "linear-gradient(160deg, #1a1a2a 0%, #2a2a4a 100%)",
    p6a: "linear-gradient(160deg, #3a1a1a 0%, #7a2a2a 100%)",
    p6b: "linear-gradient(160deg, #2a1a0a 0%, #6a4a0a 100%)",
    p7a: "linear-gradient(160deg, #0a0a0a 0%, #2a2a2a 100%)",
    p7b: "linear-gradient(160deg, #2a1a0a 0%, #4a3a1a 100%)",
    p7c: "linear-gradient(160deg, #1a1a0a 0%, #3a3a1a 100%)",
    p8a: "linear-gradient(160deg, #0a0a0a 0%, #1a1a2a 100%)",
    p8b: "linear-gradient(160deg, #0a1a0a 0%, #1a3a1a 100%)",
    p9a: "linear-gradient(160deg, #2a2a1a 0%, #5a5a2a 100%)",
    p9b: "linear-gradient(160deg, #2a1a0a 0%, #5a3a1a 100%)",
    p9c: "linear-gradient(160deg, #1a1a1a 0%, #3a3a3a 100%)",
  };
  return (
    <div style={{ background: gradient || gradients[id] || "linear-gradient(160deg, #111 0%, #222 100%)", width: "100%", height }}>
      <div className="img-placeholder">{label || "VØLAN"}</div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ENTRY SCREEN
// ─────────────────────────────────────────────
const EntryScreen = ({ onEnter }) => {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDE_GRADIENTS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleEnter = () => {
    setFading(true);
    setTimeout(onEnter, 800);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", opacity: fading ? 0 : 1, transition: "opacity 0.8s ease", zIndex: 1000 }}>
      {SLIDE_GRADIENTS.map((grad, i) => (
        <div key={i} className="slide" style={{ background: grad, opacity: i === current ? 1 : 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)" }} />
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", textAlign: "center", opacity: i === current ? 1 : 0, transition: "opacity 1s ease" }}>
            <div className="serif" style={{ fontSize: "clamp(48px, 10vw, 100px)", fontWeight: 300, color: "rgba(255,255,255,0.08)", letterSpacing: "0.3em", whiteSpace: "nowrap" }}>
              {SLIDE_TEXTS[i]}
            </div>
          </div>
        </div>
      ))}
      
      {/* Overlay */}
      <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />
      
      {/* Grain texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")", opacity: 0.4 }} />
      
      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }} className="fade-in">
        <div style={{ textAlign: "center" }}>
          <div className="serif" style={{ fontSize: "clamp(14px, 2vw, 18px)", letterSpacing: "8px", color: "var(--gold)", fontWeight: 300, marginBottom: 16, textTransform: "uppercase" }}>
            Lagos · Nigeria
          </div>
          <div className="serif" style={{ fontSize: "clamp(56px, 12vw, 140px)", fontWeight: 300, letterSpacing: "0.12em", color: "var(--text)", lineHeight: 0.9, textTransform: "uppercase" }}>
            VØLAN
          </div>
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "var(--muted)", marginTop: 16, textTransform: "uppercase" }}>
            Collective
          </div>
        </div>
        
        {/* Slide indicators */}
        <div style={{ display: "flex", gap: 8 }}>
          {SLIDE_GRADIENTS.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 32 : 8, height: 2, background: i === current ? "var(--gold)" : "rgba(255,255,255,0.3)", borderRadius: 1, transition: "all 0.4s ease", cursor: "pointer" }} />
          ))}
        </div>
        
        <button className="btn-primary" onClick={handleEnter} style={{ marginTop: 16, fontSize: "11px", letterSpacing: "3px" }}>
          Enter Our World
        </button>
      </div>
      
      {/* Bottom tagline */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
          Fly Above The System
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
const Navbar = ({ cartCount, setPage, page, setCartOpen }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="desktop-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", background: scrolled ? "rgba(8,8,8,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--subtle)" : "1px solid transparent", transition: "all 0.4s ease" }}>
        <button onClick={() => setPage("shop")} className="btn-icon" style={{ padding: 0 }}>
          <span className="serif" style={{ fontSize: "22px", fontWeight: 300, letterSpacing: "6px", color: "var(--text)" }}>VØLAN</span>
        </button>
        
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {["shop", "pants", "shirts", "hoodies"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", color: page === p ? "var(--gold)" : "var(--muted)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, padding: "8px 16px", transition: "color 0.2s ease" }}>
              {p}
            </button>
          ))}
        </div>
        
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button className="btn-icon" onClick={() => setPage("account")}><User size={18} /></button>
          <button className="btn-icon" style={{ position: "relative" }} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, background: "var(--gold)", borderRadius: "50%", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{cartCount}</span>}
          </button>
        </div>
      </nav>
      
      {/* Mobile Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: scrolled ? "rgba(8,8,8,0.95)" : "transparent", backdropFilter: "blur(20px)", transition: "all 0.4s ease" }} className="mobile-only">
        <span className="serif" style={{ fontSize: "20px", fontWeight: 300, letterSpacing: "5px" }}>VØLAN</span>
        <button className="btn-icon" style={{ position: "relative" }} onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, background: "var(--gold)", borderRadius: "50%", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{cartCount}</span>}
        </button>
      </nav>
      
      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, height: 64, background: "rgba(17,17,17,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--subtle)", display: "none", alignItems: "center", justifyContent: "space-around", padding: "0 16px" }}>
        {[
          { icon: Home, label: "Home", p: "shop" },
          { icon: Grid, label: "Browse", p: "pants" },
          { icon: ShoppingBag, label: "Cart", p: null, onClick: () => setCartOpen(true), badge: cartCount },
          { icon: User, label: "Account", p: "account" },
        ].map(({ icon: Icon, label, p, onClick, badge }) => (
          <button key={label} onClick={onClick || (() => setPage(p))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: page === p ? "var(--gold)" : "var(--muted)", position: "relative" }}>
            <Icon size={22} />
            {badge > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, background: "var(--gold)", borderRadius: "50%", fontSize: "8px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{badge}</span>}
            <span style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

// ─────────────────────────────────────────────
// CURRENCY SWITCHER
// ─────────────────────────────────────────────
const CurrencySwitcher = ({ currency, setCurrency }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", bottom: 80, left: 20, zIndex: 150 }} className="desktop-only">
      {open && (
        <div className="card slide-up" style={{ position: "absolute", bottom: "100%", marginBottom: 8, width: 200, overflow: "hidden" }}>
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => { setCurrency(c); setOpen(false); }} style={{ width: "100%", background: currency.code === c.code ? "rgba(201,169,110,0.1)" : "transparent", border: "none", borderBottom: "1px solid var(--subtle)", padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text)", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", transition: "background 0.2s" }}>
              <span>{c.symbol} {c.code}</span>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>{c.name.split(" ").slice(-1)[0]}</span>
              {currency.code === c.code && <Check size={14} style={{ color: "var(--gold)" }} />}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ background: "var(--surface)", border: "1px solid var(--subtle)", borderRadius: 100, padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "var(--gold)", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
        {currency.symbol} {currency.code}
        <ChevronRight size={14} style={{ transform: open ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────
const ProductCard = ({ product, onClick, currency }) => {
  const soldOut = isAllSoldOut(product.sizes);

  return (
    <div className="product-card" onClick={onClick} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--surface2)" }}>
        <PlaceholderImage id={product.images[0]} />
        {soldOut && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="tag" style={{ background: "rgba(224,92,92,0.2)", border: "1px solid var(--red)", color: "var(--red)" }}>Sold Out</span>
          </div>
        )}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span className="tag" style={{ background: "rgba(201,169,110,0.15)", color: "var(--gold)", fontSize: "9px" }}>{product.category}</span>
        </div>
      </div>
      <div style={{ padding: "14px 4px 8px" }}>
        <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 4 }}>{product.name}</div>
        {soldOut
          ? <div style={{ fontSize: "12px", color: "var(--red)", fontWeight: 500 }}>Sold Out</div>
          : <div style={{ fontSize: "14px", color: "var(--gold)", fontWeight: 500 }}>{fmtPrice(product.price, currency)}</div>
        }
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// SHOP PAGE
// ─────────────────────────────────────────────
const ShopPage = ({ setPage, setSelectedProduct, currency, category }) => {
  const filtered = category ? PRODUCTS.filter(p => p.category === category) : PRODUCTS;

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", padding: "80px 40px 100px" }} className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 48, paddingTop: 24 }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: "var(--muted)", textTransform: "uppercase", marginBottom: 12 }}>
          {category ? `Shop / ${category}` : "Collections"}
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300, letterSpacing: "0.05em", lineHeight: 1 }}>
          {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Collections"}
        </h1>
        <p style={{ marginTop: 12, fontSize: "14px", color: "var(--muted)", maxWidth: 400 }}>
          {category === "pants" && "Elevated trousers for the modern Lagos man and woman. Locally crafted."}
          {category === "shirts" && "Shirts that carry the spirit of Nigerian craftsmanship. Worn with pride."}
          {category === "hoodies" && "Heavyweight luxury fleece. Built for Lagos nights and beyond."}
          {!category && "A curated selection of premium fashion for the discerning wardrobe."}
        </p>
      </div>
      
      {/* Category pills */}
      <div className="scroll-x" style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {["all", "pants", "shirts", "hoodies"].map(cat => (
          <button key={cat} onClick={() => setPage(cat === "all" ? "shop" : cat)} className={category === cat || (!category && cat === "all") ? "btn-primary" : "btn-ghost"} style={{ whiteSpace: "nowrap", padding: "10px 20px", fontSize: "11px" }}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
        {filtered.map((product, i) => (
          <div key={product.id} style={{ animationDelay: `${i * 0.06}s` }} className="slide-up">
            <ProductCard product={product} onClick={() => { setSelectedProduct(product); setPage("product"); }} currency={currency} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PRODUCT PAGE
// ─────────────────────────────────────────────
const ProductPage = ({ product, onBack, addToCart, currency }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const soldOut = isAllSoldOut(product.sizes);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart({ product, size: selectedSize, color: selectedColor, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const colors = COLORS.filter(c => product.colors.includes(c.name));

  return (
    <div style={{ paddingTop: 80, minHeight: "100vh" }} className="fade-in">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px 120px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
        
        {/* Images */}
        <div>
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "3/4", background: "var(--surface2)", marginBottom: 12 }}>
            <PlaceholderImage id={product.images[imgIdx]} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {product.images.map((img, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ width: 72, aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${imgIdx === i ? "var(--gold)" : "transparent"}`, opacity: imgIdx === i ? 1 : 0.6, transition: "all 0.2s" }}>
                <PlaceholderImage id={img} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
              <ChevronLeft size={14} /> Back
            </button>
            <div className="tag" style={{ background: "rgba(201,169,110,0.15)", color: "var(--gold)", marginBottom: 12 }}>{product.category}</div>
            <h1 className="serif" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, letterSpacing: "0.05em", lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>
            {soldOut
              ? <div style={{ fontSize: "16px", color: "var(--red)", fontWeight: 600 }}>Sold Out</div>
              : <div style={{ fontSize: "28px", color: "var(--gold)", fontWeight: 400, fontFamily: "'Cormorant Garamond', serif" }}>{fmtPrice(product.price, currency)}</div>
            }
          </div>
          
          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--muted)" }}>{product.description}</p>
          
          <div className="divider" />
          
          {/* Color */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
              Colour{selectedColor ? <span style={{ color: "var(--text)" }}> — {selectedColor}</span> : ""}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {colors.map(c => (
                <div key={c.name} title={c.name} className={`color-swatch ${selectedColor === c.name ? "selected" : ""}`} onClick={() => setSelectedColor(c.name)} style={{ background: c.hex, outline: c.hex === "#F5F0E8" ? "1px solid rgba(255,255,255,0.2)" : "none" }} />
              ))}
            </div>
          </div>
          
          {/* Size */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Size</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(product.sizes).map(([size, stock]) => (
                <button key={size} className={`size-chip ${selectedSize === size ? "selected" : ""} ${stock === 0 ? "disabled" : ""}`} onClick={() => stock > 0 && setSelectedSize(size)}>
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && product.sizes[selectedSize] <= 3 && product.sizes[selectedSize] > 0 && (
              <div style={{ fontSize: "12px", color: "#E0A04A", marginTop: 8 }}>Only {product.sizes[selectedSize]} left in {selectedSize}</div>
            )}
          </div>
          
          {!soldOut && (
            <button className="btn-primary" onClick={handleAdd} disabled={!selectedSize || !selectedColor} style={{ opacity: !selectedSize || !selectedColor ? 0.5 : 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {added ? <><Check size={14} /> Added to Bag</> : <><ShoppingBag size={14} /> Add to Bag</>}
            </button>
          )}
          
          <div className="divider" />
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Free returns within 14 days", "Express delivery across Nigeria", "Authentic craftsmanship guaranteed"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "13px", color: "var(--muted)" }}>
                <Check size={14} style={{ color: "var(--gold)" }} /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────
const CartDrawer = ({ cart, setCart, currency, onClose, onCheckout, isMobile }) => {
  const subtotal = cart.reduce((s, item) => s + item.product.price * item.qty, 0);

  const updateQty = (idx, delta) => {
    setCart(c => c.map((item, i) => i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  const remove = (idx) => setCart(c => c.filter((_, i) => i !== idx));

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className={isMobile ? "cart-drawer-mobile" : "cart-drawer-desktop"} style={{ position: "fixed", [isMobile ? "bottom" : "right"]: 0, [isMobile ? "left" : "top"]: 0, [isMobile ? "right" : "bottom"]: 0, width: isMobile ? "100%" : 400, height: isMobile ? "85vh" : "100vh", background: "var(--surface)", borderRadius: isMobile ? "var(--radius) var(--radius) 0 0" : 0, borderLeft: isMobile ? "none" : "1px solid var(--subtle)", borderTop: isMobile ? "1px solid var(--subtle)" : "none", zIndex: 300, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="serif" style={{ fontSize: "22px", fontWeight: 400 }}>Your Bag</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: 2 }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        
        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, color: "var(--muted)" }}>
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: "14px" }}>Your bag is empty</div>
            </div>
          ) : cart.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: "1px solid var(--subtle)" }}>
              <div style={{ width: 80, flexShrink: 0, aspectRatio: "3/4", borderRadius: 8, overflow: "hidden", background: "var(--surface2)" }}>
                <PlaceholderImage id={item.product.images[0]} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>{item.product.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>{item.size} · {item.color}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface2)", borderRadius: 8, padding: "4px 12px" }}>
                    <button className="btn-icon" style={{ padding: 2 }} onClick={() => updateQty(i, -1)}><Minus size={12} /></button>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{item.qty}</span>
                    <button className="btn-icon" style={{ padding: 2 }} onClick={() => updateQty(i, 1)}><Plus size={12} /></button>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)" }}>{fmtPrice(item.product.price * item.qty, currency)}</div>
                    <button onClick={() => remove(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "10px", color: "var(--muted)", marginTop: 4 }}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid var(--subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Subtotal</span>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--gold)" }}>{fmtPrice(subtotal, currency)}</span>
            </div>
            <p style={{ fontSize: "11px", color: "var(--muted)", marginBottom: 16, lineHeight: 1.5 }}>Shipping calculated at checkout</p>
            <button className="btn-primary" style={{ width: "100%" }} onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// CHECKOUT PAGE
// ─────────────────────────────────────────────
const CheckoutPage = ({ cart, currency, onBack, onSuccess }) => {
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", phone: "", address: "", city: "", state: "Lagos", zip: "" });
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((s, item) => s + item.product.price * item.qty, 0);
  const shipping = getShipping(form.state);
  const total = subtotal + shipping;

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onSuccess(); }, 3000);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "80px 0 120px", background: "var(--bg)" }} className="fade-in">
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "1fr 400px", gap: 60 }}>
        
        {/* Left */}
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
            <ChevronLeft size={14} /> Back to Bag
          </button>
          
          <div className="serif" style={{ fontSize: "32px", fontWeight: 300, marginBottom: 8 }}>Checkout</div>
          
          {/* Progress */}
          <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
            {["Contact", "Delivery", "Payment"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--gold)" : "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: step >= i + 1 ? "#000" : "var(--muted)" }}>
                  {step > i + 1 ? <Check size={12} /> : i + 1}
                </div>
                <span style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: step === i + 1 ? "var(--text)" : "var(--muted)" }}>{s}</span>
                {i < 2 && <ChevronRight size={14} style={{ color: "var(--subtle)" }} />}
              </div>
            ))}
          </div>
          
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="slide-up">
              <h3 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Contact Information</h3>
              <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={set("email")} />
              <input className="input-field" placeholder="Phone number" type="tel" value={form.phone} onChange={set("phone")} />
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => setStep(2)}>Continue to Delivery</button>
            </div>
          )}
          
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="slide-up">
              <h3 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Delivery Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input className="input-field" placeholder="First name" value={form.firstName} onChange={set("firstName")} />
                <input className="input-field" placeholder="Last name" value={form.lastName} onChange={set("lastName")} />
              </div>
              <input className="input-field" placeholder="Street address" value={form.address} onChange={set("address")} />
              <input className="input-field" placeholder="City" value={form.city} onChange={set("city")} />
              <select className="input-field" value={form.state} onChange={set("state")}>
                {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
              
              {/* Shipping method */}
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Shipping Method</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--gold)", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#000" }} /></div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 500 }}>Standard Delivery (3–5 days)</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>Nationwide — {form.state}</div>
                    </div>
                  </div>
                  <div style={{ color: "var(--gold)", fontWeight: 600 }}>{fmtPrice(shipping, currency)}</div>
                </div>
              </div>
              
              <button className="btn-primary" style={{ width: "100%" }} onClick={() => setStep(3)}>Continue to Payment</button>
            </div>
          )}
          
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="slide-up">
              <h3 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Payment</h3>
              
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["Paystack", "Visa", "Mastercard"].map(m => (
                    <div key={m} className="tag" style={{ background: "var(--surface3)", border: "1px solid var(--subtle)", fontSize: "10px" }}>{m}</div>
                  ))}
                </div>
                <input className="input-field" placeholder="Card number" style={{ marginBottom: 12 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input className="input-field" placeholder="MM / YY" />
                  <input className="input-field" placeholder="CVV" />
                </div>
              </div>
              
              <div style={{ background: "rgba(92,171,125,0.1)", border: "1px solid rgba(92,171,125,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: "12px", color: "var(--green)", display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={14} /> Secured by Paystack — PCI DSS Compliant
              </div>
              
              <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={handlePay} disabled={processing}>
                {processing ? <><div style={{ width: 14, height: 14, border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing...</> : `Pay ${fmtPrice(total, currency)}`}
              </button>
            </div>
          )}
        </div>
        
        {/* Right — Order Summary */}
        <div>
          <div className="card" style={{ padding: 24, position: "sticky", top: 80 }}>
            <div style={{ fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Order Summary</div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 56, height: 72, borderRadius: 8, overflow: "hidden", background: "var(--surface2)" }}><PlaceholderImage id={item.product.images[0]} /></div>
                    <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "var(--gold)", borderRadius: "50%", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{item.qty}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{item.product.name}</div>
                    <div style={{ fontSize: "10px", color: "var(--muted)" }}>{item.size} · {item.color}</div>
                    <div style={{ fontSize: "13px", color: "var(--gold)", marginTop: 4 }}>{fmtPrice(item.product.price * item.qty, currency)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="divider" style={{ marginBottom: 16 }} />
            
            {[["Subtotal", fmtPrice(subtotal, currency)], ["Shipping", fmtPrice(shipping, currency)], ["Total", fmtPrice(total, currency)]].map(([label, val], i) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: i === 2 ? "14px" : "13px", color: i === 2 ? "var(--text)" : "var(--muted)", fontWeight: i === 2 ? 600 : 400 }}>{label}</span>
                <span style={{ fontSize: i === 2 ? "16px" : "13px", color: i === 2 ? "var(--gold)" : "var(--text)", fontWeight: i === 2 ? 600 : 400 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ORDER SUCCESS
// ─────────────────────────────────────────────
const OrderSuccess = ({ onContinue }) => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }} className="fade-in">
    <div style={{ textAlign: "center", maxWidth: 480 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(92,171,125,0.15)", border: "2px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <Check size={32} style={{ color: "var(--green)" }} />
      </div>
      <div className="serif" style={{ fontSize: "40px", fontWeight: 300, marginBottom: 12 }}>Order Confirmed</div>
      <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: 32 }}>
        Thank you for your order. You'll receive a confirmation email shortly. Your order will be dispatched within 1–2 business days.
      </p>
      <div style={{ background: "var(--surface2)", border: "1px solid var(--subtle)", borderRadius: 8, padding: "12px 20px", display: "inline-block", marginBottom: 32 }}>
        <span style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase" }}>Order </span>
        <span style={{ color: "var(--gold)", fontWeight: 700 }}>#ASO-{Math.floor(10000 + Math.random() * 90000)}</span>
      </div>
      <br />
      <button className="btn-primary" onClick={onContinue}>Continue Shopping</button>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// ACCOUNT PAGE
// ─────────────────────────────────────────────
const AccountPage = () => {
  const [tab, setTab] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) return (
    <div style={{ minHeight: "100vh", padding: "100px 40px 120px", maxWidth: 600, margin: "0 auto" }} className="fade-in">
      <div className="serif" style={{ fontSize: "36px", fontWeight: 300, marginBottom: 32 }}>My Account</div>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Profile</div>
        <div style={{ fontSize: "16px", fontWeight: 500 }}>Adaeze Johnson</div>
        <div style={{ fontSize: "13px", color: "var(--muted)" }}>adaeze@example.com · Lagos, Nigeria</div>
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Recent Orders</div>
        {[{ id: "ASO-48291", date: "Jan 22, 2025", status: "Delivered", total: "₦85,000" }, { id: "ASO-47100", date: "Dec 15, 2024", status: "Delivered", total: "₦148,000" }].map(o => (
          <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--subtle)" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)" }}>{o.id}</div>
              <div style={{ fontSize: "11px", color: "var(--muted)" }}>{o.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>{o.total}</div>
              <div style={{ fontSize: "11px", color: "var(--green)" }}>{o.status}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-ghost" onClick={() => setLoggedIn(false)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <LogOut size={14} /> Log Out
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }} className="fade-in">
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="serif" style={{ fontSize: "36px", fontWeight: 300, textAlign: "center", marginBottom: 8 }}>VØLAN Account</div>
        <div style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", marginBottom: 32 }}>Your fashion passport</div>
        
        <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 100, padding: 4, marginBottom: 32 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px", borderRadius: 100, border: "none", cursor: "pointer", background: tab === t ? "var(--gold)" : "transparent", color: tab === t ? "#000" : "var(--muted)", fontSize: "12px", fontFamily: "'DM Sans'", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.3s ease" }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "register" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input className="input-field" placeholder="First name" />
              <input className="input-field" placeholder="Last name" />
            </div>
          )}
          <input className="input-field" placeholder="Email address" type="email" />
          <input className="input-field" placeholder="Password" type="password" />
          {tab === "register" && <input className="input-field" placeholder="Confirm password" type="password" />}
          <button className="btn-primary" style={{ width: "100%" }} onClick={() => setLoggedIn(true)}>
            {tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────
const AdminPanel = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    if (!loggedIn) return;
    const t = setTimeout(() => {
      setNotif({ name: "VØLAN LONGSLEEVE", size: "L", color: "Obsidian", price: "₦48,000" });
      setTimeout(() => setNotif(null), 5000);
    }, 2000);
    return () => clearTimeout(t);
  }, [loggedIn]);

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }} className="fade-in">
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        <div style={{ fontSize: "10px", letterSpacing: "6px", color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>Restricted Area</div>
        <div className="serif" style={{ fontSize: "32px", fontWeight: 300, marginBottom: 32 }}>Admin Access</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input className="input-field" type="password" placeholder="Admin password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false); }} style={{ borderColor: pwError ? "var(--red)" : undefined }} onKeyDown={e => e.key === "Enter" && (pw === "admin123" ? setLoggedIn(true) : setPwError(true))} />
          {pwError && <div style={{ fontSize: "12px", color: "var(--red)" }}>Incorrect password</div>}
          <button className="btn-primary" onClick={() => pw === "admin123" ? setLoggedIn(true) : setPwError(true)}>Enter Dashboard</button>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Demo password: admin123</div>
        </div>
      </div>
    </div>
  );

  const stats = [
    { label: "Total Revenue", value: "₦12,480,000", sub: "+18% this month", icon: TrendingUp },
    { label: "Orders (Month)", value: "247", sub: "₦3,200,000 revenue", icon: Package },
    { label: "Active Visitors", value: "38", sub: "6 in checkout", icon: Users },
    { label: "Best Seller", value: "Harmattan Hoodie", sub: "94 units sold", icon: BarChart2 },
  ];

  const orders = [
    { id: "ASO-48301", customer: "Amaka Osei", items: "Harmattan Hoodie (M, Obsidian) ×1", total: "₦83,000", status: "Paid", date: "Today, 11:32am" },
    { id: "ASO-48300", customer: "Emeka Nwosu", items: "Senatorial Shirt (L, Ivory) ×2", total: "₦116,000", status: "Paid", date: "Today, 10:14am" },
    { id: "ASO-48298", customer: "Fatima Abdullahi", items: "Adire Joggers (S, Forest) ×1", total: "₦70,000", status: "Processing", date: "Today, 9:02am" },
    { id: "ASO-48295", customer: "Chukwudi Eze", items: "V.I. Sherpa (M, Ivory) ×1", total: "₦117,000", status: "Shipped", date: "Yesterday" },
    { id: "ASO-48289", customer: "Ngozi Williams", items: "Lagos Noir Pullover (L, Obsidian) ×1", total: "₦73,000", status: "Delivered", date: "Yesterday" },
  ];

  const statusColor = { Paid: "var(--green)", Processing: "#E0A04A", Shipped: "#5A9BE0", Delivered: "var(--muted)" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      
      {/* Live notification */}
      {notif && (
        <div className="notif-toast">
          <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)", marginBottom: 6 }}>🛍 New Order</div>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>{notif.name}</div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{notif.size}, {notif.color} — {notif.price}</div>
        </div>
      )}
      
      {/* Sidebar */}
      <div style={{ width: 240, background: "var(--surface)", borderRight: "1px solid var(--subtle)", display: "flex", flexDirection: "column", padding: "28px 0", flexShrink: 0 }} className="desktop-only">
        <div style={{ padding: "0 24px", marginBottom: 32 }}>
          <div className="serif" style={{ fontSize: "20px", letterSpacing: "4px" }}>VØLAN</div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", marginTop: 2 }}>Admin Panel</div>
        </div>
        
        {[
          { id: "dashboard", icon: BarChart2, label: "Dashboard" },
          { id: "orders", icon: Package, label: "Orders" },
          { id: "products", icon: Grid, label: "Products" },
          { id: "analytics", icon: TrendingUp, label: "Analytics" },
          { id: "settings", icon: Settings, label: "Settings" },
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{ width: "100%", background: tab === id ? "rgba(201,169,110,0.12)" : "transparent", border: "none", borderLeft: `2px solid ${tab === id ? "var(--gold)" : "transparent"}`, padding: "12px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: tab === id ? "var(--gold)" : "var(--muted)", fontFamily: "'DM Sans'", fontSize: "13px", fontWeight: tab === id ? 600 : 400, transition: "all 0.2s" }}>
            <Icon size={16} /> {label}
          </button>
        ))}
        
        <div style={{ marginTop: "auto", padding: "0 24px" }}>
          <button onClick={() => setLoggedIn(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'DM Sans'" }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
      
      {/* Main */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px 80px" }}>
        
        {tab === "dashboard" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <div className="serif" style={{ fontSize: "28px", fontWeight: 300 }}>Good morning, Admin 👋</div>
                <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: 4 }}>Here's what's happening today.</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(92,171,125,0.1)", border: "1px solid rgba(92,171,125,0.3)", borderRadius: 100, padding: "6px 14px" }}>
                <div className="live-dot" /> <span style={{ fontSize: "11px", color: "var(--green)", letterSpacing: "1px" }}>LIVE</span>
              </div>
            </div>
            
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
              {stats.map(({ label, value, sub, icon: Icon }) => (
                <div key={label} className="stat-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)" }}>{label}</div>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={16} style={{ color: "var(--gold)" }} />
                    </div>
                  </div>
                  <div className="serif" style={{ fontSize: "28px", fontWeight: 400, marginBottom: 4 }}>{value}</div>
                  <div style={{ fontSize: "12px", color: "var(--green)" }}>{sub}</div>
                </div>
              ))}
            </div>
            
            {/* Live users */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[{ label: "On Site", val: 38 }, { label: "In Cart", val: 12 }, { label: "Checkout", val: 6 }, { label: "Orders/hr", val: 4 }].map(({ label, val }) => (
                <div key={label} className="card" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</span>
                  <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--gold)" }}>{val}</span>
                </div>
              ))}
            </div>
            
            {/* Recent orders */}
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Recent Orders</div>
              <div className="card" style={{ overflow: "hidden" }}>
                {orders.slice(0, 3).map((o, i) => (
                  <div key={o.id} style={{ padding: "16px 20px", borderBottom: i < 2 ? "1px solid var(--subtle)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)" }}>{o.id}</span>
                        <span className="tag" style={{ background: `${statusColor[o.status]}22`, color: statusColor[o.status], fontSize: "9px" }}>{o.status}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--muted)" }}>{o.customer} · {o.items}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{o.total}</div>
                      <div style={{ fontSize: "11px", color: "var(--muted)" }}>{o.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {tab === "orders" && (
          <div className="fade-in">
            <div className="serif" style={{ fontSize: "28px", fontWeight: 300, marginBottom: 32 }}>Order Management</div>
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2fr 0.8fr 0.8fr 1fr", padding: "12px 20px", borderBottom: "1px solid var(--subtle)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)" }}>
                <span>Order</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span><span>Date</span>
              </div>
              {orders.map((o, i) => (
                <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 2fr 0.8fr 0.8fr 1fr", padding: "16px 20px", borderBottom: i < orders.length - 1 ? "1px solid var(--subtle)" : "none", fontSize: "13px", alignItems: "center" }}>
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>{o.id}</span>
                  <span>{o.customer}</span>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>{o.items}</span>
                  <span style={{ fontWeight: 600 }}>{o.total}</span>
                  <span className="tag" style={{ background: `${statusColor[o.status]}22`, color: statusColor[o.status], fontSize: "9px", textAlign: "center" }}>{o.status}</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>{o.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tab === "products" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div className="serif" style={{ fontSize: "28px", fontWeight: 300 }}>Products</div>
              <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}><Plus size={14} /> Add Product</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {PRODUCTS.map(p => (
                <div key={p.id} className="card" style={{ overflow: "hidden" }}>
                  <div style={{ aspectRatio: "3/2", background: "var(--surface2)" }}><PlaceholderImage id={p.images[0]} /></div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--gold)", marginBottom: 8 }}>₦{p.price.toLocaleString()}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {Object.entries(p.sizes).map(([size, stock]) => (
                        <span key={size} className="tag" style={{ background: stock === 0 ? "rgba(224,92,92,0.1)" : "rgba(92,171,125,0.1)", color: stock === 0 ? "var(--red)" : "var(--green)", border: `1px solid ${stock === 0 ? "rgba(224,92,92,0.3)" : "rgba(92,171,125,0.3)"}`, fontSize: "9px" }}>
                          {size}: {stock}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button className="btn-ghost" style={{ flex: 1, padding: "8px", fontSize: "11px" }}>Edit</button>
                      <button className="btn-ghost" style={{ flex: 1, padding: "8px", fontSize: "11px", color: "var(--red)", borderColor: "var(--red)" }}>Archive</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tab === "analytics" && (
          <div className="fade-in">
            <div className="serif" style={{ fontSize: "28px", fontWeight: 300, marginBottom: 32 }}>Analytics Overview</div>
            <div className="card" style={{ padding: 32, marginBottom: 24 }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Revenue — Last 7 Days</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {[65, 80, 45, 90, 110, 75, 130].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: "100%", height: `${h}%`, background: `rgba(201,169,110,${0.3 + (h / 130) * 0.7})`, borderRadius: "4px 4px 0 0", transition: "height 0.5s ease" }} />
                    <span style={{ fontSize: "10px", color: "var(--muted)" }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Top Products</div>
                {[["Harmattan Hoodie", 94], ["Vølan Longsleeve", 78], ["Senatorial Shirt", 65], ["V.I. Sherpa", 42]].map(([name, units]) => (
                  <div key={name} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "12px" }}>{name}</span>
                      <span style={{ fontSize: "12px", color: "var(--gold)" }}>{units} units</span>
                    </div>
                    <div style={{ height: 4, background: "var(--surface3)", borderRadius: 2 }}>
                      <div style={{ height: "100%", width: `${(units / 94) * 100}%`, background: "var(--gold)", borderRadius: 2, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>Revenue by Period</div>
                {[["This Week", "₦842,000"], ["This Month", "₦3,200,000"], ["This Year", "₦12,480,000"]].map(([period, val]) => (
                  <div key={period} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--subtle)" }}>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>{period}</span>
                    <span className="serif" style={{ fontSize: "18px", color: "var(--gold)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {tab === "settings" && (
          <div className="fade-in" style={{ maxWidth: 560 }}>
            <div className="serif" style={{ fontSize: "28px", fontWeight: 300, marginBottom: 32 }}>Settings</div>
            {[
              { label: "Shipping — Lagos", val: "₦5,000" },
              { label: "Shipping — South West", val: "₦7,000" },
              { label: "Shipping — South South", val: "₦8,000" },
              { label: "Shipping — North", val: "₦9,000" },
            ].map(({ label, val }) => (
              <div key={label} className="card" style={{ padding: "16px 20px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</span>
                <input className="input-field" defaultValue={val} style={{ width: 120, textAlign: "right" }} />
              </div>
            ))}
            <button className="btn-primary" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}><Check size={14} /> Save Settings</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const addToCart = useCallback((item) => {
    setCart(c => {
      const idx = c.findIndex(i => i.product.id === item.product.id && i.size === item.size && i.color === item.color);
      if (idx >= 0) return c.map((ci, i) => i === idx ? { ...ci, qty: ci.qty + 1 } : ci);
      return [...c, item];
    });
    setCartOpen(true);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (!entered) return <><GlobalStyles /><EntryScreen onEnter={() => setEntered(true)} /></>;
  if (page === "admin") return <><GlobalStyles /><AdminPanel /></>;

  if (orderSuccess) return (
    <><GlobalStyles />
    <Navbar cartCount={0} setPage={setPage} page={page} setCartOpen={setCartOpen} />
    <OrderSuccess onContinue={() => { setOrderSuccess(false); setCart([]); setPage("shop"); }} /></>
  );

  return (
    <>
      <GlobalStyles />
      <Navbar cartCount={cartCount} setPage={(p) => { setPage(p); setSelectedProduct(null); }} page={page} setCartOpen={setCartOpen} />
      
      {/* Pages */}
      {page === "shop" && <ShopPage setPage={setPage} setSelectedProduct={setSelectedProduct} currency={currency} category={null} />}
      {page === "pants" && <ShopPage setPage={setPage} setSelectedProduct={setSelectedProduct} currency={currency} category="pants" />}
      {page === "shirts" && <ShopPage setPage={setPage} setSelectedProduct={setSelectedProduct} currency={currency} category="shirts" />}
      {page === "hoodies" && <ShopPage setPage={setPage} setSelectedProduct={setSelectedProduct} currency={currency} category="hoodies" />}
      {page === "product" && selectedProduct && <ProductPage product={selectedProduct} onBack={() => setPage("shop")} addToCart={addToCart} currency={currency} />}
      {page === "checkout" && <CheckoutPage cart={cart} currency={currency} onBack={() => setCartOpen(true)} onSuccess={() => setOrderSuccess(true)} />}
      {page === "account" && <AccountPage />}
      
      {/* Cart */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          setCart={setCart}
          currency={currency}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setPage("checkout"); }}
          isMobile={isMobile}
        />
      )}
      
      {/* Currency switcher */}
      <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
      
      {/* Admin hint */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50 }} className="desktop-only">
        <button onClick={() => setPage("admin")} style={{ background: "rgba(17,17,17,0.8)", border: "1px solid var(--subtle)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", fontFamily: "'DM Sans'", backdropFilter: "blur(10px)" }}>
          Admin ↗
        </button>
      </div>
    </>
  );
}
