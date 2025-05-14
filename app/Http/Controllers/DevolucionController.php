<?php

namespace App\Http\Controllers;

use App\Models\Devolucion;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DevolucionController extends Controller
{
    use AuthorizesRequests;

    public function formulario()
    {
        $user = Auth::user();

        $pedidos = $user->pedidos()
            ->where('created_at', '>=', now()->subDays(30))
            ->get(['id', 'numero_factura', 'created_at']);

        return Inertia::render('Pedido/Devolucion', [
            'user' => $user,
            'pedidos' => $pedidos,
        ]);
    }


    public function guardar(Request $request)
    {
        $validados = $request->validate([
            'pedido'   => 'required|exists:pedidos,numero_factura',
            'nombre'   => 'required|string|max:255',
            'correo'   => 'required|email',
            'telefono' => 'required|digits:9',
            'motivo'   => 'required|string',
            'mensaje'  => 'required|string|max:150',
            'acepta'   => 'accepted',
        ]);

        $pedido = Pedido::where('numero_factura', $validados['pedido'])->first();
        if ($pedido->created_at->diffInDays(now()) > 30) {
            return back()->withErrors(['pedido' => 'No puedes devolver un pedido con más de 30 días']);
        }

        Devolucion::create([
            'user_id'   => Auth::id(),
            'pedido_id' => $pedido->id,
            'nombre'    => $validados['nombre'],
            'correo'    => $validados['correo'],
            'telefono'  => $validados['telefono'],
            'motivo'    => $validados['motivo'],
            'mensaje'   => $validados['mensaje'],
            'acepta'    => true,
        ]);

        return back()->with('success', 'Tu solicitud de devolución ha sido enviada correctamente');
    }

    public function indexAdmin()
    {
        $this->authorize('viewAny', Devolucion::class);

        $devoluciones = Devolucion::with(['user', 'pedido'])->orderBy('created_at', 'desc')->get();

        return Inertia::render('Pedido/DevolucionAdmin', [
            'devoluciones' => $devoluciones
        ]);
    }

    public function actualizarEstado(Request $request, Devolucion $devolucion)
    {
        $this->authorize('update', $devolucion);

        if ($devolucion->estado !== 'pendiente') {
            return back();
        }

        $request->validate([
            'estado' => 'required|in:aprobada,denegada'
        ]);

        $devolucion->estado = $request->estado;
        $devolucion->save();

        return back()->with('success', 'Estado de solicitud actualizado');
    }
}
