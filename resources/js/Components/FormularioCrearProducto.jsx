import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import FormularioTallas from "./FormularioTallas";
import FormularioFichaTecnica from "./FormularioFichaTecnica";
import Boton from "@/Components/Boton";


export default function FormularioCrearProducto({ categorias = [], marcas = [] }) {
  const {
    data: datos,
    setData: setDatos,
    post,
    processing: procesando,
    errors: errores,
  } = useForm({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    subcategoria_id: "",
    marca_id: "",
    nueva_marca: "",
    imagenes: [],
    tallas: [],
    caracteristicas: [],
  });

  const [vistasPrevias, setVistasPrevias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    if (datos.categoria_id) {
      const categoriaSeleccionada = categorias.find(
        (cat) => cat.id == datos.categoria_id
      );
      setSubcategorias(
        categoriaSeleccionada ? categoriaSeleccionada.subcategorias : []
      );
    }
  }, [datos.categoria_id, categorias]);

  // Acumula nuevas imágenes sin exceder 3 archivos
  const manejarCambioImagenes = (e) => {
    const nuevosArchivos = Array.from(e.target.files).slice(0, 3);
    const archivosCombinados = [...datos.imagenes, ...nuevosArchivos].slice(0, 3);
    setDatos("imagenes", archivosCombinados);
    setVistasPrevias(archivosCombinados.map((archivo) => URL.createObjectURL(archivo)));
  };

  // Métodos para tallas
  const agregarTalla = () => {
    setDatos("tallas", [...datos.tallas, { talla: "", stock: 0 }]);
  };

  const actualizarTalla = (indice, talla, stock) => {
    const nuevasTallas = [...datos.tallas];
    nuevasTallas[indice][talla] = stock;
    setDatos("tallas", nuevasTallas);
  };

  const eliminarTalla = (indice) => {
    const nuevasTallas = [...datos.tallas];
    nuevasTallas.splice(indice, 1);
    setDatos("tallas", nuevasTallas);
  };

  // Métodos para ficha técnica
  const agregarCaracteristica = () => {
    setDatos("caracteristicas", [...datos.caracteristicas, { caracteristica: "", definicion: "" }]);
  };

  const actualizarCaracteristica = (indice, caracteristica, definicion) => {
    const nuevasFicha = [...datos.caracteristicas];
    nuevasFicha[indice][caracteristica] = definicion;
    setDatos("caracteristicas", nuevasFicha);
  };

  const eliminarCaracteristica = (indice) => {
    const nuevasFicha = [...datos.caracteristicas];
    nuevasFicha.splice(indice, 1);
    setDatos("caracteristicas", nuevasFicha);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    post("/productos");
  };

  return (
    <form onSubmit={manejarEnvio} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-gray-700 font-semibold">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={datos.nombre}
          onChange={(e) => setDatos("nombre", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errores.nombre && (
          <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
        )}
      </div>
      {/* Descripción */}
      <div>
        <label className="block text-gray-700 font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={datos.descripcion}
          onChange={(e) => setDatos("descripcion", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errores.descripcion && (
          <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>
        )}
      </div>
      {/* Precio */}
      <div>
        <label className="block text-gray-700 font-semibold">Precio (€)</label>
        <input
          type="number"
          name="precio"
          value={datos.precio}
          onChange={(e) => setDatos("precio", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errores.precio && (
          <p className="text-red-500 text-sm mt-1">{errores.precio}</p>
        )}
      </div>
      {/* Categoría */}
      <div>
        <label className="block text-gray-700 font-semibold">Categoría</label>
        <select
          name="categoria_id"
          value={datos.categoria_id}
          onChange={(e) => setDatos("categoria_id", e.target.value)}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option caracteristica={cat.id}definicion value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
        {errores.categoria_id && (
          <p className="text-red-500 text-sm mt-1">{errores.categoria_id}</p>
        )}
      </div>
      {/* Subcategoría */}
      <div>
        <label className="block text-gray-700 font-semibold">Subcategoría</label>
        <select
          name="subcategoria_id"
          value={datos.subcategoria_id}
          onChange={(e) => setDatos("subcategoria_id", e.target.value)}
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
        {errores.subcategoria_id && (
          <p className="text-red-500 text-sm mt-1">{errores.subcategoria_id}</p>
        )}
      </div>
      {/* Marca */}
      <div>
        <label className="block text-gray-700 font-semibold">Marca</label>
        <select
          name="marca_id"
          value={datos.marca_id || ""}
          onChange={(e) => setDatos("marca_id", e.target.value || null)}
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
        {errores.marca_id && (
          <p className="text-red-500 text-sm mt-1">{errores.marca_id}</p>
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
          value={datos.nueva_marca}
          onChange={(e) => setDatos("nueva_marca", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errores.nueva_marca && (
          <p className="text-red-500 text-sm mt-1">{errores.nueva_marca}</p>
        )}
      </div>
      {/* Sección de tallas */}
      <FormularioTallas
        listaTallas={datos.tallas}
        agregarTalla={agregarTalla}
        actualizarTalla={actualizarTalla}
        eliminarTalla={eliminarTalla}
        errorTallas={errores.tallas}
      />

      {/* Sección de ficha técnica */}
      <FormularioFichaTecnica
        listaFichaTecnica={datos.caracteristicas}
        agregarCaracteristica={agregarCaracteristica}
        actualizarCaracteristica={actualizarCaracteristica}
        eliminarCaracteristica={eliminarCaracteristica}
        errorFichaTecnica={errores.caracteristicas}
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
          onChange={manejarCambioImagenes}
          className="w-full p-2 border rounded-lg"
        />
        {vistasPrevias.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {vistasPrevias.map((vista, indice) => (
              <div key={indice} className="relative">
                <img
                  src={vista}
                  alt={`Vista previa ${indice}`}
                  className="w-24 h-24 object-cover rounded-lg shadow"
                />
                <Boton
                  texto="X"
                  onClick={() => {/* Falta implementar funcion de eliminar imagen */}}
                  color="red"
                  tamaño="sm"
                  titulo="Eliminar imagen"
                  absolute={true}
                  posicion="top-1 right-1"
                />
              </div>
            ))}
          </div>
        )}
        {errores.imagenes && (
          <p className="text-red-500 text-sm mt-1">{errores.imagenes}</p>
        )}
      </div>
      {/* Botón de Guardar */}
      <div className="text-center">
        <Boton
          texto="Guardar Producto"
          tipo="submit"
          color="blue"
          tamaño="lg"
          enProceso={procesando}
          cargandoTexto="Guardando..."
        />
      </div>
    </form>
  );
}
