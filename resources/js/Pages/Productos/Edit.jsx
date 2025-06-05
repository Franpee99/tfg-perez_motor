import React from "react";
import AppLayout from "@/Layouts/AuthenticatedLayout";
import FormularioEditarProducto from "@/Components/FormularioEditarProducto";

export default function EditarProductoPage({ producto, categorias, marcas }) {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto bg-[#040A2A] p-8 rounded-lg shadow-lg mt-10">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Editar Producto</h1>
        <FormularioEditarProducto producto={producto} categorias={categorias} marcas={marcas} />
      </div>
    </AppLayout>
  );
}
