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

This section will be updated with a detailed explanation of the installation and deployment process, including local setup, environment variables, Firebase configuration, and running the API using Cloud Functions.

## API Endpoints

The backend exposes the following RESTful endpoints:

- `GET /tasks?userId=` - Retrieve all tasks for a specific user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `GET /users?email=` - Check if user exists
- `POST /users` - Create a new user

## Design Decisions

This section will be updated with notes about architectural choices, technological decisions, and potential future improvements.
