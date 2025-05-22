import AppLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import { router, usePage } from '@inertiajs/react';

const campos = [
  { nombre: 'marca', label: 'Marca*', requerido: true },
  { nombre: 'modelo', label: 'Modelo*', requerido: true },
  { nombre: 'cilindrada', label: 'Cilindrada', requerido: false },
  { nombre: 'matricula', label: 'Matrícula*', requerido: true },
  { nombre: 'anio', label: 'Año', requerido: false },
  { nombre: 'color', label: 'Color', requerido: false },
  { nombre: 'vin', label: 'VIN (Nº bastidor)', requerido: false }
];

export default function Create() {
  const [datos, setDatos] = useState({
    marca: '',
    modelo: '',
    cilindrada: '',
    matricula: '',
    anio: '',
    color: '',
    vin: ''
  });
  const [errores, setErrores] = useState({});
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 200);
    return () => clearTimeout(tiempo);
  }, []);

  const validar = () => {
    const nuevosErrores = {};

    if (!datos.marca.trim()) nuevosErrores.marca = "La marca es obligatoria.";
    if (!datos.modelo.trim()) nuevosErrores.modelo = "El modelo es obligatorio.";
    if (!datos.matricula.trim()) nuevosErrores.matricula = "La matrícula es obligatoria.";
    if (datos.anio && (datos.anio < 1900 || datos.anio > (new Date().getFullYear() + 1))) {
      nuevosErrores.anio = "El año debe ser válido.";
    }
    return nuevosErrores;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatos(anterior => ({
      ...anterior,
      [name]: name === "matricula" ? value.toUpperCase() : value
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      router.post(route('vehiculos.store'), datos, {
        onError: (errors) => setErrores(errors),
      });
    }
  };

    // FLASH MODAL
    const { flash = {} } = usePage().props;
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
      if (flash.success || flash.error) {
        setMensaje(flash.success || flash.error);
        const timer = setTimeout(() => {
            setMensaje(null);
            router.visit(route('vehiculos.index'));
        }, 2500);

        return () => clearTimeout(timer);
      }
    }, [flash]);

  return (
    <AppLayout>
        {mensaje && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center ${
                flash.success ? 'bg-[#040A2A]' : 'bg-red-600'
            }`}>
                <svg
                className="w-10 h-10 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                >
                {flash.success ? (
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    className="text-green-400"
                    />
                ) : (
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                    className="text-red-400"
                    />
                )}
                </svg>
                {mensaje}
            </div>
            </div>
        )}

      <section className="bg-[#040A2A] text-white py-12 px-4 min-h-screen flex items-center">
        <div className="max-w-3xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-8 relative">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#040A2A] relative w-fit z-10">Registrar vehículo</h1>
            <div className="relative mt-2">
              <div className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${animarBarra ? 'w-full' : 'w-0'}`} />
            </div>
            <p className="mt-3 text-gray-700 text-sm">Rellena los datos de tu moto o vehículo. Solo los campos obligatorios (<span className="text-red-600">*</span>) son necesarios.</p>
          </div>

          <form onSubmit={manejarEnvio} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <label className="block font-semibold text-[#040A2A]">
                Marca*
                <input
                  type="text"
                  name="marca"
                  value={datos.marca}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                />
                {errores.marca && <p className="text-red-500 text-xs">{errores.marca}</p>}
              </label>

              <label className="block font-semibold text-[#040A2A]">
                Modelo*
                <input
                  type="text"
                  name="modelo"
                  value={datos.modelo}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                />
                {errores.modelo && <p className="text-red-500 text-xs">{errores.modelo}</p>}
              </label>

              <label className="block font-semibold text-[#040A2A]">
                Matrícula*
                <input
                  type="text"
                  name="matricula"
                  value={datos.matricula}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded uppercase"
                  autoComplete="off"
                />
                {errores.matricula && <p className="text-red-500 text-xs">{errores.matricula}</p>}
              </label>

              <label className="block font-semibold text-[#040A2A]">
                Cilindrada
                <input
                  type="text"
                  name="cilindrada"
                  value={datos.cilindrada}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                />
                {errores.cilindrada && <p className="text-red-500 text-xs">{errores.cilindrada}</p>}
              </label>
            </div>

            <div className="space-y-5">
              <label className="block font-semibold text-[#040A2A]">
                Año
                <input
                  type="number"
                  name="anio"
                  value={datos.anio}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                {errores.anio && <p className="text-red-500 text-xs">{errores.anio}</p>}
              </label>

              <label className="block font-semibold text-[#040A2A]">
                Color
                <input
                  type="text"
                  name="color"
                  value={datos.color}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                />
                {errores.color && <p className="text-red-500 text-xs">{errores.color}</p>}
              </label>

              <label className="block font-semibold text-[#040A2A]">
                VIN (Nº bastidor)
                <input
                  type="text"
                  name="vin"
                  value={datos.vin}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-200 text-black rounded"
                  autoComplete="off"
                />
                {errores.vin && <p className="text-red-500 text-xs">{errores.vin}</p>}
              </label>
            </div>

            <div className="md:col-span-2 mt-8">
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 transition font-bold text-lg w-full py-3 rounded text-white shadow"
              >
                Registrar vehículo
              </button>
            </div>
          </form>
        </div>
      </section>
    </AppLayout>
  );
}
