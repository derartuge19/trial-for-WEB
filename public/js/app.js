// Example of using JWT token for Authorization in app.js
const token = localStorage.getItem('token');

// Fetch user data or tasks with authorization header
fetch('http://localhost:3000/tasks', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
