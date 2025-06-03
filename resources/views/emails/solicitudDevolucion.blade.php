@component('mail::message')
# Solicitud de devolución recibida

Hola {{ $devolucion->user->name }},

Hemos recibido tu solicitud de devolución para el pedido **#{{ $devolucion->pedido_id }}**.

**Motivo:** {{ $devolucion->mensaje }}

Nos pondremos en contacto contigo lo antes posible para gestionar la devolución.

Si tienes cualquier duda, puedes responder a este correo.

Gracias por confiar en Pérez Motor.

@endcomponent
