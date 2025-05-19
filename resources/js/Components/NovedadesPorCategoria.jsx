import { useRef, useEffect } from "react";

export default function UltimasNovedades({ novedadesPorCategoria }) {
  return (
    <section className="my-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#040A2A]">ÚLTIMAS NOVEDADES</h2>
      </div>

      {/* Línea roja principal */}
      <div className="h-1 bg-[#C42424] max-w-6xl mx-auto rounded-full mb-6" />

      {novedadesPorCategoria.map((categoria) => {
        const productos = categoria.subcategorias
          .flatMap((subcategoria) => subcategoria.productos)
          .slice(0, 10);

        if (productos.length === 0) return null;

        const carruselRef = useRef(null);

        const desplazar = (direccion) => {
          const carrusel = carruselRef.current;
          if (!carrusel) return;

          const cantidad = carrusel.offsetWidth / 1.2;
          carrusel.scrollBy({
            left: direccion === "left" ? -cantidad : cantidad,
            behavior: "smooth",
          });
        };

        useEffect(() => {
          const carrusel = carruselRef.current;
          if (!carrusel) return;

          const intervalo = setInterval(() => {
            const alFinal =
              carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 5;

            if (alFinal) {
              carrusel.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              const cantidad = carrusel.offsetWidth / 1.2;
              carrusel.scrollBy({ left: cantidad, behavior: "smooth" });
            }
          }, 10000);

          return () => clearInterval(intervalo);
        }, []);

        return (
          <div key={categoria.id} className="mb-16">
            {/* Título de categoría */}
            <div className="mb-4 max-w-6xl mx-auto px-2 sm:px-6">
            <div className="text-center w-32">
              <h3 className="text-2xl font-semibold text-[#040A2A]">{categoria.nombre}</h3>
              <div className="h-0.5 w-full bg-[#C42424] mt-2 rounded-full" />
            </div>
          </div>

            <div className="relative max-w-6xl mx-auto">
              {/* Flecha izquierda */}
              <button
                onClick={() => desplazar("left")}
                className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#040A2A]/80 text-white hover:bg-[#C42424] transition p-2 rounded-full"
              >
                &#10094;
              </button>

              {/* Carrusel */}
              <div
                ref={carruselRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 sm:px-6 pb-4 scrollbar-hide"
              >
                {productos.map((producto) => (
                  <div
                    key={producto.id}
                    className="flex-none w-[220px] bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-all duration-300 snap-start"
                  >
                    <a href={`/producto/${producto.id}`}>
                      {producto.imagenes?.[0] && (
                        <div className="w-full h-[160px] flex items-center justify-center mb-3">
                          <img
                            src={`/storage/${producto.imagenes[0].ruta}`}
                            alt={producto.nombre}
                            className="max-h-full object-contain"
                          />
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-[#040A2A] truncate">
                        {producto.nombre}
                        </h3>

                        {producto.marca?.nombre && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                            {producto.marca.nombre}
                        </p>
                        )}
                      <div className="mt-2">
                        <span className="text-red-600 font-bold text-xl">
                          {producto.precio} €
                        </span>
                      </div>

                      <div className="mt-3 text-center">
                        <span className="inline-block px-4 py-1 text-sm font-semibold text-white bg-[#C42424] rounded-full hover:bg-red-700 transition">
                          Ver producto
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              {/* Flecha derecha */}
              <button
                onClick={() => desplazar("right")}
                className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#040A2A]/80 text-white hover:bg-[#C42424] transition p-2 rounded-full"
              >
                &#10095;
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
