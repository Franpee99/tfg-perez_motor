@component('mail::message')
# Pedido Cancelado

Hola {{ $pedido->user->name }},

Lamentamos informarte que tu pedido **#{{ $pedido->numero_factura }}** ha sido cancelado.

Si tienes alguna duda, contáctanos.

Gracias por confiar en Pérez Motor.

@endcomponent
