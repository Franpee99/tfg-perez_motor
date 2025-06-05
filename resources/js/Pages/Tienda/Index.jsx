import AppLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import ProductoGrid from "@/Components/ProductoGrid";
import Boton from "@/Components/Boton";
import { Range } from "react-range";
import { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

// Para eliminar valores nulos y duplicados
const obtenerUnicos = (lista) => [...new Set(lista.filter(Boolean))];

const SeccionFiltro = ({ titulo, tipo, valores, filtros, cambiarFiltro }) => (
  <div className="border-b pb-3">
    <h3 className="text-red-600 font-bold uppercase mb-2">{titulo}</h3>
    <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pl-1">
      {valores.map(valor => (
        <label key={`${tipo}-${valor}`} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="text-red-600 focus:ring-red-500"
            checked={filtros[tipo]?.includes(valor)}
            onChange={() => cambiarFiltro(tipo, valor)}
          />
          {valor}
        </label>
      ))}
    </div>
  </div>
);

export default function Index({ productosConFiltro, productosTodos, categoriaActual, filtrosActivos }) {
  const listaFiltros = productosTodos || [];

  // Opciones únicas disponibles para cada filtro
  const opciones = {
    subcategorias: obtenerUnicos(listaFiltros.map(p => p.subcategoria?.nombre)),
    tallas: obtenerUnicos(listaFiltros.flatMap(p => p.tallas?.map(t => t.nombre))),
    marcas: obtenerUnicos(listaFiltros.map(p => p.marca?.nombre)),
    caracteristicas: obtenerUnicos(listaFiltros.flatMap(p => p.caracteristicas?.map(c => c.pivot?.definicion))),
  };

  // Rango de precio desde filtros activos o por defecto
  const precioMaximoGlobal = Math.max(...listaFiltros.map(p => p.precio ?? 0), 0);
  const rangoInicial = [
    Number(filtrosActivos.precio_min ?? 0),
    Number(filtrosActivos.precio_max ?? precioMaximoGlobal),
  ];

  const [rangoPrecioLocal, setRangoPrecioLocal] = useState(rangoInicial);

  useEffect(() => {
    setRangoPrecioLocal(rangoInicial);
  }, [filtrosActivos]); // Cada vez que cambie filtroActivos actualizamos el slider

  // Estado para controlar si el panel de filtros móvil está visible
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  const cambiarFiltro = (tipo, valor) => {
    const nuevosFiltros = { ...filtrosActivos };

    if (!nuevosFiltros[tipo]) nuevosFiltros[tipo] = [];

    if (nuevosFiltros[tipo].includes(valor)) {
      nuevosFiltros[tipo] = nuevosFiltros[tipo].filter(v => v !== valor);
    } else {
      nuevosFiltros[tipo].push(valor);
    }

    router.get(route('tienda.index', categoriaActual), nuevosFiltros, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const cambiarRangoPrecio = (nuevoRango) => {
    router.get(route('tienda.index', categoriaActual), {
      ...filtrosActivos,
      precio_min: nuevoRango[0],
      precio_max: nuevoRango[1],
    }, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const limpiarFiltros = () => {
    router.get(route('tienda.index', categoriaActual), {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          {categoriaActual.toUpperCase()}
        </h1>

        {/* BOTÓN FILTRO SOLO EN MÓVIL */}
        <button
          className="fixed z-30 bottom-6 right-6 bg-[#C42424] text-white flex items-center gap-2 px-5 py-3 rounded-full shadow-lg lg:hidden"
          onClick={() => setFiltrosVisibles(true)}
          aria-label="Mostrar filtros"
        >
          <FaFilter className="text-lg" />
          Filtros
        </button>

        {/* PANEL DESPLEGABLE DE FILTROS EN MÓVIL */}
        {filtrosVisibles && (
          <div className="fixed inset-0 z-40 bg-black/40 flex justify-end lg:hidden">
            {/* Drawer de filtros */}
            <div className="bg-white w-11/12 max-w-xs h-full p-6 flex flex-col relative overflow-y-auto">
              {/* Botón cerrar */}
              <button
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl"
                onClick={() => setFiltrosVisibles(false)}
                aria-label="Cerrar filtros"
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold text-[#C42424] mb-6">Filtros</h2>
              <Boton
                texto="Limpiar filtros"
                onClick={() => { limpiarFiltros(); setFiltrosVisibles(false); }}
                color="gray"
                tamaño="md"
                className="mb-4"
              />
              <SeccionFiltro titulo="Marca" tipo="marcas" valores={opciones.marcas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
              <SeccionFiltro titulo="Modelo" tipo="subcategorias" valores={opciones.subcategorias} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
              <SeccionFiltro titulo="Talla" tipo="tallas" valores={opciones.tallas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />

              {/* RANGO PRECIO */}
              {precioMaximoGlobal > 0 && (
                <div className="border-b pb-3">
                  <h3 className="text-red-600 font-bold uppercase mb-2">Precio</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {rangoPrecioLocal[0].toLocaleString("es-ES", { style: "currency", currency: "EUR" })} -{" "}
                    {rangoPrecioLocal[1].toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </p>
                  <Range
                    step={5}
                    min={0}
                    max={precioMaximoGlobal}
                    values={rangoPrecioLocal}
                    onChange={setRangoPrecioLocal}
                    onFinalChange={cambiarRangoPrecio} //me ejecuta un array con dos elementos (nuevoRango)
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "6px",
                          background: "#ccc",
                          borderRadius: "4px",
                        }}
                        className="mb-4"
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props, index }) => (
                      <div
                        {...props}
                        key={`thumb-${index}`}
                        style={{
                          ...props.style,
                          height: "18px",
                          width: "18px",
                          backgroundColor: "#333",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  />
                </div>
              )}
              <SeccionFiltro titulo="Características" tipo="caracteristicas" valores={opciones.caracteristicas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
            </div>
            {/* Haz clic fuera para cerrar */}
            <div className="flex-1" onClick={() => setFiltrosVisibles(false)} />
          </div>
        )}

        {/* DESKTOP: Filtros siempre visibles */}
        <div className="lg:flex gap-8 min-h-[700px]"> {/**/}
          <aside className="hidden lg:block w-1/4 space-y-6 text-sm text-gray-700">
            <div className="pt-2">
              <Boton
                texto="Limpiar filtros"
                onClick={limpiarFiltros}
                color="gray"
                tamaño="md"
              />
            </div>
            <SeccionFiltro titulo="Marca" tipo="marcas" valores={opciones.marcas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
            <SeccionFiltro titulo="Modelo" tipo="subcategorias" valores={opciones.subcategorias} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
            <SeccionFiltro titulo="Talla" tipo="tallas" valores={opciones.tallas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />

            {/* RANGO PRECIO */}
            {precioMaximoGlobal > 0 && (
              <div className="border-b pb-3">
                <h3 className="text-red-600 font-bold uppercase mb-2">Precio</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {rangoPrecioLocal[0].toLocaleString("es-ES", { style: "currency", currency: "EUR" })} -{" "}
                  {rangoPrecioLocal[1].toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </p>
                <Range
                  step={5}
                  min={0}
                  max={precioMaximoGlobal}
                  values={rangoPrecioLocal}
                  onChange={setRangoPrecioLocal}
                  onFinalChange={cambiarRangoPrecio}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        background: "#ccc",
                        borderRadius: "4px",
                      }}
                      className="mb-4"
                    >
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div
                      {...props}
                      key={`thumb-${index}`}
                      style={{
                        ...props.style,
                        height: "18px",
                        width: "18px",
                        backgroundColor: "#333",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                />
              </div>
            )}
            <SeccionFiltro titulo="Características" tipo="caracteristicas" valores={opciones.caracteristicas} filtros={filtrosActivos} cambiarFiltro={cambiarFiltro} />
          </aside>

          {/* TARJETA PRODUCTOS */}
          <section className="flex-1 mt-6 lg:mt-0">
            <ProductoGrid productos={productosConFiltro.data} paginacion={productosConFiltro.links} />
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
