<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return file_get_contents(public_path('index.html'));
});

// Catch-all for React Router SPA (except /api routes)
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');
