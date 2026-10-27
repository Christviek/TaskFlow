# TaskFlow — User Stories and Tasks

**Student:** Christvie Kabangu  
**Project:** TaskFlow — Task Management Web Application  
**Date:** 27 October 2026

## 1. Introduction

User stories describe the functionality of an application from the perspective of the person using it. They help explain what a user needs and why that functionality is useful.

For TaskFlow, user stories are used to break the main application features into smaller tasks that are easier to understand, implement, and test. Each story includes acceptance criteria to describe the expected outcome.

As this is an individual project, I am responsible for identifying the requirements, implementing the functionality, and checking whether the completed features meet the acceptance criteria.

## 2. User Stories

### US01 — Register an Account

**User story**

As a new user, I want to create an account so that I can access my own task-management dashboard.

**Acceptance criteria**

- The user can enter their name, email address, and password.
- The system validates the submitted information.
- The password is hashed before it is stored.
- The system provides feedback when registration succeeds or fails.
- The user can subsequently sign in using their registered credentials.

**Development tasks**

- Create the registration form.
- Validate the submitted information on the server.
- Hash passwords using bcryptjs.
- Store the account in the SQLite database.
- Test successful registration and invalid submissions.

**Status:** Implemented; core functionality manually tested.

### US02 — Log In to an Account

**User story**

As a registered user, I want to log in so that I can access my personal tasks.

**Acceptance criteria**

- The user can submit their email address and password.
- Valid credentials allow access to the dashboard.
- Invalid credentials are rejected.
- A successful login establishes a session.
- Authentication requests are subject to rate limiting.

**Development tasks**

- Create the login form.
- Retrieve the account associated with the submitted email address.
- Compare the submitted password with the stored password hash.
- Establish a session after successful authentication.
- Test valid and invalid login attempts.

**Status:** Implemented; core functionality manually tested.

### US03 — Log Out

**User story**

As an authenticated user, I want to log out so that my account is no longer accessible through my active session.

**Acceptance criteria**

- The dashboard provides a logout option.
- Logging out invalidates the server-side session.
- The user returns to the authentication screen.
- Protected task endpoints reject requests without a valid authenticated session.

**Development tasks**

- Add the logout control.
- Implement the logout API endpoint.
- Destroy the user's session.
- Test logout and subsequent access to protected functionality.

**Status:** Implemented; core functionality manually tested.

### US04 — View My Tasks

**User story**

As an authenticated user, I want to view my tasks so that I can see the work I need to complete.

**Acceptance criteria**

- The dashboard displays the authenticated user's tasks.
- Tasks belonging to another account are not displayed.
- The dashboard handles an empty task list appropriately.
- Task information remains available when retrieved from persistent storage.

**Development tasks**

- Create the task retrieval API endpoint.
- Retrieve tasks belonging to the authenticated user.
- Display the returned tasks on the dashboard.
- Test the dashboard with populated and empty task lists.

**Status:** Implemented; core functionality manually tested.

### US05 — Create a Task

**User story**

As an authenticated user, I want to create a task so that I can record work that needs to be completed.

**Acceptance criteria**

- The user can submit the information required to create a task.
- The system validates the submitted data.
- The task is stored in the database.
- The task appears in the user's task list after successful creation.
- The task is associated with the authenticated account.

**Development tasks**

- Create the task input interface.
- Implement the task creation API endpoint.
- Validate incoming task data.
- Save the task with the authenticated user's ID.
- Test task creation and persistence.

**Status:** Implemented; core functionality manually tested.

### US06 — Update a Task

**User story**

As an authenticated user, I want to edit an existing task so that I can correct or update its information.

**Acceptance criteria**

- The user can update an existing task.
- The system saves the changes.
- The updated information is reflected in the dashboard.
- A user cannot update another user's task.

**Development tasks**

- Implement the task editing interface.
- Create the task update API endpoint.
- Validate updates and check task ownership.
- Test successful updates and unauthorised update attempts.

**Status:** Implemented; core functionality manually tested.

### US07 — Delete a Task

**User story**

As an authenticated user, I want to delete a task so that I can remove work that is no longer required.

**Acceptance criteria**

- The user can delete a task.
- The deleted task is removed from the active task list.
- The deletion is persisted in the database.
- A user cannot delete another user's task.

**Development tasks**

- Add a delete control to the task interface.
- Implement the task deletion API endpoint.
- Verify task ownership before deletion.
- Test deletion and confirm that the task no longer appears.

**Status:** Implemented; core functionality manually tested.

### US08 — Filter Tasks

**User story**

As an authenticated user, I want to filter my tasks so that I can focus on particular categories of work.

**Acceptance criteria**

- The dashboard provides the available task filters.
- Selecting a filter changes which tasks are displayed.
- Filtering does not modify or delete stored tasks.
- The user can return to the full task list.

**Development tasks**

- Implement the filter controls.
- Add the front-end filtering logic.
- Test each available filter against different task lists.

**Status:** Implemented; verify the exact available filters against the current application.

### US09 — View Dashboard Statistics

**User story**

As an authenticated user, I want to see task statistics so that I can understand my current workload and progress.

**Acceptance criteria**

- The dashboard displays the task statistics implemented in the application.
- Statistics reflect the current task data.
- Statistics update appropriately after task changes.

**Development tasks**

- Identify the statistics required by the interface.
- Calculate the statistics from the relevant task data.
- Display the results on the dashboard.
- Test the figures after creating, updating, and deleting tasks.

**Status:** Implemented; verify the displayed figures against the current application.

## 3. Prioritisation

The stories can be prioritised according to their importance to the application's core purpose.

| Priority | User stories | Reason |
|---|---|---|
| High | US01, US02, US03 | Account access and session management establish the authentication foundation. |
| High | US04, US05 | Users need to view and create tasks for the application to fulfil its primary purpose. |
| High | US06, US07 | Updating and deleting tasks complete the main task-management operations. |
| Medium | US08 | Filtering makes it easier to navigate a growing task list. |
| Medium | US09 | Statistics help users understand their tasks at a glance. |

## 4. Reflection

Writing user stories helped me view TaskFlow from the user's perspective rather than focusing only on the technical implementation. For example, the requirement to create a task is not simply about writing a database insert operation. The user needs to submit information, receive feedback, and see the new task reflected in the interface.

Acceptance criteria also provide a way to judge whether a feature meets its intended purpose. They make the expected behaviour clearer and help guide testing. The account-specific task stories are particularly important because users should only be able to manage their own tasks.

Breaking the stories into development tasks makes the work more manageable because each feature can be approached in smaller steps. One improvement for future projects would be to record story estimates and test results more consistently during development. This would make it easier to compare planned work with completed work.

## 5. Conclusion

The user stories identify the main requirements of TaskFlow, while the development tasks describe the work needed to implement those requirements. The acceptance criteria establish the expected behaviour of each feature and provide a basis for checking functionality.