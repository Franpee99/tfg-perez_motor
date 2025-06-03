<?php

use App\Http\Controllers\CitaTallerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevolucionController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\LineaCarritoController;
use App\Http\Controllers\MantenimientoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProductoPublicoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TiendaController;
use App\Http\Controllers\TiposMantenimientoController;
use App\Http\Controllers\ValoracionController;
use App\Http\Controllers\VehiculoController;
use App\Models\CitaTaller;
use App\Models\Mantenimiento;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
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

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

/* ADMIN: PANEL DE ADMINISTRACIÓN */
Route::get('/admin', function () {
    if (!Auth::user()->is_admin) {
        abort(403, 'No tienes permisos para acceder');
    }
    return Inertia::render('PanelAdmin');
})->middleware(['auth'])->name('admin.panel');

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
    Route::get('/pedidos/admin', [PedidoController::class, 'indexAdmin'])->name('admin.pedidos.index');
    Route::get('/pedidos/{pedido}', [PedidoController::class, 'show'])->name('pedidos.show');
    Route::post('/pedidos/{pedido}/cancelar', [PedidoController::class, 'cancelar'])->name('pedidos.cancelar');
    Route::put('/pedidos/{pedido}/cambiar-estado', [PedidoController::class, 'cambiarEstado'])->name('admin.pedidos.cambiarEstado');
});

/* PHPJASPER */
Route::middleware(['auth'])->group(function () {
    Route::get('/factura/{pedido}', [FacturaController::class, 'generar'])->name('factura.ver');
    Route::get('/factura-taller/{mantenimiento}', [FacturaController::class, 'generarFacturaTaller'])->name('factura.taller.ver');
});

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

/* CITA TALLER */
Route::middleware(['auth'])->group(function () {
    /* ADMIN */
    Route::get('/citas-taller', [CitaTallerController::class, 'indexAdmin'])->name('admin.citas.index');
    Route::post('/citas-taller', [CitaTallerController::class, 'store'])->name('citas.store');
    Route::put('/citas/{citaTaller}', [CitaTallerController::class, 'update'])->name('admin.citas.update');
    Route::delete('/citas/{citaTaller}', [CitaTallerController::class, 'destroy'])->name('admin.citas.destroy');

    // PANEL USER
    Route::get('/taller', function () {
    return Inertia::render('PanelUserTaller');
    })->name('taller.panel.user');

    /* USER */
    Route::get('/citas-taller/reservar', [CitaTallerController::class, 'reservarCita'])->name('user.reservar');
    Route::post('/citas-taller/reservar', [CitaTallerController::class, 'storeReservarCita'])->name('user.reservar.store');
    Route::get('/mis-citas', [CitaTallerController::class, 'misCitas'])->name('citas.misCitas');
    Route::put('/citas/{cita}/cancelar', [CitaTallerController::class, 'cancelarCita'])->name('user.citas.cancelar');

});

/* VEHICULO */
Route::middleware(['auth'])->group(function () {
    /* ADMIN */
    Route::get('/vehiculos/admin', [VehiculoController::class, 'adminVehiculo'])->name('admin.vehiculos');

    /* USER */
    Route::get('/vehiculos', [VehiculoController::class, 'index'])->name('vehiculos.index');
    Route::get('/vehiculos/crear', [VehiculoController::class, 'create'])->name('vehiculos.create');
    Route::post('/vehiculos', [VehiculoController::class, 'store'])->name('vehiculos.store');
    Route::get('vehiculos/{vehiculo}', [VehiculoController::class, 'show'])->withTrashed()->name('vehiculos.show');
    Route::get('/vehiculos/{vehiculo}/editar', [VehiculoController::class, 'edit'])->name('vehiculos.edit');
    Route::put('/vehiculos/{vehiculo}', [VehiculoController::class, 'update'])->name('vehiculos.update');
    Route::delete('/vehiculos/{vehiculo}/eliminar', [VehiculoController::class, 'destroy'])->name('vehiculos.destroy');
});

/* MANTENIMIENTO */
Route::get('/admin/mantenimientos/create', [MantenimientoController::class, 'create'])->name('admin.mantenimientos.create');
Route::post('/admin/mantenimientos', [MantenimientoController::class, 'store'])->name('admin.mantenimientos.store');
Route::get('/mantenimientos/{mantenimiento}', [MantenimientoController::class, 'show'])->name('mantenimientos.show');
Route::get('/admin/mantenimientos/{mantenimiento}/edit', [MantenimientoController::class, 'edit'])->name('admin.mantenimientos.edit');
Route::put('/admin/mantenimientos/{mantenimiento}', [MantenimientoController::class, 'update'])->name('admin.mantenimientos.update');

/* TIPOS MANTENIMIENTO */
Route::post('/admin/tipos-mantenimiento', [TiposMantenimientoController::class, 'store'])->name('admin.tipos-mantenimiento.store');
