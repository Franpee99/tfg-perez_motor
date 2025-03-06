<?php

namespace Database\Seeders;

use App\Models\Marca;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MarcaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marcas = [
            ['nombre' => 'AGV'],
            ['nombre' => 'Acerbis'],
            ['nombre' => 'Alpinestars'],
            ['nombre' => 'Answer'],
            ['nombre' => 'Arai'],
            ['nombre' => 'BKR'],
            ['nombre' => 'Bell'],
            ['nombre' => 'By City'],
            ['nombre' => 'Climax'],
            ['nombre' => 'Givi'],
            ['nombre' => 'HJC'],
            ['nombre' => 'Hebo'],
            ['nombre' => 'LS2'],
            ['nombre' => 'Liqui Moly'],
            ['nombre' => 'MGE'],
            ['nombre' => 'MT'],
            ['nombre' => 'Motul'],
            ['nombre' => 'NZI'],
            ['nombre' => 'Nitro'],
            ['nombre' => 'Nolan'],
            ['nombre' => "O'Neal"],
            ['nombre' => 'Shark'],
            ['nombre' => 'Tucano Urbano'],
            ['nombre' => 'X-Lite'],
        ];

        foreach ($marcas as $marca) {
            Marca::updateOrCreate(['nombre' => $marca['nombre']], $marca);
        }
    }
}
