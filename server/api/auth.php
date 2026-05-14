<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../config/Config.php';

sendSecurityHeaders();
handleOptionsRequest();

$input = getJsonPayload();
$email = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '') {
    badRequest('Email and password are required.');
}

$pdo = getDatabase();
$stmt = $pdo->prepare('SELECT user_id, name, email, role, created_at, password FROM users WHERE lower(email) = lower(:email) LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!is_array($user) || !password_verify($password, (string)$user['password'])) {
    jsonResponse(['success' => false, 'message' => 'Invalid email or password.'], 401);
}

unset($user['password']);
jsonResponse(['success' => true, 'user' => $user, 'token' => base64_encode(random_bytes(24))]);
