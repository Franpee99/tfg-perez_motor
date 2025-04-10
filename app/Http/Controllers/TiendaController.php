<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TiendaController extends Controller
{
    public function index($categoria)
    {
        $productos = Producto::with(['marca', 'subcategoria.categoria'])
            ->whereHas('subcategoria.categoria', function($query) use ($categoria) {
                $query->whereRaw('LOWER(nombre) = ?', [strtolower($categoria)]);
            })
            ->paginate(10)
            ->withQueryString(); //para maneter la categoria en la url

        return Inertia::render('Tienda/Index', [
            'categoriaActual' => $categoria,
            'productos' => $productos,
        ]);
    }

    public function show(Producto $producto)
    {
        $producto->load(['marca', 'tallas', 'caracteristicas']);

        return inertia('Tienda/Show', [
            'producto' => $producto
        ]);
    }
}
