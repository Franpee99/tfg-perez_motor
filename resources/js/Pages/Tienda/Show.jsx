import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import FichaTecnica from '@/Components/FichaTecnica';
import Boton from '@/Components/Boton';

export default function Show() {
  const { producto } = usePage().props;
  const imagenes = producto.imagenes || [];
  const fichaTecnica = producto.caracteristicas || [];
  const tallas = producto.tallas || [];
  const [imagenPrincipal, setImagenPrincipal] = useState(imagenes[0]);
  const [tabActivo, setTabActivo] = useState('descripcion');

  return (
    <AppLayout>
      <main className="max-w-[90vw] xl:max-w-6xl mx-auto overflow-x-hidden">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          {/* Izquierda: Galería e info */}
          <div className="flex flex-col items-end">
            <h2 className="text-4xl font-bold self-start mb-6">{producto.nombre}</h2>

            {/* Galería */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex sm:flex-col gap-2 border p-2 rounded w-full sm:w-auto overflow-x-auto sm:overflow-x-visible">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={`/storage/${img}`}
                    onClick={() => setImagenPrincipal(img)}
                    className="w-24 h-24 object-contain cursor-pointer hover:scale-105 duration-200"
                  />
                ))}
              </div>

              <picture className="flex-1">
                <img
                  src={`/storage/${imagenPrincipal}`}
                  alt={producto.nombre}
                  className="w-full h-auto drop-shadow-xl"
                />
              </picture>
            </div>

            {/* Tabs */}
            <div className="w-full mt-10 border rounded-lg bg-gray-100 shadow-lg">
              <div className="flex flex-col sm:flex-row">
                <Boton
                  texto="Descripción"
                  onClick={() => setTabActivo('descripcion')}
                  className={`flex-1 rounded-none ${tabActivo === 'descripcion' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
                <Boton
                  texto="Características"
                  onClick={() => setTabActivo('caracteristicas')}
                  className={`flex-1 rounded-none ${tabActivo === 'caracteristicas' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
                <Boton
                  texto="¿Tienes dudas?"
                  onClick={() => setTabActivo('dudas')}
                  className={`flex-1 rounded-none ${tabActivo === 'dudas' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
              </div>
              <div className="p-6 text-gray-800 text-sm">
                {tabActivo === 'descripcion' && (
                  <p>{producto.descripcion}</p>
                )}
                {tabActivo === 'caracteristicas' && (
                  <div>
                    // Falta por implementar algo aqui
                  </div>
                )}
                {tabActivo === 'dudas' && (
                  <div>
                    <details className="mb-2">
                      <summary className="font-semibold cursor-pointer">¿Cómo puedo realizar un cambio?</summary>
                      <p className="pl-4 mt-2">Puedes hacerlo fácilmente desde tu perfil o escribiéndonos.</p>
                    </details>
                    <details className="mb-2">
                      <summary className="font-semibold cursor-pointer">¿Qué pasa si el producto llega dañado?</summary>
                      <p className="pl-4 mt-2">Contáctanos en menos de 7 días y lo solucionamos.</p>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Derecha: Precio, tallas y ficha técnica */}
          <div className="flex flex-col items-center py-12">
            <table className="w-full max-w-md border text-center mb-8">
              <tbody>
                <tr>
                  <td className="text-5xl font-bold py-4">{producto.precio}€</td>
                </tr>
                <tr>
                  <td className="border-t text-green-600 font-semibold py-2">
                    <p>Envío GRATIS</p>
                    <p>Precio mínimo garantizado</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2">ELIGE TU TALLA</h2>
            <form className="w-full max-w-md flex flex-wrap gap-2 justify-center mb-6">
              {tallas.map(t => (
                <input
                  key={t.id}
                  type="button"
                  value={t.nombre}
                  className="px-6 py-2 border text-lg hover:bg-red-800 hover:text-white cursor-pointer"
                />
              ))}
            </form>

            <Boton
              texto="AÑADIR A LA CESTA"
              color="green"
              tamaño="lg"
              className="w-full max-w-md"
            />

            <div className="mt-12 w-full max-w-xl">
              <FichaTecnica fichaTecnica={fichaTecnica} />
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
