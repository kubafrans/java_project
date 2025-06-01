# Warehouse Frontend

A simple React + Vite frontend for the Warehouse Management Microservices.

## Pages

- **Login** (`/login`)
- **Items** (`/items`)
- **Orders** (`/orders`)
- **Users** (`/users`)

## Setup

```bash
cd frontend
npm install
npm run dev
```

The app expects the backend at `http://localhost` (port 80).

## API Endpoints

**Use these endpoints in your frontend code:**

- Items: `http://localhost/api/items/`
- Orders: `http://localhost/api/orders/`
- Users: `http://localhost/api/users/`
- Auth: `http://localhost/api/auth/`

**Do NOT use port 5173 in API URLs.**  
All requests should go through the NGINX reverse proxy on port 80.

## Development

- Start the backend and NGINX (`docker-compose up`)
- Start the frontend dev server:
  ```bash
  npm run dev
  ```
- The frontend will be available at `http://localhost:5173/` (for dev), but all API calls must go to `http://localhost/api/...` (port 80, not 5173)

## Example axios usage

```js
// ...existing code...
axios.get('http://localhost/api/items/');
// ...existing code...
```

Or, if using relative URLs (recommended for deployment):

```js
axios.get('/api/items/');
```
