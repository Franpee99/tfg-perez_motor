import React from "react";
import Boton from "./Boton";

export default function FormularioTallas({ listaTallas, agregarTalla, actualizarTalla, eliminarTalla, errorTallas }) {
  return (
    <div>
      <label className="block text-white font-semibold">Tallas y Cantidad en Stock</label>
      {listaTallas.map((talla, index) => (
        <div key={index} className="flex gap-2 items-center mb-2">
          <input
            type="text"
            placeholder="Ej: M, L, XL"
            value={talla.nombre}
            onChange={(e) => actualizarTalla(index, "nombre", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={talla.stock}
            onChange={(e) => actualizarTalla(index, "stock", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <Boton
            texto="X"
            onClick={() => eliminarTalla(index)}
            color="red"
            tamaño="sm"
            titulo="Eliminar talla"
          />
        </div>
      ))}
      {errorTallas && typeof errorTallas === "string" && (
        <p className="text-red-500 text-sm mt-1">{errorTallas}</p>
      )}
      <Boton
        texto="+ Agregar Talla"
        onClick={agregarTalla}
        color="green"
        tamaño="md"
        titulo="Agregar una nueva talla"
      />
    </div>
  );
}
