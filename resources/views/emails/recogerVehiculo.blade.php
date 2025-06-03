@component('mail::message')
# ¡Tu vehículo ya está listo!

Hola {{ $mantenimiento->vehiculo->user->name }},

Te informamos que el mantenimiento de tu vehículo (matrícula: **{{ $mantenimiento->vehiculo->matricula }}**) ha finalizado.

Puedes pasar a recogerlo dentro del horario habitual del taller.

@if($mantenimiento->observaciones)
**Observaciones:**
{{ $mantenimiento->observaciones }}
@endif

Adjuntamos en este correo la factura correspondiente al parte de trabajo realizado para que puedas consultarla y conservarla para tu documentación.

Agradecemos tu confianza en **Pérez Motor**.
Si tienes cualquier consulta adicional, no dudes en responder a este correo.

Saludos cordiales,
**El equipo de Pérez Motor**
@endcomponent
