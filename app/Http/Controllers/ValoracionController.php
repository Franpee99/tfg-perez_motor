<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use App\Models\Producto;
use App\Models\Valoracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ValoracionController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function guardar(Request $request, Producto $producto)
    {
        $request->validate([
            'estrella' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:1000',
        ]);

        $usuario = $request->user();

        $haComprado = DetallePedido::whereHas('pedido', function ($query) use ($usuario) {
                $query->where('user_id', $usuario->id);
            })
            ->where('producto_id', $producto->id)
            ->exists();

        if (!$haComprado) {
            abort(403, 'Solo puedes valorar productos que hayas comprado');
        }

        Valoracion::updateOrCreate(
            [
                'user_id' => $usuario->id,
                'producto_id' => $producto->id,
            ],
            [
                'estrella' => $request->input('estrella'),
                'comentario' => $request->input('comentario'),
            ]
    );

        return back()->with('success', 'Gracias por tu valoración');
    }

    public function eliminarValoracion(Request $request, Producto $producto)
    {
        $valoracion = $producto->valoraciones()
            ->where('user_id', Auth::id())
            ->first();

        if ($valoracion) {
            $valoracion->delete();
        }

        return back()->with('success', 'Valoración eliminada');
    }

}
