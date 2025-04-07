import React from 'react';
import AppLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ lineasCarrito }) {

  return (
    <AppLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tu carrito</h1>

        {lineasCarrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {lineasCarrito.map(linea => (
              <div
                key={linea.id}
                className="bg-white border shadow-sm rounded p-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">{linea.producto.nombre}</h2>
                  <p className="text-sm text-gray-600">Talla: {linea.talla.nombre}</p>
                  <p className="text-sm text-gray-600">Cantidad: {linea.cantidad}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
