# TaskFlow — Product Backlog

**Student:** Christvie Kabangu  
**Project:** TaskFlow — Task Management Web Application  
**Date:** 27 October 2026

## 1. Introduction

A product backlog is a prioritised list of features, requirements, improvements, and other work needed to develop a product. It helps organise development around the most important user needs while allowing priorities to change when necessary.

For TaskFlow, the product backlog is based on the application's main requirements: user authentication, personal task management, persistent data storage, and a usable dashboard.

The backlog below documents the main features of the application. Since the application has already been implemented and tested manually, the priorities represent the relative importance of the features rather than a claim that all work is still outstanding.

## 2. Product Backlog Items

| ID | Backlog item | Description | Priority | Related story | Status |
|---|---|---|---|---|---|
| PB01 | User registration | Allow new users to create accounts. | High | US01 | Implemented |
| PB02 | User login | Authenticate registered users. | High | US02 | Implemented |
| PB03 | User logout | End an authenticated session. | High | US03 | Implemented |
| PB04 | View personal tasks | Display tasks belonging to the authenticated user. | High | US04 | Implemented |
| PB05 | Create tasks | Allow users to add new tasks. | High | US05 | Implemented |
| PB06 | Update tasks | Allow users to edit existing tasks. | High | US06 | Implemented |
| PB07 | Delete tasks | Allow users to remove tasks. | High | US07 | Implemented |
| PB08 | Filter tasks | Help users find tasks using the available filters. | Medium | US08 | Implemented; confirm exact filters |
| PB09 | Dashboard statistics | Summarise task information for the user. | Medium | US09 | Implemented; verify displayed statistics |
| PB10 | Authentication validation | Validate account details and handle invalid submissions. | High | US01, US02 | Implemented |
| PB11 | Password security | Hash passwords before storing them in the database. | High | US01 | Implemented |
| PB12 | Session management | Maintain authenticated sessions and handle logout. | High | US02, US03 | Implemented |
| PB13 | Account-level data isolation | Restrict task operations to the authenticated user's own tasks. | High | US04–US07 | Implemented |
| PB14 | Portfolio documentation | Prepare project documentation, screenshots, and Agile artefacts. | High | All | In progress |

## 3. Prioritisation Approach

The backlog uses a simple High, Medium, and Low priority scale.

- **High:** Essential features required for secure account access and the application's core task-management purpose.
- **Medium:** Features that improve usability and help users understand their workload.
- **Low:** Optional improvements that can be considered after the core functionality is complete.

The priority is based on the importance of each feature to the application's purpose. Authentication and task operations receive high priority because the application would not meet its main requirements without them.

Portfolio documentation is also a high priority for this assessment because the working application must be supported by evidence and reflection.

## 4. Backlog Management

The product backlog can change as requirements become clearer, issues are discovered, or the project scope changes.

When reviewing a backlog item, I would consider:

1. How important the feature is to the user.
2. Whether it depends on another feature.
3. How much work may be required to implement and test it.
4. Whether it fits within the project's scope and available time.

For example, user-specific task management depends on authentication because the application needs to identify the current user before retrieving or modifying that user's tasks.

## 5. Reflection

Creating a product backlog helped me understand how to separate the overall project into identifiable features and rank them according to their importance. Instead of treating TaskFlow as one large development task, I can see how authentication, database operations, and dashboard functionality contribute to the finished application.

Prioritisation is useful because not every feature has equal importance. Account access and the ability to create and manage tasks are central to the application's purpose, while filtering and dashboard statistics improve the user experience.

Another important lesson is that a backlog is not simply a list of unfinished tasks. It can also document completed features and identify improvements that may be considered later. Since TaskFlow's core functionality has been implemented and manually tested, the backlog also helps distinguish completed development from the remaining portfolio work.

For future projects, I would improve this process by recording estimates, reviewing priorities more regularly, and keeping the backlog updated throughout development rather than relying on retrospective documentation.

## 6. Conclusion

The TaskFlow product backlog organises the application's main features by priority and links them to the corresponding user stories. It provides an overview of the work required to deliver the application and a reference point for planning development stages.