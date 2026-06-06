export function showNotice(text) {
    const el = document.getElementById("notice");
    el.innerHTML = text;
    setTimeout(() => { el.innerHTML = ""; }, 4000);
}
export function renderListStatus(status, error) {
    const el = document.getElementById("listStatus");
    if (status === "loading") {
        el.innerHTML = "Завантаження...";
    }
    else if (status === "empty") {
        el.innerHTML = "Поки що немає записів.";
    }
    else if (status === "error") {
        el.innerHTML = `Помилка (${error?.status ?? ""}): ${error?.message ?? "невідома"}`;
    }
    else {
        el.innerHTML = "";
    }
}
export function renderList(items, onEdit, onDelete) {
    const tbody = document.getElementById("tasksTableBody");
    if (items.length === 0) {
        tbody.innerHTML = "";
        return;
    }
    tbody.innerHTML = items
        .map((r, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${r.title ?? "(без назви)"}</td>
      <td>${r.userId}</td>
      <td>${r.severity}</td>
      <td>${r.status ?? "–"}</td>
      <td>${new Date(r.createdAt).toLocaleString("uk-UA")}</td>
      <td>
        <button class="edit-btn" data-id="${r.id}">Edit</button>
        <button class="delete-btn" data-id="${r.id}">Delete</button>
      </td>
    </tr>
  `)
        .join("");
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.onclick = () => {
            const id = Number(btn.dataset.id);
            const item = items.find((r) => r.id === id);
            if (item)
                onEdit(item);
        };
    });
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.onclick = () => {
            const id = Number(btn.dataset.id);
            if (confirm("Видалити цей запис?")) {
                onDelete(id);
            }
        };
    });
}
export function fillForm(item) {
    document.getElementById("editId").value = String(item.id);
    document.getElementById("titleInput").value = item.title;
    document.getElementById("userIdInput").value = String(item.userId);
    document.getElementById("severityInput").value = String(item.severity);
    document.getElementById("statusSelect").value = item.status;
    document.getElementById("formTitle").textContent = "Edit Report";
    document.getElementById("submitBtn").textContent = "Update";
}
export function resetForm() {
    document.getElementById("createForm").reset();
    document.getElementById("editId").value = "";
    document.getElementById("formTitle").textContent = "Create Report";
    document.getElementById("submitBtn").textContent = "Save";
    clearErrors();
}
export function setSubmitEnabled(enabled) {
    document.getElementById("submitBtn").disabled = !enabled;
}
export function showFieldError(fieldId, errorId, message) {
    document.getElementById(fieldId)?.classList.add("invalid");
    const errEl = document.getElementById(errorId);
    if (errEl)
        errEl.textContent = message;
}
export function clearErrors() {
    document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
}
