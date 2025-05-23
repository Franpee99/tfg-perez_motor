import Boton from "@/Components/Boton";

export default function ModalEliminar({
  abierta,
  onClose,
  onConfirm,
  icono,
  titulo = "¿Eliminar elemento?",
  descripcion = "¿Seguro que quieres eliminar este elemento?",
  textoCancelar = "Cancelar",
  textoConfirmar = "Sí, eliminar",
  colorFondo = "#040A2A",
  colorTexto = "white"
}) {
  if (!abierta) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center`}
        style={{ backgroundColor: colorFondo, color: colorTexto }}
        onClick={e => e.stopPropagation()}
      >
        {icono && <div className="mb-3">{icono}</div>}
        <h2 className="text-xl font-bold mb-2 text-center">{titulo}</h2>
        <p className="text-sm text-gray-200 text-center mb-6">
          {descripcion}
        </p>
        <div className="flex justify-center gap-4 w-full">
          <Boton
            texto={textoCancelar}
            onClick={onClose}
            color="gray"
            tamaño="sm"
          />
          <Boton
            texto={textoConfirmar}
            onClick={onConfirm}
            color="red"
            tamaño="sm"
          />
        </div>
      </div>
    </div>
  );
}
