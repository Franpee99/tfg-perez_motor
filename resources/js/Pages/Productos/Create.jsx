import AppLayout from "@/Layouts/AuthenticatedLayout";
import FormularioCrearProducto from "@/Components/FormularioCrearProducto";

export default function Create({ categorias = [], marcas = [] }) {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto bg-[#040A2A] rounded-lg shadow-lg mt-10 pt-10">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          Añadir Producto
        </h1>
        <FormularioCrearProducto categorias={categorias} marcas={marcas} />
      </div>
    </AppLayout>
  );
}
