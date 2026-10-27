# TaskFlow — Sprint Backlog

**Student:** Christvie Kabangu  
**Project:** TaskFlow — Task Management Web Application  
**Date:** 27 October 2026

## 1. Introduction

A sprint backlog is a collection of work selected for a development sprint, together with a plan for completing that work and achieving a defined goal.

TaskFlow was developed as an individual project. This document organises the main development activities into logical stages to explain how the application was built. These stages are a retrospective representation of the work, not a claim that formal Scrum sprints or sprint-planning meetings took place.

## 2. Development Goals and Work Items

### Stage 1 — Application Foundation

**Goal:** Establish the basic structure of the task-management application.

| Task ID | Task | Expected outcome | Status |
|---|---|---|---|
| S1-01 | Establish the front-end structure | Web pages have a clear HTML structure. | Completed |
| S1-02 | Style the interface | The application has a consistent visual layout. | Completed |
| S1-03 | Implement front-end interactions | JavaScript supports the application's interface. | Completed |

### Stage 2 — Task Management

**Goal:** Allow users to manage tasks through the application.

| Task ID | Task | Expected outcome | Status |
|---|---|---|---|
| S2-01 | Implement the Express server | The application can handle HTTP requests. | Completed |
| S2-02 | Integrate SQLite | Application data can be stored persistently. | Completed |
| S2-03 | Implement task retrieval | Tasks can be retrieved for display. | Completed |
| S2-04 | Implement task creation | Users can add tasks. | Completed |
| S2-05 | Implement task updates | Users can edit tasks. | Completed |
| S2-06 | Implement task deletion | Users can remove tasks. | Completed |
| S2-07 | Implement filtering and dashboard statistics | Users can navigate and review task information. | Completed; exact behaviour should match the current app |

### Stage 3 — Authentication and Data Protection

**Goal:** Introduce user accounts and ensure task operations are associated with the authenticated user.

| Task ID | Task | Expected outcome | Status |
|---|---|---|---|
| S3-01 | Create the users database structure | User accounts can be stored. | Completed |
| S3-02 | Implement registration | New users can register. | Completed |
| S3-03 | Hash passwords | Passwords are not stored as plain text. | Completed |
| S3-04 | Implement login and sessions | Registered users can authenticate and maintain sessions. | Completed |
| S3-05 | Implement logout | Users can end their sessions. | Completed |
| S3-06 | Restrict task operations by user | Users can manage their own tasks. | Completed |
| S3-07 | Apply authentication rate limiting | Repeated authentication attempts are limited. | Completed |

### Stage 4 — Testing and Portfolio Preparation

**Goal:** Verify the core application and prepare the academic evidence.

| Task ID | Task | Expected outcome | Status |
|---|---|---|---|
| S4-01 | Manually test the application | Core features behave as expected. | Completed; manually tested |
| S4-02 | Review task persistence and account separation | Stored tasks remain associated with the correct user. | Manually tested; confirm evidence available |
| S4-03 | Prepare the Agile Team Charter | Project purpose, scope, and working agreements are documented. | In progress |
| S4-04 | Prepare user stories and tasks | Requirements and implementation tasks are documented. | In progress |
| S4-05 | Prepare the product backlog | Features are prioritised and recorded. | In progress |
| S4-06 | Prepare the Agile logbook | Development progress and lessons are documented. | Outstanding |

## 3. Sprint Planning Principles

In a formal Scrum project, a sprint would have a defined timebox, a sprint goal, and a selected set of backlog items. The team would monitor progress during the sprint and review the outcome at the end.

For this individual project, the stages above group related work by purpose and dependencies. They show a logical development sequence, but actual sprint dates, estimates, and planning records should only be added if they can be verified.

## 4. Definition of Completion

A task is considered complete when the required functionality has been implemented, relevant checks have been performed, and the outcome meets its acceptance criteria.

For documentation tasks, completion requires the artefact to be written, reviewed for accuracy, and saved in the portfolio repository.

## 5. Reflection

Organising the work into development stages helps explain how TaskFlow's features relate to one another. For example, implementing task management requires a server and a database, while restricting tasks to individual accounts requires authentication and ownership checks.

The project also demonstrates that development work includes more than implementation. Testing and documentation are necessary to establish whether the application behaves as intended and to communicate how it was developed.

One limitation is that this backlog was organised retrospectively rather than maintained as a formal sprint plan throughout development. As a result, it should not be treated as proof of actual sprint durations, velocity, or daily progress. In a future project, I would establish sprint goals, estimate tasks, record progress consistently, and review each sprint's outcome.

This would make it easier to identify delays, assess how much work could realistically be completed, and improve planning in subsequent development cycles.

## 6. Conclusion

This sprint backlog organises TaskFlow's implementation and portfolio activities into goal-oriented stages. It provides a structured overview of the work, its expected outcomes, and its recorded status.

Although the stages are retrospective, they demonstrate how work can be grouped according to dependencies and project objectives. The document also identifies the remaining portfolio tasks required to present the project effectively.