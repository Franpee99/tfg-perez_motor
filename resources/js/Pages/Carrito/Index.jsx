import React from 'react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import Boton from '@/Components/Boton';

export default function Index({ lineasCarrito, guardados }) {
  const modificarCantidad = (linea, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarLinea(linea.id);
      return;
    }

    router.put(route('carrito.modificarLinea', linea.id), {
      cantidad: nuevaCantidad
    }, {
      preserveScroll: true,
    });
  };

  const eliminarLinea = (id) => {
    router.delete(route('carrito.destroy', id));
  };

  const vaciarCarrito = () => {
    router.delete(route('carrito.vaciar'));
  };

  const cambiarEstadoGuardado = (id) => {
    router.put(route('carrito.cambiarEstadoGuardado', id), {}, { preserveScroll: true });
  };

  const calcularSubtotal = () => {
    return lineasCarrito
      .reduce((total, linea) => total + (linea.producto.precio * linea.cantidad), 0)
      .toFixed(2);
  };

  const renderLinea = (linea, esGuardado = false) => (
    <div
      key={linea.id}
      className="bg-white border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-white border rounded-md overflow-hidden flex-shrink-0">
          <img
            src={`/storage/${linea.producto.imagenes?.[0]?.ruta}`}
            alt={linea.producto.nombre}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#040A2A]">{linea.producto.nombre}</h2>
            <p className="text-sm text-gray-700 mt-1">Talla: {linea.talla.nombre}</p>
          </div>

          {!esGuardado && (
            <div className="flex items-center gap-2 mt-3">
              <Boton
                texto="−"
                tamaño="xs"
                onClick={() => modificarCantidad(linea, linea.cantidad - 1)}
                className="w-8 h-8 rounded-full bg-[#040A2A] text-white hover:bg-opacity-90 text-sm p-0 flex items-center justify-center"
              />
              <span className="px-3 py-1 border rounded font-medium">{linea.cantidad}</span>
              <Boton
                texto="+"
                tamaño="xs"
                onClick={() => modificarCantidad(linea, linea.cantidad + 1)}
                className="w-8 h-8 rounded-full bg-[#040A2A] text-white hover:bg-opacity-90 text-sm p-0 flex items-center justify-center"
              />
            </div>
          )}

          <div className="flex gap-3 mt-2 text-xs text-[#040A2A]">
            <button className="hover:underline" onClick={() => eliminarLinea(linea.id)}>
              Eliminar
            </button>
            <span>|</span>
            <button className="hover:underline" onClick={() => cambiarEstadoGuardado(linea.id)}>
              {esGuardado ? 'Mover al carrito' : 'Guardar para más tarde'}
            </button>
          </div>
        </div>
      </div>

      <div className="text-right sm:w-32 text-xl font-bold text-[#040A2A]">
        {(linea.producto.precio * linea.cantidad).toFixed(2)} €
      </div>
    </div>
  );

  return (
    <AppLayout>
      <main className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md space-y-12">
        {/* CARRITO */}
        <section>
          <h1 className="text-3xl font-bold text-[#040A2A] mb-6">Carrito</h1>

          {lineasCarrito.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Boton
                  texto="Vaciar carrito"
                  tamaño="sm"
                  onClick={vaciarCarrito}
                  className="bg-[#040A2A] text-white hover:opacity-90"
                />
              </div>

              <div className="space-y-6">
                {lineasCarrito.map((linea) => renderLinea(linea))}
              </div>

              <div className="border-t border-gray-300 mt-8 pt-4 text-right text-lg font-semibold text-[#040A2A]">
                Subtotal ({lineasCarrito.length} producto{lineasCarrito.length > 1 && 's'}): {calcularSubtotal()} €
              </div>
            </>
          )}
        </section>

        {/* GUARDADO PARA MÁS TARDE */}
        <section className="border-t border-gray-300 pt-8">
          <h2 className="text-2xl font-bold text-[#040A2A] mb-4">Guardado para más tarde</h2>

          {guardados.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-md p-6 text-sm text-gray-600">
              No hay productos guardados para más tarde.
            </div>
          ) : (
            <div className="space-y-6">
              {guardados.map((linea) => renderLinea(linea, true))}
            </div>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
