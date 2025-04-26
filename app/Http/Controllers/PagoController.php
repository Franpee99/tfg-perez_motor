<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\LineaCarrito;

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

        // Vaciar el carrito, solo los no guardados
        LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->delete();

        return response()->json(['mensaje' => 'Pago procesado con éxito']);
    }
}
