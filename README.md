# Fleet Management System — frontend

Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, shadcn/ui, zod.

## Архітектура сесії (BFF)

Браузер ніколи не бачить токен доступу. Next.js працює як backend-for-frontend:

- `POST /api/session/login`, `POST /api/session/change-password` — викликають API й встановлюють cookie `accessToken` і `refreshToken` з атрибутами `HttpOnly; Secure; SameSite=Lax`.
- `POST /api/session/logout` — відкликає refresh-токен в API й очищає cookie.
- `GET /api/session/sso/start`, `GET /api/session/sso/callback` — вхід через Microsoft Entra ID (authorization code + PKCE).
- `/api/proxy/api/...` — клієнтські запити до API; route handler додає `Authorization: Bearer` на сервері. Запити, що змінюють дані, приймаються лише з того самого джерела.
- `proxy.ts` (middleware) непомітно оновлює сесію, коли access-токен спливає, і передає нові cookie поточному рендеру.

## Змінні середовища

Скопіюйте `.env.example` у `.env`.

| Змінна | Обов'язково | Опис |
| --- | --- | --- |
| `API_BASE_URL` | так | адреса API, доступна серверу Next.js |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ні | ключ Google Maps Embed API (вбудовується під час збірки) |
| `OIDC_AUTHORITY`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`, `APP_BASE_URL` | лише для SSO | усі чотири або жодної; часткове налаштування — помилка |

Next.js має працювати за зворотним проксі, який встановлює `X-Forwarded-For`: BFF передає цей заголовок в API для обмеження частоти запитів за IP.

## Запуск

```bash
npm ci
npm run dev
```

Перевірки: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

Тести (Vitest) лежать у `tests/`: форми, параметри пошуку, zod-схеми, перетворення часових поясів і BFF route handlers. У Windows запускайте їх зі шляху з великою літерою диска (`C:\...`): якщо поточна тека має вигляд `c:\...`, Vitest завантажує свої модулі двічі й падає з `Cannot read properties of undefined (reading 'config')`.

## Docker

`Dockerfile` збирає standalone-образ (`node server.js`, порт 3000). Повний локальний стек (SQL Server, міграції, API, фронтенд) описано в `docker-compose.yml` у репозиторії бекенду.

## Журнали й трасування

`proxy.ts` додає до кожного запиту W3C-заголовок `traceparent` (або зберігає вхідний), BFF передає його в API, а журнали BFF (JSON у stdout) містять той самий `traceId`, що й журнали API.
