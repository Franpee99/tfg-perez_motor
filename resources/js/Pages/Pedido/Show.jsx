import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";

export default function Show({ pedido }) {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Pedido #{pedido.id}
          </h1>

          <Boton
            texto="Volver a mis pedidos"
            href={route('pedidos.index')}
            color="primary"
            tamaño="md"
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <p><span className="font-bold text-gray-700">Estado:</span> <span className="capitalize">{pedido.estado}</span></p>
          <p><span className="font-bold text-gray-700">Fecha:</span> {new Date(pedido.created_at).toLocaleDateString()}</p>
          <p><span className="font-bold text-gray-700">Total:</span> {pedido.total} €</p>
          <a
            href={route('factura.ver', pedido.id)}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              bg-[#040A2A]
              text-white
              border border-[#040A2A]
              hover:bg-red-600
              hover:text-white
              hover:border-red-600
              transition
              duration-200
              px-4 py-2 text-base
              font-semibold rounded-md shadow
               mt-6 inline-block
            `}
          >
            Ver factura
          </a>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Productos:</h2>

        <div className="space-y-4">
          {pedido.detalles.map(detalle => (
            <div key={detalle.id} className="border rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-all">
              {detalle.producto?.imagenes?.[0]?.ruta && (
                <img
                  src={`/storage/${detalle.producto.imagenes[0].ruta}`}
                  alt={detalle.producto.nombre}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">{detalle.producto?.nombre || 'Producto eliminado'}</p>
                <p className="text-gray-600 text-sm">Marca: {detalle.producto.marca?.nombre || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Talla: {detalle.talla?.nombre || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Cantidad: {detalle.cantidad}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">{detalle.precio} €</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
