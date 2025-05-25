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
        $citas = CitaTaller::where('estado', 'reservada')
        ->whereRaw("CONCAT(fecha, ' ', hora) <= ?", [now()->format('Y-m-d H:i:s')])
        ->get();

        $total = 0;
        foreach ($citas as $cita) {
            $cita->estado = 'finalizada';
            $cita->save();
            $total++;
        }

        $mensaje = ("Se han actualizado $total citas a estado 'finalizada'");
        $this->info($mensaje);
        Log::channel('citas')->info($mensaje);

        return Command::SUCCESS;
    }
}
