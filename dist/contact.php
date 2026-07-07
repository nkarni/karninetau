<?php
/**
 * Contact form endpoint for the static site.
 *
 * PHPMailer is bundled in lib/phpmailer/ (no Composer on the server).
 * Deploy contact.php next to index.html. Then on the server:
 *   cp smtp-config.example.php smtp-config.php   (edit with real SMTP settings)
 *
 * Expects POST: name, email, message. Honeypots: website, company (must be empty).
 * Optional: Cloudflare Turnstile when turnstile_secret is set in smtp-config.php (cf-turnstile-response).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = __DIR__ . '/smtp-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Email is not configured yet (missing smtp-config.php).',
    ]);
    exit;
}

/** @var array<string, mixed> $config */
$config = require $configPath;

/**
 * Cloudflare Turnstile siteverify (optional captcha when turnstile_secret is set in smtp-config.php).
 */
function contact_turnstile_verify(string $secret, string $response): bool
{
    if ($response === '') {
        return false;
    }
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $payload = http_build_query([
        'secret' => $secret,
        'response' => $response,
        'remoteip' => isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '',
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch === false) {
            return false;
        }
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_TIMEOUT => 15,
        ]);
        $raw = curl_exec($ch);
        curl_close($ch);
        if ($raw === false) {
            return false;
        }
    } else {
        $ctx = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $payload,
                'timeout' => 15,
            ],
        ]);
        $raw = @file_get_contents($url, false, $ctx);
    }

    if ($raw === false || $raw === '') {
        return false;
    }
    $data = json_decode($raw, true);

    return is_array($data) && !empty($data['success']);
}

// Honeypots — must stay empty (hidden fields; bots often fill them).
$honeypotFields = ['website', 'company'];
foreach ($honeypotFields as $hp) {
    if (trim((string) ($_POST[$hp] ?? '')) !== '') {
        echo json_encode(['ok' => true]);
        exit;
    }
}

$turnSecret = trim((string) ($config['turnstile_secret'] ?? ''));
if ($turnSecret !== '') {
    $tok = trim((string) ($_POST['cf-turnstile-response'] ?? ''));
    if ($tok === '' || !contact_turnstile_verify($turnSecret, $tok)) {
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'Spam check failed. Please reload the page and try again.',
        ]);
        exit;
    }
}

$lib = __DIR__ . '/lib/phpmailer';
$required = ["{$lib}/Exception.php", "{$lib}/PHPMailer.php", "{$lib}/SMTP.php"];
foreach ($required as $file) {
    if (!is_file($file)) {
        http_response_code(500);
        echo json_encode([
            'ok' => false,
            'error' => 'Mail library files are missing from lib/phpmailer/. Re-upload the site build.',
        ]);
        exit;
    }
}
require_once "{$lib}/Exception.php";
require_once "{$lib}/PHPMailer.php";
require_once "{$lib}/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || mb_strlen($name) > 200) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid name.']);
    exit;
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

if ($message === '' || mb_strlen($message) > 8000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please enter a message (not too long).']);
    exit;
}

$host = (string) ($config['host'] ?? '');
$port = (int) ($config['port'] ?? 587);
$encryption = (string) ($config['encryption'] ?? 'tls');
$username = (string) ($config['username'] ?? '');
$password = (string) ($config['password'] ?? '');
$fromEmail = (string) ($config['from_email'] ?? '');
$fromName = (string) ($config['from_name'] ?? 'Website');
$toEmail = (string) ($config['to_email'] ?? '');
$prefix = (string) ($config['subject_prefix'] ?? '[Contact]');

if ($host === '' || $fromEmail === '' || $toEmail === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'SMTP configuration is incomplete.']);
    exit;
}

$mail = new PHPMailer(true);
// Expose SMTP message in JSON: set show_mail_errors in smtp-config.php, OR create empty file .contact-mail-debug here.
$exposeErrors =
    !empty($config['show_mail_errors']) || is_file(__DIR__ . '/.contact-mail-debug');

try {
    $mail->isSMTP();
    $mail->Host = $host;
    $mail->SMTPAuth = true;
    $mail->Username = $username;
    $mail->Password = $password;
    $mail->Port = $port;
    $mail->Timeout = max(15, min(120, (int) ($config['timeout'] ?? 30)));

    if ($encryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    } elseif ($encryption === 'ssl') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = false;
        $mail->SMTPAutoTLS = false;
    }

    /** Many shared hosts use certs that PHP's OpenSSL rejects; try only if TLS/connect fails */
    if (!empty($config['smtp_insecure_tls'])) {
        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true,
            ],
        ];
    }

    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->setFrom($fromEmail, $fromName);
    $mail->addAddress($toEmail);
    $mail->addReplyTo($email, $name);

    $mail->Subject = $prefix . ' ' . $name;

    $messageNorm = str_replace(["\r\n", "\r"], "\n", $message);
    $plainBody = "From: {$name}\r\nEmail: {$email}\r\n\r\n" . str_replace("\n", "\r\n", $messageNorm);

    $escName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $escEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $escMessage = htmlspecialchars($messageNorm, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $mailto = 'mailto:' . htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    $mail->isHTML(true);
    $mail->Body =
        '<p><strong>From:</strong> ' . $escName . '</p>' .
        '<p><strong>Email:</strong> <a href="' . $mailto . '">' . $escEmail . '</a></p>' .
        '<p><strong>Message:</strong></p>' .
        '<p style="white-space:pre-wrap">' . $escMessage . '</p>';
    $mail->AltBody = $plainBody;

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (\Throwable $e) {
    http_response_code(500);
    $msg = $e->getMessage();
    error_log('contact.php SMTP error (' . $host . ':' . $port . ' ' . $encryption . '): ' . $msg);
    // Same folder as contact.php; read via FTP/SSH (may be web-accessible on some hosts — delete after debugging).
    $lastErrFile = __DIR__ . '/.smtp-last-error.txt';
    @file_put_contents($lastErrFile, gmdate('Y-m-d\TH:i:s\Z') . "\n" . $msg . "\n", LOCK_EX);
    echo json_encode([
        'ok' => false,
        'error' => $exposeErrors ? $msg : 'Could not send message. Please try again later.',
    ]);
}
