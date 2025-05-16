<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{

    protected $commands = [
        \App\Console\Commands\ActualizarEstadosPedidos::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('pedidos:actualizar-estados')->everyMinute();
    }

}
