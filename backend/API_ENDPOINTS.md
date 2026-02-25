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

## 📋 Orders — `/api/orders`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| POST | `/orders` | 🔐 Protected | `{ shippingAddress }` | Place order from cart |
| GET | `/orders/my` | 🔐 Protected | — | Get my orders |
| GET | `/orders/:id` | 🔐 Protected | — | Get order details (owner or admin) |
| PUT | `/orders/:id/cancel` | 🔐 Protected | — | Cancel order (pending only) |
| GET | `/orders` | 👑 Admin | — | Get all orders |
| PUT | `/orders/:id/status` | 👑 Admin | `{ orderStatus, paymentStatus }` | Update order status |

---

## 👤 User Profile — `/api/users`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| PUT | `/users/me` | 🔐 Protected | `{ name, avatar, addresses }` | Update profile |
| PUT | `/users/me/password` | 🔐 Protected | `{ oldPassword, newPassword }` | Change password |

---

## ??? Categories � `/api/categories`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| GET | `/categories` | Public | � | Get all active categories |
| GET | `/categories/:id` | Public | � | Get single category |
| POST | `/categories` | ?? Admin | `{ name, description }` | Create category |
| PUT | `/categories/:id` | ?? Admin | `{ name, description, status }` | Update category |
| DELETE | `/categories/:id` | ?? Admin | � | Delete category |

---

## ??? Product Images � `/api/products/:productId/images`

| Method | Endpoint | Access | Body | Description |
|--------|----------|--------|------|-------------|
| GET | `/products/:productId/images` | Public | � | Get all images for a product |
| POST | `/products/:productId/images` | ?? Admin | form-data: images[] | Upload up to 5 images |
| PUT | `/products/:productId/images/:imageId/primary` | ?? Admin | � | Set image as primary |
| DELETE | `/products/:productId/images/:imageId` | ?? Admin | � | Delete image (Cloudinary + DB) |
