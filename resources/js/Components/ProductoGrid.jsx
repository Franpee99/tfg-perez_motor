import React from 'react';

export default function ProductoGrid({ productos }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {productos.map((producto) => (
                <div
                    key={producto.id}
                    className="relative overflow-hidden rounded-lg border bg-white shadow transition-shadow duration-300 hover:shadow-lg"
                >
                    {/* Imagen del producto */}
                    <div className="relative h-48 w-full bg-gray-100">
                        {producto.imagenes && producto.imagenes.length > 0 ? (
                            <img
                                src={`/storage/${producto.imagenes[0]}`}
                                alt={producto.nombre}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <img
                                src="/images/no-image.jpg"
                                alt="Sin imagen"
                                className="h-full w-full object-contain"
                            />
                        )}
                    </div>

                    {/* Contenido del producto */}
                    <div className="p-4">
                        {/* Nombre */}
                        <h2 className="mb-2 text-sm font-bold uppercase text-red-600 line-clamp-2">
                            {producto.nombre}
                        </h2>

                        {/* Subcategoria */}
                        {producto.subcategoria?.nombre && (
                            <span className="rounded bg-gray-300 px-2 py-1 text-xs font-bold text-gray-800">
                                {producto.subcategoria.nombre.toUpperCase()}
                            </span>
                        )}

                        {/* Marca */}
                        {producto.marca && (
                            <p className="text-xs text-gray-500">
                                {producto.marca.nombre}
                            </p>
                        )}

                        {/* Precio */}
                        <div className="mt-2 flex items-center space-x-2">
                            <p className="text-md font-semibold text-black-600">
                                {producto.precio} €
                            </p>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
}
