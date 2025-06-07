<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\Caracteristica;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\Talla;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $this->authorize('viewAny', Producto::class);

        $productos = Producto::with([
            'marca',
            'subcategoria.categoria',
            'imagenes',
            'tallas',
            'caracteristicas'
        ])
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $this->authorize('create', Producto::class);

        return Inertia::render('Productos/Create', [
            'categorias' => Categoria::with('subcategorias')->get(),
            'marcas' => Marca::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductoRequest $request)
    {
        $validated = $request->validated();

        $marca_id = $request->filled('nueva_marca')
            ? Marca::create(['nombre' => $request->nueva_marca])->id
            : (int) $request->marca_id;
        if (!$marca_id) {
            return redirect()->back()->withErrors(['marca_id' => 'Debe seleccionar o crear una marca.']);
        }


        $producto = Producto::create([
            'nombre'           => $validated['nombre'],
            'descripcion'      => $validated['descripcion'] ?? "",
            'precio'           => $validated['precio'],
            'subcategoria_id'  => $validated['subcategoria_id'],
            'marca_id'         => $marca_id,
        ]);

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');

                $producto->imagenes()->create([ //laravel pone automaticamente el producto_id
                    'ruta' => $path,
                ]);
            }
        }

        foreach ($validated['tallas'] as $tallaData) {
            $nombreTalla = strtoupper($tallaData['nombre']);
            $talla = Talla::firstOrCreate(['nombre' => $nombreTalla]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
        }

        if (!empty($validated['caracteristicas'])) {
            foreach ($validated['caracteristicas'] as $caracteristicaData) {
                if (empty($caracteristicaData['caracteristica']) && empty($caracteristicaData['definicion'])) {
                    continue;
                }

                $caracteristicaNombre = ucfirst(strtolower($caracteristicaData['caracteristica']));
                $definicion = ucfirst(strtolower($caracteristicaData['definicion'] ?? ''));

                $caracteristica = Caracteristica::firstOrCreate(['caracteristica' => $caracteristicaNombre]);
                $producto->caracteristicas()->attach($caracteristica->id, ['definicion' => $definicion]);
            }
        }

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        $this->authorize('view', $producto);

        $producto->load(['subcategoria.categoria', 'marca', 'tallas', 'caracteristicas', 'imagenes']);

        // Stock total (stock del pivot)
        $producto->stock_total = $producto->tallas->sum(function ($talla) {
            return $talla->pivot->stock;
        });

        return Inertia::render('Productos/Show', [
            'producto' => $producto,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {

        $this->authorize('viewAny', $producto);

        $producto->load(['subcategoria.categoria', 'marca', 'tallas', 'caracteristicas', 'imagenes']);

        return Inertia::render('Productos/Edit', [
            'producto'    => $producto,
            'categorias'  => Categoria::with('subcategorias')->get(),
            'marcas'      => Marca::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductoRequest $request, Producto $producto)
    {

        $this->authorize('update', $producto);

        $validated = $request->validated();

        $marca_id = $request->filled('nueva_marca')
            ? Marca::create(['nombre' => $request->nueva_marca])->id
            : (int) $request->marca_id;
        if (!$marca_id) {
            return redirect()->back()->withErrors(['marca_id' => 'Debe seleccionar o crear una marca.']);
        }

        $producto->update([
            'nombre'          => $validated['nombre'],
            'descripcion'     => $validated['descripcion'] ?? '',
            'precio'          => $validated['precio'],
            'subcategoria_id' => $validated['subcategoria_id'],
            'marca_id'        => $marca_id,
        ]);

        $imagenesAEliminar = $request->input('imagenes_a_eliminar', []);

        if (!empty($imagenesAEliminar)) {
            foreach ($request->imagenes_a_eliminar as $ruta) {
                $imagen = $producto->imagenes()->where('ruta', $ruta)->first();
                if ($imagen) {
                    Storage::disk('public')->delete($imagen->ruta);
                    $imagen->delete();
                }
            }
        }

        $imagenesActuales = $producto->imagenes ?? [];

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');

                $producto->imagenes()->create([
                    'ruta' => $path,
                ]);
            }
        }

        $validated['imagenes'] = $imagenesActuales;

        // Desvincular las tallas existentes y asociar las nuevas
        $producto->tallas()->detach();
        foreach ($validated['tallas'] as $tallaData) {
            $nombreTalla = strtoupper($tallaData['nombre']);
            $talla = Talla::firstOrCreate(['nombre' => $nombreTalla]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
        }

        $producto->caracteristicas()->detach();
        if (!empty($validated['caracteristicas'])) {
            foreach ($validated['caracteristicas'] as $caracteristicaData) {
                if (empty($caracteristicaData['caracteristica']) && empty($caracteristicaData['definicion'])) {
                    continue;
                }

                $caracteristicaNombre = ucfirst(strtolower($caracteristicaData['caracteristica']));
                $definicion = ucfirst(strtolower($caracteristicaData['definicion'] ?? ''));

                $caracteristica = Caracteristica::firstOrCreate(['caracteristica' => $caracteristicaNombre]);
                $producto->caracteristicas()->attach($caracteristica->id, ['definicion' => $definicion]);
            }
        }

        return redirect()->route('productos.show', $producto->id)
            ->with('success', 'Producto actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $this->authorize('delete', $producto);

        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }
}
