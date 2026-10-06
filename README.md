# TaskManager---LAMP-

A Kanban-style task manager inspired by Azure DevOps task board, built as a full-stack project using Apache, MySQL, PHP, JavaScript, HTML, and CSS.
https://devopstaskmanager.free.je/?i=1

## Tech Stack

- Server - Apache  
- Database - MySQL
- Backend - PHP9 with PDO
- Frontend - JavaScript, HTML, CSS

## Setup

I used the XAMPP to host my Apache server and SQL database initially, and copy pasted all the essential files in GitHub
- Install XAMPP and open its Control Panel.
- Click Start next to Apache and MySQL.
- Put the project folder in C:\xampp\htdocs and name it task-manager.
- Go to http://localhost/phpmyadmin, click the SQL tab, paste the contents of sql/schema.sql, and click Go.
- In the api folder, copy config.sample.php and rename the copy to config.php.
- Open http://localhost/task-manager/ and add your first task

## Features

- Create tasks
- View tasks by status
- Move tasks between columns
- Delete tasks
- Four workflow stages:
  - Backlog
  - Planned
  - In Progress
  - Done

## Project Structure

```text
task-whiteboard/
├── api/
│   ├── config.php (Not shared in the repository)
│   ├── db.php
│   └── tasks.php
├── sql/
│   └──schema.sql
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Troubleshooting
 
| Problem | Likely cause |
| --- | --- |
| "Could not reach the server" | Apache or MySQL is not running, or the `api` folder path is wrong |
| 404 Not Found | Project folder is not inside `htdocs`, or a file name does not match its link |
| "Database error" | Wrong values in `api/config.php`, or the `tasks` table is missing |
| Page looks unstyled or old | Browser cache. Press Ctrl+F5 |
| "Unexpected character" in the console | PHP returned an error page instead of JSON. Open `api/tasks.php` directly to see the error |


## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `api/tasks.php` | Get all tasks |
| `POST` | `api/tasks.php` | Create a task |
| `PUT` | `api/tasks.php?id={id}` | Update a task status |
| `DELETE` | `api/tasks.php?id={id}` | Delete a task |


## Key Takeaways (current)  -
- Building a database table with MySQL from scratch.
- Using PHP and PDO to connect to a database.
- Sending and receiving JSON between JavaScript and PHP.
- Building a REST-style API.
- Using async and await to manage browser requests.
- Creating a dynamic interface with JavaScript DOM methods.
- Using drag-and-drop events.
- Understanding HTTP status codes such as 201, 400, and 500.
- Understanding basic deployment concepts, including Apache, ports, databases, and application hosting.

## Next learning goal  - 
- User authentication and secure login.
- Encryption for browser-to-server communication
- Secure database configuration 
- Better error handling and consistent API responses. 
- Database replication concepts, and Backup/Restore procedures.
- Audit logs to record accountability (who changed, what changed, when)


<img width="1269" height="706" alt="image" src="https://github.com/user-attachments/assets/af2dbc81-d2c7-43bd-8ab3-e7064df67245" />

