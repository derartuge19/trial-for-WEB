const API_URL = 'http://localhost:7712/auth';

async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }), // Send all data to the backend
  });

  const data = await response.json();

  if (response.ok) {
    // Save the token in localStorage
    localStorage.setItem('token', data.token); // Save the received token

    // alert('Login successful!');
    window.location.href = 'task.html'; // Redirect to task page after successful login
  } else {
    alert(data.message || 'Login failed');
  }
}

// Form submit handler for the login form
document
  .getElementById('loginForm')
  ?.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    login(username, password); // Call login function with all inputs
  });
