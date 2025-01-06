const API_URL = 'http://localhost:7712/tasks'; // Replace with your NestJS backend URL

// Function to fetch tasks with authorization
async function fetchTasks() {
  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect the user to the login page
    console.error('No token found. Redirecting to login...');
    window.location.href = 'login.html';
    return;
  }

  try {
    // Make an authorized request to the tasks endpoint
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    // Handle unauthorized access
    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token'); // Clear the token
      window.location.href = 'login.html';
      return;
    }

    // Handle successful response
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched tasks:', data);
      return data; // Return the fetched data
    } else {
      // Handle other server errors
      const errorMessage = await response.text();
      console.error('Error fetching tasks:', errorMessage);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error) {
    // Handle network errors or unexpected issues
    console.error('Network error:', error);
    alert('An error occurred. Please check your connection and try again.');
  }
}

// Example usage
fetchTasks().then((tasks) => {
  if (tasks) {
    // Display tasks in the console or render them on the page
    console.log(tasks);
    // Add logic here to render tasks in your UI
  }
});
