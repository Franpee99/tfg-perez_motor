<?php

namespace App\Mail;

use App\Models\Mantenimiento;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecogerVehiculoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $mantenimiento;
    public $pdf;

    public function __construct(Mantenimiento $mantenimiento, $pdf)
    {
        $this->mantenimiento = $mantenimiento;
        $this->pdf = $pdf;
    }

    public function build()
    {
        return $this->subject('¡Tu vehículo ya está listo para recoger!')
            ->markdown('emails.recogerVehiculo')
            ->attachData($this->pdf, "factura-taller.pdf", [
                'mime' => 'application/pdf',
            ]);
    }
}
