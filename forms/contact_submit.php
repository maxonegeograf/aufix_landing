<?php

declare(strict_types=1);

require_once __DIR__ . '/form_utils.php';

date_default_timezone_set('Europe/Warsaw');

ensure_post();

$name = clean_text($_POST['name'] ?? '');
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL) ?: null;
$messageRaw = trim((string)($_POST['message'] ?? ''));
$message = trim(strip_tags(str_replace(["\r\n", "\r"], "\n", $messageRaw)));

if ($name === '') {
    respond_json('error', 'Podaj swoje imię lub nazwę firmy.', 422);
}

if (!$email) {
    respond_json('error', 'Podaj poprawny adres e-mail.', 422);
}

if ($message === '') {
    respond_json('error', 'Napisz krótką wiadomość.', 422);
}

$submittedAt = (new DateTimeImmutable())->format('Y-m-d H:i');
$subject = AUFIX_EMAIL_SUBJECT_PREFIX . ' – nowe zgłoszenie z formularza kontaktowego';
$bodyLines = [
    'Imię / firma: ' . $name,
    'Adres e-mail: ' . $email,
    'Data zgłoszenia: ' . $submittedAt,
    'Treść wiadomości:',
    $message,
];
$body = implode("\n", $bodyLines);

$headers = build_mail_headers($email);

if (@mail(AUFIX_RECIPIENT_EMAIL, $subject, $body, $headers)) {
    respond_json('success', 'Dziękujemy! Skontaktujemy się wkrótce.');
}

respond_json('error', 'Nie udało się wysłać wiadomości. Spróbuj ponownie później.', 500);
