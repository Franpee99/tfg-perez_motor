@component('mail::message')
@if($estado === 'aprobada')
# Devolución aceptada

Hola {{ $devolucion->user->name }},

Tu solicitud de devolución para el pedido **#{{ $devolucion->pedido_id }}** ha sido **aceptada**.

Pronto nos pondremos en contacto contigo para finalizar el proceso.

@else
# Devolución denegada

Hola {{ $devolucion->user->name }},

Tu solicitud de devolución para el pedido **#{{ $devolucion->pedido_id }}** ha sido **denegada**.

Si tienes dudas puedes responder a este correo.

@endif

Gracias por confiar en Pérez Motor.
@endcomponent
