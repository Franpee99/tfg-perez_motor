import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Checkout({ total, cerrar }) {
  const [mostrarModal, setMostrarModal] = useState(true);
  const [mostrarGracias, setMostrarGracias] = useState(false);
  const [mostrarErrorPago, setMostrarErrorPago] = useState(false);
  const [mensajeErrorPago, setMensajeErrorPago] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=ASKGIAcYiR2zLlcl4IYwDw-RA2c-azeVUlIR3Ji644kIiSt1qadC7h-Ui6yT48uFM7cdwj7KbsDkOmPd&currency=EUR";

    script.addEventListener('load', () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: total }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            console.log('Pago exitoso (detalles):', details);

            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            //details.status = 'ERROR_SIMULADO';

            fetch('/pagos/paypal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                orderID: data.orderID,
                detalles: details,
                captureID: details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null
              })
            })
              .then(async res => {
                if (!res.ok) {
                  const error = await res.json();
                  throw new Error(error.mensaje || 'Pago fallido');
                }
                return res.json();
              })
              .then(() => {
                setMostrarModal(false);
                setMostrarGracias(true);
              })
              .catch(async error => {
                const mensaje = error.message || 'Error desconocido';
                console.error('Error en pago:', mensaje);
                setMensajeErrorPago(mensaje);
                setMostrarErrorPago(true);
              });
          });
        }
      }).render('#paypal-modal-container');
    });

    document.body.appendChild(script);
  }, [total]);

  useEffect(() => {
    if (mostrarGracias) {
      const tiempo = setTimeout(() => {
        router.visit('/pedidos');
      }, 3000);
      return () => clearTimeout(tiempo);
    }
  }, [mostrarGracias]);

  useEffect(() => {
    if (mostrarErrorPago) {
      const tiempo = setTimeout(() => {
        setMostrarErrorPago(false);
        setMostrarModal(false);
      }, 3000);
      return () => clearTimeout(tiempo);
    }
  }, [mostrarErrorPago]);

  return (
    <>
      {/* Fondo modal */}
      {mostrarModal && ( // si mostrarModal es true lo mostramos
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={cerrar} // cerrar al hacer clic fuera
        >
          <div
            className="bg-gray-50 rounded-lg shadow-xl p-8 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // no cerrar si hago click en el modal
          >
            <button
              onClick={cerrar}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
              aria-label="Cerrar"
            >
              x
            </button>

            <h2 className="text-2xl font-bold text-[#040A2A] mb-4">Finalizar compra</h2>
            <p className="text-gray-700 mb-4">
              Total a pagar: <span className="font-semibold">{total} €</span>
            </p>
            <div id="paypal-modal-container" className="p-4 border rounded bg-white"></div>
          </div>
        </div>
      )}

      {/* Mensaje de agradecimiento */}
      {mostrarGracias && (
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
            ¡Gracias por tu compra!
          </div>
        </div>

      )}{/* Mensaje de error de pago */}
      {mostrarErrorPago && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              {mensajeErrorPago || 'ERROR EN EL PAGO'}
          </div>
        </div>
      )}
    </>
  );
}
