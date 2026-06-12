export function showNotice(text) {
    const el = document.getElementById("notice");
    el.textContent = text;
    setTimeout(() => { el.textContent = ""; }, 4000);
}
export function renderListStatus(status, error) {
    const el = document.getElementById("listStatus");
    if (status === "loading") {
        el.textContent = "Завантаження...";
    }
    else if (status === "empty") {
        el.textContent = "Поки що немає записів.";
    }
    else if (status === "error") {
        el.textContent = "";
        const span = document.createElement("span");
        span.textContent = `Помилка (${error?.status ?? ""}): ${error?.message ?? "невідома"}`;
        el.appendChild(span);
    }
    else {
        el.textContent = "";
    }
}
export function renderList(items, onEdit, onDelete, onComments) {
    const tbody = document.getElementById("tasksTableBody");
    tbody.textContent = "";
    if (items.length === 0)
        return;
    items.forEach((r, index) => {
        const tr = document.createElement("tr");
        function td(value) {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            return cell;
        }
        tr.appendChild(td(String(index + 1)));
        tr.appendChild(td(r.title ?? "(без назви)"));
        tr.appendChild(td(String(r.userId)));
        tr.appendChild(td(String(r.severity)));
        tr.appendChild(td(r.status ?? "–"));
        tr.appendChild(td(new Date(r.createdAt).toLocaleString("uk-UA")));
        const actionsTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
            const item = items.find((x) => x.id === r.id);
            if (item)
                onEdit(item);
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            if (confirm("Видалити цей запис?"))
                onDelete(r.id);
        };
        const commentsBtn = document.createElement("button");
        commentsBtn.className = "edit-btn";
        commentsBtn.textContent = "Comments";
        commentsBtn.onclick = () => onComments(r.id, r.title);
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        actionsTd.appendChild(commentsBtn);
        tr.appendChild(actionsTd);
        tbody.appendChild(tr);
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
