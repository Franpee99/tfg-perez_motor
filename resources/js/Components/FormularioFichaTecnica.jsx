import React from "react";
import Boton from "./Boton";


export default function FormularioFichaTecnica({ listaFichaTecnica, agregarCaracteristica, actualizarCaracteristica, eliminarCaracteristica, errorCaracteristicas }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Características del Producto (Ficha Técnica)
      </label>
      {listaFichaTecnica.map((caracteristica, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Ej: Color, Material"
            value={caracteristica.caracteristica}
            onChange={(e) => actualizarCaracteristica(index, "caracteristica", e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="Ej: Rojo, Cuero"
            value={caracteristica.definicion}
            onChange={(e) => actualizarCaracteristica(index, "definicion", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
           <Boton
            texto="X"
            onClick={() => eliminarCaracteristica(index)}
            color="red"
            tamaño="sm"
            titulo="Eliminar Característica"
          />
        </div>
      ))}
      {errorCaracteristicas && typeof errorCaracteristicas === "string" && (
        <p className="text-red-500 text-sm mt-1">{errorCaracteristicas}</p>
      )}
        <Boton
        texto="+ Agregar Característica"
        onClick={agregarCaracteristica}
        color="green"
        tamaño="md"
        titulo="Agregar una nueva característica"
      />
    </div>
  );
}
