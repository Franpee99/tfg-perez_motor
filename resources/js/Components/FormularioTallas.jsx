import React from "react";

export default function FormularioTallas({ tallas, addTalla, updateTalla, removeTalla, errorTallas }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold">Tallas y Stock</label>
      {tallas.map((talla, index) => (
        <div key={index} className="flex gap-2 items-center mb-2">
          <input
            type="text"
            placeholder="Talla"
            value={talla.nombre}
            onChange={(e) => updateTalla(index, "nombre", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={talla.stock}
            onChange={(e) => updateTalla(index, "stock", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <button
            type="button"
            onClick={() => removeTalla(index)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            ❌
          </button>
        </div>
      ))}
      {errorTallas && typeof errorTallas === "string" && (
        <p className="text-red-500 text-sm mt-1">{errorTallas}</p>
      )}
      <button
        type="button"
        onClick={addTalla}
        className="mt-2 bg-green-500 text-white p-2 rounded"
      >
        + Agregar Talla
      </button>
    </div>
  );
}
