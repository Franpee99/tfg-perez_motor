<?php

namespace App\Mail;

use App\Models\CitaTaller;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EstadoCitaTallerMail extends Mailable
{
    use Queueable, SerializesModels;

    public $citaTaller;
    public $nuevoEstado;

    public function __construct(CitaTaller $citaTaller, $nuevoEstado)
    {
        $this->citaTaller = $citaTaller;
        $this->nuevoEstado = $nuevoEstado;
    }

    public function build()
    {
        return $this->subject("Estado de tu cita: {$this->nuevoEstado}")
            ->markdown('emails.estadoCitaTaller');
    }
}
