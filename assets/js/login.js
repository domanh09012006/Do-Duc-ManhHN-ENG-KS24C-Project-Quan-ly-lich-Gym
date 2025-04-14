document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const fullName = document.getElementById("fullName").value.trim();
            const newEmail = document.getElementById("newEmail").value.trim();
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            let isValid = true;
            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (fullName.length < 2) {
                document.getElementById("nameError").textContent = "Họ và tên không hợp lệ";
                isValid = false;
            } else {
                document.getElementById("nameError").textContent = "";
            }
            if (!newEmail.includes("@") || newEmail.length < 5 || !newEmail.includes(".com")) {
                document.getElementById("emailError").textContent = "Email không hợp lệ!";
                isValid = false;
            } else {
                document.getElementById("emailError").textContent = "";
            }
            if (newPassword.length < 8) {
                document.getElementById("passwordError").textContent = "Mật khẩu phải có ít nhất 8 ký tự!";
                isValid = false;
            } else {
                document.getElementById("passwordError").textContent = "";
            }
            if (newPassword !== confirmPassword) {
                document.getElementById("confirmPasswordError").textContent = "Mật khẩu xác nhận không khớp!";
                isValid = false;
            } else {
                document.getElementById("confirmPasswordError").textContent = "";
            }
            const isEmailExist = users.some(user => user.email === newEmail);
            if (isEmailExist) {
                document.getElementById("emailError").textContent = "Email này đã được đăng ký!";
                document.getElementById("emailError").style.color = "red";
                isValid = false;
            }
            if (isValid) {
                const user = {
                    fullName: fullName,
                    email: newEmail,
                    password: newPassword
                };
                users.push(user);
                localStorage.setItem("users", JSON.stringify(users));
                alert("Đăng ký thành công! Mời bạn đăng nhập.");
                window.location.href = "login.html";
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const savedUser = users.find(user => user.email === email && user.password === password);
            if (savedUser) {
                localStorage.setItem("currentUser", JSON.stringify(savedUser));
                localStorage.setItem("username", savedUser.fullName);
                if (email.includes("@gmail.com")) {
                    window.location.href = "/pages/index/homePage.html";
                } else if (email.includes("@admin.com")) {
                    window.location.href = "/pages/admin/admin-page.html";
                }
            } else {
                document.getElementById("passwordError").textContent = "Mật khẩu hoặc email không đúng!";
            }
        });
    }
});