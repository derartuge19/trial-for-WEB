import { API_URL } from './config';

// Define an interface for the task data
interface TaskData {
  title: string;
  description: string;
}

// Function to add a new task
async function addTask(title: string, description: string): Promise<void> {
  const token: string | null = localStorage.getItem('token'); // Retrieve token from local storage

  if (!token) {
    alert('You are not authorized. Please log in.');
    window.location.href = 'login.html'; // Redirect to login if not authorized
    return;
  }

  try {
    // Make a POST request to the backend to add the task
    const response: Response = await fetch(API_URL, {
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
      const errorMessage: string = await response.text(); // Get error message from response
      console.error('Error adding task:', errorMessage);
      alert('Failed to add task. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error); // Log network errors
    alert('An error occurred. Please check your connection and try again.');
  }
}

// Add event listener to the add task form
const addTaskForm: HTMLFormElement | null = document.getElementById('addTaskForm') as HTMLFormElement;
if (addTaskForm) {
  addTaskForm.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // Prevent default form submission

    const taskTitle: string = (document.getElementById('taskTitle') as HTMLInputElement).value; // Get task title
    const taskDescription: string = (document.getElementById('taskDescription') as HTMLInputElement).value; // Get task description

    addTask(taskTitle, taskDescription); // Call the function to add the task
  });
}
