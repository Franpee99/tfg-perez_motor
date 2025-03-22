import AppLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm } from "@inertiajs/react";
import Boton from "@/Components/Boton";

export default function Index({ productos, categorias }) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = (id) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      destroy(`/productos/${id}`);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Lista de Productos
        </h1>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px] bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left border-b">Imagen</th>
                <th className="py-2 px-3 text-left border-b">Nombre</th>
                <th className="py-2 px-3 text-left border-b">Precio</th>
                <th className="py-2 px-3 text-left border-b">Stock</th>
                <th className="py-2 px-3 text-left border-b">Categoría</th>
                <th className="py-2 px-3 text-left border-b">Subcategoría</th>
                <th className="py-2 px-3 text-left border-b">Marca</th>
                <th className="py-2 px-3 text-center border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.data.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border-b">
                    {producto.imagenes && producto.imagenes.length > 0 ? (
                      <img
                        src={`/storage/${producto.imagenes[0]}`}
                        alt={producto.nombre}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-b">
                    <Link
                      href={`/productos/${producto.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {producto.nombre}
                    </Link>
                  </td>
                  <td className="py-2 px-3 border-b">{producto.precio}€</td>
                  <td className="py-2 px-3 border-b">{producto.stock_total}</td>
                  <td className="py-2 px-3 border-b">
                    {producto.subcategoria?.categoria?.nombre || "N/A"}
                  </td>
                  <td className="py-2 px-3 border-b">
                    {producto.subcategoria?.nombre || "N/A"}
                  </td>
                  <td className="py-2 px-3 border-b">
                    {producto.marca?.nombre || "N/A"}
                  </td>
                  <td className="py-2 px-3 border-b text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Boton
                        texto="Editar"
                        href={`/productos/${producto.id}/edit`}
                        color="blue"
                        tamaño="sm"
                      />
                      <Boton
                        texto="Eliminar"
                        onClick={() => handleDelete(producto.id)}
                        color="red"
                        tamaño="sm"
                        disabled={processing}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="mt-6 flex justify-center flex-wrap gap-2">
          {productos.links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              onClick={() => link.url && window.location.assign(link.url)}
              className={`px-3 py-1 text-sm border rounded ${
                link.active
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
