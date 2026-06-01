import { migrate } from "./migrate";
import { run } from "./dbClient";

async function seed() {
  await migrate();

  const now = new Date().toISOString();

  console.log("Seeding users...");

  await run(`
    INSERT OR IGNORE INTO Users (email, name, createdAt)
    VALUES ('alice@example.com', 'Alice Kovalenko', '${now}');
  `);
  await run(`
    INSERT OR IGNORE INTO Users (email, name, createdAt)
    VALUES ('bob@example.com', 'Bob Petrenko', '${now}');
  `);
  await run(`
    INSERT OR IGNORE INTO Users (email, name, createdAt)
    VALUES ('carol@example.com', 'Carol Shevchenko', '${now}');
  `);

  console.log("Seeding requests...");

  await run(`
    INSERT OR IGNORE INTO Requests (userId, title, severity, status, createdAt)
    SELECT id, 'Сервер недоступний', 5, 'Open', '${now}'
    FROM Users WHERE email = 'alice@example.com' LIMIT 1;
  `);
  await run(`
    INSERT OR IGNORE INTO Requests (userId, title, severity, status, createdAt)
    SELECT id, 'Повільний VPN', 2, 'In progress', '${now}'
    FROM Users WHERE email = 'alice@example.com' LIMIT 1;
  `);
  await run(`
    INSERT OR IGNORE INTO Requests (userId, title, severity, status, createdAt)
    SELECT id, 'Не відкривається пошта', 3, 'Resolved', '${now}'
    FROM Users WHERE email = 'bob@example.com' LIMIT 1;
  `);
  await run(`
    INSERT OR IGNORE INTO Requests (userId, title, severity, status, createdAt)
    SELECT id, 'Принтер не друкує', 1, 'Open', '${now}'
    FROM Users WHERE email = 'carol@example.com' LIMIT 1;
  `);

  console.log("Seeding comments...");

  await run(`
    INSERT INTO Comments (requestId, userId, body, createdAt)
    SELECT r.id, u.id, 'Перевіряємо з боку адміністратора', '${now}'
    FROM Requests r
    JOIN Users u ON u.email = 'bob@example.com'
    WHERE r.title = 'Сервер недоступний' LIMIT 1;
  `);
  await run(`
    INSERT INTO Comments (requestId, userId, body, createdAt)
    SELECT r.id, u.id, 'Дякую, чекаю на відповідь', '${now}'
    FROM Requests r
    JOIN Users u ON u.email = 'alice@example.com'
    WHERE r.title = 'Сервер недоступний' LIMIT 1;
  `);

  console.log("Seed completed!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});