const API_URL = 'http://localhost:3000/auth'; // Ensure this matches your backend API endpoint

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
    alert('Signup successful!');
    window.location.href = 'login.html'; // Redirect to login page after successful signup
  } else {
    alert(data.message || 'Signup failed');
  }
}

// Form submit handler for the signup form
document
  .getElementById('signupForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    signup(username, email, password, firstName, lastName); // Call signup function with all inputs
  });
