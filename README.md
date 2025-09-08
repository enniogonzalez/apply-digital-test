## Apply Digital Test – API Server

NestJS + TypeORM + PostgreSQL service with product ingestion and simple reporting. Includes Swagger docs, linting, tests, and Docker Compose setup.

## 1) Environment Setup (required first)

Create a `.env` file at the project root (you can start from `.env.example`) and fill the values. These are required for the app and the Docker containers to run correctly.

Required variables:

- PORT: HTTP port for the API (e.g. `3000`).
- POSTGRES_HOST: DB host. Use `localhost` for local dev, `db` inside Docker.
- POSTGRES_PORT: DB port (e.g. `5432`).
- POSTGRES_USER: DB user.
- POSTGRES_PASSWORD: DB password.
- POSTGRES_DB: DB name.
- JWT_TOKEN: The Bearer token required by all `/reports` endpoints.
- CDN_BASE_URL
- AD_SPACE_ID
- AD_ENVIRONMENT_ID
- AD_ACCESS_TOKEN
- AD_CONTENT_TYPE_ID

Note: On startup the app tries to fetch products from an external source (Apply Digital/Contentful). If these values are not set or unreachable, the fetch step will simply not import products.

## 2) Run with Docker Compose

This is the simplest way to boot the entire stack (API + Postgres):

```bash
docker compose up
```

- API: http://localhost:${PORT}
- Swagger UI: http://localhost:${PORT}/api/docs

The image runs DB migrations automatically on container start, then launches the API.

Stop everything:

```bash
docker compose down
```

Rebuild clean if needed:

```bash
docker compose down -v
docker compose up
```

## 3) Run locally (Node.js)

Prerequisites: Node.js 22.x, a reachable Postgres instance, and the `.env` configured.

```bash
npm ci
npm run migration:run
npm run start:dev
```

Swagger UI will be available at `http://localhost:${PORT}/api/docs`.

## 4) Swagger and Authorization

- Open Swagger UI at `/api/docs`.
- Click “Authorize” and choose the `bearer` scheme.
- For reports endpoints, use `Bearer <token>` where `<token>` is exactly the value of `JWT_TOKEN` from your `.env`.

## 5) Endpoints Overview

### Products

- GET `/products`
  - Returns a paginated list of products using filters.
  - Common query params:
    - Pagination: `page` (default 1), `limit` (default 5, max 5)
    - Sorting: `orderBy` (e.g. `name`, `brand`, `price`), `sortOrder` (`ASC` | `DESC`)
    - Text filters: `name`, `brand`, `model`, `category`, `color` (partial match)
    - Range filters: `minPrice`, `maxPrice`, `minStock`, `maxStock`
    - Date filters: `minDate`, `maxDate` (YYYY-MM-DD; inclusive day boundaries)
  - Example: `/products?page=1&limit=5&orderBy=name&sortOrder=ASC&brand=Acme&minPrice=100`

- DELETE `/products/:id`
  - Soft-deletes a product by `id` (sets status to `Deleted`).
  - Responses: `204 No Content` when deleted, `404 Not Found` if product does not exist.

- DELETE `/products/sku/:sku`
  - Soft-deletes a product by `sku`.
  - Responses: `204 No Content`, `404 Not Found`.

Auth: Products endpoints are public (no auth header required) for this exercise.

### Reports

The following endpoints require Bearer token, for simplicity, the token is not a signed JWT; it must match the value of `JWT_TOKEN` in your `.env`. In Swagger: click “Authorize”, paste `Bearer <JWT_TOKEN>`, then try the endpoint.

- GET `/reports/percentage-products-deleted`
- GET `/reports/percentage-products-not-deleted`
- GET `/reports/products-by-category`

## 6) Tests and Linting

- Unit tests:

  ```bash
  npm test
  ```

- Linting and formatting:
  ```bash
  npm run lint
  ```

## 7) CI

Two GitHub Actions are included:

- CI - Tests: runs manually (should be triggered [here](https://github.com/enniogonzalez/apply-digital-test/actions/workflows/test.yml)).
- CI - Lint: runs manually (should be triggered [here](https://github.com/enniogonzalez/apply-digital-test/actions/workflows/lint.yml)).
