import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { usePage, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

// Lógica de horas y días
function generarHorasMediaHora() {
  const tramos = [
    { inicio: 9, fin: 13 },
    { inicio: 15.5, fin: 19.5 }
  ];
  let horas = [];
  tramos.forEach(({ inicio, fin }) => {
    for (let t = inicio; t <= fin; t += 0.5) {
      const h = Math.floor(t);
      const m = t % 1 === 0 ? "00" : "30";
      horas.push(`${h.toString().padStart(2, "0")}:${m}`);
    }
  });
  return horas;
}
const HORAS_LABORALES = generarHorasMediaHora();

export default function IndexAdmin({ citas }) {

  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => { if (flash.success) setMensaje(flash.success); }, [flash.success]);
  useEffect(() => { if (mensaje) { const timer = setTimeout(() => setMensaje(null), 3500); return () => clearTimeout(timer); } }, [mensaje]);
  useEffect(() => { const tiempo = setTimeout(() => setAnimarBarra(true), 300); return () => clearTimeout(tiempo); }, []);

  // Estado para mostrar formulario
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Formulario crear citas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
  const [horaPersonalizada, setHoraPersonalizada] = useState("");
  const [horasPersonalizadas, setHorasPersonalizadas] = useState([]);

  // Funciones horas
  const alternarHora = (hora) => {
    setHorasSeleccionadas((prev) =>
      prev.includes(hora)
        ? prev.filter((h) => h !== hora)
        : [...prev, hora]
    );
  };

  const agregarHoraPersonalizada = () => {
    if (
      horaPersonalizada &&
      !horasPersonalizadas.includes(horaPersonalizada) &&
      !HORAS_LABORALES.includes(horaPersonalizada)
    ) {
      setHorasPersonalizadas([...horasPersonalizadas, horaPersonalizada]);
      setHorasSeleccionadas([...horasSeleccionadas, horaPersonalizada]);
      setHoraPersonalizada("");
    }
  };

  const eliminarHoraPersonalizada = (hora) => {
    setHorasPersonalizadas(horasPersonalizadas.filter((h) => h !== hora));
    setHorasSeleccionadas(horasSeleccionadas.filter((h) => h !== hora));
  };

  const seleccionarTodas = () => {
    setHorasSeleccionadas([
      ...HORAS_LABORALES,
      ...horasPersonalizadas.filter((h) => !HORAS_LABORALES.includes(h)),
    ]);
  };

  const quitarTodas = () => setHorasSeleccionadas([]);

  const enviarFormulario = (e) => {
    e.preventDefault();
    if (fechaInicio && fechaFin && horasSeleccionadas.length) {
      const fechas = [];
      let fecha = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
      while (fecha <= fechaFinObj) {
        const dia = fecha.getDay();
        if (dia >= 1 && dia <= 5) {
          fechas.push(fecha.toISOString().slice(0, 10));
        }
        fecha.setDate(fecha.getDate() + 1);
      }
      router.post(route("citas.store"), {
        fechas,
        horas: horasSeleccionadas,
      }, {
        onSuccess: () => {
          setMostrarFormulario(false);
          setFechaInicio("");
          setFechaFin("");
          setHorasSeleccionadas([]);
          setHoraPersonalizada("");
          setHorasPersonalizadas([]);
        }
      });
    }
  };

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroHora, setFiltroHora] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroVehiculo, setFiltroVehiculo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroMotivo, setFiltroMotivo] = useState("");

  const limpiarFiltros = () => {
    setFiltroFecha("");
    setFiltroHora("");
    setFiltroUsuario("");
    setFiltroVehiculo("");
    setFiltroEstado("");
    setFiltroMotivo("");
  };

  const citasFiltradas = citas.filter((c) => {
    const fechaFormateada = c.fecha
      ? new Date(c.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })
      : "";
    const fechaOk = fechaFormateada.toLowerCase().includes(filtroFecha.toLowerCase());
    const horaOk = c.hora?.slice(0, 5).includes(filtroHora);
    const usuarioOk = (c.user?.name || "").toLowerCase().includes(filtroUsuario.toLowerCase());
    const vehiculoOk = (c.vehiculo?.matricula || "").toLowerCase().includes(filtroVehiculo.toLowerCase());
    const estadoOk = filtroEstado === "" || c.estado === filtroEstado;
    const motivoOk = filtroMotivo === "" || (c.motivo || "").toLowerCase().includes(filtroMotivo.toLowerCase());
    return fechaOk && horaOk && usuarioOk && vehiculoOk && estadoOk && motivoOk;
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
      selector: row => row.estado,
      sortable: true,
      cell: row => (
        <span className="flex items-center gap-1 font-semibold">
          {row.estado === "disponible" && <CheckCircle className="text-green-500 w-4 h-4" />}
          {row.estado === "reservada" && <Clock className="text-yellow-400 w-4 h-4" />}
          {row.estado === "finalizada" && <CheckCircle className="text-blue-500 w-4 h-4" />}
          {row.estado === "cancelada" && <XCircle className="text-red-500 w-4 h-4" />}
          <span className="capitalize">{row.estado}</span>
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
      width: "130px"
    },
    {
      name: "Mensaje",
      selector: row => row.mensaje || "—",
      wrap: true,
      grow: 2,
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
      <section className="bg-[#040A2A] text-white py-10 px-6 pt-20 min-h-screen">
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
              <div className="bg-white text-[#040A2A] rounded-lg shadow-lg p-6 mt-2 animate-fadeIn">
                <form onSubmit={enviarFormulario}>
                  <div className="mb-4 flex gap-4 flex-wrap">
                    <div>
                      <label>Desde:</label>
                      <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="border px-2 py-1 rounded ml-2"
                        required
                      />
                    </div>
                    <div>
                      <label>Hasta:</label>
                      <input
                        type="date"
                        value={fechaFin}
                        min={fechaInicio}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="border px-2 py-1 rounded ml-2"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Boton
                        tipo="button"
                        color="green"
                        texto="Seleccionar todas"
                        onClick={seleccionarTodas}
                      />
                      <Boton
                        tipo="button"
                        color="red"
                        texto="Quitar todas"
                        onClick={quitarTodas}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <strong>Selecciona las horas:</strong>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {HORAS_LABORALES.map((hora) => (
                        <label key={hora} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={horasSeleccionadas.includes(hora)}
                            onChange={() => alternarHora(hora)}
                          />
                          <span>{hora}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center mt-4 gap-2">
                      <input
                        type="time"
                        value={horaPersonalizada}
                        onChange={(e) => setHoraPersonalizada(e.target.value)}
                        className="border px-2 py-1 rounded"
                        step={1800}
                      />
                      <Boton
                        tipo="button"
                        color="blue"
                        texto="Añadir hora personalizada"
                        onClick={agregarHoraPersonalizada}
                      />
                    </div>
                    {horasPersonalizadas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {horasPersonalizadas.map((hora) => (
                          <span key={hora} className="bg-yellow-100 px-3 py-1 rounded flex items-center gap-1">
                            {hora}
                            <button
                              type="button"
                              className="ml-1 text-red-600 font-bold"
                              onClick={() => eliminarHoraPersonalizada(hora)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Boton
                    tipo="submit"
                    color="blue"
                    texto="Abrir agenda"
                    disabled={!fechaInicio || !fechaFin || !horasSeleccionadas.length}
                    className={`mt-2 ${(!fechaInicio || !fechaFin || !horasSeleccionadas.length)
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                      }`}
                  />
                </form>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto p-2">
            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 text-sm">
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Fecha:</label>
                <input type="text" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="DD/MM/YY" />
              </div>
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Hora:</label>
                <input type="text" value={filtroHora} onChange={e => setFiltroHora(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="HH:MM" />
              </div>
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Usuario:</label>
                <input type="text" value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar usuario" />
              </div>
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Vehículo:</label>
                <input type="text" value={filtroVehiculo} onChange={e => setFiltroVehiculo(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar matrícula" />
              </div>
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Estado:</label>
                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition">
                  <option value="">Todos</option>
                  <option value="disponible">Disponible</option>
                  <option value="reservada">Reservada</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="bg-white/90 border-2 border-red-200 rounded px-3 py-2 shadow-md">
                <label className="block mb-1 font-semibold text-[#040A2A]">Motivo:</label>
                <input type="text" value={filtroMotivo} onChange={e => setFiltroMotivo(e.target.value)}
                  className="w-full h-10 px-3 mt-1 bg-white text-[#040A2A] rounded border-2 border-blue-400 focus:border-blue-600 shadow-sm transition" placeholder="Buscar motivo" />
              </div>
              <div className="flex items-end justify-end col-span-1 lg:col-start-6">
                <Boton texto="Limpiar filtros" onClick={limpiarFiltros} color="gray" tamaño="md"
                  className="bg-red-700 hover:bg-red-600 text-white" />
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
