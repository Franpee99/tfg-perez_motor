<?php

namespace App\Http\Controllers;

use App\Mail\EstadoDevolucionMail;
use App\Mail\SolicitudDevolucionMail;
use App\Models\Devolucion;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

        $devolucion =  Devolucion::create([
            'user_id'   => Auth::id(),
            'pedido_id' => $pedido->id,
            'nombre'    => $validados['nombre'],
            'correo'    => $validados['correo'],
            'telefono'  => $validados['telefono'],
            'motivo'    => $validados['motivo'],
            'mensaje'   => $validados['mensaje'],
            'acepta'    => true,
        ]);

        Mail::to($devolucion->user->email)->send(new SolicitudDevolucionMail($devolucion));

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

        $pedido = $devolucion->pedido;

        if ($request->estado === 'aprobada') {
            // En caso de que haya varias, se aceptan todas de ese pedido
            Devolucion::where('pedido_id', $devolucion->pedido_id)
                ->where('estado', '!=', 'aprobada')
                ->update(['estado' => 'aprobada']);

                // REEMBOLSO
                if ($pedido->paypal_capture_id) {
                    try {
                        // Crear cliente HTTP (usando Guzzle para hacer llamadas externas)
                        $clienteHttp = new Client();

                        // Solicitar token de acceso a paypal (para solicitar el reembolso)
                        $respuestaToken = $clienteHttp->post(
                            "https://api-m." . config('services.paypal.mode') . ".paypal.com/v1/oauth2/token",
                            [
                                'auth' => [config('services.paypal.client_id'), config('services.paypal.secret')],
                                'form_params' => ['grant_type' => 'client_credentials'],
                            ]
                        );

                        // Extraer el access token de la respuesta
                        $tokenAcceso = json_decode($respuestaToken->getBody(), true)['access_token'];

                        // Enviar solicitud de reembolso usando el capture_id del pedido
                        $respuestaReembolso = $clienteHttp->post(
                            "https://api-m." . config('services.paypal.mode') . ".paypal.com/v2/payments/captures/{$pedido->paypal_capture_id}/refund",
                            [
                                'headers' => [
                                    'Authorization' => "Bearer $tokenAcceso",
                                    'Content-Type' => 'application/json',
                                ],
                            ]
                        );

                        // Convertir la respuesta JSON del reembolso a array
                        $datosReembolso = json_decode($respuestaReembolso->getBody(), true);

                        Log::info('Reembolso de PayPal realizado con éxito:', $datosReembolso);

                    } catch (\Exception $excepcion) {
                        Log::error('Error al procesar reembolso con PayPal: ' . $excepcion->getMessage());
                        return redirect()->back()->with('error', 'Error al procesar el reembolso con PayPal.');
                    }
                }

                Mail::to($devolucion->user->email)->send(new EstadoDevolucionMail($devolucion, 'aprobada')
        );
        } else {
            // Si se deniega, solo se actualiza esta
            $devolucion->estado = 'denegada';
            $devolucion->save();

            Mail::to($devolucion->user->email)->send(new EstadoDevolucionMail($devolucion, 'denegada'));
        }

        return back()->with('success', 'Estado de solicitud actualizado');
    }
}
