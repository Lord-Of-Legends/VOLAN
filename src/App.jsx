import { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag, X, ChevronRight, ChevronLeft, User, Check,
  Package, TrendingUp, Users, LogOut, Plus, Minus, BarChart2,
  Settings, Home, Grid, ImagePlus, Trash2, Edit2, AlertTriangle,
  RotateCcw, Eye, EyeOff
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gjbmpghrlnozepdzeryk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYm1wZ2hybG5vemVwZHplcnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMDI3NjQsImV4cCI6MjA4Nzg3ODc2NH0.r38P1XVZck2p0vN3IezcA6_dDkKUPjWSA_LVEwBIgLg"
);

// ═══════════════════════════════════════════════════════════════
//  DATABASE LAYER  —  currently localStorage (zero setup needed)
//
//  BEST FREE OPTIONS FOR PRODUCTION:
//
//  1. SUPABASE ✅ (Recommended)
//     Free: 500MB DB, 1GB storage, 50k monthly active users
//     PostgreSQL — perfect for e-commerce, scales cleanly
//     Built-in REST API, real-time subs, auth, image storage
//     npm install @supabase/supabase-js
//     https://supabase.com
//
//     Swap in (15 mins):
//     import { createClient } from '@supabase/supabase-js'
//     const supabase = createClient('YOUR_URL', 'YOUR_ANON_KEY')
//     getProducts: async () => { const {data} = await supabase.from('products').select('*'); return data; }
//     saveProducts: async (arr) => { await supabase.from('products').upsert(arr); }
//
//  2. FIREBASE FIRESTORE
//     Free: 1GB, 50k reads/day — easy start, gets costly at scale
//     npm install firebase  |  https://firebase.google.com
//
//  3. MONGODB ATLAS
//     Free: 512MB shared — needs a Node.js backend layer
//     https://www.mongodb.com/atlas
// ═══════════════════════════════════════════════════════════════

const db = {
  getProducts: async () => {
    const { data, error } = await supabase.from("products").select("*").order("id");
    if (error) { console.error("Error loading products:", error); return null; }
    return data;
  },
  saveProduct: async (product) => {
    // Only send known plain-data fields — strips any React/DOM references
    const clean = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      images: Array.isArray(product.images) ? product.images : [],
      colors: Array.isArray(product.colors) ? product.colors : [],
      sizes: product.sizes || {},
      status: product.status || "published",
      archived: product.archived || false,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("products").upsert(clean);
    if (error) { console.error("Error saving product:", error); return false; }
    return true;
  },
  updateSizes: async (productId, sizes) => {
    const { error } = await supabase.from("products").update({ sizes, updated_at: new Date().toISOString() }).eq("id", productId);
    if (error) { console.error("Error updating sizes:", error); return false; }
    return true;
  },
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#080808;--surface:#111111;--surface2:#1a1a1a;--surface3:#222222;
      --gold:#C9A96E;--gold-light:#E8C98A;--text:#F0EBE1;--muted:#888880;
      --subtle:#333330;--red:#E05C5C;--green:#5CAB7D;--radius:14px;--radius-sm:8px;
    }
    html,body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;overflow-x:hidden}
    .serif{font-family:'Cormorant Garamond',serif}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--subtle);border-radius:2px}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
    @keyframes slideUpDrawer{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes notif{from{opacity:0;transform:translateX(120%)}to{opacity:1;transform:translateX(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    @keyframes modalIn{from{opacity:0;transform:scale(.96) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .fade-in{animation:fadeIn .6s ease forwards}
    .slide-up{animation:slideUp .6s cubic-bezier(.16,1,.3,1) forwards}
    .btn-primary{background:var(--gold);color:#000;border:none;padding:14px 32px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .3s cubic-bezier(.16,1,.3,1)}
    .btn-primary:hover{background:var(--gold-light);transform:translateY(-1px);box-shadow:0 8px 30px rgba(201,169,110,.35)}
    .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}
    .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--subtle);padding:12px 28px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .3s ease}
    .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
    .btn-danger{background:transparent;color:var(--red);border:1px solid rgba(224,92,92,.4);padding:10px 20px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .3s ease}
    .btn-danger:hover{background:rgba(224,92,92,.1);border-color:var(--red)}
    .btn-icon{background:none;border:none;cursor:pointer;color:var(--text);transition:all .2s ease;padding:8px;border-radius:50%}
    .btn-icon:hover{color:var(--gold);background:rgba(201,169,110,.1)}
    .input-field{width:100%;background:var(--surface2);border:1px solid var(--subtle);color:var(--text);padding:12px 14px;border-radius:var(--radius-sm);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s ease}
    .input-field:focus{border-color:var(--gold)}
    .input-field::placeholder{color:var(--muted)}
    textarea.input-field{resize:vertical;min-height:90px;line-height:1.6}
    select.input-field option{background:var(--surface2)}
    .card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--subtle)}
    .product-card{cursor:pointer;transition:transform .4s cubic-bezier(.16,1,.3,1)}
    .product-card:hover{transform:translateY(-6px)}
    .hero-overlay{background:linear-gradient(to bottom,rgba(0,0,0,.2) 0%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.85) 100%)}
    .size-chip{padding:8px 16px;border-radius:6px;border:1px solid var(--subtle);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s ease;background:transparent;color:var(--text)}
    .size-chip:hover:not(.disabled){border-color:var(--gold);color:var(--gold)}
    .size-chip.selected{background:var(--gold);color:#000;border-color:var(--gold);font-weight:600}
    .size-chip.disabled{opacity:.3;cursor:not-allowed;text-decoration:line-through}
    .color-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;transition:all .2s ease;border:2px solid transparent}
    .color-swatch.selected{border-color:var(--gold);transform:scale(1.2)}
    .notif-toast{animation:notif .5s cubic-bezier(.16,1,.3,1) forwards;position:fixed;top:20px;right:20px;z-index:9999;background:var(--surface2);border:1px solid var(--gold);border-radius:var(--radius-sm);padding:14px 18px;max-width:320px}
    .cart-drawer-desktop{animation:slideRight .4s cubic-bezier(.16,1,.3,1) forwards}
    .cart-drawer-mobile{animation:slideUpDrawer .4s cubic-bezier(.16,1,.3,1) forwards}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(8px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}
    .modal-box{background:var(--surface);border:1px solid var(--subtle);border-radius:var(--radius);width:100%;max-width:700px;max-height:90vh;overflow-y:auto;animation:modalIn .3s cubic-bezier(.16,1,.3,1)}
    .toast-banner{animation:toastIn .4s cubic-bezier(.16,1,.3,1) forwards;position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:14px 24px;border-radius:100px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;white-space:nowrap;pointer-events:none}
    .toast-success{background:rgba(92,171,125,.15);border:1px solid var(--green);color:var(--green)}
    .toast-error{background:rgba(224,92,92,.15);border:1px solid var(--red);color:var(--red)}
    .img-upload-zone{border:2px dashed var(--subtle);border-radius:var(--radius-sm);padding:28px;text-align:center;cursor:pointer;transition:all .2s ease;display:block}
    .img-upload-zone:hover{border-color:var(--gold);background:rgba(201,169,110,.04)}
    .tag{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:4px 10px;border-radius:100px}
    .live-dot{width:8px;height:8px;background:var(--green);border-radius:50%;animation:pulse 1.5s ease-in-out infinite}
    .divider{height:1px;background:var(--subtle);width:100%}
    .stat-card{background:var(--surface);border:1px solid var(--subtle);border-radius:var(--radius);padding:24px}
    .scroll-x{overflow-x:auto;scrollbar-width:none}.scroll-x::-webkit-scrollbar{display:none}
    .img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:3px;color:rgba(255,255,255,.2);text-transform:uppercase}
    .backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:200}
    .admin-row{transition:background .15s ease}.admin-row:hover{background:rgba(255,255,255,.02)}
    @media(max-width:768px){.desktop-nav{display:none!important}.mobile-nav{display:flex!important}.desktop-only{display:none!important}}
    @media(min-width:769px){.mobile-nav{display:none!important}.mobile-only{display:none!important}}
  `}</style>
);

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const CURRENCIES = [
  {code:"NGN",symbol:"₦",name:"Nigerian Naira",rate:1},
  {code:"USD",symbol:"$",name:"US Dollar",rate:0.00063},
  {code:"GBP",symbol:"£",name:"British Pound",rate:0.00050},
  {code:"EUR",symbol:"€",name:"Euro",rate:0.00057},
  {code:"GHS",symbol:"₵",name:"Ghanaian Cedi",rate:0.0097},
];

const ALL_COLORS = [
  {name:"Obsidian",hex:"#1a1a1a"},{name:"Ivory",hex:"#F5F0E8"},
  {name:"Sahara",hex:"#C9A96E"},{name:"Forest",hex:"#3D5A47"},
  {name:"Crimson",hex:"#8B2035"},{name:"Slate",hex:"#4A5568"},
];

const ALL_SIZES = ["S","M","L","XL","XXL"];

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT — Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara"
];

const SHIPPING_TIERS = {
  Lagos:5000, Ogun:7000, Oyo:7000, Osun:7000, Ondo:7000, Ekiti:7000,
  Rivers:8000, Edo:8000, Delta:8000, Bayelsa:8500,
  "Akwa Ibom":8500, "Cross River":8500, default:9000
};

const SLIDE_GRADIENTS = [
  "linear-gradient(135deg,#1a1a0e,#3D2B1F,#8B5E3C)",
  "linear-gradient(135deg,#0a1628,#1a3a5c,#2d6a8e)",
  "linear-gradient(135deg,#1a0a0a,#3D1515,#7a2d2d)",
  "linear-gradient(135deg,#0a1a0a,#1a3d1a,#2d5a2d)",
];
const SLIDE_TEXTS = ["NEW SEASON","COLLECTIONS 2025","MADE IN LAGOS","WEAR YOUR ROOTS"];

const IMG_G = {
  p1a:"linear-gradient(160deg,#2a2018,#5c4020)",p1b:"linear-gradient(160deg,#1a1a1a,#3d3020)",p1c:"linear-gradient(160deg,#2a1810,#4d2a10)",
  p2a:"linear-gradient(160deg,#0a1a2a,#1a3a5a)",p2b:"linear-gradient(160deg,#0a0a0a,#1a2a1a)",
  p3a:"linear-gradient(160deg,#1a1a2a,#2a2a4a)",p3b:"linear-gradient(160deg,#2a1a0a,#5a3a1a)",p3c:"linear-gradient(160deg,#0a0a0a,#2a2a2a)",
  p4a:"linear-gradient(160deg,#2a2010,#6a5020)",p4b:"linear-gradient(160deg,#1a0a0a,#4a1a1a)",
  p5a:"linear-gradient(160deg,#0a0a0a,#1a1a1a)",p5b:"linear-gradient(160deg,#2a0a0a,#5a1a1a)",p5c:"linear-gradient(160deg,#1a1a2a,#2a2a4a)",
  p6a:"linear-gradient(160deg,#3a1a1a,#7a2a2a)",p6b:"linear-gradient(160deg,#2a1a0a,#6a4a0a)",
  p7a:"linear-gradient(160deg,#0a0a0a,#2a2a2a)",p7b:"linear-gradient(160deg,#2a1a0a,#4a3a1a)",p7c:"linear-gradient(160deg,#1a1a0a,#3a3a1a)",
  p8a:"linear-gradient(160deg,#0a0a0a,#1a1a2a)",p8b:"linear-gradient(160deg,#0a1a0a,#1a3a1a)",
  p9a:"linear-gradient(160deg,#2a2a1a,#5a5a2a)",p9b:"linear-gradient(160deg,#2a1a0a,#5a3a1a)",p9c:"linear-gradient(160deg,#1a1a1a,#3a3a3a)",
};

const SEED_PRODUCTS = [
  {id:1,name:"AGBADA WIDE-LEG TROUSERS",category:"pants",price:85000,status:"published",description:"Crafted from premium woven cotton-linen blend inspired by traditional Agbada fabric. Wide-leg silhouette with deep side pockets and a refined high-rise waist. Elevated Nigerian craftsmanship for the modern wardrobe.",images:["p1a","p1b","p1c"],colors:["Obsidian","Ivory","Sahara"],sizes:{S:3,M:0,L:5,XL:2,XXL:0},archived:false},
  {id:2,name:"ADIRE TAILORED JOGGERS",category:"pants",price:65000,status:"published",description:"Adire-inspired joggers with hand-dyed indigo patterns on structured fleece. A perfect marriage of Yoruba textile tradition and contemporary streetwear.",images:["p2a","p2b"],colors:["Forest","Obsidian"],sizes:{S:4,M:7,L:3,XL:0,XXL:2},archived:false},
  {id:3,name:"OKÈ-ARÒ CARGO PANTS",category:"pants",price:72000,status:"published",description:"Six-pocket utility pants in heavyweight canvas with contrast stitching. Cut for ease of movement with tapered ankle and adjustable waist tie.",images:["p3a","p3b","p3c"],colors:["Slate","Sahara","Obsidian"],sizes:{S:0,M:2,L:0,XL:4,XXL:1},archived:false},
  {id:4,name:"SENATORIAL LINEN SHIRT",category:"shirts",price:58000,status:"published",description:"Single-origin Aso-oke woven linen in a relaxed boxy cut. Mandarin collar with mother-of-pearl buttons and subtle tonal embroidery at the chest pocket.",images:["p4a","p4b"],colors:["Ivory","Sahara","Crimson"],sizes:{S:6,M:4,L:2,XL:3,XXL:1},archived:false},
  {id:5,name:"VØLAN LONGSLEEVE",category:"shirts",price:48000,status:"published",description:"Premium heavyweight jersey in our signature Vølan weave. Dropped shoulders with ribbed cuffs and a curved hem. The essential Lagos wardrobe staple.",images:["p5a","p5b","p5c"],colors:["Obsidian","Crimson","Slate","Forest"],sizes:{S:8,M:10,L:6,XL:4,XXL:3},archived:false},
  {id:6,name:"OWAMBE SILK SHIRT",category:"shirts",price:95000,status:"published",description:"Pure silk charmeuse in celebratory jewel tones. Fluid drape, notch collar and a relaxed open front. Handwashed and softened for immediate luxury.",images:["p6a","p6b"],colors:["Crimson","Sahara","Obsidian"],sizes:{S:2,M:3,L:0,XL:1,XXL:0},archived:false},
  {id:7,name:"HARMATTAN OVERSIZED HOODIE",category:"hoodies",price:78000,status:"published",description:"400gsm brushed fleece in a generous oversized silhouette. Inspired by the dry Harmattan season — heavy, enveloping, warm. Kangaroo pocket with concealed zip.",images:["p7a","p7b","p7c"],colors:["Obsidian","Sahara","Ivory"],sizes:{S:5,M:8,L:6,XL:3,XXL:4},archived:false},
  {id:8,name:"LAGOS NOIR PULLOVER",category:"hoodies",price:68000,status:"published",description:"Street-ready pullover in double-faced neoprene. Subtle tonal branding at the chest, split hem and premium YKK half-zip closure.",images:["p8a","p8b"],colors:["Obsidian","Forest","Slate"],sizes:{S:3,M:5,L:4,XL:2,XXL:0},archived:false},
  {id:9,name:"VICTORIA ISLAND SHERPA",category:"hoodies",price:112000,status:"published",description:"Sherpa-lined zip hoodie with a heavyweight shell and ultra-plush interior. Oversized fit with dropped cuffs. Limited run — once sold out, it's gone.",images:["p9a","p9b","p9c"],colors:["Ivory","Sahara"],sizes:{S:1,M:2,L:0,XL:1,XXL:0},archived:false},
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmtPrice = (ngn, cur) =>
  cur.code === "NGN"
    ? `${cur.symbol}${ngn.toLocaleString("en-NG")}`
    : `${cur.symbol}${(ngn * cur.rate).toFixed(2)}`;

const getShipping = (state) => SHIPPING_TIERS[state] || SHIPPING_TIERS.default;
const isAllSoldOut = (sizes) => Object.values(sizes).every(s => s === 0);
const genId = () => Date.now() + Math.floor(Math.random() * 9999);

// ─────────────────────────────────────────────
// PLACEHOLDER IMAGE
// ─────────────────────────────────────────────
const PlaceholderImage = ({ id, label = "" }) => {
  const isRealImage = id && (id.startsWith("data:") || id.startsWith("http") || id.startsWith("blob:"));
  if (isRealImage) return (
    <img src={id} alt={label || "VØLAN"} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
  );
  return (
    <div style={{ background: IMG_G[id] || "linear-gradient(160deg,#111,#222)", width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="img-placeholder">{label || "VØLAN"}</div>
    </div>
  );
};

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
const Toast = ({ message, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast-banner toast-${type}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  PRODUCT FORM MODAL
// ═══════════════════════════════════════════════════════════════
const BLANK_FORM = { name:"", category:"shirts", price:"", description:"", colors:[], sizes:{S:0,M:0,L:0,XL:0,XXL:0}, status:"published" };

const ProductFormModal = ({ product, onSave, onClose }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit
    ? { name:product.name, category:product.category, price:product.price, description:product.description, colors:[...product.colors], sizes:{...product.sizes}, status:product.status||"published" }
    : { ...BLANK_FORM, colors:[], sizes:{S:0,M:0,L:0,XL:0,XXL:0} }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [imgs, setImgs] = useState(isEdit ? [...product.images] : []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleColor = name => setForm(f => ({
    ...f, colors: f.colors.includes(name) ? f.colors.filter(c => c !== name) : [...f.colors, name]
  }));

  const setStock = (size, val) => setForm(f => ({
    ...f, sizes: { ...f.sizes, [size]: Math.max(0, parseInt(val) || 0) }
  }));

  const handleImgUpload = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImgs(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImg = idx => setImgs(p => p.filter((_, i) => i !== idx));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Enter a valid price in ₦";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.colors.length === 0) e.colors = "Select at least one colour";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const assembled = {
      ...(isEdit ? product : {}),
      id: isEdit ? product.id : genId(),
      name: form.name.trim().toUpperCase(),
      category: form.category,
      price: parseInt(form.price),
      description: form.description.trim(),
      colors: form.colors,
      sizes: form.sizes,
      status: form.status,
      images: imgs.length > 0 ? imgs : (isEdit ? product.images : ["p1a"]),
      archived: isEdit ? (product.archived || false) : false,
    };
    await onSave(assembled); // calls AdminPanel.handleSave which does the Supabase work
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ padding:"22px 28px 18px", borderBottom:"1px solid var(--subtle)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"var(--surface)", zIndex:2 }}>
          <div>
            <div className="serif" style={{ fontSize:"22px", fontWeight:400 }}>{isEdit ? "Edit Product" : "Add New Product"}</div>
            <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:2 }}>{isEdit ? `Editing ID #${product.id}` : "Fill in all required fields"}</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:22 }}>

          {/* Name */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Product Name *</label>
            <input className="input-field" placeholder="e.g. HARMATTAN OVERSIZED HOODIE" value={form.name} onChange={set("name")} />
            {errors.name && <div style={{ fontSize:"12px", color:"var(--red)", marginTop:5 }}>{errors.name}</div>}
          </div>

          {/* Category + Status */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div>
              <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Category *</label>
              <select className="input-field" value={form.category} onChange={set("category")}>
                <option value="shirts">Shirts</option>
                <option value="pants">Pants</option>
                <option value="hoodies">Hoodies</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Status</label>
              <select className="input-field" value={form.status} onChange={set("status")}>
                <option value="published">Published (Live)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Price (₦) *</label>
            <input className="input-field" type="number" min="0" placeholder="e.g. 78000" value={form.price} onChange={set("price")} />
            {form.price && !isNaN(form.price) && Number(form.price) > 0 && (
              <div style={{ fontSize:"12px", color:"var(--gold)", marginTop:6 }}>Display: ₦{parseInt(form.price).toLocaleString("en-NG")}</div>
            )}
            {errors.price && <div style={{ fontSize:"12px", color:"var(--red)", marginTop:5 }}>{errors.price}</div>}
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:8 }}>Description *</label>
            <textarea className="input-field" placeholder="Describe the fabric, fit, and feel of this piece..." value={form.description} onChange={set("description")} />
            {errors.description && <div style={{ fontSize:"12px", color:"var(--red)", marginTop:5 }}>{errors.description}</div>}
          </div>

          {/* Colours */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:12 }}>Available Colours *</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {ALL_COLORS.map(c => (
                <div key={c.name} onClick={() => toggleColor(c.name)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:8, border:`1px solid ${form.colors.includes(c.name) ? "var(--gold)" : "var(--subtle)"}`, background: form.colors.includes(c.name) ? "rgba(201,169,110,0.08)" : "transparent", cursor:"pointer", transition:"all .2s" }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", background:c.hex, border: c.hex==="#F5F0E8" ? "1px solid rgba(255,255,255,0.25)" : "none", flexShrink:0 }} />
                  <span style={{ fontSize:"12px", fontWeight:500, color: form.colors.includes(c.name) ? "var(--gold)" : "var(--text)" }}>{c.name}</span>
                  {form.colors.includes(c.name) && <Check size={11} style={{ color:"var(--gold)" }} />}
                </div>
              ))}
            </div>
            {errors.colors && <div style={{ fontSize:"12px", color:"var(--red)", marginTop:5 }}>{errors.colors}</div>}
          </div>

          {/* Sizes & Stock */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:12 }}>Sizes & Stock Levels</label>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ALL_SIZES.map(size => (
                <div key={size} style={{ display:"flex", alignItems:"center", gap:16, padding:"12px 16px", background:"var(--surface2)", borderRadius:8, border:"1px solid var(--subtle)" }}>
                  <div style={{ width:32, fontSize:"13px", fontWeight:700, letterSpacing:"1px" }}>{size}</div>
                  <div style={{ flex:1, fontSize:"12px", color:"var(--muted)" }}>Stock quantity</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <button className="btn-icon" style={{ padding:4 }} onClick={() => setStock(size, form.sizes[size] - 1)}><Minus size={12} /></button>
                    <input
                      type="number" min="0" value={form.sizes[size]}
                      onChange={e => setStock(size, e.target.value)}
                      style={{ width:64, textAlign:"center", background:"var(--surface3)", border:"1px solid var(--subtle)", color:"var(--text)", padding:"6px 0", borderRadius:6, fontSize:"15px", fontWeight:700, fontFamily:"'DM Sans'", outline:"none" }}
                    />
                    <button className="btn-icon" style={{ padding:4 }} onClick={() => setStock(size, form.sizes[size] + 1)}><Plus size={12} /></button>
                  </div>
                  <span className="tag" style={{ minWidth:64, textAlign:"center", background: form.sizes[size]===0 ? "rgba(224,92,92,0.1)" : "rgba(92,171,125,0.1)", color: form.sizes[size]===0 ? "var(--red)" : "var(--green)", border:`1px solid ${form.sizes[size]===0 ? "rgba(224,92,92,0.3)" : "rgba(92,171,125,0.3)"}` }}>
                    {form.sizes[size] === 0 ? "Out" : "In Stock"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", display:"block", marginBottom:12 }}>Product Images</label>
            {imgs.length > 0 && (
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                {imgs.map((img, i) => (
                  <div key={i} style={{ position:"relative", width:80, height:100, borderRadius:8, overflow:"hidden", border:`2px solid ${i===0 ? "var(--gold)" : "var(--subtle)"}` }}>
                    <PlaceholderImage id={img} />
                    {i === 0 && <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(201,169,110,0.85)", fontSize:"8px", letterSpacing:"1px", textAlign:"center", padding:"3px 0", fontWeight:700, color:"#000" }}>MAIN</div>}
                    <button onClick={() => removeImg(i)} style={{ position:"absolute", top:3, right:3, width:18, height:18, borderRadius:"50%", background:"rgba(0,0,0,0.8)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <X size={9} style={{ color:"#fff" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor={`img-up-${isEdit ? product.id : "new"}`} className="img-upload-zone">
              <ImagePlus size={22} style={{ color:"var(--muted)", marginBottom:8 }} />
              <div style={{ fontSize:"13px", color:"var(--muted)", marginBottom:3 }}>Click to upload product images</div>
              <div style={{ fontSize:"11px", color:"var(--subtle)" }}>PNG, JPG — first image becomes the main photo</div>
              <input id={`img-up-${isEdit ? product.id : "new"}`} type="file" multiple accept="image/*" style={{ display:"none" }} onChange={handleImgUpload} />
            </label>
            <div style={{ fontSize:"11px", color:"var(--muted)", marginTop:8, lineHeight:1.7, padding:"10px 14px", background:"var(--surface2)", borderRadius:6, border:"1px solid var(--subtle)" }}>
              💡 Images show as gradient placeholders until you connect Supabase Storage or Cloudinary. See the DB comments at the top of the file.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:12, paddingTop:8, borderTop:"1px solid var(--subtle)" }}>
            <button className="btn-ghost" onClick={onClose} style={{ flex:1 }}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={saving} style={{ flex:2, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {saving
                ? <><div style={{ width:14, height:14, border:"2px solid #000", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Saving...</>
                : <><Check size={14} /> {isEdit ? "Save Changes" : "Publish Product"}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ARCHIVE CONFIRM MODAL
// ─────────────────────────────────────────────
const ArchiveModal = ({ product, onConfirm, onClose }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal-box" style={{ maxWidth:400 }}>
      <div style={{ padding:32, textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(224,92,92,0.1)", border:"2px solid rgba(224,92,92,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <AlertTriangle size={28} style={{ color:"var(--red)" }} />
        </div>
        <div className="serif" style={{ fontSize:"22px", fontWeight:400, marginBottom:8 }}>Archive Product?</div>
        <p style={{ fontSize:"13px", color:"var(--muted)", lineHeight:1.7, marginBottom:24 }}>
          <strong style={{ color:"var(--text)" }}>{product.name}</strong> will be hidden from the storefront. You can restore it any time from the Archived tab.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex:1 }}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} style={{ flex:1 }}>Archive Product</button>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// ENTRY SCREEN
// ─────────────────────────────────────────────
const EntryScreen = ({ onEnter }) => {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => { const t = setInterval(() => setCur(c => (c+1)%4), 4000); return () => clearInterval(t); }, []);
  const go = () => { setFading(true); setTimeout(onEnter, 800); };
  return (
    <div style={{ position:"fixed", inset:0, background:"#000", opacity:fading?0:1, transition:"opacity .8s ease", zIndex:1000 }}>
      {SLIDE_GRADIENTS.map((g,i) => (
        <div key={i} style={{ position:"absolute", inset:0, background:g, opacity:i===cur?1:0, transition:"opacity 1s ease" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.015) 40px,rgba(255,255,255,0.015) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.015) 40px,rgba(255,255,255,0.015) 41px)" }} />
          <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", opacity:i===cur?1:0, transition:"opacity 1s ease" }}>
            <div className="serif" style={{ fontSize:"clamp(48px,10vw,100px)", fontWeight:300, color:"rgba(255,255,255,0.07)", letterSpacing:"0.3em", whiteSpace:"nowrap" }}>{SLIDE_TEXTS[i]}</div>
          </div>
        </div>
      ))}
      <div className="hero-overlay" style={{ position:"absolute", inset:0 }} />
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32 }} className="fade-in">
        <div style={{ textAlign:"center" }}>
          <div className="serif" style={{ fontSize:"clamp(14px,2vw,18px)", letterSpacing:"8px", color:"var(--gold)", fontWeight:300, marginBottom:16, textTransform:"uppercase" }}>Lagos · Nigeria</div>
          <div className="serif" style={{ fontSize:"clamp(56px,12vw,140px)", fontWeight:300, letterSpacing:"0.12em", color:"var(--text)", lineHeight:.9, textTransform:"uppercase" }}>VØLAN</div>
          <div style={{ fontSize:"11px", letterSpacing:"6px", color:"var(--muted)", marginTop:16, textTransform:"uppercase" }}>Collective</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[0,1,2,3].map(i => <div key={i} onClick={() => setCur(i)} style={{ width:i===cur?32:8, height:2, background:i===cur?"var(--gold)":"rgba(255,255,255,0.3)", borderRadius:1, transition:"all .4s ease", cursor:"pointer" }} />)}
        </div>
        <button className="btn-primary" onClick={go} style={{ marginTop:16, fontSize:"11px", letterSpacing:"3px" }}>Enter Our World</button>
      </div>
      <div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)" }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase" }}>Fly Above The System</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
const Navbar = ({ cartCount, setPage, page, setCartOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", f); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <>
      <nav className="desktop-nav" style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:64, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", background:scrolled?"rgba(8,8,8,0.92)":"transparent", backdropFilter:scrolled?"blur(20px)":"none", borderBottom:scrolled?"1px solid var(--subtle)":"1px solid transparent", transition:"all .4s ease" }}>
        <button onClick={() => setPage("shop")} className="btn-icon" style={{ padding:0 }}>
          <span className="serif" style={{ fontSize:"22px", fontWeight:300, letterSpacing:"6px", color:"var(--text)" }}>VØLAN</span>
        </button>
        <div style={{ display:"flex", gap:4 }}>
          {["shop","pants","shirts","hoodies"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ background:"none", border:"none", cursor:"pointer", color:page===p?"var(--gold)":"var(--muted)", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"'DM Sans'", fontWeight:500, padding:"8px 16px", transition:"color .2s" }}>{p}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:4 }}>
          <button className="btn-icon" onClick={() => setPage("account")}><User size={18} /></button>
          <button className="btn-icon" style={{ position:"relative" }} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span style={{ position:"absolute", top:4, right:4, width:16, height:16, background:"var(--gold)", borderRadius:"50%", fontSize:"9px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:"#000" }}>{cartCount}</span>}
          </button>
        </div>
      </nav>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, height:56, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", background:scrolled?"rgba(8,8,8,0.95)":"transparent", backdropFilter:"blur(20px)" }} className="mobile-only">
        <span className="serif" style={{ fontSize:"20px", fontWeight:300, letterSpacing:"5px" }}>VØLAN</span>
        <button className="btn-icon" style={{ position:"relative" }} onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
          {cartCount > 0 && <span style={{ position:"absolute", top:2, right:2, width:16, height:16, background:"var(--gold)", borderRadius:"50%", fontSize:"9px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:"#000" }}>{cartCount}</span>}
        </button>
      </nav>
      <nav className="mobile-nav" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, height:64, background:"rgba(17,17,17,0.95)", backdropFilter:"blur(20px)", borderTop:"1px solid var(--subtle)", display:"none", alignItems:"center", justifyContent:"space-around" }}>
        {[{icon:Home,label:"Home",p:"shop"},{icon:Grid,label:"Browse",p:"pants"},{icon:ShoppingBag,label:"Cart",p:null,badge:cartCount},{icon:User,label:"Account",p:"account"}].map(({icon:Icon,label,p,badge}) => (
          <button key={label} onClick={p ? () => setPage(p) : () => setCartOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, color:page===p?"var(--gold)":"var(--muted)", position:"relative" }}>
            <Icon size={22} />
            {badge > 0 && <span style={{ position:"absolute", top:-4, right:-4, width:14, height:14, background:"var(--gold)", borderRadius:"50%", fontSize:"8px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", color:"#000" }}>{badge}</span>}
            <span style={{ fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", fontWeight:500 }}>{label}</span>
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
    <div style={{ position:"fixed", bottom:80, left:20, zIndex:150 }} className="desktop-only">
      {open && (
        <div className="card slide-up" style={{ position:"absolute", bottom:"100%", marginBottom:8, width:200, overflow:"hidden" }}>
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => { setCurrency(c); setOpen(false); }} style={{ width:"100%", background:currency.code===c.code?"rgba(201,169,110,0.1)":"transparent", border:"none", borderBottom:"1px solid var(--subtle)", padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", color:"var(--text)", fontFamily:"'DM Sans'", fontSize:"13px", transition:"background .2s" }}>
              <span>{c.symbol} {c.code}</span>
              <span style={{ fontSize:"11px", color:"var(--muted)" }}>{c.name.split(" ").slice(-1)[0]}</span>
              {currency.code === c.code && <Check size={14} style={{ color:"var(--gold)" }} />}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{ background:"var(--surface)", border:"1px solid var(--subtle)", borderRadius:100, padding:"8px 16px", cursor:"pointer", fontSize:"13px", fontWeight:600, color:"var(--gold)", fontFamily:"'DM Sans'", display:"flex", alignItems:"center", gap:6 }}>
        {currency.symbol} {currency.code}
        <ChevronRight size={14} style={{ transform:open?"rotate(90deg)":"rotate(0)", transition:"transform .2s" }} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// SHOP PAGE
// ─────────────────────────────────────────────
const ShopPage = ({ setPage, setSelectedProduct, currency, category, products }) => {
  const visible = (category ? products.filter(p => p.category === category) : products)
    .filter(p => !p.archived && p.status === "published");
  return (
    <div style={{ minHeight:"100vh", padding:"80px 40px 100px" }} className="fade-in">
      <div style={{ marginBottom:48, paddingTop:24 }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", color:"var(--muted)", textTransform:"uppercase", marginBottom:12 }}>{category ? `Shop / ${category}` : "Collections"}</div>
        <h1 className="serif" style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:300, letterSpacing:"0.05em", lineHeight:1 }}>
          {category ? category.charAt(0).toUpperCase()+category.slice(1) : "All Collections"}
        </h1>
        <p style={{ marginTop:12, fontSize:"14px", color:"var(--muted)", maxWidth:400 }}>
          {category==="pants" && "Elevated trousers for the modern Lagos man and woman."}
          {category==="shirts" && "Shirts that carry the spirit of Nigerian craftsmanship."}
          {category==="hoodies" && "Heavyweight luxury fleece. Built for Lagos nights and beyond."}
          {!category && "A curated selection of premium Nigerian fashion for the discerning wardrobe."}
        </p>
      </div>
      <div className="scroll-x" style={{ display:"flex", gap:8, marginBottom:40 }}>
        {["all","pants","shirts","hoodies"].map(cat => (
          <button key={cat} onClick={() => setPage(cat==="all" ? "shop" : cat)} className={category===cat||(!category&&cat==="all") ? "btn-primary" : "btn-ghost"} style={{ whiteSpace:"nowrap", padding:"10px 20px", fontSize:"11px" }}>
            {cat.charAt(0).toUpperCase()+cat.slice(1)}
          </button>
        ))}
      </div>
      {visible.length === 0
        ? <div style={{ textAlign:"center", padding:"80px 0", color:"var(--muted)" }}>
            <div className="serif" style={{ fontSize:"28px", fontWeight:300, marginBottom:8 }}>Nothing here yet</div>
            <div style={{ fontSize:"13px" }}>New drops coming soon.</div>
          </div>
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:24 }}>
            {visible.map((p, i) => (
              <div key={p.id} style={{ animationDelay:`${i*.06}s` }} className="slide-up">
                <div className="product-card" onClick={() => { setSelectedProduct(p); setPage("product"); }}>
                  <div style={{ position:"relative", aspectRatio:"3/4", borderRadius:"var(--radius)", overflow:"hidden", background:"var(--surface2)" }}>
                    <PlaceholderImage id={p.images[0]} />
                    {isAllSoldOut(p.sizes) && (
                      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span className="tag" style={{ background:"rgba(224,92,92,0.2)", border:"1px solid var(--red)", color:"var(--red)" }}>Sold Out</span>
                      </div>
                    )}
                    <div style={{ position:"absolute", top:12, left:12 }}>
                      <span className="tag" style={{ background:"rgba(201,169,110,0.15)", color:"var(--gold)", fontSize:"9px" }}>{p.category}</span>
                    </div>
                  </div>
                  <div style={{ padding:"14px 4px 8px" }}>
                    <div style={{ fontSize:"12px", fontWeight:600, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:4 }}>{p.name}</div>
                    {isAllSoldOut(p.sizes)
                      ? <div style={{ fontSize:"12px", color:"var(--red)" }}>Sold Out</div>
                      : <div style={{ fontSize:"14px", color:"var(--gold)", fontWeight:500 }}>{fmtPrice(p.price, currency)}</div>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
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
  const soldOut = isAllSoldOut(product.sizes);
  const [added, setAdded] = useState(false);
  const [stockError, setStockError] = useState(false);

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    const ok = addToCart({ product, size: selectedSize, color: selectedColor, qty: 1 });
    if (ok) {
      setAdded(true);
      setStockError(false);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setStockError(true);
      setTimeout(() => setStockError(false), 3000);
    }
  };

  const colors = ALL_COLORS.filter(c => product.colors.includes(c.name));

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
              <div
                key={i}
                onClick={() => setImgIdx(i)}
                style={{ width: 72, aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", cursor: "pointer", border: `2px solid ${imgIdx === i ? "var(--gold)" : "transparent"}`, opacity: imgIdx === i ? 1 : 0.6, transition: "all 0.2s" }}
              >
                <PlaceholderImage id={img} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div>
            <button
              onClick={onBack}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}
            >
              <ChevronLeft size={14} /> Back
            </button>

            <div className="tag" style={{ background: "rgba(201,169,110,0.15)", color: "var(--gold)", marginBottom: 12, display: "inline-block" }}>
              {product.category}
            </div>

            <h1 className="serif" style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 400, letterSpacing: "0.05em", lineHeight: 1.2, marginBottom: 16, marginTop: 8 }}>
              {product.name}
            </h1>

            {soldOut
              ? <div style={{ fontSize: "16px", color: "var(--red)", fontWeight: 600 }}>Sold Out</div>
              : <div style={{ fontSize: "28px", color: "var(--gold)", fontWeight: 400, fontFamily: "'Cormorant Garamond', serif" }}>{fmtPrice(product.price, currency)}</div>
            }
          </div>

          <p style={{ fontSize: "14px", lineHeight: 1.8, color: "var(--muted)" }}>{product.description}</p>

          <div className="divider" />

          {/* Colour picker */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>
              Colour{selectedColor ? <span style={{ color: "var(--text)" }}> — {selectedColor}</span> : ""}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {colors.map(c => (
                <div
                  key={c.name}
                  title={c.name}
                  className={`color-swatch ${selectedColor === c.name ? "selected" : ""}`}
                  onClick={() => setSelectedColor(c.name)}
                  style={{
                    background: c.hex,
                    outline: c.hex === "#F5F0E8" ? "1px solid rgba(255,255,255,0.2)" : "none"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Size</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(product.sizes).map(([size, stock]) => (
                <button
                  key={size}
                  className={`size-chip ${selectedSize === size ? "selected" : ""} ${stock === 0 ? "disabled" : ""}`}
                  onClick={() => stock > 0 && setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && product.sizes[selectedSize] <= 3 && product.sizes[selectedSize] > 0 && (
              <div style={{ fontSize: "12px", color: "#E0A04A", marginTop: 8 }}>
                Only {product.sizes[selectedSize]} left in {selectedSize}
              </div>
            )}
          </div>

          {!soldOut && (
            <>
              <button
                className="btn-primary"
                onClick={handleAdd}
                disabled={!selectedSize || !selectedColor}
                style={{ opacity: !selectedSize || !selectedColor ? 0.5 : 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {added ? <><Check size={14} /> Added to Bag</> : <><ShoppingBag size={14} /> Add to Bag</>}
              </button>
              {stockError && (
                <div style={{ fontSize: "12px", color: "var(--red)", textAlign: "center", marginTop: 8 }}>
                  Only {product.sizes[selectedSize]} unit{product.sizes[selectedSize] !== 1 ? "s" : ""} available in {selectedSize} — you've reached the limit.
                </div>
              )}
            </>
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

  const updateQty = (idx, delta) => setCart(c => c.map((item, i) => {
  if (i !== idx) return item;
  const stock = item.product.sizes[item.size] || 0;
  const newQty = Math.min(Math.max(1, item.qty + delta), stock);
  return { ...item, qty: newQty };
  }));

  const remove = idx => setCart(c => c.filter((_, i) => i !== idx));

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className={isMobile ? "cart-drawer-mobile" : "cart-drawer-desktop"} style={{ position:"fixed", [isMobile?"bottom":"right"]:0, [isMobile?"left":"top"]:0, [isMobile?"right":"bottom"]:0, width:isMobile?"100%":400, height:isMobile?"85vh":"100vh", background:"var(--surface)", borderRadius:isMobile?"var(--radius) var(--radius) 0 0":0, borderLeft:isMobile?"none":"1px solid var(--subtle)", borderTop:isMobile?"1px solid var(--subtle)":"none", zIndex:300, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"24px 24px 20px", borderBottom:"1px solid var(--subtle)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div className="serif" style={{ fontSize:"22px", fontWeight:400 }}>Your Bag</div>
            <div style={{ fontSize:"12px", color:"var(--muted)", marginTop:2 }}>{cart.length} item{cart.length!==1?"s":""}</div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 24px" }}>
          {cart.length === 0
            ? <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:16, color:"var(--muted)" }}>
                <ShoppingBag size={48} style={{ opacity:.3 }} />
                <div style={{ fontSize:"14px" }}>Your bag is empty</div>
              </div>
            : cart.map((item, i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"16px 0", borderBottom:"1px solid var(--subtle)" }}>
                  <div style={{ width:80, flexShrink:0, aspectRatio:"3/4", borderRadius:8, overflow:"hidden", background:"var(--surface2)" }}>
                    <PlaceholderImage id={item.product.images[0]} />
                  </div>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontSize:"11px", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", marginBottom:3 }}>{item.product.name}</div>
                      <div style={{ fontSize:"11px", color:"var(--muted)" }}>{item.size} · {item.color}</div>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--surface2)", borderRadius:8, padding:"4px 12px" }}>
                        <button className="btn-icon" style={{ padding: 2, opacity: item.qty <= 1 ? 0.3 : 1 }} onClick={() => updateQty(i, -1)} disabled={item.qty <= 1}> <Minus size={12} /> </button>
                        <span style={{ fontSize:"13px", fontWeight:600 }}>{item.qty}</span>
                        <button className="btn-icon" style={{ padding: 2, opacity: item.qty >= (item.product.sizes[item.size] || 0) ? 0.3 : 1 }} onClick={() => updateQty(i, 1)} disabled={item.qty >= (item.product.sizes[item.size] || 0)} > <Plus size={12} /> </button>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:"13px", fontWeight:600, color:"var(--gold)" }}>{fmtPrice(item.product.price*item.qty, currency)}</div>
                        <button onClick={() => remove(i)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"10px", color:"var(--muted)", marginTop:3 }}>Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
        {cart.length > 0 && (
          <div style={{ padding:"20px 24px", borderTop:"1px solid var(--subtle)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontSize:"13px", color:"var(--muted)" }}>Subtotal</span>
              <span style={{ fontSize:"16px", fontWeight:600, color:"var(--gold)" }}>{fmtPrice(subtotal, currency)}</span>
            </div>
            <p style={{ fontSize:"11px", color:"var(--muted)", marginBottom:16, lineHeight:1.5 }}>Shipping calculated at checkout</p>
            <button className="btn-primary" style={{ width:"100%" }} onClick={onCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// CHECKOUT
// ─────────────────────────────────────────────
const CheckoutPage = ({ cart, currency, onBack, onSuccess }) => {
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
  });
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const sub = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const ship = getShipping(form.state);
  const total = sub + ship;

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // ───────────── VALIDATION ─────────────
  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.email) newErrors.email = "Email is required";
      if (!form.phone) newErrors.phone = "Phone is required";
    } else if (step === 2) {
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
      if (!form.address) newErrors.address = "Address is required";
      if (!form.city) newErrors.city = "City is required";
      if (!form.state) newErrors.state = "State is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  // ───────────── PAY FUNCTION ─────────────
  const pay = () => {
    if (!form.email) {
      setErrors({ email: "Email is required" });
      setStep(1);
      return;
    }

    setProcessing(true);

    const handler = window.PaystackPop.setup({
      key: "pk_test_4ee0196721efc4a910ce1632bba61bd36152d456",
      email: form.email,
      amount: total * 100,
      currency: "NGN",
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: `${form.firstName} ${form.lastName}` },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
        ],
      },
      callback: function (response) {
        setTimeout(() => {
          onSuccess();
          setProcessing(false);
        }, 1500);
      },
      onClose: function () {
        setProcessing(false);
      },
    });

    handler.openIframe();
  };

  // ───────────── PROCESSING OVERLAY ─────────────
  const ProcessingOverlay = () =>
    processing && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          color: "#fff",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #fff",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div style={{ letterSpacing: "2px", fontSize: "14px", textTransform: "uppercase", marginTop: 8 }}>
          Processing Payment...
        </div>
        <div style={{ fontSize: 12, color: "#ccc", marginTop: 6 }}>Secured & Encrypted by Paystack</div>
      </div>
    );

  // ───────────── STEP UI ─────────────
  const Step1 = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="slide-up">
      <h3 style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>Contact Information</h3>
      <input className="input-field" placeholder="Email address" type="email" value={form.email} onChange={setField("email")} />
      {errors.email && <div style={{ color: "red", fontSize: 11 }}>{errors.email}</div>}
      <input className="input-field" placeholder="Phone number" type="tel" value={form.phone} onChange={setField("phone")} />
      {errors.phone && <div style={{ color: "red", fontSize: 11 }}>{errors.phone}</div>}
      <button className="btn-primary" style={{ width: "100%" }} onClick={nextStep}>Continue to Delivery</button>
    </div>
  );

  const Step2 = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }} className="slide-up">
      <h3 style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>Delivery Details</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <input className="input-field" placeholder="First name" value={form.firstName} onChange={setField("firstName")} />
        {errors.firstName && <div style={{ color: "red", fontSize: 11 }}>{errors.firstName}</div>}
        <input className="input-field" placeholder="Last name" value={form.lastName} onChange={setField("lastName")} />
        {errors.lastName && <div style={{ color: "red", fontSize: 11 }}>{errors.lastName}</div>}
      </div>
      <input className="input-field" placeholder="Street address" value={form.address} onChange={setField("address")} />
      {errors.address && <div style={{ color: "red", fontSize: 11 }}>{errors.address}</div>}
      <input className="input-field" placeholder="City" value={form.city} onChange={setField("city")} />
      {errors.city && <div style={{ color: "red", fontSize: 11 }}>{errors.city}</div>}
      <select className="input-field" value={form.state} onChange={setField("state")}>
        {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
      </select>
      {errors.state && <div style={{ color: "red", fontSize: 11 }}>{errors.state}</div>}
      <button className="btn-primary" style={{ width: "100%" }} onClick={nextStep}>Continue to Payment</button>
    </div>
  );

  const Step3 = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="slide-up">
      <h3 style={{ fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)" }}>Payment</h3>
      <button
        className="btn-primary"
        style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
        onClick={pay}
        disabled={processing}
      >
        {processing
          ? <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          : `Pay ${fmtPrice(total, currency)}`
        }
      </button>
      <div style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 6 }}>
        Secured by Paystack — PCI DSS Compliant
      </div>
    </div>
  );

  return (
    <>
      <ProcessingOverlay />
      <div style={{ minHeight: "100vh", padding: "80px 0 120px" }} className="fade-in">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 40px", display: "grid", gridTemplateColumns: "1fr 400px", gap: 60 }}>
          <div>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans'", marginBottom: 32, display: "flex", alignItems: "center", gap: 6 }}>
              <ChevronLeft size={14} /> Back to Bag
            </button>
            <div className="serif" style={{ fontSize: 32, fontWeight: 300, marginBottom: 8 }}>Checkout</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {["Contact", "Delivery", "Payment"].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step > i + 1 ? "var(--green)" : step === i + 1 ? "var(--gold)" : "var(--subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step >= i + 1 ? "#000" : "var(--muted)" }}>
                    {step > i + 1 ? <Check size={12} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: step === i + 1 ? "var(--text)" : "var(--muted)" }}>{s}</span>
                  {i < 2 && <ChevronRight size={14} style={{ color: "var(--subtle)" }} />}
                </div>
              ))}
            </div>

            {step === 1 && Step1}
            {step === 2 && Step2}
            {step === 3 && Step3}
          </div>

          {/* ───────────── RIGHT ORDER SUMMARY ───────────── */}
          <div>
            <div className="card" style={{ padding: 24, position: "sticky", top: 80 }}>
              <div style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: "var(--muted)", marginBottom: 20 }}>Order Summary</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 56, height: 72, borderRadius: 8, overflow: "hidden", background: "var(--surface2)" }}>
                        <PlaceholderImage id={item.product.images[0]} />
                      </div>
                      <div style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, background: "var(--gold)", borderRadius: "50%", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{item.qty}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{item.product.name}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{item.size} · {item.color}</div>
                      <div style={{ fontSize: 13, color: "var(--gold)", marginTop: 4 }}>{fmtPrice(item.product.price * item.qty, currency)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider" style={{ marginBottom: 16 }} />
              {[["Subtotal", fmtPrice(sub, currency)], ["Shipping", fmtPrice(ship, currency)], ["Total", fmtPrice(total, currency)]].map(([l, v], i) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: i === 2 ? "14px" : "13px", color: i === 2 ? "var(--text)" : "var(--muted)", fontWeight: i === 2 ? 600 : 400 }}>{l}</span>
                  <span style={{ fontSize: i === 2 ? "16px" : "13px", color: i === 2 ? "var(--gold)" : "var(--text)", fontWeight: i === 2 ? 600 : 400 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// ORDER SUCCESS
// ─────────────────────────────────────────────
const OrderSuccess = ({ onContinue }) => (
  <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }} className="fade-in">
    <div style={{ textAlign:"center", maxWidth:480 }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(92,171,125,0.15)", border:"2px solid var(--green)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
        <Check size={32} style={{ color:"var(--green)" }} />
      </div>
      <div className="serif" style={{ fontSize:"40px", fontWeight:300, marginBottom:12 }}>Order Confirmed</div>
      <p style={{ color:"var(--muted)", fontSize:"14px", lineHeight:1.7, marginBottom:32 }}>Thank you for your order. You'll receive a confirmation email shortly. Your order will be dispatched within 1–2 business days.</p>
      <div style={{ background:"var(--surface2)", border:"1px solid var(--subtle)", borderRadius:8, padding:"12px 20px", display:"inline-block", marginBottom:32 }}>
        <span style={{ fontSize:"11px", color:"var(--muted)", letterSpacing:"2px", textTransform:"uppercase" }}>Order </span>
        <span style={{ color:"var(--gold)", fontWeight:700 }}>#VLN-{Math.floor(10000+Math.random()*90000)}</span>
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
    <div style={{ minHeight:"100vh", padding:"100px 40px 120px", maxWidth:600, margin:"0 auto" }} className="fade-in">
      <div className="serif" style={{ fontSize:"36px", fontWeight:300, marginBottom:32 }}>My Account</div>
      <div className="card" style={{ padding:24, marginBottom:16 }}>
        <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:12 }}>Profile</div>
        <div style={{ fontSize:"16px", fontWeight:500 }}>Adaeze Johnson</div>
        <div style={{ fontSize:"13px", color:"var(--muted)" }}>adaeze@example.com · Lagos, Nigeria</div>
      </div>
      <div className="card" style={{ padding:24, marginBottom:16 }}>
        <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:16 }}>Recent Orders</div>
        {[{id:"VLN-48291",date:"Jan 22, 2025",status:"Delivered",total:"₦85,000"},{id:"VLN-47100",date:"Dec 15, 2024",status:"Delivered",total:"₦148,000"}].map(o => (
          <div key={o.id} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--subtle)" }}>
            <div><div style={{ fontSize:"13px", fontWeight:600, color:"var(--gold)" }}>{o.id}</div><div style={{ fontSize:"11px", color:"var(--muted)" }}>{o.date}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:"13px", fontWeight:600 }}>{o.total}</div><div style={{ fontSize:"11px", color:"var(--green)" }}>{o.status}</div></div>
          </div>
        ))}
      </div>
      <button className="btn-ghost" onClick={() => setLoggedIn(false)} style={{ display:"flex", alignItems:"center", gap:8 }}><LogOut size={14} /> Log Out</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }} className="fade-in">
      <div style={{ width:"100%", maxWidth:400 }}>
        <div className="serif" style={{ fontSize:"36px", fontWeight:300, textAlign:"center", marginBottom:8 }}>VØLAN Account</div>
        <div style={{ fontSize:"12px", color:"var(--muted)", textAlign:"center", marginBottom:32 }}>Your fashion passport</div>
        <div style={{ display:"flex", background:"var(--surface2)", borderRadius:100, padding:4, marginBottom:32 }}>
          {["login","register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"10px", borderRadius:100, border:"none", cursor:"pointer", background:tab===t?"var(--gold)":"transparent", color:tab===t?"#000":"var(--muted)", fontSize:"12px", fontFamily:"'DM Sans'", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", transition:"all .3s ease" }}>
              {t==="login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {tab==="register" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <input className="input-field" placeholder="First name" />
              <input className="input-field" placeholder="Last name" />
            </div>
          )}
          <input className="input-field" placeholder="Email address" type="email" />
          <input className="input-field" placeholder="Password" type="password" />
          {tab==="register" && <input className="input-field" placeholder="Confirm password" type="password" />}
          <button className="btn-primary" style={{ width:"100%" }} onClick={() => setLoggedIn(true)}>
            {tab==="login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  ADMIN PANEL  —  Full working CRUD
// ═══════════════════════════════════════════════════════════════
const AdminPanel = ({ products, setProducts }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [notif, setNotif] = useState(null);
  const [toast, setToast] = useState(null);
  const [formModal, setFormModal] = useState(null);
  const [archiveModal, setArchiveModal] = useState(null);
  const [productFilter, setProductFilter] = useState("active");

  useEffect(() => {
    if (!loggedIn) return;
    const t = setTimeout(() => {
      setNotif({ name:"VØLAN LONGSLEEVE", size:"L", color:"Obsidian", price:"₦48,000" });
      setTimeout(() => setNotif(null), 5000);
    }, 2500);
    return () => clearTimeout(t);
  }, [loggedIn]);

  const handleSave = async (saved) => {
    console.log("handleSave received:", saved); // temporary debug line
    if (!saved || !saved.name) {
      setToast({ message: "Something went wrong — product data is missing", type: "error" });
      return;
    }
    const ok = await db.saveProduct(saved);
    if (ok) {
      const updated = products.some(p => p.id === saved.id)
        ? products.map(p => p.id === saved.id ? saved : p)
        : [...products, saved];
      setProducts(updated);
      setFormModal(null);
      setToast({ message: products.some(p => p.id === saved.id) ? "Changes saved successfully" : "Product published successfully", type: "success" });
    } else {
      setToast({ message: "Failed to save — check your Supabase connection", type: "error" });
    }
  };

  const handleArchive = async (product) => {
    const updated = { ...product, archived: true };
    await db.saveProduct(updated);
    setProducts(products.map(p => p.id === product.id ? updated : p));
    setArchiveModal(null);
    setToast({ message: "Product archived", type: "success" });
  };

  const handleRestore = async (product) => {
    const updated = { ...product, archived: false, status: "published" };
    await db.saveProduct(updated);
    setProducts(products.map(p => p.id === product.id ? updated : p));
    setToast({ message: `${product.name} restored to storefront`, type: "success" });
  };

  const toggleStatus = async (product) => {
    const updated = { ...product, status: product.status === "published" ? "draft" : "published" };
    await db.saveProduct(updated);
    setProducts(products.map(p => p.id === product.id ? updated : p));
    setToast({ message: `${product.name} set to ${updated.status}`, type: "success" });
  };

  const adjustStock = async (productId, size, delta) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newSizes = { ...product.sizes, [size]: Math.max(0, (product.sizes[size] || 0) + delta) };
    await db.updateSizes(productId, newSizes);
    setProducts(products.map(p => p.id === productId ? { ...p, sizes: newSizes } : p));
  };

  // Login screen
  if (!loggedIn) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:40 }} className="fade-in">
      <div style={{ width:"100%", maxWidth:360, textAlign:"center" }}>
        <div style={{ fontSize:"10px", letterSpacing:"6px", color:"var(--muted)", textTransform:"uppercase", marginBottom:8 }}>Restricted Area</div>
        <div className="serif" style={{ fontSize:"32px", fontWeight:300, marginBottom:32 }}>Admin Access</div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <input className="input-field" type="password" placeholder="Admin password" value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(false); }}
            style={{ borderColor:pwErr?"var(--red)":undefined }}
            onKeyDown={e => e.key==="Enter" && (pw==="admin123" ? setLoggedIn(true) : setPwErr(true))}
          />
          {pwErr && <div style={{ fontSize:"12px", color:"var(--red)" }}>Incorrect password</div>}
          <button className="btn-primary" onClick={() => pw==="admin123" ? setLoggedIn(true) : setPwErr(true)}>Enter Dashboard</button>
          <div style={{ fontSize:"11px", color:"var(--muted)" }}>Demo password: admin123</div>
        </div>
      </div>
    </div>
  );

  const activeProds   = products.filter(p => !p.archived && p.status==="published");
  const draftProds    = products.filter(p => !p.archived && p.status==="draft");
  const archivedProds = products.filter(p => p.archived);
  const displayProds  = productFilter==="active" ? activeProds : productFilter==="draft" ? draftProds : archivedProds;

  const ORDERS = [
    {id:"VLN-48301",customer:"Amaka Osei",items:"Harmattan Hoodie (M, Obsidian) ×1",total:"₦83,000",status:"Paid",date:"Today, 11:32am"},
    {id:"VLN-48300",customer:"Emeka Nwosu",items:"Senatorial Shirt (L, Ivory) ×2",total:"₦116,000",status:"Paid",date:"Today, 10:14am"},
    {id:"VLN-48298",customer:"Fatima Abdullahi",items:"Adire Joggers (S, Forest) ×1",total:"₦70,000",status:"Processing",date:"Today, 9:02am"},
    {id:"VLN-48295",customer:"Chukwudi Eze",items:"V.I. Sherpa (M, Ivory) ×1",total:"₦117,000",status:"Shipped",date:"Yesterday"},
    {id:"VLN-48289",customer:"Ngozi Williams",items:"Lagos Noir Pullover (L, Obsidian) ×1",total:"₦73,000",status:"Delivered",date:"Yesterday"},
  ];
  const SC = { Paid:"var(--green)", Processing:"#E0A04A", Shipped:"#5A9BE0", Delivered:"var(--muted)" };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

      {notif && (
        <div className="notif-toast">
          <div style={{ fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--gold)", marginBottom:6 }}>🛍 New Order</div>
          <div style={{ fontSize:"13px", fontWeight:600 }}>{notif.name}</div>
          <div style={{ fontSize:"11px", color:"var(--muted)" }}>{notif.size}, {notif.color} — {notif.price}</div>
        </div>
      )}

      {formModal && <ProductFormModal product={formModal==="add" ? null : formModal} onSave={handleSave} onClose={() => setFormModal(null)} />}
      {archiveModal && <ArchiveModal product={archiveModal} onConfirm={() => handleArchive(archiveModal)} onClose={() => setArchiveModal(null)} />}

      {/* Sidebar */}
      <div style={{ width:240, background:"var(--surface)", borderRight:"1px solid var(--subtle)", display:"flex", flexDirection:"column", padding:"28px 0", flexShrink:0 }} className="desktop-only">
        <div style={{ padding:"0 24px", marginBottom:32 }}>
          <div className="serif" style={{ fontSize:"20px", letterSpacing:"4px" }}>VØLAN</div>
          <div style={{ fontSize:"10px", letterSpacing:"2px", color:"var(--muted)", textTransform:"uppercase", marginTop:2 }}>Admin Panel</div>
        </div>
        {[{id:"dashboard",icon:BarChart2,label:"Dashboard"},{id:"orders",icon:Package,label:"Orders"},{id:"products",icon:Grid,label:"Products"},{id:"analytics",icon:TrendingUp,label:"Analytics"},{id:"settings",icon:Settings,label:"Settings"}].map(({id,icon:Icon,label}) => (
          <button key={id} onClick={() => setTab(id)} style={{ width:"100%", background:tab===id?"rgba(201,169,110,0.12)":"transparent", border:"none", borderLeft:`2px solid ${tab===id?"var(--gold)":"transparent"}`, padding:"12px 24px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, color:tab===id?"var(--gold)":"var(--muted)", fontFamily:"'DM Sans'", fontSize:"13px", fontWeight:tab===id?600:400, transition:"all .2s" }}>
            <Icon size={16} /> {label}
          </button>
        ))}
        <div style={{ marginTop:"auto", padding:"0 24px" }}>
          <button onClick={() => setLoggedIn(false)} style={{ display:"flex", alignItems:"center", gap:8, background:"none", border:"none", cursor:"pointer", color:"var(--muted)", fontSize:"13px", fontFamily:"'DM Sans'" }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:"auto", padding:"32px 40px 80px" }}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
              <div>
                <div className="serif" style={{ fontSize:"28px", fontWeight:300 }}>Good morning, Admin 👋</div>
                <div style={{ fontSize:"13px", color:"var(--muted)", marginTop:4 }}>Here's what's happening today.</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(92,171,125,0.1)", border:"1px solid rgba(92,171,125,0.3)", borderRadius:100, padding:"6px 14px" }}>
                <div className="live-dot" /> <span style={{ fontSize:"11px", color:"var(--green)", letterSpacing:"1px" }}>LIVE</span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16, marginBottom:40 }}>
              {[{l:"Total Revenue",v:"₦12,480,000",s:"+18% this month",i:TrendingUp},{l:"Orders (Month)",v:"247",s:"₦3,200,000 revenue",i:Package},{l:"Active Visitors",v:"38",s:"6 in checkout",i:Users},{l:"Products Live",v:String(activeProds.length),s:`${draftProds.length} in draft`,i:Grid}].map(({l,v,s,i:Icon}) => (
                <div key={l} className="stat-card">
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                    <div style={{ fontSize:"11px", letterSpacing:"1.5px", textTransform:"uppercase", color:"var(--muted)" }}>{l}</div>
                    <div style={{ width:32, height:32, borderRadius:8, background:"rgba(201,169,110,0.12)", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={16} style={{ color:"var(--gold)" }} /></div>
                  </div>
                  <div className="serif" style={{ fontSize:"28px", fontWeight:400, marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:"12px", color:"var(--green)" }}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:32 }}>
              {[{label:"On Site",val:38},{label:"In Cart",val:12},{label:"Checkout",val:6},{label:"Orders/hr",val:4}].map(({label,val}) => (
                <div key={label} className="card" style={{ padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"12px", color:"var(--muted)", letterSpacing:"1px", textTransform:"uppercase" }}>{label}</span>
                  <span style={{ fontSize:"22px", fontWeight:700, color:"var(--gold)" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:16 }}>Recent Orders</div>
            <div className="card" style={{ overflow:"hidden" }}>
              {ORDERS.slice(0,3).map((o,i) => (
                <div key={o.id} style={{ padding:"16px 20px", borderBottom:i<2?"1px solid var(--subtle)":"none", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:"13px", fontWeight:600, color:"var(--gold)" }}>{o.id}</span>
                      <span className="tag" style={{ background:`${SC[o.status]}22`, color:SC[o.status], fontSize:"9px" }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize:"12px", color:"var(--muted)" }}>{o.customer} · {o.items}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"14px", fontWeight:600 }}>{o.total}</div>
                    <div style={{ fontSize:"11px", color:"var(--muted)" }}>{o.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==="orders" && (
          <div className="fade-in">
            <div className="serif" style={{ fontSize:"28px", fontWeight:300, marginBottom:32 }}>Order Management</div>
            <div className="card" style={{ overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1.5fr 2fr 0.8fr 0.8fr 1fr", padding:"12px 20px", borderBottom:"1px solid var(--subtle)", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)" }}>
                {["Order","Customer","Items","Total","Status","Date"].map(h => <span key={h}>{h}</span>)}
              </div>
              {ORDERS.map((o,i) => (
                <div key={o.id} className="admin-row" style={{ display:"grid", gridTemplateColumns:"1.2fr 1.5fr 2fr 0.8fr 0.8fr 1fr", padding:"16px 20px", borderBottom:i<ORDERS.length-1?"1px solid var(--subtle)":"none", fontSize:"13px", alignItems:"center" }}>
                  <span style={{ color:"var(--gold)", fontWeight:600 }}>{o.id}</span>
                  <span>{o.customer}</span>
                  <span style={{ fontSize:"12px", color:"var(--muted)" }}>{o.items}</span>
                  <span style={{ fontWeight:600 }}>{o.total}</span>
                  <span className="tag" style={{ background:`${SC[o.status]}22`, color:SC[o.status], fontSize:"9px", textAlign:"center" }}>{o.status}</span>
                  <span style={{ fontSize:"11px", color:"var(--muted)" }}>{o.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab==="products" && (
          <div className="fade-in">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div className="serif" style={{ fontSize:"28px", fontWeight:300 }}>Products</div>
              <button className="btn-primary" onClick={() => setFormModal("add")} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Filter tabs */}
            <div style={{ display:"flex", gap:4, marginBottom:28, background:"var(--surface2)", borderRadius:100, padding:4, width:"fit-content" }}>
              {[{id:"active",label:`Active (${activeProds.length})`},{id:"draft",label:`Drafts (${draftProds.length})`},{id:"archived",label:`Archived (${archivedProds.length})`}].map(({id,label}) => (
                <button key={id} onClick={() => setProductFilter(id)} style={{ padding:"8px 18px", borderRadius:100, border:"none", cursor:"pointer", background:productFilter===id?"var(--gold)":"transparent", color:productFilter===id?"#000":"var(--muted)", fontSize:"12px", fontFamily:"'DM Sans'", fontWeight:productFilter===id?600:400, transition:"all .25s ease", letterSpacing:".5px" }}>
                  {label}
                </button>
              ))}
            </div>

            {displayProds.length === 0
              ? <div style={{ textAlign:"center", padding:"60px 0", color:"var(--muted)" }}>
                  <Grid size={40} style={{ opacity:.2, marginBottom:12 }} />
                  <div style={{ fontSize:"14px" }}>{productFilter==="archived" ? "No archived products" : "No products here yet"}</div>
                  {productFilter==="active" && <button className="btn-primary" onClick={() => setFormModal("add")} style={{ marginTop:16 }}>Add Your First Product</button>}
                </div>
              : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                  {displayProds.map(p => (
                    <div key={p.id} className="card" style={{ overflow:"hidden", opacity:p.archived?0.7:1 }}>
                      <div style={{ position:"relative", aspectRatio:"3/2", background:"var(--surface2)" }}>
                        <PlaceholderImage id={p.images[0]} />
                        <div style={{ position:"absolute", top:10, right:10 }}>
                          {p.archived
                            ? <span className="tag" style={{ background:"rgba(136,136,128,0.2)", border:"1px solid var(--muted)", color:"var(--muted)" }}>Archived</span>
                            : p.status==="draft"
                              ? <span className="tag" style={{ background:"rgba(224,160,74,0.2)", border:"1px solid #E0A04A", color:"#E0A04A" }}>Draft</span>
                              : <span className="tag" style={{ background:"rgba(92,171,125,0.2)", border:"1px solid var(--green)", color:"var(--green)" }}>Live</span>
                          }
                        </div>
                        <div style={{ position:"absolute", top:10, left:10 }}>
                          <span className="tag" style={{ background:"rgba(8,8,8,0.7)", color:"var(--muted)", fontSize:"9px" }}>{p.category}</span>
                        </div>
                      </div>
                      <div style={{ padding:16 }}>
                        <div style={{ fontSize:"11px", fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", marginBottom:4 }}>{p.name}</div>
                        <div style={{ fontSize:"14px", color:"var(--gold)", marginBottom:12 }}>₦{p.price.toLocaleString()}</div>

                        {/* Quick stock adjust per size */}
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:14 }}>
                          {Object.entries(p.sizes).map(([size,stock]) => (
                            <div key={size} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                              <span style={{ fontSize:"9px", color:"var(--muted)", fontWeight:600, letterSpacing:"1px" }}>{size}</span>
                              <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                                <button onClick={() => adjustStock(p.id,size,-1)} style={{ width:16, height:16, borderRadius:"50%", background:"var(--surface3)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                  <Minus size={8} style={{ color:"var(--muted)" }} />
                                </button>
                                <span style={{ fontSize:"12px", fontWeight:700, color:stock===0?"var(--red)":stock<=3?"#E0A04A":"var(--green)", minWidth:18, textAlign:"center" }}>{stock}</span>
                                <button onClick={() => adjustStock(p.id,size,1)} style={{ width:16, height:16, borderRadius:"50%", background:"var(--surface3)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                                  <Plus size={8} style={{ color:"var(--muted)" }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display:"flex", gap:8 }}>
                          {p.archived
                            ? <button onClick={() => handleRestore(p)} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:100, border:"1px solid rgba(92,171,125,0.5)", background:"rgba(92,171,125,0.08)", color:"var(--green)", cursor:"pointer", fontSize:"11px", fontFamily:"'DM Sans'", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", transition:"all .2s" }}>
                                <RotateCcw size={12} /> Restore
                              </button>
                            : <>
                                <button
                                  onClick={() => setFormModal(p)}
                                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px 12px", borderRadius:100, border:"1px solid var(--subtle)", background:"transparent", color:"var(--text)", cursor:"pointer", fontSize:"11px", fontFamily:"'DM Sans'", fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", transition:"all .2s" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.color="var(--gold)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--subtle)"; e.currentTarget.style.color="var(--text)"; }}
                                >
                                  <Edit2 size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => toggleStatus(p)}
                                  title={p.status==="published" ? "Set to Draft" : "Publish"}
                                  style={{ width:36, height:36, borderRadius:"50%", border:"1px solid var(--subtle)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", transition:"all .2s" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold)"; e.currentTarget.style.color="var(--gold)"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--subtle)"; e.currentTarget.style.color="var(--muted)"; }}
                                >
                                  {p.status==="published" ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                                <button
                                  onClick={() => setArchiveModal(p)}
                                  title="Archive"
                                  style={{ width:36, height:36, borderRadius:"50%", border:"1px solid rgba(224,92,92,0.3)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--red)", transition:"all .2s" }}
                                  onMouseEnter={e => e.currentTarget.style.background="rgba(224,92,92,0.1)"}
                                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {tab==="analytics" && (
          <div className="fade-in">
            <div className="serif" style={{ fontSize:"28px", fontWeight:300, marginBottom:32 }}>Analytics</div>
            <div className="card" style={{ padding:32, marginBottom:24 }}>
              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:20 }}>Revenue — Last 7 Days</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
                {[65,80,45,90,110,75,130].map((h,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                    <div style={{ width:"100%", height:`${h}%`, background:`rgba(201,169,110,${0.3+(h/130)*.7})`, borderRadius:"4px 4px 0 0" }} />
                    <span style={{ fontSize:"10px", color:"var(--muted)" }}>{["M","T","W","T","F","S","S"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div className="card" style={{ padding:24 }}>
                <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:16 }}>Top Products</div>
                {[["Harmattan Hoodie",94],["Vølan Longsleeve",78],["Senatorial Shirt",65],["V.I. Sherpa",42]].map(([name,units]) => (
                  <div key={name} style={{ marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:"12px" }}>{name}</span>
                      <span style={{ fontSize:"12px", color:"var(--gold)" }}>{units}</span>
                    </div>
                    <div style={{ height:4, background:"var(--surface3)", borderRadius:2 }}>
                      <div style={{ height:"100%", width:`${(units/94)*100}%`, background:"var(--gold)", borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ padding:24 }}>
                <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:16 }}>Revenue by Period</div>
                {[["This Week","₦842,000"],["This Month","₦3,200,000"],["This Year","₦12,480,000"]].map(([period,val]) => (
                  <div key={period} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--subtle)" }}>
                    <span style={{ fontSize:"13px", color:"var(--muted)" }}>{period}</span>
                    <span className="serif" style={{ fontSize:"18px", color:"var(--gold)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab==="settings" && (
          <div className="fade-in" style={{ maxWidth:560 }}>
            <div className="serif" style={{ fontSize:"28px", fontWeight:300, marginBottom:32 }}>Settings</div>
            <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:16 }}>Shipping Rates (₦)</div>
            {[{label:"Lagos (Base Rate)",def:5000},{label:"South West (+)",def:7000},{label:"South South (+)",def:8000},{label:"North (+)",def:9000}].map(({label,def}) => (
              <div key={label} className="card" style={{ padding:"16px 20px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:"13px", color:"var(--muted)" }}>{label}</span>
                <input className="input-field" defaultValue={`₦${def.toLocaleString()}`} style={{ width:130, textAlign:"right" }} />
              </div>
            ))}
            <button className="btn-primary" onClick={() => setToast({message:"Settings saved successfully",type:"success"})} style={{ marginTop:20, display:"flex", alignItems:"center", gap:8 }}>
              <Check size={14} /> Save Settings
            </button>
            <div style={{ marginTop:40, padding:20, background:"var(--surface2)", borderRadius:"var(--radius)", border:"1px solid var(--subtle)" }}>
              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", marginBottom:12 }}>Database Status</div>
              <div style={{ fontSize:"13px", color:"var(--text)", marginBottom:6 }}>Currently using: <strong style={{ color:"var(--gold)" }}>localStorage</strong></div>
              <div style={{ fontSize:"12px", color:"var(--muted)", lineHeight:1.7 }}>
                Data persists in this browser. To go fully live, connect Supabase or Firebase — see the comment block at the top of App.jsx for step-by-step upgrade instructions (takes ~15 mins).
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [entered, setEntered]       = useState(false);
  const [page, setPage]             = useState("shop");
  const [cart, setCart]             = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [selectedProduct, setSP]    = useState(null);
  const [currency, setCurrency]     = useState(CURRENCIES[0]);
  const [orderSuccess, setOS]       = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth <= 768);
  const [products, setProductsRaw] = useState(SEED_PRODUCTS);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    db.getProducts().then(data => {
      if (data && data.length > 0) setProductsRaw(data);
      setProductsLoaded(true);
    });
  }, []);

  const setProducts = useCallback((updated) => {
    setProductsRaw(updated);
  }, []);

  useEffect(() => {
    const f = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  const addToCart = useCallback((item) => {
    const stock = item.product.sizes[item.size] || 0;
    let currentInCart = 0;
    setCart(c => {
      const idx = c.findIndex(i => i.product.id===item.product.id && i.size===item.size && i.color===item.color);
      currentInCart = idx >= 0 ? c[idx].qty : 0;
      if (currentInCart >= stock) return c;
      if (idx >= 0) return c.map((ci,i) => i===idx ? {...ci, qty:ci.qty+1} : ci);
      return [...c, item];
    });
    // Read cart synchronously to check if we actually have room
    const canAdd = currentInCart < stock;
    if (canAdd) setCartOpen(true);
    return canAdd;
  }, []);

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const nav = (p) => { setPage(p); setSP(null); };

  if (!entered) return <><GlobalStyles /><EntryScreen onEnter={() => setEntered(true)} /></>;
  if (page === "admin") return <><GlobalStyles /><AdminPanel products={products} setProducts={setProducts} /></>;

  if (orderSuccess) return (
    <><GlobalStyles />
    <Navbar cartCount={0} setPage={nav} page={page} setCartOpen={setCartOpen} />
    <OrderSuccess onContinue={() => { setOS(false); setCart([]); nav("shop"); }} /></>
  );

  return (
    <>
      <GlobalStyles />
      <Navbar cartCount={cartCount} setPage={nav} page={page} setCartOpen={setCartOpen} />

      {page==="shop"    && <ShopPage setPage={setPage} setSelectedProduct={setSP} currency={currency} category={null} products={products} />}
      {page==="pants"   && <ShopPage setPage={setPage} setSelectedProduct={setSP} currency={currency} category="pants" products={products} />}
      {page==="shirts"  && <ShopPage setPage={setPage} setSelectedProduct={setSP} currency={currency} category="shirts" products={products} />}
      {page==="hoodies" && <ShopPage setPage={setPage} setSelectedProduct={setSP} currency={currency} category="hoodies" products={products} />}
      {page==="product" && selectedProduct && <ProductPage product={selectedProduct} onBack={() => nav("shop")} addToCart={addToCart} currency={currency} />}
      {page==="checkout" && (<CheckoutPage cart={cart} currency={currency} onBack={() => setCartOpen(true)} onSuccess={async () => { for (const item of cart) { const product = products.find(p => p.id === item.product.id); if (!product) continue; const newSizes = { ...product.sizes, [item.size]: Math.max(0, (product.sizes[item.size] || 0) - item.qty) }; await db.updateSizes(product.id, newSizes); } const refreshed = await db.getProducts(); if (refreshed) setProductsRaw(refreshed); setOS(true); }} /> )}
      {page==="account" && <AccountPage />}

      {cartOpen && (
        <CartDrawer
          cart={cart} setCart={setCart} currency={currency}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); nav("checkout"); }}
          isMobile={isMobile}
        />
      )}

      <CurrencySwitcher currency={currency} setCurrency={setCurrency} />

      <div style={{ position:"fixed", bottom:20, right:20, zIndex:50 }} className="desktop-only">
        <button onClick={() => nav("admin")} style={{ background:"rgba(17,17,17,0.8)", border:"1px solid var(--subtle)", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"var(--muted)", fontFamily:"'DM Sans'", backdropFilter:"blur(10px)" }}>
          Admin ↗
        </button>
      </div>
    </>
  );
}
