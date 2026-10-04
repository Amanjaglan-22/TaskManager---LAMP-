<?php
header('Content-Type: application/json');
require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents('php://input'), true) ?? [];
$id     = (int)($_GET['id'] ?? 0);

try {
    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT * FROM tasks ORDER BY id DESC');
        echo json_encode($stmt->fetchAll());

    } elseif ($method === 'POST') {
        $title = trim($input['title'] ?? '');
        if ($title === ''){
            http_response_code(400);
            echo json_encode(['error' => 'Title required']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO tasks (title) VALUES (?)');
        $stmt->execute([$title]);
        http_response_code(201);
        echo json_encode([
            'id' => (int)$pdo->lastInsertId(),
            'title' => $title,
            'status' => 'pending'
        ]);
    } elseif ($method === 'PUT' && $id) {
        $status = ($input['status'] ?? '') === 'done'? 'done' : 'pending';
        $stmt = $pdo-> prepare('DELETE FROM tasks WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['ok' => ture]);

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Bad request']);
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error'])
}
