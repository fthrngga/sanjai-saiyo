<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification
{
    use Queueable;

    public $productName;
    public $variantName;
    public $remainingStock;

    /**
     * Create a new notification instance.
     */
    public function __construct($productName, $variantName, $remainingStock)
    {
        $this->productName = $productName;
        $this->variantName = $variantName;
        $this->remainingStock = $remainingStock;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'low_stock',
            'product_name' => $this->productName,
            'variant_name' => $this->variantName,
            'remaining_stock' => $this->remainingStock,
            'message' => "Stok menipis! {$this->productName}" . ($this->variantName ? " ({$this->variantName})" : "") . " tersisa {$this->remainingStock} buah.",
        ];
    }
}
