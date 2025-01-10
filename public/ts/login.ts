import { API_URL } from './config';

// Function to handle login
async function login(username: string, password: string): Promise<void> {
  try {
    const response: Response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Send all data to the backend
    });

    const data: { token?: string; message?: string } = await response.json();

    if (response.ok && data.token) {
      // Save the token in localStorage
      localStorage.setItem('token', data.token); // Save the received token

      // Redirect to task page after successful login
      window.location.href = 'task.html';
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login. Please try again.');
  }
}

// Form submit handler for the login form
const loginForm: HTMLFormElement | null = document.getElementById('loginForm') as HTMLFormElement;

if (loginForm) {
  loginForm.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // Prevent form submission

    const username: string = (document.getElementById('username') as HTMLInputElement).value;
    const password: string = (document.getElementById('password') as HTMLInputElement).value;

    login(username, password); // Call login function with inputs
  });
}
