var container = document.getElementById('container');
var registerBtn = document.getElementById('register');
var loginBtn = document.getElementById('login');
registerBtn.addEventListener('click', function () {
    container.classList.add("active");
});
loginBtn.addEventListener('click', function () {
    container.classList.remove("active");
});
