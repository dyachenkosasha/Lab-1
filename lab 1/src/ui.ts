import type { RequestDto } from "./dtos.js";

export function showNotice(text: string): void {
  const el = document.getElementById("notice")!;
  el.innerHTML = text;
  setTimeout(() => { el.innerHTML = ""; }, 4000);
}

export function renderListStatus(
  status: "loading" | "empty" | "error" | "success",
  error?: { message: string; status: number }
): void {
  const el = document.getElementById("listStatus")!;
  if (status === "loading") {
    el.innerHTML = "Завантаження...";
  } else if (status === "empty") {
    el.innerHTML = "Поки що немає записів.";
  } else if (status === "error") {
    el.innerHTML = `Помилка (${error?.status ?? ""}): ${error?.message ?? "невідома"}`;
  } else {
    el.innerHTML = "";
  }
}

export function renderList(
  items: RequestDto[],
  onEdit: (item: RequestDto) => void,
  onDelete: (id: number) => void
): void {
  const tbody = document.getElementById("tasksTableBody")!;

  if (items.length === 0) {
    tbody.innerHTML = "";
    return;
  }

  tbody.innerHTML = items
    .map(
      (r, index) => `
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
  `
    )
    .join("");

  document.querySelectorAll<HTMLButtonElement>(".edit-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      const item = items.find((r) => r.id === id);
      if (item) onEdit(item);
    };
  });

  document.querySelectorAll<HTMLButtonElement>(".delete-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (confirm("Видалити цей запис?")) {
        onDelete(id);
      }
    };
  });
}

export function fillForm(item: RequestDto): void {
  (document.getElementById("editId") as HTMLInputElement).value = String(item.id);
  (document.getElementById("titleInput") as HTMLInputElement).value = item.title;
  (document.getElementById("userIdInput") as HTMLInputElement).value = String(item.userId);
  (document.getElementById("severityInput") as HTMLInputElement).value = String(item.severity);
  (document.getElementById("statusSelect") as HTMLSelectElement).value = item.status;
  (document.getElementById("formTitle") as HTMLElement).textContent = "Edit Report";
  (document.getElementById("submitBtn") as HTMLButtonElement).textContent = "Update";
}

export function resetForm(): void {
  (document.getElementById("createForm") as HTMLFormElement).reset();
  (document.getElementById("editId") as HTMLInputElement).value = "";
  (document.getElementById("formTitle") as HTMLElement).textContent = "Create Report";
  (document.getElementById("submitBtn") as HTMLButtonElement).textContent = "Save";
  clearErrors();
}

export function setSubmitEnabled(enabled: boolean): void {
  (document.getElementById("submitBtn") as HTMLButtonElement).disabled = !enabled;
}

export function showFieldError(fieldId: string, errorId: string, message: string): void {
  document.getElementById(fieldId)?.classList.add("invalid");
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = message;
}

export function clearErrors(): void {
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
}