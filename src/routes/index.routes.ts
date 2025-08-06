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
<title>Auth & Projects Test Client</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 500px; margin: 2rem auto; padding: 1rem; background: #f9f9f9; border: 1px solid #ddd; border-radius: 6px; }
  h1 { text-align: center; }
  .tabs { display: flex; margin-bottom: 1rem; }
  .tab { flex: 1; padding: 0.5rem; text-align: center; background: #eee; cursor: pointer; user-select: none; border: 1px solid #ccc; border-bottom: none; }
  .tab.hidden { display: none; }
  .tab.active { background: white; border-top: 3px solid #007bff; font-weight: bold; }
  form, #project-section { background: white; padding: 1rem; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 1rem; }
  label { display: block; margin-top: 0.75rem; }
  input { width: 100%; padding: 0.4rem; margin-top: 0.25rem; border: 1px solid #ccc; border-radius: 4px; }
  button { margin-top: 1rem; padding: 0.6rem 1rem; width: 100%; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
  button:disabled { background: #aaa; }
  .message { margin-top: 1rem; padding: 0.75rem; border-radius: 4px; }
  .message.success { background: #d4edda; color: #155724; }
  .message.error { background: #f8d7da; color: #721c24; }
  .logout { text-align: right; margin-bottom: 1rem; }
  .logout button { width: auto; padding: 0.4rem 0.8rem; background: #dc3545; }
</style>
</head>
<body>

<h1>Auth & Projects Test Client</h1>

<div class="logout" id="logout-container" style="display:none;">
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

<form id="login-form" style="display:none;">
  <label>Email</label>
  <input type="email" id="login-email" required />
  <label>Password</label>
  <input type="password" id="login-password" required minlength="6" />
  <button type="submit">Login</button>
  <div id="login-message" class="message" style="display:none;"></div>
</form>

<div id="project-section" style="display:none;">
  <form id="create-project-form">
    <label>Project Name</label>
    <input type="text" id="proj-name" required />
    <label>Description</label>
    <input type="text" id="proj-desc" required />
    <button type="submit">Create Project</button>
    <div id="proj-message" class="message" style="display:none;"></div>
  </form>
  <div id="projects-list">
    <h3>Your Projects</h3>
    <ul id="proj-list-ul"></ul>
  </div>
</div>

<script>
  const API_BASE_URL = "/api/auth";
  const PROJECT_API = "/api/project";
  let authToken = localStorage.getItem("authToken");

  const tabs = {
    register: document.getElementById("tab-register"),
    login: document.getElementById("tab-login"),
    project: document.getElementById("tab-project")
  };
  const views = {
    register: document.getElementById("register-form"),
    login: document.getElementById("login-form"),
    project: document.getElementById("project-section")
  };
  const logoutContainer = document.getElementById("logout-container");

  function setAuthenticated(state) {
    if (state) {
      logoutContainer.style.display = "block";
      tabs.project.classList.remove("hidden");
    } else {
      logoutContainer.style.display = "none";
      tabs.project.classList.add("hidden");
      authToken = null;
      localStorage.removeItem("authToken");
    }
    showView(state ? "project" : "login");
  }

  function showView(view) {
    Object.values(tabs).forEach(t => t.classList.remove("active"));
    Object.values(views).forEach(v => v.style.display = "none");
    tabs[view].classList.add("active");
    views[view].style.display = "block";
    clearMessages();
    if (view === "project") loadProjects();
  }

  tabs.register.onclick = () => showView("register");
  tabs.login.onclick = () => showView("login");
  tabs.project.onclick = () => showView("project");

  document.getElementById("logout-button").onclick = async () => {
    await fetch(API_BASE_URL + "/logout", {
      method: "POST",
      headers: { "Authorization": "Bearer " + authToken }
    });
    setAuthenticated(false);
  };

  function clearMessages() {
    ["reg-message","login-message","proj-message"].forEach(id => {
      document.getElementById(id).style.display = "none";
    });
  }

  function showMessage(id, text, success) {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = "message " + (success ? "success" : "error");
    el.style.display = "block";
  }

  document.getElementById("register-form").addEventListener("submit", async e => {
    e.preventDefault();
    clearMessages();
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const res = await fetch(API_BASE_URL + "/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) showMessage("reg-message", data.message, false);
    else showMessage("reg-message","Registered! Check email.", true);
  });

  document.getElementById("login-form").addEventListener("submit", async e => {
    e.preventDefault();
    clearMessages();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const res = await fetch(API_BASE_URL + "/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return showMessage("login-message", data.message, false);
    authToken = data.accessToken;
    localStorage.setItem("authToken", authToken);
    showMessage("login-message","Login successful!", true);
    setAuthenticated(true);
  });

  document.getElementById("create-project-form").addEventListener("submit", async e => {
    e.preventDefault();
    clearMessages();
    const name = document.getElementById("proj-name").value;
    const description = document.getElementById("proj-desc").value;
    const res = await fetch(PROJECT_API + "/create", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization":"Bearer " + authToken
      },
      body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    if (!res.ok) showMessage("proj-message", data.message, false);
    else { showMessage("proj-message","Project created!", true); loadProjects(); }
  });

  async function loadProjects() {
    const res = await fetch(PROJECT_API + "/list", {
      headers: { "Authorization":"Bearer " + authToken }
    });
    if (!res.ok) return;
    const projects = await res.json();
    const ul = document.getElementById("proj-list-ul");
    ul.innerHTML = "";
    projects.forEach(p => {
      const li = document.createElement("li");
      li.textContent = \`\${p.id}: \${p.name} - \${p.description}\`;
      ul.appendChild(li);
    });
  }

  // Initialize
  if (authToken) setAuthenticated(true);
  else setAuthenticated(false);
</script>

</body>
</html>
  `);
});

export default indexRouter;
