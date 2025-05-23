import AppLayout from "@/Layouts/AuthenticatedLayout";
import { usePage, router } from "@inertiajs/react";
import { FaMotorcycle, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Boton from "@/Components/Boton";
import VehiculoCard from "@/Components/VehiculoCard";
import ModalEliminar from "@/Components/ModalEliminar";

export default function Index({ vehiculos }) {
  // FLASH MODAL
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success || flash.error) {
      setMensaje(flash.success || flash.error);
      const timer = setTimeout(() => setMensaje(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Modal de confirmación para eliminar
  const [vehiculoEliminar, setVehiculoEliminar] = useState(null);

  const abrirModalEliminar = (vehiculoId) => setVehiculoEliminar(vehiculoId);
  const cerrarModalEliminar = () => setVehiculoEliminar(null);

  const confirmarEliminar = () => {
    if (vehiculoEliminar) {
      router.delete(route("vehiculos.destroy", vehiculoEliminar));
      cerrarModalEliminar();
    }
  };

  return (
    <AppLayout>
      {/* FLASH MODAL */}
      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
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

      {/* Modal de confirmación */}
      <ModalEliminar
        abierta={!!vehiculoEliminar}
        onClose={cerrarModalEliminar}
        onConfirm={confirmarEliminar}
        icono={<FaTrashAlt className="text-4xl text-red-400 mb-3" />}
        titulo="¿Eliminar vehículo?"
        descripcion="¿Seguro que quieres eliminar este vehículo?"
      />


      <section className="py-10 px-4 min-h-screen bg-[#f6f7fb]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-4xl font-extrabold text-[#040A2A] tracking-tight whitespace-nowrap">
              Mis vehículos
            </h1>
            <Boton
              texto="+ Registrar vehículo"
              href={route("vehiculos.create")}
              color="primary"
              tamaño="md"
              className="inline-block mt-6 font-bold shadow"
            />
          </div>
          <div className="w-full h-1 bg-red-600 rounded-full my-6" />

          {vehiculos.length === 0 ? (
            <div className="text-center py-20">
              <FaMotorcycle className="mx-auto text-6xl text-gray-400 mb-2" />
              <p className="text-gray-500 text-lg">Todavía no tienes vehículos registrados.</p>
              <Boton
                texto="Registrar mi primer vehículo"
                href={route("vehiculos.create")}
                color="blue"
                tamaño="md"
                className="inline-block mt-6 font-bold shadow"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehiculos.map((v) => (
                <VehiculoCard
                  key={v.id}
                  vehiculo={v}
                  onEditar={() => router.visit(route('vehiculos.edit', v.id))}
                  onEliminar={() => abrirModalEliminar(v.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
