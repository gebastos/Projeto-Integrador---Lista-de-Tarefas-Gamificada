// ----------------------
// elementos do DOM
// ----------------------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");
const completedTasksList = document.getElementById("completedTasksList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const clearAllBtn = document.getElementById("clearAll");
const counts = document.getElementById("counts");
const nivelDisplay = document.getElementById("nivelDisplay");
const showCompletedBtn = document.getElementById("showCompleted");
const completedTasksContainer = document.getElementById("completedTasksContainer");

// ----------------------
// dados
// ----------------------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ----------------------
// inicialização
// ----------------------
renderTasks();

// ----------------------
// adicionar tarefas
// ----------------------
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

// ----------------------
// renderizar tarefas
// ----------------------
function renderTasks() {
  tasksList.innerHTML = "";
  renderCompletedTasks(); // atualiza lista de concluídas

  tasks.forEach((task, index) => {
    if (!task.completed) {
      const li = document.createElement("li");

      // container esquerdo
      const left = document.createElement("div");
      left.classList.add("left");

      const textSpan = document.createElement("span");
      textSpan.textContent = task.text;
      textSpan.classList.add("task-text");

      left.appendChild(textSpan);

      // container de botões
      const btnContainer = document.createElement("div");
      btnContainer.classList.add("actions");

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "✏️";
      btnEdit.classList.add("edit-btn");
      btnEdit.title = "editar tarefa";
      btnEdit.addEventListener("click", () => editTask(index));

      const btnComplete = document.createElement("button");
      btnComplete.textContent = "✔";
      btnComplete.classList.add("complete-btn");
      btnComplete.title = "marcar como concluída";
      btnComplete.addEventListener("click", () => toggleTask(index));

      btnContainer.appendChild(btnEdit);
      btnContainer.appendChild(btnComplete);

      li.appendChild(left);
      li.appendChild(btnContainer);

      tasksList.appendChild(li);
    }
  });

  updateCounts();
  updateLevel();
  saveTasks();
}

// ----------------------
// renderizar apenas concluídas
// ----------------------
function renderCompletedTasks() {
  completedTasksList.innerHTML = "";
  tasks
    .filter(task => task.completed)
    .forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.text;
      li.classList.add("completed");
      completedTasksList.appendChild(li);
    });
}

// ----------------------
// funções de tarefa
// ----------------------
function toggleTask(index) {
  tasks[index].completed = true;
  saveTasks();
  completedTasksContainer.classList.remove("hidden");
  showCompletedBtn.textContent = "ocultar tarefas feitas";
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edite sua tarefa:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ----------------------
// contagem e nível
// ----------------------
function updateCounts() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  counts.textContent = `${total} tarefas — ${completed} concluídas`;
}

function updateLevel() {
  const completedCount = tasks.filter(t => t.completed).length;
  let nivel = "";

  if (completedCount <= 5) nivel = `nível ${completedCount || 1} - Aprendiz 🔰`;
  else if (completedCount <= 10) nivel = `nível ${completedCount} - Mestre 🧙‍♂️`;
  else if (completedCount <= 20) nivel = `nível ${completedCount} - Especialista 🤖`;
  else nivel = `nível ${completedCount} - Sr Sabedoria 🧠`;

  nivelDisplay.textContent = nivel;
}

// ----------------------
// botões limpar
// ----------------------
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar tudo?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// ----------------------
// ver/ocultar concluídas
// ----------------------
showCompletedBtn.addEventListener("click", () => {
  completedTasksContainer.classList.toggle("hidden");
  showCompletedBtn.textContent = completedTasksContainer.classList.contains("hidden")
    ? "ver tarefas feitas"
    : "ocultar tarefas feitas";

  renderCompletedTasks();
});
