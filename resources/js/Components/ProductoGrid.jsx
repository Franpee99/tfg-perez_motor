import React from 'react';
import { router } from '@inertiajs/react';
import Paginacion from '@/Components/Paginacion';

export default function ProductoGrid({ productos, paginacion }) {
  if (productos.length === 0) {
    return <p className="text-center text-gray-500 py-6">No hay productos disponibles.</p>;
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productos.map((producto) => (
          <button
            key={producto.id}
            type="button"
            onClick={() => router.get(route('tienda.show', producto.id))}
            className="text-left w-full cursor-pointer relative overflow-hidden rounded-lg border bg-white shadow transition-shadow duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="relative h-48 w-full bg-gray-100">
              <img
                src={
                  producto.imagenes?.[0]
                    ? `/storage/${producto.imagenes[0].ruta}`
                    : "/images/no-image.jpg"
                }
                alt={producto.nombre}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="p-4">
              <h2 className="mb-2 text-sm font-bold uppercase text-red-600 line-clamp-2">
                {producto.nombre}
              </h2>

              {producto.subcategoria?.nombre && (
                <span className="rounded bg-gray-300 px-2 py-1 text-xs font-bold text-gray-800">
                  {producto.subcategoria.nombre.toUpperCase()}
                </span>
              )}

              {producto.marca?.nombre && (
                <p className="text-xs text-gray-500">{producto.marca.nombre}</p>
              )}

              <p className="mt-2 text-md font-semibold text-black-600">
                {producto.precio} €
              </p>
            </div>
          </button>
        ))}
      </div>

      {paginacion?.length > 1 && (
        <div className="mt-6">
          <Paginacion links={paginacion} />
        </div>
      )}
    </>
  );
}
