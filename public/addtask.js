const API_URL = 'http://localhost:7712/tasks'; // Replace with your backend endpoint

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
      body: JSON.stringify({ title, description }), // Send task data to the server
    });

    if (response.ok) {
      alert('Task added successfully!');
      window.location.href = 'tasks.html'; // Redirect to the tasks list page
    } else if (response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token'); // Clear the token
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

// Add event listener to the add task form
document.getElementById('addTaskForm')?.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskTitle = document.getElementById('taskTitle').value;
  const taskDescription = document.getElementById('taskDescription').value;

  addTask(taskTitle, taskDescription); // Call the addTask function
});
