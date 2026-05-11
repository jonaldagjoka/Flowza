<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Response.php';

sendSecurityHeaders();
handleOptionsRequest();

$input = getJsonPayload();
$email = trim((string)($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '') {
    badRequest('Email and password are required.');
}

$user = authenticateUser($email, $password);
if ($user === null) {
    jsonResponse(['success' => false, 'message' => 'Invalid email or password.'], 401);
}

unset($user['password_hash']);
jsonResponse(['success' => true, 'user' => $user, 'token' => base64_encode(random_bytes(24))]);

function authenticateUser(string $email, string $password): ?array
{
    foreach (getDemoUsers() as $user) {
        if (strcasecmp($user['email'], $email) === 0 && password_verify($password, $user['password_hash'])) {
            return $user;
        }
    }
    return null;
}

function getDemoUsers(): array
{
    return [
        [
            'user_id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@flowza.com',
            'role' => 'admin',
            'created_at' => '2026-01-01T10:00:00Z',
            'password_hash' => password_hash('admin123', PASSWORD_DEFAULT)
        ],
        [
            'user_id' => 2,
            'name' => 'Helena Kace',
            'email' => 'team1@flowza.com',
            'role' => 'teamleader',
            'created_at' => '2026-01-02T10:00:00Z',
            'password_hash' => password_hash('team123', PASSWORD_DEFAULT)
        ],
        [
            'user_id' => 3,
            'name' => 'Erjeta Rrapaj',
            'email' => 'team2@flowza.com',
            'role' => 'teamleader',
            'created_at' => '2026-01-03T10:00:00Z',
            'password_hash' => password_hash('team123', PASSWORD_DEFAULT)
        ],
        [
            'user_id' => 4,
            'name' => 'Isnalda Sylaj',
            'email' => 'dev1@flowza.com',
            'role' => 'programmer',
            'created_at' => '2026-01-04T10:00:00Z',
            'password_hash' => password_hash('dev123', PASSWORD_DEFAULT)
        ],
        [
            'user_id' => 5,
            'name' => 'Jonalda Gjoka',
            'email' => 'dev2@flowza.com',
            'role' => 'programmer',
            'created_at' => '2026-01-05T10:00:00Z',
            'password_hash' => password_hash('dev123', PASSWORD_DEFAULT)
        ],
        [
            'user_id' => 6,
            'name' => 'Herta Guraj',
            'email' => 'dev3@flowza.com',
            'role' => 'programmer',
            'created_at' => '2026-01-06T10:00:00Z',
            'password_hash' => password_hash('dev123', PASSWORD_DEFAULT)
        ],
    ];
}
