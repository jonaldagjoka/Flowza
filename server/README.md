# Flowza PHP Backend

This folder contains the PHP backend for the Flowza website.

## Directory structure

- `server/api/` – API endpoints
- `server/config/` – shared configuration and response helpers
- `server/database/` – database schema and storage files

## Available endpoints

- `POST /api/auth.php`
  - Request body: `{ "email": "...", "password": "..." }`
  - Response: authenticated user object and a temporary token

- `GET /api/data.php`
  - Returns demo data for users, projects, tasks, task history, project members, and files
  - Optional query parameter: `?type=users|projects|tasks|project_members|task_history|project_files`

## Security

Security headers are applied in `server/config/Config.php` and `.htaccess`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Deployment

From the project root, you can run a local PHP server for testing:

```bash
php -S localhost:8000 -t server
```

Then call the endpoints as:

- `http://localhost:8000/api/auth.php`
- `http://localhost:8000/api/data.php`

For the front-end, set the API base URL in the root `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If you deploy on Apache, make sure `mod_headers` is enabled so `.htaccess` security headers are honored.
