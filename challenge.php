<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$a = random_int(1, 9);
$b = random_int(1, 9);
$token = bin2hex(random_bytes(16));
$now = time();
$_SESSION['captcha'][$token] = ['answer' => $a + $b, 'expires' => $now + 1800];
$_SESSION['captcha'] = array_filter(
    $_SESSION['captcha'],
    static fn($challenge) => $challenge['expires'] >= $now
);

echo json_encode(['question' => "$a + $b = ?", 'token' => $token]);
