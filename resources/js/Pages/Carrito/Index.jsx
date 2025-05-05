import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import { router, usePage } from '@inertiajs/react';
import Boton from '@/Components/Boton';
import Checkout from '../Checkout';

export default function Index({ lineasCarrito, guardados }) {
  // Modal de checkout
  const [mostrarModal, setMostrarModal] = useState(false);

  // Modal de rellenar la dirección (profile)
  const [mostrarErrorDireccion, setMostrarErrorDireccion] = useState(false);
  const [mensajeErrorDireccion, setMensajeErrorDireccion] = useState('');


  const user = usePage().props.auth.user;

  const finalizarCompra = () => {
    if (!user.direccion || !user.provincia || !user.codigo_postal || !user.telefono) {
      setMensajeErrorDireccion('Debes completar tu dirección antes de finalizar la compra');
      setMostrarErrorDireccion(true);
      return;
    }

    setMostrarModal(true);
  };

  useEffect(() => {
    if (mostrarErrorDireccion) {
      const timeout = setTimeout(() => {
        setMostrarErrorDireccion(false);
        router.visit(route('profile.edit'));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [mostrarErrorDireccion]);

  const modificarCantidad = (linea, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarLinea(linea.id);
      return;
    }

    router.put(route('carrito.modificarLinea', linea.id), {
      cantidad: nuevaCantidad
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        router.reload({ only: ['lineasCarrito'] }); // Recarga solo la lineas del carrito
      },
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
      .reduce((total, linea) => total + ((linea.producto?.precio || 0) * linea.cantidad), 0)
      .toFixed(2);
  };

  const renderLinea = (linea, esGuardado = false) => (
    <div
      key={linea.id}
      className="bg-white border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div className="flex gap-4">
        <div className="w-32 h-32 bg-white border rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
          {linea.producto ? (
            <img
              src={`/storage/${linea.producto.imagenes?.[0]?.ruta}`}
              alt={linea.producto.nombre}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xs text-gray-500 text-center">Producto eliminado</span>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#040A2A]">
              {linea.producto ? linea.producto.nombre : 'Producto eliminado'}
            </h2>
            <p className="text-sm text-gray-700 mt-1">Talla: {linea.talla?.nombre || '-'}</p>
          </div>

          {/* Botones cantidad */}
          {!esGuardado && linea.producto && (
            <div className="flex items-center gap-2 mt-3">
              {linea.stockDisponible === 0 ? (
                <span className="text-red-600 font-bold text-sm">Producto agotado</span>
              ) : (
                <>
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
                    onClick={() => {
                      if (linea.cantidad < linea.stockDisponible) {
                        modificarCantidad(linea, linea.cantidad + 1);
                      }
                    }}
                    disabled={
                      linea.cantidad >= linea.stockDisponible
                    }
                    className="w-8 h-8 rounded-full bg-[#040A2A] text-white hover:bg-opacity-90 text-sm p-0 flex items-center justify-center"
                  />
                </>
              )}
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3 mt-2 text-xs text-[#040A2A]">
            <button className="hover:underline" onClick={() => eliminarLinea(linea.id)}>
              Eliminar
            </button>
            <span>|</span>
            <button
              className="hover:underline"
              onClick={() => cambiarEstadoGuardado(linea.id)}
              disabled={!linea.producto}
            >
              {esGuardado ? 'Mover al carrito' : 'Guardar para más tarde'}
            </button>
          </div>
        </div>
      </div>

      <div className="text-right sm:w-32 text-xl font-bold text-[#040A2A]">
        {linea.producto ? (linea.producto.precio * linea.cantidad).toFixed(2) + ' €' : '-'}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <main className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md space-y-12">
        {/* MODAL DE CHECKOUT */}
        {mostrarModal && (
          <Checkout total={calcularSubtotal()} cerrar={() => setMostrarModal(false)} />
        )}

        {/* CARRITO */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#040A2A]">Carrito</h1>

            <Boton
              texto="Mis pedidos"
              href={route('pedidos.index')}
              color="primary"
              tamaño="md"
            />
          </div>

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

              <div className="border-t border-gray-300 mt-8 pt-4 flex justify-end">
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-lg font-semibold text-[#040A2A]">
                    Subtotal ({lineasCarrito.length} producto{lineasCarrito.length > 1 && 's'}): {calcularSubtotal()} €
                  </div>

                  <Boton
                    texto="Finalizar compra"
                    onClick={() => finalizarCompra()}
                    tamaño="md"
                    className="bg-green-600 text-white hover:bg-green-700 transition"
                  />
                </div>
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

        {mostrarErrorDireccion && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
              <svg
                className="w-10 h-10 mb-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <p className="text-center">{mensajeErrorDireccion}</p>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
