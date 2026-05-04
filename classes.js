document.addEventListener("DOMContentLoaded", function () {
 
  const classesData = [
    { name: "Boxing",trainer: ["boudra narimane", "bouarour abir"], day: ["Sunday","Monday","Friday","Saturday"], time: "08:00", duration: 2, difficulty: "Beginner"    },
    { name: "Cardio",trainer: ["boudra narimane"], day: ["Sunday","Monday"],time: "13:30", duration: 2, difficulty: "Intermediate" },
    { name: "Body Building",trainer: ["bouarour abir"], day: ["Friday","Saturday"],time: "10:00", duration: 2, difficulty: "Advanced"},
    { name: "Swimming",trainer: ["boudra narimane"],day: ["Sunday"], time: "09:00", duration: 2, difficulty: "Beginner"    },
    { name: "Yoga",trainer: ["bouarour abir"],day: ["Saturday"],time: "08:00", duration: 2, difficulty: "Intermediate" }
  ];
 
  let currentTrainer= "All";
  let currentDifficulty = "All";
  let currentDay = "All";
  let sortColumn  = "";
  let sortAsc = true;
 
  const table = document.querySelector("table");
  const controls = document.createElement("div");
  controls.className = "controls";
 
  const allTrainers = [...new Set(classesData.flatMap(c => c.trainer))];
  const trainerSelect = document.createElement("select");
  trainerSelect.innerHTML =
    "<option value='All'>All Trainers</option>" +
    allTrainers.map(t => `<option value="${t}">${t}</option>`).join("");
  trainerSelect.onchange = function () {
    currentTrainer = this.value;
    render();
  };
  controls.appendChild(trainerSelect);
 
  // ── Day buttons ───────────────────────────────────────────────────────────
  const allDays = ["All", "Sunday", "Monday", "Friday", "Saturday"];
  const dayGroup = document.createElement("div");
  dayGroup.className = "btn-group";
 
  allDays.forEach(function (day) {
    var btn = document.createElement("button");
    btn.textContent = day;
    btn.setAttribute("data-day", day);
    if (day === "All") btn.classList.add("active");
    btn.onclick = function () {
      currentDay = day;
      dayGroup.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    };
    dayGroup.appendChild(btn);
  });
  controls.appendChild(dayGroup);
 
  // ── Difficulty buttons ────────────────────────────────────────────────────
  const diffGroup = document.createElement("div");
  diffGroup.className = "btn-group";
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
 
  levels.forEach(function (level) {
    var btn = document.createElement("button");
    btn.textContent = level;
    btn.setAttribute("data-level", level);
    if (level === "All") btn.classList.add("active");
    btn.onclick = function () {
      currentDifficulty = level;
      diffGroup.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    };
    diffGroup.appendChild(btn);
  });
  controls.appendChild(diffGroup);
 
  // Insert controls before table
  document.body.insertBefore(controls, table);
 
  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    // 1. Filter
    var result = classesData.filter(function (c) {
      var trainerOk    = currentTrainer    === "All" || c.trainer.includes(currentTrainer);
      var difficultyOk = currentDifficulty === "All" || c.difficulty === currentDifficulty;
      var dayOk        = currentDay        === "All" || c.day.includes(currentDay);
      return trainerOk && difficultyOk && dayOk;
    });
 
    // 2. Sort
    if (sortColumn !== "") {
      result.sort(function (a, b) {
        if (a[sortColumn] < b[sortColumn]) return sortAsc ? -1 :  1;
        if (a[sortColumn] > b[sortColumn]) return sortAsc ?  1 : -1;
        return 0;
      });
    }
 
    // 3. Build header with dynamic sort indicators
    function indicator(col) {
      if (sortColumn !== col) return " ▲▼";
      return sortAsc ? " ▲" : " ▼";
    }
 
    var html =
      "<tr>" +
        "<th data-col='name'>Class"     + indicator("name")     + "</th>" +
        "<th>Trainer</th>"                                                 +
        "<th>Day</th>"                                                     +
        "<th data-col='time'>Time"      + indicator("time")     + "</th>" +
        "<th data-col='duration'>Duration" + indicator("duration") + "</th>" +
        "<th>Difficulty</th>"                                              +
      "</tr>";
 
    // 4. Build rows
    if (result.length === 0) {
      html += "<tr><td colspan='6' style='text-align:center;color:#888'>No classes match the selected filters.</td></tr>";
    } else {
      result.forEach(function (c) {
        html +=
          "<tr>" +
            "<td>" + c.name                 + "</td>" +
            "<td>" + c.trainer.join(", ")   + "</td>" +
            "<td>" + c.day.join(", ")       + "</td>" +
            "<td>" + c.time                 + "</td>" +
            "<td>" + c.duration + "h"       + "</td>" +
            "<td>" + c.difficulty           + "</td>" +
          "</tr>";
      });
    }
 
    table.innerHTML = html;
 
    table.querySelectorAll("th[data-col]").forEach(function (th) {
      th.style.cursor = "pointer";
      th.onclick = function () {
        var col = this.getAttribute("data-col");
        if (sortColumn === col) {
          sortAsc = !sortAsc;
        } else {
          sortColumn = col;
          sortAsc    = true;
        }
        render();
      };
    });
  }
 
  // Initial render
  render();
});
 
