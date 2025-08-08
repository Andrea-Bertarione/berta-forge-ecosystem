import { Router as createRouter } from "express";
import type { Router, Request, Response } from "express";

const indexRouter: Router = createRouter();

indexRouter.get("/", (_req: Request, res: Response) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Berta Forge Dashboard</title>
<style>
  :root {
    --dark-bg: #36393F; --card-bg: #2F3136;
    --gradient-accent: linear-gradient(135deg,#FF8C00 0%,#FFD700 100%);
    --text-light: #FFFFFF; --text-muted: #B9BBBE;
    --btn-bg: #FF8C00; --btn-hover: #E07C00;
    --input-bg: #202225; --input-border: #4F545C;
  }
  * { box-sizing:border-box; margin:0; padding:0 }
  body { font-family:"Segoe UI",sans-serif; background:var(--dark-bg); color:var(--text-light); padding:2rem }
  h1 { text-align:center; font-size:2.5rem;
    background:var(--gradient-accent); -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; margin-bottom:1.5rem }
  .logout { text-align:right; margin-bottom:1rem }
  .logout button {
    background:var(--btn-bg); color:var(--dark-bg);
    border:none; padding:.5rem 1rem; border-radius:4px; font-weight:bold; cursor:pointer
  }
  .tabs { display:flex; justify-content:center; gap:1rem; margin-bottom:1.5rem; position:relative }
  .tab {
    padding:.6rem 1.2rem; background:var(--card-bg); border-radius:4px;
    cursor:pointer; color:var(--text-muted); transition:background .2s,color .2s
  }
  .tab.active { background:var(--gradient-accent); color:var(--dark-bg) }
  .hidden { display:none!important }
  .notif-dropdown {
    position:absolute; top:2.8rem; right:1rem; background:var(--card-bg);
    border-radius:6px; box-shadow:0 2px 8px rgba(0,0,0,0.5);
    width:280px; max-height:300px; overflow-y:auto; display:none; z-index:100
  }
  .notif-item { padding:.75rem; border-bottom:1px solid #4F545C; cursor:pointer }
  .notif-item:last-child { border:none }
  .notif-item:hover { background:#4F545C }
  form,#project-section,#detail-view {
    background:var(--card-bg); padding:1.5rem; border-radius:8px; margin-bottom:1.5rem
  }
  label { display:block; margin-top:1rem; font-weight:500; color:var(--text-light) }
  input,select {
    width:100%; padding:.6rem; margin-top:.4rem;
    border:1px solid var(--input-border); border-radius:4px;
    background:var(--input-bg); color:var(--text-light)
  }
  .btn,button[type="submit"] {
    margin-top:1.2rem; background:var(--btn-bg); color:var(--dark-bg);
    border:none; padding:.7rem 1.4rem; border-radius:4px;
    font-weight:600; cursor:pointer; transition:background .2s
  }
  .btn:hover,button[type="submit"]:hover { background:var(--btn-hover) }
  .message { margin-top:1rem; padding:.75rem; border-radius:4px; font-size:.95rem }
  .message.success { background:#2E4E2E; color:#B6FCB6 }
  .message.error   { background:#4E2E2E; color:#FCB6B6 }
  #project-list {
    display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
    gap:1rem; margin-top:1rem
  }
  .card {
    background:var(--card-bg); padding:1rem; border-radius:8px;
    position:relative; transition:transform .2s,box-shadow .2s; cursor:pointer
  }
  .card:hover { transform:translateY(-4px); box-shadow:0 4px 12px rgba(0,0,0,.5) }
  .card h3 {
    margin-bottom:.5rem; background:var(--gradient-accent);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent
  }
  .card p { font-size:.9rem; color:var(--text-muted) }
  .menu {
    position:absolute; top:.6rem; right:.6rem; font-size:1.2rem;
    color:var(--text-muted); cursor:pointer
  }
  .menu:hover { color:var(--btn-bg) }
  #copy-msg {
    position:fixed; bottom:1rem; left:50%; transform:translateX(-50%);
    background:var(--btn-bg); color:var(--dark-bg); padding:.5rem 1rem;
    border-radius:4px; display:none; font-weight:bold
  }
</style>
</head>
<body>

<h1>Berta Forge Dashboard</h1>
<div class="logout hidden" id="logout-container">
  <button id="logout-button">Logout</button>
</div>

<div class="tabs">
  <div id="tab-register" class="tab active">Register</div>
  <div id="tab-login"    class="tab">Login</div>
  <div id="tab-projects" class="tab hidden">My Projects</div>
  <div id="tab-collab"   class="tab hidden">Collaborations</div>
  <div id="tab-notifications" class="tab hidden" data-count="0">Notifications</div>
  <div id="notif-dropdown" class="notif-dropdown"></div>
</div>

<form id="register-form">
  <label>Name</label><input type="text" id="reg-name" required/>
  <label>Email</label><input type="email" id="reg-email" required/>
  <label>Password</label><input type="password" id="reg-password" required minlength="6"/>
  <button type="submit" class="btn">Register</button>
  <div id="reg-message" class="message" style="display:none;"></div>
</form>

<form id="login-form" class="hidden">
  <label>Email</label><input type="email" id="login-email" required/>
  <label>Password</label><input type="password" id="login-password" required minlength="6"/>
  <button type="submit" class="btn">Login</button>
  <div id="login-message" class="message" style="display:none;"></div>
</form>

<div id="project-section" class="hidden">
  <button id="add-project-btn" class="btn">+ New Project</button>
  <div id="project-list"></div>
</div>

<div id="detail-view" class="hidden">
  <button id="back-btn" class="btn">← Back</button>
  <h2 id="detail-name"></h2>
  <p id="detail-desc"></p>
  <button id="show-invite-ui" class="btn">Invite</button>
  <div id="invite-ui" class="hidden">
    <h3>New Invite</h3>
    <label>Type</label>
    <select id="invite-type"><option value="link">Link</option><option value="direct">Direct</option></select>
    <div id="invite-direct" class="hidden">
      <label>Search User</label><input id="invite-user-search" placeholder="Type at least 2 chars"/>
      <div id="user-suggestions" class="notif-dropdown"></div>
    </div>
    <label>Expires</label><input type="date" id="invite-expire"/>
    <button id="send-invite-btn" class="btn">Send Invite</button>
    <div id="invite-msg" class="message" style="display:none;"></div>
  </div>
</div>

<div id="copy-msg">Copied!</div>

<script>
// Endpoint constants
const AUTH    = "/api/auth";
const REFRESH = "/api/auth/refresh";
const PROJ    = "/api/projects";
const INV     = "/api/projects/invite";
const GET_USERS  = "/api/user/getUsersByName";
const GET_NOTIFS = "/api/user/getNotifications";

// State
let authToken    = localStorage.getItem("authToken");
let refreshToken = localStorage.getItem("refreshToken");
let userId       = localStorage.getItem("userId");
let allProjects  = [];
let notifications= [];

// Utility: fetch with auto-refresh
async function fetchWithRefresh(url, opts={}) {
  if (!opts.headers) opts.headers = {};
  if (authToken) opts.headers["Authorization"] = "Bearer "+authToken;
  let res = await fetch(url, opts);
  if (res.status===401 && refreshToken) {
    const r2 = await fetch(REFRESH, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({refresh_token:refreshToken})
    });
    if (r2.ok) {
      const d2 = await r2.json();
      authToken    = d2.access_token;
      refreshToken = d2.refresh_token;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("refreshToken", refreshToken);
      opts.headers["Authorization"]="Bearer "+authToken;
      return fetch(url, opts);
    }
  }
  return res;
}

// Tab & view elements
const tabs  = {
  register: document.getElementById("tab-register"),
  login:    document.getElementById("tab-login"),
  projects: document.getElementById("tab-projects"),
  collab:   document.getElementById("tab-collab"),
  notifications: document.getElementById("tab-notifications")
};
const views = {
  register:    document.getElementById("register-form"),
  login:       document.getElementById("login-form"),
  projectList: document.getElementById("project-section"),
  detail:      document.getElementById("detail-view")
};

// Show/hide logic
function setAuth(isAuth) {
  document.getElementById("logout-container").classList.toggle("hidden", !isAuth);
  tabs.register .classList.toggle("hidden", isAuth);
  tabs.login    .classList.toggle("hidden", isAuth);
  tabs.projects .classList.toggle("hidden", !isAuth);
  tabs.collab   .classList.toggle("hidden", !isAuth);
  tabs.notifications.classList.toggle("hidden", !isAuth);
  showView(isAuth ? "projects":"register");
  if (isAuth) loadAll();
}
function showView(name) {
  Object.values(views).forEach(v=>v.classList.add("hidden"));
  Object.values(tabs).forEach(t=>t.classList.remove("active"));
  if (name==="register") { views.register.classList.remove("hidden"); tabs.register.classList.add("active"); }
  if (name==="login")    { views.login   .classList.remove("hidden"); tabs.login   .classList.add("active"); }
  if (name==="projects") { views.projectList.classList.remove("hidden"); tabs.projects.classList.add("active"); renderProjects(filterOwned()); }
  if (name==="collab")   { views.projectList.classList.remove("hidden"); tabs.collab.classList.add("active"); renderProjects(filterCollaborations()); }
  if (name==="detail")   { views.detail.classList.remove("hidden"); }
  if (name==="notifications") tabs.notifications.classList.add("active");
}

// Tab clicks
tabs.register.onclick      = ()=>showView("register");
tabs.login.onclick         = ()=>showView("login");
tabs.projects.onclick      = ()=>showView("projects");
tabs.collab.onclick        = ()=>showView("collab");
tabs.notifications.onclick = toggleNotifs;

// Auth handlers
document.getElementById("register-form").addEventListener("submit",async e=>{
  e.preventDefault(); clearMsg("reg-message");
  const r = await fetch(AUTH+"/register",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:document.getElementById("reg-name").value,
      email:document.getElementById("reg-email").value,
      password:document.getElementById("reg-password").value
    })
  });
  const d = await r.json(); showMsg("reg-message",d.message,r.ok);
});
document.getElementById("login-form").addEventListener("submit",async e=>{
  e.preventDefault(); clearMsg("login-message");
  const r = await fetch(AUTH+"/login",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:document.getElementById("login-email").value,
      password:document.getElementById("login-password").value
    })
  });
  const d = await r.json();
  if (!r.ok) return showMsg("login-message",d.message,false);
  authToken    = d.data.session.access_token;
  refreshToken = d.data.session.refresh_token;
  userId       = d.data.user.id;
  localStorage.setItem("authToken",authToken);
  localStorage.setItem("refreshToken",refreshToken);
  localStorage.setItem("userId",userId);
  showMsg("login-message","Login successful",true);
  setAuth(true);
});
document.getElementById("logout-button").onclick = async () => {
  await fetch(AUTH+"/logout",{method:"POST",headers:{"Authorization":"Bearer "+authToken}});
  localStorage.clear(); setAuth(false);
};

// Load data
async function loadAll() {
  await refreshNotifications();
  const res = await fetchWithRefresh(PROJ+"/list");
  const d = await res.json();
  if (!res.ok) return showMsgGlobal(d.message||"Failed to load");
  allProjects = d.data; showView("projects");
}

// Notifications
async function refreshNotifications() {
  const res = await fetchWithRefresh(GET_NOTIFS);
  if (!res.ok) return;
  const d = await res.json();
  notifications = d.data;
  tabs.notifications.dataset.count = notifications.length;
  const dd = document.getElementById("notif-dropdown");
  dd.innerHTML = notifications.map(n=>\`
    <div class="notif-item" data-token="\${n.token}">\${n.description}</div>\`).join("");
  dd.style.display="none";
  dd.querySelectorAll(".notif-item").forEach(el=>{
    el.onclick=()=>location.href="/invite/accept/"+el.dataset.token;
  });
}
function toggleNotifs() {
  const dd = document.getElementById("notif-dropdown");
  dd.style.display = dd.style.display==="block"?"none":"block";
}

// Project filtering/rendering
function filterOwned() {
  if (!userId) return []; return allProjects.filter(p=>p.owner===userId);
}
function filterCollaborations() {
  if (!userId) return []; return allProjects.filter(p=>p.owner!==userId && p.collaborators?.[userId]);
}
function renderProjects(arr) {
  const list = document.getElementById("project-list"); list.innerHTML="";
  arr.forEach(p=>{
    const card=document.createElement("div"); card.className="card";
    card.innerHTML=\`
      <div class="menu">⋮</div><h3>\${p.name}</h3><p>\${p.description}</p>\`;
    card.querySelector(".menu").onclick=e=>{
      e.stopPropagation();navigator.clipboard.writeText(p.id);flashCopyMsg("Copied");
    };
    card.onclick=()=>{
      document.getElementById("detail-name").innerText=p.name;
      document.getElementById("detail-desc").innerText=p.description;
      showView("detail");
    };
    list.appendChild(card);
  });
}

// Invite UI wiring (make show-invite-ui visible)
document.getElementById("show-invite-ui").onclick = () => {
  document.getElementById("invite-ui").classList.toggle("hidden");
};

// Helpers
function clearMsg(id){ const e=document.getElementById(id); if(e) e.style.display="none"; }
function showMsg(id,text,ok){ const e=document.getElementById(id); e.textContent=text; e.className="message "+(ok?"success":"error"); e.style.display="block"; }
function showMsgGlobal(text){ flashCopyMsg(text); }
function flashCopyMsg(text="Copied"){ const el=document.getElementById("copy-msg"); el.textContent=text; el.style.display="block"; setTimeout(()=>el.style.display="none",1500); }

// Init
setAuth(!!authToken);
</script>
`);
});

export default indexRouter;
