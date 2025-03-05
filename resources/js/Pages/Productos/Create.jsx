import { useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

export default function Create({ categorias }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria_id: "",
        imagen: null,
    });

    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/productos");
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("imagen", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Crear Producto
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Nombre
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Casco MT Negro"
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
                            placeholder="Describe el producto..."
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

                    {/* Precio */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Precio (€)
                            </label>
                            <input
                                type="number"
                                placeholder="Ej: 120"
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

                        {/* Stock */}
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Stock
                            </label>
                            <input
                                type="number"
                                placeholder="Ej: 50"
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
                        {preview && (
                            <img
                                src={preview}
                                alt="Vista previa"
                                className="mt-3 w-48 h-48 object-cover rounded-lg shadow"
                            />
                        )}
                    </div>

                    {/* Botón de Guardar */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {processing ? "Guardando..." : "Guardar Producto"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
