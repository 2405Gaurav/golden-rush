# 🍬 Sweet Shop Management System (SSMS)

<div align="center">

**A full-stack TDD Kata project showcasing modern web development practices**

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-blue?style=for-the-badge)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge)](https://www.postgresql.org/)

---

<div align="center" style="border: 3px solid #ff6b6b; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 20px 0;">


```

</div>

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Design Process](#-design-process)
- [My AI Usage](#-my-ai-usage)
- [Development Workflow](#-development-workflow)
- [Contributing](#-contributing)

---

## 🎯 Overview

The **Sweet Shop Management System** is a comprehensive full-stack application built as a Test-Driven Development (TDD) kata. This project demonstrates modern software engineering practices including RESTful API design, JWT authentication, database management, responsive frontend development, and comprehensive testing strategies.

The system allows users to:
- **Browse and search** through a catalog of sweets
- **Purchase** sweets with real-time inventory management
- **Manage inventory** (Admin users can add, update, delete, and restock items)
- **Track orders** and view analytics

This project was developed following TDD principles, ensuring high code quality and test coverage throughout the development lifecycle.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based token authentication
- Role-based access control (Admin/User)
- Secure password handling

### 🍭 Sweet Management
- **View all sweets** with pagination and filtering
- **Search functionality** by name, category, or price range
- **Purchase sweets** with automatic inventory deduction
- **Admin features:**
  - Add new sweets
  - Update existing sweets
  - Delete sweets
  - Restock inventory

### 📊 Dashboard & Analytics
- Real-time inventory statistics
- Order tracking
- Visual analytics and charts
- Responsive design for all devices

### 🎨 User Interface
- Modern neobrutalist design aesthetic
- Fully responsive (mobile, tablet, desktop)
- Dark/light theme support
- Intuitive navigation and user experience

---

## 🛠 Technology Stack

### Backend
- **Framework:** Spring Boot 3.4.1
- **Language:** Java 21
- **Database:** PostgreSQL (Neon)
- **ORM:** Spring Data JPA
- **Security:** Spring Security + JWT (JJWT 0.12.6)
- **Migration:** Flyway
- **Testing:** JUnit 5, Testcontainers, Spring Security Test

### Frontend
- **Framework:** Next.js 15.5.9 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** Radix UI
- **Form Handling:** React Hook Form + Zod
- **State Management:** React Context API
- **Charts:** Recharts

### DevOps & Tools
- **Version Control:** Git
- **Package Management:** Maven (Backend), npm/pnpm (Frontend)
- **Deployment:** Railway (Backend), Vercel (Frontend)
- **Design:** Figma

---

## 📸 Screenshots

### Landing Page
![Landing Page](screenshot/Screenshot%202025-12-13%20173529.png)
*Beautiful landing page showcasing the neobrutalist design with hero section and featured sweets*

### Sweets Catalog
![Sweets Catalog](screenshot/Screenshot%202025-12-13%20173601.png)
*Comprehensive sweets catalog with search and filter functionality*

### Admin Dashboard
![Admin Dashboard](screenshot/Screenshot%202025-12-13%20173615.png)
*Admin dashboard with inventory management and analytics*

### Shopping Cart
![Shopping Cart](screenshot/Screenshot%202025-12-13%20173738.png)
*Shopping cart interface with purchase functionality*

---

## 📁 Project Structure

```
sweetshop-management-system/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/sweetshop/
│   │   │   │   ├── auth/       # Authentication & Authorization
│   │   │   │   ├── sweets/     # Sweet Management Logic
│   │   │   │   ├── config/     # Configuration Classes
│   │   │   │   └── common/     # Shared Utilities
│   │   │   └── resources/
│   │   │       ├── db/migration/  # Flyway Migrations
│   │   │       └── application.yml
│   │   └── test/               # Test Suite
│   │       └── java/com/sweetshop/
│   │           ├── api/        # Integration Tests
│   │           ├── auth/       # Auth Tests
│   │           └── sweets/    # Sweet Management Tests
│   ├── pom.xml
│   └── Dockerfile
│
├── app/                        # Next.js Frontend (App Router)
│   ├── admin/                  # Admin Pages
│   ├── sweets/                 # Sweet Pages
│   ├── cart/                   # Cart Page
│   ├── orders/                 # Orders Page
│   ├── analytics/              # Analytics Page
│   └── layout.tsx
│
├── components/                 # React Components
│   ├── ui/                     # Reusable UI Components
│   ├── landing-page.tsx
│   ├── sweet-card.tsx
│   └── ...
│
├── lib/                        # Utility Functions
│   ├── api.ts                  # API Client
│   └── utils.ts
│
├── public/                     # Static Assets
├── scripts/                    # Deployment Scripts
└── screenshot/                 # Screenshots
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 18+** and npm/pnpm ([Download](https://nodejs.org/))
- **PostgreSQL Database** (or use Neon - [Free Tier Available](https://neon.tech/))
- **Git** ([Download](https://git-scm.com/))

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweetshop-management-system
   ```

2. **Navigate to backend directory**
   ```bash
   cd backend
   ```

3. **Configure environment variables**
   
   Create a `.env` file or set environment variables (see `backend/ENV.example`):
   
   **Windows (PowerShell):**
   ```powershell
   $env:DATABASE_JDBC_URL="jdbc:postgresql://<YOUR-NEON-HOST>/neondb?sslmode=require&channelBinding=require"
   $env:DATABASE_USERNAME="neondb_owner"
   $env:DATABASE_PASSWORD="<YOUR_PASSWORD>"
   $env:JWT_SECRET_BASE64="<BASE64_32_BYTES_OR_MORE>"
   $env:CORS_ALLOWED_ORIGINS="http://localhost:3000"
   ```
   
   **Linux/Mac:**
   ```bash
   export DATABASE_JDBC_URL="jdbc:postgresql://<YOUR-NEON-HOST>/neondb?sslmode=require&channelBinding=require"
   export DATABASE_USERNAME="neondb_owner"
   export DATABASE_PASSWORD="<YOUR_PASSWORD>"
   export JWT_SECRET_BASE64="<BASE64_32_BYTES_OR_MORE>"
   export CORS_ALLOWED_ORIGINS="http://localhost:3000"
   ```
   
   **Generate JWT Secret (PowerShell):**
   ```powershell
   [Convert]::ToBase64String((1..32 | % {Get-Random -Max 256}))
   ```
   
   **Generate JWT Secret (Node.js):**
   ```javascript
   require('crypto').randomBytes(32).toString('base64')
   ```

4. **Run tests**
   ```bash
   # Windows
   .\mvnw.cmd test
   
   # Linux/Mac
   ./mvnw test
   ```

5. **Start the backend server**
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run
   
   # Linux/Mac
   ./mvnw spring-boot:run
   ```

   The backend will be available at `http://localhost:8080`

   **Default Admin Credentials:**
   - Email: `admin@sweetshop.local`
   - Password: `admin123!`

### Frontend Setup

1. **Navigate to project root** (if not already there)
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at `http://localhost:3000`

### Running Both Services

**Windows (PowerShell):**
```powershell
.\scripts\run-all.ps1
```

**Linux/Mac:**
```bash
./scripts/run-all.sh
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

**Response:** Same as register

### Sweets Endpoints

All sweets endpoints require authentication (Bearer token in Authorization header).

#### Get All Sweets
```http
GET /api/sweets
Authorization: Bearer <token>
```

#### Search Sweets
```http
GET /api/sweets/search?name=chocolate&category=candies&minPrice=5&maxPrice=50
Authorization: Bearer <token>
```

**Query Parameters:**
- `name` (optional): Search by name (partial match)
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

#### Get Sweet by ID
```http
GET /api/sweets/{id}
Authorization: Bearer <token>
```

#### Create Sweet (Admin Only)
```http
POST /api/sweets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chocolate Truffles",
  "category": "chocolates",
  "price": 25.99,
  "quantity": 100
}
```

#### Update Sweet (Admin Only)
```http
PUT /api/sweets/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Chocolate Truffles",
  "category": "chocolates",
  "price": 29.99,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /api/sweets/{id}
Authorization: Bearer <token>
```

#### Purchase Sweet
```http
POST /api/sweets/{id}/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Restock Sweet (Admin Only)
```http
POST /api/sweets/{id}/restock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 50
}
```

---

## 🧪 Testing

This project follows **Test-Driven Development (TDD)** principles with comprehensive test coverage.

### Backend Tests

The backend includes:
- **Unit Tests:** Service layer, utility classes, JWT service
- **Integration Tests:** Controller tests with Spring Security
- **API Integration Tests:** End-to-end API tests using Testcontainers

**Run all backend tests:**
```bash
cd backend
.\mvnw.cmd test
```

**Test Structure:**
```
backend/src/test/java/com/sweetshop/
├── api/
│   ├── AuthAndSecurityIT.java      # Auth API integration tests
│   └── SweetsInventoryIT.java      # Sweets API integration tests
├── auth/
│   ├── AuthControllerTest.java     # Auth controller unit tests
│   ├── AuthServiceTest.java        # Auth service unit tests
│   ├── AuthServiceIntegrationTest.java
│   └── JwtServiceTest.java         # JWT service tests
└── sweets/
    ├── SweetsControllerTest.java   # Sweets controller tests
    ├── SweetsServiceTest.java      # Sweets service unit tests
    ├── SweetsServiceIntegrationTest.java
    └── SweetSpecificationsTest.java
```

**Test Coverage Highlights:**
- ✅ Authentication and authorization flows
- ✅ CRUD operations for sweets
- ✅ Search and filtering functionality
- ✅ Inventory management (purchase/restock)
- ✅ Error handling and validation
- ✅ Security configurations

### Frontend Tests

Frontend testing can be added using:
- Jest + React Testing Library
- Playwright for E2E tests

---

## 🚢 Deployment

### Live Application

<div align="center" style="border: 2px dashed #4ecdc4; padding: 15px; border-radius: 8px; background-color: #f0f8ff; margin: 15px 0;">

</div>

### Deployment Platforms

#### Backend (Railway)
- **Platform:** Railway
- **Database:** Neon PostgreSQL
- **Build:** Maven
- **Runtime:** Java 21

#### Frontend (Vercel)
- **Platform:** Vercel
- **Framework:** Next.js
- **Build:** Automatic on push to main branch

### Deployment Scripts

**Deploy Both Services (Railway):**
```powershell
# Windows
.\scripts\deploy-all-railway.ps1

# Linux/Mac
./scripts/deploy-all-railway.sh
```

**Deploy Separately:**
```powershell
# Backend
.\scripts\deploy-backend-railway.ps1

# Frontend
.\scripts\deploy-frontend-railway.ps1
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎨 Design Process

### Figma Design

The UI/UX design for this application was created using **Figma**, following modern design principles and the neobrutalist aesthetic. The design process included:

1. **Wireframing:** Initial layout and structure planning
2. **Visual Design:** Color schemes, typography, and component design
3. **Prototyping:** Interactive prototypes for user flows
4. **Design System:** Consistent component library and style guide

The neobrutalist design approach emphasizes:
- Bold, high-contrast colors
- Sharp, geometric shapes
- Thick borders and shadows
- Playful, expressive typography
- Clean, minimalist layouts

---

## 🤖 My AI Usage

### AI Tool: ChatGPT

Throughout the development of this project, I utilized **ChatGPT** as a coding assistant and development partner. Below is a transparent account of how AI was integrated into my workflow:

#### How I Used ChatGPT

1. **Initial Project Structure & Boilerplate**
   - Used ChatGPT to generate initial Spring Boot project structure
   - Created boilerplate code for controllers, services, and repositories
   - Generated JWT authentication setup and security configuration

2. **Test Generation**
   - Asked ChatGPT to generate unit test templates for service classes
   - Created integration test structures using Testcontainers
   - Generated test cases for edge cases and error scenarios

3. **API Design & Documentation**
   - Consulted ChatGPT for RESTful API best practices
   - Generated API endpoint structures and request/response DTOs
   - Created comprehensive API documentation templates

4. **Frontend Component Development**
   - Used ChatGPT to generate React component structures
   - Created form validation logic using React Hook Form and Zod
   - Generated utility functions for API calls and state management

5. **Debugging & Problem Solving**
   - When encountering errors, I described the issue to ChatGPT
   - Received suggestions for debugging strategies
   - Got recommendations for fixing security vulnerabilities

6. **Code Review & Refactoring**
   - Asked ChatGPT to review code for best practices
   - Received suggestions for improving code readability
   - Got recommendations for applying SOLID principles

#### Reflection on AI Impact

**Positive Impacts:**
- **Accelerated Development:** AI assistance significantly reduced time spent on boilerplate code and repetitive tasks
- **Learning Enhancement:** ChatGPT explanations helped me understand complex concepts better
- **Code Quality:** AI suggestions improved code structure and adherence to best practices
- **Problem Solving:** Quick access to solutions for common development challenges

**Challenges & Learnings:**
- **Critical Thinking Required:** Not all AI suggestions were perfect; I had to evaluate and adapt them
- **Context Understanding:** Sometimes needed multiple iterations to get the right solution
- **Over-reliance Risk:** Had to ensure I understood the code, not just copy-paste

**Ethical Usage:**
- All AI-generated code was reviewed, tested, and understood before integration
- I maintained full ownership and understanding of the codebase
- AI was used as a tool to enhance productivity, not replace critical thinking

#### AI Co-authorship in Commits

Following the project requirements, commits where ChatGPT was significantly used include co-author attribution:

```
Co-authored-by: ChatGPT <chatgpt@openai.com>
```

This transparency ensures full disclosure of AI assistance while maintaining code ownership and understanding.

---

## 🔄 Development Workflow

### Git Workflow

This project follows a clear Git workflow with descriptive commit messages:

1. **Feature Development:** Each feature is developed in a branch
2. **TDD Cycle:** Commits follow Red-Green-Refactor pattern
3. **Clear Messages:** Commit messages describe what and why
4. **Regular Commits:** Frequent commits show development progression

### TDD Process

1. **Red:** Write failing tests first
2. **Green:** Implement minimal code to pass tests
3. **Refactor:** Improve code while keeping tests green
4. **Repeat:** Continue cycle for each feature

### Code Quality

- **SOLID Principles:** Applied throughout the codebase
- **Clean Code:** Meaningful names, small functions, clear structure
- **Documentation:** Inline comments where necessary
- **Error Handling:** Comprehensive exception handling

---

## 📝 Contributing

This is a TDD Kata project, but if you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests first (TDD approach)
4. Implement the feature
5. Ensure all tests pass
6. Commit your changes with clear messages
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## 📄 License

This project is part of a TDD Kata exercise and is available for educational purposes.

---

## 👤 Author

**Gaurav**

<div align="center" style="border: 2px solid #ffd93d; padding: 10px; border-radius: 5px; background-color: #fff9e6; margin: 10px 0;">

</div>

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Next.js team for the powerful React framework
- Radix UI for accessible component primitives
- The open-source community for amazing tools and libraries
- ChatGPT for development assistance and learning support

---

<div align="center">

**Made with ❤️ using TDD principles**

---

<div style="border: 4px solid #ff6b6b; padding: 25px; border-radius: 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); margin: 30px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">



</div>

</div>

