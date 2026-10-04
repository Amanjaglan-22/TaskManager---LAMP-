CREATE DATABASE task_manager
 CHARACTER SET utf8mb4 
 COLLATE utf8mb4_unicode_ci; 

USE task_manager;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status ENUM('pending', 'done') NOT NULL DEFAULT 'pending',
  created =_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

INSERT INTO tasks (title) VALUES 
  ('Learn Git basics'),
  ('Build my first PHP API');
