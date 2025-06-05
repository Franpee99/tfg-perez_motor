<?php

namespace App\Mail;

use App\Models\Devolucion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SolicitudDevolucionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $devolucion;

    public function __construct(Devolucion $devolucion)
    {
        $this->devolucion = $devolucion;
    }

    public function build()
    {
        return $this->subject('Solicitud de devolución recibida')
            ->markdown('emails.solicitudDevolucion');
    }
}
