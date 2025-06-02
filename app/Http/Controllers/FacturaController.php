<?php

namespace App\Http\Controllers;

use App\Models\Mantenimiento;
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

        $ruta = $jasperService->generarFacturaVenta([
            'ID_PEDIDO' => $pedido->id,
        ]);

        return response()->file($ruta, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="factura.pdf"',
        ])->deleteFileAfterSend(true);
    }


    public function generarFacturaTaller(Mantenimiento $mantenimiento, JasperService $jasperService)
    {
        $this->authorize('verFacturaTaller', $mantenimiento);

        $ruta = $jasperService->generarFacturaTaller([
            'mantenimiento_id' => $mantenimiento->id,
        ]);

        return response()->file($ruta, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="factura_taller.pdf"',
        ])->deleteFileAfterSend(true);
    }
}
