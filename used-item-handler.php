<?php
// Sends the "Ask About This Item" form (used equipment detail pages) via PHP mail().
// Separate inbox from the main contact form, and includes which item was asked about.

$to = "sales@vdaudiorentals.com";
$siteName = "VD Audio Rental";
$allowedHost = "vdaudiorentals.com";

$throttleFile = __DIR__ . "/.used-item-throttle.json";
$throttleWindowSeconds = 15 * 60; // 15 minutes
$throttleMaxPerWindow = 5;        // max submissions per IP in that window

function clean_field($value) {
    $value = trim($value ?? "");
    // Strip line breaks to prevent email header injection via any field.
    return str_replace(["\r", "\n"], "", $value);
}

function safe_return_path($value) {
    // Only allow a plain relative filename like "bss-fcs-960.html" — no
    // absolute URLs, no "..", no query strings — so this can't be abused
    // as an open redirect.
    $value = clean_field($value);
    if ($value === "" || !preg_match('/^[a-zA-Z0-9\-_]+\.html$/', $value)) {
        return "../used-equipment.html";
    }
    return $value;
}

function reject($url) {
    header("Location: " . $url);
    exit;
}

$returnTo = safe_return_path($_POST["return_to"] ?? "");
$redirectOk = $returnTo . "?asked=1#ask-about-item";
$redirectError = $returnTo . "?asked=0#ask-about-item";
$redirectThrottled = $returnTo . "?asked=throttled#ask-about-item";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    reject($redirectError);
}

// Same-origin check: reject POSTs that didn't come from our own site.
$referer = $_SERVER["HTTP_REFERER"] ?? "";
if ($referer === "" || stripos(parse_url($referer, PHP_URL_HOST) ?? "", $allowedHost) === false) {
    reject($redirectError);
}

// Honeypot: real visitors never fill this hidden field, bots usually do.
if (!empty($_POST["website"] ?? "")) {
    reject($redirectOk); // pretend success so the bot doesn't retry
}

// Time-trap: the page sets this via JS when it loads. Real visitors take at
// least a few seconds to fill the form; bots that submit instantly get
// rejected.
$loadedAt = (int)($_POST["loaded_at"] ?? 0);
$elapsed = time() - $loadedAt;
if ($loadedAt <= 0 || $elapsed < 3 || $elapsed > 3600) {
    reject($redirectError);
}

// Per-IP rate limit using a small JSON file (no database needed).
$ip = $_SERVER["REMOTE_ADDR"] ?? "unknown";
$ipKey = hash("sha256", $ip);
$now = time();

$handle = fopen($throttleFile, "c+");
if ($handle) {
    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $store = json_decode($raw, true);
    if (!is_array($store)) {
        $store = [];
    }

    foreach ($store as $key => $timestamps) {
        $store[$key] = array_values(array_filter($timestamps, function ($t) use ($now, $throttleWindowSeconds) {
            return ($now - $t) < $throttleWindowSeconds;
        }));
        if (empty($store[$key])) {
            unset($store[$key]);
        }
    }

    $recent = $store[$ipKey] ?? [];
    if (count($recent) >= $throttleMaxPerWindow) {
        flock($handle, LOCK_UN);
        fclose($handle);
        reject($redirectThrottled);
    }

    $recent[] = $now;
    $store[$ipKey] = $recent;

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($store));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

$itemName = clean_field($_POST["item"] ?? "");
$name = clean_field($_POST["name"] ?? "");
$email = clean_field($_POST["email"] ?? "");
$phone = clean_field($_POST["phone"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($itemName === "" || $name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reject($redirectError);
}

$subject = "Used gear inquiry: " . $itemName . " (from " . $name . ")";

$bodyLines = [
    "New \"Ask About This Item\" request from the " . $siteName . " website:",
    "",
    "Item: " . $itemName,
    "Name: " . $name,
    "Email: " . $email,
    "Phone: " . ($phone !== "" ? $phone : "-"),
    "",
    "Message:",
    ($message !== "" ? $message : "-"),
];
$body = implode("\n", $bodyLines);

$headers = "From: " . $siteName . " Website <no-reply@vdaudiorentals.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

reject($sent ? $redirectOk : $redirectError);