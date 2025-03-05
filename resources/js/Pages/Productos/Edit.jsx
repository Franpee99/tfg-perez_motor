import AppLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { useForm, router } from "@inertiajs/react";


export default function Edit({ producto, categorias }) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria_id: producto.categoria_id,
        imagen: null,
    });

    // Asegurar que la imagen actual del producto se muestra correctamente
    const [preview, setPreview] = useState(
        producto.imagen_url ? `/storage/${producto.imagen_url}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("🚀 handleSubmit se ha ejecutado");

        const formData = new FormData();
        formData.append("nombre", data.nombre);
        formData.append("descripcion", data.descripcion);
        formData.append("precio", data.precio);
        formData.append("stock", data.stock);
        formData.append("categoria_id", data.categoria_id);

        if (data.imagen instanceof File) {
            formData.append("imagen", data.imagen);
        }

        formData.append("_method", "PUT");


        router.post(`/productos/${producto.id}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error("Errores de subida:", errors);
            },
        });
    };





    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("imagen", file);
            setPreview(URL.createObjectURL(file)); // Mostrar la nueva imagen en vista previa
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Editar Producto
                </h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Descripción
                        </label>
                        <textarea
                            value={data.descripcion}
                            onChange={(e) =>
                                setData("descripcion", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                        {errors.descripcion && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Precio y Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Precio (€)
                            </label>
                            <input
                                type="number"
                                value={data.precio}
                                onChange={(e) =>
                                    setData("precio", e.target.value)
                                }
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                            />
                            {errors.precio && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.precio}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) =>
                                    setData("stock", e.target.value)
                                }
                                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                            />
                            {errors.stock && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.stock}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Categoría
                        </label>
                        <select
                            value={data.categoria_id}
                            onChange={(e) =>
                                setData("categoria_id", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.categoria_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.categoria_id}
                            </p>
                        )}
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Imagen del Producto
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border rounded-lg"
                        />

                        {/* Mostrar la imagen actual o la vista previa de la nueva */}
                        {preview ? (
                            <img
                                src={preview}
                                alt="Vista previa"
                                className="mt-3 w-48 h-48 object-cover rounded-lg shadow"
                            />
                        ) : (
                            <span className="text-gray-400">
                                No hay imagen disponible
                            </span>
                        )}
                    </div>

                    {/* Botón de Guardar */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Actualizar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
