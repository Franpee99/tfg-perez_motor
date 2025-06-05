<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTipos_mantenimientoRequest;
use App\Http\Requests\UpdateTipos_mantenimientoRequest;
use App\Models\TiposMantenimiento;

class TiposMantenimientoController extends Controller
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTipos_mantenimientoRequest $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tipos_mantenimiento,nombre',
            'descripcion' => 'nullable|string',
        ]);

        $tipo = TiposMantenimiento::create($validated);

        return response()->json($tipo);
    }

    /**
     * Display the specified resource.
     */
    public function show(TiposMantenimiento $tipos_mantenimiento)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TiposMantenimiento $tipos_mantenimiento)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTipos_mantenimientoRequest $request, TiposMantenimiento $tipos_mantenimiento)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TiposMantenimiento $tipos_mantenimiento)
    {
        //
    }
}
