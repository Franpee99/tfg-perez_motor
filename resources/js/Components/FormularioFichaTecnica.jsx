import React from "react";

export default function FormularioFichaTecnica({ fichaTecnica, addCaracteristica, updateCaracteristica, removeCaracteristica, errorFichaTecnica }) {
  return (
    <div>
      <label className="block text-gray-700 font-semibold mb-2">
        Características (Ficha Técnica)
      </label>
      {fichaTecnica.map((carac, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Ej: Identificador"
            value={carac.key}
            onChange={(e) => updateCaracteristica(index, "key", e.target.value)}
            className="border p-2 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="Ej: 5114552"
            value={carac.value}
            onChange={(e) => updateCaracteristica(index, "value", e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <button
            type="button"
            onClick={() => removeCaracteristica(index)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            ❌
          </button>
        </div>
      ))}
      {errorFichaTecnica && typeof errorFichaTecnica === "string" && (
        <p className="text-red-500 text-sm mt-1">{errorFichaTecnica}</p>
      )}
      <button
        type="button"
        onClick={addCaracteristica}
        className="bg-green-500 text-white p-2 rounded"
      >
        + Agregar característica
      </button>
    </div>
  );
}
