import { Link } from "@inertiajs/react";
import Boton from "@/Components/Boton";


export default function TarjetaProducto({ producto }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="md:flex">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <div className="md:w-1/3">
            <img
              src={`/storage/${producto.imagenes[0].ruta}`}
              alt={producto.nombre}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="md:w-1/3 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">Sin imagen</span>
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
              <span className="text-green-600">{producto.precio}€</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Stock Total:</span>{" "}
              <span>{producto.stock_total} unidades</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Marca:</span>{" "}
              <span>{producto.marca?.nombre || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Categoría:</span>{" "}
              <span>{producto.subcategoria?.categoria?.nombre || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-800">Subcategoría:</span>{" "}
              <span>{producto.subcategoria?.nombre || "N/A"}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Boton
            texto="Editar"
            href={`/productos/${producto.id}/edit`}
            color="blue"
            tamaño="md"
          />

          <Boton
            texto="Volver a la lista"
            href="/productos"
            color="gray"
            tamaño="md"
          />
          </div>
        </div>
      </div>
    </div>
  );
}
