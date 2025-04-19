import AppLayout from '@/Layouts/AuthenticatedLayout';
import React, { useEffect, useState } from 'react';

export default function QuienesSomos() {
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <section className="bg-[#040A2A] text-white py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 relative">
            <h1 className="text-2xl md:text-3xl font-bold relative w-fit z-10">
              QUIÉNES SOMOS
            </h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="md:w-2/3 text-sm md:text-base leading-relaxed space-y-5 text-left">
              <p>
                En <strong>Pérez Motor</strong> somos líderes en la distribución de equipación de moto a nivel europeo. Pero, por encima de todo, en Pérez Motor somos unos apasionados de la velocidad y todo lo que se mueve sobre ruedas. Y de esta pasión hemos hecho nuestro trabajo.
              </p>
              <p>
                Acumulamos más de 40 años de experiencia en el sector: empezamos en 1982, en el Principado de Andorra, y actualmente ¡ya disponemos de 22 tiendas repartidas entre España, Andorra, Portugal e Italia!
              </p>
              <p>
                En España, tenemos 15 tiendas situadas en ubicaciones estratégicas como Madrid, Barcelona, Badalona, Granollers, Solsona, Valencia, Málaga, Sevilla, Palma de Mallorca y Zaragoza. En 2024 hemos ampliado nuestra red con dos nuevas aperturas: Alcalá de Henares y Gran Canaria, siendo esta última nuestra primera tienda en las Islas Canarias.
              </p>
              <p>
                Contamos también con 3 tiendas en Andorra, un referente en equipamiento motorista, y hemos extendido nuestra presencia internacional con 2 tiendas en Portugal (en Lisboa y Oporto) y 2 tiendas en Italia, una en Castelfranco-Veneto y la tienda Motorama en Florencia.
              </p>
              <p>
                Además, disponemos de la tienda online PérezMotor.com para prestar servicio a cualquier aficionado allá donde se encuentre.
              </p>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <img
                src="/images/perez-motor/tienda.jpg"
                alt="Tienda Pérez Motor"
                className="rounded-xl w-full max-w-[650px] h-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
