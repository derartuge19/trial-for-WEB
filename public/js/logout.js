function logout() {
  // Clear any session or local storage data, for example:
  localStorage.removeItem('authToken'); // Remove authentication token
  sessionStorage.removeItem('user'); // Remove user session data

  window.location.href = 'login.html';
}
