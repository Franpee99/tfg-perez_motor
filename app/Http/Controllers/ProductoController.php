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
        $productos = Producto::with(['marca', 'subcategoria.categoria', 'tallas', 'imagenes'])
            ->paginate(10);

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'categorias' => Categoria::with('subcategorias')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
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
            'descripcion'      => $validated['descripcion'] ?? null,
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
            $talla = Talla::firstOrCreate(['nombre' => $tallaData['nombre']]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
        }

        if(!empty($validated['caracteristicas'])){
            foreach ($validated['caracteristicas'] as $caracteristicaData) {

                if (empty($caracteristicaData['caracteristica']) && empty($caracteristicaData['definicion'])) {
                    continue;
                }

                $caracteristica = Caracteristica::firstOrCreate(['caracteristica' => $caracteristicaData['caracteristica']]);
                $producto->caracteristicas()->attach($caracteristica->id, ['definicion' => $caracteristicaData['definicion']]);
            }
        }

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
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

        $validated = $request->validated();

        $marca_id = $request->filled('nueva_marca')
            ? Marca::create(['nombre' => $request->nueva_marca])->id
            : (int) $request->marca_id;
        if (!$marca_id) {
            return redirect()->back()->withErrors(['marca_id' => 'Debe seleccionar o crear una marca.']);
        }
        $validated['marca_id'] = $marca_id;

        $imagenesActuales = $producto->imagenes ?? [];

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $imagenesActuales[] = $path;
            }
        }

        $validated['imagenes'] = $imagenesActuales;

        $producto->update($validated);

        // Desvincular las tallas existentes y asociar las nuevas
        $producto->tallas()->detach();
        foreach ($validated['tallas'] as $tallaData) {
            $talla = Talla::firstOrCreate(['nombre' => $tallaData['nombre']]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
        }

        $producto->caracteristicas()->detach();
        if(!empty($validated['caracteristicas'])){
            foreach ($validated['caracteristicas'] as $caracteristicaData) {

                if (empty($caracteristicaData['caracteristica']) && empty($caracteristicaData['definicion'])) {
                    continue;
                }

                $caracteristica = Caracteristica::firstOrCreate(['caracteristica' => $caracteristicaData['caracteristica']]);
                $producto->caracteristicas()->attach($caracteristica->id, ['definicion' => $caracteristicaData['definicion']]);
            }
        }

        return redirect()->route('productos.show', $producto->id)
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        $this->authorize('delete', $producto);

        if ($producto->imagen_url) {
            Storage::disk('public')->delete($producto->imagen_url);
        }
        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }
}
