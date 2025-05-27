<?php

namespace App\Http\Controllers;

use App\Mail\FacturaPedidoMail;
use App\Models\DetallePedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\LineaCarrito;
use App\Models\Pedido;
use App\Services\JasperService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PagoController extends Controller
{

    public function procesarPago(Request $request)
    {
        $estadoPago = $request->input('detalles.purchase_units.0.payments.captures.0.status');

        if ($estadoPago !== 'COMPLETED') {
            return response()->json([
                'mensaje' => 'El pago no se completó correctamente'
            ], 400);
        }

        // Actualizar el stock de los productos no guardados
        $lineas = LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->get();

        foreach ($lineas as $linea) {

            // Si el producto ha sido eliminado
            if (!$linea->producto) {
                return response()->json([
                    'mensaje' => 'Uno de los productos de tu carrito ya no está disponible. Por favor, actualiza tu carrito.'
                ], 400);
            }
            // Comprobar stock disponible antes de decrementar
            $stockDisponible = DB::table('producto_talla')
                ->where('producto_id', $linea->producto_id)
                ->where('talla_id', $linea->talla_id)
                ->value('stock');

            if ($stockDisponible < $linea->cantidad || $linea->cantidad <= 0) {
                return response()->json([
                    'mensaje' => 'No hay suficiente stock disponible para completar la compra.'
                ], 400);
            }
        }
        // Ya decrementamos el stock
        foreach ($lineas as $linea) {
            DB::table('producto_talla')
                ->where('producto_id', $linea->producto_id)
                ->where('talla_id', $linea->talla_id)
                ->decrement('stock', $linea->cantidad);
        }

        // Creacion Pedido
        $total = $request->input('detalles.purchase_units.0.amount.value');
        $captureID = $request->input('captureID');

        do {
            $numeroFactura = 'FAC-' . date('Ymd') . '-' . Str::upper(Str::random(6));
        } while (Pedido::where('numero_factura', $numeroFactura)->exists());

        $pedido = Pedido::create([
            'user_id' => Auth::id(),
            'estado' => 'pendiente',
            'total' => $total,
            'numero_factura' => $numeroFactura,
            'paypal_capture_id' => $captureID,
        ]);

        // Creacion de Detalle_Pedido
        foreach ($lineas as $linea) {
            DetallePedido::create([
                'pedido_id'   => $pedido->id,
                'producto_id' => $linea->producto_id,
                'talla_id'    => $linea->talla_id,
                'cantidad'    => $linea->cantidad,
                'precio'      => $linea->producto->precio,
            ]);
        }

        // Generar y enviar factura por correo
        try {
            $jasperService = app(JasperService::class);
            $rutaPdf = $jasperService->generarFactura([
                'ID_PEDIDO' => $pedido->id,
            ]);
            $pdf = file_get_contents($rutaPdf);

            Mail::to($pedido->user->email)->send(new FacturaPedidoMail($pedido, $pdf));
            @unlink($rutaPdf); // lo borro del /temp

        } catch (\Exception $e) {
            Log::error("Error al generar la factura PDF: " . $e->getMessage());
        }

        // Vacia el carrito
        LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->delete();

        return response()->json(['mensaje' => 'Pago procesado con éxito']);
    }
}
