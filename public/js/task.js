const API_URL = 'http://localhost:7712/tasks';

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
        <button class="btn btn-primary me-2" onclick="editTask('${task._id}', '${task.title}', '${task.description}')">Edit</button>
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

// New function for updating tasks
async function updateTask(taskId, title, description) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  const data = await response.json();
  if (response.ok) {
    fetchTasks(); // Re-fetch tasks after updating
    document.getElementById('editTaskModal').style.display = 'none'; // Close the edit modal
  } else {
    alert(data.message || 'Failed to update task');
  }
}

// Function to open the edit modal and populate it with task data
function editTask(taskId, currentTitle, currentDescription) {
  document.getElementById('editTaskId').value = taskId;
  document.getElementById('editTaskTitle').value = currentTitle;
  document.getElementById('editTaskDescription').value = currentDescription;
  document.getElementById('editTaskModal').style.display = 'block';
}

// Event listener for the update task form
document
  .getElementById('editTaskForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault();
    const taskId = document.getElementById('editTaskId').value;
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    updateTask(taskId, title, description);
  });

// Initialize tasks when the page loads
if (document.getElementById('tasksList')) {
  fetchTasks();
}

document
  .getElementById('addTaskForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    addTask(title, description);
  });
