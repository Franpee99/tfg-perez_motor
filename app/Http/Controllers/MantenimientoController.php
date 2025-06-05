<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMantenimientoRequest;
use App\Http\Requests\UpdateMantenimientoRequest;
use App\Mail\RecogerVehiculoMail;
use App\Models\CitaTaller;
use App\Models\Mantenimiento;
use App\Models\TiposMantenimiento;
use App\Models\Vehiculo;
use App\Services\JasperService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class MantenimientoController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $this->authorize('create', Mantenimiento::class);

        $vehiculo_id = $request->input('vehiculo_id');
        $cita_taller_id = $request->input('cita_taller_id');

        // Traer los datos para mostrar en el formulario
        $vehiculo = Vehiculo::findOrFail($vehiculo_id);
        $cita = CitaTaller::with('vehiculo')->findOrFail($cita_taller_id);
        $tiposMantenimiento = TiposMantenimiento::all();

        return Inertia::render('Mantenimiento/Create', [
            'vehiculo' => $vehiculo,
            'cita' => $cita,
            'tiposMantenimiento' => $tiposMantenimiento,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMantenimientoRequest $request)
    {
         $validated = $request->validate([
        'vehiculo_id' => 'required|exists:vehiculos,id',
        'cita_taller_id' => 'nullable|exists:citas_taller,id',
        'kilometros' => 'required|integer|min:0',
        'observaciones' => 'nullable|string',
        'prox_revision' => 'nullable|string',
        'mano_obra' => 'required|numeric|min:0',
        'detalles' => 'required|array|min:1',
        'detalles.*.tipo_mantenimiento_id' => 'required|integer|exists:tipos_mantenimiento,id',
        'detalles.*.limpiar' => 'boolean',
        'detalles.*.revisar' => 'boolean',
        'detalles.*.sustituir' => 'boolean',
        'detalles.*.precio' => 'required|numeric|min:0',
        ]);

        // Crear el mantenimiento principal
        $mantenimiento = Mantenimiento::create([
            'vehiculo_id' => $validated['vehiculo_id'],
            'cita_taller_id' => $validated['cita_taller_id'],
            'kilometros' => $validated['kilometros'],
            'observaciones' => $validated['observaciones'] ?? null,
            'prox_revision' => $validated['prox_revision'] ?? null,
            'mano_obra' => $validated['mano_obra'],
        ]);

        // Crear los detalles
        foreach ($validated['detalles'] as $detalle) {
            $mantenimiento->mantenimientoDetalles()->create([
                'tipo_mantenimiento_id' => $detalle['tipo_mantenimiento_id'],
                'limpiar' => $detalle['limpiar'] ?? false,
                'revisar' => $detalle['revisar'] ?? false,
                'sustituir' => $detalle['sustituir'] ?? false,
                'precio' => $detalle['precio'],
            ]);
        }

        // Generar y enviar factura del taller por correo
        try {
            $jasperService = app(JasperService::class);
            $rutaPdf = $jasperService->generarFacturaTaller([
                'mantenimiento_id' => $mantenimiento->id,
            ]);
            $pdf = file_get_contents($rutaPdf);

            Mail::to($mantenimiento->vehiculo->user->email)->send(new RecogerVehiculoMail($mantenimiento, $pdf));
            @unlink($rutaPdf); // lo borro del /temp

        } catch (\Exception $e) {
            Log::error("Error al generar la factura PDF: " . $e->getMessage());
        }

        return redirect()->route('mantenimientos.show', $mantenimiento->id)->with('success', 'Mantenimiento registrado');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mantenimiento $mantenimiento)
    {
        $this->authorize('view', $mantenimiento);

        $mantenimiento->load('vehiculo', 'mantenimientoDetalles.tipoMantenimiento', 'cita');
        $user = Auth::user()->is_admin;

        return Inertia::render('Mantenimiento/Show', [
            'mantenimiento' => $mantenimiento,
            'is_admin' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mantenimiento $mantenimiento)
    {
        $mantenimiento->load('vehiculo', 'mantenimientoDetalles.tipoMantenimiento', 'cita');
        $tiposMantenimiento = TiposMantenimiento::all();

        return Inertia::render('Mantenimiento/Edit', [
            'mantenimiento' => $mantenimiento,
            'tiposMantenimiento' => $tiposMantenimiento,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMantenimientoRequest $request, Mantenimiento $mantenimiento)
    {
        $this->authorize('update', $mantenimiento);

        $validated = $request->validate([
        'vehiculo_id' => 'required|exists:vehiculos,id',
        'cita_taller_id' => 'nullable|exists:citas_taller,id',
        'kilometros' => 'required|integer|min:0',
        'observaciones' => 'nullable|string',
        'prox_revision' => 'nullable|string',
        'mano_obra' => 'required|numeric|min:0',
        'detalles' => 'required|array|min:1',
        'detalles.*.tipo_mantenimiento_id' => 'required|integer|exists:tipos_mantenimiento,id',
        'detalles.*.limpiar' => 'boolean',
        'detalles.*.revisar' => 'boolean',
        'detalles.*.sustituir' => 'boolean',
        'detalles.*.precio' => 'required|numeric|min:0',
        ]);

        // Actualizar el mantenimiento
        $mantenimiento->update([
            'vehiculo_id' => $validated['vehiculo_id'],
            'cita_taller_id' => $validated['cita_taller_id'],
            'kilometros' => $validated['kilometros'],
            'observaciones' => $validated['observaciones'] ?? null,
            'prox_revision' => $validated['prox_revision'] ?? null,
            'mano_obra' => $validated['mano_obra'],
        ]);

        //Borramos todos los detalles
        $mantenimiento->mantenimientoDetalles()->delete();

        // Crea los anteriores/nuevos detalles
        foreach ($validated['detalles'] as $detalle) {
            $mantenimiento->mantenimientoDetalles()->create([
                'tipo_mantenimiento_id' => $detalle['tipo_mantenimiento_id'],
                'limpiar' => $detalle['limpiar'] ?? false,
                'revisar' => $detalle['revisar'] ?? false,
                'sustituir' => $detalle['sustituir'] ?? false,
                'precio' => $detalle['precio'],
            ]);
        }

        return redirect()->route('mantenimientos.show', $mantenimiento->id)->with('success', 'Mantenimiento actualizado');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mantenimiento $mantenimiento)
    {
        //
    }
}
