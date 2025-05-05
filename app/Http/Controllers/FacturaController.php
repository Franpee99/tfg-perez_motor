<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use App\Services\JasperService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FacturaController extends Controller
{
    use AuthorizesRequests;

    public function generar(Pedido $pedido, JasperService $jasperService)
    {
        $this->authorize('verFactura', $pedido);

        $ruta = $jasperService->generarFactura([
            'ID_PEDIDO' => $pedido->id,
        ]);

        return response()->file($ruta, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="factura.pdf"',
        ])->deleteFileAfterSend(true);
    }
}
