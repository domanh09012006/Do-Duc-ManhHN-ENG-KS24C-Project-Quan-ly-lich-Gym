const btnAdd = document.getElementById("btnAdd");
const modalAdd = document.getElementById("modalAdd");
const modalConfirm = document.getElementById("modalConfirm");

const saveBtn = document.getElementById("saveServiceBtn");
const cancelBtn = document.getElementById("cancelModalBtn");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

const nameInput = document.getElementById("serviceName");
const descInput = document.getElementById("serviceDesc");
const imgInput = document.getElementById("serviceImage");

const serviceTableBody = document.getElementById("serviceTableBody");

let services = JSON.parse(localStorage.getItem("services")) || [];
let deleteIndex = null;
let editIndex = null;

function renderServices() {
    serviceTableBody.innerHTML = "";
    services.forEach((s, i) => {
        serviceTableBody.innerHTML += `
            <tr class="headTr">
                <td>${s.name}</td>
                <td>${s.desc}</td>
                <td><img src="${s.image}" style="max-width: 100px;" /></td>
                <td class="btn-group">
                    <button data-index="${i}" class="btn-delete">Xóa</button>
                    <button data-index="${i}" class="btn-edit">Sửa</button>
                </td>
            </tr>
        `;
    });
}
btnAdd.onclick = () => {
    modalAdd.style.display = "flex";
    nameInput.value = "";
    descInput.value = "";
    imgInput.value = "";
    editIndex = null;
};
saveBtn.onclick = () => {
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();
    const image = imgInput.value.trim();
    if (!name || !desc || !image) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }
    if (editIndex !== null) {
        services[editIndex] = { name, desc, image };
    } else {
        services.push({ name, desc, image });
    }
    localStorage.setItem("services", JSON.stringify(services));
    renderServices();
    modalAdd.style.display = "none";
    editIndex = null;
};
cancelBtn.onclick = () => {
    modalAdd.style.display = "none";
};
serviceTableBody.onclick = (e) => {
    const index = parseInt(e.target.dataset.index);
    if (e.target.classList.contains("btn-delete")) {
        deleteIndex = index;
        modalConfirm.style.display = "flex";
    } else if (e.target.classList.contains("btn-edit")) {
        editIndex = index;
        const service = services[index];
        nameInput.value = service.name;
        descInput.value = service.desc;
        imgInput.value = service.image;
        modalAdd.style.display = "flex";
    }
};
confirmYes.onclick = () => {
    if (deleteIndex !== null) {
        services.splice(deleteIndex, 1);
        localStorage.setItem("services", JSON.stringify(services));
        renderServices();
    }
    modalConfirm.style.display = "none";
    deleteIndex = null;
};
confirmNo.onclick = () => {
    modalConfirm.style.display = "none";
};
renderServices();
