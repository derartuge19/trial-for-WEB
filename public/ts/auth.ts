// In your other TypeScript files like addtask.ts, auth.ts, etc.
const API_URL='http://localhost:7712';


// Define the types for the signup data
interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

async function signup(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<void> {
  try {
    const response: Response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, firstName, lastName }), // Send all data to the backend
    });

    const data: { message?: string } = await response.json();

    if (response.ok) {
      alert('Signup successful!');
      window.location.href = 'task.html'; // Redirect to task page after successful signup
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (error: any) {
    console.error('Signup error:', error); // Log error if request fails
    alert('An error occurred. Please try again later.');
  }
}

// Form submit handler for the signup form
const signupForm = document.getElementById('signupForm') as HTMLFormElement;

signupForm?.addEventListener('submit', function (event: Event) {
  event.preventDefault(); // Prevent form submission

  const username: string = (document.getElementById('username') as HTMLInputElement).value;
  const email: string = (document.getElementById('email') as HTMLInputElement).value;
  const password: string = (document.getElementById('password') as HTMLInputElement).value;
  const firstName: string = (document.getElementById('firstName') as HTMLInputElement).value;
  const lastName: string = (document.getElementById('lastName') as HTMLInputElement).value;

  signup(username, email, password, firstName, lastName); // Call signup function with all inputs
});
