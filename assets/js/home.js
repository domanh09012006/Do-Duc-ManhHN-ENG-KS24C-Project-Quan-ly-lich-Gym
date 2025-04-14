document.addEventListener("DOMContentLoaded", function () {
    const username = localStorage.getItem("username");
    const loginItem = document.querySelector(".login-item");
    const userInfo = document.querySelector(".user-info");
    const usernameDisplay = document.getElementById("username-display");
    const logoutItem = document.querySelector(".logout-item");
    const logoutBtn = document.getElementById("logoutBtn");
    if (username) {
        if (loginItem) loginItem.style.display = "none";
        if (userInfo) {
            userInfo.style.display = "inline-block";
            usernameDisplay.textContent = `Xin chào, ${username}`;
        }
        if (logoutItem) logoutItem.style.display = "inline-block";
        logoutBtn.onclick = function () {
            localStorage.removeItem("username");
            location.reload();
        };
    }
});