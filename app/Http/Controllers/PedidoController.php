<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Models\Pedido;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PedidoController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido::with([
            'detalles.producto.imagenes', 'devoluciones',
            ])
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Pedido/Index', [
            'pedidos' => $pedidos
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Pedido $pedido)
    {
        $this->authorize('view', $pedido);

        $pedido->load('detalles.producto.imagenes', 'detalles.producto.marca', 'detalles.talla', 'devoluciones');

        return Inertia::render('Pedido/Show', [
            'pedido' => $pedido
        ]);
    }

}
