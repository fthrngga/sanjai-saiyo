<?php

namespace App\Services;

class QrisService
{
    /**
     * Generate Dynamic QRIS EMVCo from Static QRIS by injecting Tag 54
     *
     * @param string $staticQris
     * @param int $amount
     * @return string
     */
    public function generateDynamicQris(string $staticQris, int $amount): string
    {
        // Check if string ends with 6304 and 4 chars CRC
        $baseQris = substr($staticQris, 0, -8);

        // Format Tag 54 (Transaction Amount)
        $amountStr = (string)$amount;
        $length = str_pad((string)strlen($amountStr), 2, '0', STR_PAD_LEFT);
        $tag54 = '54' . $length . $amountStr;

        // Append Tag 54, then append '6304' to calculate CRC for the new payload
        $payload = $baseQris . $tag54 . '6304';

        // Calculate and append new CRC16
        $crc = $this->calculateCRC16($payload);

        return $payload . $crc;
    }

    /**
     * Calculate CRC16 CCITT-FALSE
     *
     * @param string $data
     * @return string
     */
    private function calculateCRC16(string $data): string
    {
        $crc = 0xFFFF;
        $length = strlen($data);
        for ($i = 0; $i < $length; $i++) {
            $x = (($crc >> 8) ^ ord($data[$i])) & 0xFF;
            $x ^= $x >> 4;
            $crc = (($crc << 8) ^ ($x << 12) ^ ($x << 5) ^ $x) & 0xFFFF;
        }
        return strtoupper(str_pad(dechex($crc), 4, '0', STR_PAD_LEFT));
    }
}
