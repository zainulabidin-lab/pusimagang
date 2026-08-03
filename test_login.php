<?php

$ch = curl_init('http://127.0.0.1:8000/api/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'email' => 'admin@unmer.ac.id',
    'password' => 'password'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$error = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Code: $http_code\n";
echo "Response: $response\n";
if ($error) {
    echo "Error: $error\n";
}
curl_close($ch);
