
CREATE DATABASE task_manager
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
 
USE task_manager;
 
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('backlog', 'planned', 'in_progress', 'done') NOT NULL DEFAULT 'backlog',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
INSERT INTO tasks (title, status) VALUES
    ('Learn Git basics', 'in_progress'),
    ('Build my first PHP API', 'done'),
    ('Design the board layout', 'planned'),
    ('Add due dates', 'backlog');
