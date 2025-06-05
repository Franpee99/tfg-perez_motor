import Boton from "@/Components/Boton";

export default function ModalEditarCita({ abierta, cita, estados, onClose, onSubmit }) {
  if (!abierta || !cita) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-sm text-[#040A2A] relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-xl font-bold text-red-500"
          onClick={onClose}
          type="button"
        >×</button>
        <h2 className="text-xl font-bold mb-4 text-center">Editar cita</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              fecha: e.target.fecha.value,
              hora: e.target.hora.value,
              estado_cita_id: e.target.estado_cita_id.value,
            });
          }}
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Fecha:</label>
            <input
              type="date"
              name="fecha"
              defaultValue={cita.fecha}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Hora:</label>
            <input
              type="time"
              name="hora"
              defaultValue={cita.hora?.slice(0, 5)}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Estado:</label>
            <select
              name="estado_cita_id"
              defaultValue={cita.estado_cita_id || cita.estado_cita?.id}
              className="w-full border rounded px-2 py-1"
              required
            >
              {estados.map(estado => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 justify-end mt-8">
            <Boton texto="Cancelar" color="gray" onClick={onClose} tamaño="sm" />
            <Boton texto="Guardar cambios" color="blue" tamaño="sm" tipo="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
