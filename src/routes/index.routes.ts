import { Router as createRouter } from "express";
import type { Router, Request, Response } from "express";

const indexRouter: Router = createRouter();

indexRouter.get("/", (req: Request, res: Response) => {
  res.type("html").send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Berta Forge Dashboard</title>
  <style>
    :root {
      --dark-bg: #2F3136;
      --card-bg: #36393F;
      --gradient-accent: linear-gradient(135deg, #FF8C00 0%, #FFD700 100%);
      --text-light: #FFFFFF;
      --text-muted: #B9BBBE;
      --btn-bg: #FF8C00;
      --btn-hover: #E07C00;
      --input-bg: #202225;
      --input-border: #4F545C;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", sans-serif;
      background: var(--dark-bg);
      color: var(--text-light);
      padding: 2rem;
    }
    h1 {
      text-align: center;
      font-size: 2.5rem;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1.5rem;
    }
    .logout { text-align: right; margin-bottom: 1rem; }
    .logout button {
      background: var(--btn-bg);
      color: var(--dark-bg);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    }
    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .tab {
      padding: 0.6rem 1.2rem;
      background: var(--card-bg);
      border-radius: 4px;
      cursor: pointer;
      color: var(--text-muted);
      transition: background 0.2s, color 0.2s;
    }
    .tab.active {
      background: var(--gradient-accent);
      color: var(--dark-bg);
    }
    .hidden { display: none !important; }
    form, #project-section, #detail-view {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-top: 1rem;
      font-weight: 500;
      color: var(--text-light);
    }
    input {
      width: 100%;
      padding: 0.6rem;
      margin-top: 0.4rem;
      border: 1px solid var(--input-border);
      border-radius: 4px;
      background: var(--input-bg);
      color: var(--text-light);
    }
    button[type="submit"], #add-project-btn, #back-btn {
      margin-top: 1.2rem;
      background: var(--btn-bg);
      color: var(--dark-bg);
      border: none;
      padding: 0.7rem 1.4rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button[type="submit"]:hover,
    #add-project-btn:hover,
    #back-btn:hover {
      background: var(--btn-hover);
    }
    .message {
      margin-top: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.95rem;
    }
    .message.success { background: #2E4E2E; color: #B6FCB6; }
    .message.error   { background: #4E2E2E; color: #FCB6B6; }
    #project-list {
      display: grid;
      grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .card {
      background: var(--card-bg);
      padding: 1rem;
      border-radius: 8px;
      position: relative;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    }
    .card h3 {
      margin-bottom: 0.5rem;
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .card p { font-size: 0.9rem; color: var(--text-muted); }
    .menu {
      position: absolute;
      top: 0.6rem; right: 0.6rem;
      font-size: 1.2rem;
      color: var(--text-muted);
      cursor: pointer;
    }
    .menu:hover { color: var(--btn-bg); }
    #detail-view h2 {
      background: var(--gradient-accent);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    #detail-view h3 {
      margin-top: 1rem;
      color: var(--btn-bg);
    }
    #copy-msg {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--btn-bg);
      color: var(--dark-bg);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      display: none;
      font-weight: bold;
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
    <div id="tab-login" class="tab">Login</div>
    <div id="tab-project" class="tab hidden">Projects</div>
  </div>

  <form id="register-form">
    <label>Name</label>
    <input type="text" id="reg-name" required />
    <label>Email</label>
    <input type="email" id="reg-email" required />
    <label>Password</label>
    <input type="password" id="reg-password" required minlength="6" />
    <button type="submit">Register</button>
    <div id="reg-message" class="message" style="display:none;"></div>
  </form>

  <form id="login-form" class="hidden">
    <label>Email</label>
    <input type="email" id="login-email" required />
    <label>Password</label>
    <input type="password" id="login-password" required minlength="6" />
    <button type="submit">Login</button>
    <div id="login-message" class="message" style="display:none;"></div>
  </form>

  <div id="project-section" class="hidden">
    <button id="add-project-btn">+ New Project</button>
    <div id="project-list"></div>
  </div>

  <div id="detail-view" class="hidden">
    <button id="back-btn">← Back to Projects</button>
    <h2 id="detail-name"></h2>
    <p id="detail-desc"></p>
    <h3>Endpoints</h3><p style="color:var(--text-muted)">(coming soon)</p>
    <h3>Variables</h3><p style="color:var(--text-muted)">(coming soon)</p>
  </div>

  <div id="copy-msg">Project ID copied</div>

  <script>
    const AUTH = "/api/auth";
    const PROJ = "/api/projects";
    let authToken = localStorage.getItem("authToken");

    const tabs  = {
      register: document.getElementById("tab-register"),
      login:    document.getElementById("tab-login"),
      project:  document.getElementById("tab-project")
    };
    const views = {
      register: document.getElementById("register-form"),
      login:    document.getElementById("login-form"),
      project:  document.getElementById("project-section"),
      detail:   document.getElementById("detail-view")
    };

    function setAuth(isAuth) {
      document.getElementById("logout-container").classList.toggle("hidden", !isAuth);
      tabs.project.classList.toggle("hidden", !isAuth);
      tabs.register.classList.toggle("hidden", isAuth);
      tabs.login.classList.toggle("hidden", isAuth);
      showView(isAuth ? "project" : "login");
    }

    function showView(name) {
      Object.values(views).forEach(v => v.classList.add("hidden"));
      views[name].classList.remove("hidden");
      Object.values(tabs).forEach(t => t.classList.remove("active"));
      tabs[name]?.classList.add("active");
      if (name === "project") loadProjects();
    }

    tabs.register.onclick = () => showView("register");
    tabs.login.onclick    = () => showView("login");
    tabs.project.onclick  = () => showView("project");

    document.getElementById("logout-button").onclick = async () => {
      await fetch(AUTH + "/logout", { method: "POST", headers: { "Authorization": "Bearer " + authToken } });
      localStorage.removeItem("authToken");
      authToken = null;
      setAuth(false);
    };

    document.getElementById("register-form").addEventListener("submit", async e => {
      e.preventDefault();
      clearMsg("reg-message");
      let r = await fetch(AUTH + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("reg-name").value,
          email: document.getElementById("reg-email").value,
          password: document.getElementById("reg-password").value
        })
      });
      let d = await r.json();
      showMsg("reg-message", d.message, r.ok);
    });

    document.getElementById("login-form").addEventListener("submit", async e => {
      e.preventDefault();
      clearMsg("login-message");
      let r = await fetch(AUTH + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: document.getElementById("login-email").value,
          password: document.getElementById("login-password").value
        })
      });
      let d = await r.json();
      if (!r.ok) return showMsg("login-message", d.message, false);
      let token = d.data.session.access_token;
      authToken = token;
      localStorage.setItem("authToken", token);
      showMsg("login-message", "Login successful", true);
      setAuth(true);
    });

    async function loadProjects() {
      let r = await fetch(PROJ + "/list", {
        headers: { "Authorization": "Bearer " + authToken }
      });
      let d = await r.json();
      if (!r.ok) return showMsgGlobal(d.error || "Failed to load projects");
      const list = document.getElementById("project-list");
      list.innerHTML = "";
      d.data.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = \`
          <div class="menu" title="Copy Project ID">⋮</div>
          <h3>\${p.name}</h3>
          <p>\${p.description}</p>\`;
        card.onclick = () => showDetail(p);
        card.querySelector(".menu").onclick = e => {
          e.stopPropagation();
          navigator.clipboard.writeText(p.id);
          flashCopyMsg();
        };
        list.appendChild(card);
      });
    }

    function showDetail(p) {
      document.getElementById("detail-name").innerText = p.name;
      document.getElementById("detail-desc").innerText = p.description;
      showView("detail");
    }
    document.getElementById("back-btn").onclick = () => showView("project");

    function clearMsg(id) {
      const e = document.getElementById(id);
      if (e) e.style.display = "none";
    }
    function showMsg(id, text, ok) {
      const e = document.getElementById(id);
      e.textContent = text;
      e.className = "message " + (ok ? "success" : "error");
      e.style.display = "block";
    }
    function showMsgGlobal(text) {
      // replace alert: show at bottom
      flashCopyMsg(text);
    }

    function flashCopyMsg(text = "Project ID copied") {
      const el = document.getElementById("copy-msg");
      el.textContent = text;
      el.style.display = "block";
      setTimeout(() => el.style.display = "none", 1500);
    }

    setAuth(!!authToken);
  </script>

  <div id="copy-msg"></div>

</body>
</html>
  `);
});

export default indexRouter;
