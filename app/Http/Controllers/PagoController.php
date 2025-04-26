<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\LineaCarrito;
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

        // Actualizar el stock de los productos no guardados y vaciar el carrito
        $lineas = LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->get();

        foreach ($lineas as $linea) {
            DB::table('producto_talla')
                ->where('producto_id', $linea->producto_id)
                ->where('talla_id', $linea->talla_id)
                ->decrement('stock', $linea->cantidad);
        }

        LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->delete();

        return response()->json(['mensaje' => 'Pago procesado con éxito']);
    }
}
