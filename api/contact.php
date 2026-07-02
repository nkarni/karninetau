<?php
// Simple contact-form handler. Accepts a JSON or form POST, validates,
// checks a honeypot, and emails the message. Returns JSON.

declare(strict_types=1);

// --- Configuration -----------------------------------------------------------
// Where contact messages are delivered.
const RECIPIENT = 'nk@karni.net.au';
// Shown as the From address; keep it on your own domain so mail isn't rejected.
const FROM_ADDRESS = 'no-reply@karni.net.au';
// -----------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

// Support both JSON and classic form-encoded submissions.
$raw = file_get_contents('php://input');
$data = [];
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $data = $decoded;
    }
}
if (!$data) {
    $data = $_POST;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$honeypot = trim((string)($data['company'] ?? '')); // hidden field; humans leave blank

// Honeypot: silently accept so bots don't learn, but send nothing.
if ($honeypot !== '') {
    respond(200, ['ok' => true]);
}

$errors = [];
if ($name === '') {
    $errors[] = 'name';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if ($message === '') {
    $errors[] = 'message';
}

if ($errors) {
    respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $errors]);
}

$subject = 'Website enquiry from ' . $name;
$body = "Name: {$name}\n"
    . "Email: {$email}\n\n"
    . "Message:\n{$message}\n";

// Header injection guard: strip newlines from anything used in headers.
$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$safeEmail = preg_replace('/[\r\n]+/', ' ', $email);

$headers = [
    'From: ' . $safeName . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail(RECIPIENT, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'Sorry, the message could not be sent. Please email nk@karni.net.au directly.']);
}

respond(200, ['ok' => true]);
