// components/TarjetaProducto.jsx
import { Link } from "@inertiajs/react";

export default function TarjetaProducto({ producto }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex">
        {producto.imagen_url && (
          <div className="md:w-1/3">
            <img
              src={`/storage/${producto.imagen_url}`}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {producto.nombre}
          </h1>
          <p className="text-gray-700 mb-4">{producto.descripcion}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-semibold text-gray-800">Precio:</span>{" "}
              <span className="text-green-600">€{producto.precio}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Stock Total:</span>{" "}
              <span>{producto.stock_total}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Marca:</span>{" "}
              <span>{producto.marca?.nombre || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Categoría:</span>{" "}
              <span>
                {producto.subcategoria?.categoria?.nombre || "N/A"}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Subcategoría:</span>{" "}
              <span>{producto.subcategoria?.nombre || "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link
              href={`/productos/${producto.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
            >
              Editar
            </Link>
            <Link
              href="/productos"
              className="px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 transition"
            >
              Volver a la lista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
