<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;
    protected $originCityId;

    public function __construct()
    {
        $this->apiKey = config('services.rajaongkir.key');
        $this->baseUrl = rtrim(config('services.rajaongkir.base_url'), '/');
        $this->originCityId = config('services.rajaongkir.origin_city_id');
    }

    public function getProvinces()
    {
        $url = $this->baseUrl . '/destination/province';
        $response = Http::withHeaders(['key' => $this->apiKey])->get($url);

        \Illuminate\Support\Facades\Log::info('RajaOngkir Request (Provinces): ' . $url);

        if ($response->successful()) {
            \Illuminate\Support\Facades\Log::info('RajaOngkir Success (Provinces): ' . $response->body());
            return $response->json()['data'] ?? [];
        }

        \Illuminate\Support\Facades\Log::error('RajaOngkir Error (Provinces): ' . $response->body());
        return [];
    }

    public function getCities($provinceId)
    {
        // Try path parameter based on district pattern
        $url = $this->baseUrl . '/destination/city?province_id=' . $provinceId;
        // Wait, if 404, maybe it is indeed /destination/city/{provinceId} ? 
        // Let's rely on the district pattern: /destination/district/{city_id}
        // So let's try:
        $url = $this->baseUrl . '/destination/city?province_id=' . $provinceId;
        // Actually, let's try the previous one again? No, it 404'd.
        // Let's try path param:
        // $url = $this->baseUrl . '/destination/city/' . $provinceId;
        // BUT, documentation for "Search Domestic Destination" says POST.

        // Let's try: /destination/city?province_id=... with correct header.
        // Maybe the issue was the space in log? " ?province_id=..." ? No that's my log formatting.

        // Let's try /destination/city/{provinceId} as the primary guess now.
        $url = $this->baseUrl . '/destination/city/' . $provinceId;

        $response = Http::withHeaders(['key' => $this->apiKey])->get($url);

        \Illuminate\Support\Facades\Log::info('RajaOngkir Request (Cities): ' . $url);

        if ($response->successful()) {
            return $response->json()['data'] ?? [];
        }

        \Illuminate\Support\Facades\Log::error('RajaOngkir Error (Cities): ' . $response->body());
        return [];
    }

    public function getDistricts($cityId)
    {
        // Consolidate on path param if it worked, or query param? 
        // User said it worked, so path param likely OK: /destination/district/{cityId}
        $url = $this->baseUrl . '/destination/district/' . $cityId;
        $response = Http::withHeaders(['key' => $this->apiKey])->get($url);

        \Illuminate\Support\Facades\Log::info('RajaOngkir Request (Districts): ' . $url);

        if ($response->successful()) {
            return $response->json()['data'] ?? [];
        }

        \Illuminate\Support\Facades\Log::error('RajaOngkir Error (Districts): ' . $response->body());
        return [];
    }

    public function getSubdistricts($districtId)
    {
        // Fix: Correct endpoint is /destination/sub-district/{districtId}
        $url = $this->baseUrl . '/destination/sub-district/' . $districtId;
        $response = Http::withHeaders(['key' => $this->apiKey])->get($url);

        \Illuminate\Support\Facades\Log::info('RajaOngkir Request (Subdistricts): ' . $url);

        if ($response->successful()) {
            return $response->json()['data'] ?? [];
        }

        \Illuminate\Support\Facades\Log::error('RajaOngkir Error (Subdistricts): ' . $response->body());
        return [];
    }

    public function getCost($destinationId, $weight, $courier, $destinationType = 'subdistrict')
    {
        $url = $this->baseUrl . '/calculate/domestic-cost';

        // Map types if necessary. API might expect 'subdistrict' for Kelurahan? Or 'sub-district'?
        // Standard RO Pro uses 'subdistrict' for Kecamatan. 
        // Komerce uses 'district' for Kecamatan, and 'sub-district' endpoint for Kelurahan.
        // Let's assume 'subdistrict' refers to Kelurahan here.

        $payload = [
            'origin' => $this->originCityId,
            'origin_type' => 'city',
            'destination' => $destinationId,
            'destination_type' => $destinationType,
            'weight' => $weight,
            'courier' => $courier,
        ];

        \Illuminate\Support\Facades\Log::info('RajaOngkir Cost Payload: ', $payload);

        $response = Http::withHeaders(['key' => $this->apiKey])
            ->asForm()
            ->post($url, $payload);

        \Illuminate\Support\Facades\Log::info('RajaOngkir Request (Cost): ' . $url);

        if ($response->successful()) {
            \Illuminate\Support\Facades\Log::info('RajaOngkir Success (Cost): ' . $response->body());
            return $response->json()['data'] ?? [];
        }

        \Illuminate\Support\Facades\Log::error('RajaOngkir Error (Cost): ' . $response->body());
        return [];
    }
}
