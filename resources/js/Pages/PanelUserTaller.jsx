import AppLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import { FaCalendarCheck, FaCalendarPlus, FaMotorcycle } from "react-icons/fa";
import { Link } from '@inertiajs/react';

const PanelUserTaller = () => {
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(tiempo);
  }, []);

  const secciones = [
    {
      nombre: 'Mis citas',
      ruta: route('citas.misCitas'),
      icono: FaCalendarCheck,
      color: 'bg-blue-600',
    },
    {
      nombre: 'Coger cita',
      ruta: route('user.reservar'),
      icono: FaCalendarPlus,
      color: 'bg-green-600',
    },
    {
      nombre: 'Mis vehículos',
      ruta: route('vehiculos.index'),
      icono: FaMotorcycle,
      color: 'bg-red-600',
    },
  ];

  return (
    <AppLayout>
      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10 uppercase tracking-wide">Panel del Taller</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {secciones.map((sec) => (
              <Link
                href={sec.ruta}
                key={sec.nombre}
                className={`
                  group bg-white text-[#040A2A] border border-white/60 rounded-2xl p-10
                  flex flex-col items-center justify-center shadow-lg transition duration-200 ease-in-out
                  hover:bg-[#C42424] hover:text-white hover:border-[#C42424] hover:scale-105 cursor-pointer
                  min-h-[200px]
                `}
              >
                <div className={`rounded-full mb-6 flex items-center justify-center ${sec.color} w-20 h-20 group-hover:bg-white transition-colors duration-200`}>
                  <sec.icono className="w-10 h-10 text-white group-hover:text-[#C42424] transition-colors duration-200" />
                </div>
                <span className="text-2xl font-bold text-center">{sec.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default PanelUserTaller;
