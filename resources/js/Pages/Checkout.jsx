import { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Checkout({ total }) {
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

            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch('/pagos/paypal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
              },
              credentials: 'same-origin',
              body: JSON.stringify({
                orderID: data.orderID,
                detalles: details
              })
            })
              .then(res => res.json())
              .then(res => {
                console.log('Backend respondió:', res);
                alert('Pago simulado exitoso');
              })
              .catch(error => {
                console.error('Error comunicando con el backend:', error);
                alert('Error al procesar el pago.');
              });

          });
        }
      }).render('#paypal-button-container');
    });

    document.body.appendChild(script);
  }, [total]);

  return (
    <div className="p-8">
      <Head title="Pago" />
      <h1 className="text-2xl font-bold mb-4">Total a pagar: {total} €</h1>
      <div id="paypal-button-container"></div>
    </div>
  );
}
