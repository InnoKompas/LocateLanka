# LocateLanka API – Postman Testing Guide

This guide will help you test the LocateLanka authentication and GN Division APIs using Postman.

---

## Prerequisites
- Node.js and pnpm installed
- MongoDB running
- Server running (`pnpm dev` or `pnpm dev:watch` in `/server`)
- [Postman](https://www.postman.com/downloads/) installed

---

## Environment Setup
1. Copy `.env.example` to `.env` and fill in secrets and MongoDB URI.
2. Start the server:
   ```sh
   pnpm dev
   ```
3. Base URL: `http://localhost:5000`

---

## Authentication API Endpoints

### 1. Register
- **POST** `/auth/register`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response:** User object (no password)

### 2. Login
- **POST** `/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `accessToken` (in response JSON)
  - `refreshToken` (set as HTTP-only cookie)

### 3. Refresh Token
- **POST** `/auth/refresh-token`
- **No body required**
- **Send request with cookies** (Postman: enable "Send Cookies")
- **Response:** New `accessToken` (refreshToken cookie is updated)

### 4. Logout
- **POST** `/auth/logout`
- **No body required**
- **Send request with cookies**
- **Response:** Logout message

### 5. Change Password (Protected)
- **POST** `/auth/change-password`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
- **Body (JSON):**
  ```json
  {
    "oldPassword": "yourpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response:** Success message

---

## GN Division API (Protected)
- **All endpoints require:**
  - `x-api-key: <your_api_key>` (from your `.env`)
  - `Authorization: Bearer <accessToken>`

Example:
- **GET** `/gn-division/list`
- **Headers:**
  - `x-api-key: <your_api_key>`
  - `Authorization: Bearer <accessToken>`

---

## Postman Tips
- Use the "Cookies" tab to view/set cookies for refresh token flows.
- Use "Pre-request Script" to programmatically set tokens if chaining requests.
- Save your `accessToken` as an environment variable for easy reuse.

---

## Troubleshooting
- If you get 401 errors, ensure you:
  - Use the latest `accessToken` in the `Authorization` header
  - Send cookies for refresh/logout
  - Use the correct API key for protected endpoints
- Check server logs for error details.

---

## Example Postman Collection
You can create a Postman collection with the above endpoints and variables for `accessToken`, `refreshToken`, and `x-api-key` for easier testing.

---

**Happy Testing!**
