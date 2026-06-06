import { API_BASE_URL } from "./config.js";
async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    let response;
    try {
        response = await fetch(url, options);
    }
    catch (e) {
        const err = {
            status: 0,
            message: "Помилка мережі або CORS. Перевірте що бекенд запущений.",
            details: e?.message ?? String(e),
        };
        throw err;
    }
    if (response.status === 204) {
        return null;
    }
    const rawText = await response.text();
    if (response.ok) {
        if (!rawText)
            return null;
        try {
            return JSON.parse(rawText);
        }
        catch {
            return rawText;
        }
    }
    let payload = null;
    try {
        payload = rawText ? JSON.parse(rawText) : null;
    }
    catch {
    }
    const err = {
        status: response.status,
        message: payload?.error ?? payload?.message ?? "HTTP помилка",
        details: rawText ?? `HTTP ${response.status}`,
    };
    throw err;
}
async function requestWithTimeout(path, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await request(path, { ...options, signal: controller.signal });
    }
    catch (e) {
        if (e.name === "AbortError") {
            const err = {
                status: 0,
                message: "Запит перевищив час очікування (10с). Спробуйте ще раз.",
                details: "AbortError",
            };
            throw err;
        }
        throw e;
    }
    finally {
        clearTimeout(id);
    }
}
export async function getRequests(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return requestWithTimeout(`/requests${query}`);
}
export async function getRequestById(id) {
    return requestWithTimeout(`/requests/${id}`);
}
export async function createRequest(dto) {
    return requestWithTimeout(`/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}
export async function updateRequest(id, dto) {
    return requestWithTimeout(`/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}
export async function deleteRequest(id) {
    return requestWithTimeout(`/requests/${id}`, { method: "DELETE" });
}
