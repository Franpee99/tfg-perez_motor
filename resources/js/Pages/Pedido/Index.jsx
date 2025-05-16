import AppLayout from "@/Layouts/AuthenticatedLayout";
import Boton from "@/Components/Boton";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from "react";


export default function Index({ pedidos }) {

  const { post } = useForm();

  // Modal Cancelar
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const abrirModalCancelar = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    setMostrarModalCancelar(true);
  };

  const cancelarConfirmado = () => {
    if (pedidoSeleccionado) {
      post(route('pedidos.cancelar', pedidoSeleccionado));
      setMostrarModalCancelar(false);
    }
  };

  // Mensaje flash
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success || flash.error) {
      setMensaje(flash.success || flash.error);
      const timer = setTimeout(() => setMensaje(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <AppLayout>

      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center ${
            flash.success ? 'bg-[#040A2A]' : 'bg-red-600'
          }`}>
            <svg
              className="w-10 h-10 mb-2 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {mensaje}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#040A2A] mb-4 text-center">Mis Pedidos</h1>

      <div className="text-right mb-8">
        <Boton
          texto="Solicitar devolución"
          href={route('devoluciones.formulario')}
          color="primary"
          tamaño="md"
        />
      </div>

      <div className="relative max-w-xl mx-auto mb-10 flex items-center justify-between pt-6">
        <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-[88%] h-0.5 bg-[#040A2A] z-0" />
        {[
          { estado: "cancelado", color: "bg-red-600", label: "Cancelado" },
          { estado: "pendiente", color: "bg-gray-400", label: "Pendiente" },
          { estado: "procesado", color: "bg-yellow-400", label: "Procesado" },
          { estado: "enviado", color: "bg-blue-500", label: "Enviado" },
          { estado: "entregado", color: "bg-green-500", label: "Entregado" },
        ].map(({ estado, color, label }) => (
          <div key={estado} className="z-10 flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full ${color} shadow-md`} />
            <span className="mt-2 text-xs text-gray-600">{label}</span>
          </div>
        ))}
      </div>

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
                      : pedido.estado === 'pendiente'
                      ? 'bg-gray-400'
                      : 'bg-red-600'
                  }`} />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold text-[#040A2A]">Pedido #{pedido.numero_factura}</p>
                    <p>{new Date(pedido.created_at).toLocaleDateString()}</p>

                    {pedido.estado === 'cancelado' && (
                      <p className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1">
                        <FaTimesCircle className="text-red-600" />
                        Pedido cancelado
                      </p>
                    )}

                      {/* Estado de la devolución */}
                      {pedido.devoluciones?.length > 0 &&
                        (pedido.devoluciones.some(d => d.estado === "aprobada") ? (
                          <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <FaCheckCircle className="text-green-600" /> Devolución aprobada
                          </p>
                        ) : pedido.devoluciones.some(d => d.estado === "pendiente") ? (
                          <p className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                            <FaClock className="text-yellow-600" /> Solicitud de devolución pendiente
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <FaTimesCircle className="text-red-600" /> Devolución denegada
                          </p>
                        ))
                      }
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

                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm text-gray-600">
                    Total: <span className="font-bold text-[#040A2A]">{pedido.total} €</span>
                  </p>
                  <div className="flex flex-col items-end gap-2">
                    <Boton
                      texto="Ver detalles"
                      href={route('pedidos.show', pedido.id)}
                      color="blue"
                      tamaño="sm"
                    />
                    {(pedido.estado === 'pendiente' || pedido.estado === 'procesado') && (
                      <Boton
                        texto="Cancelar pedido"
                        onClick={() => abrirModalCancelar(pedido.id)}
                        color="red"
                        tamaño="sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModalCancelar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setMostrarModalCancelar(false)} // clic fuera -> cerrar modal
        >
          <div
            className="bg-[#040A2A] text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // clic dentro -> no cerrar
          >
            <svg
              className="w-10 h-10 mb-2 text-red-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-xl font-bold mb-2 text-center">¿Cancelar pedido?</h2>
            <p className="text-sm text-gray-200 text-center mb-6">
              Una vez cancelado, no se podrá deshacer esta acción
            </p>
            <div className="flex justify-center gap-4 w-full">
              <Boton
                texto="Cancelar"
                onClick={() => setMostrarModalCancelar(false)}
                color="gray"
                tamaño="sm"
              />
              <Boton
                texto="Sí, cancelar"
                onClick={cancelarConfirmado}
                color="red"
                tamaño="sm"
              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
