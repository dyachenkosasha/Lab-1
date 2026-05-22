const form = document.getElementById("createForm");
const resetBtn = document.getElementById("resetBtn");
const tableBody = document.getElementById("tasksTableBody");
const filterSelect = document.getElementById("filterSelect");

const usersInput = document.getElementById("usersInput");
const severityInput = document.getElementById("severityInput");
const statusSelect = document.getElementById("statusSelect");

let reports = [];
let nextId = 1;
let editId = null;

form.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const users = usersInput.value.trim();
  const severityValue = severityInput.value.trim();
  const status = statusSelect.value;

  let isValid = true;
  if (users === "") {
    showError(usersInput, "usersError", "Users required");
    isValid = false;
  }

  const duplicate = reports.find(r =>
    r.users.toLowerCase() === users.toLowerCase() && r.id !== editId
  );

  if (duplicate) {
    showError(usersInput, "usersError", "Users must be unique");
    isValid = false;
  }
  const severity = Number(severityValue);
  if (
    severityValue === "" ||
    Number.isNaN(severity) ||
    severity < 1 ||
    severity > 5
  ) {
    showError(severityInput, "severityError", "Severity 1–5");
    isValid = false;
  }
  if (status === "") {
    showError(statusSelect, "statusError", "Status required");
    isValid = false;
  }

  if (!isValid) return;

  if (editId === null) {
    reports.push({
      id: nextId++,
      users,
      severity,
      status,
      createdAt: new Date().toLocaleString()
    });
  } else {
    const report = reports.find(r => r.id === editId);
    report.users = users;
    report.severity = severity;
    report.status = status;
    editId = null;
  }

  form.reset();
  render();
});

resetBtn.addEventListener("click", function () {
  form.reset();
  editId = null;
  clearErrors();
});

filterSelect.addEventListener("change", render);

function render() {
  let filtered = reports;
  const filterValue = filterSelect.value;

  if (filterValue !== "") {
    filtered = reports.filter(r => r.status === filterValue);
  }

  tableBody.innerHTML = filtered.map((r, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${r.users}</td>
      <td>${r.severity}</td>
      <td>${r.status}</td>
      <td>${r.createdAt}</td>
      <td>
        <button class="edit-btn" data-id="${r.id}">Edit</button>
        <button class="delete-btn" data-id="${r.id}">Delete</button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      reports = reports.filter(r => r.id !== id);
      render();
    };
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => {
      const report = reports.find(r => r.id === Number(btn.dataset.id));
      usersInput.value = report.users;
      severityInput.value = report.severity;
      statusSelect.value = report.status;
      editId = report.id;
    };
  });
}

function showError(input, errorId, message) {
  input.classList.add("invalid");
  document.getElementById(errorId).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
}