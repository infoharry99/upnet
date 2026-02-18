import React, { useState, useEffect, useRef, useCallback } from "react";
import instance, {
  apiDecrypteRequest,
  apiEncryptRequest,
  decryptData,
} from "../../Api";
import { useAuth } from "../../AuthContext";

// get machines
const getMachines = async (userId) => {
  const encrypted = await apiEncryptRequest({ user_id: userId });
  const res = await instance.post("/machines", encrypted);
  return decryptData(res.data);
};

// get tickets
const getTickets = async (userId) => {
  const encrypted = {
    user_id: userId,
  };
  const res = await instance.post("/enquirys", encrypted);
  //console.log("RAW RESPONSE:", res.data);
  return decryptData(res.data);
};



// create ticket
const createTicket = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    if (data[k]) formData.append(k, data[k]);
  });
  const res = await instance.post("/create-enquiry", formData);
  return decryptData(res.data);
};

// reply ticket
const replyTicket = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((k) => {
    if (data[k]) formData.append(k, data[k]);
  });
  const res = await instance.post("/reply_enquiry", formData);
  //console.log("reply RAW RESPONSE:", res.data);
  return res.data;
};



// archive / close ticket
const archiveTicket = async (data) => {
  const res = await instance.post("/archived_enquiry", data);
  //console.log("ARCHIVE RAW RESPONSE:", res.data);
  if (!res.data) return null;
  return res.data;
};

// // ── SVG Icons ───────────────────────────────────────────────────────────
const I = {
  Plus: () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  Search: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  X: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Send: () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
  Clip: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>,
  Clock: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  Down: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>,
  Up: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>,
  Archive: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
  Server: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  Msg: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>,
  Empty: () => <svg width="56" height="56" fill="none" stroke="#c4b5a0" strokeWidth="1.2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
};

/* ───────────────── CONFIG ───────────────── */

const ST = {
  open: { label: "Open" },
  progress: { label: "In Progress" },
  completed: { label: "Completed" },
  archived: { label: "Archived" },
};

const TYPES = [
  "Performance Issue",
  "Network Issue",
  "Installation Issue",
  "Sales",
  "Billing Query",
  "Other",
];

const OPTIONAL_VM = ["Sales", "Billing Query", "Other"];

const TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "inProgress", label: "In Progress" },
  { key: "closed", label: "Completed" },
  { key: "archived", label: "Archived" },
];

/* ───────────────── COMPONENT ───────────────── */

export default function SupportPage() {
  const { smuser } = useAuth();

  const [machines, setMachines] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [replyArr, setReplyArr] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [replyImg, setReplyImg] = useState(null);

  // ✅ toast object (JSX uses toast.ok & toast.msg)
  const [toast, setToast] = useState(null);

  const [fType, setFType] = useState("");
  const [fMsg, setFMsg] = useState("");
  const [fVMs, setFVMs] = useState([]);
  const [fImg, setFImg] = useState(null);

  const fRef = useRef(null);
  const rRef = useRef(null);

  /* ───────── helpers ───────── */

  const notify = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const resetForm = () => {
    setFType("");
    setFMsg("");
    setFVMs([]);
    setFImg(null);
  };

  /* ───────── LOAD DATA ───────── */

const load = useCallback(async () => {
    if (!smuser?.id) return;

    setLoading(true);
    try {
      const [m, t] = await Promise.all([
        getMachines(smuser.id),
        getTickets(smuser.id),
      ]);

      setMachines(m?.vm ? Object.values(m.vm) : []);
      setEnquiries(t?.enquiries || []);
      setReplyArr((t?.enquiry_replys || []).flat());
    } catch (err) {
      console.error("SUPPORT API ERROR:", err);
      notify("Failed to load support data", false);
    }
    setLoading(false);
  }, [notify, smuser]);

  useEffect(() => {
    load();
  }, [load]);

  /* ───────── derived helpers ───────── */

  const getReplies = (id) =>
    replyArr.filter((r) => r.enquiry_id === id);

  const toggleVM = (id) => {
    setFVMs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ───────── ACTIONS ───────── */

  const create = async () => {
    if (!fType || !fMsg) return notify("Fill all required fields", false);

    await createTicket({
      user_id: smuser.id,
      name: smuser.name,
      user_email: smuser.email,
      user_mobile: smuser.phone,
      type: fType,
      vm_id: fVMs.join(","),
      msg: fMsg,
      file: fImg,
    });

    resetForm();
    setModal(false);
    notify("Ticket created");
    load();
  };

  const reply = async (id) => {
    if (!replyText) return;

    await replyTicket({
      id: id,
      enquiry_id: id,
      user_id: smuser.id,
      reply_message: replyText,
      file: replyImg,
    });

    setReplyText("");
    setReplyImg(null);
    load();
  };

  const changeStatus = async (tk, status) => {
    await archiveTicket({
      enquiry_id: tk.id,
      user_id: smuser.id,
      status,
    });
    load();
  };

  const filtered = enquiries
    .filter((e) => {
      if (tab === "all") return true;
      if (tab === "inProgress") return e.status === "progress";
      if (tab === "closed") return e.status === "completed";
      return e.status === tab;
    })
    .filter((e) =>
      e.enquiry?.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    all: enquiries.length,
    open: enquiries.filter((e) => e.status === "open").length,
    inProgress: enquiries.filter((e) => e.status === "progress").length,
    closed: enquiries.filter((e) => e.status === "completed").length,
    archived: enquiries.filter((e) => e.status === "archived").length,
  };


  return (
    <div className="sp-root mt-5">
      <style>{CSS}</style>

      {toast && <div className={`sp-toast ${toast.ok ? "sp-toast-ok" : "sp-toast-err"}`}>{toast.ok ? "✓" : "✕"} {toast.msg}</div>}
      {loading && <div className="sp-loader-overlay"><div className="sp-loader" /></div>}

      <header className="sp-header">
        <div className="sp-header-inner">
          <div className="sp-header-left">
            <div className="sp-logo">
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
            <div>
              <h1 className="sp-title">Support Center</h1>
              <p className="sp-subtitle">Track & manage your support tickets</p>
            </div>
          </div>
          <button className="sp-create-btn" onClick={() => setModal(true)}>
            <I.Plus /> New Ticket
          </button>
        </div>
      </header>

      <main className="sp-main">
        {/* Stats */}
        <div className="sp-stats">
          {TABS.map(t => (
            <button key={t.key} className={`sp-stat ${tab === t.key ? "sp-stat-active" : ""}`} onClick={() => setTab(t.key)}>
              <span className="sp-stat-icon">{t.icon}</span>
              <span className="sp-stat-num">{counts[t.key]}</span>
              <span className="sp-stat-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="sp-search-row">
          <div className="sp-search-box">
            <I.Search />
            <input className="sp-search-input" placeholder="Search by ticket ID, subject, or description..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button className="sp-search-clear" onClick={() => setSearch("")}><I.X /></button>}
          </div>
          <span className="sp-result-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Ticket List */}
        <div className="sp-tickets">
          {filtered.length === 0 ? (
            <div className="sp-empty">
              <I.Empty />
              <p className="sp-empty-title">{search ? "No matching tickets" : "No tickets yet"}</p>
              <p className="sp-empty-sub">{search ? "Try different search terms." : "Create your first support ticket."}</p>
            </div>
          ) : (
            filtered.map(tk => {
              const open = expanded === tk.id;
              const replies = getReplies(tk.id);
              const s = ST[tk.status] || ST.open;
              return (
                <div key={tk.id} className="sp-card" style={{ "--accent": s.color }}>
                  <div className="sp-card-head" onClick={() => setExpanded(open ? null : tk.id)}>
                    <div className="sp-card-head-l">
                      <code className="sp-card-id">{tk.enquiry_unique_id}</code>
                      <span className="sp-badge" style={{ color: s.color, background: s.bg }}>
                        <span className="sp-badge-dot" style={{ background: s.dot }} />{s.label}
                      </span>
                    </div>
                    <div className="sp-card-head-r">
                      <span className="sp-card-date"><I.Clock />{tk.createdAt}</span>
                      {open ? <I.Up /> : <I.Down />}
                    </div>
                  </div>
                  <div className="sp-card-meta">
                    <span className="sp-type-pill">{tk.type}</span>
                    {tk.vm_name && <span className="sp-vm-pill"><I.Server />{tk.vm_name}</span>}
                  </div>
                  <p className="sp-card-desc">{tk.enquiry}</p>
                  {tk.image  && <img src={tk.image } alt="" className="sp-bubble-img" />}
                  {open && (
                    <div className="sp-expanded">
                      <hr className="sp-hr" />
                      <p className="sp-thread-title"><I.Msg /> Conversation <span className="sp-thread-count">{replies.length}</span></p>
                      {replies.length === 0 ? <p className="sp-no-reply">No replies yet — support will respond shortly.</p> : (
                        <div className="sp-thread">
                          {replies.map(m => (
                            <div key={m.id} className={`sp-bubble ${m.admin_reply ? "sp-bubble-admin" : "sp-bubble-user"}`}>
                              <div className="sp-bubble-head">
                                <span className="sp-bubble-who">{m.admin_reply ? "🛡️ Support" : "You"}</span>
                                <span className="sp-bubble-time">{m.created_at}</span>
                              </div>
                             {m.admin_reply ? (
                                <div
                                  className="sp-bubble-text"
                                  dangerouslySetInnerHTML={{ __html: m.admin_reply }}
                                />
                              ) : (
                                <p className="sp-bubble-text">{m.reply}</p>
                              )}
                              {m.image && <img src={m.image} alt="" className="sp-bubble-img" />}
                            </div>
                          ))}
                        </div>
                      )}

                      {tk.status !== "completed" && tk.status !== "archived" && (
                        <div className="sp-reply-box">
                          <button className="sp-attach-btn" onClick={() => rRef.current?.click()}>
                            <I.Clip />
                            {replyImg && <span className="sp-attach-dot" />}
                          </button>
                          <input ref={rRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) setReplyImg(e.target.files[0]); }} />
                          <textarea className="sp-reply-input" placeholder="Write your reply..." rows={2} value={replyText} onChange={e => setReplyText(e.target.value)} />
                          <button className="sp-send-btn" onClick={() => reply(tk.id)}><I.Send /></button>
                        </div>
                      )}

                      <div className="sp-actions">
                        {tk.status !== "archived" && tk.archived !== "archived" && (
                          <button className="sp-act-btn" onClick={() => changeStatus(tk, "archived")}><I.Archive /> Archive</button>
                        )}
                        {tk.status === "open" && (
                          <button className="sp-act-btn sp-act-close" onClick={() => changeStatus(tk, "completed")}><I.Check /> Close Ticket</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Create Modal */}
      {modal && (
        <div className="sp-overlay" onClick={() => { setModal(false); resetForm(); }}>
          <div className="sp-modal" onClick={e => e.stopPropagation()}>
            <div className="sp-modal-head">
              <h2>Create New Ticket</h2>
              <button className="sp-modal-x" onClick={() => { setModal(false); resetForm(); }}><I.X /></button>
            </div>
            <div className="sp-modal-body">
              <label className="sp-label">Issue Type <span className="sp-req">*</span></label>
              <div className="sp-type-grid">
                {TYPES.map(t => (
                  <button key={t} className={`sp-type-btn ${fType === t ? "sp-type-btn-on" : ""}`} onClick={() => setFType(t)}>{t}</button>
                ))}
              </div>

              <label className="sp-label">Select Machine {OPTIONAL_VM.includes(fType) && <span className="sp-opt">(optional)</span>} {!OPTIONAL_VM.includes(fType) && <span className="sp-req">*</span>}</label>
              <div className="sp-vm-grid">
                {machines.filter(m => m.public_ip || m.ip_address).map(m => (
                  <button key={m.vm_id} className={`sp-vm-btn ${fVMs.includes(m.vm_id) ? "sp-vm-btn-on" : ""}`} onClick={() => toggleVM(m.vm_id)}>
                    <I.Server /><span>{m.vm_name}</span><code className="sp-vm-ip">{m.public_ip || m.ip_address}</code>
                  </button>
                ))}
                {machines.filter(m => m.public_ip || m.ip_address).length === 0 && <p className="sp-no-vm">No machines available.</p>}
              </div> 

              <label className="sp-label">Description <span className="sp-req">*</span></label>
              <textarea className="sp-form-ta" rows={5} placeholder="Describe your issue in detail..." value={fMsg} onChange={e => setFMsg(e.target.value)} />

              <label className="sp-label">Attachment</label>
              <div className="sp-upload" onClick={() => fRef.current?.click()}>
                <input ref={fRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f && f.size > 2 * 1024 * 1024) { notify("File exceeds 2MB.", false); e.target.value = null; return; } setFImg(f || null); }} />
                {fImg ? (
                  <div className="sp-upload-file">📎 {fImg.name}<button className="sp-upload-rm" onClick={e => { e.stopPropagation(); setFImg(null); }}><I.X /></button></div>
                ) : (
                  <div className="sp-upload-empty"><I.Clip /> Click to attach image (PNG, JPG — max 2MB)</div>
                )}
              </div>
            </div>
            <div className="sp-modal-foot">
              <button className="sp-cancel-btn" onClick={() => { setModal(false); resetForm(); }}>Cancel</button>
              <button className="sp-submit-btn" onClick={create}>Submit Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CSS ─────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#d5cfc6;border-radius:4px}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes toastSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

/* Root */
.sp-root{
  font-family:'Outfit',sans-serif;
  background:#faf8f5;
  min-height:60vh;
  color:#3a3226;
}

/* Toast */
.sp-toast{
  position:fixed;top:20px;right:20px;z-index:100000;
  padding:12px 22px;border-radius:10px;font-size:14px;font-weight:500;
  box-shadow:0 6px 24px rgba(0,0,0,.12);animation:toastSlide .3s ease;
  color:#fff;display:flex;align-items:center;gap:8px;
}
.sp-toast-ok{background:#27ae60}
.sp-toast-err{background:#e74c3c}

/* Loader */
.sp-loader-overlay{
  position:fixed;inset:0;background:rgba(250,248,245,.85);
  display:flex;align-items:center;justify-content:center;z-index:99999;
  backdrop-filter:blur(3px);
}
.sp-loader{
  width:36px;height:36px;border:3px solid #ece7df;
  border-top-color:#E97730;border-radius:50%;animation:spin .7s linear infinite;
}

/* Header */
.sp-header{
  background:#fff;border-bottom:1px solid #ece7df;
  position:sticky;top:0;z-index:100;
  box-shadow:0 1px 8px rgba(0,0,0,.04);
}
.sp-header-inner{
  max-width:1120px;margin:0 auto;padding:14px 24px;
  display:flex;align-items:center;justify-content:space-between;
}
.sp-header-left{display:flex;align-items:center;gap:12px}
.sp-logo{
  width:42px;height:42px;border-radius:11px;
  background:#E97730;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 3px 12px rgba(169,114,72,.25);
}
.sp-title{font-size:19px;font-weight:700;color:#2a2016;letter-spacing:-.3px}
.sp-subtitle{font-size:12.5px;color:#9a8e7f;margin-top:1px}
.sp-create-btn{
  display:flex;align-items:center;gap:7px;
  padding:9px 18px;border-radius:9px;border:none;
  background:#E97730;
  color:#fff;font-size:13.5px;font-weight:600;cursor:pointer;
  font-family:'Outfit',sans-serif;
  box-shadow:0 3px 14px rgba(169,114,72,.28);
  transition:all .2s;
}
.sp-create-btn:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(169,114,72,.35)}

/* Main */
.sp-main{max-width:1120px;margin:0 auto;padding:24px}

/* Stats */
.sp-stats{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap}
.sp-stat{
  flex:1;min-width:100px;padding:16px 12px;border-radius:14px;
  background:#fff;border:2px solid #ece7df;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:2px;
  transition:all .2s;font-family:'Outfit',sans-serif;
  box-shadow:0 1px 4px rgba(0,0,0,.03);
}
.sp-stat:hover{border-color:#d4c8b8;box-shadow:0 3px 12px rgba(0,0,0,.06)}
.sp-stat-active{border-color:#E97730;background:#fdf8f3;box-shadow:0 3px 14px rgba(169,114,72,.1)}
.sp-stat-icon{font-size:20px;line-height:1}
.sp-stat-num{font-size:26px;font-weight:700;color:#2a2016;font-family:'Source Code Pro',monospace}
.sp-stat-label{font-size:11.5px;color:#9a8e7f;font-weight:500;text-transform:uppercase;letter-spacing:.6px}

/* Search */
.sp-search-row{display:flex;align-items:center;gap:14px;margin-bottom:20px;flex-wrap:wrap}
.sp-search-box{
  flex:1;min-width:200px;display:flex;align-items:center;gap:10px;
  padding:10px 16px;border-radius:11px;
  background:#fff;border:1.5px solid #ece7df;color:#9a8e7f;
  transition:border-color .2s;
}
.sp-search-box:focus-within{border-color:#E97730}
.sp-search-input{
  flex:1;background:none;border:none;color:#3a3226;
  font-size:13.5px;font-family:'Outfit',sans-serif;
}
.sp-search-input::placeholder{color:#c4b8a8}
.sp-search-input:focus{outline:none}
.sp-search-clear{background:none;border:none;color:#b8a898;cursor:pointer;padding:3px;display:flex}
.sp-result-count{font-size:12.5px;color:#b8a898;white-space:nowrap}

/* Tickets */
.sp-tickets{display:flex;flex-direction:column;gap:10px}

/* Empty */
.sp-empty{text-align:center;padding:72px 24px;animation:fadeUp .4s ease}
.sp-empty-title{font-size:17px;font-weight:600;color:#6b5e50;margin-top:14px}
.sp-empty-sub{font-size:13px;color:#b8a898;margin-top:4px}

/* Card */
.sp-card{
  background:#fff;border-radius:14px;
  border:1px solid #ece7df;border-left:4px solid var(--accent,#E97730);
  padding:18px 22px;animation:fadeUp .35s ease;
  transition:box-shadow .2s;
  box-shadow:0 1px 4px rgba(0,0,0,.03);
}
.sp-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.06)}

.sp-card-head{display:flex;align-items:center;justify-content:space-between;cursor:pointer;gap:10px;flex-wrap:wrap}
.sp-card-head-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sp-card-head-r{display:flex;align-items:center;gap:10px;color:#b8a898}
.sp-card-id{font-family:'Source Code Pro',monospace;font-size:12.5px;color:#9a8e7f;font-weight:500;background:#f5f1ec;padding:2px 8px;border-radius:5px}
.sp-badge{
  font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px;
  display:inline-flex;align-items:center;gap:5px;
}
.sp-badge-dot{width:6px;height:6px;border-radius:50%;animation:pulse 2s infinite}
.sp-card-date{display:flex;align-items:center;gap:4px;font-size:12px;color:#b8a898}
.sp-card-meta{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.sp-type-pill{
  font-size:12px;color:#6b5e50;font-weight:500;
  padding:3px 10px;border-radius:6px;background:#f5f1ec;
}
.sp-vm-pill{
  font-size:11.5px;color:#9a8e7f;display:inline-flex;
  align-items:center;gap:5px;padding:3px 10px;border-radius:6px;
  background:#f5f1ec;border:1px solid #ece7df;
}
.sp-card-desc{
  font-size:13.5px;color:#7a6e60;margin-top:10px;line-height:1.6;
  overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
}

/* Expanded */
.sp-expanded{animation:fadeUp .3s ease}
.sp-hr{border:none;border-top:1px solid #ece7df;margin:18px 0}
.sp-thread-title{
  display:flex;align-items:center;gap:7px;
  font-size:13.5px;font-weight:600;color:#4a3f33;margin-bottom:14px;
}
.sp-thread-count{
  font-size:11px;background:#f5f1ec;color:#9a8e7f;
  padding:1px 7px;border-radius:10px;font-weight:500;
}
.sp-no-reply{font-size:13px;color:#c4b8a8;font-style:italic;padding:8px 0}

/* Bubbles */
.sp-thread{display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
.sp-bubble{padding:12px 16px;border-radius:12px}
.sp-bubble-admin{background:#eef5fc;border-left:3px solid #a3ccee}
.sp-bubble-user{background:#fdf5ec;border-left:3px solid #ddb88a}
.sp-bubble-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.sp-bubble-who{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:#6b5e50}
.sp-bubble-admin .sp-bubble-who{color:#2d7dd2}
.sp-bubble-user .sp-bubble-who{color:#b37a3a}
.sp-bubble-time{font-size:10.5px;color:#c4b8a8;font-family:'Source Code Pro',monospace}
.sp-bubble-text{font-size:13.5px;color:#4a3f33;line-height:1.6;white-space:pre-wrap}
.sp-bubble-img{max-width:260px;max-height:180px;border-radius:8px;margin-top:8px;border:1px solid #ece7df}

/* Reply */
.sp-reply-box{
  display:flex;align-items:flex-end;gap:8px;
  background:#f9f6f2;border-radius:12px;padding:10px 12px;
  border:1px solid #ece7df;margin-bottom:12px;
}
.sp-attach-btn{
  width:34px;height:34px;border-radius:8px;flex-shrink:0;
  background:#fff;border:1px solid #ece7df;color:#b8a898;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  position:relative;transition:all .2s;
}
.sp-attach-btn:hover{border-color:#E97730;color:#E97730}
.sp-attach-dot{position:absolute;top:-3px;right:-3px;width:7px;height:7px;background:#e74c3c;border-radius:50%}
.sp-reply-input{
  flex:1;background:none;border:none;color:#3a3226;
  font-size:13.5px;font-family:'Outfit',sans-serif;resize:vertical;min-height:36px;line-height:1.5;
}
.sp-reply-input::placeholder{color:#c4b8a8}
.sp-reply-input:focus{outline:none}
.sp-send-btn{
  width:38px;height:38px;border-radius:9px;flex-shrink:0;
  background:linear-gradient(135deg,#E97730,#a57248);
  border:none;color:#fff;cursor:pointer;display:flex;
  align-items:center;justify-content:center;
}
.sp-send-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px #E97730)}

/* Actions */
.sp-actions{display:flex;gap:8px;flex-wrap:wrap}
.sp-act-btn{
  display:flex;align-items:center;gap:5px;
  padding:7px 13px;border-radius:8px;font-size:12px;font-weight:500;
  background:#f5f1ec;border:1px solid #ece7df;color:#7a6e60;
  cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;
}
.sp-act-btn:hover{background:#ece7df}
.sp-act-close{background:#fce8e8;border-color:#f5c6c6;color:#c0392b}
.sp-act-close:hover{background:#f5c6c6}

/* Modal */
.sp-overlay{
  position:fixed;inset:0;background:rgba(42,32,22,.35);
  display:flex;align-items:center;justify-content:center;
  z-index:10000;backdrop-filter:blur(6px);padding:20px;
}
.sp-modal{
  width:100%;max-width:600px;max-height:88vh;
  background:#fff;border-radius:18px;
  box-shadow:0 24px 64px rgba(0,0,0,.15);
  animation:fadeUp .3s ease;display:flex;flex-direction:column;overflow:hidden;
}
.sp-modal-head{
  display:flex;justify-content:space-between;align-items:center;
  padding:18px 22px;border-bottom:1px solid #ece7df;
}
.sp-modal-head h2{font-size:17px;font-weight:700;color:#2a2016}
.sp-modal-x{
  width:30px;height:30px;border-radius:7px;background:#f5f1ec;
  border:none;color:#9a8e7f;cursor:pointer;display:flex;align-items:center;justify-content:center;
}
.sp-modal-body{padding:22px;overflow-y:auto;flex:1}
.sp-modal-foot{
  display:flex;justify-content:flex-end;gap:10px;
  padding:14px 22px;border-top:1px solid #ece7df;
}

/* Form */
.sp-label{
  display:block;font-size:12px;font-weight:600;color:#9a8e7f;
  text-transform:uppercase;letter-spacing:.5px;margin-top:16px;margin-bottom:7px;
}
.sp-label:first-child{margin-top:0}
.sp-req{color:#e74c3c}
.sp-opt{color:#c4b8a8;font-weight:400;text-transform:none;letter-spacing:0;font-size:11.5px}

.sp-type-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.sp-type-btn{
  padding:9px 10px;border-radius:9px;font-size:12.5px;font-weight:500;text-align:center;
  background:#f9f6f2;border:1.5px solid #ece7df;color:#7a6e60;cursor:pointer;
  font-family:'Outfit',sans-serif;transition:all .15s;
}
.sp-type-btn:hover{border-color:#d4c8b8}
.sp-type-btn-on{background:#fdf5ec;border-color:#E97730;color:#a57248;font-weight:600}

.sp-vm-grid{display:flex;gap:7px;flex-wrap:wrap}
.sp-vm-btn{
  display:flex;align-items:center;gap:7px;
  padding:9px 13px;border-radius:9px;font-size:12.5px;
  background:#f9f6f2;border:1.5px solid #ece7df;color:#7a6e60;
  cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;
}
.sp-vm-btn:hover{border-color:#d4c8b8}
.sp-vm-btn-on{background:#eef5fc;border-color:#a3ccee;color:#2d7dd2}
.sp-vm-ip{font-size:10.5px;color:#c4b8a8;font-family:'Source Code Pro',monospace;margin-left:auto}
.sp-no-vm{font-size:12.5px;color:#c4b8a8;font-style:italic}

.sp-form-ta{
  width:100%;background:#f9f6f2;border:1.5px solid #ece7df;border-radius:11px;
  padding:12px 14px;color:#3a3226;font-size:13.5px;font-family:'Outfit',sans-serif;
  resize:vertical;line-height:1.6;transition:border-color .2s;
}
.sp-form-ta:focus{border-color:#E97730;outline:none}
.sp-form-ta::placeholder{color:#c4b8a8}

.sp-upload{
  padding:18px;border-radius:11px;border:2px dashed #ddd4c8;
  background:#fcfaf7;cursor:pointer;transition:all .2s;
}
.sp-upload:hover{border-color:#E97730;background:#fdf8f3}
.sp-upload-empty{display:flex;align-items:center;gap:8px;justify-content:center;color:#b8a898;font-size:13px}
.sp-upload-file{display:flex;align-items:center;justify-content:space-between;color:#6b5e50;font-size:13px}
.sp-upload-rm{background:none;border:none;color:#e74c3c;cursor:pointer;padding:2px;display:flex}

.sp-cancel-btn{
  padding:9px 18px;border-radius:9px;font-size:13.5px;font-weight:500;
  background:#f5f1ec;border:1px solid #ece7df;color:#7a6e60;
  cursor:pointer;font-family:'Outfit',sans-serif;transition:all .2s;
}
.sp-cancel-btn:hover{background:#ece7df}
.sp-submit-btn{
  padding:9px 22px;border-radius:9px;font-size:13.5px;font-weight:600;
  background:#E97730;
  border:none;color:#fff;cursor:pointer;font-family:'Outfit',sans-serif;
  box-shadow:0 3px 12px rgba(169,114,72,.25);transition:all .2s;
}
.sp-submit-btn:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(169,114,72,.35)}

/* Responsive */
@media(max-width:768px){
  .sp-main{padding:16px}
  .sp-stats{gap:6px}
  .sp-stat{min-width:60px;padding:12px 6px}
  .sp-stat-num{font-size:20px}
  .sp-stat-label{font-size:10px}
  .sp-stat-icon{font-size:16px}
  .sp-card{padding:14px 16px}
  .sp-card-head{flex-direction:column;align-items:flex-start;gap:6px}
  .sp-card-head-r{width:100%;justify-content:space-between}
  .sp-type-grid{grid-template-columns:1fr 1fr}
  .sp-modal{max-height:92vh;border-radius:14px}
  .sp-modal-body{padding:16px}
  .sp-header-inner{padding:12px 16px}
  .sp-title{font-size:16px}
  .sp-create-btn{padding:8px 14px;font-size:12.5px}
  .sp-bubble{padding:10px 12px}
  .sp-reply-box{padding:8px 10px}
}
@media(max-width:480px){
  .sp-stats{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:6px}
  .sp-stat{min-width:80px;flex:0 0 auto}
  .sp-type-grid{grid-template-columns:1fr}
  .sp-search-row{flex-direction:column;align-items:stretch}
  .sp-result-count{text-align:right}
}
`;