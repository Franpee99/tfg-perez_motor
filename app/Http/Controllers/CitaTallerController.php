<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCitaTallerRequest;
use App\Http\Requests\UpdateCitaTallerRequest;
use App\Mail\CitaReservadaMail;
use App\Models\CitaTaller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\FacturaPedidoMail;

class CitaTallerController extends Controller
{

    use AuthorizesRequests;

    /* ---- USER ---- */

    /**
     * Display a listing of the resource.
     */
    public function misCitas()
    {
        $citas = CitaTaller::with('vehiculo')
            ->where('user_id', Auth::user()->id)
            ->orderBy('fecha', 'asc')
            ->orderBy('hora', 'asc')
            ->get();

        return Inertia::render('CitasTaller/MisCitas', [
            'citas' => $citas,
        ]);
    }

    private function getFechasDisponible()
    {
        // Devuelve un array agrupado por fecha con las horas disponibles en cada una
        $now = now();
        $hoy = $now->toDateString();
        $horaActual = $now->format('H:i');

        $citas = CitaTaller::where('estado', 'disponible')
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get(['fecha', 'hora']);

        $agenda = [];
        foreach ($citas as $cita) {
            if ($cita->fecha === $hoy) {
                if ($cita->hora > $horaActual) {
                    $agenda[$cita->fecha][] = $cita->hora;
                }
            } elseif ($cita->fecha > $hoy) {
                $agenda[$cita->fecha][] = $cita->hora;
            }
        }
        return $agenda;
    }

    public function reservarCita()
    {
        $vehiculos = Auth::user()->vehiculos ?? [];

        $fechasDisponibles = $this->getFechasDisponible();

        return Inertia::render('CitasTaller/Reservar', [
            'vehiculos' => $vehiculos,
            'fechasDisponibles' => $fechasDisponibles,
        ]);
    }

    public function storeReservarCita(Request $request)
    {
        $request->validate([
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required',
            'motivo' => 'required|in:mantenimiento,reparacion,otro',
            'mensaje' => 'nullable|string|max:500',
        ]);

        $cita = CitaTaller::where('fecha', $request->fecha)
            ->where('hora', $request->hora)
            ->where('estado', 'disponible')
            ->first();

        if (!$cita) {
            return back()->withErrors(['hora' => 'Esa hora ya está reservada. Elige otra.']);
        }

        $cita->update([
            'user_id' => Auth::id(),
            'vehiculo_id' => $request->vehiculo_id,
            'motivo' => $request->motivo,
            'mensaje' => $request->mensaje,
            'estado' => 'reservada',
        ]);

        // Enviar por correo cita confirmada
        try {
            Mail::to($cita->user->email)->send(new CitaReservadaMail($cita));

        } catch (\Exception $e) {
            Log::error("Error al enviar la cita confirmada" . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Cita reservada');
    }

    public function cancelarCita(CitaTaller $cita)
    {
        if ($cita->user_id !== Auth::id() || $cita->estado !== 'reservada') {
            abort(403);
        }

        $cita->update(['estado' => 'cancelada']);
        return back()->with('success', 'Cita cancelada');
    }


    /* ---- ADMIN ---- */

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
        // ya está integrado en el indexAdmin
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
