const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hours = ["7–9 AM", "9–11 AM", "11–1 PM", "1–3 PM", "3–5 PM", "5–7 PM", "7–9 PM", "9–11 PM"];
const form = document.getElementById("scheduleForm");

const leftDays = ["Monday", "Tuesday", "Wednesday"];
const rightDays = ["Thursday", "Friday", "Saturday", "Sunday"];

// Build form
days.forEach(day => {
  hours.forEach(slot => {
    const box = document.createElement("div");
    box.className = "schedule-box";
    const inputId = `${day}_${slot}`;
    box.innerHTML = `<label><strong>${day} ${slot}</strong></label>
                     <input type="text" name="${inputId}" placeholder="e.g. Study / Gaming / Chill" />`;
    form.appendChild(box);
    const input = box.querySelector("input");
    input.addEventListener("input", () => {
      box.classList.toggle("filled", input.value.trim() !== "");
    });
  });
});

let latestOptimized = { left: "", right: "" };

// Optimize logic
document.getElementById("optimizeBtn").addEventListener("click", () => {
  const formData = new FormData(form);
  const good = ["study", "read", "math", "project", "revision"];
  const bad = ["scroll", "game", "idle", "nothing"];
  const neutral = ["sleep", "chill", "eat", "rest"];

  let leftOutput = "", rightOutput = "";

  days.forEach(day => {
    let section = `📅 ${day}\n`;
    hours.forEach(slot => {
      const key = `${day}_${slot}`;
      const val = (formData.get(key) || "").toLowerCase().trim();
      if (!val) section += `🔍 ${slot}: [Unfilled] ❓\n`;
      else if (good.some(g => val.includes(g))) section += `✅ ${slot}: ${val}\n`;
      else if (bad.some(b => val.includes(b))) section += `⛔ ${slot}: ${val}\n`;
      else if (neutral.some(n => val.includes(n))) section += `🌙 ${slot}: ${val}\n`;
      else section += `🌀 ${slot}: ${val}\n`;
    });
    section += "\n";
    if (leftDays.includes(day)) leftOutput += section;
    else rightOutput += section;
  });

  latestOptimized = { left: leftOutput, right: rightOutput };

  document.getElementById("optimizedOutput").innerHTML = `
    <div class="split-output">
      <pre>${leftOutput}</pre>
      <pre>${rightOutput}</pre>
    </div>`;
  document.getElementById("resultSection").classList.remove("hidden");
});

// JPG Export
document.getElementById("downloadJpgBtn").addEventListener("click", () => {
  if (!latestOptimized.left.trim() && !latestOptimized.right.trim()) return;
  const canvas = document.getElementById("jpgCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1400;
  canvas.height = 1800;
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "20px Arial";
  ctx.fillStyle = "#00ffff";
  ctx.fillText("📄 ScheduleByte - Optimized Timetable", 40, 50);
  ctx.font = "17px Arial";
  ctx.fillStyle = "#ffffff";

  let yLeft = 90;
  latestOptimized.left.split("\n").forEach(line => {
    ctx.fillText(line, 40, yLeft);
    yLeft += 28;
  });

  let yRight = 90;
  latestOptimized.right.split("\n").forEach(line => {
    ctx.fillText(line, 740, yRight);
    yRight += 28;
  });

  const link = document.createElement("a");
  link.download = "ScheduleByte_Optimized.jpg";
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
});

// Goal Suggestions
document.getElementById("goalSuggestionBtn").addEventListener("click", () => {
  const formData = new FormData(form);
  let empty = 0, study = 0, game = 0, sleep = 0;

  for (let [_, v] of formData.entries()) {
    v = v.toLowerCase();
    if (!v.trim()) empty++;
    if (v.includes("study")) study++;
    if (v.includes("game") || v.includes("scroll")) game++;
    if (v.includes("sleep")) sleep++;
  }

  const total = days.length * hours.length;
  let advice = "🎯 Goal Suggestions:\n\n";
  if (study / total < 0.3) advice += "📘 Increase study blocks.\n";
  else advice += "✅ Study time looks good.\n";
  if (game / total > 0.25) advice += "🎮 Reduce gaming time.\n";
  if (sleep / total < 0.15) advice += "😴 Add more sleep hours.\n";
  if (empty > 0) advice += "🧐 Fill empty slots wisely!\n";

  alert(advice);
});

// Productivity Score
document.getElementById("productivityBtn").addEventListener("click", () => {
  const formData = new FormData(form);
  let good = 0, bad = 0, neutral = 0, empty = 0;

  for (let [_, v] of formData.entries()) {
    v = v.toLowerCase();
    if (!v.trim()) empty++;
    else if (["study", "read", "math", "project", "revision"].some(k => v.includes(k))) good++;
    else if (["scroll", "game", "idle", "nothing"].some(k => v.includes(k))) bad++;
    else if (["sleep", "chill", "eat", "rest"].some(k => v.includes(k))) neutral++;
  }

  const total = days.length * hours.length;
  const score = Math.round((good / total) * 100);
  let msg = `📊 Productivity Score:\n\n`;
  msg += `✅ Productive: ${(good / total * 100).toFixed(1)}%\n`;
  msg += `🌙 Neutral: ${(neutral / total * 100).toFixed(1)}%\n`;
  msg += `⛔ Unproductive: ${(bad / total * 100).toFixed(1)}%\n`;
  msg += `🔍 Empty: ${(empty / total * 100).toFixed(1)}%\n\n`;

  msg += score >= 70 ? "💪 You're using your time well!" :
         score >= 40 ? "⚠️ Try reducing distractions." :
         "❗ Build a more focused routine.";

  alert(msg);
});

// Loader Transition
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").remove();
    document.getElementById("mainContent").classList.remove("hidden");
  }, 4000);
});

// Dark/Light Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  document.getElementById("themeToggle").textContent =
    document.body.classList.contains("light") ? "🌞" : "🌙";
});
