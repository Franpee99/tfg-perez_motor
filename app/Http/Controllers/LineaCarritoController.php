<?php

namespace App\Http\Controllers;

use App\Models\LineaCarrito;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

}
