import AppLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Index({ productos }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm("¿Seguro que quieres eliminar este producto?")) {
            destroy(`/productos/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Lista de Productos
                </h1>

                {/* Tabla de productos */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left border-b">Imagen</th>
                                <th className="py-3 px-4 text-left border-b">Nombre</th>
                                <th className="py-3 px-4 text-left border-b">Descripción</th>
                                <th className="py-3 px-4 text-left border-b">Precio</th>
                                <th className="py-3 px-4 text-left border-b">Stock</th>
                                <th className="py-3 px-4 text-left border-b">Categoría</th>
                                <th className="py-3 px-4 text-center border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4 border-b">
                                        {producto.imagen_url ? (
                                            <img
                                                src={`/storage/${producto.imagen_url}`}
                                                alt={producto.nombre}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-gray-400">Sin imagen</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 border-b">{producto.nombre}</td>
                                    <td className="py-3 px-4 border-b">{producto.descripcion}</td>
                                    <td className="py-3 px-4 border-b">€{producto.precio}</td>
                                    <td className="py-3 px-4 border-b">{producto.stock}</td>
                                    <td className="py-3 px-4 border-b">{producto.categoria?.nombre || "N/A"}</td>
                                    <td className="py-3 px-4 border-b text-center flex justify-center gap-2">
                                        {/* Botón Editar */}
                                        <Link
                                            href={`/productos/${producto.id}/edit`}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                                        >
                                            Editar
                                        </Link>

                                        {/* Botón Eliminar */}
                                        <button
                                            onClick={() => handleDelete(producto.id)}
                                            disabled={processing}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
