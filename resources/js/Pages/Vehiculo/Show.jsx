import AppLayout from "@/Layouts/AuthenticatedLayout";
import EstadoCard from "@/Components/EstadoCard";
import { FaMotorcycle } from "react-icons/fa";
import { ClipboardList } from "lucide-react";
import { MdBuildCircle } from "react-icons/md";
import { Link } from "@inertiajs/react";

export default function Show({ vehiculo }) {
  return (
    <AppLayout>
      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-5xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <FaMotorcycle className="text-4xl text-red-600" />
            <h1 className="text-3xl font-bold text-[#040A2A]">
              {vehiculo.marca} {vehiculo.modelo} ({vehiculo.matricula})
            </h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <span className="block text-gray-500">Año</span>
              <span className="text-lg font-semibold text-[#040A2A]">{vehiculo.anio}</span>
            </div>
            <div>
              <span className="block text-gray-500">Cilindrada</span>
              <span className="text-lg font-semibold text-[#040A2A]">{vehiculo.cilindrada} cc</span>
            </div>
            <div>
              <span className="block text-gray-500">Color</span>
              <span className="text-lg font-semibold text-[#040A2A]">{vehiculo.color}</span>
            </div>
            {vehiculo.vin && (
              <div>
                <span className="block text-gray-500">Bastidor</span>
                <span className="text-lg font-semibold text-[#040A2A]">{vehiculo.vin}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h2 className="text-2xl font-bold text-[#040A2A] mb-6">Historial de citas</h2>

            {(!vehiculo.citas || vehiculo.citas.length === 0) ? (
              <div className="text-gray-500 italic">Este vehículo aún no tiene citas registradas.</div>
            ) : (
              <div className="space-y-4">
                {vehiculo.citas.map((cita) => (
                  <div
                    key={cita.id}
                    className="bg-white border-l-4 border-[#C42424] shadow rounded-xl px-6 py-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <ClipboardList className="inline mr-1 text-red-500" />
                        <span className="font-semibold text-[#040A2A]">
                          {new Date(cita.fecha).toLocaleDateString("es-ES")} a las {cita.hora?.slice(0, 5)}
                        </span>
                      </div>
                      <EstadoCard estado={cita.estado} estado_cita={cita.estado_cita} />
                    </div>

                    {cita.mantenimiento && (
                      <div className="mt-2">
                        <Link
                          href={route('mantenimientos.show', cita.mantenimiento.id)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline"
                        >
                          <MdBuildCircle className="inline-block" /> Ver mantenimiento
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
