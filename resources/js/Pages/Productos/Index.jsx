import AppLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import Boton from "@/Components/Boton";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";

export default function Index({ productos }) {
  const { delete: destroy, processing } = useForm();
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const { flash } = usePage().props;
  const [mensaje, setMensaje] = useState(flash.success || null);

  useEffect(() => {
    if (flash.success) {
      setMensaje(flash.success);
      history.replaceState({}, "", location.href);
    }
  }, []);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroPrecioMax, setFiltroPrecioMax] = useState("");
  const [filtroCaracteristicas, setFiltroCaracteristicas] = useState("");
  const [filtroTalla, setFiltroTalla] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroCategoria("");
    setFiltroSubcategoria("");
    setFiltroPrecioMin("");
    setFiltroPrecioMax("");
    setFiltroCaracteristicas("");
    setFiltroTalla("");
    setFiltroMarca("");
  };

  const handleDelete = (id) => {
    setProductoAEliminar(id);
  };

  const columnas = [
    {
      name: "Imagen",
      selector: row => row.imagenes?.[0]?.ruta,
      cell: row =>
        row.imagenes?.[0] ? (
          <img
            src={`/storage/${row.imagenes[0].ruta}`}
            alt={row.nombre}
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400">Sin imagen</span>
        ),
      sortable: false,
    },
    {
      name: "Nombre",
      selector: row => row.nombre,
      sortable: true,
      cell: row => (
        <Link
          href={`/productos/${row.id}`}
          className="text-blue-500 hover:underline"
        >
          {row.nombre}
        </Link>
      ),
    },
    {
      name: "Precio",
      selector: row => Number(row.precio),
      sortable: true,
      cell: row => `${Number(row.precio).toFixed(2)}€`,
    },
    {
      name: "Categoría",
      selector: row => row.subcategoria?.categoria?.nombre || "N/A",
      sortable: true,
    },
    {
      name: "Subcategoría",
      selector: row => row.subcategoria?.nombre || "N/A",
      sortable: true,
    },
    {
      name: "Marca",
      selector: row => row.marca?.nombre || "N/A",
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => (
        <div className="flex flex-col items-center gap-1 min-w-[100px]">
          <Boton
            texto="Editar"
            href={`/productos/${row.id}/edit`}
            color="blue"
            tamaño="sm"
          />
          <Boton
            texto="Eliminar"
            onClick={() => handleDelete(row.id)}
            color="red"
            tamaño="sm"
            disabled={processing}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      style: {
        whiteSpace: "normal",
      },
    }
  ];

  const categorias = [...new Set(productos.map(p => p.subcategoria?.categoria?.nombre).filter(Boolean))];
  const subcategorias = [...new Set(productos.map(p => p.subcategoria?.nombre).filter(Boolean))];
  const marcas = [...new Set(productos.map(p => p.marca?.nombre).filter(Boolean))];
  const tallas = [...new Set(productos.flatMap(p => p.tallas?.map(t => t.nombre)).filter(Boolean))];

  const productosFiltrados = productos.filter(producto => {
    const nombreOk = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const categoriaOk = filtroCategoria === "" || (producto.subcategoria?.categoria?.nombre || "").toLowerCase() === filtroCategoria.toLowerCase();
    const subcategoriaOk = filtroSubcategoria === "" || (producto.subcategoria?.nombre || "").toLowerCase() === filtroSubcategoria.toLowerCase();
    const precioMinOk = filtroPrecioMin === "" || producto.precio >= parseFloat(filtroPrecioMin);
    const precioMaxOk = filtroPrecioMax === "" || producto.precio <= parseFloat(filtroPrecioMax);
    const caracteristicasOk =
      filtroCaracteristicas === "" || producto.caracteristicas?.some(c =>
        (c.pivot?.definicion || "").toLowerCase().includes(filtroCaracteristicas.toLowerCase())
      );
    const tallaOk = filtroTalla === "" || producto.tallas?.some(t => t.nombre.toLowerCase() === filtroTalla.toLowerCase());
    const marcaOk = filtroMarca === "" || (producto.marca?.nombre || "").toLowerCase() === filtroMarca.toLowerCase();

    return nombreOk && categoriaOk && subcategoriaOk && precioMinOk && precioMaxOk && caracteristicasOk && tallaOk && marcaOk;
  });

  const paginacionES = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: 'Todos',
  };

  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(tiempo);
  }, []);

  return (
    <AppLayout>
      <section className="bg-[#040A2A] text-white py-10 px-6 pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10">LISTA DE PRODUCTOS</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? "w-full" : "w-0"
                }`}
              />
            </div>
          </div>

          {mensaje && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
                <svg
                  className="w-10 h-10 mb-2 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {mensaje}
              </div>
            </div>
          )}

          {productoAEliminar && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-[#040A2A] text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
                <svg
                  className="w-10 h-10 mb-2 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <h2 className="text-xl font-bold mb-2 text-center">¿Eliminar producto?</h2>
                <p className="text-sm text-gray-200 text-center mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center gap-4 w-full">
                  <Boton
                    texto="Cancelar"
                    onClick={() => setProductoAEliminar(null)}
                    color="gray"
                    tamaño="sm"
                  />
                  <Boton
                    texto="Eliminar"
                    onClick={() => {
                      destroy(`/productos/${productoAEliminar}`);
                      setProductoAEliminar(null);
                    }}
                    color="red"
                    tamaño="sm"
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 text-sm">
            {[
              ["Nombre", filtroNombre, setFiltroNombre, "text", "Buscar por nombre"],
              ["Categoría", filtroCategoria, setFiltroCategoria, "select", categorias],
              ["Subcategoría", filtroSubcategoria, setFiltroSubcategoria, "select", subcategorias],
              ["Precio mínimo", filtroPrecioMin, setFiltroPrecioMin, "number", "Mínimo"],
              ["Precio máximo", filtroPrecioMax, setFiltroPrecioMax, "number", "Máximo"],
              ["Características", filtroCaracteristicas, setFiltroCaracteristicas, "text", "Buscar característica"],
              ["Talla", filtroTalla, setFiltroTalla, "select", tallas],
              ["Marca", filtroMarca, setFiltroMarca, "select", marcas],
            ].map(([label, value, setter, type, extra], i) => (
              <div key={i} className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">{label}:</label>
                {type === "select" ? (
                  <select
                    value={value}
                    onChange={e => setter(e.target.value)}
                    className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                  >
                    <option value="">Todas</option>
                    {extra.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                    placeholder={extra}
                  />
                )}
              </div>
            ))}

            <div className="flex items-end justify-end col-span-1 lg:col-start-5">
              <Boton
                texto="Limpiar filtros"
                onClick={limpiarFiltros}
                color="red"
                tamaño="md"
                className="bg-red-700 hover:bg-red-600 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <Boton
              texto="Añadir producto"
              href="/productos/create"
              color="green"
              tamaño="md"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto p-2">
            <DataTable
              columns={columnas}
              data={productosFiltrados}
              pagination
              paginationComponentOptions={paginacionES}
              responsive
              highlightOnHover
              striped
              noDataComponent="No hay productos disponibles"
              customStyles={{
                table: {
                  style: {
                    minWidth: '1000px',
                    fontSize: '15px',
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                  },
                },
                headCells: {
                  style: {
                    fontSize: '15px',
                    fontWeight: 'bold',
                    backgroundColor: '#f3f4f6',
                    color: "#040A2A",
                    borderBottom: "2px solid #e5e7eb",
                  },
                },
                rows: {
                  style: {
                    borderBottom: "1px solid #e5e7eb",
                  },
                },
                cells: {
                  style: {
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    color: "#1f2937",
                  },
                },
              }}
            />
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
