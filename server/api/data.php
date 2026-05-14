<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../config/Config.php';

sendSecurityHeaders();
handleOptionsRequest();

$pdo = getDatabase();
$method = $_SERVER['REQUEST_METHOD'];
$action = strtolower(trim((string)($_GET['action'] ?? '')));
$type = strtolower(trim((string)($_GET['type'] ?? 'all')));

if ($method === 'POST') {
    if ($action === '') {
        badRequest('Action query parameter is required for POST requests.');
    }
    handlePostAction($pdo, $action);
}

if ($method !== 'GET') {
    badRequest('Only GET and POST requests are supported.');
}

if ($type !== 'all' && !in_array($type, ['users', 'projects', 'project_members', 'tasks', 'task_history', 'project_files'], true)) {
    badRequest('Invalid data type.');
}

if ($type !== 'all') {
    jsonResponse(['success' => true, 'data' => getData($pdo, $type)]);
}

jsonResponse(['success' => true, 'data' => [
    'users' => getData($pdo, 'users'),
    'projects' => getData($pdo, 'projects'),
    'project_members' => getData($pdo, 'project_members'),
    'tasks' => getData($pdo, 'tasks'),
    'task_history' => getData($pdo, 'task_history'),
    'project_files' => getData($pdo, 'project_files'),
]]);

function getData(PDO $pdo, string $type): array
{
    switch ($type) {
        case 'users':
            return $pdo->query('SELECT user_id, name, email, role, created_at FROM users ORDER BY user_id')->fetchAll(PDO::FETCH_ASSOC);
        case 'projects':
            return $pdo->query('SELECT * FROM project ORDER BY project_id')->fetchAll(PDO::FETCH_ASSOC);
        case 'project_members':
            return $pdo->query('SELECT * FROM project_members ORDER BY project_id, user_id')->fetchAll(PDO::FETCH_ASSOC);
        case 'tasks':
            return $pdo->query('SELECT * FROM task ORDER BY task_id')->fetchAll(PDO::FETCH_ASSOC);
        case 'task_history':
            return $pdo->query('SELECT * FROM task_history ORDER BY history_id')->fetchAll(PDO::FETCH_ASSOC);
        case 'project_files':
            return $pdo->query('SELECT * FROM project_files ORDER BY file_id')->fetchAll(PDO::FETCH_ASSOC);
        default:
            badRequest('Unknown data type.');
    }
}

function handlePostAction(PDO $pdo, string $action): void
{
    $payload = getJsonPayload();

    switch ($action) {
        case 'createproject':
            createProject($pdo, $payload);
            break;
        case 'assigntteamleader':
        case 'assignteamleader':
            assignTeamLeader($pdo, $payload);
            break;
        case 'createtask':
            createTask($pdo, $payload);
            break;
        case 'updateprojectstatus':
            updateProjectStatus($pdo, $payload);
            break;
        case 'updatetaskstatus':
            updateTaskStatus($pdo, $payload);
            break;
        case 'uploadfile':
            uploadFile($pdo, $payload);
            break;
        default:
            badRequest('Unknown action.');
    }
}

function createProject(PDO $pdo, array $payload): void
{
    $required = ['name', 'description', 'status', 'priority', 'start_date', 'deadline', 'created_by'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $stmt = $pdo->prepare('INSERT INTO project (name, description, status, priority, start_date, deadline, created_by, created_at, updated_at)
        VALUES (:name, :description, :status, :priority, :start_date, :deadline, :created_by, :created_at, :updated_at)');
    $now = nowIso();
    $stmt->execute([
        ':name' => trim((string)$payload['name']),
        ':description' => trim((string)$payload['description']),
        ':status' => trim((string)$payload['status']),
        ':priority' => trim((string)$payload['priority']),
        ':start_date' => trim((string)$payload['start_date']),
        ':deadline' => trim((string)$payload['deadline']),
        ':created_by' => (int)$payload['created_by'],
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    jsonResponse(['success' => true, 'data' => ['project_id' => (int)$pdo->lastInsertId()]]);
}

function assignTeamLeader(PDO $pdo, array $payload): void
{
    $required = ['project_id', 'user_id'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $projectId = (int)$payload['project_id'];
    $userId = (int)$payload['user_id'];

    $stmt = $pdo->prepare('SELECT 1 FROM project_members WHERE project_id = :project_id AND role_in_project = "teamleader" LIMIT 1');
    $stmt->execute([':project_id' => $projectId]);
    if ($stmt->fetchColumn()) {
        badRequest('This project already has a team leader.');
    }

    $stmt = $pdo->prepare('INSERT INTO project_members (project_id, user_id, role_in_project, assigned_at)
        VALUES (:project_id, :user_id, :role_in_project, :assigned_at)');
    $stmt->execute([
        ':project_id' => $projectId,
        ':user_id' => $userId,
        ':role_in_project' => 'teamleader',
        ':assigned_at' => nowIso(),
    ]);

    jsonResponse(['success' => true, 'data' => ['project_id' => $projectId, 'user_id' => $userId]]);
}

function createTask(PDO $pdo, array $payload): void
{
    $required = ['project_id', 'assigned_to', 'created_by', 'task_name', 'description', 'status', 'priority', 'start_date', 'deadline'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $stmt = $pdo->prepare('INSERT INTO task (project_id, assigned_to, created_by, task_name, description, status, priority, start_date, deadline, created_at, updated_at)
        VALUES (:project_id, :assigned_to, :created_by, :task_name, :description, :status, :priority, :start_date, :deadline, :created_at, :updated_at)');
    $now = nowIso();
    $stmt->execute([
        ':project_id' => (int)$payload['project_id'],
        ':assigned_to' => (int)$payload['assigned_to'],
        ':created_by' => (int)$payload['created_by'],
        ':task_name' => trim((string)$payload['task_name']),
        ':description' => trim((string)$payload['description']),
        ':status' => trim((string)$payload['status']),
        ':priority' => trim((string)$payload['priority']),
        ':start_date' => trim((string)$payload['start_date']),
        ':deadline' => trim((string)$payload['deadline']),
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    jsonResponse(['success' => true, 'data' => ['task_id' => (int)$pdo->lastInsertId()]]);
}

function updateProjectStatus(PDO $pdo, array $payload): void
{
    $required = ['project_id', 'status'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $stmt = $pdo->prepare('UPDATE project SET status = :status, updated_at = :updated_at WHERE project_id = :project_id');
    $stmt->execute([
        ':status' => trim((string)$payload['status']),
        ':updated_at' => nowIso(),
        ':project_id' => (int)$payload['project_id'],
    ]);

    jsonResponse(['success' => true, 'data' => ['project_id' => (int)$payload['project_id'], 'status' => trim((string)$payload['status'])]]);
}

function updateTaskStatus(PDO $pdo, array $payload): void
{
    $required = ['task_id', 'status', 'changed_by'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $taskId = (int)$payload['task_id'];
    $stmt = $pdo->prepare('SELECT status FROM task WHERE task_id = :task_id');
    $stmt->execute([':task_id' => $taskId]);
    $oldStatus = $stmt->fetchColumn();

    if ($oldStatus === false) {
        badRequest('Task not found.');
    }

    if ($oldStatus !== (string)$payload['status']) {
        $pdo->prepare('INSERT INTO task_history (task_id, changed_by, old_status, new_status, changed_at)
            VALUES (:task_id, :changed_by, :old_status, :new_status, :changed_at)')->execute([
                ':task_id' => $taskId,
                ':changed_by' => (int)$payload['changed_by'],
                ':old_status' => (string)$oldStatus,
                ':new_status' => trim((string)$payload['status']),
                ':changed_at' => nowIso(),
        ]);
    }

    $pdo->prepare('UPDATE task SET status = :status, updated_at = :updated_at WHERE task_id = :task_id')->execute([
        ':status' => trim((string)$payload['status']),
        ':updated_at' => nowIso(),
        ':task_id' => $taskId,
    ]);

    jsonResponse(['success' => true, 'data' => ['task_id' => $taskId, 'status' => trim((string)$payload['status'])]]);
}

function uploadFile(PDO $pdo, array $payload): void
{
    $required = ['task_id', 'file_name', 'uploaded_by'];
    foreach ($required as $field) {
        if (!array_key_exists($field, $payload)) {
            badRequest('Missing field: ' . $field);
        }
    }

    $taskId = (int)$payload['task_id'];
    $stmt = $pdo->prepare('SELECT project_id FROM task WHERE task_id = :task_id');
    $stmt->execute([':task_id' => $taskId]);
    $projectId = $stmt->fetchColumn();

    if ($projectId === false) {
        badRequest('Task not found.');
    }

    $stmt = $pdo->prepare('INSERT INTO project_files (project_id, task_id, uploaded_by, file_name, file_path, uploaded_at)
        VALUES (:project_id, :task_id, :uploaded_by, :file_name, :file_path, :uploaded_at)');
    $now = nowIso();
    $stmt->execute([
        ':project_id' => (int)$projectId,
        ':task_id' => $taskId,
        ':uploaded_by' => (int)$payload['uploaded_by'],
        ':file_name' => trim((string)$payload['file_name']),
        ':file_path' => '/uploads/' . basename(trim((string)$payload['file_name'])),
        ':uploaded_at' => $now,
    ]);

    jsonResponse(['success' => true, 'data' => ['file_id' => (int)$pdo->lastInsertId()]]);
}

function nowIso(): string
{
    return (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d\TH:i:s\Z');
}
