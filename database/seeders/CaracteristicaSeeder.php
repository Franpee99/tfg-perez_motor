<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caracteristica;

class CaracteristicaSeeder extends Seeder
{
    public function run(): void
    {
        $caracteristicas = [
            'Material',
            'Peso',
            'Ventilación',
            'Impermeabilidad',
            'Homologación',
            'Uso recomendado',
            'Nivel de protección',
            'Certificación',
            'Color',
            'Estilo',
        ];

        foreach ($caracteristicas as $nombre) {
            Caracteristica::firstOrCreate(['caracteristica' => $nombre]);
        }
    }
}
