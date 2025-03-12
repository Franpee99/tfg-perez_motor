<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
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
        $productos = Producto::with(['marca', 'subcategoria.categoria', 'tallas'])
        ->get()
        ->map(function ($producto) {
            $producto->stock_total = $producto->tallas->sum(function ($talla) {
                return $talla->pivot->stock;
            });
            return $producto;
        })->toArray(); //A array para asegurarnos que los datos se envien correctamnete a la vista Inertia.

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

        // Si se ingresa una nueva marca, la creamos; de lo contrario, usamos la marca seleccionada.
        $marca_id = $request->filled('nueva_marca')
            ? Marca::create(['nombre' => $request->nueva_marca])->id
            : (int) $request->marca_id;
        if (!$marca_id) {
            return redirect()->back()->withErrors(['marca_id' => 'Debe seleccionar o crear una marca.']);
        }

        // Guardar imagen si se proporciona.
        $imagenes = [];
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $imagenes[] = $path;
            }
        }

        // Crear el producto, incluyendo la ficha técnica que se almacenará como JSON.
        $producto = Producto::create([
            'nombre'           => $validated['nombre'],
            'descripcion'      => $validated['descripcion'] ?? null,
            'precio'           => $validated['precio'],
            'subcategoria_id'  => $validated['subcategoria_id'],
            'marca_id'         => $marca_id,
            'ficha_tecnica'    => $validated['ficha_tecnica'] ?? [],
            'imagenes'       => $imagenes,
        ]);

        foreach ($validated['tallas'] as $tallaData) {
            // Buscamos la talla por nombre o la creamos para evitar duplicados.
            $talla = Talla::firstOrCreate(['nombre' => $tallaData['nombre']]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
        }

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        $producto->load(['subcategoria.categoria', 'marca', 'tallas']);

        // Calcula el stock total a partir de las tallas (usando el stock del pivot)
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
        $producto->load(['subcategoria.categoria', 'marca', 'tallas']);

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


        // Partimos de las imágenes actuales del producto.
        $imagenRecurrente = $producto->imagenes ?? [];
        // Procesamos las imágenes a eliminar, si se enviaron.
        if ($request->has('imagenes_a_eliminar')) {
            $imagenesAEliminar = $request->input('imagenes_a_eliminar'); // array de rutas
            foreach ($imagenesAEliminar as $img) {
                if (($key = array_search($img, $imagenRecurrente)) !== false) {
                    unset($imagenRecurrente[$key]);
                    Storage::disk('public')->delete($img);
                }
            }
            $imagenRecurrente = array_values($imagenRecurrente);
        }
        // Procesamos las nuevas imágenes, si se han subido.
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('productos', 'public');
                $imagenRecurrente[] = $path;
            }
        }
        $validated['imagenes'] = $imagenRecurrente;

        $producto->update($validated);

        // Actualizar JSON
        $producto->ficha_tecnica = $validated['ficha_tecnica'] ?? [];
        $producto->save();

        // Desvincular las tallas existentes y asociar las nuevas
        $producto->tallas()->detach();
        foreach ($validated['tallas'] as $tallaData) {
            $talla = Talla::firstOrCreate(['nombre' => $tallaData['nombre']]);
            $producto->tallas()->attach($talla->id, ['stock' => $tallaData['stock']]);
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
