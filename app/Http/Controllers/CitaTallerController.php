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
use App\Models\EstadoCita;
use App\Models\MotivoCita;

class CitaTallerController extends Controller
{

    use AuthorizesRequests;

    /* ---- USER ---- */

    /**
     * Display a listing of the resource.
     */
    public function misCitas()
    {
        $citas = CitaTaller::with('vehiculo', 'estado_cita', 'motivo_cita')
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

        $estadoDisponibleId = EstadoCita::where('nombre', 'disponible')->value('id');

        $citas = CitaTaller::where('estado_cita_id', $estadoDisponibleId)
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

        $motivos = MotivoCita::all(['id', 'nombre']);

        return Inertia::render('CitasTaller/Reservar', [
            'vehiculos' => $vehiculos,
            'fechasDisponibles' => $fechasDisponibles,
            'motivos' => $motivos,
        ]);
    }

    public function storeReservarCita(Request $request)
    {
        $request->validate([
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required',
            'motivo_cita_id' => 'required|exists:motivo_citas,id',
            'mensaje' => 'nullable|string|max:500',
        ]);

        $estadoDisponibleId = EstadoCita::where('nombre', 'disponible')->value('id');
        $estadoReservadaId = EstadoCita::where('nombre', 'reservada')->value('id');

        $cita = CitaTaller::where('fecha', $request->fecha)
            ->where('hora', $request->hora)
            ->where('estado_cita_id', $estadoDisponibleId)
            ->first();

        if (!$cita) {
            return back()->withErrors(['hora' => 'Esa hora ya está reservada. Elige otra.']);
        }

        $cita->update([
            'user_id' => Auth::id(),
            'vehiculo_id' => $request->vehiculo_id,
            'motivo_cita_id' => $request->motivo_cita_id,
            'mensaje' => $request->mensaje,
            'estado_cita_id' => $estadoReservadaId,
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
        if ($cita->user_id !== Auth::id() || $cita->estado_cita->nombre !== 'reservada') {
            abort(403);
        }
        $estadoCanceladaId = EstadoCita::where('nombre', 'cancelada')->value('id');
        $cita->update(['estado_cita_id' => $estadoCanceladaId]);
        return back()->with('success', 'Cita cancelada');
    }


    /* ---- ADMIN ---- */

    public function indexAdmin()
    {
        $this->authorize('viewAny', CitaTaller::class);

        $citas = CitaTaller::with(['user', 'vehiculo', 'estado_cita', 'motivo_cita', 'mantenimiento'])
        ->orderBy('fecha', 'desc')
        ->orderBy('hora')
        ->get();

        $estados = EstadoCita::all(['id', 'nombre']);

        return Inertia::render('CitasTaller/IndexAdmin', [
            'citas' => $citas,
            'estados' => $estados,
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
        $estadoDisponibleId = EstadoCita::where('nombre', 'disponible')->value('id');

        foreach ($request->fechas as $fecha) {
            foreach ($request->horas as $hora) {
                CitaTaller::firstOrCreate([
                    'fecha' => $fecha,
                    'hora' => $hora,
                ], [
                    'estado_cita_id' => $estadoDisponibleId,
                    'user_id' => null,
                    'marca' => null,
                    'modelo' => null,
                    'matricula' => null,
                    'motivo_cita_id' => null,
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
