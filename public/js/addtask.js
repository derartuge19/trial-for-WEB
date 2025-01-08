const API_URL = 'http://localhost:7712/tasks'; // Backend API URL

// Function to add a new task
async function addTask(title, description) {
  const token = localStorage.getItem('token'); // Retrieve token from local storage

  if (!token) {
    alert('You are not authorized. Please log in.');
    window.location.href = 'login.html'; // Redirect to login if not authorized
    return;
  }

  try {
    // Make a POST request to the backend to add the task
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token for authentication
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify({ title, description }), // Send task data in the body
    });

    if (response.ok) {
      alert('Task added successfully!');
      window.location.href = 'task.html'; // Redirect to tasks page on success
    } else if (response.status === 401) {
      // Handle session expiration (unauthorized)
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token'); // Clear token
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      const errorMessage = await response.text(); // Get error message from response
      console.error('Error adding task:', errorMessage);
      alert('Failed to add task. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error); // Log network errors
    alert('An error occurred. Please check your connection and try again.');
  }
}

// Add event listener to the add task form
document.getElementById('addTaskForm')?.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission

  const taskTitle = document.getElementById('taskTitle').value; // Get task title
  const taskDescription = document.getElementById('taskDescription').value; // Get task description

  addTask(taskTitle, taskDescription); // Call the function to add the task
});
