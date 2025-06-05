<?php

namespace App\Mail;

use App\Models\CitaTaller;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CitaReservadaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $cita;

    public function __construct(CitaTaller $cita)
    {
        $this->cita = $cita;
    }

    public function build()
    {
        return $this->markdown('emails.citaReservada')
            ->subject('Cita confirmada - Pérez Motor');
        }
}
