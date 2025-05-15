<?php

use App\Http\Controllers\DevolucionController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\LineaCarritoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProductoPublicoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\ValoracionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
*/

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

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

Route::get('/contacto', function () {
    return Inertia::render('Informacion/Contacto');
});

/* PAYPAL */
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [PagoController::class, 'checkout'])->name('checkout');
    Route::post('/pagos/paypal', [PagoController::class, 'procesarPago']);
});

/* PEDIDOS */
Route::middleware(['auth'])->group(function () {
    Route::get('/pedidos', [PedidoController::class, 'index'])->name('pedidos.index');
    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show'])->name('pedidos.show');
    Route::post('/pedidos/{pedido}/cancelar', [PedidoController::class, 'cancelar'])->name('pedidos.cancelar');
});

/* PHPJASPER */
Route::get('/factura/{pedido}', [FacturaController::class, 'generar'])
    ->middleware(['auth'])
    ->name('factura.ver');

/* VALORACIÓN */
Route::middleware(['auth'])->group(function () {
    Route::post('/productos/{producto}/valorar', [ValoracionController::class, 'guardar'])->name('productos.valorar');
    Route::delete('/productos/{producto}/valorar', [ValoracionController::class, 'eliminarValoracion'])->name('productos.eliminarValoracion');
});

/* DEVOLUCIÓN */
Route::middleware(['auth'])->group(function () {
    Route::get('/devoluciones/formulario', [DevolucionController::class, 'formulario'])->name('devoluciones.formulario');
    Route::post('/devoluciones', [DevolucionController::class, 'guardar'])->name('devoluciones.guardar');

    /* ADMIN */
    Route::get('/devoluciones/admin', [DevolucionController::class, 'indexAdmin'])->name('admin.devoluciones.index');
    Route::put('/devoluciones//admin/{devolucion}', [DevolucionController::class, 'actualizarEstado'])->name('admin.devoluciones.update');
});
