<?php

$ch = curl_init('http://127.0.0.1:8080/api/login');
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
$token = json_decode($response)->data->access_token;
curl_close($ch);

$ch2 = curl_init('http://127.0.0.1:8080/api/dashboard');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $token
]);
$resp2 = curl_exec($ch2);
echo $resp2;
