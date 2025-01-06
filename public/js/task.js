const API_URL = 'http://localhost:3000/tasks';

async function fetchTasks() {
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = data
      .map(
        (task) => `
      <div class="task col-12 col-md-5 me-4">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <button class="btn btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `,
      )
      .join('');
  } else {
    alert(data.message || 'Failed to fetch tasks');
  }
}

async function addTask(title, description) {
  const token = localStorage.getItem('token');
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  const data = await response.json();
  if (response.ok) {
    window.location.href = 'tasks.html'; // Redirect to task list after adding task
  } else {
    alert(data.message || 'Failed to add task');
  }
}

async function deleteTask(taskId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    fetchTasks(); // Re-fetch tasks after deleting
  } else {
    alert(data.message || 'Failed to delete task');
  }
}

document
  .getElementById('addTaskForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    addTask(title, description);
  });

if (document.getElementById('tasksList')) {
  fetchTasks();
}
