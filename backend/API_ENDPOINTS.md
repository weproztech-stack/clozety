# Clozety API Endpoints Reference

Base URL: `http://localhost:5000/api`

> 🔐 **Protected** = Requires `Authorization: Bearer <token>` header
> 👑 **Admin** = Requires admin role

---

## 🔐 Auth — `/api/auth`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| POST | `/auth/register` | Public | `{ name, email, password }` | Register new user |
| POST | `/auth/login` | Public | `{ email, password }` | Login, returns JWT token |
| GET | `/auth/me` | 🔐 Protected | — | Get logged-in user profile |

---

## 👤 Admin — `/api/admin`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| GET | `/admin/users` | 👑 Admin | — | Get all users |
| GET | `/admin/users/:id` | 👑 Admin | — | Get user by ID |
| PUT | `/admin/users/:id/role` | 👑 Admin | `{ role }` | Update user role (`user` / `admin`) |
| DELETE | `/admin/users/:id` | 👑 Admin | — | Delete a user |

---

## 📦 Products — `/api/products`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| GET | `/products` | Public | — | Get all products |
| GET | `/products/:id` | Public | — | Get single product |
| POST | `/products` | 👑 Admin | `{ name, price, sku, ... }` | Create product |
| PUT | `/products/:id` | 👑 Admin | product fields | Update product |
| DELETE | `/products/:id` | 👑 Admin | — | Delete product |

---

## 🛒 Cart — `/api/cart`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| GET | `/cart` | 🔐 Protected | — | Get current user's cart |
| POST | `/cart` | 🔐 Protected | `{ productId, quantity }` | Add item to cart |
| PUT | `/cart/:productId` | 🔐 Protected | `{ quantity }` | Update item quantity |
| DELETE | `/cart` | 🔐 Protected | — | Clear entire cart |
| DELETE | `/cart/:productId` | 🔐 Protected | — | Remove single item |

---

## 📋 Orders — `/api/orders` _(coming soon)_

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/orders` | 🔐 Protected | Place an order from cart |
| GET | `/orders/my` | 🔐 Protected | Get current user's orders |
| GET | `/orders/:id` | 🔐 Protected | Get order details |
| GET | `/orders` | 👑 Admin | Get all orders |
| PUT | `/orders/:id/status` | 👑 Admin | Update order status |

---

## 👤 User Profile — `/api/users` _(coming soon)_

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| PUT | `/users/me` | 🔐 Protected | `{ name, avatar, addresses }` | Update profile |
| PUT | `/users/me/password` | 🔐 Protected | `{ oldPassword, newPassword }` | Change password |
