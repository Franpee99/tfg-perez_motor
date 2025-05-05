<?php

namespace Database\Seeders;

use App\Models\Caracteristica;
use App\Models\Imagen;
use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Subcategoria;
use App\Models\Talla;
use App\Models\Marca;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $categoriasConNombres = [
            'Cascos' => [
                'Shark Spartan GT',
                'AGV K6 S',
                'Shoei NXR2',
                'HJC RPHA 11',
                'Scorpion EXO-R1 Air',
                'Arai RX-7V',
                'LS2 FF800 Storm',
                'X-Lite X-803 RS',
                'Bell Race Star Flex',
                'Nolan N87 Plus',
                'AGV Pista GP RR',
                'Shoei GT-Air 2',
                'Shark Skwal 2',
                'LS2 Challenger',
                'HJC i70',
                'Bell Qualifier DLX',
                'Airoh Valor',
                'Nexx X.WED 2',
                'Caberg Drift Evo',
                'Icon Airflite'
            ],
            'Chaquetas' => [
                'Dainese Super Speed 4',
                'Alpinestars T-SP S Waterproof',
                'Rev’It! Eclipse 2',
                'Spidi Flash Evo',
                'Furygan Jet Evo',
                'Ixon Striker Air',
                'Bering Drift',
                'Macna Velocity',
                'RST GT Textile',
                'Held Tropic 3.0',
                'Segura Style',
                'Dainese Air Frame D1',
                'Clover Crossover 3',
                'Tucano Urbano Network 3G',
                'Rev’It! Tornado 3',
                'Alpinestars Andes V3',
                'Spidi Voyager 3',
                'Ixon Vortex 3',
                'Furygan Oxi',
                'Bering Yukon'
            ],
            'Guantes' => [
                'Alpinestars SP-8 V3',
                'Dainese Carbon 4',
                'Rev’It! Sand 4',
                'Furygan RG-20',
                'Spidi NK-6',
                'Bering York',
                'Held Air N Dry',
                'IXS Tour LT',
                'RST Axis',
                'Five RFX1',
                'Macna Octar',
                'Tucano Urbano Ginka',
                'Rev’It! Volcano',
                'Dainese Mig C2',
                'Alpinestars SMX-2 Air Carbon',
                'Furygan Jet All Season',
                'Spidi X-Knit',
                'Bering S-Pro',
                'Held Race-Tex',
                'Five Stunt Evo'
            ],
            'Botas' => [
                'Alpinestars SMX-6 V2',
                'Dainese Torque 3 Out',
                'Forma Adventure Low',
                'Sidi Adventure 2',
                'TCX Drifter WP',
                'Rev’It! Pioneer GTX',
                'Furygan Jet D3O',
                'Bering Cruiser',
                'Held Segrino',
                'Gaerne G-Adventure',
                'Alpinestars Toucan',
                'Dainese Centauri',
                'Forma Terrain TX',
                'TCX Baja Mid WP',
                'Sidi Aria Gore',
                'XPD XP7-R',
                'Bering X-Road',
                'Falco Avantour',
                'RST Tractech Evo 3',
                'Stylmartin Matrix'
            ],
            'Pantalones' => [
                'Rev’It! Sand 4 H2O',
                'Dainese New Drake Air',
                'Alpinestars Andes V3',
                'Furygan Apalaches',
                'Spidi Superstorm',
                'Ixon Ragnar',
                'Bering Higgins',
                'Held Torno II',
                'Macna Fulcrum',
                'Tucano Urbano Panta',
                'RST Pro Series Adventure',
                'Dainese Tempest D-Dry',
                'Alpinestars Raider V2',
                'Rev’It! Horizon 2',
                'Furygan Discovery',
                'Spidi Mission-T',
                'Bering Tenere',
                'Held Avolo 3',
                'Macna Logic',
                'Tucano Urbano TexWork'
            ],
        ];

        $caracteristicasPorCategoria = [
            'Cascos' => [
                'Material' => 'Fibra de carbono multicapa',
                'Peso' => '1.450 gramos',
                'Homologación' => 'Norma europea ECE 22.05',
                'Tipo de cierre' => 'Cierre micrométrico de acero inoxidable',
                'Ventilación' => 'Sistema de ventilación frontal y extractores traseros',
                'Interior desmontable' => 'Tejido antibacteriano desmontable y lavable',
                'Pantalla solar integrada' => 'Visor solar escamoteable de alta resistencia',
                'Compatibilidad intercomunicador' => 'Espacios dedicados para altavoces de intercomunicador',
            ],
            'Chaquetas' => [
                'Material' => 'Cordura 600D con refuerzos en zonas de impacto',
                'Impermeabilidad' => 'Membrana interior resistente al agua y al viento',
                'Protección' => 'Protecciones CE Nivel 2 en hombros y codos',
                'Forro interior' => 'Forro térmico interior desmontable para invierno',
                'Ventilación' => 'Entradas de aire con cremalleras en pecho y espalda',
                'Ajustes' => 'Sistema de ajuste en brazos, cintura y muñecas',
                'Bolsillos' => 'Bolsillos exteriores impermeables y bolsillos internos ocultos',
                'Reflectante' => 'Inserciones reflectantes de alta visibilidad en espalda y brazos',
            ],
            'Guantes' => [
                'Tipo de cierre' => 'Velcro de ajuste rápido en muñeca',
                'Protección' => 'Protecciones rígidas en nudillos y refuerzo en palma',
                'Transpiración' => 'Paneles de malla ventilada en dorso y dedos',
                'Pantalla táctil' => 'Dedo índice compatible con pantallas capacitivas',
                'Material' => 'Combinación de piel bovina y tejido elástico',
                'Doble cierre' => 'Cierre independiente en muñeca y antebrazo con refuerzo interior',
                'Refuerzo palma' => 'Zona de agarre con refuerzo de cuero reforzado',
                'Uso estacional' => 'Diseñados para uso en clima cálido y seco',
            ],
            'Botas' => [
                'Altura' => 'Diseño de media caña ideal para touring',
                'Suela' => 'Suela antideslizante con compuesto de alta adherencia',
                'Impermeabilidad' => 'Forro interior con tratamiento impermeable y transpirable',
                'Protección tobillos' => 'Protección interior rígida en zona de tobillos y talón',
                'Cierre' => 'Sistema de cierre lateral con cremallera y solapa de velcro',
                'Reforzadas en la puntera' => 'Puntera con capa extra de protección termoformada',
                'Material' => 'Microfibra técnica con acabado de alta resistencia a la abrasión',
                'Plantilla' => 'Plantilla anatómica con tratamiento antiolor y absorción de impactos',
            ],
            'Pantalones' => [
                'Material' => 'Tejido resistente con refuerzos en zonas críticas',
                'Protección' => 'Rodilleras con certificación CE extraíbles',
                'Forro interior' => 'Forro térmico acolchado con aislamiento térmico',
                'Impermeabilidad' => 'Capa interior impermeable con costuras selladas',
                'Ajustes' => 'Sistema de regulación en cintura, cadera y tobillos',
                'Paneles elásticos' => 'Paneles flexibles en rodillas y parte trasera para mayor movilidad',
                'Cremallera de unión' => 'Cremallera compatible con chaquetas para conexión integral',
                'Bolsillos' => 'Bolsillos cargo amplios con cierre por velcro y cremallera',
            ],
        ];

        $imagenesPorCategoria = [
            'Cascos' => collect(range(1, 20))->map(fn($i) => "casco_prueba_{$i}.jpg")->values(),
            'Chaquetas' => collect(range(1, 20))->map(fn($i) => "chaqueta_prueba_{$i}.jpg")->values(),
            'Guantes' => collect(range(1, 20))->map(fn($i) => "guante_prueba_{$i}.jpg")->values(),
            'Botas' => collect(range(1, 20))->map(fn($i) => "bota_prueba_{$i}.jpg")->values(),
            'Pantalones' => collect(range(1, 20))->map(fn($i) => "pantalon_prueba_{$i}.jpg")->values(),
        ];

        $indiceImagenes = [
            'Cascos' => 0,
            'Chaquetas' => 0,
            'Guantes' => 0,
            'Botas' => 0,
            'Pantalones' => 0,
        ];

        foreach ($categoriasConNombres as $nombreCategoria => $nombresProductos) {
            $subcategorias = Subcategoria::whereHas('categoria', function ($q) use ($nombreCategoria) {
                $q->where('nombre', $nombreCategoria);
            })->pluck('id');

            if ($subcategorias->isEmpty()) continue;

            foreach ($nombresProductos as $nombreProducto) {
                $producto = Producto::create([
                    'nombre' => $nombreProducto,
                    'descripcion' => 'Producto de la categoría ' . $nombreCategoria,
                    'precio' => rand(50, 500),
                    'subcategoria_id' => $subcategorias->random(),
                    'marca_id' => Marca::inRandomOrder()->first()->id,
                ]);

                // Tallas
                $tallasFijas = ['XS', 'S', 'M', 'L', 'XL'];
                $tallas = Talla::whereIn('nombre', $tallasFijas)->get();

                foreach ($tallas as $talla) {
                    $producto->tallas()->attach($talla->id, [
                        'stock' => rand(5, 20)
                    ]);
                }

                // Características
                if (isset($caracteristicasPorCategoria[$nombreCategoria]) && rand(0, 1)) {
                    foreach ($caracteristicasPorCategoria[$nombreCategoria] as $nombre => $definicion) {
                        $caracteristica = Caracteristica::firstOrCreate(['caracteristica' => $nombre]);

                        $producto->caracteristicas()->attach($caracteristica->id, [
                            'definicion' => $definicion,
                        ]);
                    }
                }

                // Imagenes
                if (isset($imagenesPorCategoria[$nombreCategoria])) {
                    $imagenes = $imagenesPorCategoria[$nombreCategoria];
                    $indice = $indiceImagenes[$nombreCategoria];

                    if ($indice < $imagenes->count()) {
                        $nombreImagen = $imagenes[$indice];

                        Imagen::create([
                            'producto_id' => $producto->id,
                            'ruta' => strtolower($nombreCategoria) . '/' . $nombreImagen,
                        ]);

                        $indiceImagenes[$nombreCategoria]++;
                    }
                }
            }
        }
    }
}
