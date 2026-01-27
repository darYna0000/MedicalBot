<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$GEMINI_KEY = "AIzaSyC76ISeiTICDxpz7saCgfZn5RPrL32K2UU"; // Отриманий у Google AI Studio
$GHL_KEY = "ВАШ_API_KEY_ВІД_GOHIGHLEVEL";     // З налаштувань CRM
$BOT_TOKEN = "8235607344:AAGh-4i35bBais_xwnAlxXR6HKnZFJFfBhA";       

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'gemini') {
    $url = "https://generativelanguage.googleapis.com/v1beta/models/" . $input['model'] . ":generateContent?key=" . $GEMINI_KEY;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input['data']));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    echo curl_exec($ch);
    curl_close($ch);
}

if ($action === 'ghl') {
    $url = $input['url'];
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input['data']));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $GHL_KEY,
        'Version: 2021-07-28',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    echo curl_exec($ch);
    curl_close($ch);
}
?>