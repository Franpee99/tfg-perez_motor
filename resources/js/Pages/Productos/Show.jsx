// Pages/Productos/Show.jsx
import AppLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import TarjetaProducto from "@/Components/TarjetaProducto";
import TablaStock from "@/Components/TablaStock";
import FichaTecnica from "@/Components/FichaTecnica";

export default function Show({ producto }) {
  // Aseguramos que ficha_tecnica y tallas sean arrays
  const fichaTecnica = producto.ficha_tecnica || [];
  const tallas = producto.tallas || [];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Tarjeta del Producto */}
        <TarjetaProducto producto={producto} />

        {/* Tabla de Stock por Tallas */}
        <TablaStock tallas={tallas} />

        {/* Ficha Técnica */}
        <FichaTecnica fichaTecnica={fichaTecnica} />

      </div>
    </AppLayout>
  );
}
