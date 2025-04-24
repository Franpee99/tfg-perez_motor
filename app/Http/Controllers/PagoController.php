<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\LineaCarrito;

class PagoController extends Controller
{
    public function checkout()
    {
        $total = LineaCarrito::where('user_id', Auth::id())
            ->with('producto')
            ->where('guardado', false)
            ->get()
            ->reduce(function ($acc, $linea) {
                return $acc + ($linea->producto->precio * $linea->cantidad);
            }, 0);

        return Inertia::render('Checkout', [
            'total' => number_format($total, 2, '.', '')
        ]);
    }

    public function procesarPago(Request $request)
    {
        // Vaciar el carrito, solo los no guardados
        LineaCarrito::where('user_id', Auth::id())
            ->where('guardado', false)
            ->delete();

        return response()->noContent();
    }
}
