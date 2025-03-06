import { useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";

export default function Create({ categorias = [], marcas = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: "",
        subcategoria_id: "",
        marca_id: "",
        nueva_marca: "",
        imagen: null,
        tallas: [],
    });

    const [preview, setPreview] = useState(null);
    const [subcategorias, setSubcategorias] = useState([]);

    useEffect(() => {
        if (data.categoria_id) {
            const categoriaSeleccionada = categorias.find(
                (cat) => cat.id == data.categoria_id
            );
            setSubcategorias(
                categoriaSeleccionada ? categoriaSeleccionada.subcategorias : []
            );
        }
    }, [data.categoria_id, categorias]);

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

    const addTalla = () => {
        setData("tallas", [...data.tallas, { nombre: "", stock: 0 }]);
    };

    const updateTalla = (index, field, value) => {
        const newTallas = [...data.tallas];
        newTallas[index][field] = value;
        setData("tallas", newTallas);
    };

    const removeTalla = (index) => {
        const newTallas = [...data.tallas];
        newTallas.splice(index, 1);
        setData("tallas", newTallas);
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
                            value={data.nombre}
                            onChange={(e) =>
                                setData("nombre", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg"
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
                            className="w-full p-3 border rounded-lg"
                        />
                        {errors.descripcion && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    {/* Precio */}
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
                            className="w-full p-3 border rounded-lg"
                        />
                        {errors.precio && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.precio}
                            </p>
                        )}
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
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="">
                                Selecciona una categoría
                            </option>
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

                    {/* Subcategoría */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Subcategoría
                        </label>
                        <select
                            value={data.subcategoria_id}
                            onChange={(e) =>
                                setData("subcategoria_id", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg"
                            disabled={!subcategorias.length}
                        >
                            <option value="">
                                Selecciona una subcategoría
                            </option>
                            {subcategorias.map((subcat) => (
                                <option key={subcat.id} value={subcat.id}>
                                    {subcat.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.subcategoria_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subcategoria_id}
                            </p>
                        )}
                    </div>

                    {/* Marca */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Marca
                        </label>
                        <select
                            value={data.marca_id || ""}
                            onChange={(e) =>
                                setData("marca_id", e.target.value || null)
                            }
                            className="w-full p-3 border rounded-lg"
                        >
                            <option value="">
                                Selecciona una marca
                            </option>
                            {marcas.length > 0 ? (
                                marcas.map((marca) => (
                                    <option key={marca.id} value={marca.id}>
                                        {marca.nombre}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Cargando marcas...</option>
                            )}
                        </select>
                        {errors.marca_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.marca_id}
                            </p>
                        )}
                    </div>

                    {/* Nueva Marca */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Nueva Marca (opcional)
                        </label>
                        <input
                            type="text"
                            value={data.nueva_marca}
                            onChange={(e) =>
                                setData("nueva_marca", e.target.value)
                            }
                            className="w-full p-3 border rounded-lg"
                        />
                        {errors.nueva_marca && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.nueva_marca}
                            </p>
                        )}
                    </div>

                    {/* Tallas */}
                    <div>
                        <label className="block text-gray-700 font-semibold">
                            Tallas y Stock
                        </label>
                        {data.tallas.map((talla, index) => (
                            <div
                                key={index}
                                className="flex gap-2 items-center mb-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Talla"
                                    value={talla.nombre}
                                    onChange={(e) =>
                                        updateTalla(
                                            index,
                                            "nombre",
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded w-1/2"
                                />
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={talla.stock}
                                    onChange={(e) =>
                                        updateTalla(
                                            index,
                                            "stock",
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded w-1/2"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTalla(index)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                        {errors.tallas &&
                            typeof errors.tallas === "string" && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.tallas}
                                </p>
                            )}
                        <button
                            type="button"
                            onClick={addTalla}
                            className="mt-2 bg-green-500 text-white p-2 rounded"
                        >
                            + Agregar Talla
                        </button>
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
                        {errors.imagen && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.imagen}
                            </p>
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
