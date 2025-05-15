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
            ->whereNotIn('estado', ['pendiente', 'procesado', 'cancelado'])
            ->whereDoesntHave('devoluciones', function ($q) { // excluir las aprobadas
                $q->where('estado', 'aprobada');
            })
            ->with(['devoluciones' => function ($q) {
                $q->where('estado', '!=', 'aprobada');
            }])
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
            return back();
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

        if ($request->estado === 'aprobada') {
            // En caso de que haya varias, se aceptan todas de ese pedido
            Devolucion::where('pedido_id', $devolucion->pedido_id)
                ->where('estado', '!=', 'aprobada')
                ->update(['estado' => 'aprobada']);
        } else {
            // Si se deniega, solo se actualiza esta
            $devolucion->estado = 'denegada';
            $devolucion->save();
        }

        return back()->with('success', 'Estado de solicitud actualizado');
    }
}
