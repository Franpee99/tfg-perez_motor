<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Subcategoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubcategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subcategorias = [
            'Cascos' => ['Cascos integrales', 'Cascos jet', 'Cascos modulares', 'Cascos off road'],
            'Chaquetas' => ['Chaquetas cordura', 'Chaquetas cordura piel', 'Chaquetas piel'],
            'Guantes' => ['Guantes cordura', 'Guantes cordura mujer', 'Guantes piel', 'Guantes piel mujer', 'Guantes calefactables'],
            'Pantalones' => ['Pantalones cordura', 'Pantalones cordura mujer', 'Pantalones vaqueros', 'Pantalones vaquero mujer'],
            'Botas' => ['Botas carretera', 'Botas carretera mujer', 'Botas off road'],
        ];

        foreach ($subcategorias as $categoriaNombre => $subcats) {
            $categoria = Categoria::where('nombre', $categoriaNombre)->first();

            if ($categoria) {
                foreach ($subcats as $subcatNombre) {
                    Subcategoria::updateOrCreate([ //el updateOrCreate evita duplicados en caso de que el seeder se ejecute más de una vez
                        'nombre' => $subcatNombre,
                        'categoria_id' => $categoria->id
                    ]);
                }
            }
        }
    }
}
