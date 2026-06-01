# Лабораторна робота №2 — Бекенд без БД

REST API для сервісу «Репорт вразливості» навчальних проектів.

## Запуск

```bash
# 1. Встановити залежності
npm install

# 2. Запустити в режимі розробки (з авто-перезапуском при зміні файлів)
npm run dev

# 3. Зібрати TypeScript → JavaScript
npm run build

# 4. Запустити зібрану версію
npm start
```

Сервер запускається на `http://localhost:3000`.

## Перевірка якості коду

```bash
npm run lint     # ESLint: пошук помилок
npm run format   # Prettier: форматування
```

---

## Реалізовані сутності

| Сутність | Базовий маршрут  | Поля |
|----------|-----------------|------|
| Users    | `/api/users`    | `id`, `username`, `email`, `createdAt` |
| Reports  | `/api/reports`  | `id`, `users`, `severity` (1–5), `status` (Open/In progress/Resolved), `createdAt` |

---

## Приклади запитів (curl)

> Флаг `-i` додає у вивід HTTP-статус і заголовки.

### Health check

```bash
curl -i http://localhost:3000/health
```

---

### USERS

#### GET /api/users — список всіх користувачів
```bash
curl -i http://localhost:3000/api/users
```
Відповідь `200`:
```json
{ "items": [...], "total": 2 }
```

#### POST /api/users — створити користувача
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"Olena\", \"email\": \"olena@example.com\"}"
```
Відповідь `201`:
```json
{ "id": "uuid...", "username": "Olena", "email": "olena@example.com", "createdAt": "..." }
```

#### POST /api/users — помилка валідації (400)
```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"A\"}"
```
Відповідь `400`:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "username", "message": "Username must be at least 2 characters" },
      { "field": "email", "message": "Email must be at least 5 characters" }
    ]
  }
}
```

#### GET /api/users/:id — один користувач
```bash
curl -i http://localhost:3000/api/users/<ID>
```

#### GET /api/users/:id — не існує (404)
```bash
curl -i http://localhost:3000/api/users/nonexistent-id
```

#### PUT /api/users/:id — оновити
```bash
curl -i -X PUT http://localhost:3000/api/users/<ID> \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"Olena Updated\", \"email\": \"new@example.com\"}"
```

#### DELETE /api/users/:id — видалити
```bash
curl -i -X DELETE http://localhost:3000/api/users/<ID>
```
Відповідь: `204 No Content` (без тіла)

---

### REPORTS

#### GET /api/reports — всі репорти
```bash
curl -i http://localhost:3000/api/reports
```

#### GET /api/reports — фільтрація за статусом
```bash
curl -i "http://localhost:3000/api/reports?status=Open"
```

#### GET /api/reports — сортування
```bash
curl -i "http://localhost:3000/api/reports?sortBy=severity&sortDir=desc"
```

#### GET /api/reports — пагінація
```bash
curl -i "http://localhost:3000/api/reports?page=1&pageSize=5"
```

#### GET /api/reports — комбінація всіх параметрів
```bash
curl -i "http://localhost:3000/api/reports?status=Open&sortBy=severity&sortDir=asc&page=1&pageSize=10"
```

#### POST /api/reports — створити репорт
```bash
curl -i -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"users\": \"admin\", \"severity\": 3, \"status\": \"Open\"}"
```

#### POST /api/reports — невалідний severity (400)
```bash
curl -i -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d "{\"users\": \"admin\", \"severity\": 10, \"status\": \"Open\"}"
```

#### PUT /api/reports/:id — оновити репорт
```bash
curl -i -X PUT http://localhost:3000/api/reports/<ID> \
  -H "Content-Type: application/json" \
  -d "{\"users\": \"admin\", \"severity\": 5, \"status\": \"Resolved\"}"
```

#### DELETE /api/reports/:id
```bash
curl -i -X DELETE http://localhost:3000/api/reports/<ID>
```

---

## Архітектура проекту

```
src/
├── index.ts                         ← запуск сервера на порту
├── app.ts                           ← налаштування Express + middleware
├── routes/
│   ├── users.routes.ts              ← зв'язок URL → контролер
│   └── reports.routes.ts
├── controllers/
│   ├── users.controller.ts          ← читає req, викликає сервіс, формує res
│   └── reports.controller.ts
├── services/
│   ├── users.service.ts             ← бізнес-логіка + валідація
│   └── reports.service.ts
├── repositories/
│   ├── users.repository.ts          ← зберігання в пам'яті (масив)
│   └── reports.repository.ts
├── dtos/
│   ├── users.dto.ts                 ← TypeScript-контракти запитів/відповідей
│   └── reports.dto.ts
└── middleware/
    ├── request-logger.middleware.ts  ← логування кожного запиту
    └── error-handler.middleware.ts   ← централізована обробка помилок
```

## HTTP-коди стану

| Код | Ситуація |
|-----|---------|
| 200 | Успішне читання або оновлення |
| 201 | Успішне створення ресурсу (POST) |
| 204 | Успішне видалення (без тіла відповіді) |
| 400 | Помилка валідації — некоректні дані |
| 404 | Ресурс не знайдено |
| 409 | Конфлікт (наприклад, email вже існує) |
| 500 | Неочікувана помилка сервера |

## Додаткові REST-можливості (рівень «відмінно»)

1. **Фільтрація** — `GET /api/reports?status=Open`
2. **Сортування** — `GET /api/reports?sortBy=severity&sortDir=desc`
3. **Пагінація** — `GET /api/reports?page=1&pageSize=10`
