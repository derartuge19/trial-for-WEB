// In your other TypeScript files like addtask.ts, auth.ts, etc.
import { API_URL } from './config';


// Define a Task type (assuming a basic structure, adjust according to actual task data)
interface Task {
  id: string;
  title: string;
  description: string;
  // Add other task properties as needed
}

// Function to fetch tasks with authorization
async function fetchTasks(): Promise<Task[] | void> {
  // Retrieve the JWT token from localStorage
  const token: string | null = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect the user to the login page
    console.error('No token found. Redirecting to login...');
    window.location.href = 'login.html';
    return;
  }

  try {
    // Make an authorized request to the tasks endpoint
    const response: Response = await fetch(API_URL, {
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
      const data: Task[] = await response.json();
      console.log('Fetched tasks:', data);
      return data; // Return the fetched data
    } else {
      // Handle other server errors
      const errorMessage: string = await response.text();
      console.error('Error fetching tasks:', errorMessage);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error: any) {
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
