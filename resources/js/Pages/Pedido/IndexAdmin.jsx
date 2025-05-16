import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { usePage, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Ban } from "lucide-react";

export default function IndexAdmin({ pedidos }) {
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success) setMensaje(flash.success);
  }, [flash.success]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const totalPendientes = pedidos.reduce((acc, pedido) => {
    return acc + (pedido.devoluciones?.filter(d => d.estado === "pendiente").length || 0);
  }, 0);

  const cambiarEstado = (pedidoId, nuevoEstado) => {
    router.post(
      route("admin.pedidos.cambiarEstado", pedidoId),
      {
        _method: "put",
        estado: nuevoEstado,
      },
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

  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroCorreo, setFiltroCorreo] = useState("");
  const [filtroTelefono, setFiltroTelefono] = useState("");
  const [filtroPedido, setFiltroPedido] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroDevolucion, setFiltroDevolucion] = useState("");

  const limpiarFiltros = () => {
    setFiltroFecha("");
    setFiltroUsuario("");
    setFiltroCorreo("");
    setFiltroTelefono("");
    setFiltroPedido("");
    setFiltroEstado("");
    setFiltroDevolucion("");
  };

  const determinarEstadoDevolucion = (devoluciones) => {
    if (!devoluciones || devoluciones.length === 0) return "Sin solicitud";
    if (devoluciones.some(d => d.estado === "aprobada")) return "Aprobada";
    if (devoluciones.some(d => d.estado === "pendiente")) return "Pendiente";
    return "Denegada";
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const fechaOk = new Date(p.created_at).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).toLowerCase().includes(filtroFecha.toLowerCase());

    const usuarioOk = (p.user?.name || "").toLowerCase().includes(filtroUsuario.toLowerCase());
    const correoOk = (p.user?.email || "").toLowerCase().includes(filtroCorreo.toLowerCase());
    const telefonoOk = (p.user?.telefono || "").toLowerCase().includes(filtroTelefono.toLowerCase());
    const pedidoOk = (p.numero_factura || "").toLowerCase().includes(filtroPedido.toLowerCase());
    const estadoOk = filtroEstado === "" || p.estado === filtroEstado;
    const estadoDevolucion = determinarEstadoDevolucion(p.devoluciones);
    const devolucionOk = filtroDevolucion === "" || estadoDevolucion === filtroDevolucion;

    return fechaOk && usuarioOk && correoOk && telefonoOk && pedidoOk && estadoOk && devolucionOk;
  });

  const columnas = [
    {
      name: "Fecha",
      selector: row => row.created_at,
      sortable: true,
      cell: row =>
        new Date(row.created_at).toLocaleDateString("es-ES", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    { name: "Usuario", selector: row => row.user?.name, sortable: true },
    { name: "Correo", selector: row => row.user?.email, sortable: true },
    { name: "Teléfono", selector: row => row.user?.telefono || "—" },
    {
      name: "Pedido",
      selector: row => row.numero_factura,
      sortable: true,
      cell: row => (
        <Link href={route("pedidos.show", row.id)} className="text-blue-600 hover:underline">
          {row.numero_factura}
        </Link>
      ),
    },
    {
        name: "Estado de envío",
        selector: row => row.estado,
        cell: row => {
        const estado = row.estado;

        const colores = {
        entregado: "text-green-600",
        enviado: "text-blue-600",
        procesado: "text-yellow-500",
        pendiente: "text-gray-500",
        cancelado: "text-red-600"
        };

        return (
        <div className="flex flex-col gap-1">
            <span className={`capitalize font-semibold ${colores[estado]}`}>
            {estado}
            </span>

            {estado === "pendiente" && (
            <Boton
                texto="Marcar como procesado"
                onClick={() => cambiarEstado(row.id, "procesado")}
                tamaño="xs"
                color="gray"
            />
            )}

            {estado === "procesado" && (
            <Boton
                texto="Marcar como enviado"
                onClick={() => cambiarEstado(row.id, "enviado")}
                tamaño="xs"
                color="blue"
            />
            )}
        </div>
        );
    }
    },
    {
      name: "Estado devolución",
      selector: row => determinarEstadoDevolucion(row.devoluciones),
      cell: row => {
        const estado = determinarEstadoDevolucion(row.devoluciones);
        let icono, color;

        switch (estado) {
          case "Aprobada":
            icono = <CheckCircle className="text-green-600 w-4 h-4" />;
            color = "text-green-600";
            break;
          case "Pendiente":
            icono = <Clock className="text-yellow-600 w-4 h-4" />;
            color = "text-yellow-600";
            break;
          case "Denegada":
            icono = <XCircle className="text-red-600 w-4 h-4" />;
            color = "text-red-600";
            break;
          default:
            icono = <Ban className="text-gray-400 w-4 h-4" />;
            color = "text-gray-400";
        }

        return (
          <div className="flex flex-col gap-1">
            <span className={`capitalize font-semibold flex items-center gap-1 ${color}`}>
              {icono} {estado}
            </span>
            {estado === "Pendiente" && (
              <Link
                href={route("admin.devoluciones.index")}
                className="text-xs text-blue-600 hover:underline"
              >
                Ver solicitudes
              </Link>
            )}
          </div>
        );
      }
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
              <CheckCircle className="w-10 h-10 mb-2 text-green-400" />
              {mensaje}
            </div>
          </div>
        )}

        {totalPendientes > 0 && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 shadow-sm rounded-md">
            Hay <strong>{totalPendientes}</strong> solicitud{totalPendientes > 1 ? "es" : ""} de devolución <strong>pendiente{totalPendientes > 1 ? "s" : ""}</strong>.{" "}
            <Link href={route("admin.devoluciones.index")} className="underline font-semibold hover:text-yellow-900">
            Ver devoluciones
            </Link>
        </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gestión de Pedidos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4 text-sm text-gray-700">
          {[
            ["Fecha", filtroFecha, setFiltroFecha, "text", "Buscar por Fecha"],
            ["Usuario", filtroUsuario, setFiltroUsuario, "text", "Buscar por Usuario"],
            ["Correo", filtroCorreo, setFiltroCorreo, "text", "Buscar por correo"],
            ["Teléfono", filtroTelefono, setFiltroTelefono, "text", "Buscar por teléfono"],
            ["Pedido", filtroPedido, setFiltroPedido, "text", "Buscar por pedido"],
            ["Estado de envío", filtroEstado, setFiltroEstado, "select", ["pendiente", "procesado", "enviado", "entregado", "cancelado"]],
            ["Estado de devolución", filtroDevolucion, setFiltroDevolucion, "select", ["Aprobada", "Pendiente", "Denegada", "Sin solicitud"]],
          ].map(([label, value, setter, type, extra], i) => (
            <div key={i} className="bg-gray-50 border rounded px-3 py-2">
              <label className="block mb-1 font-semibold text-[#040A2A]">{label}:</label>
              {type === "select" ? (
                <select value={value} onChange={(e) => setter(e.target.value)} className="border rounded px-3 py-2 h-[40px] w-full">
                  <option value="">Todos</option>
                  {extra.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="border rounded px-3 py-2 h-[40px] w-full"
                  placeholder={extra}
                />
              )}
            </div>
          ))}
          <div className="flex items-end justify-end col-span-1 lg:col-start-5">
            <Boton texto="Limpiar filtros" onClick={limpiarFiltros} color="gray" tamaño="md" />
          </div>
        </div>

        <DataTable
          columns={columnas}
          data={pedidosFiltrados}
          pagination
          paginationComponentOptions={paginacionES}
          responsive
          highlightOnHover
          striped
          noDataComponent="No hay pedidos"
          customStyles={{
            table: { style: { minWidth: "1000px", fontSize: "15px" } },
            headCells: { style: { fontSize: "15px", fontWeight: "bold", backgroundColor: "#f3f4f6" } },
            cells: { style: { padding: "14px 12px" } },
          }}
        />
      </div>
    </AppLayout>
  );
}
