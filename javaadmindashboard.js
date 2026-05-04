const DMembers  = [ 
  { id: 1, name: "Ahmed Said",      email: "ahmed@gmail.com",    phone: "0551234567", plan: "Bronze", joinDate: "2026-03-13", status: "Pending"  },
  { id: 2, name: "Khaloug Kamal",   email: "kamal@gmail.com",    phone: "0662345678", plan: "Silver", joinDate: "2026-03-12", status: "Active"   },
  { id: 3, name: "Azouz Mounsouf",  email: "azouz@gmail.com",    phone: "0773456789", plan: "Silver", joinDate: "2026-03-12", status: "Active"   },
  { id: 4, name: "Kahloush Marwa",  email: "marwa@gmail.com",    phone: "0554567890", plan: "Gold",   joinDate: "2026-03-11", status: "Expired"  },
  { id: 5, name: "Abazi Souaad",  email: "souaad@gmail.com",   phone: "0665678901", plan: "Gold",   joinDate: "2026-03-09", status: "Active"   },
];
 
function Members() { 
  let data = localStorage.getItem("gymMembers"); 
  if (data) {
    return JSON.parse(data); 
  } else {
    saveMembers(DMembers);
    return DMembers;
  }
}
 
function saveMembers(list) {
  localStorage.setItem("gymMembers", JSON.stringify(list));
                                                          
}
let members   = Members();
let editId = null;

function build() { 
  let main = document.querySelector("main"); 
 
  let oldSection = main.querySelector("section:last-of-type"); 
  if (oldSection) oldSection.remove();
 
  main.innerHTML += `
    <hr>
    <section id="member-section">
      <h2>👥 Member Management 👥</h2>
 
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin:16px 0 8px;">
        <input id="searchInput" type="text" placeholder="🔍 Search by name or email"
          style="padding:8px 12px; border:1.5px solid #444; border-radius:8px;
                 background: #f1e6f8; color: #080808; flex:1;">
 
        <select id="Filter"
          style="padding:8px 12px; border:1.5px solid #444; border-radius:8px;
                 background: #ffd700; color: #1b0101;">
          <option value="All">All Plans</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
 
        <button onclick="openAddModal()" style="padding:8px 18px; background: #7580fc; color: #fff; border:none; border-radius:8px; cursor:pointer; font-weight:600;">
          + Add Member
        </button>
      </div>
 
      <p id="Count"></p>
 
      <div >
        <table style="width:95%;">
          <thead>
            <tr>
              <th style="padding:10px 14px; ">#</th>
              <th style="padding:10px 14px;">Name</th>
              <th style="padding:10px 14px;">Email</th>
              <th style="padding:10px 14px;">Phone</th>
              <th style="padding:10px 14px; ">Plan</th>
              <th style="padding:10px 14px; ">Join Date</th>
              <th style="padding:10px 14px;">Status</th>
              <th style="padding:10px 14px; ">Actions</th>
            </tr>
          </thead>
          <tbody id="memberBody"></tbody>
        </table>
      </div>
    </section>
 
    
    <div id="Model" style="display:none; position:fixed; inset:0;
         background:rgba(0, 0, 0, 0.7);
         align-items:center; justify-content:center;">
      <div style="background: #ece7ef; border:1px solid #8181ff; border-radius:14px;padding:28px; width:80%; ">
        <h3 id="modalTitle" style="margin:0 0 18px; color: #0b0d17;"></h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <label style="display:flex; flex-direction:column; gap:5px; color: #000000; ">
            Name
            <input id="f-name" type="text" placeholder="Full name"
              style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color: #fffffe;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color: #000000; ">
            Email
            <input id="f-email" type="email" placeholder="email@gym.dz"
              style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#000000; ">
            Phone
            <input id="f-phone" type="tel" placeholder="05XXXXXXXX"
              style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color: #000000; ">
            Join Date
            <input id="f-date" type="date"
              style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color: #000000; ">
            Plan
            <select id="f-plan" style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color: #eee;">
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
            </select>
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color: #000000; ">
            Status
            <select id="f-status" style="padding:8px; background: #3c096c; border:1.5px solid #333; border-radius:7px; color: #eee;">
              <option>Active</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
          </label>
        </div>
        <p id="formError" style="display:none; color: #ff0000;  margin-top:10px;"></p>
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:18px;">
          <button onclick="saveMember()"
            style="padding:8px 20px; background: #5865f2; color: #fff;
                   border-radius:8px; cursor:pointer; font-weight:600;">Save</button>
          <button onclick="cancelB()"
            style="padding:8px 20px; background: #3a3a50; color: #ddd;
                   border-radius:8px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    </div>

    <div id="confirmModal" style="display:none; position:fixed; inset:0;
         background:rgba(69, 60, 60, 0.7); 
         align-items:center; justify-content:center;">
      <div style="background: #acc2ff; border:1px solid #5a2d2d; border-radius:14px;
                  padding:28px; max-width:360px; text-align:center;">
        <p style="font-size:1rem; margin-bottom:20px;">Are you sure you want to delete this member?</p>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button onclick="Delete()"
            style="padding:8px 20px; background: #f10018; color: #fff;
                   border:none; border-radius:8px; cursor:pointer; font-weight:600;">Yes, Delete</button>
          <button onclick="Confirm()"
            style="padding:8px 20px; background: #3a3a50; color: #ddd;
                   border:none; border-radius:8px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
 
  document.getElementById("searchInput").addEventListener("input", showTable); 
  document.getElementById("Filter").addEventListener("change", showTable); 

  showTable(); 
}

function showTable() { 
  let search = document.getElementById("searchInput").value.toLowerCase(); 
  let plan   = document.getElementById("Filter").value;

  let filtered = [];
  for (let i = 0; i < members.length; i++) {
    let m = members[i]; 
    let MSearch = m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search); 
    let mPlan   = (plan === "All") || (m.plan === plan);
                                                            
    if (MSearch && mPlan) filtered.push(m); 
  }
 
  let tbody = document.getElementById("memberBody"); 
  tbody.innerHTML = ""; 
 
  if (filtered.length === 0) { 
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">No members found.</td></tr>';
  } else {
    for (let j = 0; j < filtered.length; j++) {
      let m = filtered[j];
      tbody.innerHTML += `
        <tr style="border-bottom:1px solid #2d2d40;">
          <td style="padding:10px 14px;">${j + 1}</td>
          <td style="padding:10px 14px;">${m.name}</td>
          <td style="padding:10px 14px;">${m.email}</td>
          <td style="padding:10px 14px;">${m.phone}</td>
          <td style="padding:10px 14px;">${planadd(m.plan)}</td>
          <td style="padding:10px 14px;">${m.joinDate}</td>
          <td style="padding:10px 14px;">${statusadd(m.status)}</td>
          <td style="padding:10px 14px; display:flex; gap:6px;">
            <button onclick="openEditModal(${m.id})"
              style="padding:5px 10px; background:#1d4e89; color:#90c2ff;
                     border:none; border-radius:6px; cursor:pointer;">Edit</button>
            <button onclick="confirmDel(${m.id})"
              style="padding:5px 10px; background:#4a1020; color:#ff8080;
                     border:none; border-radius:6px; cursor:pointer;">Delete</button>
          </td>
        </tr>`;
    }
  }
 
  document.getElementById("Count").textContent =
    "Showing " + filtered.length + " of " + members.length + " members";
}
function planadd(plan) { 
  let style = "";
  if (plan === "Bronze") style = "color: #cd7f32; border:1px solid #cd7f32; background:#7c4a0033;";
  if (plan === "Silver") style = "color: #858181; border:1px solid #aaa;    background:#4a4a6033;";
  if (plan === "Gold")   style = "color: #9a8304; border:1px solid #ffd700; background:#6a520033;";
  return '<span style="padding:3px 10px; border-radius:20px; font-weight:600; ' + style + '">' + plan + '</span>'; 
}
 
function statusadd(status) {
  let style = ""; 
  if (status === "Active")  style = "color:#4ade80; border:1px solid #4ade80; background:#0f3a1f;";
  if (status === "Pending") style = "color:#fbbf24; border:1px solid #fbbf24; background:#3a2e00;";
  if (status === "Expired") style = "color:#f87171; border:1px solid #f87171; background:#3a0a0a;";
  return '<span style="padding:3px 10px; border-radius:20px;  font-weight:600; ' + style + '">' + status + '</span>';
}

function openAddModal() { 
  let editId = null; 
   document.getElementById("modalTitle").textContent = "Add Member"; 
   document.getElementById("f-name").value   = ""; 
  document.getElementById("f-email").value  = "";
  document.getElementById("f-phone").value  = "";
  document.getElementById("formError").style.display = "none"; 
  document.getElementById("Model").style.display = "flex"; 
}
 
function openEditModal(id) { 
  editId = id;
 
  let member = null; 
  for (let i = 0; i < members.length; i++) {  
    if (members[i].id === id) { member = members[i]; break; }
  }
 
  document.getElementById("modalTitle").textContent = "Edit Member"; 
  document.getElementById("f-name").value   = member.name;
  document.getElementById("f-email").value  = member.email;
  document.getElementById("f-phone").value  = member.phone;
  document.getElementById("f-date").value   = member.joinDate;
  document.getElementById("f-plan").value   = member.plan;
  document.getElementById("f-status").value = member.status;
  document.getElementById("formError").style.display = "none"; 
  document.getElementById("Model").style.display = "flex";
}
 
function cancelB() {
  document.getElementById("Model").style.display = "none"; 
  editId = null;
}

function saveMember() { 
  let name   = document.getElementById("f-name").value.trim(); 
  let email  = document.getElementById("f-email").value.trim();
  let phone  = document.getElementById("f-phone").value.trim();
  let date   = document.getElementById("f-date").value; 
  let plan   = document.getElementById("f-plan").value;
  let status = document.getElementById("f-status").value;
 
  if (!name) return showerror("Name is required!"); 
  if (!email || !email.includes("@")) return showerror("Valid email is required!"); 
  if (!phone) return showerror("Phone is required!");
  if (!date) return showerror("Join date is required!");
 
  if (editId !== null) { 
    for (let i = 0; i < members.length; i++) {
      if (members[i].id === editId) {
        members[i].name = name; 
        members[i].email = email;
        members[i].phone = phone;
        members[i].joinDate = date;
        members[i].plan = plan;
        members[i].status = status;
        break; 
      }
    }
  } else {

    let newId = members.length > 0 ? members[members.length - 1].id + 1 : 1;
    members.push({ id: newId, name: name, email: email, phone: phone, plan: plan, joinDate: date, status: status });
  }
 
  saveMembers(members); 
  cancelB();
  showTable();
}
 
function showerror(msg) {
  let el = document.getElementById("formError"); 
  el.textContent = msg; 
  el.style.display = "block"; 
}

let deleteId  = null;
function confirmDel(id) { 
  deleteId = id; 
  document.getElementById("confirmModal").style.display = "flex"; 
}
 
function Confirm() {
  document.getElementById("confirmModal").style.display = "none";
  deleteId = null;
}
 
function Delete() { 
  let newList = []; 
  for (let i = 0; i < members.length; i++) { 
    if (members[i].id !== deleteId) newList.push(members[i]);
  }
  members = newList; 
  saveMembers(members); 
  Confirm(); 
  showTable();
}
 
 
function updateStats() {

 
  let total = members.length;
 
  let active = 0; 
  for (let i = 0; i < members.length; i++) {
    if (members[i].status === "Active") active++;
  }
 
  let bronzeCount = 0;
  let silverCount = 0;
  let goldCount   = 0;
  for (let i = 0; i < members.length; i++) {
    if (members[i].plan === "Bronze") bronzeCount++;
    if (members[i].plan === "Silver") silverCount++;
    if (members[i].plan === "Gold")   goldCount++;
  }
 
  let popularPlan = "Silver";
  let popularCount = silverCount; 
  if (bronzeCount > popularCount) { popularPlan = "Bronze"; popularCount = bronzeCount; } 
  if (goldCount   > popularCount) { popularPlan = "Gold";   popularCount = goldCount;   }
 
  let elTotal    = document.getElementById("total");
  let elActive   = document.getElementById("active");
  let elClasses  = document.getElementById("classes");
  let elPopular  = document.getElementById("populer");
 
  if (elTotal)   elTotal.textContent   = total;
  if (elActive)  elActive.textContent  = active;
  if (elClasses) elClasses.textContent = "7"; 
  if (elPopular) elPopular.textContent = popularPlan + " (" + popularCount + ")";
 
  drawChart(bronzeCount, silverCount, goldCount, total); 
 
}
function drawChart(bronze, silver, gold, total) {
  let canvas = document.getElementById("planChart");
  if (!canvas) return; 
  let ctx = canvas.getContext("2d"); 
 
  let W = canvas.width;   
  let H = canvas.height;  
 
  ctx.clearRect(0, 0, W, H); 
  ctx.fillStyle = "#f0efe8";
  ctx.fillRect(0, 0, W, H);
  let bars = [
    { label: "Bronze", count: bronze, color: "#cd7f32" },
    { label: "Silver", count: silver, color: "#c0c0d0" },
    { label: "Gold",   count: gold,   color: "#ffd700" },
  ];
 
  let barWidth   = 60;  
  let gap        = 40;  
  let bottomY    = H - 40; 
  let maxHeight  = H - 80; 
  let startX     = 60;  
  let maxCount   = total > 0 ? total : 1;
 
  for (let i = 0; i < bars.length; i++) { 
    let bar = bars[i];
 
    let barHeight = (bar.count / maxCount) * maxHeight; 
    if (bar.count === 0) barHeight = 0; 
 
    let x = startX + i * (barWidth + gap); 
    let y = bottomY - barHeight;          
 
    ctx.fillStyle = bar.color; 
    ctx.beginPath(); 
    ctx.roundRect(x, y, barWidth, barHeight, 6); 
    ctx.fill(); 
 
    ctx.fillStyle = "#eee"; 
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(bar.count, x + barWidth / 2, y - 8);
 
    ctx.fillStyle = "#a0a0c0";
    ctx.font = "13px sans-serif"; 
    ctx.fillText(bar.label, x + barWidth / 2, bottomY + 20);
  }
 
  ctx.strokeStyle = "#2d2d40";
  ctx.lineWidth   = 1; 
  ctx.beginPath();
  ctx.moveTo(30, bottomY); 
  ctx.lineTo(W - 20, bottomY);
  ctx.stroke();
}

function buildStats() { 
  let main = document.querySelector("main");
  if (!main) return; 
 
  let statsSection = document.getElementById("Stsection");
  if (statsSection) return;
 
  let section = document.createElement("section");
  section.id = "Stsection";
  section.innerHTML = `
    <hr>
    <h2>📊 Live Dashboard Stats 📊</h2>
 
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:16px; margin:16px 0;">
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">👥</div>
        <div id="total" style="font-size:2rem; font-weight:700; color: #7a8af7; margin:8px 0;">0</div>
        <div style="color: #3c096c; ">Total Members</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">💳</div>
        <div id="active" style="font-size:2rem; font-weight:700; color:#4ade80; margin:8px 0;">0</div>
        <div style="color: #3c096c; ;">Active Subscriptions</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">🏋️</div>
        <div id="classes" style="font-size:2rem; font-weight:700; color:#fbbf24; margin:8px 0;">7</div>
        <div style="color: #3c096c; ">Classes This Week</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">🏆</div>
        <div id="populer" style="font-size:2rem; font-weight:700; color:#ffd700; margin:8px 0;">-</div>
        <div style="color: #3c096c; ">Most Popular Plan</div>
      </div>
 
    </div>
 
    <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; margin-top:8px;">
      <h3 style="margin:0 0 16px; color: #3c096c; font-size:1.5em; text-align:center;">📊 Members by Plan📊</h3>
      <canvas id="planChart" width="360" height="220"
        style="display:block; margin:0 auto;"></canvas>
    </div>
  `;
 
  main.insertBefore(section, main.firstChild);
 
  setTimeout(updateStats, 50);
}
 
 
document.addEventListener("DOMContentLoaded", function() {
  buildStats(); 
  build();    
});


 
 

















