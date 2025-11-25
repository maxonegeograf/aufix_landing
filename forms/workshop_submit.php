<?php

declare(strict_types=1);

require_once __DIR__ . '/form_utils.php';

date_default_timezone_set('Europe/Warsaw');

ensure_post();

$company = clean_text($_POST['company'] ?? '');
$phoneRaw = clean_text($_POST['phone'] ?? '');
$phoneDigits = preg_replace('/\D+/', '', $phoneRaw ?? '');

if ($phoneDigits !== null && strlen($phoneDigits) > 9) {
    if (strpos($phoneDigits, '48') === 0) {
        $phoneDigits = substr($phoneDigits, 2);
    }
    if (strlen($phoneDigits) > 9) {
        $phoneDigits = substr($phoneDigits, -9);
    }
}

if ($company === '') {
    respond_json('error', 'Podaj nazwę firmy.', 422);
}

if (!$phoneDigits || strlen($phoneDigits) < 9) {
    respond_json('error', 'Podaj poprawny numer telefonu.', 422);
}

$normalizedDigits = substr($phoneDigits, 0, 9);
$chunks = str_split($normalizedDigits, 3);
$formattedPhone = '+48 ' . implode(' ', $chunks);
$submittedAt = (new DateTimeImmutable())->format('Y-m-d H:i');
$subject = AUFIX_EMAIL_SUBJECT_PREFIX . ' – nowe zgłoszenie warsztatu';
$bodyLines = [
    'Nazwa firmy: ' . $company,
    'Telefon: ' . $formattedPhone,
    'Data zgłoszenia: ' . $submittedAt,
];
$body = implode("\n", $bodyLines);

$headers = build_mail_headers();

if (@mail(AUFIX_RECIPIENT_EMAIL, $subject, $body, $headers)) {
    respond_json('success', 'Dziękujemy! Skontaktujemy się w sprawie współpracy.');
}

respond_json('error', 'Nie udało się wysłać formularza. Spróbuj ponownie później.', 500);
