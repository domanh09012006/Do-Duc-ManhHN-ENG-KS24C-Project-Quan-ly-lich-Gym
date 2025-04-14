document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("userList");
    const confirmModal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const filterEmail = document.getElementById("filterEmail");
    const filterDate = document.getElementById("filterDate");
    const classSelect = document.getElementById("classFilter");

    const gymCount = document.getElementById("gymCount");
    const yogaCount = document.getElementById("yogaCount");
    const zumbaCount = document.getElementById("zumbaCount");

    const editModal = document.getElementById("editModal");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const errorText = document.getElementById("editError");
    let deleteIndex = null;
    function getData() {
        return JSON.parse(localStorage.getItem("schedules")) || [];
    }
    function saveData(data) {
        localStorage.setItem("schedules", JSON.stringify(data));
    }
    function formatTimeSlot(hour) {
        const parsed = parseInt(hour);
        return isNaN(parsed) ? hour : `${parsed}h-${parsed + 2}h`;
    }
    function renderStats(data) {
        gymCount.textContent = data.filter(d => d.classType?.toLowerCase() === "gym").length;
        yogaCount.textContent = data.filter(d => d.classType?.toLowerCase() === "yoga").length;
        zumbaCount.textContent = data.filter(d => d.classType?.toLowerCase() === "zumba").length;
    }
    function renderTable(data) {
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Không có dữ liệu lịch tập.</td></tr>`;
            return;
        }
        let rows = "";
        data.forEach((item, index) => {
            rows += `
                <tr>
                    <td>${item.classType || ""}</td>
                    <td>${item.date || ""}</td>
                    <td>${formatTimeSlot(item.timeSlot) || ""}</td>
                    <td>${item.fullName || ""}</td>
                    <td>${item.email || ""}</td>
                    <td>
                        <button class="edit-btn" data-id="${index}">Sửa</button>
                        <button class="delete-btn" data-id="${index}">Xóa</button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = rows;
    }
    function applyFilters() {
        const emailFilter = filterEmail.value.trim().toLowerCase();
        const dateFilter = filterDate.value;
        const selectedClass = classSelect.value;
        let data = getData();
        if (selectedClass !== "all") {
            data = data.filter(item => {
                let className = item.classType?.toLowerCase() || "";
                return className === selectedClass;
            });
        }
        if (emailFilter) {
            data = data.filter(item => {
                const email = item.email || "";
                return email.toLowerCase().includes(emailFilter);
            });
        }
        if (dateFilter) {
            data = data.filter(item => item.date === dateFilter);
        }
        renderTable(data);
        renderStats(data);
    }
    function openModal(modal) {
        modal.style.display = "flex";
    }
    function closeModal(modal) {
        modal.style.display = "none";
    }
    function deleteEntry(index) {
        const data = getData();
        if (index !== null) {
            data.splice(index, 1);
            saveData(data);
            applyFilters();
        }
    }
    tbody.onclick = function (e) {
        const target = e.target;
        if (target.classList.contains("delete-btn")) {
            deleteIndex = target.getAttribute("data-id");
            openModal(confirmModal);
        }
        if (target.classList.contains("edit-btn")) {
            const index = target.getAttribute("data-id");
            const data = getData();
            const item = data[index];
            document.getElementById("editClass").value = item.classType || "";
            document.getElementById("editDate").value = item.date || "";
            document.getElementById("editTime").value = item.timeSlot || "";
            document.getElementById("editName").value = item.fullName || "";
            document.getElementById("editEmail").value = item.email || "";
            saveEditBtn.setAttribute("data-index", index);
            errorText.style.display = "none";
            openModal(editModal);
        }
    };

    confirmBtn.onclick = function () {
        deleteEntry(deleteIndex);
        closeModal(confirmModal);
    };

    cancelBtn.onclick = function () {
        closeModal(confirmModal);
    };

    cancelEditBtn.onclick = function () {
        closeModal(editModal);
    };

    saveEditBtn.onclick = function () {
        const index = saveEditBtn.getAttribute("data-index");
        const data = getData();

        const updatedClass = document.getElementById("editClass").value;
        const updatedDate = document.getElementById("editDate").value;
        const updatedTime = document.getElementById("editTime").value;

        if (!updatedClass || !updatedDate || !updatedTime) {
            errorText.textContent = "Vui lòng điền đầy đủ thông tin.";
            errorText.style.display = "block";
            return;
        }
        const today = new Date();
        const [fromHour] = updatedTime.split("h");
        const selectedDate = new Date(updatedDate);
        selectedDate.setHours(parseInt(fromHour), 0, 0, 0);

        if (selectedDate < today) {
            errorText.textContent = "Không thể chọn thời gian trong quá khứ.";
            errorText.style.display = "block";
            return;
        }
        data[index].classType = updatedClass;
        data[index].date = updatedDate;
        data[index].timeSlot = updatedTime;

        saveData(data);
        applyFilters();
        closeModal(editModal);
    };
    classSelect.onchange = applyFilters;
    filterEmail.oninput = applyFilters;
    filterDate.onchange = applyFilters;
    applyFilters();
});
