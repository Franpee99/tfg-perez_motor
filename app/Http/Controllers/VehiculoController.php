<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehiculoRequest;
use App\Http\Requests\UpdateVehiculoRequest;
use App\Models\Vehiculo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehiculos = Auth::user()->vehiculos()->latest()->get();
        return Inertia::render('Vehiculo/Index', [
            'vehiculos' => $vehiculos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Vehiculo/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehiculoRequest $request)
    {
        Vehiculo::create([
            'user_id' => Auth::id(),
            'marca' => $request->marca,
            'modelo' => $request->modelo,
            'cilindrada' => $request->cilindrada,
            'matricula' => strtoupper($request->matricula),
            'anio' => $request->anio,
            'color' => $request->color,
            'vin' => $request->vin,
        ]);

        return redirect()->back()->with('success', '¡Vehículo registrado correctamente!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehiculoRequest $request, Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehiculo $vehiculo)
    {
        $vehiculo->delete();
        return redirect()->route('vehiculos.index')->with('success', 'Vehículo eliminado correctamente');
    }
}
