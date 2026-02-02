<?php

use Illuminate\Support\Facades\Http;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$apiKey = config('services.rajaongkir.key');
$baseUrl = rtrim(config('services.rajaongkir.base_url'), '/');
$districtId = 167; // Example from logs

$endpoints = [
    '/destination/subdistrict/' . $districtId,
    '/destination/sub-district/' . $districtId,
    '/destination/village/' . $districtId,
    '/destination/kelurahan/' . $districtId,
    '/destination/subdistrict?district_id=' . $districtId,
    '/subdistrict?district=' . $districtId,
    '/village?district_id=' . $districtId,
];

echo "Testing Endpoints for District ID: $districtId\n";

foreach ($endpoints as $path) {
    $url = $baseUrl . $path;
    echo "Trying: $url ... ";
    try {
        $response = Http::withHeaders(['key' => $apiKey])->get($url);
        echo $response->status();
        if ($response->successful()) {
            echo " - SUCCESS!\n";
            echo substr($response->body(), 0, 200) . "...\n";
        } else {
            echo " - Failed\n";
        }
    } catch (\Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
