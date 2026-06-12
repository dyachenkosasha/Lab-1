import {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest,
} from "./apiClient.js";
import {
  showNotice,
  renderListStatus,
  renderList,
  fillForm,
  resetForm,
  setSubmitEnabled,
  showFieldError,
  clearErrors,
} from "./ui.js";
import type { ApiError } from "./dtos.js";

const API_BASE = "http://localhost:3000/api/v1";

// ==================== USERS ====================

async function loadUsers(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    renderUsers(data.data);
  } catch (e) {
    console.error("Failed to load users", e);
  }
}

interface UserDto {
  id: number;
  name: string;
  email: string;
}

function renderUsers(users: UserDto[]): void {
  const tbody = document.getElementById("usersTableBody") as HTMLTableSectionElement;
  tbody.textContent = "";

  users.forEach((u: UserDto, i: number) => {
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
      if (!confirm(`Видалити користувача «${u.name}»?`)) return;
      try {
        await fetch(`${API_BASE}/users/${u.id}`, {
          method: "DELETE",
          headers: { "X-Demo-UserId": "1" },
        });
        showNotice("Користувача видалено");
        await loadUsers();
      } catch (e) {
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

function fillUserForm(user: UserDto): void {
  (document.getElementById("editUserId") as HTMLInputElement).value = String(user.id);
  (document.getElementById("userNameInput") as HTMLInputElement).value = user.name;
  (document.getElementById("userEmailInput") as HTMLInputElement).value = user.email;
  (document.getElementById("userFormTitle") as HTMLElement).textContent = "Edit User";
  (document.getElementById("saveUserBtn") as HTMLButtonElement).textContent = "Update";
  (document.getElementById("cancelUserBtn") as HTMLButtonElement).style.display = "inline-block";
}

function resetUserForm(): void {
  (document.getElementById("editUserId") as HTMLInputElement).value = "";
  (document.getElementById("userNameInput") as HTMLInputElement).value = "";
  (document.getElementById("userEmailInput") as HTMLInputElement).value = "";
  (document.getElementById("userFormTitle") as HTMLElement).textContent = "Add User";
  (document.getElementById("saveUserBtn") as HTMLButtonElement).textContent = "Add";
  (document.getElementById("cancelUserBtn") as HTMLButtonElement).style.display = "none";
  const nameErr = document.getElementById("userNameError");
  const emailErr = document.getElementById("userEmailError");
  if (nameErr) nameErr.textContent = "";
  if (emailErr) emailErr.textContent = "";
  document.getElementById("userNameInput")?.classList.remove("invalid");
  document.getElementById("userEmailInput")?.classList.remove("invalid");
}

function validateUserForm(name: string, email: string, isEdit: boolean): boolean {
  let valid = true;
  const nameErr = document.getElementById("userNameError") as HTMLElement;
  const emailErr = document.getElementById("userEmailError") as HTMLElement;
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
  } else if (!isEdit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    emailErr.textContent = "Invalid email format";
    document.getElementById("userEmailInput")?.classList.add("invalid");
    valid = false;
  }
  return valid;
}

(document.getElementById("saveUserBtn") as HTMLButtonElement).addEventListener("click", async () => {
  const name = (document.getElementById("userNameInput") as HTMLInputElement).value.trim();
  const email = (document.getElementById("userEmailInput") as HTMLInputElement).value.trim();
  const editUserId = (document.getElementById("editUserId") as HTMLInputElement).value;
  const isEdit = !!editUserId;

  if (!validateUserForm(name, email, isEdit)) return;

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
    } else {
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
        showNotice(`Помилка: ${(err as { error?: string }).error ?? "невідома"}`);
        return;
      }
      showNotice("Користувача додано");
    }
    resetUserForm();
    await loadUsers();
  } catch (e) {
    showNotice("Помилка при збереженні користувача");
  }
});

(document.getElementById("cancelUserBtn") as HTMLButtonElement).addEventListener("click", () => {
  resetUserForm();
});

// ==================== COMMENTS ====================

async function loadComments(requestId: number, title: string): Promise<void> {
  const section = document.getElementById("commentsSection") as HTMLElement;
  const commentsTitle = document.getElementById("commentsTitle") as HTMLElement;
  const tbody = document.getElementById("commentsTableBody") as HTMLTableSectionElement;

  section.style.display = "block";
  commentsTitle.textContent = `Comments for: ${title}`;
  tbody.textContent = "";

  resetCommentEditForm(requestId, title);

  try {
    const res = await fetch(`${API_BASE}/requests/${requestId}/comments`);
    const data = await res.json();
    data.data.forEach((c: { id: number; userId: number; body: string; createdAt: string }, i: number) => {
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
        if (!confirm("Видалити коментар?")) return;
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
  } catch (e) {
    console.error("Failed to load comments", e);
  }
}

function fillCommentEditForm(commentId: number, body: string, requestId: number, title: string): void {
  const input = document.getElementById("commentInput") as HTMLInputElement;
  const editIdInput = document.getElementById("editCommentId") as HTMLInputElement;
  const addBtn = document.getElementById("addCommentBtn") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancelCommentBtn") as HTMLButtonElement;

  input.value = body;
  editIdInput.value = String(commentId);
  addBtn.textContent = "Update";
  cancelBtn.style.display = "inline-block";

  addBtn.onclick = async () => {
    const newBody = input.value.trim();
    if (!newBody) return;
    await fetch(`${API_BASE}/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Demo-UserId": "1" },
      body: JSON.stringify({ body: newBody }),
    });
    await loadComments(requestId, title);
  };
}

function resetCommentEditForm(requestId: number, title: string): void {
  const input = document.getElementById("commentInput") as HTMLInputElement;
  const editIdInput = document.getElementById("editCommentId") as HTMLInputElement;
  const addBtn = document.getElementById("addCommentBtn") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancelCommentBtn") as HTMLButtonElement;

  input.value = "";
  editIdInput.value = "";
  addBtn.textContent = "Add";
  cancelBtn.style.display = "none";

  addBtn.onclick = async () => {
    const body = input.value.trim();
    if (!body) return;
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

async function loadList(): Promise<void> {
  const filterSelect = document.getElementById("filterSelect") as HTMLSelectElement;
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
  } catch (e) {
    const err = e as ApiError;
    renderList([], handleEdit, handleDelete, handleComments);
    renderListStatus("error", err);
  }
}

function handleEdit(item: Parameters<typeof fillForm>[0]): void {
  fillForm(item);
}

async function handleDelete(id: number): Promise<void> {
  try {
    await deleteRequest(id);
    showNotice("Запис видалено");
    await loadList();
  } catch (e) {
    const err = e as ApiError;
    showNotice(`Не вдалося видалити. Помилка (${err.status}): ${err.message}`);
  }
}

function handleComments(id: number, title: string): void {
  loadComments(id, title);
}

function validateForm(title: string, userId: string, severity: string, status: string): boolean {
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

const form = document.getElementById("createForm") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = (document.getElementById("titleInput") as HTMLInputElement).value.trim();
  const userId = (document.getElementById("userIdInput") as HTMLInputElement).value.trim();
  const severity = (document.getElementById("severityInput") as HTMLInputElement).value.trim();
  const status = (document.getElementById("statusSelect") as HTMLSelectElement).value;
  const editId = (document.getElementById("editId") as HTMLInputElement).value;

  if (!validateForm(title, userId, severity, status)) return;
  setSubmitEnabled(false);

  try {
    if (editId) {
      await updateRequest(Number(editId), { title, severity: Number(severity), status });
      showNotice("Запис оновлено");
    } else {
      await createRequest({ userId: Number(userId), title, severity: Number(severity), status });
      showNotice("Запис створено");
    }
    resetForm();
    await loadList();
  } catch (e) {
    const err = e as ApiError;
    if (err.status === 409) {
      showFieldError("titleInput", "titleError", "Такий Title вже існує");
    } else {
      showNotice(`Помилка (${err.status}): ${err.message}`);
    }
  } finally {
    setSubmitEnabled(true);
  }
});

(document.getElementById("resetBtn") as HTMLButtonElement).addEventListener("click", () => resetForm());

(document.getElementById("filterSelect") as HTMLSelectElement).addEventListener("change", () => loadList());

loadList();
loadUsers();
