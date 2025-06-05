<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Cascos', 'descripcion' => 'Cascos de protección'],
            ['nombre' => 'Chaquetas', 'descripcion' => 'Chaquetas para motociclistas'],
            ['nombre' => 'Pantalones', 'descripcion' => 'Pantalones resistentes para moto'],
            ['nombre' => 'Guantes', 'descripcion' => 'Guantes de protección'],
            ['nombre' => 'Botas', 'descripcion' => 'Botas para motociclistas'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::updateOrCreate(['nombre' => $categoria['nombre']], $categoria);
        }
    }
}
