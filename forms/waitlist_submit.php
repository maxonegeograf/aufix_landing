<?php

declare(strict_types=1);

require_once __DIR__ . '/form_utils.php';

date_default_timezone_set('Europe/Warsaw');

ensure_post();

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$source = clean_text($_POST['source'] ?? 'Strona główna');

if (!$email) {
    respond_json('error', 'Podaj poprawny adres e-mail.', 422);
}

$submittedAt = (new DateTimeImmutable())->format('Y-m-d H:i');
$subject = AUFIX_EMAIL_SUBJECT_PREFIX . ' – nowy zapis na listę oczekujących';
$body = "Źródło zgłoszenia: {$source}\n" .
        "Adres e-mail: {$email}\n" .
        "Data zgłoszenia: {$submittedAt}";

$headers = build_mail_headers($email);

if (@mail(AUFIX_RECIPIENT_EMAIL, $subject, $body, $headers)) {
    respond_json('success', 'Dziękujemy! Zapisaliśmy Cię na listę oczekujących.');
}

respond_json('error', 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie później.', 500);
