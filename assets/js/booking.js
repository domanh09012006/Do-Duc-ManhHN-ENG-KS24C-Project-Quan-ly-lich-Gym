document.addEventListener("DOMContentLoaded", function () {
    const userInfo = document.getElementById("userInfo");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        userInfo.innerHTML = `
            <span style="margin-right: 10px">${currentUser.fullName}</span>
            <button id="logoutBtn" class="btn-logout">Đăng xuất</button>
        `;
        document.getElementById("logoutBtn").onclick = function () {
            localStorage.removeItem("currentUser");
            window.location.href = "/pages/index/homePage.html";
        };
    } else {
        alert("Vui lòng đăng nhập để truy cập.");
        window.location.href = "/pages/index/homePage.html";
    }
    const timeSlotMap = {
        6: "6h-8h",
        8: "8h-10h",
        10: "10h-12h",
        14: "14h-16h",
        16: "16h-18h",
        18: "18h-20h"
    };
    const modal = document.getElementById("modal");
    const deleteModal = document.getElementById("deleteModal");
    const btnAdd = document.getElementById("btn-add");
    const closeModal = document.getElementById("closeModal");
    const saveBtn = document.getElementById("saveBtn");
    const scheduleTable = document.getElementById("scheduleTable");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");
    const errorMessage = document.getElementById("errorMessage");
    let schedules = JSON.parse(localStorage.getItem("schedules")) || [];
    let editingIndex = null;
    let deleteIndex = null;
    const rowsPerPage = 5;
    let currentPage = 1;

    function renderPagination(totalRows) {
        let totalPages = parseInt(totalRows / rowsPerPage);
        if (totalRows % rowsPerPage !== 0) {
            totalPages += 1;
        }
        const paginationContainer = document.querySelector(".pagination");
        let html = "";
        if (currentPage > 1) {
            html += `<button class="btn-pagination prev-btn">Previous</button>`;
        }
        for (let i = 1; i <= totalPages; i++) {
            let activeClass = "";
            if (i === currentPage) {
                activeClass = "active";
            }
            html += `<button class="btn-pagination ${activeClass}" data-page="${i}">${i}</button>`;
        }
        if (currentPage < totalPages) {
            html += `<button class="btn-pagination next-btn">Next</button>`;
        }
        paginationContainer.innerHTML = html;
        const pageButtons = document.querySelectorAll(".btn-pagination[data-page]");
        for (let btn of pageButtons) {
            btn.onclick = function () {
                currentPage = parseInt(btn.dataset.page);
                renderTable();
            };
        }
        const prevBtn = document.querySelector(".btn-pagination.prev-btn");
        if (prevBtn) {
            prevBtn.onclick = function () {
                currentPage--;
                renderTable();
            };
        }
        const nextBtn = document.querySelector(".btn-pagination.next-btn");
        if (nextBtn) {
            nextBtn.onclick = function () {
                currentPage++;
                renderTable();
            };
        }
    }
    function renderTable() {
        scheduleTable.innerHTML = "";
        schedules.sort((a, b) => {
            const now = new Date();
            const dateA = new Date(`${a.date}T${a.timeSlot}:00:00`);
            const dateB = new Date(`${b.date}T${b.timeSlot}:00:00`);
            const isFutureA = dateA >= now;
            const isFutureB = dateB >= now;
            if (isFutureA && !isFutureB) {
                return -1;
            } else if (!isFutureA && isFutureB) {
                return 1;
            } else {
                if (dateA < dateB) {
                    return -1;
                } else if (dateA > dateB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        })
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageItems = schedules.slice(start, end);
        pageItems.forEach((schedule, index) => {
            const globalIndex = start + index;
            const row = scheduleTable.insertRow();
            row.innerHTML = `
                <td>${schedule.classType}</td>
                <td>${schedule.date}</td>
                <td>${timeSlotMap[schedule.timeSlot]}</td>
                <td>${schedule.fullName}</td>
                <td>${schedule.email}</td>
                <td>
                    <button onclick="editSchedule(${globalIndex})" class="fix">Sửa</button>
                    <button onclick="confirmDelete(${globalIndex})" class="delete">Xóa</button>
                </td>
            `;
        });
        renderPagination(schedules.length);
    }
    btnAdd.onclick = function () {
        editingIndex = null;
        clearForm();
        if (currentUser) {
            document.getElementById("fullName").value = currentUser.fullName;
            document.getElementById("email").value = currentUser.email;
        }
        modal.style.display = "flex";
    };
    closeModal.onclick = () => modal.style.display = "none";




    saveBtn.onclick = function () {
        const classType = document.getElementById("classType").value;
        const date = document.getElementById("date").value;
        const timeSlot = document.getElementById("timeSlot").value;
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        errorMessage.textContent = "";

        if (!classType || !date || !timeSlot || !fullName || !email) {
            errorMessage.textContent = "Vui lòng điền đầy đủ thông tin.";
            return;
        }
        const selectedDateTime = new Date(`${date}T${timeSlot}:00:00`);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        if (selectedDateTime < currentDate) {
            errorMessage.textContent = "Thời gian đặt lịch không hợp lý.";
            return;
        }
        if (selectedDateTime.toDateString() === currentDate.toDateString() && selectedDateTime <= currentDate) {
            errorMessage.textContent = "Thời gian đặt lịch không hợp lý.";
            return;
        }
        const isDuplicate = schedules.some((s, i) =>
            i !== editingIndex &&
            s.date === date &&
            s.timeSlot === timeSlot &&
            s.classType !== classType
        );
        if (isDuplicate) {
            errorMessage.textContent = "Đã có lịch của bộ môn khác vào cùng ngày và giờ.";
            return;
        }
        const newSchedule = { classType, date, timeSlot, fullName, email };
        if (editingIndex === null) {
            schedules.push(newSchedule);
        } else {
            schedules[editingIndex] = newSchedule;
        }
        localStorage.setItem("schedules", JSON.stringify(schedules));
        modal.style.display = "none";
        renderTable();
    };






    window.editSchedule = function (index) {
        const schedule = schedules[index];
        document.getElementById("classType").value = schedule.classType;
        document.getElementById("date").value = schedule.date;
        document.getElementById("timeSlot").value = schedule.timeSlot;
        document.getElementById("fullName").value = schedule.fullName;
        document.getElementById("email").value = schedule.email;
        editingIndex = index;
        errorMessage.textContent = "";
        modal.style.display = "flex";
    };
    window.confirmDelete = function (index) {
        deleteIndex = index;
        deleteModal.style.display = "flex";
    };
    cancelDelete.onclick = () => deleteModal.style.display = "none";
    confirmDelete.onclick = function () {
        schedules.splice(deleteIndex, 1);
        localStorage.setItem("schedules", JSON.stringify(schedules));
        deleteModal.style.display = "none";
        renderTable();
    };
    function clearForm() {
        document.getElementById("classType").value = "Gym";
        document.getElementById("date").value = "";
        document.getElementById("timeSlot").value = "6";
        document.getElementById("fullName").value = "";
        document.getElementById("email").value = "";
        errorMessage.textContent = "";
    }
    renderTable();
});
