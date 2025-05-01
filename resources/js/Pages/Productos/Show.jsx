import AppLayout from "@/Layouts/AuthenticatedLayout";
import TarjetaProducto from "@/Components/TarjetaProducto";
import TablaStock from "@/Components/TablaStock";
import FichaTecnica from "@/Components/FichaTecnica";
import Imagenes from "@/Components/Imagenes";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";


export default function Show({ producto }) {
  // Aseguramos que ficha tecnica y tallas sean arrays
  const fichaTecnica = producto.caracteristicas || [];
  const tallas = producto.tallas || [];

  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(flash.success || null);

    useEffect(() => {
      if (mensaje) {
        const timer = setTimeout(() => {
          setMensaje(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [mensaje]);

  return (
    <AppLayout>
      {/* Mensaje flash */}
      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
            <svg
              className="w-10 h-10 mb-2 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {mensaje}
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Tarjeta del Producto */}
        <TarjetaProducto producto={producto} />

        {/* Sección de Imágenes */}
        <h2 className="text-2xl font-semibold mb-2 mt-8">Imágenes</h2>
        <Imagenes imagenes={producto.imagenes} />

        {/* Tabla de Stock por Tallas */}
        <TablaStock tallas={tallas} />

        {/* Ficha Técnica */}
        <FichaTecnica fichaTecnica={fichaTecnica} />
      </div>
    </AppLayout>
  );
}
