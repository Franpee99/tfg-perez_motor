@component('mail::message')
# ¡Gracias por tu compra en Pérez Motor!

Adjuntamos la factura de tu pedido **#{{ $pedido->numero_factura }}**.

Si tienes cualquier duda, responde a este correo.

Saludos,<br>
**Pérez Motor**
@endcomponent
