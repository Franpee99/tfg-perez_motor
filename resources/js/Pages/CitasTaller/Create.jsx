import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";
import { useState } from "react";
import { router } from "@inertiajs/react";

// Generador los intervalos de media hora
function generarHorasMediaHora() {
  const tramos = [
    { inicio: 9, fin: 13 },      // Mañana
    { inicio: 15.5, fin: 19.5 }  // Tarde (15.5 = 15:30)
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

// Utilidades para semana y agrupación de citas
function obtenerFechasSemanaActual() {
  const hoy = new Date();
  const lunes = new Date(hoy.setDate(hoy.getDay() === 0 ? hoy.getDate() - 6 : hoy.getDate() - hoy.getDay() + 1));
  const dias = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    dias.push(d.toISOString().slice(0, 10));
  }
  return dias;
}

function agruparCitasPorFecha(citas, fechasSemana) {
  const grupo = {};
  fechasSemana.forEach(fecha => {
    grupo[fecha] = [];
  });
  citas.forEach(cita => {
    if (grupo[cita.fecha]) {
      grupo[cita.fecha].push(cita);
    }
  });
  return grupo;
}

export default function Agenda({ citas }) {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horasSeleccionadas, setHorasSeleccionadas] = useState([]);
  const [horaPersonalizada, setHoraPersonalizada] = useState("");
  const [horasPersonalizadas, setHorasPersonalizadas] = useState([]);

  // Agrupación de citas para la semana
  const fechasSemana = obtenerFechasSemanaActual();
  const citasPorFecha = agruparCitasPorFecha(citas, fechasSemana);

  // Funciones de selección de horas
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
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow mt-10">
        <h2 className="text-2xl font-bold mb-4">Abrir agenda del taller</h2>

        <form onSubmit={enviarFormulario}>
          <div className="mb-4 flex gap-2">
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
          </div>

          <div className="mb-2 flex gap-2">
            <Boton
              tipo="button"
              color="green"
              texto="Seleccionar todas"
              onClick={seleccionarTodas}
            />
            <Boton
              tipo="button"
              color="gray"
              texto="Quitar todas"
              onClick={quitarTodas}
            />
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

            {/* Añadir horas personalizadas */}
            <div className="flex items-center mt-4 gap-2">
              <input
                type="time"
                value={horaPersonalizada}
                onChange={(e) => setHoraPersonalizada(e.target.value)}
                className="border px-2 py-1 rounded"
                step={1800} // 30 minutos
              />
              <Boton
                tipo="button"
                color="blue"
                texto="Añadir hora personalizada"
                onClick={agregarHoraPersonalizada}
              />
            </div>

            {/* Mostrar horas personalizadas añadidas */}
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

        {/* --- NUEVA SECCIÓN MODERNA DE CITAS CREADAS --- */}
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-6">Citas creadas esta semana:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {fechasSemana.map((fecha) => (
              <div
                key={fecha}
                className="bg-[#F8F9FC] rounded-xl shadow p-4 flex flex-col min-h-[120px]"
              >
                <div className="flex items-center mb-2 gap-2">
                  <span className="font-bold text-[#040A2A] text-base">
                    {new Date(fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">{fecha}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {citasPorFecha[fecha].length > 0 ? (
                    citasPorFecha[fecha]
                      .sort((a, b) => a.hora.localeCompare(b.hora))
                      .map((cita) => (
                        <span
                          key={cita.id}
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium border
                            ${cita.estado === "disponible" && "bg-green-100 text-green-700 border-green-200"}
                            ${cita.estado === "reservada" && "bg-yellow-100 text-yellow-700 border-yellow-200"}
                            ${cita.estado === "finalizada" && "bg-blue-100 text-blue-700 border-blue-200"}
                            ${cita.estado === "cancelada" && "bg-red-100 text-red-700 border-red-200"}
                          `}
                          title={`Estado: ${cita.estado}`}
                        >
                          {cita.hora}
                        </span>
                      ))
                  ) : (
                    <span className="text-gray-400 text-xs">Sin citas</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
