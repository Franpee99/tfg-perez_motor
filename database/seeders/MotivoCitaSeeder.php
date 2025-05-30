<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MotivoCitaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('motivo_citas')->insert([
            ['nombre' => 'mantenimiento'],
            ['nombre' => 'reparacion'],
            ['nombre' => 'otro'],
        ]);
    }
}
