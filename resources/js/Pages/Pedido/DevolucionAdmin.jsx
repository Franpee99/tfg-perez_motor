import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { router, usePage, Link } from "@inertiajs/react";
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

  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroTelefono, setFiltroTelefono] = useState("");
  const [filtroPedido, setFiltroPedido] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("pendiente");

  const limpiarFiltros = () => {
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
    setFiltroUsuario("");
    setFiltroCorreo("");
    setFiltroTelefono("");
    setFiltroPedido("");
    setFiltroEstado("");
  };

  const devolucionesFiltradas = devoluciones.filter((d) => {
    const fechaDevolucion = d.created_at ? new Date(d.created_at) : null;
    const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
    const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;
    let fechaOk = true;
    if (desde && fechaDevolucion && fechaDevolucion < desde) fechaOk = false;
    if (hasta && fechaDevolucion && fechaDevolucion > hasta) fechaOk = false;

    const usuarioOk = (d.nombre || "").toLowerCase().includes(filtroUsuario.toLowerCase());
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
      name: "Fecha de dev.",
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
      cell: row => (
        <Link
          href={route("pedidos.show", row.pedido.id)}
          className="text-blue-600 hover:underline"
        >
          {row.pedido?.numero_factura}
        </Link>
      ),
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
      cell: (row) =>
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

  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(tiempo);
  }, []);

  return (
    <AppLayout>
      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-10 px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10">SOLICITUDES DE DEVOLUCIÓN</h1>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 text-sm">
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Desde fecha:</label>
              <input
                type="date"
                value={filtroFechaDesde}
                onChange={e => setFiltroFechaDesde(e.target.value)}
                className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Hasta fecha:</label>
              <input
                type="date"
                value={filtroFechaHasta}
                onChange={e => setFiltroFechaHasta(e.target.value)}
                className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Usuario:</label>
              <input
                type="text"
                value={filtroUsuario}
                onChange={e => setFiltroUsuario(e.target.value)}
                className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                placeholder="Buscar por Usuario"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Correo:</label>
              <input
                type="text"
                value={filtroCorreo}
                onChange={e => setFiltroCorreo(e.target.value)}
                className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                placeholder="Buscar por correo"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Teléfono:</label>
              <input
                type="text"
                value={filtroTelefono}
                onChange={e => setFiltroTelefono(e.target.value)}
                className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                placeholder="Buscar por teléfono"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Pedido:</label>
              <input
                type="text"
                value={filtroPedido}
                onChange={e => setFiltroPedido(e.target.value)}
                className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
                placeholder="Buscar por pedido"
              />
            </div>
            <div className="bg-white/90 border-2 border-blue-200 rounded px-3 py-2 shadow-md">
              <label className="block mb-1 font-semibold text-[#040A2A]">Estado:</label>
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="denegada">Denegada</option>
              </select>
            </div>
            <div className="flex items-end justify-end col-span-1 lg:col-start-5">
              <Boton
                texto="Limpiar filtros"
                onClick={limpiarFiltros}
                color="gray"
                tamaño="md"
                className="bg-red-700 hover:bg-red-600 text-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto p-2">
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
