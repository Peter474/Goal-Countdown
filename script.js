// ========== Elements ==========
const goalNameInput = document.getElementById("goalName");
const startDateInput = document.getElementById("startDate");
const targetDaysInput = document.getElementById("targetDays");
const finishMessageInput = document.getElementById("finishMessage");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalsList = document.getElementById("goalsList");

// ========== Load goals from LocalStorage ==========
let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

// ========== Render ==========
function renderGoals() {
  goalsList.innerHTML = "";

  if (goals.length === 0) {
    goalsList.innerHTML = "<p style='text-align:center;'>No goals yet. Add one!</p>";
    return;
  }

  goals.forEach((goal, index) => {
    const startDate = new Date(goal.startDate);
    const today = new Date();
    const diffMs = today - startDate;
    const daysPassed = diffMs / (1000 * 60 * 60 * 24);
    const daysRemaining = goal.targetDays - daysPassed;

    // progress percentage
    const progress = Math.min((daysPassed / goal.targetDays) * 100, 100);

    const goalCard = document.createElement("div");
    goalCard.classList.add("goal-card");

    // Live counter calculation
    const counterText = daysRemaining > 0
      ? `⏳ ${Math.floor(daysRemaining)} days remaining`
      : `🎉 ${goal.message}`;

    goalCard.innerHTML = `
      <h3>${goal.name}</h3>
      <p><strong>Start:</strong> ${goal.startDate}</p>
      <p><strong>Target:</strong> ${goal.targetDays} days</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%;"></div>
      </div>
      <p class="counter">${counterText}</p>
      <button class="reset-btn" onclick="resetGoal(${index})">Reset</button>
      <button class="reset-btn" style="background:#c0392b" onclick="deleteGoal(${index})">Delete</button>
    `;

    goalsList.appendChild(goalCard);
  });
}

// ========== Add new goal ==========
addGoalBtn.addEventListener("click", () => {
  const name = goalNameInput.value.trim();
  const startDate = startDateInput.value;
  const targetDays = parseInt(targetDaysInput.value);
  const message = finishMessageInput.value.trim();

  if (!name || !startDate || !targetDays || !message) {
    alert("Please fill in all fields!");
    return;
  }

  goals.push({ name, startDate, targetDays, message });
  saveGoals();
  renderGoals();

  goalNameInput.value = "";
  startDateInput.value = "";
  targetDaysInput.value = "";
  finishMessageInput.value = "";
});

// ========== Reset goal ==========
function resetGoal(index) {
  goals[index].startDate = new Date().toISOString().slice(0, 16);
  saveGoals();
  renderGoals();
}

// ========== Delete goal ==========
function deleteGoal(index) {
  if (confirm(`Delete "${goals[index].name}"?`)) {
    goals.splice(index, 1);
    saveGoals();
    renderGoals();
  }
}

// ========== Live Update (every second) ==========
setInterval(renderGoals, 1000);
renderGoals();                                          
