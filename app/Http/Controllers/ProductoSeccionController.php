<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoSeccionController extends Controller
{
    public function index($categoria)
    {
        $productos = Producto::with(['marca', 'subcategoria.categoria'])
            ->whereHas('subcategoria.categoria', function($query) use ($categoria) {
                $query->whereRaw('LOWER(nombre) = ?', [strtolower($categoria)]);
            })
            ->paginate(10)
            ->withQueryString(); //para maneter la categoria en la url

        return Inertia::render('Secciones/Index', [
            'categoriaActual' => $categoria,
            'productos' => $productos,
        ]);
    }

}
