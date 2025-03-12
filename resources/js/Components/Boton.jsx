import React from "react";
import { Link } from "@inertiajs/react";

export default function Boton({
  texto,
  onClick,
  href = null,
  tipo = "button",
  color = "blue",
  tamaño = "md",
  disabled = false,
  cargandoTexto = null,
  enProceso = false,
  className = "",
  icono = null,
  absolute = false,
  posicion = "top-0 right-0"
}) {

    const colores = {
    blue: "bg-blue-500 hover:bg-blue-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  const tamaños = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Agregar clases para botones absolutos
  const clasesBase = `text-white font-semibold rounded-md shadow transition ${colores[color]} ${tamaños[tamaño]} disabled:opacity-50 ${className} ${absolute ? `absolute ${posicion}` : ""}`;

  // Si el botón tiene un `href`, renderizar como `<Link>` de Inertia.js
  if (href) {
    return (
      <Link href={href} className={clasesBase}>
        {icono ? icono : texto}
      </Link>
    );
  }

  // Renderizar como botón normal
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={disabled || enProceso}
      className={clasesBase}
    >
      {enProceso && cargandoTexto ? cargandoTexto : icono ? icono : texto}
    </button>
  );
}
