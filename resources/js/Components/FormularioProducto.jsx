import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import FormularioTallas from "./FormularioTallas";
import FormularioFichaTecnica from "./FormularioFichaTecnica";

export default function FormularioProducto({ categorias = [], marcas = [] }) {
  const { data, setData, post, processing, errors } = useForm({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    subcategoria_id: "",
    marca_id: "",
    nueva_marca: "",
    imagenes: [], // Array para hasta 3 imágenes
    tallas: [],
    ficha_tecnica: [],
  });

  const [previews, setPreviews] = useState([]);
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

  const handleImagesChange = (e) => {
    // Obtener los nuevos archivos seleccionados y limitar a 3
    const newFiles = Array.from(e.target.files).slice(0, 3);
    // Combinar con los que ya se hayan seleccionado (si se permite acumulación)
    const allFiles = [...data.imagenes, ...newFiles].slice(0, 3);
    setData("imagenes", allFiles);
    // Mostrar el nombre de cada archivo (o si prefieres, usar URL.createObjectURL para vista previa)
    setPreviews(allFiles.map((file) => file.name));
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

  // Manejadores para ficha técnica
  const addCaracteristica = () => {
    setData("ficha_tecnica", [
      ...data.ficha_tecnica,
      { key: "", value: "" },
    ]);
  };

  const updateCaracteristica = (index, field, value) => {
    const nuevas = [...data.ficha_tecnica];
    nuevas[index][field] = value;
    setData("ficha_tecnica", nuevas);
  };

  const removeCaracteristica = (index) => {
    const nuevas = [...data.ficha_tecnica];
    nuevas.splice(index, 1);
    setData("ficha_tecnica", nuevas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/productos");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-gray-700 font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={data.nombre}
          onChange={(e) => setData("nombre", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errors.nombre && (
          <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
        )}
      </div>
      {/* Descripción */}
      <div>
        <label className="block text-gray-700 font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={data.descripcion}
          onChange={(e) => setData("descripcion", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errors.descripcion && (
          <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
        )}
      </div>
      {/* Precio */}
      <div>
        <label className="block text-gray-700 font-semibold">Precio (€)</label>
        <input
          type="number"
          name="precio"
          value={data.precio}
          onChange={(e) => setData("precio", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errors.precio && (
          <p className="text-red-500 text-sm mt-1">{errors.precio}</p>
        )}
      </div>
      {/* Categoría */}
      <div>
        <label className="block text-gray-700 font-semibold">Categoría</label>
        <select
          name="categoria_id"
          value={data.categoria_id}
          onChange={(e) => setData("categoria_id", e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errors.categoria_id && (
          <p className="text-red-500 text-sm mt-1">{errors.categoria_id}</p>
        )}
      </div>
      {/* Subcategoría */}
      <div>
        <label className="block text-gray-700 font-semibold">Subcategoría</label>
        <select
          name="subcategoria_id"
          value={data.subcategoria_id}
          onChange={(e) => setData("subcategoria_id", e.target.value)}
          className="w-full p-3 border rounded-lg"
          disabled={!subcategorias.length}
        >
          <option value="">Selecciona una subcategoría</option>
          {subcategorias.map((subcat) => (
            <option key={subcat.id} value={subcat.id}>
              {subcat.nombre}
            </option>
          ))}
        </select>
        {errors.subcategoria_id && (
          <p className="text-red-500 text-sm mt-1">{errors.subcategoria_id}</p>
        )}
      </div>
      {/* Marca */}
      <div>
        <label className="block text-gray-700 font-semibold">Marca</label>
        <select
          name="marca_id"
          value={data.marca_id || ""}
          onChange={(e) => setData("marca_id", e.target.value || null)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Selecciona una marca</option>
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
          <p className="text-red-500 text-sm mt-1">{errors.marca_id}</p>
        )}
      </div>
      {/* Nueva Marca */}
      <div>
        <label className="block text-gray-700 font-semibold">
          Nueva Marca (opcional)
        </label>
        <input
          type="text"
          name="nueva_marca"
          value={data.nueva_marca}
          onChange={(e) => setData("nueva_marca", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errors.nueva_marca && (
          <p className="text-red-500 text-sm mt-1">{errors.nueva_marca}</p>
        )}
      </div>
      {/* Tallas */}
      <FormularioTallas
        tallas={data.tallas}
        addTalla={addTalla}
        updateTalla={updateTalla}
        removeTalla={removeTalla}
        errorTallas={errors.tallas}
      />
      {/* Ficha Técnica */}
      <FormularioFichaTecnica
        fichaTecnica={data.ficha_tecnica}
        addCaracteristica={addCaracteristica}
        updateCaracteristica={updateCaracteristica}
        removeCaracteristica={removeCaracteristica}
        errorFichaTecnica={errors.ficha_tecnica}
      />
      {/* Imágenes */}
      <div>
        <label className="block text-gray-700 font-semibold">
          Imágenes del Producto (Máx 3)
        </label>
        <input
          type="file"
          name="imagenes"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="w-full p-2 border rounded-lg"
        />
        {previews.length > 0 && (
          <div className="mt-2">
            {previews.map((nombre, index) => (
              <p key={index} className="text-sm text-gray-700">
                {nombre}
              </p>
            ))}
          </div>
        )}
        {errors.imagenes && (
          <p className="text-red-500 text-sm mt-1">{errors.imagenes}</p>
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
  );
}
