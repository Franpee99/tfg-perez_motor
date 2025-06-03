<?php

namespace App\Mail;

use App\Models\Devolucion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EstadoDevolucionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $devolucion;
    public $estado;

    public function __construct(Devolucion $devolucion, $estado)
    {
        $this->devolucion = $devolucion;
        $this->estado = $estado;
    }

    public function build()
    {
        $asunto = $this->estado === 'aprobada'
            ? 'Tu solicitud de devolución ha sido aceptada'
            : 'Tu solicitud de devolución ha sido denegada';

        return $this->subject($asunto)
            ->markdown('emails.estadoDevolucion');
    }
}
