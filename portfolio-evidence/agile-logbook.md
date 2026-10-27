# TaskFlow — Agile Logbook

**Student:** Christvie Kabangu  
**Project:** TaskFlow — Task Management Web Application  
**Document type:** Retrospective Development Log  
**Prepared:** 27 October 2026

## 1. Purpose

An Agile logbook records development activities, progress, challenges, decisions, and lessons learned throughout a project. It helps a developer review what was accomplished, identify problems, and consider how the development process could be improved.

This logbook documents the main stages of TaskFlow's development. It is based on the application's implemented features and the development work

## 2. Development Log

### Entry 1 — Establishing the Application

**Activity:** Setting up the front end and initial application structure.

**Work undertaken:** The application was organised around HTML, CSS, and JavaScript. These technologies provided the page structure, styling, and interactive behaviour.

**Outcome:** The project had a foundation for building the task-management interface.

**Learning:** Separating page structure, presentation, and behaviour makes the application easier to organise and maintain.

### Entry 2 — Implementing Task Management

**Activity:** Developing the main task-management functionality.

**Work undertaken:** The application was extended to support task operations, including creating, viewing, updating, and deleting tasks. Filtering and dashboard statistics were also incorporated.

**Outcome:** The application supported the main operations required for managing tasks.

**Learning:** Each operation requires both an interface and appropriate application logic. Testing the complete interaction is important because a feature may appear correctly on screen without saving the expected result.

### Entry 3 — Introducing the Back End and Database

**Activity:** Connecting the application to server-side functionality and persistent storage.

**Work undertaken:** Node.js and Express were used to handle requests, while SQLite provided persistent storage for application data.

**Outcome:** The application could use a database rather than relying entirely on temporary browser state.

**Learning:** Persistent storage allows information to remain available between visits. It also requires careful handling of database operations, validation, and the relationship between stored data and application functionality.

### Entry 4 — Implementing User Authentication

**Activity:** Introducing individual user accounts.

**Work undertaken:** Registration, login, and logout functionality was implemented. Password hashing and session management were incorporated into the authentication process.

**Outcome:** Users could authenticate and access the application's task-management functionality through their accounts.

**Learning:** Authentication requires more than a login form. The server must verify credentials, manage sessions, and enforce access restrictions on protected operations.

### Entry 5 — Restricting Access to User-Specific Tasks

**Activity:** Associating tasks with the authenticated user.

**Work undertaken:** The database and task API were updated to associate task operations with the current user's account.

**Outcome:** The application was designed to retrieve and modify tasks according to the authenticated user's identity. The behaviour was manually tested.

**Learning:** Access control must be enforced on the server rather than relying only on what the interface displays. Each protected operation must verify that the authenticated user is permitted to access the relevant record.

### Entry 6 — Configuration and Application Setup

**Activity:** Organising configuration and supporting files.

**Work undertaken:** Environment variables were introduced for sensitive configuration, and a `.gitignore` file was configured to exclude items such as `.env`, `node_modules`, and local database files from version control.

**Outcome:** The project configuration and local development setup were organised more appropriately.

**Learning:** Configuration should be separated from application code. Files containing secrets or local data require particular care when preparing a project for sharing.

### Entry 7 — Manual Testing

**Activity:** Checking the core application functionality.

**Work undertaken:** The application was run locally and the implemented features were tested manually.

**Outcome:** The developer confirmed that the tested core functionality worked as expected.

**Learning:** Testing helps confirm that implemented features behave correctly under the conditions checked. Recording test cases and results would provide stronger evidence and make it easier to reproduce tests later.

### Entry 8 — Preparing the Academic Portfolio

**Activity:** Documenting the project using Agile artefacts.

**Work undertaken:** The Agile Team Charter, User Stories and Tasks, Product Backlog, Sprint Backlog, and Agile Logbook were prepared for the CPUT portfolio assessment.

**Outcome:** The project gained a structured set of documents describing its purpose, requirements, priorities, development stages, and lessons learned.

**Learning:** A working application is only one part of a portfolio. Supporting documentation helps explain the decisions behind the implementation and demonstrates an understanding of the development process.

## 3. Challenges and Lessons Learned

The development process highlighted several important lessons:

- **Feature dependencies matter.** Task management and account-level access control depend on the server and database being structured appropriately.
- **Security must be considered during implementation.** Password hashing, session management, input validation, and user-specific access checks are important parts of an authenticated application.
- **Testing should be systematic.** Manually checking the application is useful, but a written test plan would provide a more repeatable way to verify behaviour.
- **Documentation should develop alongside the application.** Recording decisions as they happen makes retrospective reporting more accurate and reduces the risk of forgetting important details.
- **Prioritisation helps manage scope.** Completing the essential task-management and authentication features before adding optional functionality keeps the project focused.

## 4. Retrospective

### What went well?

The application progressed from a task-management interface to a full-stack application with persistent storage and user authentication. The core functionality was manually tested, and the project provided practical experience in connecting front-end behaviour with server-side routes and database operations.

### What could be improved?

The project would benefit from maintaining a development log from the beginning, defining measurable sprint goals, recording estimates, and documenting test results as each feature is completed. These practices would provide a clearer record of progress and make planning more reliable.

### What would I do differently next time?

In a future project, I would establish a prioritised backlog before implementation, break features into estimated tasks, and review progress at regular intervals. I would also maintain a test checklist and record significant technical decisions as they occur.

## 5. Conclusion

This logbook summarises the major stages of TaskFlow's development and identifies the lessons gained from implementation, authentication, database integration, testing, and documentation.