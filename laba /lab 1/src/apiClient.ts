import { API_BASE_URL } from "./config.js";
import type { RequestDto, CreateRequestDto, UpdateRequestDto, ApiError } from "./dtos.js";

// Демо-користувач для лабораторної роботи №5
const DEMO_USER_ID = "1";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (e: any) {
    const err: ApiError = {
      status: 0,
      message: "Помилка мережі або CORS. Перевірте що бекенд запущений.",
      details: e?.message ?? String(e),
    };
    throw err;
  }
  if (response.status === 204) {
    return null as unknown as T;
  }
  const rawText = await response.text();
  if (response.ok) {
    if (!rawText) return null as unknown as T;
    try {
      return JSON.parse(rawText) as T;
    } catch {
      return rawText as unknown as T;
    }
  }
  let payload: any = null;
  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {}
  const err: ApiError = {
    status: response.status,
    message: payload?.error ?? payload?.message ?? "HTTP помилка",
    details: rawText ?? `HTTP ${response.status}`,
  };
  throw err;
}

async function requestWithTimeout<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await request<T>(path, { ...options, signal: controller.signal });
  } catch (e: any) {
    if (e.name === "AbortError") {
      const err: ApiError = {
        status: 0,
        message: "Запит перевищив час очікування (10с). Спробуйте ще раз.",
        details: "AbortError",
      };
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(id);
  }
}

export async function getRequests(status?: string): Promise<{ data: RequestDto[] }> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return requestWithTimeout(`/requests${query}`);
}

export async function getRequestById(id: number): Promise<{ data: RequestDto }> {
  return requestWithTimeout(`/requests/${id}`);
}

export async function createRequest(dto: CreateRequestDto): Promise<{ data: RequestDto }> {
  return requestWithTimeout(`/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-UserId": DEMO_USER_ID,
    },
    body: JSON.stringify(dto),
  });
}

export async function updateRequest(
  id: number,
  dto: UpdateRequestDto
): Promise<{ data: RequestDto }> {
  return requestWithTimeout(`/requests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-UserId": DEMO_USER_ID,
    },
    body: JSON.stringify(dto),
  });
}

export async function deleteRequest(id: number): Promise<null> {
  return requestWithTimeout(`/requests/${id}`, {
    method: "DELETE",
    headers: {
      "X-Demo-UserId": DEMO_USER_ID,
    },
  });
}
