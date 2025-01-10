function logout() {
    // Clear any session or local storage data
    localStorage.removeItem('authToken'); // Remove authentication token
    sessionStorage.removeItem('user'); // Remove user session data
    // Redirect to login page
    window.location.href = 'login.html';
}
