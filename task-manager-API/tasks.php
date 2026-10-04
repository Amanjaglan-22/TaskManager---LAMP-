<?php
header('Content-Type: application/json');
require __DIR__ . '/db.php';
 
$allowed = ['backlog', 'planned', 'in_progress', 'done'];
 
$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$id     = (int)($_GET['id'] ?? 0);
 
try {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM tasks ORDER BY id DESC');
        echo json_encode($stmt->fetchAll());
 
    } elseif ($method === 'POST') {
        $title  = trim($input['title'] ?? '');
        $status = $input['status'] ?? 'backlog';
        if ($title === '' || !in_array($status, $allowed, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Valid title and status required']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO tasks (title, status) VALUES (?, ?)');
        $stmt->execute([$title, $status]);
        http_response_code(201);
        echo json_encode([
            'id' => (int)$pdo->lastInsertId(),
            'title' => $title,
            'status' => $status
        ]);
 
    } elseif ($method === 'PUT' && $id) {
        $status = $input['status'] ?? '';
        if (!in_array($status, $allowed, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status']);
            exit;
        }
        $stmt = $pdo->prepare('UPDATE tasks SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        echo json_encode(['ok' => true]);
 
    } elseif ($method === 'DELETE' && $id) {
        $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['ok' => true]);
 
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Bad request']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
