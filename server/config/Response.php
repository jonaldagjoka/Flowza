<?php
declare(strict_types=1);

require_once __DIR__ . '/Config.php';

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonPayload(): array
{
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

function badRequest(string $message): void
{
    jsonResponse(['success' => false, 'message' => $message], 400);
}
