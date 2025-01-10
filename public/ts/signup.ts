// In your other TypeScript files like addtask.ts, auth.ts, etc.
import { API_URL } from './config';


// Define types for form values
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Function to handle signup
async function signup({
  username,
  email,
  password,
  firstName,
  lastName,
}: SignupFormData): Promise<void> {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, firstName, lastName }), // Send all data to the backend
  });

  const data = await response.json();

  if (response.ok) {
    // Store the JWT token in localStorage
    localStorage.setItem('token', data.access_token);

    // Redirect to the add task page after successful signup
    window.location.href = 'add-task.html';
  } else {
    alert(data.message || 'Signup failed');
  }
}

// Form submit handler for the signup form
document
  .getElementById('signupForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const firstName = (document.getElementById('firstName') as HTMLInputElement).value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement).value;

    const formData: SignupFormData = {
      username,
      email,
      password,
      firstName,
      lastName,
    };

    signup(formData); // Call signup function with all inputs
  });
