import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function DevolucionAdmin({ devoluciones }) {
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success) {
      setMensaje(flash.success);
    }
  }, [flash.success]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  /* Filtrado */
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroTelefono, setFiltroTelefono] = useState("");
  const [filtroPedido, setFiltroPedido] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");


  const limpiarFiltros = () => {
    setFiltroFecha("");
    setFiltroUsuario("");
    setFiltroCorreo("");
    setFiltroTelefono("");
    setFiltroPedido("");
    setFiltroEstado("");
  };


  const devolucionesFiltradas = devoluciones.filter((d) => {

    const fechaOk = new Date(d.created_at)
    .toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .toLowerCase()
    .includes(filtroFecha.toLowerCase());

    const usuarioOk = (d.usuario || "").toLowerCase().includes(filtroUsuario.toLowerCase());
    const correoOk = (d.correo || "").toLowerCase().includes(filtroCorreo.toLowerCase());
    const telefonoOk = (d.telefono || "").toLowerCase().includes(filtroTelefono.toLowerCase());
    const pedidoOk = (d.pedido?.numero_factura || "").toLowerCase().includes(filtroPedido.toLowerCase());
    const estadoOk = filtroEstado === "" || d.estado === filtroEstado;

    return fechaOk && usuarioOk && correoOk && telefonoOk && pedidoOk && estadoOk;
  });

  const actualizarEstado = (id, estado) => {
    router.put(
      route("admin.devoluciones.update", id),
      { estado },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const nuevoMensaje = page.props.flash?.success;
          if (nuevoMensaje) {
            setMensaje(nuevoMensaje);
          }
        },
      }
    );
  };

  const columnas = [
    {
      name: "Fecha",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) =>
        new Date(row.created_at).toLocaleDateString("es-ES", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      name: "Usuario",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono,
    },
    {
      name: "Pedido",
      selector: (row) => row.pedido?.numero_factura || "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Mensaje",
      selector: (row) => row.mensaje,
      wrap: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      cell: (row) => (
        <span
          className={`capitalize font-semibold ${
            row.estado === "pendiente"
              ? "text-yellow-600"
              : row.estado === "aprobada"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
        name: "Acciones",
        cell: (row) => (
          row.estado === "pendiente" ? (
            <div className="flex flex-col gap-2 items-center pt-1 pb-1">
              <Boton
                texto="Aprobar"
                onClick={() => actualizarEstado(row.id, "aprobada")}
                tamaño="sm"
                color="green"
              />
              <Boton
                texto="Denegar"
                onClick={() => actualizarEstado(row.id, "denegada")}
                tamaño="sm"
                color="red"
              />
            </div>
          ) : (
            <span className="text-sm text-gray-400 italic">Ya gestionada</span>
          )
        ),
      },

  ];

  const paginacionES = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: "Todos",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {mensaje}
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Solicitudes de Devolución
        </h1>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 text-sm text-gray-700">
        {[
            ["Fecha", filtroFecha, setFiltroFecha, "text", "Buscar por Fecha"],
            ["Usuario", filtroUsuario, setFiltroUsuario, "text", "Buscar por Usuario"],
            ["Correo", filtroCorreo, setFiltroCorreo, "text", "Buscar por correo"],
            ["Teléfono", filtroTelefono, setFiltroTelefono, "text", "Buscar por teléfono"],
            ["Pedido", filtroPedido, setFiltroPedido, "text", "Buscar por pedido"],
            ["Estado", filtroEstado, setFiltroEstado, "select", ["pendiente", "aprobada", "denegada"]],
        ].map(([label, value, setter, type, extra], i) => (
            <div key={i} className="bg-gray-50 border rounded px-3 py-2">
            <label className="block mb-1 font-semibold text-[#040A2A]">{label}:</label>
            {type === "select" ? (
                <select
                value={value}
                onChange={e => setter(e.target.value)}
                className="border rounded px-3 py-2 h-[40px] w-full"
                >
                <option value="">Todos</option>
                {extra.map(op => (
                    <option key={op} value={op}>{op.charAt(0).toUpperCase() + op.slice(1)}</option>
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

        <DataTable
          columns={columnas}
          data={devolucionesFiltradas}
          pagination
          paginationComponentOptions={paginacionES}
          responsive
          highlightOnHover
          striped
          noDataComponent="No hay solicitudes de devolución"
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
