import { FaMotorcycle, FaEdit, FaTrashAlt, FaRegIdCard } from "react-icons/fa";
import Boton from "@/Components/Boton";

export default function VehiculoCard({ vehiculo, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-200 p-6 relative flex flex-col gap-2">
      <span className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-xl rounded-tr-2xl px-4 py-1 text-xs font-bold shadow">
        <FaRegIdCard className="inline mr-1" />
        {vehiculo.matricula}
      </span>
      <div className="flex items-center gap-3 mb-3">
        <FaMotorcycle className="text-3xl text-[#040A2A]" />
        <span className="text-2xl font-semibold text-[#040A2A]">
          {vehiculo.marca} {vehiculo.modelo}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-gray-700 mb-3">
        <div>
          <span className="block font-bold text-xs text-[#040A2A]">Año</span>
          <span>{vehiculo.anio || <span className="text-gray-400">-</span>}</span>
        </div>
        <div>
          <span className="block font-bold text-xs text-[#040A2A]">Color</span>
          <span>{vehiculo.color || <span className="text-gray-400">-</span>}</span>
        </div>
        <div>
          <span className="block font-bold text-xs text-[#040A2A]">Cilindrada</span>
          <span>{vehiculo.cilindrada || <span className="text-gray-400">-</span>}</span>
        </div>
        <div>
          <span className="block font-bold text-xs text-[#040A2A]">VIN</span>
          <span className="break-all">{vehiculo.vin || <span className="text-gray-400">-</span>}</span>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-auto">
        <Boton
          onClick={onEditar}
          color="blue"
          tamaño="md"
          icono={<FaEdit />}
        />
        <Boton
          onClick={onEliminar}
          color="red"
          tamaño="sm"
          icono={<FaTrashAlt />}
        />
      </div>
    </div>
  );
}
