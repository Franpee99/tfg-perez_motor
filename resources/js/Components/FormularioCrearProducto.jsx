import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import FormularioTallas from "./FormularioTallas";
import FormularioFichaTecnica from "./FormularioFichaTecnica";
import Boton from "@/Components/Boton";

export default function FormularioCrearProducto({ categorias = [], marcas = [] }) {
  const {
    data: datos,
    setData: setDatos,
    processing: procesando,
    errors: errores,
    setError,
    clearErrors,
    post,
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

  const manejarCambioImagenes = (e) => {
    const nuevosArchivos = Array.from(e.target.files).slice(0, 3);
    const archivosCombinados = [...datos.imagenes, ...nuevosArchivos].slice(0, 3);
    setDatos("imagenes", archivosCombinados);
    setVistasPrevias(archivosCombinados.map((archivo) => URL.createObjectURL(archivo)));
  };

  const eliminarImagenNueva = (indice) => {
    const imagenesActualizadas = [...datos.imagenes];
    imagenesActualizadas.splice(indice, 1);
    setDatos("imagenes", imagenesActualizadas);

    const vistasActualizadas = [...vistasPrevias];
    vistasActualizadas.splice(indice, 1);
    setVistasPrevias(vistasActualizadas);
  };

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

    const formData = new FormData();
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
      datos.imagenes.forEach((archivo) => {
        formData.append("imagenes[]", archivo);
      });
    }

    post("/productos", {
      data: formData,
      forceFormData: true,
      preserveScroll: true,
      onError: (erroresDelServidor) => {
        console.log("Errores de validación:", erroresDelServidor);
        clearErrors();
        Object.entries(erroresDelServidor).forEach(([campo, mensaje]) => {
          setError(campo, mensaje);
        });
      },
    });
  };

  const { flash } = usePage().props;

  const claseInput = (error) => `w-full p-3 border rounded-lg focus:outline-none ${error ? 'border-red-500' : 'border-gray-300 focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]'}`;

  return (
    <>
      {flash?.success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-lg shadow mb-4 text-center">
          {flash.success}
        </div>
      )}

      <form onSubmit={manejarEnvio} encType="multipart/form-data" className="space-y-6 bg-[#040A2A] pl-8 pr-8 pb-8 rounded-xl shadow-2xl">
        {/* Nombre */}
        <div>
          <label className="block text-white font-bold mb-1">Nombre*</label>
          <input type="text" name="nombre" value={datos.nombre} onChange={(e) => setDatos("nombre", e.target.value)} className={claseInput(errores.nombre)} />
          {errores.nombre && <p className="text-red-400 text-xs mt-1">{errores.nombre}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-white font-bold mb-1">Descripción</label>
          <textarea name="descripcion" value={datos.descripcion} onChange={(e) => setDatos("descripcion", e.target.value)} className={claseInput(errores.descripcion)} />
          {errores.descripcion && <p className="text-red-400 text-xs mt-1">{errores.descripcion}</p>}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-white font-bold mb-1">Precio (€)*</label>
          <input type="number" name="precio" value={datos.precio} onChange={(e) => setDatos("precio", e.target.value)} className={claseInput(errores.precio)} />
          {errores.precio && <p className="text-red-400 text-xs mt-1">{errores.precio}</p>}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-white font-bold mb-1">Categoría*</label>
          <select name="categoria_id" value={datos.categoria_id} onChange={(e) => setDatos("categoria_id", e.target.value)} className={claseInput(errores.categoria_id)}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          {errores.categoria_id && <p className="text-red-400 text-xs mt-1">{errores.categoria_id}</p>}
        </div>

        {/* Subcategoría */}
        <div>
          <label className="block text-white font-bold mb-1">Subcategoría*</label>
          <select name="subcategoria_id" value={datos.subcategoria_id} onChange={(e) => setDatos("subcategoria_id", e.target.value)} disabled={!subcategorias.length} className={claseInput(errores.subcategoria_id)}>
            <option value="">Selecciona una subcategoría</option>
            {subcategorias.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>{subcat.nombre}</option>
            ))}
          </select>
          {errores.subcategoria_id && <p className="text-red-400 text-xs mt-1">{errores.subcategoria_id}</p>}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-white font-bold mb-1">Marca*</label>
          <select name="marca_id" value={datos.marca_id} onChange={(e) => setDatos("marca_id", e.target.value)} className={claseInput(errores.marca_id)}>
            <option value="">Selecciona una marca</option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>{marca.nombre}</option>
            ))}
          </select>
          {errores.marca_id && <p className="text-red-400 text-xs mt-1">{errores.marca_id}</p>}
        </div>

        {/* Nueva Marca */}
        <div>
          <label className="block text-white font-bold mb-1">Nueva Marca (opcional)</label>
          <input type="text" name="nueva_marca" value={datos.nueva_marca} onChange={(e) => setDatos("nueva_marca", e.target.value)} className={claseInput(errores.nueva_marca)} />
          {errores.nueva_marca && <p className="text-red-400 text-xs mt-1">{errores.nueva_marca}</p>}
        </div>

        {/* Sección de tallas */}
        <FormularioTallas listaTallas={datos.tallas} agregarTalla={agregarTalla} actualizarTalla={actualizarTalla} eliminarTalla={eliminarTalla} errorTallas={errores.tallas} />

        {/* Sección de ficha técnica */}
        <FormularioFichaTecnica listaFichaTecnica={datos.caracteristicas} agregarCaracteristica={agregarCaracteristica} actualizarCaracteristica={actualizarCaracteristica} eliminarCaracteristica={eliminarCaracteristica} errorFichaTecnica={errores.caracteristicas} />

        {/* Imágenes */}
        <div>
          <label className="block text-white font-bold mb-1">Imágenes del Producto (Máx 3)</label>
          <input type="file" name="imagenes" accept="image/*" multiple onChange={manejarCambioImagenes} className="w-full p-2 border rounded-lg border-gray-300 focus:border-[#ffffff] focus:ring-2 focus:ring-[#ffffff]" />
          {vistasPrevias.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {vistasPrevias.map((vista, indice) => (
                <div key={indice} className="relative">
                  <img src={vista} alt={`Vista previa ${indice}`} className="w-24 h-24 object-cover rounded-lg shadow" />
                  <Boton texto="X" onClick={() => eliminarImagenNueva(indice)} color="red" tamaño="sm" titulo="Eliminar imagen" absolute={true} posicion="top-1 right-1" />
                </div>
              ))}
            </div>
          )}
          {errores.imagenes && <p className="text-red-400 text-xs mt-1">{errores.imagenes}</p>}
        </div>

        {/* Botón de Guardar */}
        <div className="text-center">
          <Boton texto="Guardar Producto" tipo="submit" color="green" tamaño="lg" enProceso={procesando} cargandoTexto="Guardando..." />
        </div>
      </form>
    </>
  );
}
