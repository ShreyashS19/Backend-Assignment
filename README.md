#  TaskFlow Backend – REST API

A **production-ready REST API** built using **Spring Boot 3** for managing tasks with **JWT Authentication** and **Role-Based Access Control**.


## ✨ Features

- ✅ User Registration & Login with JWT (24-hour token expiration)
- ✅ Role-Based Access (USER / ADMIN)
- ✅ Full CRUD Operations for Tasks
- ✅ BCrypt Password Hashing (10 rounds)
- ✅ Input Validation & Error Handling
- ✅ Secure JWT Filter via Spring Security
- ✅ MySQL Database with Optimized Schema
- ✅ Swagger / OpenAPI 3.0 Documentation
- ✅ SQL Injection Prevention (Parameterized Queries)
- ✅ API Versioning (`/api/v1`)

---

## 🛠️ Tech Stack

**Backend:** Java 22, Spring Boot 3.2.0, Spring Security, JWT  
**Database:** MySQL 8.0, JPA / Hibernate  
**Tools:** Maven, Lombok, Swagger  
**Auth:** JWT (HMAC-SHA256)

---

## 📦 Prerequisites

Install before running:

- ☕ Java 22 or higher  
- 🧩 Maven 3.8+  
- 🐬 MySQL 8.0+  
- 🌐 Git

---

## ⚡ Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/taskflow-backend.git
cd taskflow-backend
````

### 2️⃣ Create MySQL Database

```sql
CREATE DATABASE taskflow;
```

### 3️⃣ Configure Database

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskflow
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your-256-bit-secret-key-min-32-characters-long
jwt.expiration=86400000
server.port=8080
```

### 4️⃣ Build Project

```bash
mvn clean install
```

### 5️⃣ Run Application

```bash
mvn spring-boot:run
```

Backend available at **[http://localhost:8080](http://localhost:8080)**

---

## 📚 API Documentation

Access Swagger UI → **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

---

## 🔐 Authentication Flow

1. **Register/Login** → Get JWT Token
2. **Use Token** in every protected request →
   `Authorization: Bearer <your_token>`
3. Token expires after 24 hours

---

## 📋 API Endpoints Reference

### 🟢 Public (No Token)

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/v1/auth/register` | Register new user   |
| POST   | `/api/v1/auth/login`    | Login existing user |

### 🔒 Protected (JWT Required)

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| GET    | `/api/v1/tasks`      | Get user’s tasks |
| POST   | `/api/v1/tasks`      | Create new task  |
| GET    | `/api/v1/tasks/{id}` | Get single task  |
| PUT    | `/api/v1/tasks/{id}` | Update task      |
| DELETE | `/api/v1/tasks/{id}` | Delete task      |

### 🛡️ Admin (ADMIN Role)

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/v1/admin/tasks` | Get all users’ tasks |

---

## 🧪 Example Requests

### Register

```bash
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

### Login

```bash
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task

```bash
POST /api/v1/tasks
Header: Authorization: Bearer <token>
{
  "title": "My Task",
  "description": "Complete project",
  "completed": false
}
```

### Get All Tasks

```bash
GET /api/v1/tasks
Header: Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(1000),
  completed BOOLEAN DEFAULT FALSE,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🏗️ Project Structure

```
taskflow-backend/
├── src/
│   └── main/java/com/taskflow/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── security/
│       ├── exception/
│       └── util/
│
├── resources/application.properties
├── pom.xml
├── README.md
├── SCALABILITY.md
├── postman_collection.json
└── .gitignore
```

---

## 🔒 Security Overview

| Feature                  | Implementation                  |
| ------------------------ | ------------------------------- |
| Passwords                | BCrypt (10 rounds)              |
| Tokens                   | JWT (HMAC-SHA256, 24 hr expiry) |
| Input Validation         | Spring Validation Annotations   |
| SQL Injection Prevention | JPA Parameterized Queries       |
| Role-Based Access        | Spring Security PreAuthorize    |

---

## 🧰 Troubleshooting

| Issue                    | Fix                         |                               |
| ------------------------ | --------------------------- | ----------------------------- |
| Port 8080 already in use | `netstat -ano               | findstr :8080` → kill process |
| MySQL Connection Error   | Check credentials & DB name |                               |
| Invalid Token            | Token expired → login again |                               |
| Email already registered | Use different email         |                               |

---

## 🧪 Testing With Postman

1. Import `postman_collection.json`
2. Run `Register → Login → Copy Token`
3. Paste token into Authorization header
4. Test Task endpoints

---

## ⚙️ Scalability

See [`SCALABILITY.md`](./SCALABILITY.md) for:

* Load Balancing (Nginx)
* Caching (Redis)
* DB Optimization
* Microservices Architecture
* Cost & Performance Benchmarks

---

## 🧠 Next Steps

* Test all CRUD endpoints
* Verify JWT authentication
* Connect frontend (`http://localhost:8081`)
* Deploy to cloud (optional)

---



## ✅ Deliverables Summary

| #   | Deliverable               | Description                                                                    | Status      |
| --- | ------------------------- | ------------------------------------------------------------------------------ | ----------- |
| 1️⃣ | **Backend Project Setup** | Spring Boot 3 project with modular layers (Controller → Service → Repository). | ✅ Completed |
| 2️⃣ | **Working APIs**          | Authentication & CRUD APIs for Task management.                                | ✅ Completed |
| 3️⃣ | **Frontend Integration**  | Basic React UI connected to backend using REST APIs.                           | ✅ Completed |
| 4️⃣ | **API Documentation**     | Implemented using Swagger UI & Postman Collection.                             | ✅ Completed |
| 5️⃣ | **Scalability Note**      | Cloud-ready architecture with modular design & stateless JWT authentication.   | ✅ Completed |

---

## 🧩 Deliverable 5: Scalability & Deployment Readiness

The **TaskFlow Backend** is designed for scalability, modularity, and easy deployment.
While currently monolithic, it already supports horizontal scaling, cloud deployment, and secure authentication.

### ⚙️ Current Scalable Design Features

* 🧱 **Layered Architecture:** Clean separation of Controller, Service, and Repository layers for independent scaling.
* 🔐 **Stateless JWT Authentication:** Enables horizontal scaling without session sharing.
* 💾 **JPA Integration:** Easily switch from H2 to MySQL/PostgreSQL for production use.
* 🌐 **Cloud-Ready Configuration:** Configurable via environment variables for smooth deployment to Google Cloud or AWS.
* 📚 **Swagger Documentation:** Enables easy integration and auto-documentation for frontend and future microservices.

### 🚀 Future Enhancements

* Implement caching with **Redis**.
* Enable **load balancing** using Nginx or Cloud Load Balancer.
* Add **Docker containerization** for consistent deployments.

---

## 🧾 Evaluation Criteria (Self-Checklist)

| Criteria                       | Description                                                          | Status      |
| ------------------------------ | -------------------------------------------------------------------- | ----------- |
| ✅ **API Design**               | RESTful endpoints, clean modular architecture, correct status codes. | ✅ Completed |
| ✅ **Database Schema**          | JPA entities with proper relationships and schema auto-generation.   | ✅ Completed |
| ✅ **Security Practices**       | JWT authentication, BCrypt password hashing, input validation.       | ✅ Completed |
| ✅ **Frontend Integration**     | Functional React frontend connected to backend APIs.                 | ✅ Completed |
| ✅ **Scalability & Deployment** | Stateless, modular, and cloud-ready backend design.                  | ✅ Completed |

---

## 📎 Submission Checklist

* [x] Backend hosted on GitHub with README.md
* [x] Working authentication & CRUD APIs
* [x] Functional frontend integration
* [x] API documentation (Swagger & Postman)
* [x] Scalability note and evaluation summary


## 🏁 Conclusion

**TaskFlow Backend** delivers:

* Secure JWT Auth 🔐
* Scalable Architecture ⚙️
* Clean, Documented REST API 🧩
* Production-ready Code 🚀

