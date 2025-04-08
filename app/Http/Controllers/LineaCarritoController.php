<?php

namespace App\Http\Controllers;

use App\Models\LineaCarrito;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            'cantidad' => 'required|integer|min:1',
        ]);

        $linea = LineaCarrito::where('user_id', Auth::id())
        ->where('producto_id', $request->producto_id)
        ->where('talla_id', $request->talla_id)
        ->first();

        if ($linea) {
            $linea->increment('cantidad', $request->cantidad);
        } else {
            LineaCarrito::create([
                'user_id' => Auth::id(),
                'producto_id' => $request->producto_id,
                'talla_id' => $request->talla_id,
                'cantidad' => $request->cantidad,
            ]);
        }

        return redirect()->back()->with('success', 'Producto añadido a la cesta');
    }

    public function destroy(LineaCarrito $lineaCarrito)
    {
        $lineaCarrito->delete();

        return redirect()->back()->with('success', 'Producto eliminado del carrito.');
    }

    public function vaciar()
    {
        LineaCarrito::where('user_id', Auth::id())->delete();

        return redirect()->back()->with('success', 'Carrito vaciado correctamente.');
    }


}
