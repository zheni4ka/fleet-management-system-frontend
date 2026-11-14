// Автотести API Fleet Management System (лабораторна № 4).
// Запуск: set FMS_ADMIN_PASSWORD=<пароль>  &&  node --test api.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.FMS_API_URL ?? "http://localhost:5196";

test("GET /api/Driver/all без токена повертає 401", async () => {
  const response = await fetch(`${baseUrl}/api/Driver/all`);
  assert.equal(response.status, 401);
});

test("Звіт за період довший за 366 днів повертає 400", async () => {
  const login = await fetch(`${baseUrl}/api/Account/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: process.env.FMS_ADMIN_LOGIN ?? "admin",
      password: process.env.FMS_ADMIN_PASSWORD,
    }),
  });
  assert.equal(login.status, 200);
  const { token } = await login.json();

  const response = await fetch(
    `${baseUrl}/api/Route/periodReport?periodStartDate=2024-01-01&periodEndDate=2026-01-01`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  assert.equal(response.status, 400);
});
