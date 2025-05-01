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
        // Cargamos las tallas del producto con su stock en el pivot
        $withProducto = [
            'producto.imagenes',
            'producto.tallas' => fn ($q) => $q->withPivot('stock'),
            'talla',
        ];

        $carrito   = $this->lineas(Auth::id(), false, $withProducto);
        $guardados = $this->lineas(Auth::id(), true,  $withProducto);

        return inertia('Carrito/Index', [
            'lineasCarrito' => $carrito,
            'guardados'     => $guardados,
        ]);
    }

    //  Devuelve la colección con stockDisponible calculado
    protected function lineas($userId, bool $guardado, array $withProducto)
    {
        return LineaCarrito::with($withProducto)
            ->where('user_id', $userId)
            ->where('guardado', $guardado)
            ->orderBy('created_at')
            ->get()
            ->map(function ($linea) {
                // Comprobar si el producto existe (se haya eliminado)
                if (!$linea->producto) {
                    return [
                        'id'              => $linea->id,
                        'cantidad'        => $linea->cantidad,
                        'producto'        => null,
                        'talla'           => $linea->talla,
                        'stockDisponible' => 0,
                        'guardado'        => $linea->guardado,
                    ];
                }

                $stock = optional(
                    $linea->producto
                        ->tallas
                        ->firstWhere('id', $linea->talla_id)
                )->pivot->stock ?? 0;

                // Restar el stock del carrito en caso de que el stock maximo baje y el usuario tuviese el max en el carrito
                if ($linea->cantidad > $stock) {
                    $linea->cantidad = $stock;
                    $linea->save();
                }

                return [
                    'id'              => $linea->id,
                    'cantidad'        => $linea->cantidad,
                    'producto'        => $linea->producto,
                    'talla'           => $linea->talla,
                    'stockDisponible' => $stock,
                    'guardado'        => $linea->guardado,
                ];
            });
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


    public function modificarLinea(Request $request, LineaCarrito $lineaCarrito)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1'
        ]);

        $this->authorize('update', $lineaCarrito);

        $stockDisponible = optional(
            $lineaCarrito->producto
                        ->tallas
                        ->firstWhere('id', $lineaCarrito->talla_id)
        )->pivot->stock;

        if ($stockDisponible !== null && $request->cantidad > $stockDisponible) {
            return back()->with('error', 'No puedes añadir más unidades de las disponibles.');
        }


        $lineaCarrito->update([
            'cantidad' => $request->cantidad,
        ]);

        return redirect()->back()->with('success', 'Cantidad actualizada correctamente.');
    }


    public function destroy(LineaCarrito $lineaCarrito)
    {
        $this->authorize('delete', $lineaCarrito);

        $lineaCarrito->delete();

        return redirect()->back()->with('success', 'Producto eliminado del carrito.');
    }

    public function vaciar()
    {
        LineaCarrito::where('user_id', Auth::id())->delete();

        return redirect()->back()->with('success', 'Carrito vaciado correctamente.');
    }


    /* GUARDAR PARA MÁS TARDE */

    public function cambiarEstadoGuardado(LineaCarrito $lineaCarrito)
    {
        $this->authorize('update', $lineaCarrito);

        $lineaCarrito->update([
            'guardado' => !$lineaCarrito->guardado,
        ]);

        return redirect()->back()->with('success', $lineaCarrito->guardado
                                    ? 'Producto guardado para más tarde.'
                                    : 'Producto movido al carrito.');
    }


}
