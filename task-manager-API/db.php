<?php
$c = require __DIR__ . '/config.php';
$pdo = new PDO(
    "mysql:host={$c['host']};dbname=$c{['db']};charset=utf8mb4",
    $c['user'], $c['pass'],
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCHMODE => PDO_FETCH_ASSOC,
    ]
);
