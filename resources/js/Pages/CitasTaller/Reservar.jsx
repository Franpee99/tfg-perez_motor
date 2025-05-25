import AppLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState, useMemo } from "react";
import { router, usePage } from '@inertiajs/react';
import Boton from "@/Components/Boton";
import { CalendarDays, Clock, Car, ClipboardList, SendHorizonal, ChevronRight } from "lucide-react";

export default function Reservar({ vehiculos, fechasDisponibles }) {
  vehiculos = vehiculos ?? [];
  fechasDisponibles = fechasDisponibles ?? {};

  const motivos = [
    { valor: "mantenimiento", label: "Mantenimiento" },
    { valor: "reparacion", label: "Reparación" },
    { valor: "otro", label: "Otro" },
  ];

  const [datos, setDatos] = useState({
    vehiculo_id: "",
    fecha: "",
    hora: "",
    motivo: "",
    mensaje: ""
  });
  const [errores, setErrores] = useState({});
  const [paso, setPaso] = useState(1);

  const fechasHabilitadas = useMemo(() => Object.keys(fechasDisponibles), [fechasDisponibles]);
  const minDate = fechasHabilitadas.length > 0 ? fechasHabilitadas[0] : "";
  const maxDate = fechasHabilitadas.length > 0 ? fechasHabilitadas[fechasHabilitadas.length - 1] : "";
  const horasDisponibles = datos.fecha && fechasDisponibles[datos.fecha] ? fechasDisponibles[datos.fecha] : [];
  const fechaValida = fechasHabilitadas.includes(datos.fecha);

  // FLASH MODAL CONTROL
  const { flash = {} } = usePage().props;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success || flash.error) {
      setMensaje(flash.success || flash.error);
      setMostrarModal(true);
      const timer = setTimeout(() => {
        setMostrarModal(false);
        setMensaje(null);
        router.visit(route('citas.misCitas'));
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Validación frontend
  const validar = () => {
    const nuevosErrores = {};
    if (!datos.vehiculo_id) nuevosErrores.vehiculo_id = "Selecciona un vehículo.";
    if (!fechaValida) nuevosErrores.fecha = "";
    if (!datos.fecha) nuevosErrores.fecha = "La fecha es obligatoria.";
    if (!datos.hora) nuevosErrores.hora = "Selecciona una hora.";
    if (!datos.motivo) nuevosErrores.motivo = "Selecciona un motivo.";
    if (datos.mensaje && datos.mensaje.length > 500) nuevosErrores.mensaje = "El mensaje no puede tener más de 500 caracteres.";
    return nuevosErrores;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos(prev => ({ ...prev, [name]: value }));
    setErrores(prev => ({ ...prev, [name]: undefined }));
    if (name === "fecha") setDatos(prev => ({ ...prev, hora: "" }));
  };

  const irAlSiguientePaso = () => {
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (
      (paso === 1 && !nuevosErrores.vehiculo_id) ||
      (paso === 2 && !nuevosErrores.fecha && !nuevosErrores.hora) ||
      (paso === 3 && !nuevosErrores.motivo)
    ) {
      setPaso(paso + 1);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const irAlPasoAnterior = () => setPaso(Math.max(1, paso - 1));

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      router.post(route("user.reservar.store"), datos, {
        onError: (errors) => setErrores(errors),
      });
    }
  };

  const vehiculoSeleccionado = vehiculos.find(v => v.id == datos.vehiculo_id);

  return (
    <AppLayout>
      {/* FLASH MODAL */}
      {mostrarModal && mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
          <div className={`text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center ${
            flash.success ? 'bg-[#040A2A]' : 'bg-red-600'
          }`}>
            <svg
              className="w-10 h-10 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {flash.success ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  className="text-green-400"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                  className="text-red-400"
                />
              )}
            </svg>
            {mensaje}
          </div>
        </div>
      )}

      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] flex items-center justify-center px-2">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col gap-2 relative">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#040A2A]">Reservar cita de taller</h1>
            <Boton
              texto="Mis citas"
              href={route("citas.misCitas")}
              color="primary"
              tamaño="sm"
              className="font-bold"
            />
          </div>

          {/* PASOS */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <StepIcon activo={paso === 1} icono={<Car />} label="Vehículo" />
            <ChevronRight className="w-6 h-6 text-red-500" />
            <StepIcon activo={paso === 2} icono={<CalendarDays />} label="Fecha y hora" />
            <ChevronRight className="w-6 h-6 text-red-500" />
            <StepIcon activo={paso === 3} icono={<ClipboardList />} label="Motivo" />
            <ChevronRight className="w-6 h-6 text-red-500" />
            <StepIcon activo={paso === 4} icono={<SendHorizonal />} label="Resumen" />
          </div>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-6">
            {/* Paso 1: Vehículo */}
            {paso === 1 && (
              <div className="bg-gray-50 rounded-xl shadow px-4 py-6">
                <label className="block font-bold text-[#040A2A] mb-2">
                  <Car className="inline-block mr-1 text-red-600" /> Elige tu vehículo*
                </label>
                <select
                  name="vehiculo_id"
                  value={datos.vehiculo_id}
                  onChange={manejarCambio}
                  className="w-full h-12 px-3 mt-1 bg-gray-100 text-[#040A2A] rounded border-2 border-[#040A2A] font-semibold"
                  required
                  disabled={vehiculos.length === 0}
                >
                  <option value="">Selecciona tu vehículo...</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} ({v.matricula})
                    </option>
                  ))}
                </select>
                {errores.vehiculo_id && <p className="text-red-500 text-xs">{errores.vehiculo_id}</p>}
                {vehiculos.length === 0 && (
                  <p className="text-yellow-600 text-xs mt-1">Debes añadir un vehículo antes de reservar una cita.</p>
                )}

                <div className="flex justify-end mt-6">
                  <Boton
                    texto="Siguiente"
                    tipo="button"
                    color="red"
                    tamaño="md"
                    onClick={irAlSiguientePaso}
                    className="font-bold"
                    disabled={vehiculos.length === 0}
                  />
                </div>
              </div>
            )}

            {/* Paso 2: Fecha y hora */}
            {paso === 2 && (
              <div className="bg-gray-50 rounded-xl shadow px-4 py-6">
                <label className="block font-bold text-[#040A2A] mb-2">
                  <CalendarDays className="inline-block mr-1 text-red-600" /> Fecha*
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={datos.fecha}
                  onChange={manejarCambio}
                  className="w-full h-12 px-3 mt-1 bg-gray-100 text-[#040A2A] rounded border-2 border-[#040A2A] font-semibold"
                  min={minDate}
                  max={maxDate}
                  required
                  disabled={fechasHabilitadas.length === 0}
                />

                {errores.fecha && datos.fecha === "" && (
                  <p className="text-red-500 text-xs">{errores.fecha}</p>
                )}
                {fechasHabilitadas.length === 0 && (
                  <p className="text-yellow-600 text-xs mt-1">No hay agenda disponible para reservar.</p>
                )}

                <label className="block font-bold text-[#040A2A] mt-6 mb-2">
                  <Clock className="inline-block mr-1 text-red-600" /> Hora*
                </label>
                <select
                  name="hora"
                  value={datos.hora}
                  onChange={manejarCambio}
                  className="w-full h-12 px-3 mt-1 bg-gray-100 text-[#040A2A] rounded border-2 border-[#040A2A] font-semibold"
                  required
                  disabled={!fechaValida || horasDisponibles.length === 0}
                >
                  <option value="">Selecciona la hora...</option>
                  {horasDisponibles.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
                {errores.hora && <p className="text-red-500 text-xs">{errores.hora}</p>}

                <div className="flex justify-between mt-6">
                  <Boton
                    texto="Atrás"
                    tipo="button"
                    color="gray"
                    tamaño="md"
                    onClick={irAlPasoAnterior}
                    className="font-bold"
                  />
                  <Boton
                    texto="Siguiente"
                    tipo="button"
                    color="red"
                    tamaño="md"
                    onClick={irAlSiguientePaso}
                    className="font-bold"
                    disabled={!fechaValida || horasDisponibles.length === 0}
                  />
                </div>
              </div>
            )}

            {/* Paso 3: Motivo y Mensaje */}
            {paso === 3 && (
              <div className="bg-gray-50 rounded-xl shadow px-4 py-6">
                <label className="block font-bold text-[#040A2A] mb-2">
                  <ClipboardList className="inline-block mr-1 text-red-600" /> Motivo*
                </label>
                <select
                  name="motivo"
                  value={datos.motivo}
                  onChange={manejarCambio}
                  className="w-full h-12 px-3 mt-1 bg-gray-100 text-[#040A2A] rounded border-2 border-[#040A2A] font-semibold"
                  required
                >
                  <option value="">Selecciona el motivo...</option>
                  {motivos.map(m => (
                    <option key={m.valor} value={m.valor}>{m.label}</option>
                  ))}
                </select>
                {errores.motivo && <p className="text-red-500 text-xs">{errores.motivo}</p>}

                <label className="block font-bold text-[#040A2A] mt-6 mb-2">
                  Comentarios (opcional)
                </label>
                <textarea
                  name="mensaje"
                  value={datos.mensaje}
                  onChange={manejarCambio}
                  className="w-full px-3 mt-1 bg-gray-100 text-[#040A2A] rounded border-2 border-[#040A2A] font-semibold"
                  placeholder="¿Algún detalle o comentario sobre la cita?"
                  rows={3}
                  maxLength={500}
                />
                {errores.mensaje && <p className="text-red-500 text-xs">{errores.mensaje}</p>}

                <div className="flex justify-between mt-6">
                  <Boton
                    texto="Atrás"
                    tipo="button"
                    color="gray"
                    tamaño="md"
                    onClick={irAlPasoAnterior}
                    className="font-bold"
                  />
                  <Boton
                    texto="Siguiente"
                    tipo="button"
                    color="red"
                    tamaño="md"
                    onClick={irAlSiguientePaso}
                    className="font-bold"
                  />
                </div>
              </div>
            )}

            {/* Paso 4: Resumen */}
            {paso === 4 && (
              <div className="bg-white rounded-xl shadow px-4 py-8 flex flex-col gap-4">
                <div className="flex flex-col gap-3 text-[#040A2A] text-lg font-bold">
                  <div className="flex items-center gap-2">
                    <Car className="text-red-500" />
                    Vehículo: <span className="font-normal">{vehiculoSeleccionado ? `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} (${vehiculoSeleccionado.matricula})` : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-red-500" />
                    Fecha: <span className="font-normal">{datos.fecha ? new Date(datos.fecha).toLocaleDateString("es-ES") : "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-red-500" />
                    Hora: <span className="font-normal">{datos.hora || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="text-red-500" />
                    Motivo: <span className="font-normal">{motivos.find(m => m.valor === datos.motivo)?.label || "—"}</span>
                  </div>
                  {datos.mensaje && (
                    <div className="flex items-center gap-2">
                      <SendHorizonal className="text-red-500" />
                      Mensaje: <span className="font-normal">{datos.mensaje}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <Boton
                    texto="Atrás"
                    tipo="button"
                    color="gray"
                    tamaño="md"
                    onClick={irAlPasoAnterior}
                    className="font-bold"
                  />
                  <Boton
                    texto="Reservar cita"
                    tipo="submit"
                    color="red"
                    tamaño="lg"
                    className="font-bold"
                  />
                </div>
              </div>
            )}

          </form>
        </div>
      </section>
    </AppLayout>
  );
}

// Componente para paso visual
function StepIcon({ activo, icono, label }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${activo ? "text-red-600" : "text-gray-400 opacity-60"}`}>
      <div className={`rounded-full border-2 ${activo ? "border-red-600" : "border-gray-300"} bg-white w-10 h-10 flex items-center justify-center text-2xl mb-1`}>
        {icono}
      </div>
      <span className="text-xs font-bold uppercase">{label}</span>
    </div>
  );
}
