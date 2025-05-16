<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Models\Pedido;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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

    public function cancelar(Pedido $pedido)
    {
        $this->authorize('update', $pedido);

        if ($pedido->estado === 'enviado' || $pedido->estado === 'entregado' ||  $pedido->created_at < now()->subDays(30)) {
            return back()->with('error', 'No se puede cancelar un pedido enviado, entregado o con más de 30 días');
        }

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


        $pedido->estado = 'cancelado';
        $pedido->save();

        // Aqui me falta por poner que devuelva el dinero

        return redirect()->back()->with('success', 'Pedido cancelado y reembolso procesado');
    }

    public function indexAdmin()
    {
        $this->authorize('viewAny', Pedido::class);

        $pedidos = Pedido::with(['user', 'detalles.producto.imagenes', 'detalles.talla', 'devoluciones'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Pedido/IndexAdmin', [
            'pedidos' => $pedidos,
        ]);
    }

    public function cambiarEstado(Request $request, Pedido $pedido)
    {
        $this->authorize('update', $pedido);

        $estado = $request->input('estado');

        $cambiosPermitidos = [
            'pendiente' => 'procesado',
            'procesado' => 'enviado',
        ];

        if (!isset($cambiosPermitidos[$pedido->estado]) || $cambiosPermitidos[$pedido->estado] !== $estado) {
            return back()->with('error', 'Cambio de estado no permitido.');
        }

        $pedido->estado = $estado;
        $pedido->save();

        return back()->with('success', "Pedido #{$pedido->numero_factura} marcado como '{$estado}'.");
    }

}
