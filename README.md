# Cookly API 

A secure, high-performance RESTful API designed to manage recipe datasets, user profiles, and authentication workflows. Built with Node.js, Express, and MongoDB, this application integrates security protocols, role-based access control, and request sanitization to defend against common web application vulnerabilities.

---

## Executive Summary

The **Cookly API** provides a backend infrastructure for modern web and mobile application clients. The primary objective of this secure release (v2.0.0) is to provide strict data validation, rate-limiting measures, secure password storage, and stateless token-based authorization compliant with OWASP security practices.

---

## Key Features

* **Authentication & Authorization:** Stateful user signup/login using JSON Web Tokens (JWT) and encrypted password storage via `bcryptjs`.
* **Security Middleware Integration:**
  * **Helmet**: Restructures HTTP response headers to mitigate XSS, clickjacking, and MIME-sniffing attacks.
  * **Data Sanitization**: Protects against NoSQL query injection attacks.
  * **Rate Limiting**: Restricts repetitive network requests to prevent brute-force attacks on sensitive auth routes.
* **Database Architecture:** Structured document schemas and validation models enforced through Mongoose ORM.
* **Environment Separation:** Secure configuration handling for development, testing, and production states using centralized environment variables.

---

## Tech Stack

* **Runtime Environment:** Node.js (v18.x or higher)
* **Web Framework:** Express.js (v4.x)
* **Database Management:** MongoDB / Mongoose ORM
* **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
* **Security Libraries:** `helmet`, `express-rate-limit`, `express-mongo-sanitize`

---

## System Architecture

```text
cookly_app_secure/
├── config/
│   └── db.js                 # Database connection config
├── controllers/
│   ├── authController.js     # Authentication and session logic
│   ├── recipeController.js   # Recipe resource CRUD handlers
│   └── userController.js     # User profile management handlers
├── middleware/
│   ├── authMiddleware.js     # JWT verification and role checks
│   ├── errorMiddleware.js    # Global error response handler
│   └── securityMiddleware.js # Rate limiting and request sanitization
├── models/
│   ├── Recipe.js             # Recipe schema definition
│   └── User.js               # User schema definition
├── routes/
│   ├── authRoutes.js         # Endpoint definitions for auth
│   ├── recipeRoutes.js       # Endpoint definitions for recipes
│   └── userRoutes.js         # Endpoint definitions for users
├── .env.example              # Environment variable template
├── package.json              # Project dependencies and scripts
└── server.js                 # Express application entry point
