import { getRequests, createRequest, updateRequest, deleteRequest, } from "./apiClient.js";
import { showNotice, renderListStatus, renderList, fillForm, resetForm, setSubmitEnabled, showFieldError, clearErrors, } from "./ui.js";
async function loadList() {
    const filterSelect = document.getElementById("filterSelect");
    const status = filterSelect.value || undefined;
    renderListStatus("loading");
    try {
        const result = await getRequests(status);
        const items = result.data;
        if (!items || items.length === 0) {
            renderList([], handleEdit, handleDelete);
            renderListStatus("empty");
            return;
        }
        renderList(items, handleEdit, handleDelete);
        renderListStatus("success");
    }
    catch (e) {
        const err = e;
        renderList([], handleEdit, handleDelete);
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
        showNotice(`Не вдалося видалити запис. Помилка (${err.status}): ${err.message}`);
    }
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
            await updateRequest(Number(editId), {
                title,
                severity: Number(severity),
                status,
            });
            showNotice("Запис оновлено");
        }
        else {
            await createRequest({
                userId: Number(userId),
                title,
                severity: Number(severity),
                status,
            });
            showNotice("Запис створено");
        }
        resetForm();
        await loadList();
    }
    catch (e) {
        const err = e;
        showNotice(`Помилка (${err.status}): ${err.message}`);
    }
    finally {
        setSubmitEnabled(true);
    }
});
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
    resetForm();
});
const filterSelect = document.getElementById("filterSelect");
filterSelect.addEventListener("change", () => {
    loadList();
});
loadList();
