import { useState } from "react";
import Boton from "@/Components/Boton";

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

export default function AgendaCreate({ onSubmit, onCancel }) {
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

  const manejarEnvio = (e) => {
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
      onSubmit({
        fechas,
        horas: horasSeleccionadas,
        limpiar: () => {
          setFechaInicio("");
          setFechaFin("");
          setHorasSeleccionadas([]);
          setHoraPersonalizada("");
          setHorasPersonalizadas([]);
        }
      });
    }
  };

  return (
    <div className="bg-white text-[#040A2A] rounded-lg shadow-lg p-6 mt-2 animate-fadeIn">
      <form onSubmit={manejarEnvio}>
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
        <div className="flex gap-2 mt-4">
          <Boton
            tipo="submit"
            color="blue"
            texto="Abrir agenda"
            disabled={!fechaInicio || !fechaFin || !horasSeleccionadas.length}
            className={(!fechaInicio || !fechaFin || !horasSeleccionadas.length)
              ? "opacity-60 cursor-not-allowed"
              : ""}
          />
        </div>
      </form>
    </div>
  );
}
