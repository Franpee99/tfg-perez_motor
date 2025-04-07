<?php

namespace App\Http\Controllers;

use App\Models\LineaCarrito;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LineaCarritoController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $lineas = LineaCarrito::with(['producto', 'talla'])
            ->where('user_id', Auth::id())
            ->get();

        return inertia('Carrito/Index', [
            'lineasCarrito' => $lineas,
        ]);
    }

    public function insertarLinea(Request $request)
{
    $request->validate([
        'producto_id' => 'required|exists:productos,id',
        'talla_id' => 'required|exists:tallas,id',
        'cantidad' => 'nullable|integer|min:1',
    ]);

    $linea = LineaCarrito::where('user_id', Auth::id())
    ->where('producto_id', $request->producto_id)
    ->where('talla_id', $request->talla_id)
    ->first();

    if ($linea) {
        $linea->increment('cantidad', $request->cantidad ?? 1);
    } else {
        LineaCarrito::create([
            'user_id' => Auth::id(),
            'producto_id' => $request->producto_id,
            'talla_id' => $request->talla_id,
            'cantidad' => $request->cantidad ?? 1,
        ]);
    }

    return redirect()->back()->with('success', 'Producto añadido a la cesta');
}


}
