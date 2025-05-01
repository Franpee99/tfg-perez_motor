import AppLayout from "@/Layouts/AuthenticatedLayout";
import { Link, useForm, usePage } from "@inertiajs/react";
import Boton from "@/Components/Boton";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";

export default function Index({ productos }) {
  const { delete: destroy, processing } = useForm();
  const { flash } = usePage().props;
  const [mensaje, setMensaje] = useState(flash.success || null);

  useEffect(() => {
    if (flash.success) {
      // Mostramos el mensaje
      setMensaje(flash.success);
      // Borrar de flash de la sesion
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
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      destroy(`/productos/${id}`);
    }
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

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
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

        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Lista de Productos
        </h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 text-sm text-gray-700">
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
            <div key={i} className="bg-gray-50 border rounded px-3 py-2">
              <label className="block mb-1 font-semibold text-[#040A2A]">{label}:</label>
              {type === "select" ? (
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="border rounded px-3 py-2 h-[40px] w-full"
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
                  className="border rounded px-3 py-2 h-[40px] w-full"
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
            />
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <Boton
            texto="Crear producto"
            href="/productos/create"
            color="green"
            tamaño="md"
          />
        </div>

        {/* Tabla */}
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
              },
            },
            headCells: {
              style: {
                fontSize: '15px',
                fontWeight: 'bold',
                backgroundColor: '#f3f4f6',
              },
            },
            cells: {
              style: {
                paddingTop: '14px',
                paddingBottom: '14px',
                paddingLeft: '12px',
                paddingRight: '12px',
              },
            },
          }}
        />
      </div>
    </AppLayout>
  );
}
