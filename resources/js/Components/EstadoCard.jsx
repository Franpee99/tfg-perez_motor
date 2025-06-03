import { CheckCircle, XCircle } from "lucide-react";

export default function EstadoCard({ estado, estado_cita }) {
  const nombre = estado_cita?.nombre || estado;
  if (nombre === "reservada")
    return (
      <span className="flex items-center gap-2 font-bold text-green-600">
        <CheckCircle className="w-6 h-6" /> Reservada
      </span>
    );
  if (nombre === "finalizada")
    return (
      <span className="flex items-center gap-2 font-bold text-blue-500">
        <CheckCircle className="w-6 h-6" /> Finalizada
      </span>
    );
  if (nombre === "cancelada")
    return (
      <span className="flex items-center gap-2 font-bold text-red-600">
        <XCircle className="w-6 h-6" /> Cancelada
      </span>
    );
  if (nombre === "disponible")
    return (
      <span className="flex items-center gap-2 font-bold text-gray-400">
        <CheckCircle className="w-6 h-6" /> Disponible
      </span>
    );
  return <span className="font-bold text-gray-500">{nombre}</span>;
}
