// Endose CRM — Full Supabase-backed React App
// Single JSX file with all 20 sections

import { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://tlopaxeodqemfdghgviy.supabase.co";
const STORAGE_BASE = "https://tlopaxeodqemfdghgviy.supabase.co/storage/v1/object/public/portfolio-images";
const PORTFOLIO_PHOTOS = {
  "Rex's Ice Cream": STORAGE_BASE + "/rexs-logo-seating.jpg",
  "Tier Zero Production Studio": STORAGE_BASE + "/tier-zero-office.jpg",
  "Shoot for Peace Studio 2023": STORAGE_BASE + "/court-game.jpg",
  "Nuit Blanche x Union Station": STORAGE_BASE + "/nuit-blanche-tunnel.jpg",
  "Tier Zero Rental Studio": STORAGE_BASE + "/tier-zero-backdrop.jpg",
  "Kickback Basketball Court": STORAGE_BASE + "/court-aerial.jpg",
  "Tier Zero Office": STORAGE_BASE + "/tier-zero-kitchen.jpg",
  "Kickback Studio": STORAGE_BASE + "/kickback-blue-wall.jpg",
  "Insights Gallery": STORAGE_BASE + "/kickback-gallery.jpg",
  "Kayla Grey: Landscape Design": STORAGE_BASE + "/tier-zero-lounge.jpg",
  "Bound: Thesis": STORAGE_BASE + "/tier-zero-mezzanine.jpg",
  "Bulwer House": STORAGE_BASE + "/tier-zero-shelving.jpg",
  "Cliff House": STORAGE_BASE + "/kickback-sneaker-wall.jpg",
};
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsb3BheGVvZHFlbWZkZ2hndml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMTE4NjQsImV4cCI6MjA4OTc4Nzg2NH0.gLVfdgpkWS6YMyXgr0RMr7nYGMdb_nmeh3NkOkrkxAs";

// Supabase client
const sb = {
  headers: { "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
  authHeaders: (token) => ({ "apikey": SUPABASE_ANON_KEY, "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "Prefer": "return=representation" }),

  async signIn(email, password) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST", headers: sb.headers,
      body: JSON.stringify({ email, password })
    });
    return r.json();
  },
  async signOut(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: sb.authHeaders(token) });
  },
  async getUser(token) {
    const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: sb.authHeaders(token) });
    return r.json();
  },
  async select(token, table, filter = "") {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc${filter}`, { headers: sb.authHeaders(token) });
    return r.json();
  },
  async insert(token, table, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST", headers: sb.authHeaders(token), body: JSON.stringify(data)
    });
    return r.json();
  },
  async update(token, table, id, data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH", headers: sb.authHeaders(token), body: JSON.stringify(data)
    });
    return r.json();
  },
  async delete(token, table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE", headers: sb.authHeaders(token)
    });
  }
};

// CSS
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #111110; --white: #FFFFFF; --sand: #F5F2ED; --sand-mid: #EAE6DF;
    --stone: #C8C4BC; --mid: #888780; --text-secondary: #5F5E5A;
    --border: rgba(17,17,16,0.1); --border-med: rgba(17,17,16,0.18);
    --accent: #1D9E75; --accent-light: #E1F5EE; --accent-dark: #085041;
    --amber: #BA7517; --amber-light: #FAEEDA;
    --coral: #D85A30; --coral-light: #FAECE7;
    --blue: #185FA5; --blue-light: #E6F1FB;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--sand); color: var(--black); font-size: 13px; line-height: 1.5; }
  #root { display: flex; height: 100vh; overflow: hidden; }

  /* LOGIN */
  .login-wrap { display: flex; width: 100%; height: 100vh; background: var(--black); }
  .login-left { flex: 1; background: linear-gradient(135deg, #1a1a18 0%, #0d2818 100%); display: flex; flex-direction: column; justify-content: flex-end; padding: 56px; }
  .login-right { width: 420px; background: var(--white); display: flex; flex-direction: column; justify-content: center; padding: 56px 48px; }
  .login-brand { font-family: 'DM Serif Display', serif; font-size: 48px; color: #fff; line-height: 1; margin-bottom: 8px; }
  .login-tagline { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
  .login-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--stone); margin-bottom: 28px; }
  .login-title { font-family: 'DM Serif Display', serif; font-size: 26px; color: var(--black); margin-bottom: 6px; }
  .login-sub { font-size: 12px; color: var(--mid); margin-bottom: 32px; line-height: 1.6; }
  .form-field { margin-bottom: 14px; }
  .form-field label { display: block; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mid); margin-bottom: 5px; }
  .form-field input, .form-field select, .form-field textarea { width: 100%; padding: 9px 12px; border: 1px solid var(--border-med); border-radius: 7px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: var(--black); background: var(--white); outline: none; transition: border 0.15s; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--accent); }
  .login-btn { width: 100%; padding: 12px; background: var(--black); color: var(--white); border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: 6px; transition: background 0.15s; font-family: 'DM Sans', sans-serif; letter-spacing: 0.04em; }
  .login-btn:hover { background: #2a2a28; }
  .login-error { font-size: 11px; color: var(--coral); margin-top: 8px; text-align: center; }
  .login-note { font-size: 10px; color: var(--stone); margin-top: 24px; }

  /* LAYOUT */
  .sidebar { width: 220px; min-width: 220px; background: var(--white); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow-y: auto; }
  .sidebar-brand { padding: 20px 16px 14px; border-bottom: 1px solid var(--border); }
  .sidebar-brand-name { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--black); }
  .sidebar-brand-tag { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--stone); margin-top: 2px; }
  .nav-group { padding: 8px 0; border-bottom: 1px solid var(--border); }
  .nav-group-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--stone); padding: 0 16px; margin-bottom: 2px; }
  .nav-item { display: flex; align-items: center; gap: 9px; padding: 7px 16px; cursor: pointer; color: var(--text-secondary); transition: all 0.12s; font-size: 12px; border-left: 2px solid transparent; }
  .nav-item:hover { background: var(--sand); color: var(--black); }
  .nav-item.active { color: var(--accent); background: var(--accent-light); border-left-color: var(--accent); font-weight: 500; }
  .nav-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.4; flex-shrink: 0; }
  .nav-count { margin-left: auto; font-size: 10px; background: var(--sand-mid); color: var(--mid); padding: 1px 6px; border-radius: 10px; }
  .sidebar-footer { margin-top: auto; padding: 12px 16px; border-top: 1px solid var(--border); font-size: 10px; color: var(--stone); }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--sand); }
  .topbar { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; gap: 12px; height: 52px; flex-shrink: 0; }
  .topbar-title { font-size: 14px; font-weight: 500; color: var(--black); flex: 1; }
  .content { flex: 1; overflow-y: auto; padding: 22px 24px; background: var(--sand); }

  /* BUTTONS */
  .btn { padding: 7px 14px; border-radius: 6px; border: 1px solid var(--border-med); background: transparent; cursor: pointer; font-size: 12px; color: var(--black); font-family: 'DM Sans', sans-serif; transition: all 0.12s; white-space: nowrap; }
  .btn:hover { background: var(--sand); }
  .btn-dark { background: var(--black); color: var(--white); border-color: var(--black); }
  .btn-dark:hover { background: #333; }
  .btn-danger { border-color: var(--coral); color: var(--coral); }
  .btn-danger:hover { background: var(--coral-light); }

  /* PANELS */
  .panel { background: var(--white); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .panel-head { padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .panel-title { font-size: 12px; font-weight: 500; color: var(--black); }
  .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-h { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--black); font-weight: 400; }
  .section-sub { font-size: 12px; color: var(--mid); margin-top: 1px; }

  /* STATS */
  .stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px; }
  .stat { background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; }
  .stat-label { font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--mid); margin-bottom: 6px; }
  .stat-value { font-size: 24px; font-weight: 300; color: var(--black); font-family: 'DM Serif Display', serif; }
  .stat-sub { font-size: 10px; color: var(--stone); margin-top: 3px; }

  /* GRID */
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }

  /* TABLE */
  .tbl-wrap { overflow-x: auto; }
  .tbl { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 500px; }
  .tbl th { padding: 9px 16px; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--stone); font-weight: 500; background: var(--sand); border-bottom: 1px solid var(--border); white-space: nowrap; }
  .tbl td { padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--black); vertical-align: middle; }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl tr:hover td { background: var(--sand); cursor: pointer; }
  .tbl .name-cell { font-weight: 500; }

  /* BADGE */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 20px; font-size: 10px; font-weight: 500; white-space: nowrap; }
  .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: currentColor; opacity: 0.6; }
  .b-green { background: var(--accent-light); color: var(--accent-dark); }
  .b-amber { background: var(--amber-light); color: #633806; }
  .b-coral { background: var(--coral-light); color: #4A1B0C; }
  .b-blue { background: var(--blue-light); color: #042C53; }
  .b-gray { background: var(--sand-mid); color: var(--text-secondary); }

  /* MODAL */
  .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(17,17,16,0.45); z-index: 100; align-items: center; justify-content: center; }
  .modal-overlay.open { display: flex; }
  .modal { background: var(--white); border-radius: 14px; width: 520px; max-height: 88vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
  .modal-head { padding: 20px 24px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-size: 15px; font-weight: 500; }
  .modal-close { cursor: pointer; font-size: 20px; color: var(--mid); }
  .modal-body { padding: 20px 24px; }
  .modal-foot { padding: 14px 24px; border-top: 1px solid var(--border); display: flex; gap: 8px; justify-content: flex-end; }
  .form-row { margin-bottom: 14px; }
  .form-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* TOAST */
  .toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 8px; font-size: 12px; font-weight: 500; z-index: 9999; transition: all 0.3s; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(0); opacity: 1; }
  .toast.hide { opacity: 0; transform: translateY(8px); }

  /* EMPTY */
  .empty { text-align: center; padding: 48px 20px; color: var(--stone); }
  .empty-icon { font-size: 28px; margin-bottom: 10px; }

  /* LOADING */
  .loading { display: flex; align-items: center; justify-content: center; padding: 48px; color: var(--stone); font-size: 13px; gap: 10px; }
  .spinner { width: 16px; height: 16px; border: 2px solid var(--sand-mid); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* PROGRESS */
  .prog-wrap { display: flex; align-items: center; gap: 8px; }
  .prog-bg { flex: 1; height: 4px; background: var(--sand-mid); border-radius: 2px; overflow: hidden; min-width: 50px; }
  .prog-fill { height: 100%; border-radius: 2px; background: var(--accent); }
  .prog-pct { font-size: 10px; color: var(--mid); width: 28px; text-align: right; }

  /* SEARCH */
  .search-wrap { position: relative; flex: 0 0 220px; }
  .search-input { width: 100%; padding: 6px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 12px; font-family: 'DM Sans', sans-serif; background: var(--sand); color: var(--black); outline: none; }
  .search-input:focus { border-color: var(--stone); background: var(--white); }
  .search-results { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--white); border: 1px solid var(--border-med); border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 200; overflow: hidden; }
  .search-result-item { padding: 10px 18px; cursor: pointer; border-bottom: 1px solid var(--border); transition: background 0.1s; }
  .search-result-item:hover { background: var(--sand); }
  .search-result-item:last-child { border-bottom: none; }
  .search-section { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--stone); margin-bottom: 2px; }
  .search-label { font-size: 12.5px; font-weight: 500; color: var(--black); }
  .search-sub { font-size: 11px; color: var(--mid); }

  /* KANBAN */
  .kanban { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: start; }
  .kanban-col { background: var(--sand); border-radius: 10px; padding: 12px; }
  .kanban-col-title { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; margin-bottom: 10px; }
  .kanban-card { background: var(--white); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
  .kanban-card:hover { border-color: var(--stone); transform: translateY(-1px); }
  .kanban-card-name { font-size: 12px; font-weight: 500; color: var(--black); margin-bottom: 3px; }
  .kanban-card-client { font-size: 11px; color: var(--mid); margin-bottom: 8px; }

  @media (max-width: 768px) {
    #root { flex-direction: column; height: auto; min-height: 100vh; }
    .sidebar { width: 100%; min-width: unset; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid var(--border); }
    .sidebar-brand { width: 100%; }
    .nav-group { display: flex; flex-direction: row; flex-wrap: wrap; padding: 4px 8px; border-bottom: none; }
    .nav-group-label { display: none; }
    .nav-item { padding: 5px 10px; font-size: 11px; border-left: none; border-bottom: 2px solid transparent; }
    .nav-item.active { border-left: none; border-bottom-color: var(--accent); }
    .main { flex: 1; }
    .stats-row { grid-template-columns: repeat(2, 1fr); }
    .grid2 { grid-template-columns: 1fr; }
    .kanban { grid-template-columns: 1fr 1fr; }
    .login-left { display: none; }
    .login-right { width: 100%; }
  }
`;

// Badge helper
const badge = (s) => {
  const map = { Active:"b-green", Paid:"b-green", Accepted:"b-green", Signed:"b-green",
    Upcoming:"b-blue", Outstanding:"b-coral", Pending:"b-amber", Inactive:"b-gray",
    Past:"b-gray", "Pre-Design":"b-gray", "Schematic Design":"b-blue",
    "Design Development":"b-amber", "Construction Docs":"b-coral",
    "Closed Won":"b-green", Discovery:"b-blue", Proposal:"b-amber",
    Negotiation:"b-coral", Available:"b-green", "On Project":"b-amber" };
  return <span className={`badge ${map[s]||"b-gray"}`}>{s}</span>;
};

const progBar = (p) => (
  <div className="prog-wrap">
    <div className="prog-bg"><div className="prog-fill" style={{width:`${p||0}%`}}></div></div>
    <div className="prog-pct">{p||0}%</div>
  </div>
);

// Toast
let toastTimer;
const Toast = ({ msg, type, visible }) => {
  if (!msg) return null;
  return (
    <div className={`toast ${visible ? "" : "hide"}`}
      style={{background: type === "error" ? "#D85A30" : "#1D9E75", color: "#fff"}}>
      {msg}
    </div>
  );
};

// Modal
const Modal = ({ open, title, children, footer, onClose }) => (
  <div className={`modal-overlay ${open ? "open" : ""}`} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-head">
        <span className="modal-title">{title}</span>
        <span className="modal-close" onClick={onClose}>×</span>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-foot">{footer}</div>}
    </div>
  </div>
);

// Main App
export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState("dashboard");
  const [data, setData] = useState({
    projects:[], clients:[], leads:[], vendors:[], contractors:[],
    invoices:[], receipts:[], payments:[], contacts:[],
    retainers:[], changeorders:[], portfolio:[], files:[], notes:""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg:"", type:"success", visible:false });
  const [modal, setModal] = useState({ open:false, type:"", record:null });
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const showToast = (msg, type="success") => {
    setToast({ msg, type, visible:true });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(t => ({...t, visible:false})), 3000);
  };

  const token = session?.access_token;

  // Load all data
  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [projects, clients, leads, vendors, contractors,
             invoices, receipts, payments, contacts,
             retainers, changeorders, portfolio, files, notes] = await Promise.all([
        sb.select(token, "projects"),
        sb.select(token, "clients"),
        sb.select(token, "leads"),
        sb.select(token, "vendors"),
        sb.select(token, "contractors"),
        sb.select(token, "invoices"),
        sb.select(token, "receipts"),
        sb.select(token, "payments"),
        sb.select(token, "contacts"),
        sb.select(token, "retainers"),
        sb.select(token, "change_orders"),
        sb.select(token, "portfolio"),
        sb.select(token, "files"),
        sb.select(token, "notes"),
      ]);
      setData({
        projects: Array.isArray(projects) ? projects : [],
        clients: Array.isArray(clients) ? clients : [],
        leads: Array.isArray(leads) ? leads : [],
        vendors: Array.isArray(vendors) ? vendors : [],
        contractors: Array.isArray(contractors) ? contractors : [],
        invoices: Array.isArray(invoices) ? invoices : [],
        receipts: Array.isArray(receipts) ? receipts : [],
        payments: Array.isArray(payments) ? payments : [],
        contacts: Array.isArray(contacts) ? contacts : [],
        retainers: Array.isArray(retainers) ? retainers : [],
        changeorders: Array.isArray(changeorders) ? changeorders : [],
        portfolio: Array.isArray(portfolio) ? portfolio : [],
        files: Array.isArray(files) ? files : [],
        notes: Array.isArray(notes) && notes[0] ? notes[0].content : "",
      });
    } catch(e) {
      showToast("Error loading data", "error");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { if (token) loadAll(); }, [token, loadAll]);

  // Search
  useEffect(() => {
    if (!searchQ || searchQ.length < 2) { setSearchResults([]); return; }
    const q = searchQ.toLowerCase();
    const results = [];
    data.projects.forEach(p => { if ((p.name||"").toLowerCase().includes(q)) results.push({section:"Projects", label:p.name, sub:p.client, view:"projects"}); });
    data.clients.forEach(c => { if ((c.name||"").toLowerCase().includes(q)) results.push({section:"Clients", label:c.name, sub:c.org, view:"clients"}); });
    data.leads.forEach(l => { if ((l.contact||"").toLowerCase().includes(q)) results.push({section:"Leads", label:l.contact, sub:l.org, view:"leads"}); });
    data.invoices.forEach(i => { if ((i.client||"").toLowerCase().includes(q)) results.push({section:"Invoices", label:i.inv_number+" — "+i.client, sub:i.amount, view:"invoices"}); });
    setSearchResults(results.slice(0,8));
  }, [searchQ, data]);

  // Add record
  const addRecord = async (table, record) => {
    if (!token) return;
    const result = await sb.insert(token, table, {...record, user_id: session.user.id});
    if (result && !result.error) {
      showToast("Saved ✓");
      await loadAll();
      setModal({ open:false, type:"", record:null });
    } else {
      showToast("Save failed ✗", "error");
    }
  };

  // Delete record
  const deleteRecord = async (table, id) => {
    if (!token || !window.confirm("Delete this record? This cannot be undone.")) return;
    await sb.delete(token, table, id);
    showToast("Deleted");
    await loadAll();
    setModal({ open:false, type:"", record:null });
  };

  // Update record
  const updateRecord = async (table, id, updates) => {
    if (!token) return;
    await sb.update(token, table, id, updates);
    showToast("Updated ✓");
    await loadAll();
    setModal({ open:false, type:"", record:null });
  };

  if (!session) return <LoginScreen onLogin={setSession} />;

  const navGroups = [
    { label:"Overview", items:[{ key:"dashboard", label:"Dashboard" }] },
    { label:"Work", items:[
      { key:"projects", label:"Active Projects", count:data.projects.length },
      { key:"kanban", label:"Project Board" },
      { key:"portfolio", label:"Completed Projects", count:data.portfolio.length },
      { key:"timeline", label:"Timeline" },
      { key:"files", label:"Files & Media", count:data.files.length },
    ]},
    { label:"People", items:[
      { key:"clients", label:"Clients", count:data.clients.length },
      { key:"contacts", label:"Contact Log" },
      { key:"leads", label:"Leads", count:data.leads.length },
      { key:"vendors", label:"Vendors", count:data.vendors.length },
      { key:"contractors", label:"Contractors", count:data.contractors.length },
    ]},
    { label:"Finance", items:[
      { key:"invoices", label:"Invoices & Proposals", count:data.invoices.length },
      { key:"invoicegen", label:"Invoice Generator" },
      { key:"proposals", label:"Proposal Generator" },
      { key:"feecalc", label:"Fee Calculator" },
      { key:"receipts", label:"Receipts", count:data.receipts.length },
      { key:"payments", label:"Contractor Payments" },
      { key:"retainers", label:"Retainer Tracker" },
      { key:"changeorders", label:"Change Orders" },
      { key:"expensereport", label:"Expense Report" },
    ]},
  ];

  const titles = { dashboard:"Dashboard", projects:"Active Projects", kanban:"Project Board", portfolio:"Completed Projects", timeline:"Timeline", files:"Files & Media", clients:"Clients", contacts:"Contact Log", leads:"Lead Pipeline", vendors:"Vendors", contractors:"Consultants & Contractors", invoices:"Invoices & Proposals", invoicegen:"Invoice Generator", proposals:"Proposal Generator", feecalc:"Fee Calculator", receipts:"Receipts", payments:"Contractor Payments", retainers:"Retainer Tracker", changeorders:"Change Order Log", expensereport:"Expense Report" };

  return (
    <>
      <style>{css}</style>
      <div id="root">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand-name">Endose</div>
            <div className="sidebar-brand-tag">Design CRM</div>
          </div>
          {navGroups.map(g => (
            <div className="nav-group" key={g.label}>
              <div className="nav-group-label">{g.label}</div>
              {g.items.map(item => (
                <div key={item.key} className={`nav-item ${view===item.key?"active":""}`} onClick={() => setView(item.key)}>
                  <div className="nav-dot"></div>
                  {item.label}
                  {item.count !== undefined && <span className="nav-count">{item.count}</span>}
                </div>
              ))}
            </div>
          ))}
          <div className="sidebar-footer">
            Endose © 2025 · <span style={{cursor:"pointer", color:"var(--accent)"}} onClick={() => { sb.signOut(token); setSession(null); }}>Sign out</span>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-title">{titles[view]||view}</div>
            <div className="search-wrap">
              <input className="search-input" placeholder="Search..." value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                onBlur={() => setTimeout(() => setSearchResults([]), 200)} />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((r,i) => (
                    <div key={i} className="search-result-item" onClick={() => { setView(r.view); setSearchQ(""); setSearchResults([]); }}>
                      <div className="search-section">{r.section}</div>
                      <div className="search-label">{r.label}</div>
                      <div className="search-sub">{r.sub}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="content">
            {loading ? <div className="loading"><div className="spinner"></div>Loading...</div> : (
              <>
                {view === "dashboard" && <Dashboard data={data} setView={setView} />}
                {view === "projects" && <ProjectsView data={data} onAdd={() => setModal({open:true,type:"project",record:null})} onRow={r => setModal({open:true,type:"project-detail",record:r})} />}
                {view === "kanban" && <KanbanView data={data} onCard={r => setModal({open:true,type:"project-detail",record:r})} />}
                {view === "portfolio" && <PortfolioView data={data} onAdd={() => setModal({open:true,type:"portfolio",record:null})} />}
                {view === "clients" && <ClientsView data={data} onAdd={() => setModal({open:true,type:"client",record:null})} onRow={r => setModal({open:true,type:"client-detail",record:r})} />}
                {view === "leads" && <LeadsView data={data} onAdd={() => setModal({open:true,type:"lead",record:null})} onRow={r => setModal({open:true,type:"lead-detail",record:r})} />}
                {view === "vendors" && <SimpleTable title="Vendors" subtitle="Material suppliers & service providers" cols={["Name","Category","Contact","Email","Phone","Status"]} rows={data.vendors.map(v=>[v.name,<span className="badge b-gray">{v.cat}</span>,v.contact,v.email,v.phone,badge(v.status||"Active")])} onAdd={() => setModal({open:true,type:"vendor",record:null})} onRow={r => setModal({open:true,type:"vendor-detail",record:data.vendors[r]})} />}
                {view === "contractors" && <SimpleTable title="Consultants & Contractors" subtitle="Specialist collaborators & consultants" cols={["Name","Specialty","Project","Rate","Contract","Status"]} rows={data.contractors.map(c=>[c.name,c.specialty,c.project,c.rate,badge(c.contract||"Pending"),badge(c.status||"Active")])} onAdd={() => setModal({open:true,type:"contractor",record:null})} onRow={r => setModal({open:true,type:"contractor-detail",record:data.contractors[r]})} />}
                {view === "invoices" && <InvoicesView data={data} onAdd={() => setModal({open:true,type:"invoice",record:null})} onRow={r => setModal({open:true,type:"invoice-detail",record:r})} />}
                {view === "receipts" && <SimpleTable title="Receipts" subtitle="Project expenses & procurement records" cols={["Description","Project","Category","Amount","Date","Reimbursable"]} rows={data.receipts.map(r=>[r.desc,r.project,<span className="badge b-gray">{r.cat}</span>,r.amount,r.date,r.reimb==="Yes"?<span className="badge b-green">Yes</span>:<span className="badge b-gray">No</span>])} onAdd={() => setModal({open:true,type:"receipt",record:null})} />}
                {view === "payments" && <SimpleTable title="Contractor Payments" subtitle="Payments issued to consultants & contractors" cols={["Contractor","Project","Amount","Date","Method","Status"]} rows={data.payments.map(p=>[p.contractor,p.project,p.amount,p.date,<span className="badge b-gray">{p.method}</span>,badge(p.status||"Paid")])} onAdd={() => setModal({open:true,type:"payment",record:null})} />}
                {view === "contacts" && <SimpleTable title="Contact Log" subtitle="Calls, emails & meetings per client" cols={["Date","Client","Type","Summary","Follow-up"]} rows={data.contacts.map(c=>[c.date,c.client,<span className="badge b-gray">{c.type}</span>,c.summary,c.followup])} onAdd={() => setModal({open:true,type:"contact",record:null})} />}
                {view === "retainers" && <RetainersView data={data} onAdd={() => setModal({open:true,type:"retainer",record:null})} onRow={r => setModal({open:true,type:"retainer-detail",record:r})} />}
                {view === "changeorders" && <SimpleTable title="Change Order Log" subtitle="Scope changes & cost impact per project" cols={["CO #","Project","Description","Cost Impact","Date","Status"]} rows={data.changeorders.map(c=>[c.co_number,c.project,c.description,<strong style={{color:c.cost&&c.cost.startsWith("-")?"var(--coral)":"var(--accent)"}}>{c.cost}</strong>,c.date,badge(c.status||"Pending")])} onAdd={() => setModal({open:true,type:"changeorder",record:null})} />}
                {view === "expensereport" && <ExpenseReport data={data} onAdd={() => setModal({open:true,type:"receipt",record:null})} />}
                {view === "timeline" && <TimelineView data={data} onAdd={() => setModal({open:true,type:"milestone",record:null})} />}
                {view === "files" && <SimpleTable title="Files & Media" subtitle="Drawings, specifications, photos & project assets" cols={["Name","Project","Type","Date"]} rows={data.files.map(f=>[<a href={f.url} target="_blank" rel="noreferrer" style={{color:"var(--accent)"}}>{f.name}</a>,f.project,<span className="badge b-gray">{f.type}</span>,f.date])} onAdd={() => setModal({open:true,type:"file",record:null})} />}
                {view === "invoicegen" && <InvoiceGenerator data={data} />}
                {view === "proposals" && <ProposalGenerator data={data} />}
                {view === "feecalc" && <FeeCalculator />}
              </>
            )}
          </div>
        </main>

        {/* MODALS */}
        <AddModal modal={modal} setModal={setModal} data={data} onSave={addRecord} onDelete={deleteRecord} onUpdate={updateRecord} session={session} />

        {/* TOAST */}
        <Toast {...toast} />
      </div>
    </>
  );
}

// LOGIN SCREEN
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); setError("");
    const result = await sb.signIn(email, password);
    if (result.access_token) {
      onLogin(result);
    } else {
      setError("Incorrect email or password.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-left">
          <div className="login-brand">Endose</div>
          <div className="login-tagline">Architectural Design · Toronto</div>
        </div>
        <div className="login-right">
          <div className="login-label">Design CRM</div>
          <div className="login-title">Welcome back</div>
          <div className="login-sub">Sign in to your studio workspace to manage projects, clients, and finances.</div>
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign In →"}</button>
          <div className="login-note">Endose Studio CRM · Private access only</div>
        </div>
      </div>
    </>
  );
}

// DASHBOARD
function Dashboard({ data, setView }) {
  const totalInvoiced = data.invoices.reduce((s,i) => s + (parseFloat((i.amount||"0").replace(/[^0-9.]/g,""))||0), 0);
  return (
    <div>
      <div className="stats-row">
        <div className="stat"><div className="stat-label">Active Projects</div><div className="stat-value">{data.projects.length}</div><div className="stat-sub">in progress</div></div>
        <div className="stat"><div className="stat-label">Clients</div><div className="stat-value">{data.clients.length}</div><div className="stat-sub">total</div></div>
        <div className="stat"><div className="stat-label">Invoiced YTD</div><div className="stat-value" style={{fontSize:18}}>${Math.round(totalInvoiced).toLocaleString()}</div><div className="stat-sub">total issued</div></div>
        <div className="stat"><div className="stat-label">Leads</div><div className="stat-value">{data.leads.length}</div><div className="stat-sub">in pipeline</div></div>
        <div className="stat"><div className="stat-label">Completed</div><div className="stat-value">{data.portfolio.length}</div><div className="stat-sub">projects</div></div>
      </div>
      <div className="grid2">
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Active Projects</span><span style={{fontSize:11,color:"var(--mid)",cursor:"pointer"}} onClick={()=>setView("projects")}>View all →</span></div>
          {data.projects.length === 0 ? <div className="empty"><div className="empty-icon">📐</div><div>No projects yet</div></div> :
            data.projects.slice(0,5).map(p => (
              <div key={p.id} style={{padding:"10px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  <div style={{fontSize:11,color:"var(--mid)"}}>{p.client}</div>
                </div>
                {badge(p.status||"Pre-Design")}
              </div>
            ))
          }
        </div>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Lead Pipeline</span><span style={{fontSize:11,color:"var(--mid)",cursor:"pointer"}} onClick={()=>setView("leads")}>View all →</span></div>
          {data.leads.length === 0 ? <div className="empty"><div className="empty-icon">🎯</div><div>No leads yet</div></div> :
            data.leads.slice(0,5).map(l => (
              <div key={l.id} style={{padding:"10px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{l.contact}</div><div style={{fontSize:11,color:"var(--mid)"}}>{l.org}</div></div>
                {badge(l.stage||"Discovery")}
              </div>
            ))
          }
        </div>
      </div>
      <div className="grid2">
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Recent Invoices</span><span style={{fontSize:11,color:"var(--mid)",cursor:"pointer"}} onClick={()=>setView("invoices")}>View all →</span></div>
          {data.invoices.length === 0 ? <div className="empty"><div className="empty-icon">📄</div><div>No invoices yet</div></div> :
            data.invoices.slice(0,5).map(i => (
              <div key={i.id} style={{padding:"10px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{i.inv_number} — {i.client}</div><div style={{fontSize:11,color:"var(--mid)"}}>{i.project}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:500}}>{i.amount}</div>{badge(i.status||"Pending")}</div>
              </div>
            ))
          }
        </div>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Contractor Availability</span><span style={{fontSize:11,color:"var(--mid)",cursor:"pointer"}} onClick={()=>setView("contractors")}>View all →</span></div>
          {data.contractors.length === 0 ? <div className="empty"><div className="empty-icon">👷</div><div>No contractors yet</div></div> :
            data.contractors.map(c => (
              <div key={c.id} style={{padding:"9px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500}}>{c.name}</div><div style={{fontSize:10,color:"var(--mid)"}}>{c.specialty}</div></div>
                {badge(c.project && c.project !== "—" ? "On Project" : "Available")}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// PROJECTS VIEW
function ProjectsView({ data, onAdd, onRow }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Active Projects</div><div className="section-sub">In-progress design commissions</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ New Project</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Project</th><th>Client</th><th>Type</th><th>Status</th><th>Progress</th><th>Budget</th><th>Deadline</th></tr></thead>
            <tbody>
              {data.projects.length === 0 ? <tr><td colSpan={7} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No projects yet — add your first</td></tr> :
                data.projects.map((p,i) => (
                  <tr key={p.id} onClick={() => onRow(p)}>
                    <td className="name-cell">{p.name}</td>
                    <td>{p.client}</td>
                    <td><span className="badge b-gray">{p.type}</span></td>
                    <td>{badge(p.status||"Pre-Design")}</td>
                    <td style={{minWidth:120}}>{progBar(p.progress)}</td>
                    <td>{p.budget}</td>
                    <td>{p.deadline}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// KANBAN
function KanbanView({ data, onCard }) {
  const stages = ["Pre-Design","Schematic Design","Design Development","Construction Docs"];
  const colors = {"Pre-Design":"var(--stone)","Schematic Design":"var(--blue)","Design Development":"var(--amber)","Construction Docs":"var(--coral)"};
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Project Board</div><div className="section-sub">Projects by stage</div></div>
      </div>
      <div className="kanban">
        {stages.map(stage => {
          const cards = data.projects.filter(p => p.status === stage);
          return (
            <div className="kanban-col" key={stage}>
              <div className="kanban-col-title" style={{color:colors[stage]}}>{stage} ({cards.length})</div>
              {cards.length === 0 ? <div style={{padding:"20px 0",textAlign:"center",color:"var(--stone)",fontSize:11}}>No projects</div> :
                cards.map(p => (
                  <div className="kanban-card" key={p.id} onClick={() => onCard(p)}>
                    <div className="kanban-card-name">{p.name}</div>
                    <div className="kanban-card-client">{p.client}</div>
                    {progBar(p.progress)}
                    <div style={{fontSize:10,color:"var(--stone)",marginTop:4}}>Due {p.deadline||"—"} · {p.budget||"—"}</div>
                  </div>
                ))
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

// PORTFOLIO
function PortfolioView({ data, onAdd }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Completed Projects</div><div className="section-sub">Delivered architectural works</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ Add Project</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {data.portfolio.length === 0 ? <div className="empty" style={{gridColumn:"1/-1"}}><div className="empty-icon">🏛</div><div>No completed projects yet</div></div> :
          data.portfolio.map(p => (
            <div key={p.id} className="panel" style={{cursor:"default"}}>
              <div style={{height:140,borderRadius:"12px 12px 0 0",overflow:"hidden",position:"relative",background:"var(--black)"}}>
                {PORTFOLIO_PHOTOS[p.name] ? (
                  <img src={PORTFOLIO_PHOTOS[p.name]} alt={p.name}
                    style={{width:"100%",height:"100%",objectFit:"cover",display:"block",opacity:0.9}} />
                ) : (
                  <div style={{height:"100%",background:"var(--black)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:14}}>
                    <div style={{fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:4}}>Endose</div>
                    <div style={{fontFamily:"DM Serif Display, serif",fontSize:15,color:"#fff"}}>{p.name}</div>
                  </div>
                )}
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"6px 10px",background:"linear-gradient(to top,rgba(17,17,16,0.8),transparent)",fontSize:11,fontWeight:500,color:"#fff"}}>{p.name}</div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontSize:12,fontWeight:500}}>{p.name}</div>
                <div style={{fontSize:11,color:"var(--mid)"}}>{p.client}</div>
              </div>
              <div style={{padding:"9px 14px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span className="badge b-gray">{p.type}</span>
                <span style={{fontSize:11,color:"var(--mid)"}}>{p.year}</span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// CLIENTS
function ClientsView({ data, onAdd, onRow }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Clients</div><div className="section-sub">Active & past client contacts</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ New Client</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>Organization</th><th>Type</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
            <tbody>
              {data.clients.length === 0 ? <tr><td colSpan={6} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No clients yet</td></tr> :
                data.clients.map(c => (
                  <tr key={c.id} onClick={() => onRow(c)}>
                    <td className="name-cell">{c.name}</td>
                    <td>{c.org}</td>
                    <td><span className="badge b-gray">{c.type}</span></td>
                    <td style={{color:"var(--mid)"}}>{c.email}</td>
                    <td style={{color:"var(--mid)"}}>{c.phone}</td>
                    <td>{badge(c.status||"Active")}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// LEADS
function LeadsView({ data, onAdd, onRow }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Lead Pipeline</div><div className="section-sub">Prospects & new business opportunities</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ New Lead</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Contact</th><th>Organization</th><th>Stage</th><th>Type</th><th>Est. Value</th><th>Source</th><th>Next Step</th></tr></thead>
            <tbody>
              {data.leads.length === 0 ? <tr><td colSpan={7} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No leads yet</td></tr> :
                data.leads.map(l => (
                  <tr key={l.id} onClick={() => onRow(l)}>
                    <td className="name-cell">{l.contact}</td>
                    <td>{l.org}</td>
                    <td>{badge(l.stage||"Discovery")}</td>
                    <td><span className="badge b-gray">{l.type}</span></td>
                    <td>{l.value}</td>
                    <td style={{color:"var(--mid)"}}>{l.source}</td>
                    <td style={{color:"var(--mid)"}}>{l.next}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// INVOICES
function InvoicesView({ data, onAdd, onRow }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Invoices & Proposals</div><div className="section-sub">Client billing, proposals & contracts</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ New Invoice</button>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>#</th><th>Client</th><th>Project</th><th>Type</th><th>Amount</th><th>Issued</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>
              {data.invoices.length === 0 ? <tr><td colSpan={8} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No invoices yet</td></tr> :
                data.invoices.map(i => (
                  <tr key={i.id} onClick={() => onRow(i)}>
                    <td style={{color:"var(--mid)"}}>{i.inv_number}</td>
                    <td className="name-cell">{i.client}</td>
                    <td>{i.project}</td>
                    <td><span className="badge b-gray">{i.type}</span></td>
                    <td><strong>{i.amount}</strong></td>
                    <td style={{color:"var(--mid)"}}>{i.issued}</td>
                    <td style={{color:"var(--mid)"}}>{i.due}</td>
                    <td>{badge(i.status||"Pending")}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// RETAINERS
function RetainersView({ data, onAdd, onRow }) {
  const active = data.retainers.filter(r => r.status === "Active");
  const monthly = active.reduce((s,r) => s + (parseFloat((r.fee||"0").replace(/[^0-9.]/g,""))||0), 0);
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Retainer Tracker</div><div className="section-sub">Monthly retainer clients & recurring fees</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ Add Retainer</button>
      </div>
      <div className="stats-row" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="stat"><div className="stat-label">Active Retainers</div><div className="stat-value">{active.length}</div></div>
        <div className="stat"><div className="stat-label">Monthly Recurring</div><div className="stat-value" style={{fontSize:18}}>${monthly.toLocaleString()}</div></div>
        <div className="stat"><div className="stat-label">Annual Run Rate</div><div className="stat-value" style={{fontSize:18}}>${(monthly*12).toLocaleString()}</div></div>
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Client</th><th>Project</th><th>Monthly Fee</th><th>Start Date</th><th>Status</th></tr></thead>
            <tbody>
              {data.retainers.length === 0 ? <tr><td colSpan={5} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No retainers yet</td></tr> :
                data.retainers.map(r => (
                  <tr key={r.id} onClick={() => onRow(r)}>
                    <td className="name-cell">{r.client}</td>
                    <td>{r.project}</td>
                    <td style={{fontWeight:500}}>{r.fee}</td>
                    <td style={{color:"var(--mid)"}}>{r.start_date}</td>
                    <td>{badge(r.status||"Active")}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// EXPENSE REPORT
function ExpenseReport({ data, onAdd }) {
  const total = data.receipts.reduce((s,r) => s + (parseFloat((r.amount||"0").replace(/[^0-9.]/g,""))||0), 0);
  const reimb = data.receipts.filter(r=>r.reimb==="Yes").reduce((s,r) => s + (parseFloat((r.amount||"0").replace(/[^0-9.]/g,""))||0), 0);
  const cats = {}, projs = {};
  data.receipts.forEach(r => {
    const amt = parseFloat((r.amount||"0").replace(/[^0-9.]/g,""))||0;
    cats[r.cat||"Other"] = (cats[r.cat||"Other"]||0) + amt;
    projs[r.project||"General"] = (projs[r.project||"General"]||0) + amt;
  });
  const maxCat = Math.max(...Object.values(cats), 1);
  const maxProj = Math.max(...Object.values(projs), 1);
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Expense Report</div><div className="section-sub">Where money is going across all projects</div></div>
        <button className="btn btn-dark" onClick={onAdd}>+ Add Receipt</button>
      </div>
      <div className="stats-row">
        <div className="stat"><div className="stat-label">Total Expenses</div><div className="stat-value" style={{fontSize:18}}>${Math.round(total).toLocaleString()}</div></div>
        <div className="stat"><div className="stat-label">Reimbursable</div><div className="stat-value" style={{fontSize:18}}>${Math.round(reimb).toLocaleString()}</div></div>
        <div className="stat"><div className="stat-label">Receipts</div><div className="stat-value">{data.receipts.length}</div></div>
      </div>
      <div className="grid2">
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Spend by Category</span></div>
          {Object.keys(cats).length === 0 ? <div className="empty">No expenses yet</div> :
            Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat,amt]) => (
              <div key={cat} style={{padding:"9px 16px",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontSize:12}}>{cat}</div>
                  <div style={{fontSize:12,fontWeight:500}}>${Math.round(amt).toLocaleString()}</div>
                </div>
                <div style={{height:4,background:"var(--sand-mid)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.round(amt/maxCat*100)}%`,background:"var(--accent)",borderRadius:2}}></div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Spend by Project</span></div>
          {Object.keys(projs).length === 0 ? <div className="empty">No expenses yet</div> :
            Object.entries(projs).sort((a,b)=>b[1]-a[1]).map(([proj,amt]) => (
              <div key={proj} style={{padding:"9px 16px",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"60%"}}>{proj}</div>
                  <div style={{fontSize:12,fontWeight:500}}>${Math.round(amt).toLocaleString()}</div>
                </div>
                <div style={{height:4,background:"var(--sand-mid)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.round(amt/maxProj*100)}%`,background:"var(--amber)",borderRadius:2}}></div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// TIMELINE
function TimelineView({ data, onAdd }) {
  const milestones = [
    { date:"Mar 24, 2025", title:"Lay-Up Studio — Concept Review", sub:"Client presentation · Design Development", color:"var(--coral)" },
    { date:"Apr 5, 2025", title:"Kickback Studio II — Kick-off", sub:"New project · Pre-design phase begins", color:"var(--blue)" },
    { date:"Apr 7, 2025", title:"OCAD University Proposal Response", sub:"Exhibition Design · $44,000 proposal", color:"var(--accent)" },
  ];
  // Add invoice due dates
  data.invoices.filter(i=>i.due&&i.status!=="Paid").forEach(i => {
    milestones.push({ date:i.due, title:`Invoice ${i.inv_number} Due`, sub:`${i.client} · ${i.amount}`, color:"var(--amber)" });
  });
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">Project Timeline</div><div className="section-sub">Milestones, deliverables & deadlines</div></div>
      </div>
      <div className="panel">
        <div style={{padding:"20px 24px"}}>
          {milestones.map((m,i) => (
            <div key={i} style={{display:"flex",gap:12,marginBottom:16}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:m.color,marginTop:5,flexShrink:0}}></div>
              <div>
                <div style={{fontSize:12,fontWeight:500}}>{m.title}</div>
                <div style={{fontSize:11,color:"var(--mid)"}}>{m.date} · {m.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SIMPLE TABLE
function SimpleTable({ title, subtitle, cols, rows, onAdd, onRow }) {
  return (
    <div>
      <div className="section-head">
        <div><div className="section-h">{title}</div><div className="section-sub">{subtitle}</div></div>
        {onAdd && <button className="btn btn-dark" onClick={onAdd}>+ Add</button>}
      </div>
      <div className="panel">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>{cols.map((c,i) => <th key={i}>{c}</th>)}</tr></thead>
            <tbody>
              {rows.length === 0 ? <tr><td colSpan={cols.length} style={{textAlign:"center",padding:32,color:"var(--stone)"}}>No records yet</td></tr> :
                rows.map((row,i) => (
                  <tr key={i} onClick={() => onRow && onRow(i)}>
                    {row.map((cell,j) => <td key={j} className={j===0?"name-cell":""}>{cell}</td>)}
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// INVOICE GENERATOR
function InvoiceGenerator({ data }) {
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [number, setNumber] = useState("INV-" + String(data.invoices.length+1).padStart(3,"0"));
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [due, setDue] = useState("");
  const [items, setItems] = useState([{desc:"",qty:1,rate:""}]);
  const [tax, setTax] = useState(13);
  const [notes, setNotes] = useState("Payment due within 30 days.");
  const [preview, setPreview] = useState(false);

  const subtotal = items.reduce((s,i) => s + ((parseFloat(i.qty)||0)*(parseFloat(i.rate)||0)), 0);
  const taxAmt = subtotal * (tax/100);
  const total = subtotal + taxAmt;
  const fmt = n => "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");

  return (
    <div>
      <div className="section-head"><div><div className="section-h">Invoice Generator</div><div className="section-sub">Build a print-ready invoice</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:16,alignItems:"start"}}>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Details</span></div>
          <div style={{padding:"20px 24px"}}>
            <div className="form-row2">
              <div className="form-field"><label>Invoice #</label><input value={number} onChange={e=>setNumber(e.target.value)} /></div>
              <div className="form-field"><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
            </div>
            <div className="form-row2">
              <div className="form-field"><label>Client</label>
                <select value={client} onChange={e=>setClient(e.target.value)}>
                  <option value="">— Select —</option>
                  {data.clients.map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-field"><label>Project</label>
                <select value={project} onChange={e=>setProject(e.target.value)}>
                  <option value="">— Select —</option>
                  {data.projects.map(p => <option key={p.id}>{p.name}</option>)}
                  {data.portfolio.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field"><label>Due Date</label><input type="date" value={due} onChange={e=>setDue(e.target.value)} /></div>
            <div style={{marginBottom:12}}><div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--mid)",marginBottom:8}}>Line Items</div>
              {items.map((item,i) => (
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 80px 28px",gap:6,marginBottom:6}}>
                  <input className="form-field input" style={{padding:"7px 10px",border:"1px solid var(--border-med)",borderRadius:6,fontSize:12,fontFamily:"DM Sans,sans-serif"}} placeholder="Description" value={item.desc} onChange={e=>{const n=[...items];n[i].desc=e.target.value;setItems(n);}} />
                  <input style={{padding:"7px 8px",border:"1px solid var(--border-med)",borderRadius:6,fontSize:12,fontFamily:"DM Sans,sans-serif",textAlign:"center"}} type="number" placeholder="Qty" value={item.qty} onChange={e=>{const n=[...items];n[i].qty=e.target.value;setItems(n);}} />
                  <input style={{padding:"7px 8px",border:"1px solid var(--border-med)",borderRadius:6,fontSize:12,fontFamily:"DM Sans,sans-serif"}} type="number" placeholder="Rate" value={item.rate} onChange={e=>{const n=[...items];n[i].rate=e.target.value;setItems(n);}} />
                  <button className="btn" style={{padding:"4px 8px",fontSize:16}} onClick={()=>setItems(items.filter((_,j)=>j!==i))}>×</button>
                </div>
              ))}
              <button className="btn" style={{width:"100%",marginBottom:8}} onClick={()=>setItems([...items,{desc:"",qty:1,rate:""}])}>+ Add Line Item</button>
            </div>
            <div className="form-row2">
              <div className="form-field"><label>Tax (%)</label><input type="number" value={tax} onChange={e=>setTax(parseFloat(e.target.value)||0)} /></div>
              <div className="form-field"><label>Notes</label><input value={notes} onChange={e=>setNotes(e.target.value)} /></div>
            </div>
            <button className="btn btn-dark" style={{width:"100%",marginTop:4}} onClick={()=>setPreview(true)}>Generate Invoice →</button>
          </div>
        </div>
        {preview && (
          <div className="panel">
            <div className="panel-head"><span className="panel-title">Preview</span><span style={{fontSize:11,color:"var(--accent)",cursor:"pointer"}} onClick={()=>{const w=window.open("","_blank");w.document.write(`<html><head><title>Invoice</title><style>body{font-family:sans-serif;padding:48px;max-width:720px;margin:0 auto;}</style></head><body>${document.getElementById("inv-preview-inner").innerHTML}</body></html>`);w.document.close();setTimeout(()=>w.print(),600);}}>Print / Save PDF →</span></div>
            <div id="inv-preview-inner" style={{padding:32,fontSize:13,lineHeight:1.7}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:32}}>
                <div><div style={{fontFamily:"DM Serif Display,serif",fontSize:28,color:"#111"}}>Endose</div><div style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#888",marginTop:2}}>Architectural Design · Toronto</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"#888",marginBottom:4}}>Invoice</div><div style={{fontSize:22,fontWeight:300}}>{number}</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24,paddingBottom:24,borderBottom:"1px solid #eee"}}>
                <div><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",marginBottom:6}}>Bill To</div><div style={{fontWeight:500}}>{client||"Client"}</div><div style={{fontSize:12,color:"#666"}}>{project}</div></div>
                <div style={{textAlign:"right"}}><div style={{marginBottom:8}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb"}}>Issue Date</div><div style={{fontSize:12}}>{date}</div></div><div><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb"}}>Due Date</div><div style={{fontSize:12,fontWeight:500}}>{due||"—"}</div></div></div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
                <thead><tr style={{borderBottom:"1px solid #eee"}}><th style={{textAlign:"left",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",padding:"6px 0",fontWeight:400}}>Description</th><th style={{textAlign:"center",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",padding:"6px 0",fontWeight:400,width:60}}>Qty</th><th style={{textAlign:"right",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",padding:"6px 0",fontWeight:400,width:80}}>Rate</th><th style={{textAlign:"right",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",padding:"6px 0",fontWeight:400,width:80}}>Total</th></tr></thead>
                <tbody>{items.filter(i=>i.desc).map((item,i) => <tr key={i} style={{borderBottom:"1px solid #f5f5f5"}}><td style={{padding:"10px 0"}}>{item.desc}</td><td style={{padding:"10px 0",textAlign:"center",color:"#666"}}>{item.qty}</td><td style={{padding:"10px 0",textAlign:"right",color:"#666"}}>{fmt(parseFloat(item.rate)||0)}</td><td style={{padding:"10px 0",textAlign:"right",fontWeight:500}}>{fmt((parseFloat(item.qty)||0)*(parseFloat(item.rate)||0))}</td></tr>)}</tbody>
              </table>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
                <div style={{minWidth:200}}>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f5f5f5"}}><span style={{color:"#666"}}>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  {tax > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f5f5f5"}}><span style={{color:"#666"}}>HST ({tax}%)</span><span>{fmt(taxAmt)}</span></div>}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0"}}><span style={{fontWeight:500}}>Total</span><span style={{fontFamily:"DM Serif Display,serif",fontSize:20}}>{fmt(total)}</span></div>
                </div>
              </div>
              {notes && <div style={{padding:"12px 16px",background:"#f9f7f4",borderRadius:8,fontSize:11,color:"#666"}}>{notes}</div>}
              <div style={{marginTop:24,paddingTop:14,borderTop:"1px solid #eee",fontSize:10,color:"#bbb",textAlign:"center"}}>Endose Architectural Design · Toronto, ON · Thank you for your business.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PROPOSAL GENERATOR
function ProposalGenerator({ data }) {
  const [form, setForm] = useState({client:"",project:"",type:"Architectural Design",scope:"",fee:"",timeline:"",deliverables:""});
  const [preview, setPreview] = useState(false);
  const f = k => e => setForm({...form, [k]: e.target.value});
  const today = new Date().toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"});
  return (
    <div>
      <div className="section-head"><div><div className="section-h">Proposal Generator</div><div className="section-sub">Build a formatted design proposal in minutes</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.3fr",gap:16,alignItems:"start"}}>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Project Details</span></div>
          <div style={{padding:"20px 24px"}}>
            <div className="form-field"><label>Client Name</label><select value={form.client} onChange={f("client")}><option value="">— Select client —</option>{data.clients.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
            <div className="form-field"><label>Project Name</label><input value={form.project} onChange={f("project")} placeholder="e.g. Kickback Studio II" /></div>
            <div className="form-field"><label>Project Type</label><select value={form.type} onChange={f("type")}><option>Architectural Design</option><option>Community / Cultural</option><option>Retail / Hospitality</option><option>Commercial Interior</option><option>Residential</option><option>Exhibition Design</option></select></div>
            <div className="form-field"><label>Scope of Work</label><textarea value={form.scope} onChange={f("scope")} rows={3} placeholder="Describe the design scope..." style={{resize:"vertical"}} /></div>
            <div className="form-row2">
              <div className="form-field"><label>Proposed Fee</label><input value={form.fee} onChange={f("fee")} placeholder="$0,000" /></div>
              <div className="form-field"><label>Timeline</label><input value={form.timeline} onChange={f("timeline")} placeholder="e.g. 12 weeks" /></div>
            </div>
            <div className="form-field"><label>Deliverables</label><textarea value={form.deliverables} onChange={f("deliverables")} rows={2} placeholder="e.g. Schematic design, construction drawings..." style={{resize:"vertical"}} /></div>
            <button className="btn btn-dark" style={{width:"100%"}} onClick={()=>setPreview(true)}>Generate Proposal →</button>
          </div>
        </div>
        {preview && (
          <div className="panel">
            <div className="panel-head"><span className="panel-title">Proposal Preview</span><span style={{fontSize:11,color:"var(--accent)",cursor:"pointer"}} onClick={()=>{const w=window.open("","_blank");w.document.write(`<html><head><title>Proposal</title><style>body{font-family:sans-serif;padding:48px;max-width:680px;margin:0 auto;}</style></head><body>${document.getElementById("prop-preview-inner").innerHTML}</body></html>`);w.document.close();setTimeout(()=>w.print(),600);}}>Print / Save PDF →</span></div>
            <div id="prop-preview-inner" style={{padding:32,fontSize:13,lineHeight:1.7}}>
              <div style={{borderBottom:"2px solid #111",paddingBottom:16,marginBottom:20}}>
                <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:"#888",marginBottom:4}}>Design Proposal</div>
                <div style={{fontFamily:"DM Serif Display,serif",fontSize:24,color:"#111"}}>{form.project||"Project Name"}</div>
                <div style={{fontSize:12,color:"#888",marginTop:4}}>Prepared for {form.client||"Client"} · {today}</div>
              </div>
              {[["Project Overview",form.scope],["Project Type",form.type],["Deliverables",form.deliverables]].map(([label,val])=>(
                <div key={label} style={{marginBottom:18}}>
                  <div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:"#bbb",marginBottom:6}}>{label}</div>
                  <div style={{fontSize:13,color:"#111"}}>{val||"—"}</div>
                </div>
              ))}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:18}}>
                <div style={{background:"#f5f2ed",borderRadius:8,padding:14}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",marginBottom:4}}>Proposed Fee</div><div style={{fontFamily:"DM Serif Display,serif",fontSize:22}}>{form.fee||"TBD"}</div></div>
                <div style={{background:"#f5f2ed",borderRadius:8,padding:14}}><div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#bbb",marginBottom:4}}>Timeline</div><div style={{fontFamily:"DM Serif Display,serif",fontSize:22}}>{form.timeline||"TBD"}</div></div>
              </div>
              <div style={{borderTop:"1px solid #eee",paddingTop:14,fontSize:11,color:"#bbb",textAlign:"center"}}>Endose Architectural Design · Toronto · This proposal is valid for 30 days from the date of issue.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// FEE CALCULATOR
function FeeCalculator() {
  const [type, setType] = useState("Architectural Design");
  const [budget, setBudget] = useState("");
  const [complexity, setComplexity] = useState(1.0);
  const [services, setServices] = useState({schematic:true,dd:true,cd:true,ca:false,pm:false});
  const rates = {"Architectural Design":0.10,"Commercial Interior":0.12,"Community / Cultural":0.11,"Retail / Hospitality":0.12,"Residential":0.13,"Exhibition Design":0.14};
  const weights = {schematic:0.20,dd:0.25,cd:0.30,ca:0.15,pm:0.10};
  const base = (rates[type]||0.11) * complexity;
  const totalWeight = Object.entries(services).reduce((s,[k,v]) => v ? s+weights[k] : s, 0);
  const totalFee = budget ? (parseFloat(budget)||0) * base * (totalWeight / 0.75) : 0;
  const fmt = n => "$" + Math.round(n).toLocaleString();
  return (
    <div>
      <div className="section-head"><div><div className="section-h">Fee Calculator</div><div className="section-sub">Estimate design fees by project type & size</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Project Parameters</span></div>
          <div style={{padding:"20px 24px"}}>
            <div className="form-field"><label>Project Type</label><select value={type} onChange={e=>setType(e.target.value)}><option>Architectural Design</option><option>Commercial Interior</option><option>Community / Cultural</option><option>Retail / Hospitality</option><option>Residential</option><option>Exhibition Design</option></select></div>
            <div className="form-field"><label>Construction Budget ($)</label><input type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. 500000" /></div>
            <div className="form-field"><label>Complexity</label><select value={complexity} onChange={e=>setComplexity(parseFloat(e.target.value))}><option value={0.9}>Standard</option><option value={1.0}>Moderate</option><option value={1.2}>Complex</option><option value={1.4}>Highly Complex</option></select></div>
            <div className="form-field"><label>Services Included</label>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
                {Object.entries(services).map(([k,v]) => (
                  <label key={k} style={{fontSize:12,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                    <input type="checkbox" checked={v} onChange={e=>setServices({...services,[k]:e.target.checked})} />
                    {{schematic:"Schematic Design",dd:"Design Development",cd:"Construction Documents",ca:"Contract Administration",pm:"Project Management"}[k]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><span className="panel-title">Estimated Fee Breakdown</span></div>
          <div style={{padding:"20px 24px"}}>
            {!budget ? <div className="empty">Enter a project budget to calculate fees.</div> : (
              <>
                <div style={{textAlign:"center",marginBottom:20}}>
                  <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--stone)",marginBottom:6}}>Estimated Total Fee</div>
                  <div style={{fontFamily:"DM Serif Display,serif",fontSize:36,color:"var(--black)"}}>{fmt(totalFee)}</div>
                  <div style={{fontSize:11,color:"var(--mid)",marginTop:4}}>{(base*100).toFixed(1)}% of {fmt(parseFloat(budget))} construction budget</div>
                </div>
                {Object.entries(services).filter(([k,v])=>v).map(([k]) => {
                  const phaseFee = totalFee * weights[k] / totalWeight;
                  return (
                    <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                      <div><div style={{fontSize:12,fontWeight:500}}>{({schematic:"Schematic Design",dd:"Design Development",cd:"Construction Documents",ca:"Contract Administration",pm:"Project Management"})[k]}</div><div style={{fontSize:10,color:"var(--mid)"}}>{Math.round(weights[k]/totalWeight*100)}% of total</div></div>
                      <div style={{fontSize:13,fontWeight:500}}>{fmt(phaseFee)}</div>
                    </div>
                  );
                })}
                <div style={{fontSize:10,color:"var(--stone)",marginTop:12}}>Estimates based on industry standard fee ranges.</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ADD MODAL
function AddModal({ modal, setModal, data, onSave, onDelete, onUpdate, session }) {
  const [form, setForm] = useState({});
  const close = () => { setModal({open:false,type:"",record:null}); setForm({}); };
  const f = k => e => setForm({...form, [k]: e.target.value});
  const r = modal.record;

  useEffect(() => {
    if (r) setForm(r);
    else setForm({});
  }, [modal.record, modal.type]);

  const clientOpts = data.clients.map(c => <option key={c.id}>{c.name}</option>);
  const projOpts = [...data.projects, ...data.portfolio].map(p => <option key={p.id}>{p.name}</option>);
  const contrOpts = data.contractors.map(c => <option key={c.id}>{c.name}</option>);

  const tableMap = { project:"projects", client:"clients", lead:"leads", vendor:"vendors", contractor:"contractors", invoice:"invoices", receipt:"receipts", payment:"payments", contact:"contacts", retainer:"retainers", changeorder:"change_orders", portfolio:"portfolio", file:"files", milestone:"notes" };

  const fieldMap = {
    project: { inv_number:"inv_number", client:"client", project:"project", type:"type", amount:"amount", issued:"issued", due:"due", status:"status" },
  };

  const renderForm = () => {
    switch(modal.type) {
      case "project": case "project-detail": return <>
        <div className="form-field"><label>Project Name</label><input value={form.name||""} onChange={f("name")} placeholder="e.g. Community Hub Studio" /></div>
        <div className="form-row2">
          <div className="form-field"><label>Client</label><select value={form.client||""} onChange={f("client")}><option value="">— Select —</option>{clientOpts}</select></div>
          <div className="form-field"><label>Budget</label><input value={form.budget||""} onChange={f("budget")} placeholder="$0,000" /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Type</label><select value={form.type||"Architectural Design"} onChange={f("type")}><option>Architectural Design</option><option>Community / Cultural</option><option>Retail / Hospitality</option><option>Commercial Interior</option><option>Residential</option><option>Exhibition Design</option></select></div>
          <div className="form-field"><label>Status</label><select value={form.status||"Pre-Design"} onChange={f("status")}><option>Pre-Design</option><option>Schematic Design</option><option>Design Development</option><option>Construction Docs</option></select></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Progress %</label><input type="number" min="0" max="100" value={form.progress||0} onChange={f("progress")} /></div>
          <div className="form-field"><label>Deadline</label><input value={form.deadline||""} onChange={f("deadline")} /></div>
        </div>
        <div className="form-field"><label>Notes</label><textarea value={form.notes||""} onChange={f("notes")} rows={3} placeholder="Project brief, scope notes..." style={{resize:"vertical"}} /></div>
      </>;
      case "client": case "client-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Full Name</label><input value={form.name||""} onChange={f("name")} placeholder="Full name" /></div>
          <div className="form-field"><label>Organization</label><input value={form.org||""} onChange={f("org")} placeholder="Studio / Company" /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Email</label><input type="email" value={form.email||""} onChange={f("email")} /></div>
          <div className="form-field"><label>Phone</label><input value={form.phone||""} onChange={f("phone")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Type</label><select value={form.type||"Commercial"} onChange={f("type")}><option>Commercial</option><option>Nonprofit</option><option>Public Sector</option><option>Retail</option><option>Residential</option></select></div>
          <div className="form-field"><label>Status</label><select value={form.status||"Active"} onChange={f("status")}><option>Active</option><option>Past</option><option>Prospect</option></select></div>
        </div>
      </>;
      case "lead": case "lead-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Contact Name</label><input value={form.contact||""} onChange={f("contact")} /></div>
          <div className="form-field"><label>Organization</label><input value={form.org||""} onChange={f("org")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Stage</label><select value={form.stage||"Discovery"} onChange={f("stage")}><option>Discovery</option><option>Proposal</option><option>Negotiation</option><option>Closed Won</option></select></div>
          <div className="form-field"><label>Est. Value</label><input value={form.value||""} onChange={f("value")} placeholder="$0,000" /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Type</label><select value={form.type||"Architectural Design"} onChange={f("type")}><option>Architectural Design</option><option>Community / Cultural</option><option>Retail</option><option>Residential</option></select></div>
          <div className="form-field"><label>Source</label><select value={form.source||"Referral"} onChange={f("source")}><option>Referral</option><option>Website</option><option>LinkedIn</option><option>Past Client</option></select></div>
        </div>
        <div className="form-field"><label>Next Step</label><input value={form.next||""} onChange={f("next")} placeholder="e.g. Send proposal by Friday" /></div>
      </>;
      case "vendor": case "vendor-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Vendor Name</label><input value={form.name||""} onChange={f("name")} /></div>
          <div className="form-field"><label>Category</label><select value={form.cat||"Materials"} onChange={f("cat")}><option>Materials</option><option>Finishes</option><option>Fabrication</option><option>Lighting</option><option>Greenery</option><option>Equipment</option><option>Other</option></select></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Contact Person</label><input value={form.contact||""} onChange={f("contact")} /></div>
          <div className="form-field"><label>Phone</label><input value={form.phone||""} onChange={f("phone")} /></div>
        </div>
        <div className="form-field"><label>Email</label><input type="email" value={form.email||""} onChange={f("email")} /></div>
      </>;
      case "contractor": case "contractor-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Full Name</label><input value={form.name||""} onChange={f("name")} /></div>
          <div className="form-field"><label>Specialty</label><input value={form.specialty||""} onChange={f("specialty")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Email</label><input type="email" value={form.email||""} onChange={f("email")} /></div>
          <div className="form-field"><label>Phone</label><input value={form.phone||""} onChange={f("phone")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Rate</label><input value={form.rate||""} onChange={f("rate")} placeholder="$00/hr" /></div>
          <div className="form-field"><label>Active Project</label><select value={form.project||""} onChange={f("project")}><option value="">— None —</option>{projOpts}</select></div>
        </div>
      </>;
      case "invoice": case "invoice-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Invoice #</label><input value={form.inv_number||`INV-${String(data.invoices.length+1).padStart(3,"0")}`} onChange={f("inv_number")} /></div>
          <div className="form-field"><label>Type</label><select value={form.type||"Invoice"} onChange={f("type")}><option>Invoice</option><option>Proposal</option><option>Contract</option><option>Change Order</option></select></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Client</label><select value={form.client||""} onChange={f("client")}><option value="">— Select —</option>{clientOpts}</select></div>
          <div className="form-field"><label>Project</label><select value={form.project||""} onChange={f("project")}><option value="">— Select —</option>{projOpts}</select></div>
        </div>
        <div className="form-field"><label>Amount</label><input value={form.amount||""} onChange={f("amount")} placeholder="$0,000.00" /></div>
        <div className="form-row2">
          <div className="form-field"><label>Issue Date</label><input type="date" value={form.issued||""} onChange={f("issued")} /></div>
          <div className="form-field"><label>Due Date</label><input type="date" value={form.due||""} onChange={f("due")} /></div>
        </div>
        <div className="form-field"><label>Status</label><select value={form.status||"Pending"} onChange={f("status")}><option>Pending</option><option>Paid</option><option>Outstanding</option></select></div>
      </>;
      case "receipt": return <>
        <div className="form-field"><label>Description</label><input value={form.desc||""} onChange={f("desc")} placeholder="What was purchased" /></div>
        <div className="form-row2">
          <div className="form-field"><label>Project</label><select value={form.project||""} onChange={f("project")}><option value="">— Select —</option>{projOpts}</select></div>
          <div className="form-field"><label>Vendor</label><input value={form.vendor||""} onChange={f("vendor")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Category</label><select value={form.cat||"Materials"} onChange={f("cat")}><option>Materials</option><option>Finishes</option><option>Fabrication</option><option>Lighting</option><option>Equipment</option><option>Other</option></select></div>
          <div className="form-field"><label>Amount</label><input value={form.amount||""} onChange={f("amount")} placeholder="$0.00" /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Date</label><input type="date" value={form.date||""} onChange={f("date")} /></div>
          <div className="form-field"><label>Reimbursable?</label><select value={form.reimb||"No"} onChange={f("reimb")}><option>Yes</option><option>No</option></select></div>
        </div>
      </>;
      case "payment": return <>
        <div className="form-row2">
          <div className="form-field"><label>Contractor</label><select value={form.contractor||""} onChange={f("contractor")}><option value="">— Select —</option>{contrOpts}</select></div>
          <div className="form-field"><label>Project</label><select value={form.project||""} onChange={f("project")}><option value="">— Select —</option>{projOpts}</select></div>
        </div>
        <div className="form-field"><label>Description</label><input value={form.desc||""} onChange={f("desc")} placeholder="Work performed" /></div>
        <div className="form-row2">
          <div className="form-field"><label>Amount</label><input value={form.amount||""} onChange={f("amount")} placeholder="$0,000.00" /></div>
          <div className="form-field"><label>Method</label><select value={form.method||"EFT"} onChange={f("method")}><option>EFT</option><option>Cheque</option><option>E-Transfer</option><option>Cash</option></select></div>
        </div>
        <div className="form-field"><label>Date</label><input type="date" value={form.date||""} onChange={f("date")} /></div>
      </>;
      case "contact": return <>
        <div className="form-row2">
          <div className="form-field"><label>Client</label><select value={form.client||""} onChange={f("client")}><option value="">— Select —</option>{clientOpts}</select></div>
          <div className="form-field"><label>Date</label><input type="date" value={form.date||""} onChange={f("date")} /></div>
        </div>
        <div className="form-field"><label>Type</label><select value={form.type||"Call"} onChange={f("type")}><option>Call</option><option>Email</option><option>Meeting</option><option>Site Visit</option><option>Presentation</option></select></div>
        <div className="form-field"><label>Summary</label><textarea value={form.summary||""} onChange={f("summary")} rows={3} placeholder="What was discussed..." style={{resize:"vertical"}} /></div>
        <div className="form-field"><label>Follow-up</label><input value={form.followup||""} onChange={f("followup")} placeholder="e.g. Send revised proposal by Friday" /></div>
      </>;
      case "retainer": case "retainer-detail": return <>
        <div className="form-row2">
          <div className="form-field"><label>Client</label><select value={form.client||""} onChange={f("client")}><option value="">— Select —</option>{clientOpts}</select></div>
          <div className="form-field"><label>Monthly Fee</label><input value={form.fee||""} onChange={f("fee")} placeholder="$0,000" /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Project / Scope</label><input value={form.project||""} onChange={f("project")} placeholder="e.g. Ongoing design support" /></div>
          <div className="form-field"><label>Start Date</label><input type="date" value={form.start_date||""} onChange={f("start_date")} /></div>
        </div>
        <div className="form-field"><label>Status</label><select value={form.status||"Active"} onChange={f("status")}><option>Active</option><option>Paused</option><option>Ended</option></select></div>
        <div className="form-field"><label>Notes</label><textarea value={form.notes||""} onChange={f("notes")} rows={2} style={{resize:"vertical"}} /></div>
      </>;
      case "changeorder": return <>
        <div className="form-row2">
          <div className="form-field"><label>CO Number</label><input value={form.co_number||`CO-${String(data.changeorders.length+1).padStart(3,"0")}`} onChange={f("co_number")} /></div>
          <div className="form-field"><label>Project</label><select value={form.project||""} onChange={f("project")}><option value="">— Select —</option>{projOpts}</select></div>
        </div>
        <div className="form-field"><label>Description</label><textarea value={form.description||""} onChange={f("description")} rows={2} style={{resize:"vertical"}} /></div>
        <div className="form-row2">
          <div className="form-field"><label>Cost Impact</label><input value={form.cost||""} onChange={f("cost")} placeholder="e.g. +$4,500" /></div>
          <div className="form-field"><label>Date</label><input type="date" value={form.date||""} onChange={f("date")} /></div>
        </div>
        <div className="form-row2">
          <div className="form-field"><label>Requested By</label><input value={form.requested_by||""} onChange={f("requested_by")} /></div>
          <div className="form-field"><label>Status</label><select value={form.status||"Pending"} onChange={f("status")}><option>Pending</option><option>Approved</option><option>Rejected</option></select></div>
        </div>
      </>;
      case "portfolio": return <>
        <div className="form-field"><label>Project Name</label><input value={form.name||""} onChange={f("name")} /></div>
        <div className="form-row2">
          <div className="form-field"><label>Client</label><input value={form.client||""} onChange={f("client")} /></div>
          <div className="form-field"><label>Year</label><input value={form.year||new Date().getFullYear()} onChange={f("year")} /></div>
        </div>
        <div className="form-field"><label>Type</label><select value={form.type||"Architectural Design"} onChange={f("type")}><option>Architectural Design</option><option>Community / Cultural</option><option>Retail / Hospitality</option><option>Commercial Interior</option><option>Residential</option><option>Exhibition Design</option><option>Public / Installation</option></select></div>
      </>;
      case "file": return <>
        <div className="form-field"><label>File Name</label><input value={form.name||""} onChange={f("name")} /></div>
        <div className="form-field"><label>URL / Link</label><input value={form.url||""} onChange={f("url")} placeholder="https://drive.google.com/..." /></div>
        <div className="form-row2">
          <div className="form-field"><label>Project</label><select value={form.project||""} onChange={f("project")}><option value="">— Select —</option>{projOpts}</select></div>
          <div className="form-field"><label>Type</label><select value={form.type||"Floor Plan"} onChange={f("type")}><option>Floor Plan</option><option>Site Photo</option><option>Construction Drawing</option><option>Specification</option><option>Contract</option><option>Concept</option><option>Other</option></select></div>
        </div>
        <div className="form-field"><label>Date</label><input type="date" value={form.date||""} onChange={f("date")} /></div>
      </>;
      default: return null;
    }
  };

  const isDetail = modal.type.endsWith("-detail");
  const baseType = modal.type.replace("-detail","");
  const tableName = tableMap[baseType] || tableMap[modal.type];
  const titles = { project:"New Project", client:"New Client", lead:"New Lead", vendor:"New Vendor", contractor:"New Contractor", invoice:"New Invoice", receipt:"Add Receipt", payment:"Log Payment", contact:"Log Contact", retainer:"Add Retainer", changeorder:"Log Change Order", portfolio:"Add Completed Project", file:"Link File",
    "project-detail":"Project Details","client-detail":"Client Details","lead-detail":"Lead Details","vendor-detail":"Vendor Details","contractor-detail":"Contractor Details","invoice-detail":"Invoice Details","retainer-detail":"Retainer Details" };

  return (
    <Modal open={modal.open} title={titles[modal.type]||"Add Record"} onClose={close}
      footer={
        <div style={{display:"flex",gap:8,width:"100%"}}>
          {isDetail && r && <button className="btn btn-danger" onClick={() => onDelete(tableName, r.id)}>Delete</button>}
          <div style={{flex:1}}></div>
          <button className="btn" onClick={close}>Cancel</button>
          <button className="btn btn-dark" onClick={() => {
            if (isDetail && r) onUpdate(tableName, r.id, form);
            else onSave(tableName, form);
          }}>{isDetail ? "Save Changes" : "Save"}</button>
        </div>
      }>
      {renderForm()}
    </Modal>
  );
}
