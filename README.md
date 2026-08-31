# Meal-Planner

Meal Planner is a full-stack web application for planning meals, managing recipes and products, and automatically generating meal plans and shopping lists.

<video src="./showcase.mp4" controls></video>

## Features

- **Meal plan generation** — automatically generate meal plans based on the selected number of days and meals per day.
- **Meal plan management** — create, edit, save, and load meal plans.
- **Recipe management** — browse available recipes and assign them to individual meals.
- **Product management** — manage products and their quantities used in recipes.
- **Shopping list generation** — automatically calculate a shopping list based on the selected meal plan.
- **Meal editing** — replace individual meals with recipes from the available recipe collection.
- **Change tracking** — track modified meals and save only when changes have been made.
- **User accounts** — each user has their own recipes, products, and meal plans.
- **Responsive interface** — designed to work across different screen sizes.

## Technologies

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT authentication
- PostgreSQL
- Lombok

### Frontend

- Next.js
- React
- TypeScript

## Architecture

The application follows a client-server architecture:

```text
┌─────────────────────┐
│      Next.js        │
│  React + TypeScript │
└──────────┬──────────┘
           │ REST API
           ▼
┌─────────────────────┐
│    Spring Boot      │
│   REST API + JWT    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       PostgreSQL    │
└─────────────────────┘

The frontend communicates with the Spring Boot backend through a REST API. Authentication is handled using JWT, while user-specific data such as recipes, products, and meal plans is stored in the database.

Main Workflow
Log in to the application.
Select the number of days and meals per day.
Generate a meal plan automatically.
Review and modify individual meals.
Save the meal plan.
Generate a shopping list based on the selected meals.
Reopen and edit previously saved meal plans.
Project Structure

Meal-Planner/
├── backend/     # Spring Boot REST API
└── frontend/    # Next.js application