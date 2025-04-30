import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";

export default function Index({ pedidos }) {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-[#040A2A] mb-10 text-center">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <p className="text-center text-gray-500">No has realizado ningún pedido aún.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white shadow-md rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between transition hover:shadow-lg"
              >
                {/* Estado del pedido */}
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`w-4 h-4 rounded-full ${
                    pedido.estado === 'entregado'
                      ? 'bg-green-500'
                      : pedido.estado === 'enviado'
                      ? 'bg-blue-500'
                      : pedido.estado === 'procesado'
                      ? 'bg-yellow-400'
                      : 'bg-gray-400'
                  }`} />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-[#040A2A]">Pedido #{pedido.id}</p>
                    <p>{new Date(pedido.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Imagenes de productos*/}
                <div className="flex -space-x-3 mb-4 sm:mb-0">
                  {pedido.detalles.slice(0, 5).map((detalle) => (
                    detalle.producto?.imagenes?.[0]?.ruta && (
                      <img
                        key={detalle.id}
                        src={`/storage/${detalle.producto.imagenes[0].ruta}`}
                        alt={detalle.producto.nombre}
                        className="w-10 h-10 object-cover border-2 border-white rounded-full shadow-sm"
                      />
                    )
                  ))}
                  {pedido.detalles.length > 5 && (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-sm text-gray-600 rounded-full border-2 border-white shadow-sm">
                      +{pedido.detalles.length - 5}
                    </div>
                  )}
                </div>

                <div className="text-right space-y-2">
                  <p className="text-sm text-gray-600">
                    Total: <span className="font-bold text-[#040A2A]">{pedido.total} €</span>
                  </p>
                  <Boton
                    texto="Ver detalles"
                    href={route('pedidos.show', pedido.id)}
                    color="primary"
                    tamaño="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
