<?php

use App\Http\Controllers\LineaCarritoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProductoPublicoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TiendaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

/*ADMIN: Productos*/
Route::resource('productos', ProductoController::class)->middleware('auth');

/*CLIENTES (PUBLIC)*/
/*Poductos por secciones (categorias)*/
Route::get('/index/{categoria}', [TiendaController::class, 'index'])->name('tienda.index');
Route::get('/producto/{producto}', [TiendaController::class, 'show'])->name('tienda.show');

/* CARRITO */
Route::middleware(['auth'])->group(function () {
    Route::get('/carrito', [LineaCarritoController::class, 'index'])->name('carrito.index');
    Route::post('/carrito/insertar', [LineaCarritoController::class, 'insertarLinea'])->name('carrito.insertarLinea');
    Route::put('/carrito/{lineaCarrito}/guardar', [LineaCarritoController::class, 'cambiarEstadoGuardado'])->name('carrito.cambiarEstadoGuardado');
    Route::put('/carrito/{lineaCarrito}', [LineaCarritoController::class, 'modificarLinea'])->name('carrito.modificarLinea');
    Route::delete('/carrito/{lineaCarrito}', [LineaCarritoController::class, 'destroy'])->name('carrito.destroy');
    Route::delete('/carrito', [LineaCarritoController::class, 'vaciar'])->name('carrito.vaciar');
});

/* INFORMACIÓN */
Route::get('/quienesSomos', function () {
    return Inertia::render('Informacion/QuienesSomos');
});
