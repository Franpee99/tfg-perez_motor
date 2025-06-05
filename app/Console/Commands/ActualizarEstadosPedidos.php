<?php

namespace App\Console\Commands;

use App\Models\Pedido;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ActualizarEstadosPedidos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pedidos:actualizar-estados';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Actualiza automáticamente el estado de los pedidos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pedidos = Pedido::whereIn('estado', ['enviado'])->get();

        foreach ($pedidos as $pedido) {
            $estadoAnterior = $pedido->estado;
            $pedido->actualizarEstado();

            if ($estadoAnterior !== $pedido->estado) {
                $mensaje = "Pedido #{$pedido->numero_factura} actualizado de {$estadoAnterior} a {$pedido->estado}";
                $this->info($mensaje);
                Log::channel('pedidos')->info($mensaje);
            }
        }

        $this->info('Estados de pedidos actualizados');
        return Command::SUCCESS;
    }
}
