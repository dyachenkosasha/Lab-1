import { getRequests, createRequest, updateRequest, deleteRequest, } from "./apiClient.js";
import { showNotice, renderListStatus, renderList, fillForm, resetForm, setSubmitEnabled, showFieldError, clearErrors, } from "./ui.js";
const API_BASE = "http://localhost:3000/api/v1";
// ==================== USERS ====================
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();
        renderUsers(data.data);
    }
    catch (e) {
        console.error("Failed to load users", e);
    }
}
function renderUsers(users) {
    const tbody = document.getElementById("usersTableBody");
    tbody.textContent = "";
    users.forEach((u, i) => {
        const tr = document.createElement("tr");
        const tdNum = document.createElement("td");
        tdNum.textContent = String(i + 1);
        const tdName = document.createElement("td");
        tdName.textContent = u.name;
        const tdEmail = document.createElement("td");
        tdEmail.textContent = u.email;
        const tdActions = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => fillUserForm(u);
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = async () => {
            if (!confirm(`Видалити користувача «${u.name}»?`))
                return;
            try {
                await fetch(`${API_BASE}/users/${u.id}`, {
                    method: "DELETE",
                    headers: { "X-Demo-UserId": "1" },
                });
                showNotice("Користувача видалено");
                await loadUsers();
            }
            catch (e) {
                showNotice("Помилка при видаленні користувача");
            }
        };
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdNum);
        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
    });
}
function fillUserForm(user) {
    document.getElementById("editUserId").value = String(user.id);
    document.getElementById("userNameInput").value = user.name;
    document.getElementById("userEmailInput").value = user.email;
    document.getElementById("userFormTitle").textContent = "Edit User";
    document.getElementById("saveUserBtn").textContent = "Update";
    document.getElementById("cancelUserBtn").style.display = "inline-block";
}
function resetUserForm() {
    document.getElementById("editUserId").value = "";
    document.getElementById("userNameInput").value = "";
    document.getElementById("userEmailInput").value = "";
    document.getElementById("userFormTitle").textContent = "Add User";
    document.getElementById("saveUserBtn").textContent = "Add";
    document.getElementById("cancelUserBtn").style.display = "none";
    const nameErr = document.getElementById("userNameError");
    const emailErr = document.getElementById("userEmailError");
    if (nameErr)
        nameErr.textContent = "";
    if (emailErr)
        emailErr.textContent = "";
    document.getElementById("userNameInput")?.classList.remove("invalid");
    document.getElementById("userEmailInput")?.classList.remove("invalid");
}
function validateUserForm(name, email, isEdit) {
    let valid = true;
    const nameErr = document.getElementById("userNameError");
    const emailErr = document.getElementById("userEmailError");
    nameErr.textContent = "";
    emailErr.textContent = "";
    document.getElementById("userNameInput")?.classList.remove("invalid");
    document.getElementById("userEmailInput")?.classList.remove("invalid");
    if (!name.trim()) {
        nameErr.textContent = "Name is required";
        document.getElementById("userNameInput")?.classList.add("invalid");
        valid = false;
    }
    if (!isEdit && !email.trim()) {
        emailErr.textContent = "Email is required";
        document.getElementById("userEmailInput")?.classList.add("invalid");
        valid = false;
    }
    else if (!isEdit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        emailErr.textContent = "Invalid email format";
        document.getElementById("userEmailInput")?.classList.add("invalid");
        valid = false;
    }
    return valid;
}
document.getElementById("saveUserBtn").addEventListener("click", async () => {
    const name = document.getElementById("userNameInput").value.trim();
    const email = document.getElementById("userEmailInput").value.trim();
    const editUserId = document.getElementById("editUserId").value;
    const isEdit = !!editUserId;
    if (!validateUserForm(name, email, isEdit))
        return;
    try {
        if (isEdit) {
            await fetch(`${API_BASE}/users/${editUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Demo-UserId": "1",
                },
                body: JSON.stringify({ name }),
            });
            showNotice("Користувача оновлено");
        }
        else {
            const res = await fetch(`${API_BASE}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Demo-UserId": "1",
                },
                body: JSON.stringify({ name, email }),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                showNotice(`Помилка: ${err.error ?? "невідома"}`);
                return;
            }
            showNotice("Користувача додано");
        }
        resetUserForm();
        await loadUsers();
    }
    catch (e) {
        showNotice("Помилка при збереженні користувача");
    }
});
document.getElementById("cancelUserBtn").addEventListener("click", () => {
    resetUserForm();
});
// ==================== COMMENTS ====================
async function loadComments(requestId, title) {
    const section = document.getElementById("commentsSection");
    const commentsTitle = document.getElementById("commentsTitle");
    const tbody = document.getElementById("commentsTableBody");
    section.style.display = "block";
    commentsTitle.textContent = `Comments for: ${title}`;
    tbody.textContent = "";
    resetCommentEditForm(requestId, title);
    try {
        const res = await fetch(`${API_BASE}/requests/${requestId}/comments`);
        const data = await res.json();
        data.data.forEach((c, i) => {
            const tr = document.createElement("tr");
            const tdNum = document.createElement("td");
            tdNum.textContent = String(i + 1);
            const tdUser = document.createElement("td");
            tdUser.textContent = String(c.userId);
            const tdBody = document.createElement("td");
            tdBody.textContent = c.body;
            const tdDate = document.createElement("td");
            tdDate.textContent = new Date(c.createdAt).toLocaleString("uk-UA");
            const tdActions = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.className = "edit-btn";
            editBtn.textContent = "Edit";
            editBtn.onclick = () => fillCommentEditForm(c.id, c.body, requestId, title);
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-btn";
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = async () => {
                if (!confirm("Видалити коментар?"))
                    return;
                await fetch(`${API_BASE}/comments/${c.id}`, {
                    method: "DELETE",
                    headers: { "X-Demo-UserId": "1" },
                });
                await loadComments(requestId, title);
            };
            tdActions.appendChild(editBtn);
            tdActions.appendChild(deleteBtn);
            tr.appendChild(tdNum);
            tr.appendChild(tdUser);
            tr.appendChild(tdBody);
            tr.appendChild(tdDate);
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }
    catch (e) {
        console.error("Failed to load comments", e);
    }
}
function fillCommentEditForm(commentId, body, requestId, title) {
    const input = document.getElementById("commentInput");
    const editIdInput = document.getElementById("editCommentId");
    const addBtn = document.getElementById("addCommentBtn");
    const cancelBtn = document.getElementById("cancelCommentBtn");
    input.value = body;
    editIdInput.value = String(commentId);
    addBtn.textContent = "Update";
    cancelBtn.style.display = "inline-block";
    addBtn.onclick = async () => {
        const newBody = input.value.trim();
        if (!newBody)
            return;
        await fetch(`${API_BASE}/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-Demo-UserId": "1" },
            body: JSON.stringify({ body: newBody }),
        });
        await loadComments(requestId, title);
    };
}
function resetCommentEditForm(requestId, title) {
    const input = document.getElementById("commentInput");
    const editIdInput = document.getElementById("editCommentId");
    const addBtn = document.getElementById("addCommentBtn");
    const cancelBtn = document.getElementById("cancelCommentBtn");
    input.value = "";
    editIdInput.value = "";
    addBtn.textContent = "Add";
    cancelBtn.style.display = "none";
    addBtn.onclick = async () => {
        const body = input.value.trim();
        if (!body)
            return;
        await fetch(`${API_BASE}/requests/${requestId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Demo-UserId": "1" },
            body: JSON.stringify({ userId: 1, body }),
        });
        input.value = "";
        await loadComments(requestId, title);
    };
    cancelBtn.onclick = () => resetCommentEditForm(requestId, title);
}
// ==================== REPORTS ====================
async function loadList() {
    const filterSelect = document.getElementById("filterSelect");
    const status = filterSelect.value || undefined;
    renderListStatus("loading");
    try {
        const result = await getRequests(status);
        const items = result.data;
        if (!items || items.length === 0) {
            renderList([], handleEdit, handleDelete, handleComments);
            renderListStatus("empty");
            return;
        }
        renderList(items, handleEdit, handleDelete, handleComments);
        renderListStatus("success");
    }
    catch (e) {
        const err = e;
        renderList([], handleEdit, handleDelete, handleComments);
        renderListStatus("error", err);
    }
}
function handleEdit(item) {
    fillForm(item);
}
async function handleDelete(id) {
    try {
        await deleteRequest(id);
        showNotice("Запис видалено");
        await loadList();
    }
    catch (e) {
        const err = e;
        showNotice(`Не вдалося видалити. Помилка (${err.status}): ${err.message}`);
    }
}
function handleComments(id, title) {
    loadComments(id, title);
}
function validateForm(title, userId, severity, status) {
    clearErrors();
    let isValid = true;
    if (!title || title.trim() === "") {
        showFieldError("titleInput", "titleError", "Title is required");
        isValid = false;
    }
    if (!userId || !Number.isFinite(Number(userId))) {
        showFieldError("userIdInput", "userIdError", "User ID must be a number");
        isValid = false;
    }
    const sev = Number(severity);
    if (!severity || Number.isNaN(sev) || sev < 1 || sev > 5) {
        showFieldError("severityInput", "severityError", "Severity must be 1–5");
        isValid = false;
    }
    if (!status) {
        showFieldError("statusSelect", "statusError", "Status is required");
        isValid = false;
    }
    return isValid;
}
const form = document.getElementById("createForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("titleInput").value.trim();
    const userId = document.getElementById("userIdInput").value.trim();
    const severity = document.getElementById("severityInput").value.trim();
    const status = document.getElementById("statusSelect").value;
    const editId = document.getElementById("editId").value;
    if (!validateForm(title, userId, severity, status))
        return;
    setSubmitEnabled(false);
    try {
        if (editId) {
            await updateRequest(Number(editId), { title, severity: Number(severity), status });
            showNotice("Запис оновлено");
        }
        else {
            await createRequest({ userId: Number(userId), title, severity: Number(severity), status });
            showNotice("Запис створено");
        }
        resetForm();
        await loadList();
    }
    catch (e) {
        const err = e;
        if (err.status === 409) {
            showFieldError("titleInput", "titleError", "Такий Title вже існує");
        }
        else {
            showNotice(`Помилка (${err.status}): ${err.message}`);
        }
    }
    finally {
        setSubmitEnabled(true);
    }
});
document.getElementById("resetBtn").addEventListener("click", () => resetForm());
document.getElementById("filterSelect").addEventListener("change", () => loadList());
loadList();
loadUsers();
