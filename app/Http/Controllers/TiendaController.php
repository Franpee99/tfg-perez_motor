<?php

namespace App\Http\Controllers;

use App\Models\DetallePedido;
use App\Models\LineaCarrito;
use App\Models\Producto;
use App\Models\Valoracion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        $productos = $query->orderByDesc('created_at')->paginate(12)->withQueryString(); // conserva los filtros al cambiar de página

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

        $userId = Auth::id();

        $tallasConStock = $producto->tallas->map(function ($talla) use ($producto, $userId) {

            $enCarrito = LineaCarrito::where('user_id', $userId)
                         ->where('producto_id', $producto->id)
                         ->where('talla_id',    $talla->id)
                         ->value('cantidad') ?? 0;

            $stockReal  = $talla->pivot->stock;
            $stockFinal = max(0, ($stockReal ?? 0) - $enCarrito);

            return [
                'id'     => $talla->id,
                'nombre' => $talla->nombre,
                'pivot'  => ['stock' => $stockFinal],
            ];
        });

        $user = Auth::user();

        // Comprobar si el usuario ha comprado el producto
        $haComprado = false;
        if ($user) {
            $haComprado = DetallePedido::whereHas('pedido', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->where('producto_id', $producto->id)
                ->exists();
        }

        // Obtener la valoración
        $valoracion = null;
        if ($user) {
            $valoracion = Valoracion::where('user_id', $user->id)
                ->where('producto_id', $producto->id)
                ->first(['estrella', 'comentario']);
        }

        // Obtener las valoraciones de todos los usuarios
        $valoraciones = Valoracion::with('user')
            ->where('producto_id', $producto->id)
            ->orderBy('created_at', 'desc')
            ->get(['user_id', 'producto_id', 'estrella', 'comentario', 'created_at']);

        return Inertia::render('Tienda/Show', [
            'producto' => [
                'id'             => $producto->id,
                'nombre'         => $producto->nombre,
                'precio'         => $producto->precio,
                'descripcion'    => $producto->descripcion,
                'marca'          => $producto->marca,
                'imagenes'       => $producto->imagenes,
                'caracteristicas'=> $producto->caracteristicas,
                'tallas'         => $tallasConStock,
            ],
            'haComprado' => $haComprado,
            'valoracion' => $valoracion,
            'valoracionesPublicas' => $valoraciones,
        ]);
    }
}
