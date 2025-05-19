import { useRef, useEffect } from "react";

export default function TopVentas({ productosTop }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.offsetWidth / 1.2;
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const intervalo = setInterval(() => {
      const alFinal =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;

      if (alFinal) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const scrollAmount = slider.offsetWidth / 1.2;
        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }, 7000); // tiempo aqui

    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="my-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#040A2A]">TOP VENTAS</h2>
      </div>

      <div className="h-1 bg-[#C42424] max-w-6xl mx-auto rounded-full mb-8" />

      <div className="relative max-w-6xl mx-auto">
        {productosTop.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-lg">
            Aún no hay productos vendidos.
          </div>
        ) : (
          <div className="relative">
            {/* Flecha izquierda */}
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#040A2A]/80 text-white hover:bg-[#C42424] transition p-2 rounded-full"
            >
              &#10094;
            </button>

            {/* Carrusel */}
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 sm:px-6 pb-4 scrollbar-hide"
            >
              {productosTop.map((producto) => (
                <div
                  key={producto.id}
                  className="flex-none w-[220px] bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition-all duration-300 snap-start"
                >
                  <a href={route("tienda.show", producto.id)}>
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
              onClick={() => scroll("right")}
              className="hidden sm:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#040A2A]/80 text-white hover:bg-[#C42424] transition p-2 rounded-full"
            >
              &#10095;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
