@component('mail::message')
# Actualización en tu cita de taller

Hola {{ $citaTaller->user->name }},

Te informamos que el estado de tu cita (matrícula: **{{ $citaTaller->vehiculo->matricula }}**, fecha: **{{ $citaTaller->fecha }}** a las **{{ $citaTaller->hora }}**) ha cambiado a:

@component('mail::panel')
**{{ ucfirst($nuevoEstado) }}**
@endcomponent

@if($nuevoEstado === 'cancelada')
Si no era tu intención, contacta con nosotros cuanto antes para ayudarte a reprogramarla.
@endif

Gracias por confiar en Pérez Motor.
@endcomponent
