<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TiendaController extends Controller
{
    public function index(Request $request, $categoria)
    {
        // Obtener filtros desde la URL
        $marcas = $request->input('marcas', []);
        $subcategorias = $request->input('subcategorias', []);
        $tallas = $request->input('tallas', []);
        $caracteristicas = $request->input('caracteristicas', []);
        $precioMin = $request->input('precio_min', 0);
        $precioMax = $request->input('precio_max', null);

        $query = Producto::with([
            'marca',
            'subcategoria.categoria',
            'imagenes',
            'tallas',
            'caracteristicas'
        ])
        ->whereHas('subcategoria.categoria', function ($q) use ($categoria) {
            $q->whereRaw('LOWER(nombre) = ?', [strtolower($categoria)]);
        });

        // Aplico filtros
        if (!empty($marcas)) {
            $query->whereHas('marca', fn($q) => $q->whereIn('nombre', $marcas));
        }

        if (!empty($subcategorias)) {
            $query->whereHas('subcategoria', fn($q) => $q->whereIn('nombre', $subcategorias));
        }

        if (!empty($tallas)) {
            $query->whereHas('tallas', fn($q) => $q->whereIn('nombre', $tallas));
        }

        if (!empty($caracteristicas)) {
            $query->whereHas('caracteristicas', fn($q) => $q->whereIn('caracteristica_producto.definicion', $caracteristicas));
        }

        if ($precioMax !== null) {
            $query->whereBetween('precio', [$precioMin, $precioMax]);
        }

        $productos = $query->paginate(2)->withQueryString(); // conserva los filtros al cambiar de página

        // Obtener todas las opciones únicas para filtros
        $todos = Producto::with(['marca', 'subcategoria', 'tallas', 'caracteristicas'])
            ->whereHas('subcategoria.categoria', function ($q) use ($categoria) {
                $q->whereRaw('LOWER(nombre) = ?', [strtolower($categoria)]);
            })
            ->get();

        return Inertia::render('Tienda/Index', [
            'categoriaActual' => $categoria,
            'productosConFiltro' => $productos, // aqui ya paginados, los que van al componente ProductoGrid.jsx
            'productosTodos' => $todos, // para generar las opciones de filtro
            'filtrosActivos' => [ // para mantener los checked marcados y el range
                'marcas' => $marcas,
                'subcategorias' => $subcategorias,
                'tallas' => $tallas,
                'caracteristicas' => $caracteristicas,
                'precio_min' => $precioMin,
                'precio_max' => $precioMax,
            ]
        ]);
    }

    public function show(Producto $producto)
    {
        $producto->load(['marca', 'tallas', 'caracteristicas', 'imagenes']);

        return inertia('Tienda/Show', [
            'producto' => $producto
        ]);
    }
}
