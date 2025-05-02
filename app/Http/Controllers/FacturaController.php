<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use App\Services\JasperService;

class FacturaController extends Controller
{

    public function descargar(Pedido $pedido, JasperService $jasperService)
    {
        $ruta = $jasperService->generarFactura([
            'ID_PEDIDO' => $pedido->id,
        ]);

        return response()->file($ruta, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="factura.pdf"',
        ])->deleteFileAfterSend(true);
    }
}
