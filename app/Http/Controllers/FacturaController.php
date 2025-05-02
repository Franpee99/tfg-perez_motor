<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\JasperService;
use Symfony\Component\HttpFoundation\Response;

class FacturaController extends Controller
{
    public function generar(Request $request)
    {
        $servicio = new JasperService();

        $rutaPdf = $servicio->generarFactura([
            'ID_PEDIDO' => $request->input('id', 5),
        ]);

        return response()->file($rutaPdf, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="factura.pdf"',
        ]);
    }
}
