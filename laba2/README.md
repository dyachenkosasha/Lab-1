# Лабораторна робота №4 — Інтеграція фронтенду з бекендом

## Запуск

### Бекенд
```bash
cd laba2
npm install
npm run dev
```

### Фронтенд
В окремому терміналі:
```bash
cd "lab 1"
npm install
npm run watch
```

В ще одному терміналі:
```bash
cd "lab 1"
npm run serve
```

Відкрити в браузері: `http://localhost:5500`

Бекенд працює на: `http://localhost:3000`

## Як це працює

Фронтенд і бекенд запускаються як два окремі процеси на різних портах.
Фронтенд звертається до бекенду через `fetch()` на адресу `http://localhost:3000/api/v1/`.
CORS на бекенді дозволяє запити з `http://localhost:5500`.

## Версійність API

Всі маршрути мають префікс `/api/v1/`.
Breaking changes (перейменування або видалення полів) допускаються тільки при введенні нової версії `/api/v2/`.
Нові необов'язкові поля можна додавати в `/api/v1/` без версійного підвищення.

## Правила сумісності DTO

1. Не можна перейменовувати або видаляти поля які вже використовує фронтенд.
2. Нові поля додаються як необов'язкові — старий фронтенд просто їх ігнорує.
3. Не можна міняти тип поля (наприклад `id: number` → `id: string`).

## Схема БД

```
Users
  id        INTEGER PRIMARY KEY
  email     TEXT NOT NULL UNIQUE
  name      TEXT NOT NULL
  createdAt TEXT NOT NULL

Requests
  id        INTEGER PRIMARY KEY
  userId    INTEGER NOT NULL → Users(id) ON DELETE CASCADE
  title     TEXT NOT NULL
  severity  INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 5)
  status    TEXT NOT NULL CHECK (status IN ('Open','In progress','Resolved'))
  createdAt TEXT NOT NULL

Comments
  id        INTEGER PRIMARY KEY
  requestId INTEGER NOT NULL → Requests(id) ON DELETE CASCADE
  userId    INTEGER NOT NULL → Users(id) ON DELETE RESTRICT
  body      TEXT NOT NULL
  createdAt TEXT NOT NULL
```

## Ендпоінти

### Users
| Метод | URL | Опис |
|---|---|---|
| GET | /api/v1/users | Список користувачів |
| GET | /api/v1/users/:id | Користувач за id |
| POST | /api/v1/users | Створити користувача |
| PUT | /api/v1/users/:id | Оновити ім'я |
| DELETE | /api/v1/users/:id | Видалити користувача |

### Requests
| Метод | URL | Опис |
|---|---|---|
| GET | /api/v1/requests | Список заявок |
| GET | /api/v1/requests/with-authors | Заявки з авторами (JOIN) |
| GET | /api/v1/requests/stats | Кількість по статусах (COUNT) |
| GET | /api/v1/requests/search?q= | Пошук за заголовком |
| GET | /api/v1/requests/severity/:severity | Заявки по severity |
| GET | /api/v1/requests/:id | Заявка за id |
| POST | /api/v1/requests | Створити заявку |
| PUT | /api/v1/requests/:id | Оновити заявку |
| DELETE | /api/v1/requests/:id | Видалити заявку |
| GET | /api/v1/requests/:id/comments | Коментарі до заявки |
| POST | /api/v1/requests/:id/comments | Додати коментар |

### Comments
| Метод | URL | Опис |
|---|---|---|
| DELETE | /api/v1/comments/:id | Видалити коментар |

## Сценарії перевірки

### 1. Перевірка CORS
Відкрити `http://localhost:5500` в браузері.
Відкрити DevTools → Network.
Завантажити сторінку — має з'явитись запит до `/api/v1/requests` зі статусом 200.
Якщо є CORS помилка — перевірити що бекенд запущений і порт 5500 є в whitelist.

### 2. Перевірка станів інтерфейсу

**Loading:**
Відкрити сторінку — на секунду має з'явитись "Завантаження...".

**Empty:**
Очистити базу або відфільтрувати по статусу якого немає — має з'явитись "Поки що немає записів."

**Error:**
Зупинити бекенд і оновити сторінку — має з'явитись повідомлення про помилку мережі.

### 3. Перевірка CRUD

**Створення:**
```
Title: Test Request
User ID: 1
Severity: 3
Status: Open
```
Натиснути Save — запис має з'явитись в таблиці.

**Оновлення:**
Натиснути Edit на записі — форма заповниться даними.
Змінити Title → натиснути Update — таблиця оновиться.

**Видалення:**
Натиснути Delete → підтвердити → запис зникне з таблиці.

### 4. Перевірка валідації → 400
Залишити поля порожніми і натиснути Save.
Під кожним полем має з'явитись повідомлення про помилку.

### 5. Перевірка таймауту
Зупинити бекенд.
Натиснути Save або оновити сторінку.
Через 10 секунд має з'явитись повідомлення "Запит перевищив час очікування".

### 6. Перевірка preflight OPTIONS
Відкрити DevTools → Network.
Натиснути Save (POST запит).