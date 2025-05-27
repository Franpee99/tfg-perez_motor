<?php

namespace App\Console\Commands;

use App\Models\CitaTaller;
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
        $totalReservadas = 0;
        $totalDisponibles = 0;

        // Reservada
        $citas = CitaTaller::where('estado', 'reservada')
        ->whereRaw("CONCAT(fecha, ' ', hora) <= ?", [now()->format('Y-m-d H:i:s')])
        ->get();

        foreach ($citas as $cita) {
            $cita->estado = 'finalizada';
            $cita->save();
            $totalReservadas++;
        }

        // Disponible
        $citasDisponibles = CitaTaller::where('estado', 'disponible')
        ->whereRaw("CONCAT(fecha, ' ', hora) <= ?", [now()->format('Y-m-d H:i:s')])
        ->get();

        foreach ($citasDisponibles as $cita) {
            $cita->estado = 'finalizada';
            $cita->save();
            $totalDisponibles++;
        }

        if($totalReservadas >= 1 || $totalDisponibles >= 1){
            $mensaje = ("Se han actualizado $totalReservadas citas reservadas y $totalDisponibles citas disponibles a estado 'finalizada'");
            $this->info($mensaje);
            Log::channel('citas')->info($mensaje);
        }

        return Command::SUCCESS;
    }
}
