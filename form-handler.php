<?php
// Sends the "Request a Quote" form on contact.html to the address below via PHP mail().
// Requires the hosting plan to support PHP and have mail() enabled/configured.

$to = "info@vdaudiorentals.com";
$siteName = "VD Audio Rental";
$allowedHost = "vdaudiorentals.com";
$redirectOk = "contact.html?sent=1#contact-form";
$redirectError = "contact.html?sent=0#contact-form";
$redirectThrottled = "contact.html?sent=throttled#contact-form";

$throttleFile = __DIR__ . "/.form-throttle.json";
$throttleWindowSeconds = 15 * 60; // 15 minutes
$throttleMaxPerWindow = 5;        // max submissions per IP in that window

function clean_field($value) {
    $value = trim($value ?? "");
    // Strip line breaks to prevent email header injection via any field.
    return str_replace(["\r", "\n"], "", $value);
}

function reject($url) {
    header("Location: " . $url);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    reject($redirectError);
}

// Same-origin check: reject POSTs that didn't come from our own contact page.
// Easy to spoof, but filters out lazy/automated form-blasters that hit the
// endpoint directly without ever loading the site.
$referer = $_SERVER["HTTP_REFERER"] ?? "";
if ($referer === "" || stripos(parse_url($referer, PHP_URL_HOST) ?? "", $allowedHost) === false) {
    reject($redirectError);
}

// Honeypot: real visitors never fill this hidden field, bots usually do.
if (!empty($_POST["website"] ?? "")) {
    reject($redirectOk); // pretend success so the bot doesn't retry
}

// Time-trap: the contact page sets this via JS when it loads. Real visitors
// take at least a few seconds to fill the form; bots that submit instantly
// (or that never ran the JS at all) get rejected.
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

    // Drop old entries so the file doesn't grow forever.
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

$name = clean_field($_POST["name"] ?? "");
$company = clean_field($_POST["company"] ?? "");
$email = clean_field($_POST["email"] ?? "");
$phone = clean_field($_POST["phone"] ?? "");
$inquiryType = clean_field($_POST["inquiry-type"] ?? "");
$details = trim($_POST["details"] ?? "");

if ($name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reject($redirectError);
}

$subject = "New quote request from " . $name . ($company !== "" ? " (" . $company . ")" : "");

$bodyLines = [
    "New request submitted through the " . $siteName . " website:",
    "",
    "Name: " . $name,
    "Company: " . ($company !== "" ? $company : "-"),
    "Email: " . $email,
    "Phone: " . ($phone !== "" ? $phone : "-"),
    "Inquiry type: " . ($inquiryType !== "" ? $inquiryType : "-"),
    "",
    "Project details:",
    ($details !== "" ? $details : "-"),
];
$body = implode("\n", $bodyLines);

$headers = "From: " . $siteName . " Website <no-reply@vdaudiorentals.com>\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

reject($sent ? $redirectOk : $redirectError);