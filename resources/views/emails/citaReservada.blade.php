@component('mail::message')
# ¡Cita en el taller reservada!

Te confirmamos que tu cita en Pérez Motor ha sido reservada con éxito.
Aquí tienes los detalles de tu reserva:

---

@component('mail::panel')
**Fecha:** {{ \Carbon\Carbon::parse($cita->fecha)->format('d/m/Y') }}
**Hora:** {{ substr($cita->hora, 0, 5) }}
**Matrícula:** {{ $cita->vehiculo->matricula ?? '-' }}
**Marca:** {{ $cita->vehiculo->marca ?? '-' }}
**Modelo:** {{ $cita->vehiculo->modelo ?? '-' }}
**Motivo:**
@switch($cita->motivo)
    @case('mantenimiento')
        Mantenimiento
        @break
    @case('reparacion')
        Reparación
        @break
    @case('otro')
        Otro
        @break
    @default
        -
@endswitch

@if(!empty($cita->mensaje))
**Mensaje:**
{{ $cita->mensaje }}
@endif
@endcomponent

---

Te esperamos en el taller.
Si tienes cualquier duda, puedes responder a este correo.

Saludos,<br>
**Pérez Motor**
@endcomponent
