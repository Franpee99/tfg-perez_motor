import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import FormularioTallas from "@/Components/FormularioTallas";
import FormularioFichaTecnica from "@/Components/FormularioFichaTecnica";
import Boton from "@/Components/Boton";
import { usePage } from "@inertiajs/react";


export default function FormularioEditarProducto({ producto, categorias = [], marcas = [] }) {
  const {
    data: datos,
    setData: setDatos,
    processing: procesando,
    errors: errores,
    put,
  } = useForm({
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    categoria_id: producto.subcategoria?.categoria?.id || "",
    subcategoria_id: producto.subcategoria?.id || "",
    marca_id: producto.marca_id || "",
    nueva_marca: "",
    imagenes: [], // Nuevas imágenes que se agreguen
    tallas: producto.tallas?.map(t => ({ nombre: t.nombre, stock: t.pivot.stock })) || [],
    caracteristicas: producto.caracteristicas?.map(f => ({ caracteristica: f.caracteristica, definicion: f.pivot.definicion })) || [],
  });

  const [vistasPrevias, setVistasPrevias] = useState([]);
  const [imagenesExistentes] = useState(producto.imagenes || []);
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    if (datos.categoria_id) {
      const categoriaSeleccionada = categorias.find(cat => cat.id == datos.categoria_id);
      setSubcategorias(categoriaSeleccionada ? categoriaSeleccionada.subcategorias : []);
    }
  }, [datos.categoria_id, categorias]);

  // Manejar la carga de nuevas imágenes (sin exceder 3 en total: nuevas + existentes)
  const manejarCambioImagenes = (e) => {
    const nuevasSeleccionadas = Array.from(e.target.files);
    const totalActual = datos.imagenes.length + imagenesExistentes.length;
    const permitidas = Math.max(3 - totalActual, 0);
    if (permitidas === 0) {
      alert("No puedes agregar más imágenes. El máximo es 3 en total.");
      return;
    }
    const archivosNuevos = nuevasSeleccionadas.slice(0, permitidas);
    setDatos("imagenes", [...datos.imagenes, ...archivosNuevos]);
    setVistasPrevias(prev => [...prev, ...archivosNuevos.map(file => URL.createObjectURL(file))]);
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

  // Manejar envío del formulario
  const manejarEnvio = (e) => {
    e.preventDefault();

    const formData = new FormData(); //FormData necesario para subir archivoss
    formData.append("nombre", datos.nombre);
    formData.append("descripcion", datos.descripcion);
    formData.append("precio", datos.precio);
    formData.append("categoria_id", datos.categoria_id);
    formData.append("subcategoria_id", datos.subcategoria_id);
    formData.append("marca_id", datos.marca_id || "");
    formData.append("nueva_marca", datos.nueva_marca || "");

    datos.tallas.forEach((talla, indice) => {
      formData.append(`tallas[${indice}][nombre]`, talla.nombre);
      formData.append(`tallas[${indice}][stock]`, talla.stock);
    });

    datos.caracteristicas.forEach((caracteristica, indice) => {
      formData.append(`caracteristicas[${indice}][caracteristica]`, caracteristica.caracteristica);
      formData.append(`caracteristicas[${indice}][definicion]`, caracteristica.definicion);
    });

    if (datos.imagenes.length > 0) {
      datos.imagenes.forEach(archivo => {
        formData.append("imagenes[]", archivo);
      });
    }


    put(`/productos/${producto.id}`, formData, {
      forceFormData: true, // Enviar las imagenes como multipart/form-data para laravel
      preserveScroll: true, // Para que pueda rederigirme hacia otra pagina
    });
  };

  const { flash } = usePage().props;

  return (
    <>
      {flash?.success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg shadow mb-4 text-center">
          {flash.success}
        </div>
      )}

    <form onSubmit={manejarEnvio} encType="multipart/form-data" className="space-y-6">
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
        {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
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
        {errores.descripcion && <p className="text-red-500 text-sm mt-1">{errores.descripcion}</p>}
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
        {errores.precio && <p className="text-red-500 text-sm mt-1">{errores.precio}</p>}
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
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        {errores.categoria_id && <p className="text-red-500 text-sm mt-1">{errores.categoria_id}</p>}
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
          {subcategorias.map(subcat => (
            <option key={subcat.id} value={subcat.id}>{subcat.nombre}</option>
          ))}
        </select>
        {errores.subcategoria_id && <p className="text-red-500 text-sm mt-1">{errores.subcategoria_id}</p>}
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
            marcas.map(marca => (
              <option key={marca.id} value={marca.id}>{marca.nombre}</option>
            ))
          ) : (
            <option disabled>Cargando marcas...</option>
          )}
        </select>
        {errores.marca_id && <p className="text-red-500 text-sm mt-1">{errores.marca_id}</p>}
      </div>
      {/* Nueva Marca */}
      <div>
        <label className="block text-gray-700 font-semibold">Nueva Marca (opcional)</label>
        <input
          type="text"
          name="nueva_marca"
          value={datos.nueva_marca}
          onChange={(e) => setDatos("nueva_marca", e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        {errores.nueva_marca && <p className="text-red-500 text-sm mt-1">{errores.nueva_marca}</p>}
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

      {/* Sección de imágenes */}
      <div>
        <label className="block text-gray-700 font-semibold">Imágenes del Producto (Máx 3)</label>
        {/* Imágenes actuales */}
        <div className="mt-2">
          <p className="font-semibold">Imágenes Actuales</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {imagenesExistentes && imagenesExistentes.length > 0 ? (
              imagenesExistentes.map((img, indice) => (
                <div key={indice} className="relative">
                  <img
                    src={`/storage/${img.ruta}`}
                    alt={`Imagen ${indice}`}
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
              ))
            ) : (
              <p className="text-gray-500">No hay imágenes actuales</p>
            )}
          </div>
        </div>
        {/* Nuevas imágenes */}
        <div className="mt-4">
          <p className="font-semibold">Agregar Imágenes Nuevas</p>
          <input
            type="file"
            name="imagenes"
            accept="image/*"
            multiple
            onChange={manejarCambioImagenes}
            className="w-full p-2 border rounded-lg mt-2"
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
          {errores.imagenes && <p className="text-red-500 text-sm mt-1">{errores.imagenes}</p>}
        </div>
      </div>

      {/* Botón de Guardar */}
      <div className="text-center">
        <Boton
          texto="Actualizar Producto"
          tipo="submit"
          color="blue"
          tamaño="lg"
          enProceso={procesando}
          cargandoTexto="Guardando..."
        />
      </div>
    </form>
  </>
  );
}
