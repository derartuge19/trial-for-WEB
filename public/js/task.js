// Logout functionality to remove token and redirect to login page
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Fetch tasks from the backend
async function fetchTasks() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to continue');
    window.location.href = 'login.html'; // Redirect to login if no token
    return;
  }

  try {
    const response = await fetch('http://localhost:7712/tasks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const tasksList = document.getElementById('tasksList');
      tasksList.innerHTML = '';

      data.tasks.forEach((task) => {
        tasksList.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
                <button class="btn btn-warning btn-sm" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm ms-2" onclick="deleteTask(${task.id})">Delete</button>
              </div>
            </div>
          </div>
        `;
      });
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

// Call fetchTasks when the page loads
fetchTasks();
