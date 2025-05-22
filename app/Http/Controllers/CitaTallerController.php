<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCitaTallerRequest;
use App\Http\Requests\UpdateCitaTallerRequest;
use App\Models\CitaTaller;
use Inertia\Inertia;

class CitaTallerController extends Controller
{
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
    public function create()
    {
        $citas = CitaTaller::where('fecha', '>=', now()->startOfWeek())
            ->where('fecha', '<=', now()->endOfWeek())
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get();

        return Inertia::render('CitasTaller/Create', [
            'citas' => $citas,
        ]);
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
        return back()->with('success', 'Agenda abierta correctamente');
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CitaTaller $citaTaller)
    {
        //
    }
}
