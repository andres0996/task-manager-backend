# task-manager-backend

RESTful API for a task manager app using Express, TypeScript, and Firebase Firestore, following clean architecture principles

## Overview

This project is a backend RESTful API for a task management application, developed as a technical challenge to demonstrate clean code practices and scalable architecture.

Users can log in using their email, create and manage tasks, update their details, delete tasks, and mark them as completed or pending.

The system is built with Express and TypeScript, uses Firebase Firestore as the database, and follows Clean Architecture principles, ensuring a clear separation of concerns between business logic, application, and infrastructure layers.

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript

### Database

- Firebase Firestore

### Infrastructure

- Firebase Hosting
- Firebase Cloud Functions

## Features

- User authentication (login / register)
- Task CRUD (Create, Read, Update, Delete)
- Task status management (pending, completed)
- Clean Architecture layered design
- RESTful API

## Project Architecture

This section will be updated with a detailed explanation of the system architecture, including folder structure, separation of concerns, and applied design patterns.

## Installation

Follow these steps to run the project locally:

### 1. Clone the repository

    ```bash
    git clone https://github.com/andres0996/task-manager-frontend.git
    cd task-manager-frontend
    ```

### 2. Install dependencies

  ```bash
  npm install
  ```

### 3. Configure environment variables

  ```bash
  FIREBASE_PROJECT_ID=your-firebase-project-id
  FIREBASE_CLIENT_EMAIL=your-firebase-client-email
  FIREBASE_PRIVATE_KEY=your-firebase-private-key
  ```

## API Endpoints

The backend exposes the following RESTful endpoints:

- `GET /tasks?userId=` - Retrieve all tasks for a specific user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /users?email=` - Check if user exists
- `POST /users` - Create a new user

## Design Decisions

### 1. Clean Architecture 
   The backend follows **Clean Architecture** principles (Robert C. Martin) with concentric layers:  
   - **Domain:** Core entities (`User`, `Task`) and repository interfaces.  
   - **Application:** Business logic implemented in services (`UserService`, `TaskService`).  
   - **Presentation:** HTTP controllers and routes that handle requests and responses.  
   - **Infrastructure:** Concrete database implementations (Firestore repositories).  
   This separation ensures that **the core domain is independent** from frameworks and external services.

### 2. Hexagonal Architecture (Ports & Adapters)**  
   - All external dependencies enter or leave the system through **adapters**.  
   - The **domain layer** does not depend on Express or Firebase.  
   - Database access is done through **repository adapters** in the infrastructure layer, allowing easy replacement of Firestore if needed.  

### 3. Domain-Driven Design (DDD)**  
   - The project is organized around the **domain**, reflecting real business concepts.  
   - Each module (users, tasks) includes:  
     - **Entities** representing core business objects.  
     - **Use cases** encapsulating business rules.  
     - **Infrastructure** for database operations.  
     - **Presentation** for HTTP adapters (controllers & routes).  
   - This ensures that **business rules are centralized and independent** from delivery mechanisms.

### 4. Separation of Concerns**  
   - Each layer has a **single responsibility**, making the codebase easier to maintain and test.  
   - Controllers handle **HTTP concerns**, services handle **business logic**, and repositories handle **data persistence**.

### 5. Testability**  
   - Using repository interfaces allows **mocking dependencies** during unit tests.  
   - The domain and application layers are decoupled from Express and Firestore, allowing **fast and isolated tests**.  

### 6. Scalability & Maintainability**  
   - Feature-based module structure (`modules/users`, `modules/tasks`) supports **easy extension** with new features.  
   - Adding new entities or modules requires minimal changes to existing code.  

### 7. Error Handling & Middleware**  
   - Centralized **error middleware** ensures consistent HTTP responses for exceptions.  
   - DTOs (Data Transfer Objects) are used to validate and structure incoming and outgoing data.

### 8. Future-Proof Design**  
   - This architecture allows for:  
     - Replacing Firestore with another database  
     - Adding new delivery mechanisms (GraphQL, gRPC) without changing domain logic  
     - Scaling endpoints independently for microservices if needed  
