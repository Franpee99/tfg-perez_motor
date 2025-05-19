<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use App\Models\Producto;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        //dd(DB::table('detalle_pedidos')->count());

        $productosTop = Producto::with('imagenes', 'marca')
        ->select('productos.*', DB::raw('SUM(detalle_pedidos.cantidad) as total_vendidos'))
        ->join('detalle_pedidos', 'productos.id', '=', 'detalle_pedidos.producto_id')
        ->join('pedidos', 'pedidos.id', '=', 'detalle_pedidos.pedido_id')
        ->where('pedidos.estado', '!=', 'cancelado')
        ->groupBy('productos.id')
        ->orderByDesc('total_vendidos')
        ->take(10)
        ->get();

        $novedadesPorCategoria = Categoria::with(['subcategorias.productos' => function ($query) {
            $query->latest()->with('imagenes', 'marca')->take(10);
        }])->get();



        return Inertia::render('Dashboard', [
            'productosTop' => $productosTop,
            'novedadesPorCategoria' => $novedadesPorCategoria,
        ]);
    }

}
