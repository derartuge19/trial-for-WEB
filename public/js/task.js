const API_URL = 'http://localhost:7712/tasks'; // Backend endpoint

// Function to add a new task
async function addTask(title, description) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You are not authorized. Please log in.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      const newTask = await response.json(); // Parse the newly added task from the response
      addTaskToDOM(newTask); // Add the task dynamically to the DOM
      alert('Task added successfully!');
    } else if (response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    } else {
      const errorMessage = await response.text();
      console.error('Error adding task:', errorMessage);
      alert('Failed to add task. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('An error occurred. Please check your connection and try again.');
  }
}

// Function to dynamically render a task in the DOM
function addTaskToDOM(task) {
  const tasksList = document.getElementById('tasksList');

  const taskHTML = `
    <div class="col-md-4 mb-4" id="task-${task._id}">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <button class="btn btn-warning btn-sm" onclick="editTask('${task._id}', '${task.title}', '${task.description}')">Edit</button>
          <button class="btn btn-danger btn-sm ms-2" onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      </div>
    </div>
  `;

  tasksList.innerHTML += taskHTML;
}

// Fetch tasks from the backend
async function fetchTasks() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to continue');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Fetched Data:', data); // Log the fetched data

      const tasksList = document.getElementById('tasksList');
      tasksList.innerHTML = ''; // Clear existing tasks

      if (Array.isArray(data)) {
        // If data is an array, iterate over it
        data.forEach((task) => {
          addTaskToDOM(task); // Render tasks if valid
        });
      } else {
        console.error('Expected an array of tasks, but received:', data);
        alert('Failed to load tasks. Please try again.');
      }
    } else if (response.status === 401) {
      alert('Session expired. Please login again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    } else {
      alert('Failed to load tasks');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('An error occurred while fetching tasks.');
  }
}

// Edit a task
function editTask(id, title, description) {
  // Pre-fill the form with the current task details
  document.getElementById('taskTitle').value = title;
  document.getElementById('taskDescription').value = description;
  const taskForm = document.getElementById('addTaskForm');
  taskForm.onsubmit = function (event) {
    event.preventDefault();

    const updatedTitle = document.getElementById('taskTitle').value;
    const updatedDescription = document.getElementById('taskDescription').value;

    updateTask(id, updatedTitle, updatedDescription); // Update the task
  };
}

// Function to update a task
async function updateTask(id, title, description) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You are not authorized. Please log in.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      document
        .getElementById(`task-${id}`)
        .querySelector('.card-title').textContent = updatedTask.title;
      document
        .getElementById(`task-${id}`)
        .querySelector('.card-text').textContent = updatedTask.description;
      alert('Task updated successfully!');
    } else {
      alert('Failed to update task. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('An error occurred while updating the task.');
  }
}

// Delete a task
async function deleteTask(id) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You are not authorized. Please log in.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      document.getElementById(`task-${id}`).remove(); // Remove task from DOM
      alert('Task deleted successfully!');
    } else {
      alert('Failed to delete task. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('An error occurred while deleting the task.');
  }
}

// Add event listener to the add task form
document.getElementById('addTaskForm')?.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskTitle = document.getElementById('taskTitle').value;
  const taskDescription = document.getElementById('taskDescription').value;

  addTask(taskTitle, taskDescription); // Add task and render it
});

// Call fetchTasks when the page loads
fetchTasks();
