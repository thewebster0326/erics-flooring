<?php
session_start();

function redirect_with_status(string $key, string $value): void
{
    header('Location: index.html?' . $key . '=' . rawurlencode($value) . '#contact');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    redirect_with_status('error', 'method');
}

if (!empty($_POST['website'])) {
    redirect_with_status('sent', '1');
}

$started = filter_var($_POST['form_started'] ?? '', FILTER_VALIDATE_FLOAT);
if ($started === false || microtime(true) * 1000 - $started < 2000) {
    redirect_with_status('error', 'timing');
}

$token = preg_replace('/[^a-f0-9]/', '', strtolower((string) ($_POST['captcha_token'] ?? '')));
$challenge = $_SESSION['captcha'][$token] ?? null;
unset($_SESSION['captcha'][$token]);
if (!$challenge || $challenge['expires'] < time() || !hash_equals((string) $challenge['answer'], trim((string) ($_POST['captcha_answer'] ?? '')))) {
    redirect_with_status('error', 'captcha');
}

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$location = trim((string) ($_POST['location'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $service === '' || $message === '') {
    redirect_with_status('error', 'required');
}
if (strlen($name) > 150 || strlen($phone) > 80 || strlen($service) > 150 || strlen($location) > 250 || strlen($message) > 10000) {
    redirect_with_status('error', 'required');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    redirect_with_status('error', 'email');
}

$recipient = getenv('CONTACT_TO') ?: 'info@ericsflooring.co.za';
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    $recipient = 'info@ericsflooring.co.za';
}

$subject = 'New flooring quote request from ' . str_replace(["\r", "\n"], '', $name);
$body = implode("\n", [
    'New quote request from the Eric\'s Flooring website',
    '',
    'Name: ' . $name,
    'Phone: ' . $phone,
    'Email: ' . ($email ?: 'Not supplied'),
    'Service: ' . $service,
    'Location: ' . ($location ?: 'Not supplied'),
    '',
    'Project details:',
    $message,
]);
$headers = [
    'From: Eric\'s Flooring Website <no-reply@ericsflooring.co.za>',
    'Content-Type: text/plain; charset=UTF-8',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

if (!mail($recipient, $subject, wordwrap($body, 70), implode("\r\n", $headers))) {
    redirect_with_status('error', 'mail');
}

redirect_with_status('sent', '1');
