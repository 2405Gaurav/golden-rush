# 🍬 Sweet Shop Management System (SSMS)

<div align="center">

**A Robust Full-Stack TDD Kata: Engineering Excellence in Modern Web Development**

[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.4.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

<div style="border: 4px solid #000; padding: 25px; border-radius: 0px; background: #FFD700; color: #000; box-shadow: 10px 10px 0px #000; margin: 20px 0; text-align: left;">

### 🚀 THE MISSION
This project is a disciplined exploration of **Test-Driven Development (TDD)**. It features a high-performance **Spring Boot 3.4** backbone and a cutting-edge **Next.js 15** interface. Every endpoint, security filter, and UI component was built to satisfy a rigorous test suite.

</div>

---

</div>

## 📖 Table of Contents
- [🎯 Project Overview](#-project-overview)
- [🏗️ Backend Architecture (Deep Dive)](#️-backend-architecture-deep-dive)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📸 Screenshots](#-screenshots)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing Strategy](#-testing-strategy)
- [🤖 AI Collaboration](#-ai-collaboration)

---

## 🎯 Project Overview

The **Sweet Shop Management System** is a sophisticated full-stack application designed as a **TDD Kata**. It bridges the gap between enterprise-grade backend stability and modern frontend agility. Built with **Java 21**, the system handles complex inventory logic, secure authentication, and real-time data persistence with surgical precision.

---

## 🏗️ Backend Architecture (Deep Dive)

The backend is the engine of SSMS, built with a focus on **SOLID principles** and **Scalability**.

<div style="border: 2px solid #6DB33F; padding: 15px; background: #f0fff0; border-radius: 8px;">

*   **Security Architecture:** Implemented **Spring Security 6** with a stateless **JWT** strategy. Custom filters handle granular **Role-Based Access Control (RBAC)** to distinguish between customers and shop admins.
*   **Data Integrity:** Utilizes **Spring Data JPA** with **PostgreSQL**. Atomic transactions ensure that inventory is never "double-sold" during simultaneous purchases.
*   **Dynamic Querying:** Implemented **JPA Specifications** to allow users to filter sweets by any combination of name, category, and price range via a single API endpoint.
*   **Modern Java 21:** Leverages **Records** for immutable DTOs and modern **Stream APIs** for clean, readable business logic.
*   **Database Versioning:** Uses **Flyway** for reproducible schema migrations, ensuring development, testing, and production environments stay in sync.

</div>

---

## ✨ Key Features

### 🔐 Security & Access
*   **Stateless Auth:** JWT-based login with secure password hashing via **BCrypt**.
*   **Protected Routes:** Frontend and Backend middleware ensure only Admins can access inventory management.

### 🍭 Inventory Engine
*   **Real-time Stock Tracking:** Automatic deduction upon purchase and instant low-stock alerts.
*   **Admin Tools:** Full CRUD operations for sweets, including image URL management and bulk restock.
*   **Advanced Search:** Server-side pagination and multi-parameter filtering for high-performance browsing.

### 🎨 Neobrutalist Design
*   **Bold UI:** High-contrast colors, sharp geometric shapes, and thick shadows.
*   **Responsive:** Fluid layouts designed for mobile, tablet, and desktop using **Tailwind CSS**.

---

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | **Spring Boot 3.4.1** | Enterprise Framework & Dependency Injection |
| **Language** | **Java 21** | High-performance modern logic |
| **Security** | **Spring Security + JJWT** | Authentication & RBAC |
| **Database** | **PostgreSQL (Neon)** | Relational data persistence |
| **Migration** | **Flyway** | Schema versioning & control |
| **Frontend** | **Next.js 15 (App Router)** | Server-Side Rendering & Client Routing |
| **Styling** | **Tailwind CSS** | Utility-first neobrutalist styling |
| **Testing** | **JUnit 5 & Testcontainers** | Integration & Unit testing |

---

## 📁 Project Structure

```text
📂 sweetshop-management-system
├── 📂 backend                 # Spring Boot Maven Project
│   ├── 📂 src/main/java       # Source Code
│   │   ├── 📂 auth            # Security, JWT, & User Login
│   │   ├── 📂 sweets          # Sweet Inventory Business Logic
│   │   └── 📂 common          # Global Exception Handlers & Utils
│   └── 📂 src/test            # JUnit 5 & Testcontainers Suite
├── 📂 app                     # Next.js App Router Pages
├── 📂 components              # Reusable React UI Components
├── 📂 lib                     # Axios API Clients & Typescript Logic
└── 📂 scripts                 # Automation & Deploy Scripts
