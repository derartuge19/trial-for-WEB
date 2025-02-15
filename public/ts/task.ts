// In your other TypeScript files like addtask.ts, auth.ts, etc.
import { API_URL } from './config';


// Define the Task type
interface Task {
  _id: string;
  title: string;
  description: string;
}

// Function to add a new task
async function addTask(title: string, description: string): Promise<void> {
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
      const newTask: Task = await response.json();
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
function addTaskToDOM(task: Task): void {
  const tasksList = document.getElementById('tasksList') as HTMLElement;

  const taskHTML = `
    <div class="col-md-4 mb-4" id="task-${task._id}">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <button class="btn btn-warning btn-sm" id="editButton-${task._id}">Edit</button>
          <button class="btn btn-danger btn-sm ms-2" onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      </div>
    </div>
  `;

  tasksList.innerHTML += taskHTML;

  // Attach the edit functionality to the newly added "Edit" button
  document
    .getElementById(`editButton-${task._id}`)
    ?.addEventListener('click', function () {
      editTask(task._id, task.title, task.description);
    });
}

// Fetch tasks from the backend
async function fetchTasks(): Promise<void> {
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
      const data: Task[] = await response.json();
      console.log('Fetched Data:', data);

      const tasksList = document.getElementById('tasksList') as HTMLElement;
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
function editTask(id: string, title: string, description: string): void {
  // Store the task ID in localStorage for editing
  localStorage.setItem('editTaskId', id);
  window.location.href = 'add-task.html'; // Redirect to the add-task page
}

// Delete a task
async function deleteTask(id: string): Promise<void> {
  const token = localStorage.getItem('token');

  if (!token) {
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
      document.getElementById(`task-${id}`)?.remove(); // Remove task from DOM
      // alert('Task deleted successfully!');
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

  const taskTitle = (document.getElementById('taskTitle') as HTMLInputElement).value;
  const taskDescription = (document.getElementById('taskDescription') as HTMLInputElement).value;

  addTask(taskTitle, taskDescription); // Add task and render it
});

// Call fetchTasks when the page loads
fetchTasks();
