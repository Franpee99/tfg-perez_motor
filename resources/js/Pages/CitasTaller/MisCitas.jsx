import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";
import ModalEliminar from "@/Components/ModalEliminar";
import EstadoCard from "@/Components/EstadoCard";
import { XCircle, ClipboardList } from "lucide-react";
import { FaMotorcycle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { MdEditNote } from "react-icons/md";

// Función para capitalizar strings
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// Función para mostrar motivo legible
function mostrarMotivo(motivo, motivo_cita) {
  if (motivo_cita && motivo_cita.nombre) return motivo_cita.nombre;
  if (!motivo) return "";
  if (motivo === "reparacion") return "Reparación";
  if (motivo === "mantenimiento") return "Mantenimiento";
  if (motivo === "otro") return "Otro";
  return capitalize(motivo);
}

export default function MisCitas({ citas }) {
  const [animarBarra, setAnimarBarra] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaACancelar, setCitaACancelar] = useState(null);

  // Flash modal control
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);
  const [mostrarFlash, setMostrarFlash] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 200);
    return () => clearTimeout(tiempo);
  }, []);

  useEffect(() => {
    if (flash.success || flash.error) {
      setMensaje(flash.success || flash.error);
      setMostrarFlash(true);
      const timer = setTimeout(() => {
        setMostrarFlash(false);
        setMensaje(null);
        if (flash.success) {
          router.visit(route('citas.misCitas'));
        }
      }, 1700);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const abrirModalCancelar = (cita) => {
    setCitaACancelar(cita);
    setModalAbierto(true);
  };

  const cancelarCita = () => {
    if (!citaACancelar) return;
    router.put(
      route("user.citas.cancelar", citaACancelar.id),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setModalAbierto(false);
          setCitaACancelar(null);
        },
      }
    );
  };

  return (
    <AppLayout title="Mis Citas">
      {/* FLASH MODAL */}
      {mostrarFlash && mensaje && (
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

      <ModalEliminar
        abierta={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={cancelarCita}
        icono={<XCircle className="text-red-500 w-14 h-14" />}
        titulo="¿Cancelar cita?"
        descripcion={`¿Seguro que quieres cancelar la cita del ${citaACancelar ? new Date(citaACancelar.fecha).toLocaleDateString("es-ES") : ""} a las ${citaACancelar?.hora?.slice(0,5) || ""}?`}
        textoCancelar="Volver"
        textoConfirmar="Sí, cancelar"
        colorFondo="#040A2A"
        colorTexto="white"
      />

      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-5xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-8 relative">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-3xl font-extrabold text-[#040A2A]">Mis citas de taller</h1>
            <Boton
              texto="Reservar nueva cita"
              href={route('user.reservar')}
              color="blue"
              tamaño="md"
              className="font-bold"
            />
          </div>
          <div className="relative mt-2 mb-6">
            <div className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${animarBarra ? 'w-full' : 'w-0'}`} />
          </div>
          <p className="mt-3 text-gray-700 text-sm mb-6">Estas son tus próximas y pasadas citas.</p>

          {/* Si no hay citas */}
          {(!citas || citas.length === 0) ? (
            <div className="py-16 text-center">
              <div className="text-2xl font-bold mb-4 text-[#040A2A]">No tienes ninguna cita reservada.</div>
              <Boton
                texto="Reservar cita"
                href={route('user.reservar')}
                color="blue"
                tamaño="lg"
                className="mt-2"
              />
            </div>
          ) : (
            <div className="grid gap-7 grid-cols-1 md:grid-cols-2">
               {citas
                .filter(
                  cita =>
                    (cita.estado_cita?.nombre || cita.estado) !== "disponible"
                )
                .map((cita) => (
                <div
                  key={cita.id}
                  className="bg-white rounded-2xl shadow-lg p-5 flex flex-col gap-3 border-l-8"
                  style={{
                    borderColor:
                      (cita.estado_cita?.nombre || cita.estado) === "reservada"
                        ? "#22c55e"
                        : (cita.estado_cita?.nombre || cita.estado) === "finalizada"
                        ? "#3b82f6"
                        : (cita.estado_cita?.nombre || cita.estado) === "cancelada"
                        ? "#dc2626"
                        : "#d1d5db",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <EstadoCard estado={cita.estado} estado_cita={cita.estado_cita} />
                    {(cita.estado_cita?.nombre || cita.estado) === "reservada" && (
                      <Boton
                        texto="Cancelar cita"
                        color="red"
                        tamaño="xs"
                        className="ml-3"
                        onClick={() => abrirModalCancelar(cita)}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[#040A2A]">
                    <ClipboardList className="w-5 h-5 text-red-600" />
                    <span className="font-semibold">{mostrarMotivo(cita.motivo, cita.motivo_cita)}</span>
                  </div>

                  {cita.mensaje && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <span className="font-semibold flex items-center gap-1">
                        <MdEditNote className="inline text-xl" />{cita.mensaje}</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaMotorcycle className="w-5 h-5 text-[#040A2A]" />
                      <span className="font-semibold">
                        {cita.vehiculo
                          ? `${cita.vehiculo.marca} ${cita.vehiculo.modelo} (${cita.vehiculo.matricula})`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold">
                      <span>
                        {new Date(cita.fecha).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                        {" · "}
                        {cita.hora?.slice(0, 5) || "—"}
                      </span>
                    </div>
                  </div>

                  {cita.mantenimiento && (
                    <div className="mt-3 flex">
                      <Boton
                        texto="Ver mantenimiento"
                        color="blue"
                        tamaño="md"
                        className="ml-auto"
                        href={route("mantenimientos.show", cita.mantenimiento.id)}
                        icono={<ClipboardList className="w-5 h-5" />}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
