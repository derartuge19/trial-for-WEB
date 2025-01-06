const API_URL = 'http://localhost:7712/auth'; // Ensure this matches your backend API endpoint

// Function to handle signup
async function signup(username, email, password, firstName, lastName) {
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

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    signup(username, email, password, firstName, lastName); // Call signup function with all inputs
  });
