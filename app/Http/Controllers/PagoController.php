<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\LineaCarrito;
use App\Models\Pedido;
use Illuminate\Support\Facades\DB;

class PagoController extends Controller
{

    public function procesarPago(Request $request)
    {
        $estadoPago = $request->input('detalles.status');

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

        do {
            $numeroFactura = 'FAC-' . date('Ymd') . '-' . Str::upper(Str::random(6));
        } while (Pedido::where('numero_factura', $numeroFactura)->exists());

        $pedido = Pedido::create([
            'user_id' => Auth::id(),
            'estado' => 'procesado',
            'total' => $total,
            'numero_factura' => $numeroFactura,
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

        // Vacia el carrito
        LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->delete();

        return response()->json(['mensaje' => 'Pago procesado con éxito']);
    }
}
