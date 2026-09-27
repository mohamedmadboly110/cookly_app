# Cookly API

A RESTful backend API for **Cookly**, a recipe management platform built with **Node.js, Express.js, and MongoDB**.

The project provides authentication, recipe management, categories, reviews, authorization, error handling, and a Dockerized development environment with MongoDB.

---

## 📌 Overview

Cookly API is designed with a modular backend architecture that separates:

* Routes
* Controllers
* Models
* Middlewares
* Configuration
* Utility functions

The API is built to provide a clean foundation for a recipe-based application while applying common backend development practices such as authentication, authorization, centralized error handling, and database integration.

---

## 🚀 Features

### Authentication & Authorization

* User authentication
* JWT-based authorization
* Protected API routes
* Role/ownership-based access control
* Password protection using hashing

### Recipes

* Create recipes
* Read recipes
* Update recipes
* Delete recipes
* Manage recipe-related data

### Categories

* Create and manage recipe categories
* Associate recipes with categories

### Reviews

* Create reviews
* Retrieve reviews
* Manage review data

### Backend Infrastructure

* Express.js REST API
* MongoDB with Mongoose
* Centralized error handling
* Async request handling
* Environment-based configuration
* Security middleware
* Docker and Docker Compose support

---

# 🛠️ Tech Stack

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Node.js        | Backend runtime                |
| Express.js     | REST API framework             |
| MongoDB        | Database                       |
| Mongoose       | MongoDB ODM                    |
| JWT            | Authentication & authorization |
| bcryptjs       | Password hashing               |
| Docker         | Application containerization   |
| Docker Compose | Multi-container environment    |

---

# 🏗️ Project Architecture

The application follows a layered backend architecture:

```text
Client
   │
   ▼
Routes
   │
   ▼
Middlewares
   │
   ▼
Controllers
   │
   ▼
Models / Mongoose
   │
   ▼
MongoDB
```

### Request Flow

A typical API request follows this flow:

```text
HTTP Request
     │
     ▼
Route
     │
     ▼
Middleware
(Authentication / Validation / Authorization)
     │
     ▼
Controller
     │
     ▼
Mongoose Model
     │
     ▼
MongoDB
     │
     ▼
HTTP Response
```

---

# 📁 Project Structure

```text
cookly-api/
│
├── config/
│   └── ...
│
├── controllers/
│   └── ...
│
├── middlewares/
│   └── ...
│
├── models/
│   └── ...
│
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── recipeRoutes.js
│   └── reviewRoutes.js
│
├── utils/
│   ├── asyncHandler.js
│   └── ErrorResponse.js
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package-lock.json
├── package.json
└── server.js
```

> `node_modules` is intentionally excluded from the repository and Docker build context.

---

# 👤 User Workflow

The main application workflow can be represented as:

```text
User
 │
 ├── Register / Login
 │       │
 │       ▼
 │   Authentication
 │       │
 │       ▼
 │   JWT Token
 │
 └── Authenticated Requests
         │
         ├── Browse Recipes
         │
         ├── Manage Recipes
         │
         ├── Browse Categories
         │
         └── Create / Manage Reviews
```

### Authentication Flow

```text
Register
   │
   ▼
User Account Created
   │
   ▼
Login
   │
   ▼
JWT Token
   │
   ▼
Protected Requests
```

The JWT token is then used when accessing protected endpoints.

---

# 🐳 Running with Docker

Docker Compose is the recommended way to run the complete application because it starts both:

* Cookly API
* MongoDB

The Compose configuration creates two services:

```text
┌─────────────────────────┐
│       Cookly API        │
│       Port: 3000        │
└────────────┬────────────┘
             │
             │ MongoDB
             ▼
┌─────────────────────────┐
│        MongoDB          │
│       Port: 27017       │
└─────────────────────────┘
```

## 1. Clone the repository

```bash
git clone https://github.com/mohamedmadboly110/cookly_app.git
cd cookly_app
```

## 2. Start the containers

```bash
docker compose up --build
```

This will:

1. Build the Cookly API image.
2. Start the Node.js application.
3. Start a MongoDB container.
4. Create a persistent MongoDB volume.
5. Connect the API container to MongoDB through the Docker Compose service name.

---

## 3. Access the API

Once the containers are running:

```text
http://localhost:3000
```

The API container exposes port `3000`.

---

## 4. Stop the application

```bash
docker compose down
```

The MongoDB data remains stored in the Docker volume.

To remove the containers **and the MongoDB volume**:

```bash
docker compose down -v
```

> `-v` removes the persistent database volume, so use it only when you intentionally want to delete the MongoDB data.

---

# 🔧 Docker Configuration

The project uses the following Dockerfile configuration:

```dockerfile
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker image

The project uses:

```text
node:lts-alpine
```

which provides a lightweight Node.js runtime based on Alpine Linux.

### Application port

The container exposes:

```text
3000
```

Docker Compose maps:

```text
localhost:3000 → container:3000
```

---

# 🗄️ MongoDB with Docker Compose

The Docker Compose environment runs MongoDB as a separate service:

```yaml
mongo:
  image: mongo:latest
  container_name: cookly_mongodb
  restart: always
  ports:
    - "27017:27017"
  volumes:
    - mongo_data:/data/db
```

The API connects to MongoDB using the Compose service name:

```text
mongodb://mongo:27017/cookly_db
```

### Why `mongo` instead of `localhost`?

Inside Docker Compose, the API container and MongoDB container are separate containers.

Therefore:

```text
localhost
```

inside the API container refers to the API container itself.

The service name:

```text
mongo
```

is used to communicate with the MongoDB container.

---

# 🔐 Environment Variables

For local development, create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
MONGO_URI=your_mongo_localhost
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Environment Variables

| Variable     | Description                        |
| ------------ | ---------------------------------- |
| `PORT`       | Port used by the API               |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret used for JWT authentication |
| `NODE_ENV`   | Application environment            |

### Important

Never commit your real `.env` file to GitHub.

Use:

```text
.env.example
```

to document the required environment variables.

---

# 💻 Running Without Docker

If you want to run the API directly on your machine, make sure MongoDB is running locally.

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create:

```text
.env
```

Example:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/cookly_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Start the server

If the project contains the development script:

```bash
npm run dev
```

For production:

```bash
npm start
```

The exact available npm scripts should match the project's `package.json`.

---

# 🌐 API Routes

The project is organized around the following route modules:

```text
/api/auth
/api/categories
/api/recipes
/api/reviews
```

### Authentication

```text
/api/auth
```

Responsible for authentication-related operations.

### Categories

```text
/api/categories
```

Responsible for recipe category operations.

### Recipes

```text
/api/recipes
```

Responsible for recipe management.

### Reviews

```text
/api/reviews
```

Responsible for review-related operations.

> For the complete endpoint list, request methods, authentication requirements, request bodies, and response examples, refer to the route and controller implementations.

---

# 🛡️ Error Handling

The project includes reusable utilities for handling asynchronous operations and API errors.

```text
utils/
├── asyncHandler.js
└── ErrorResponse.js
```

### `asyncHandler.js`

Used to simplify handling asynchronous Express controllers and forward errors to the application's error-handling flow.

### `ErrorResponse.js`

Provides a reusable error-response structure for API errors.

This keeps error handling more consistent across controllers.

---

# 🔒 Security Considerations

The application uses environment variables for sensitive configuration such as:

```text
JWT_SECRET
MONGO_URI
```

Sensitive files are excluded from Docker builds and Git through:

```text
.dockerignore
.gitignore
```

The Docker ignore configuration excludes:

```text
node_modules
npm-debug.log
.env
.git
.gitignore
```

This helps prevent unnecessary files and environment secrets from being included in the Docker image.

---

# 🧪 API Testing

The API can be tested using tools such as:

* Postman
* Insomnia
* cURL

Example:

```bash
curl http://localhost:3000
```

For protected endpoints, include the JWT token in the request authorization header:

```text
Authorization: Bearer <your_token>
```

---

# 🔄 Development Workflow

A typical development workflow is:

```text
1. Clone repository
        │
        ▼
2. Configure environment
        │
        ▼
3. Start MongoDB
        │
        ▼
4. Start API
        │
        ▼
5. Test endpoints
        │
        ▼
6. Modify controllers / models / routes
        │
        ▼
7. Test again
        │
        ▼
8. Commit changes
        │
        ▼
9. Push to GitHub
```

With Docker:

```text
docker compose up --build
```

is enough to start the application and database together.

---

# 📦 Docker Services

| Service | Container        |  Port | Purpose          |
| ------- | ---------------- | ----: | ---------------- |
| `app`   | `cookly_api`     |  3000 | Cookly REST API  |
| `mongo` | `cookly_mongodb` | 27017 | MongoDB database |

MongoDB uses a named volume:

```text
mongo_data
```

to persist database data.

---

# 📜 License

This project is developed as a backend development project and portfolio application.

---

# 👨‍💻 Author

**Mohamed Madboly**

Backend Developer

GitHub:
https://github.com/mohamedmadboly110

Project Repository:
https://github.com/mohamedmadboly110/cookly_app
