# Velore Frontend — API Wiring Report

Date: 2026-05-07  
Frontend: Vite + React  
Backend base: `http://localhost:3000/api/v1`

## 1) Environment setup

- **`.env.example`**: present and updated
  - `VITE_API_URL=http://localhost:3000/api/v1`
  - `VITE_STRIPE_PUBLISHABLE_KEY=`
- **Local `.env`**: created for local development (must not be committed)
  - `VITE_API_URL=http://localhost:3000/api/v1`
  - `VITE_STRIPE_PUBLISHABLE_KEY=`
- **Git ignore**:
  - `.gitignore` already ignores `.env`, `.env.local`, `.env.*.local`

## 2) API base URL

- **Source of truth**: `import.meta.env.VITE_API_URL`
- **Fallback**: `http://localhost:3000/api/v1`

## 3) API client behavior

File: `src/shared/services/apiClient.js`

- **Axios baseURL**: uses `VITE_API_URL` with localhost fallback.
- **Response unwrapping**: interceptor returns `response.data` (backend envelope).
- **Token injection**:
  - Customer token key: `token`
  - Admin token key: `admin_token`
  - Admin API routes (e.g. `/admin/*`) send **admin token only**
  - Storefront routes send **customer token only**
- **Error normalization**:
  - All rejected requests return a small normalized error object via `extractApiError()` preserving backend `message` when present.
  - Network/timeout errors produce human-readable messages.
- **401/403 handling**:
  - Clears **only the relevant token** (admin vs customer).
  - Redirects to `/admin/login` or `/login` accordingly.
  - Does not log tokens.

Helper module: `src/shared/services/apiHelpers.js`

## 4) Auth wiring status

Endpoints used:
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `GET /auth/profile` (best-effort; shows readable error if missing/unauthorized)

Key behaviors:
- Login/register treat responses as backend envelope `{ success, message, data }`.
- Customer token stored under **localStorage `token`** (no admin collisions).
- Removed forced `window.location.href` reload from customer login flow.
- Guest cart merge happens **once** (in `authService.login`), best-effort.
- UI shows backend error messages via `extractApiError`.

## 5) Storefront flows fixed / stabilized

### Home (`/`)
- Uses backend:
  - `GET /products` (new collection)
  - `GET /reviews/approved`
  - `GET /blogs`
- Added explicit **loading**, **error**, **empty** states + **Retry** actions.

### Shop (`/shop`)
- Uses backend:
  - `GET /products`
  - `GET /products/search` (when `?search=` exists and length ≥ 2)
  - `GET /categories` (if available; used to avoid hardcoded IDs)
  - `GET /brands` (if available; used to avoid hardcoded brand options)
- Removed hardcoded category IDs (previously `1/2/4`).
- Normalizes backend product shape to card-friendly props (`image`, `colors`, numeric `price`) to avoid crashes.

### Search (Navbar)
- Uses backend:
  - `GET /products/search?q=...` (debounced)
- Distinguishes:
  - **No results** vs **API error** (shows readable failure message).

### Product detail (`/product/:id`)
- Uses backend:
  - `GET /products/:id`
  - `POST /cart/add` (when authenticated)
- Removed “fetch-all products fallback” that could hide backend errors.
- Replaced `alert()` with non-blocking in-page notices.
- Added error + retry UI.

### Cart (sidebar)
- Uses backend:
  - `GET /cart`
  - `POST /cart/add`
  - `PUT /cart/update`
  - `DELETE /cart/remove/:id`
  - `DELETE /cart/clear`
- Standardized parsing to backend envelope (`result.data.cart_items`).
- Guest cart stays in `localStorage.guestCart`.

### Favorites (`/favorite`)
- Uses backend:
  - `GET /favorites`
  - `POST /favorites/:productId`
  - `DELETE /favorites/:productId`
- Added visible error banner + retry (previously silent failures).

### Checkout (`/checkout`, `/payment-success`)
- Uses backend:
  - `POST /orders/checkout`
  - `GET /orders/:id` (best-effort verification in `PaymentSuccess` when `orderId` exists)
- Removed placeholder Stripe payment-link redirect to avoid fake “card payment success”.
- `PaymentSuccess` no longer claims an order is confirmed based only on URL params.

### Blogs (`/blogs`, `/blogs/:id`)
- Uses backend:
  - `GET /blogs`
  - `GET /blogs/:id`
- Added error + retry states (previously swallowed errors).

### Profile (`/profile` + sidebar)
- Uses backend (best-effort):
  - `GET /auth/profile`
  - `GET /orders`
  - `GET /loyalty/points`
- If any endpoint is missing, UI shows a readable error instead of crashing.

## 6) Routes normalized

File: `src/App.jsx`

Added aliases:
- `/register` → `/signup`
- `/favorites` → `/favorite`
- `/products` → `/shop`

Added:
- `*` → 404 “Page not found”

## 7) Backend endpoints used (summary)

- Auth: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/profile`
- Products: `/products`, `/products/:id`, `/products/search`
- Meta: `/categories`, `/brands`
- Reviews: `/reviews/approved`
- Blogs: `/blogs`, `/blogs/:id`
- Cart: `/cart`, `/cart/add`, `/cart/update`, `/cart/remove/:id`, `/cart/clear`
- Favorites: `/favorites`, `/favorites/:id`
- Orders: `/orders/checkout`, `/orders`, `/orders/:id`
- Other (best-effort): `/loyalty/points`, `/contact`

## 8) Backend/API gaps found (not faked)

- **Card payments**: frontend requires backend to return a `checkout_url` / `payment_url` (or equivalent) from `POST /orders/checkout` for `payment_method=mastercard`. If not provided, frontend shows backend `message` (or “Card payments are not configured yet.”).
- **Profile / loyalty**: `GET /auth/profile` and `GET /loyalty/points` are treated as optional; failures are shown to the user.
- **Contact**: `POST /contact` is attempted; if backend doesn’t implement it, user sees the backend error message.

## 9) Build result

Command: `npm run build`  
Result: **PASS** (Vite build succeeded).  
Note: Vite warns about a large chunk size; no functional impact, not addressed in this stabilization pass.

## 10) Lint result

Command: `npm run lint`  
Result: **PASS with warnings** (no errors).  
Warnings remaining are `react-hooks/exhaustive-deps` in a few files.

## 11) Test result

- No `test` script present in `package.json` (not run).

## 12) Files changed

- `.env.example`
- `eslint.config.js`
- `src/App.jsx`
- `src/components/profile/ProfileSidebar.jsx`
- `src/features/admin/auth/AdminAuthContext.jsx`
- `src/features/auth/ForgotPassword.jsx`
- `src/features/auth/Login.jsx`
- `src/features/auth/Signup.jsx`
- `src/features/auth/authService.js`
- `src/features/blog/BlogPost.jsx`
- `src/features/blog/Blogs.jsx`
- `src/features/cart/CartSidebar.jsx`
- `src/features/checkout/Checkout.jsx`
- `src/features/checkout/PaymentSuccess.jsx`
- `src/features/checkout/StripeCheckout.jsx`
- `src/features/favorite/Favorite.jsx`
- `src/features/home/Home.jsx`
- `src/features/product/ProductDetail.jsx`
- `src/features/shop/Shop.jsx`
- `src/features/shop/shopService.js`
- `src/shared/components/eyewear/EyewearCard.jsx`
- `src/shared/components/eyewear/Testimonials.jsx`
- `src/shared/components/layout/Navbar.jsx`
- `src/shared/components/ui/ContactModal.jsx`
- `src/shared/contexts/FavoritesContext.jsx`
- `src/shared/services/apiClient.js`
- `src/shared/services/apiHelpers.js` (new)

## 13) How to run frontend locally

From `frontend/`:

- Install: `npm install`
- Start dev server: `npm run dev` (default: `http://localhost:5173`)
- Build: `npm run build`
- Lint: `npm run lint`

## 14) What should not be committed

- **Never commit** `frontend/.env` (local-only).
- Do not put backend secrets/credentials in Vite env vars.

