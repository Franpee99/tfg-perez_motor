import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import FormularioTallas from "./FormularioTallas";
import FormularioFichaTecnica from "./FormularioFichaTecnica";
import Boton from "@/Components/Boton";
import ErrorMsg from "@/Components/ErrorMsg";

export default function FormularioCrearProducto({ categorias = [], marcas = [] }) {
  const {
    data: datos,
    setData: setDatos,
    processing: procesando,
    errors: erroresBackend,
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
  const [errores, setErrores] = useState({});

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

  useEffect(() => {
    setErrores(erroresBackend);
  }, [erroresBackend]);

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
    setDatos("tallas", [...datos.tallas, { nombre: "", stock: 0 }]);
  };

  const actualizarTalla = (indice, campo, valor) => {
    const nuevasTallas = [...datos.tallas];
    nuevasTallas[indice][campo] = valor;
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

  const actualizarCaracteristica = (indice, campo, valor) => {
    const nuevasFicha = [...datos.caracteristicas];
    nuevasFicha[indice][campo] = valor;
    setDatos("caracteristicas", nuevasFicha);
  };

  const eliminarCaracteristica = (indice) => {
    const nuevasFicha = [...datos.caracteristicas];
    nuevasFicha.splice(indice, 1);
    setDatos("caracteristicas", nuevasFicha);
  };

  // Validaciones frontend
  const validar = () => {
    const nuevosErrores = {};

    if (!datos.nombre || !datos.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (datos.nombre.length > 255) {
      nuevosErrores.nombre = "El nombre no puede superar 255 caracteres.";
    }

    if (!datos.precio || isNaN(Number(datos.precio))) {
      nuevosErrores.precio = "El precio es obligatorio y debe ser un número.";
    } else if (Number(datos.precio) < 0) {
      nuevosErrores.precio = "El precio no puede ser negativo.";
    }

    if (!datos.subcategoria_id) {
      nuevosErrores.subcategoria_id = "La subcategoría es obligatoria.";
    }


    if (datos.nueva_marca && datos.nueva_marca.length > 255) {
      nuevosErrores.nueva_marca = "La nueva marca no puede superar 255 caracteres.";
    }

    if (datos.imagenes && datos.imagenes.length > 3) {
      nuevosErrores.imagenes = "Solo se permiten hasta 3 imágenes.";
    }
    if (datos.imagenes) {
      datos.imagenes.forEach((img, idx) => {
        if (img.size > 2 * 1024 * 1024) {
          nuevosErrores.imagenes = "Las imágenes no pueden superar 2MB.";
        }
        if (!["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"].includes(img.type)) {
          nuevosErrores.imagenes = "Formato de imagen no permitido.";
        }
      });
    }

    // tallas: required|array|min:1
    if (!datos.tallas || datos.tallas.length < 1) {
      nuevosErrores.tallas = "Debes añadir al menos una talla.";
    } else {
      datos.tallas.forEach((talla, idx) => {
        if (!talla.nombre || talla.nombre.trim() === "") {
          nuevosErrores[`tallas.${idx}.nombre`] = "La talla es obligatoria.";
        } else if (talla.nombre.length > 50) {
          nuevosErrores[`tallas.${idx}.nombre`] = "La talla no puede superar 50 caracteres.";
        }
        if (
          talla.stock === "" ||
          talla.stock === null ||
          talla.stock === undefined

        ) {
          nuevosErrores[`tallas.${idx}.stock`] = "El stock es obligatorio.";
        } else if (Number(talla.stock) < 0) {
          nuevosErrores[`tallas.${idx}.stock`] = "El stock no puede ser negativo.";
        }
      });
    }

    if (datos.caracteristicas && datos.caracteristicas.length) {
      datos.caracteristicas.forEach((c, idx) => {
        if (c.caracteristica && c.caracteristica.length > 255) {
          nuevosErrores[`caracteristicas.${idx}.caracteristica`] = "Máx. 255 caracteres.";
        }
        if (c.definicion && c.definicion.length > 255) {
          nuevosErrores[`caracteristicas.${idx}.definicion`] = "Máx. 255 caracteres.";
        }
      });
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

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
        clearErrors();
        setErrores(erroresDelServidor);
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
          {errores.nombre && <ErrorMsg>{errores.nombre}</ErrorMsg>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-white font-bold mb-1">Descripción</label>
          <textarea name="descripcion" value={datos.descripcion} onChange={(e) => setDatos("descripcion", e.target.value)} className={claseInput(errores.descripcion)} />
          {errores.descripcion && <ErrorMsg>{errores.descripcion}</ErrorMsg>}
        </div>

        {/* Precio */}
        <div>
          <label className="block text-white font-bold mb-1">Precio (€)*</label>
          <input type="number" name="precio" value={datos.precio} onChange={(e) => setDatos("precio", e.target.value)} className={claseInput(errores.precio)} />
          {errores.precio && <ErrorMsg>{errores.precio}</ErrorMsg>}
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
          {errores.categoria_id && <ErrorMsg>{errores.categoria_id}</ErrorMsg>}
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
          {errores.subcategoria_id && <ErrorMsg>{errores.subcategoria_id}</ErrorMsg>}
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
          {errores.marca_id && <ErrorMsg>{errores.marca_id}</ErrorMsg>}
        </div>

        {/* Nueva Marca */}
        <div>
          <label className="block text-white font-bold mb-1">Nueva Marca (opcional)</label>
          <input type="text" name="nueva_marca" value={datos.nueva_marca} onChange={(e) => setDatos("nueva_marca", e.target.value)} className={claseInput(errores.nueva_marca)} />
          {errores.nueva_marca && <ErrorMsg>{errores.nueva_marca}</ErrorMsg>}
        </div>

        {/* Sección de tallas */}
        <FormularioTallas
          listaTallas={datos.tallas}
          agregarTalla={agregarTalla}
          actualizarTalla={actualizarTalla}
          eliminarTalla={eliminarTalla}
          errorTallas={errores.tallas}
          errores={errores}
        />

        {/* Sección de ficha técnica */}
        <FormularioFichaTecnica
          listaFichaTecnica={datos.caracteristicas}
          agregarCaracteristica={agregarCaracteristica}
          actualizarCaracteristica={actualizarCaracteristica}
          eliminarCaracteristica={eliminarCaracteristica}
          errorFichaTecnica={errores.caracteristicas}
          errores={errores}
        />

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
          {errores.imagenes && <ErrorMsg>{errores.imagenes}</ErrorMsg>}
        </div>

        {/* Botón de Guardar */}
        <div className="text-center">
          <Boton texto="Guardar Producto" tipo="submit" color="green" tamaño="lg" enProceso={procesando} cargandoTexto="Guardando..." />
        </div>
      </form>
    </>
  );
}
