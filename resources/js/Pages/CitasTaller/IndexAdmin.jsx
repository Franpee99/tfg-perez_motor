import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { FaTrashAlt } from "react-icons/fa";
import AgendaCreate from "@/Components/AgendaCreate";
import ModalEditarCita from "@/Components/ModalEditarCita";
import ModalEliminar from "@/Components/ModalEliminar";

// Función para capitalizar strings
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function IndexAdmin({ citas, estados }) {

  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);
  const [animarBarra, setAnimarBarra] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => { if (flash.success) setMensaje(flash.success); }, [flash.success]);
  useEffect(() => { if (mensaje) { const timer = setTimeout(() => setMensaje(null), 3500); return () => clearTimeout(timer); } }, [mensaje]);
  useEffect(() => { const tiempo = setTimeout(() => setAnimarBarra(true), 300); return () => clearTimeout(tiempo); }, []);

  /* ---- EDITAR UNA CITA ---- */
  const [citaEditar, setCitaEditar] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [citaEliminar, setCitaEliminar] = useState(null);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  // Abrir/cerrar modales
  const abrirModalEditar = (cita) => {
    setCitaEditar(cita);
    setMostrarModalEditar(true);
  };
  const cerrarModalEditar = () => {
    setCitaEditar(null);
    setMostrarModalEditar(false);
  };

  const abrirModalEliminar = (cita) => {
    setCitaEliminar(cita);
    setMostrarModalEliminar(true);
  };
  const cerrarModalEliminar = () => {
    setCitaEliminar(null);
    setMostrarModalEliminar(false);
  };

  // Filtros
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [filtroHora, setFiltroHora] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroVehiculo, setFiltroVehiculo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroMotivo, setFiltroMotivo] = useState("");

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
    setFiltroHora("");
    setFiltroUsuario("");
    setFiltroVehiculo("");
    setFiltroEstado("");
    setFiltroMotivo("");
  };

  const citasFiltradas = citas.filter((c) => {
    const fechaCita = c.fecha ? new Date(c.fecha) : null;

    const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
    const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;

    let fechaDentroRango = true;
    if (desde && fechaCita && fechaCita < desde) fechaDentroRango = false;
    if (hasta && fechaCita && fechaCita > hasta) fechaDentroRango = false;

    const horaOk = c.hora?.slice(0, 5).includes(filtroHora);
    const usuarioOk = (c.user?.name || "").toLowerCase().includes(filtroUsuario.toLowerCase());
    const vehiculoOk = (c.vehiculo?.matricula || "").toLowerCase().includes(filtroVehiculo.toLowerCase());
    const estadoOk = filtroEstado === "" || (c.estado_cita?.nombre === filtroEstado);
    const motivoOk = filtroMotivo === "" || (c.motivo || "").toLowerCase().includes(filtroMotivo.toLowerCase());
    return fechaDentroRango && horaOk && usuarioOk && vehiculoOk && estadoOk && motivoOk;
  });

  const columnas = [
    {
      name: "Fecha",
      selector: row => row.fecha,
      sortable: true,
      width: "100px",
      format: row => new Date(row.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    },
    {
      name: "Hora",
      selector: row => row.hora,
      sortable: true,
      width: "110px",
      cell: row => row.hora ? row.hora.slice(0, 5) : "—",
    },
    {
      name: "Estado",
      selector: row => row.estado_cita?.nombre,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1 font-semibold">
          {row.estado_cita?.nombre === "disponible" && <CheckCircle className="text-green-500 w-4 h-4" />}
          {row.estado_cita?.nombre === "reservada" && <Clock className="text-yellow-400 w-4 h-4" />}
          {row.estado_cita?.nombre === "finalizada" && <CheckCircle className="text-blue-500 w-4 h-4" />}
          {row.estado_cita?.nombre === "cancelada" && <XCircle className="text-red-500 w-4 h-4" />}
          <span className="capitalize">{row.estado_cita?.nombre || "—"}</span>
        </span>
      ),
      width: "120px"
    },
    {
      name: "Usuario",
      selector: row => row.user?.name || "—",
      sortable: true,
      width: "150px"
    },
    {
      name: "Vehículo",
      selector: row => row.vehiculo?.matricula || "—",
      sortable: true,
      width: "120px"
    },
    {
      name: "Motivo",
      selector: row => row.motivo || "—",
      sortable: true,
      cell: row => (
        <span>{capitalize(row.motivo)}</span>
      ),
      width: "130px"
    },
    {
      name: "Mensaje",
      selector: row => row.mensaje || "—",
      wrap: true,
      grow: 2,
    },
    {
      name: "Mantenimiento",
      cell: row => (
        row.estado_cita?.nombre === "finalizada" && !row.mantenimiento && row.user ? (
          <Boton
            texto="Registrar"
            tamaño="xs"
            color="green"
            onClick={() => router.get(route("admin.mantenimientos.create", {
              vehiculo_id: row.vehiculo?.id,
              cita_taller_id: row.id
            }))}
            className="font-bold"
          />
        ) : (
          row.mantenimiento ?
            <span className="text-green-700 font-bold">Registrado</span>
            : <span className="text-gray-400">—</span>
        )
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "140px"
    },
    {
      name: "Acciones",
      cell: row => (
        <div className="flex gap-2">
          <Boton
            texto="Editar"
            tamaño="xs"
            color="blue"
            onClick={() => abrirModalEditar(row)}
          />
          <Boton
            texto="Eliminar"
            tamaño="xs"
            color="red"
            onClick={() => abrirModalEliminar(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "130px"
    }
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
      {/* MODAL EDITAR CITA */}
      <ModalEditarCita
        abierta={mostrarModalEditar}
        cita={citaEditar}
        estados={estados}
        onClose={cerrarModalEditar}
        onSubmit={({ fecha, hora, estado_cita_id }) => {
          router.put(
            route("admin.citas.update", citaEditar.id),
            { fecha, hora, estado_cita_id },
            { onSuccess: () => cerrarModalEditar() }
          );
        }}
      />

      {/* MODAL ELIMINAR CITA */}
      <ModalEliminar
        abierta={mostrarModalEliminar}
        onClose={cerrarModalEliminar}
        onConfirm={() => {
          router.delete(route("admin.citas.destroy", citaEliminar.id), {
            onSuccess: () => cerrarModalEliminar()
          });
        }}
        icono={<FaTrashAlt className="text-4xl text-red-400" />}
        titulo="¿Eliminar cita?"
        descripcion="¿Seguro que quieres eliminar esta cita?"
      />

      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-10 px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10">GESTIÓN DE CITAS DE TALLER</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          {/* Mensaje flash */}
          {mensaje && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
                <CheckCircle className="w-10 h-10 mb-2 text-green-400" />
                {mensaje}
              </div>
            </div>
          )}

          {/* Formularia Agenda*/}
          <div className="mb-8">
            <Boton
              tipo="button"
              color={mostrarFormulario ? "gray" : "blue"}
              texto={mostrarFormulario ? "Cerrar agenda" : "Abrir agenda"}
              onClick={() => setMostrarFormulario(v => !v)}
              className="mb-4"
              icono={mostrarFormulario ? <ChevronUp className="inline-block ml-2 w-5 h-5" /> : <ChevronDown className="inline-block ml-2 w-5 h-5" />}
            />
            {mostrarFormulario && (
              <AgendaCreate
                onSubmit={({ fechas, horas, limpiar }) => {
                  router.post(route("citas.store"), { fechas, horas }, {
                    onSuccess: () => {
                      limpiar();
                      setMostrarFormulario(false);
                    }
                  });
                }}
                onCancel={() => setMostrarFormulario(false)}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto p-2">
            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6 text-sm">
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Desde fecha:</label>
                <input type="date" value={filtroFechaDesde} onChange={e => setFiltroFechaDesde(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"/>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Hasta fecha:</label>
                <input type="date" value={filtroFechaHasta} onChange={e => setFiltroFechaHasta(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition"/>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Hora:</label>
                <input type="text" value={filtroHora} onChange={e => setFiltroHora(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="HH:MM"/>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Usuario:</label>
                <input type="text" value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar usuario"/>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Vehículo:</label>
                <input type="text" value={filtroVehiculo} onChange={e => setFiltroVehiculo(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar matrícula"/>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Estado:</label>
                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition">
                  <option value="">Todos</option>
                  <option value="disponible">Disponible</option>
                  <option value="reservada">Reservada</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="bg-white/90 border-2 border-gray-200 rounded px-3 py-3 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Motivo:</label>
                <input type="text" value={filtroMotivo} onChange={e => setFiltroMotivo(e.target.value)}
                  className="w-full h-10 px-3 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar motivo"/>
              </div>
              <div className="flex items-end justify-end col-span-1">
                <Boton
                  texto="Limpiar filtros"
                  onClick={limpiarFiltros}
                  color="gray"
                  tamaño="sm"
                  className="bg-red-700 hover:bg-red-600 text-white w-28"
                />
              </div>
            </div>

            <DataTable
              columns={columnas}
              data={citasFiltradas}
              pagination
              paginationComponentOptions={paginacionES}
              responsive
              highlightOnHover
              striped
              noDataComponent="No hay citas"
              customStyles={{
                table: { style: { minWidth: "1000px", fontSize: "15px", backgroundColor: "#fff", borderRadius: "10px" } },
                headCells: { style: { fontSize: "15px", fontWeight: "bold", backgroundColor: "#f3f4f6", color: "#040A2A", borderBottom: "2px solid #e5e7eb" } },
                rows: { style: { borderBottom: "1px solid #e5e7eb" } },
                cells: { style: { padding: "14px 12px", color: "#1f2937" } },
              }}
            />
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
