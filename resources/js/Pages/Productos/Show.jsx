import AppLayout from "@/Layouts/AuthenticatedLayout";
import TarjetaProducto from "@/Components/TarjetaProducto";
import TablaStock from "@/Components/TablaStock";
import FichaTecnica from "@/Components/FichaTecnica";
import Imagenes from "@/Components/Imagenes";

export default function Show({ producto }) {
  // Aseguramos que ficha tecnica y tallas sean arrays
  const fichaTecnica = producto.caracteristicas || [];
  const tallas = producto.tallas || [];

  return (
    <AppLayout>
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
