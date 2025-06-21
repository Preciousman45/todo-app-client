const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Replace this with your backend URL if hosted
const API = 'https://todo-app-client-89eu.onrender.com';

document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = task.priority;
  li.innerHTML = `
    ${task.done ? `<s>${task.title}</s>` : task.title}
    <span>
      ${!task.done ? `<button class="done" onclick="markDone('${task._id}')">✓</button>` : ''}
      <button class="delete" onclick="deleteTask('${task._id}')">🗑</button>
    </span>
  `;
  taskList.appendChild(li);
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const priority = document.getElementById('priority').value;

  const res = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, priority })
  });

  const newTask = await res.json();
  addTaskToDOM(newTask);
  taskForm.reset();
});

async function markDone(id) {
  await fetch(`${API}/${id}`, {
    method: 'PATCH'
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });
  loadTasks();
}
