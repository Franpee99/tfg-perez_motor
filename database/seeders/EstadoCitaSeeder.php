<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoCitaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estado_citas')->insert([
            ['nombre' => 'disponible'],
            ['nombre' => 'reservada'],
            ['nombre' => 'finalizada'],
            ['nombre' => 'cancelada'],
        ]);
    }
}
