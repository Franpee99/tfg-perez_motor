import { useEffect, useRef, useState } from "react";

export default function Carrusel({ imagenes = [], intervaloMs = 5000 }) {
  const [indice, setIndice] = useState(0);
  const intervaloRef = useRef(null);

  useEffect(() => {
    if (imagenes.length > 0) {
      iniciarCarrusel();
    }
    return () => clearInterval(intervaloRef.current);
  }, [imagenes]);

  const iniciarCarrusel = () => {
    clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, intervaloMs);
  };

  const cambiarIndice = (nuevo) => {
    setIndice(nuevo);
    iniciarCarrusel();
  };

  if (imagenes.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100 text-gray-500">
        No hay imágenes para mostrar
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[60vh] overflow-hidden relative">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {imagenes.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Imagen ${i + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
        {imagenes.map((_, i) => (
          <span
            key={i}
            onClick={() => cambiarIndice(i)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all ${
              i === indice ? "bg-red-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
