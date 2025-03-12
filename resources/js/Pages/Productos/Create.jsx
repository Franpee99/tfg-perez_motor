import AppLayout from "@/Layouts/AuthenticatedLayout";
import FormularioCrearProducto from "@/Components/FormularioCrearProducto";

export default function Create({ categorias = [], marcas = [] }) {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Crear Producto
        </h1>
        <FormularioCrearProducto categorias={categorias} marcas={marcas} />
      </div>
    </AppLayout>
  );
}
