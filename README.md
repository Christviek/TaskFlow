# TaskFlow

TaskFlow is a simple task management web application that helps users organise tasks, track their progress, and manage priorities and due dates.

## Features

- Create, edit, and delete tasks.
- Assign priorities to tasks.
- Set task due dates and descriptions.
- Track task status and completion.
- Search tasks and filter by status or priority.
- View dashboard totals and progress.
- Save tasks in a local SQLite database.
- Use the interface on desktop and mobile screens.

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- SQLite using better-sqlite3

## Getting Started

### Requirements

- Node.js and npm installed.

### Installation

1. Open a terminal in the TaskFlow project directory.
2. Install the project dependencies:

   ```bash
   npm install
   ```

### Run the Application

Start the server:

```bash
npm start
```

Open the application in your browser:

http://localhost:3000

Keep the terminal running while using the application.

## Data Storage

TaskFlow uses a local SQLite database named `taskflow.db`. Tasks are stored in the database, so they remain available after the server is restarted.

Keep the database file safe if you want to preserve your saved tasks.

## Testing Completed

- Verified task creation, editing, and deletion.
- Confirmed tasks persist after restarting the server.
- Tested search and filtering.
- Checked dashboard totals and progress updates.
- Tested handling of empty or invalid task titles.
- Checked the layout at a mobile viewport of approximately 390 pixels.

## Current Limitations

- The application currently runs locally.
- It does not yet have user accounts or cloud synchronisation.
- The SQLite database is stored locally.

## Project Purpose

This project provides practical experience in web development, API integration, database operations, and responsive user-interface design.
