<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCitaTallerRequest;
use App\Http\Requests\UpdateCitaTallerRequest;
use App\Models\CitaTaller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class CitaTallerController extends Controller
{

    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function indexAdmin()
    {
        $this->authorize('viewAny', CitaTaller::class);

        $citas = CitaTaller::with(['user', 'vehiculo'])
        ->orderBy('fecha', 'desc')
        ->orderBy('hora')
        ->get();

        return Inertia::render('CitasTaller/IndexAdmin', [
            'citas' => $citas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // ya está integrado en el indexAdmin
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCitaTallerRequest $request)
    {
        foreach ($request->fechas as $fecha) {
            foreach ($request->horas as $hora) {
                CitaTaller::firstOrCreate([
                    'fecha' => $fecha,
                    'hora' => $hora,
                ], [
                    'estado' => 'disponible',
                    'user_id' => null,
                    'marca' => null,
                    'modelo' => null,
                    'matricula' => null,
                    'motivo' => null,
                    'mensaje' => null,
                ]);
            }
        }
        return back()->with('success', 'Agenda abierta');
    }

    /**
     * Display the specified resource.
     */
    public function show(CitaTaller $citaTaller)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CitaTaller $citaTaller)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCitaTallerRequest $request, CitaTaller $citaTaller)
    {
        $citaTaller->update($request->validated());

        return redirect()->route('admin.citas.index')
            ->with('success', 'Cita actualizada');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CitaTaller $citaTaller)
    {
        $citaTaller->delete();

        return redirect()->route('admin.citas.index')
            ->with('success', 'Cita eliminada');
    }
}
