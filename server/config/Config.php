<?php
declare(strict_types=1);

session_start();

const API_ORIGIN = '*';
const API_METHODS = 'GET, POST, OPTIONS';
const API_HEADERS = 'Content-Type, Authorization';

function sendSecurityHeaders(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigin = API_ORIGIN;

    if ($origin !== '' && preg_match('/^https?:\/\/localhost(:[0-9]+)?$/i', $origin)) {
        $allowedOrigin = $origin;
    }

    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: ' . API_METHODS);
    header('Access-Control-Allow-Headers: ' . API_HEADERS);
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-XSS-Protection: 1; mode=block');
    header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';");
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Embedder-Policy: require-corp');
}

function handleOptionsRequest(): void
{
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function getDatabasePath(): string
{
    return __DIR__ . '/../database/flowza.sqlite';
}

function getDatabase(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $databasePath = getDatabasePath();
    $databaseExists = file_exists($databasePath);

    $pdo = new PDO('sqlite:' . $databasePath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON;');

    if (!$databaseExists || !databaseHasTables($pdo)) {
        initializeDatabase($pdo);
    }

    return $pdo;
}

function databaseHasTables(PDO $pdo): bool
{
    $result = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")->fetchColumn();
    return is_string($result) && $result !== '';
}

function initializeDatabase(PDO $pdo): void
{
    $pdo->beginTransaction();

    $pdo->exec(<<<'SQL'
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','teamleader','programmer')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS project (
    project_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK(status IN ('new','in progress','done')) DEFAULT 'new',
    priority TEXT NOT NULL CHECK(priority IN ('low','medium','high')),
    start_date TEXT,
    deadline TEXT,
    created_by INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS project_members (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role_in_project TEXT NOT NULL CHECK(role_in_project IN ('teamleader','programmer')),
    assigned_at TEXT NOT NULL,
    PRIMARY KEY(project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS task (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    assigned_to INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    task_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK(status IN ('new','in progress','review','done')) DEFAULT 'new',
    priority TEXT NOT NULL CHECK(priority IN ('low','medium','high')),
    start_date TEXT,
    deadline TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS task_history (
    history_id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    old_status TEXT NOT NULL CHECK(old_status IN ('new','in progress','review','done')),
    new_status TEXT NOT NULL CHECK(new_status IN ('new','in progress','review','done')),
    changed_at TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);
CREATE TABLE IF NOT EXISTS project_files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    task_id INTEGER,
    uploaded_by INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);
SQL
    );

    seedDatabase($pdo);
    $pdo->commit();
}

function seedDatabase(PDO $pdo): void
{
    $users = [
        [
            'name' => 'Admin User',
            'email' => 'admin@flowza.com',
            'password' => 'admin123',
            'role' => 'admin',
            'created_at' => '2026-01-01T10:00:00Z'
        ],
        [
            'name' => 'Helena Kace',
            'email' => 'team1@flowza.com',
            'password' => 'team123',
            'role' => 'teamleader',
            'created_at' => '2026-01-02T10:00:00Z'
        ],
        [
            'name' => 'Erjeta Rrapaj',
            'email' => 'team2@flowza.com',
            'password' => 'team123',
            'role' => 'teamleader',
            'created_at' => '2026-01-03T10:00:00Z'
        ],
        [
            'name' => 'Isnalda Sylaj',
            'email' => 'dev1@flowza.com',
            'password' => 'dev123',
            'role' => 'programmer',
            'created_at' => '2026-01-04T10:00:00Z'
        ],
        [
            'name' => 'Jonalda Gjoka',
            'email' => 'dev2@flowza.com',
            'password' => 'dev123',
            'role' => 'programmer',
            'created_at' => '2026-01-05T10:00:00Z'
        ],
        [
            'name' => 'Herta Guraj',
            'email' => 'dev3@flowza.com',
            'password' => 'dev123',
            'role' => 'programmer',
            'created_at' => '2026-01-06T10:00:00Z'
        ],
    ];

    $insertUser = $pdo->prepare('INSERT INTO users (name, email, password, role, created_at, updated_at)
        VALUES (:name, :email, :password, :role, :created_at, :updated_at)');

    foreach ($users as $user) {
        $insertUser->execute([
            ':name' => $user['name'],
            ':email' => $user['email'],
            ':password' => password_hash($user['password'], PASSWORD_DEFAULT),
            ':role' => $user['role'],
            ':created_at' => $user['created_at'],
            ':updated_at' => $user['created_at'],
        ]);
    }

    $projects = [
        [
            'name' => 'E-Commerce Platform',
            'description' => 'Build a new e-commerce platform with React and Node.js',
            'status' => 'in progress',
            'priority' => 'high',
            'start_date' => '2026-02-01',
            'deadline' => '2026-06-30',
            'created_by' => 1,
            'created_at' => '2026-01-15T10:00:00Z'
        ],
        [
            'name' => 'Mobile App Development',
            'description' => 'Create a mobile app for iOS and Android',
            'status' => 'in progress',
            'priority' => 'medium',
            'start_date' => '2026-03-01',
            'deadline' => '2026-08-31',
            'created_by' => 1,
            'created_at' => '2026-02-20T10:00:00Z'
        ],
        [
            'name' => 'Data Analytics Dashboard',
            'description' => 'Build an analytics dashboard for business intelligence',
            'status' => 'new',
            'priority' => 'low',
            'start_date' => '2026-05-01',
            'deadline' => '2026-10-31',
            'created_by' => 1,
            'created_at' => '2026-04-10T10:00:00Z'
        ],
    ];

    $insertProject = $pdo->prepare('INSERT INTO project (name, description, status, priority, start_date, deadline, created_by, created_at, updated_at)
        VALUES (:name, :description, :status, :priority, :start_date, :deadline, :created_by, :created_at, :updated_at)');

    foreach ($projects as $project) {
        $insertProject->execute([
            ':name' => $project['name'],
            ':description' => $project['description'],
            ':status' => $project['status'],
            ':priority' => $project['priority'],
            ':start_date' => $project['start_date'],
            ':deadline' => $project['deadline'],
            ':created_by' => $project['created_by'],
            ':created_at' => $project['created_at'],
            ':updated_at' => $project['created_at'],
        ]);
    }

    $projectMembers = [
        [ 'project_id' => 1, 'user_id' => 2, 'role_in_project' => 'teamleader', 'assigned_at' => '2026-01-15T11:00:00Z' ],
        [ 'project_id' => 1, 'user_id' => 4, 'role_in_project' => 'programmer', 'assigned_at' => '2026-01-16T10:00:00Z' ],
        [ 'project_id' => 1, 'user_id' => 5, 'role_in_project' => 'programmer', 'assigned_at' => '2026-01-16T10:00:00Z' ],
        [ 'project_id' => 2, 'user_id' => 3, 'role_in_project' => 'teamleader', 'assigned_at' => '2026-02-20T11:00:00Z' ],
        [ 'project_id' => 2, 'user_id' => 6, 'role_in_project' => 'programmer', 'assigned_at' => '2026-02-21T10:00:00Z' ],
    ];

    $insertProjectMember = $pdo->prepare('INSERT INTO project_members (project_id, user_id, role_in_project, assigned_at)
        VALUES (:project_id, :user_id, :role_in_project, :assigned_at)');

    foreach ($projectMembers as $member) {
        $insertProjectMember->execute([
            ':project_id' => $member['project_id'],
            ':user_id' => $member['user_id'],
            ':role_in_project' => $member['role_in_project'],
            ':assigned_at' => $member['assigned_at'],
        ]);
    }

    $tasks = [
        [
            'project_id' => 1,
            'assigned_to' => 4,
            'created_by' => 2,
            'task_name' => 'Setup Project Structure',
            'description' => 'Initialize the project with React, TypeScript, and Tailwind',
            'status' => 'done',
            'priority' => 'high',
            'start_date' => '2026-02-01',
            'deadline' => '2026-02-05T17:00:00Z',
            'created_at' => '2026-01-16T10:00:00Z'
        ],
        [
            'project_id' => 1,
            'assigned_to' => 5,
            'created_by' => 2,
            'task_name' => 'Design Database Schema',
            'description' => 'Create the database schema for products, users, and orders',
            'status' => 'done',
            'priority' => 'high',
            'start_date' => '2026-02-01',
            'deadline' => '2026-02-10T17:00:00Z',
            'created_at' => '2026-01-16T11:00:00Z'
        ],
        [
            'project_id' => 1,
            'assigned_to' => 4,
            'created_by' => 2,
            'task_name' => 'Implement Authentication',
            'description' => 'Build user authentication with JWT tokens',
            'status' => 'in progress',
            'priority' => 'high',
            'start_date' => '2026-02-06',
            'deadline' => '2026-02-20T17:00:00Z',
            'created_at' => '2026-02-05T10:00:00Z'
        ],
        [
            'project_id' => 1,
            'assigned_to' => 5,
            'created_by' => 2,
            'task_name' => 'Create Product Catalog UI',
            'description' => 'Design and implement the product catalog interface',
            'status' => 'review',
            'priority' => 'medium',
            'start_date' => '2026-02-15',
            'deadline' => '2026-03-15T17:00:00Z',
            'created_at' => '2026-02-12T10:00:00Z'
        ],
        [
            'project_id' => 2,
            'assigned_to' => 6,
            'created_by' => 3,
            'task_name' => 'Mobile UI Wireframes',
            'description' => 'Create wireframes for all mobile screens',
            'status' => 'new',
            'priority' => 'high',
            'start_date' => '2026-03-01',
            'deadline' => '2026-03-15T17:00:00Z',
            'created_at' => '2026-02-25T10:00:00Z'
        ],
    ];

    $insertTask = $pdo->prepare('INSERT INTO task (project_id, assigned_to, created_by, task_name, description, status, priority, start_date, deadline, created_at, updated_at)
        VALUES (:project_id, :assigned_to, :created_by, :task_name, :description, :status, :priority, :start_date, :deadline, :created_at, :updated_at)');

    foreach ($tasks as $task) {
        $insertTask->execute([
            ':project_id' => $task['project_id'],
            ':assigned_to' => $task['assigned_to'],
            ':created_by' => $task['created_by'],
            ':task_name' => $task['task_name'],
            ':description' => $task['description'],
            ':status' => $task['status'],
            ':priority' => $task['priority'],
            ':start_date' => $task['start_date'],
            ':deadline' => $task['deadline'],
            ':created_at' => $task['created_at'],
            ':updated_at' => $task['created_at'],
        ]);
    }

    $taskHistory = [
        [ 'task_id' => 1, 'changed_by' => 4, 'old_status' => 'new', 'new_status' => 'in progress', 'changed_at' => '2026-02-01T09:00:00Z' ],
        [ 'task_id' => 1, 'changed_by' => 4, 'old_status' => 'in progress', 'new_status' => 'review', 'changed_at' => '2026-02-04T16:00:00Z' ],
        [ 'task_id' => 1, 'changed_by' => 2, 'old_status' => 'review', 'new_status' => 'done', 'changed_at' => '2026-02-05T10:00:00Z' ],
        [ 'task_id' => 2, 'changed_by' => 5, 'old_status' => 'new', 'new_status' => 'in progress', 'changed_at' => '2026-02-02T09:00:00Z' ],
        [ 'task_id' => 2, 'changed_by' => 5, 'old_status' => 'in progress', 'new_status' => 'done', 'changed_at' => '2026-02-09T15:00:00Z' ],
        [ 'task_id' => 3, 'changed_by' => 4, 'old_status' => 'new', 'new_status' => 'in progress', 'changed_at' => '2026-02-06T09:00:00Z' ],
        [ 'task_id' => 4, 'changed_by' => 5, 'old_status' => 'new', 'new_status' => 'in progress', 'changed_at' => '2026-02-15T09:00:00Z' ],
        [ 'task_id' => 4, 'changed_by' => 5, 'old_status' => 'in progress', 'new_status' => 'review', 'changed_at' => '2026-03-10T16:00:00Z' ],
    ];

    $insertTaskHistory = $pdo->prepare('INSERT INTO task_history (task_id, changed_by, old_status, new_status, changed_at)
        VALUES (:task_id, :changed_by, :old_status, :new_status, :changed_at)');

    foreach ($taskHistory as $history) {
        $insertTaskHistory->execute([
            ':task_id' => $history['task_id'],
            ':changed_by' => $history['changed_by'],
            ':old_status' => $history['old_status'],
            ':new_status' => $history['new_status'],
            ':changed_at' => $history['changed_at'],
        ]);
    }

    $projectFiles = [
        [ 'project_id' => 1, 'task_id' => 1, 'uploaded_by' => 4, 'file_name' => 'project-structure.zip', 'file_path' => '/uploads/project-structure.zip', 'uploaded_at' => '2026-02-04T16:00:00Z' ],
        [ 'project_id' => 1, 'task_id' => 2, 'uploaded_by' => 5, 'file_name' => 'database-schema.sql', 'file_path' => '/uploads/database-schema.sql', 'uploaded_at' => '2026-02-09T15:00:00Z' ],
        [ 'project_id' => 1, 'task_id' => 4, 'uploaded_by' => 5, 'file_name' => 'catalog-ui-mockup.fig', 'file_path' => '/uploads/catalog-ui-mockup.fig', 'uploaded_at' => '2026-03-10T16:00:00Z' ],
    ];

    $insertProjectFile = $pdo->prepare('INSERT INTO project_files (project_id, task_id, uploaded_by, file_name, file_path, uploaded_at)
        VALUES (:project_id, :task_id, :uploaded_by, :file_name, :file_path, :uploaded_at)');

    foreach ($projectFiles as $file) {
        $insertProjectFile->execute([
            ':project_id' => $file['project_id'],
            ':task_id' => $file['task_id'],
            ':uploaded_by' => $file['uploaded_by'],
            ':file_name' => $file['file_name'],
            ':file_path' => $file['file_path'],
            ':uploaded_at' => $file['uploaded_at'],
        ]);
    }
}
