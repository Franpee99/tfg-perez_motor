<?php

namespace Database\Factories;

use App\Models\Producto;
use App\Models\Subcategoria;
use App\Models\Marca;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoFactory extends Factory
{
    protected $model = Producto::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->words(3, true),
            'descripcion' => $this->faker->paragraph,
            'precio' => $this->faker->randomFloat(2, 50, 500),
            'subcategoria_id' => Subcategoria::inRandomOrder()->first()->id ?? 1,
            'marca_id' => Marca::inRandomOrder()->first()->id ?? 1,
        ];
    }
}
