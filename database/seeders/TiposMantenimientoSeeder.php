<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposMantenimientoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tipos_mantenimiento')->insert([
            [
                'nombre' => 'Aceite de motor',
            ],
            [
                'nombre' => 'Filtro de aceite',
            ],
            [
                'nombre' => 'Filtro de aire',
            ],
            [
                'nombre' => 'Bujías',
            ],
            [
                'nombre' => 'Filtro de combustible',
            ],
            [
                'nombre' => 'Pastillas de freno',
            ],
            [
                'nombre' => 'Líquido de frenos',
            ],
            [
                'nombre' => 'Neumáticos',
            ],
            [
                'nombre' => 'Kit de arrastre',
            ],
            [
                'nombre' => 'Líquido refrigerante',
            ],
            [
                'nombre' => 'Aceite de horquilla',
            ],
            [
                'nombre' => 'Batería',
            ],
            [
                'nombre' => 'Filtro antipolen',
            ],
            [
                'nombre' => 'Correa de transmisión',
            ],
            [
                'nombre' => 'Piñón de ataque',
            ],
            [
                'nombre' => 'Corona trasera',
            ],
            [
                'nombre' => 'Lámpara halógena',
            ],
            [
                'nombre' => 'Amortiguador trasero',
            ],
            [
                'nombre' => 'Espejo retrovisor',
            ],
            [
                'nombre' => 'Filtro de partículas',
            ],
        ]);
    }
}
