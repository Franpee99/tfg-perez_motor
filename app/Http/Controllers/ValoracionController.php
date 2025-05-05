<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreValoracionRequest;
use App\Http\Requests\UpdateValoracionRequest;
use App\Models\DetallePedido;
use App\Models\Producto;
use App\Models\Valoracion;
use Illuminate\Http\Request;
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

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreValoracionRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Valoracion $valoracion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Valoracion $valoracion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateValoracionRequest $request, Valoracion $valoracion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Valoracion $valoracion)
    {
        //
    }
}
