<?php

namespace App\Console\Commands;

use App\Models\CitaTaller;
use App\Models\EstadoCita;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ActualizarEstadosCitas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'citas:actualizar-estados';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza automáticamente el estado de las citas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $idReservada = EstadoCita::where('nombre', 'reservada')->value('id');
        $idDisponible = EstadoCita::where('nombre', 'disponible')->value('id');
        $idFinalizada = EstadoCita::where('nombre', 'finalizada')->value('id');

        $totalReservadas = 0;
        $totalDisponibles = 0;

        // reservadas a finalizadas
        $citasReservadas = CitaTaller::where('estado_cita_id', $idReservada)
            ->whereRaw("CONCAT(fecha, ' ', hora) <= ?", [now()->format('Y-m-d H:i:s')])
            ->get();

        foreach ($citasReservadas as $cita) {
            $cita->estado_cita_id = $idFinalizada;
            $cita->save();
            $totalReservadas++;
        }

        // disponibles a finalizadas
        $citasDisponibles = CitaTaller::where('estado_cita_id', $idDisponible)
            ->whereRaw("CONCAT(fecha, ' ', hora) <= ?", [now()->format('Y-m-d H:i:s')])
            ->get();

        foreach ($citasDisponibles as $cita) {
            $cita->estado_cita_id = $idFinalizada;
            $cita->save();
            $totalDisponibles++;
        }

        if ($totalReservadas > 0 || $totalDisponibles > 0) {
            $mensaje = "Se han actualizado $totalReservadas citas reservadas y $totalDisponibles citas disponibles a estado 'finalizada'";
            $this->info($mensaje);
            Log::channel('citas')->info($mensaje);
        }

        return Command::SUCCESS;
    }
}
