import Boton from "@/Components/Boton";
import AppLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ pedidos }) {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Historial de Pedidos
        </h1>

        {pedidos.length === 0 ? (
          <p className="text-center text-gray-600">No has realizado ningún pedido aún.</p>
        ) : (
          <div className="grid gap-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="border rounded-lg shadow hover:shadow-lg p-6 transition-all">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="space-y-2">
                    <p><span className="font-bold text-gray-700">Nº Pedido:</span> #{pedido.id}</p>
                    <p><span className="font-bold text-gray-700">Fecha:</span> {new Date(pedido.created_at).toLocaleDateString()}</p>
                    <p><span className="font-bold text-gray-700">Estado:</span> <span className="capitalize">{pedido.estado}</span></p>
                    <p><span className="font-bold text-gray-700">Total:</span> {pedido.total} €</p>
                    <p><span className="font-bold text-gray-700">Productos:</span> {pedido.detalles_count}</p>
                  </div>

                  <div className="mt-4 md:mt-0">
                  <Boton
                    texto="Ver detalles"
                    href={route('pedidos.show', pedido.id)}
                    color="primary"
                    tamaño="md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
