<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\Talla;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductoController extends Controller
{
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
        })->toArray();

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
        $validated = $request->validate([
            'nombre'           => 'required|string|max:255',
            'descripcion'      => 'nullable|string',
            'precio'           => 'required|numeric|min:0',
            'subcategoria_id'  => 'required|exists:subcategorias,id',
            'imagen'           => 'nullable|image|max:2048',
            'marca_id'         => 'nullable|exists:marcas,id',
            'nueva_marca'      => 'nullable|string|max:255',
            'tallas'           => 'required|array|min:1',
            'tallas.*.id'      => 'nullable|exists:tallas,id',
            'tallas.*.nombre'  => 'required|string|max:50',
            'tallas.*.stock'   => 'required|integer|min:0',
        ]);

        // Si se proporciona una nueva marca, la creamos; de lo contrario usamos la seleccionada
        $marca_id = $request->filled('nueva_marca')
            ? Marca::create(['nombre' => $request->nueva_marca])->id
            : (int) $request->marca_id;

        if (!$marca_id) {
            return redirect()->back()->withErrors(['marca_id' => 'Debe seleccionar o crear una marca.']);
        }

        // Guardar imagen
        $imagePath = $request->file('imagen')
            ? $request->file('imagen')->store('productos', 'public')
            : null;

        // Crear el producto
        $producto = Producto::create([
            'nombre'          => $validated['nombre'],
            'descripcion'     => $validated['descripcion'] ?? null,
            'precio'          => $validated['precio'],
            'subcategoria_id' => $validated['subcategoria_id'],
            'marca_id'        => $marca_id,
            'imagen_url'      => $imagePath,
        ]);

        // Recorrer las tallas y adjuntarlas al producto con su stock en el pivot
        foreach ($validated['tallas'] as $tallaData) {
            // Si se envía un id, usamos esa talla; de lo contrario, la creamos (o usamos firstOrCreate para evitar duplicados)
            if (!empty($tallaData['id'])) {
                $talla_id = $tallaData['id'];
            } else {
                $talla = Talla::firstOrCreate(['nombre' => $tallaData['nombre']]);
                $talla_id = $talla->id;
            }
            // Adjuntar la talla con el stock a la tabla pivote
            $producto->tallas()->attach($talla_id, ['stock' => $tallaData['stock']]);
        }

        return redirect()->route('productos.index')->with('success', 'Producto creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Producto $producto)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Producto $producto)
    {
        return Inertia::render('Productos/Edit', [
            'producto' => $producto->load('categoria'),
            'categorias' => Categoria::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductoRequest $request, Producto $producto)
    {

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
            'imagen' => 'nullable|image|max:2048', // La imagen es opcional
        ]);

        // Si se sube una nueva imagen, eliminamos la anterior y guardamos la nueva
        if ($request->hasFile('imagen')) {
            if ($producto->imagen_url) {
                Storage::disk('public')->delete($producto->imagen_url);
            }
            $validated['imagen_url'] = $request->file('imagen')->store('productos', 'public');
        }

        // Actualizar el producto
        $producto->update($validated);

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Producto $producto)
    {
        if ($producto->imagen_url) {
            Storage::disk('public')->delete($producto->imagen_url);
        }
        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }
}
