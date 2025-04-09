import React from 'react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';
import Boton from '@/Components/Boton';

export default function Index({ lineasCarrito }) {

  const eliminarLinea = (id) => {
    router.delete(route('carrito.destroy', id))
  };

  const vaciarCarrito = () => {
    router.delete(route('carrito.vaciar'))
  };

  return (
    <AppLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

        {lineasCarrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Boton
                texto="Vaciar carrito"
                color="red"
                tamaño="sm"
                onClick={vaciarCarrito}
              />
            </div>

            <div className="space-y-4">
              {lineasCarrito.map((linea) => (
                <div
                  key={linea.id}
                  className="bg-white border shadow-sm rounded p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden border">
                      <img
                        src={`/storage/${linea.producto.imagenes?.[0]?.ruta}`}
                        alt={linea.producto.nombre}
                        className="w-full h-full object-contain"
                      />
                    </div>

                      <div>
                        <h2 className="text-lg font-semibold">{linea.producto.nombre}</h2>
                        <p className="text-sm text-gray-600">Talla: {linea.talla.nombre}</p>
                        <p className="text-sm text-gray-600">Cantidad: {linea.cantidad}</p>
                      </div>
                    </div>


                  <Boton
                    texto="Eliminar"
                    color="red"
                    tamaño="sm"
                    onClick={() => eliminarLinea(linea.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </AppLayout>
  );
}
