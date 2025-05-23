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
    blue: "bg-blue-700 hover:bg-blue-800",
    red: "bg-red-600 hover:bg-red-800",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-500 hover:bg-gray-600",
    primary: `
      bg-[#040A2A]
      text-white
      border border-[#040A2A]
      hover:bg-red-600
      hover:text-white
      hover:border-red-600
      transition
      duration-200`,
  };

  const tamaños = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Agregar clases para botones absolutos
  const clasesBase = `text-white font-semibold rounded-md shadow transition ${colores[color]} ${tamaños[tamaño]} disabled:opacity-50 ${className} ${absolute ? `absolute ${posicion}` : ""}`;

  const contenido = (
    <span className={icono && texto ? "flex items-center justify-center gap-2" : ""}>
      {texto}
      {icono}
    </span>
  );

  // Si el botón tiene un `href`, renderizar como `<Link>`
  if (href) {
    return (
      <Link href={href} className={clasesBase}>
        {contenido}
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
      {enProceso && cargandoTexto ? cargandoTexto : contenido}
    </button>
  );
}
