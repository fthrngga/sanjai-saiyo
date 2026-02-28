<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Http;

$key = env('RAJAONGKIR_API_KEY', 'l5XpEoXY3f687ab4a8b7ab9bB87X8dxa');
$url1 = 'https://rajaongkir.komerce.id/api/v1/destination/city?province_id=32';

$result = Http::withHeaders(['key' => $key])->get($url1)->json();
foreach($result['data'] as $c) {
     if(stripos($c['name'], 'PAYAK') !== false || stripos($c['name'], 'LIMA') !== false) {
         echo $c['name'] . " - ID " . $c['id'] . "\n";
     }
}
