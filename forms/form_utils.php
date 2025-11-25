<?php

declare(strict_types=1);

const AUFIX_RECIPIENT_EMAIL = 'biuro@aufix.pl';
const AUFIX_DEFAULT_SENDER = 'no-reply@aufix.pl';
const AUFIX_EMAIL_SUBJECT_PREFIX = 'Aufix';

function respond_json(string $status, string $message, int $code = 200): void
{
    if (!headers_sent()) {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
    }

    echo json_encode([
        'status' => $status,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ensure_post(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        respond_json('error', 'Metoda niedozwolona.', 405);
    }
}

function clean_text(?string $value): string
{
    return trim(strip_tags((string) $value));
}

function build_mail_headers(?string $replyTo = null): string
{
    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-Type: text/plain; charset=UTF-8' . "\r\n";
    $headers .= 'From: Aufix <' . AUFIX_DEFAULT_SENDER . '>' . "\r\n";

    if ($replyTo) {
        $headers .= 'Reply-To: ' . $replyTo . "\r\n";
    }

    return $headers;
}
