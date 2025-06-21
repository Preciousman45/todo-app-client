// const taskForm = document.getElementById('task-form');
// const taskList = document.getElementById('task-list');

// // Replace this with your backend URL if hosted
// const API = 'https://render-deployment-7cpl.onrender.com/tasks';

// document.addEventListener('DOMContentLoaded', loadTasks);

// async function loadTasks() {
//   const res = await fetch(API);
//   const tasks = await res.json();
//   taskList.innerHTML = '';
//   tasks.forEach(addTaskToDOM);
// }

// function addTaskToDOM(task) {
//   const li = document.createElement('li');
//   li.className = task.priority;
//   li.innerHTML = `
//     ${task.done ? `<s>${task.title}</s>` : task.title}
//     <span>
//       ${!task.done ? `<button class="done" onclick="markDone('${task._id}')">✓</button>` : ''}
//       <button class="delete" onclick="deleteTask('${task._id}')">🗑</button>
//     </span>
//   `;
//   taskList.appendChild(li);
// }

// taskForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const title = document.getElementById('title').value;
//   const priority = document.getElementById('priority').value;

//   const res = await fetch(API, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({ title, priority })
//   });

//   const newTask = await res.json();
//   addTaskToDOM(newTask);
//   taskForm.reset();
// });

// async function markDone(id) {
//   await fetch(`${API}/${id}`, {
//     method: 'PATCH'
//   });
//   loadTasks();
// }

// async function deleteTask(id) {
//   await fetch(`${API}/${id}`, {
//     method: 'DELETE'
//   });
//   loadTasks();
// }






// =============================
// script.js
// =============================
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const alarmSound = new Audio('/alarm.mp3');
const API = 'https://render-deployment-7cpl.onrender.com/tasks';

let scheduledTasks = [];

async function loadTasks() {
  const res = await fetch(API);
  const tasks = await res.json();
  taskList.innerHTML = '';
  scheduledTasks = tasks;
  tasks.forEach(addTaskToDOM);
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  setInterval(checkAlarms, 1000);
});

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = task.priority;
  const timeString = task.scheduledTime ? `<br><small>🕒 ${new Date(task.scheduledTime).toLocaleString()}</small>` : '';
  li.innerHTML = `
    ${task.done ? `<s>${task.title}</s>` : task.title}${timeString}
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
  const scheduledTime = document.getElementById('scheduledTime').value;
  const priority = document.getElementById('priority').value;

  const res = await fetch(API, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, priority, scheduledTime })
  });

  const newTask = await res.json();
  addTaskToDOM(newTask);
  scheduledTasks.push(newTask);
  taskForm.reset();
});

async function markDone(id) {
  await fetch(`${API}/${id}`, { method: 'PATCH' });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadTasks();
}

function checkAlarms() {
  const now = new Date();
  scheduledTasks.forEach(task => {
    if (!task.done && task.scheduledTime) {
      const taskTime = new Date(task.scheduledTime);
      if (Math.abs(now - taskTime) < 1000) {
        alarmSound.play();
        alert(`⏰ Time for: ${task.title}`);
      }
    }
  });
}


// =============================
// models/Task.js
// =============================
// const mongoose = require('mongoose');

// const TaskSchema = new mongoose.Schema({
//   title: String,
//   priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
//   done: { type: Boolean, default: false },
//   scheduledTime: Date
// });

// module.exports = mongoose.model('Task', TaskSchema);

