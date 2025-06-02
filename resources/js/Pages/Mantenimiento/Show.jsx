import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";
import { Link, usePage } from "@inertiajs/react";
import { Edit } from "lucide-react";

export default function Show({ mantenimiento, is_admin }) {
  const { vehiculo, cita, mantenimiento_detalles } = mantenimiento;

  // Calcular total
  const totalDetalles = mantenimiento_detalles.reduce((sum, d) => sum + Number(d.precio || 0), 0);
  const total = totalDetalles + Number(mantenimiento.mano_obra || 0);

  return (
    <AppLayout>
      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-12 px-2 flex flex-col items-center">
        <div className="w-full max-w-3xl mx-auto flex justify-end mb-4">
          {is_admin && (
            <Boton
              texto="Volver a gestión del taller"
              color="red"
              tamaño="md"
              href={route('admin.citas.index')}
              className="rounded-lg font-bold px-6 py-2"
            />
          )}
        </div>
        <div className="max-w-3xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-10 border border-gray-100 relative">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-[#141b3a] flex items-center gap-4">
              Detalles del mantenimiento
            </h1>
            <div className="flex gap-2">
              <a
                href={route('factura.taller.ver', mantenimiento.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  bg-blue-700
                  hover:bg-blue-800
                  text-white
                  transition
                  duration-200
                  px-4 py-2 text-base
                  font-semibold rounded-md shadow
                  flex items-center
                "
              >
                Ver factura
              </a>
              {is_admin && (
                <Link href={route("admin.mantenimientos.edit", mantenimiento.id)}>
                  <Boton
                    texto="Editar"
                    color="blue"
                    tamaño="md"
                    icono={<Edit className="w-5 h-5" />}
                  />
                </Link>
              )}
            </div>
          </div>
          {/* Vehículo y cita */}
          <div className="mb-6 flex flex-wrap gap-6 justify-between bg-gradient-to-l from-pink-100 via-white to-blue-100 border-l-4 border-[#C42424] p-5 rounded-2xl shadow">
            <div>
              <div className="text-gray-800 font-bold text-lg">
                {vehiculo.marca} {vehiculo.modelo}
              </div>
              <div className="text-gray-500 font-mono mb-1">{vehiculo.matricula}</div>
              {vehiculo.vin && (
                <div className="text-gray-700 text-xs font-semibold">
                  <span className="uppercase text-[#C42424]">Bastidor:</span> {vehiculo.vin}
                </div>
              )}
            </div>
            <div className="text-[#C42424] font-semibold text-lg">
              {cita
                ? (
                    <>
                      Cita:{" "}
                      {cita.fecha
                        ? new Date(cita.fecha).toLocaleDateString("es-ES")
                        : ""}
                      {cita.hora && ` - ${cita.hora.slice(0, 5)}`}
                    </>
                  )
                : <span className="text-gray-400">Sin cita</span>
              }
            </div>
          </div>
          {/* Datos generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 mb-4">
            <div>
              <span className="block text-gray-500">Kilómetros</span>
              <span className="font-bold text-lg text-gray-900">{mantenimiento.kilometros} km</span>
            </div>
            <div>
              <span className="block text-gray-500">Próxima revisión</span>
              <span className="font-bold text-lg text-gray-900">{mantenimiento.prox_revision}</span>
            </div>
            <div>
              <span className="block text-gray-500">Mano de obra</span>
              <span className="font-bold text-lg text-gray-900">{Number(mantenimiento.mano_obra).toFixed(2)} €</span>
            </div>
          </div>
          {mantenimiento.observaciones && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-gray-800">
              <span className="font-semibold text-[#C42424]">Observaciones:</span> {mantenimiento.observaciones}
            </div>
          )}
          {/* Detalles/trabajos */}
          <div>
            <h2 className="text-xl font-extrabold text-[#C42424] mb-4 mt-8">Trabajos realizados</h2>
            <div className="space-y-3">
              {mantenimiento_detalles.length === 0 ? (
                <div className="text-gray-400 italic">No hay detalles para este mantenimiento.</div>
              ) : (
                mantenimiento_detalles.map((d, idx) => (
                  <div
                    key={d.id || idx}
                    className="bg-white border-l-4 border-[#C42424] shadow rounded-xl px-6 py-4 flex flex-col md:flex-row md:items-center gap-5"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-[#040A2A] text-lg">{d.tipo_mantenimiento?.nombre}</div>
                      {d.tipo_mantenimiento?.descripcion && (
                        <div className="text-gray-500 text-sm">{d.tipo_mantenimiento.descripcion}</div>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className={`font-semibold ${d.limpiar ? "text-green-600" : "text-gray-400"}`}>
                          {d.limpiar ? "✓ Limpiar" : "— Limpiar"}
                        </span>
                        <span className={`font-semibold ${d.revisar ? "text-green-600" : "text-gray-400"}`}>
                          {d.revisar ? "✓ Revisar" : "— Revisar"}
                        </span>
                        <span className={`font-semibold ${d.sustituir ? "text-green-600" : "text-gray-400"}`}>
                          {d.sustituir ? "✓ Sustituir" : "— Sustituir"}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg text-[#C42424] font-extrabold min-w-[90px] text-right">
                      {Number(d.precio).toFixed(2)} €
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* TOTAL */}
          <div className="mt-8 flex justify-end">
            <span className="text-2xl font-extrabold text-[#040A2A] bg-gray-100 py-2 px-6 rounded-lg shadow">
              Total: <span className="text-[#C42424]">{total.toFixed(2)} €</span>
            </span>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
