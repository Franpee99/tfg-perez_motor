import React from "react";

export default function Imagenes({ imagenes }) {
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay imágenes disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {imagenes.map((imagen, index) => (
        <img
          key={index}
          src={`/storage/${imagen}`}
          alt={`Imagen ${index + 1}`}
          className="w-full h-64 object-cover rounded-lg"
        />
      ))}
    </div>
  );
}
