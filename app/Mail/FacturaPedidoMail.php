<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Pedido;

class FacturaPedidoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $pedido;
    public $pdf;

    public function __construct(Pedido $pedido, $pdf)
    {
        $this->pedido = $pedido;
        $this->pdf = $pdf;
    }

    public function build()
    {
        return $this->markdown('emails.factura')
            ->subject('Factura de compra - Pérez Motor')
            ->attachData($this->pdf, "factura-{$this->pedido->numero_factura}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }
}
