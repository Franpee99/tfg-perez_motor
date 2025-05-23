import AppLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import { FaTruck, FaUndoAlt, FaPlus, FaList, FaTools } from "react-icons/fa";
import { Link } from '@inertiajs/react';

const PanelAdmin = () => {
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(tiempo);
  }, []);

  const secciones = [
    {
    nombre: 'Ver productos',
    ruta: route('productos.index'),
    icono: FaList,
    },
    {
      nombre: 'Añadir producto',
      ruta: route('productos.create'),
      icono: FaPlus,
    },
    {
      nombre: 'Gestión de Pedidos',
      ruta: route('admin.pedidos.index'),
      icono: FaTruck,
    },
    {
      nombre: 'Solicitudes de Devolución',
      ruta: route('admin.devoluciones.index'),
      icono: FaUndoAlt,
    },
    {
      nombre: 'Gestión del taller',
      ruta: route('admin.citas.index'),
      icono: FaTools,
    },
  ];

  return (
    <AppLayout>
      <section className="bg-[#040A2A] min-h-screen py-16 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10 uppercase tracking-wide">Panel de Administración</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            {secciones.map((sec) => (
              <Link
                href={sec.ruta}
                key={sec.nombre}
                className={`
                  group bg-white text-[#040A2A] border border-white/60 rounded-2xl p-8
                  flex flex-col items-center justify-center shadow-lg transition duration-200 ease-in-out
                  hover:bg-[#C42424] hover:text-white hover:border-[#C42424] hover:scale-105 cursor-pointer
                `}
              >
                <sec.icono className="w-10 h-10 mb-4 text-[#040A2A] group-hover:text-white transition-colors duration-200" />
                <span className="text-xl font-bold text-center">{sec.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default PanelAdmin;
