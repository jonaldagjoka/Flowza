<?php
declare(strict_types=1);

session_start();

const API_ORIGIN = '*';
const API_METHODS = 'GET, POST, OPTIONS';
const API_HEADERS = 'Content-Type, Authorization';

function sendSecurityHeaders(): void
{
    header('Access-Control-Allow-Origin: ' . API_ORIGIN);
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
