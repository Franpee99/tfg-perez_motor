import AppLayout from "@/Layouts/AuthenticatedLayout";
import { useForm, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import Boton from "@/Components/Boton";
import { Plus, X } from "lucide-react";

export default function Create({ vehiculo, cita, tiposMantenimiento }) {
  const [tipos, setTipos] = useState(tiposMantenimiento);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState({ nombre: "", descripcion: "" });
  const [tipoError, setTipoError] = useState("");
  const [creandoTipo, setCreandoTipo] = useState(false);
  const [ultimoDetalleSeleccionado, setUltimoDetalleSeleccionado] = useState(null);

  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success) setMensaje(flash.success);
  }, [flash.success]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
        router.visit(route("admin.mantenimiento.edit", mantenimiento.id));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Form principal
  const { data, setData, post, processing, errors, reset } = useForm({
    vehiculo_id: vehiculo.id,
    cita_taller_id: cita.id,
    kilometros: "",
    observaciones: "",
    prox_revision: "",
    mano_obra: "",
    detalles: [],
  });

  // Calcular total
  const totalDetalles = data.detalles.reduce((sum, d) => sum + Number(d.precio || 0), 0);
  const total = totalDetalles + Number(data.mano_obra || 0);

  // Detalles
  const agregarDetalle = () => {
    setData("detalles", [
      ...data.detalles,
      {
        tipo_mantenimiento_id: "",
        limpiar: false,
        revisar: false,
        sustituir: false,
        precio: 0,
      },
    ]);
    setUltimoDetalleSeleccionado(data.detalles.length);
  };
  const eliminarDetalle = (i) => {
    const arr = [...data.detalles];
    arr.splice(i, 1);
    setData("detalles", arr);
  };

  // Modal nuevo tipo
  const abrirModal = (idx = null) => {
    setUltimoDetalleSeleccionado(idx ?? data.detalles.length - 1);
    setModalAbierto(true);
    setNuevoTipo({ nombre: "", descripcion: "" });
    setTipoError("");
  };
  const cerrarModal = () => {
    setModalAbierto(false);
    setNuevoTipo({ nombre: "", descripcion: "" });
    setTipoError("");
  };

  // Crear tipo
  const crearTipoMantenimiento = async (e) => {
    e.preventDefault();
    setTipoError("");
    if (!nuevoTipo.nombre.trim()) {
      setTipoError("El nombre es obligatorio");
      return;
    }
    setCreandoTipo(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
      const res = await fetch("/admin/tipos-mantenimiento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(nuevoTipo),
      });

      if (res.ok) {
        const tipo = await res.json();
        setTipos([...tipos, tipo]);
        setNuevoTipo({ nombre: "", descripcion: "" });

        // Selecciona en el último detalle creado
        if (
          data.detalles.length &&
          ultimoDetalleSeleccionado !== null &&
          ultimoDetalleSeleccionado < data.detalles.length
        ) {
          const detalles = [...data.detalles];
          detalles[ultimoDetalleSeleccionado].tipo_mantenimiento_id = tipo.id;
          setData("detalles", detalles);
        }
        cerrarModal();
      } else if (res.status === 422) {
        const json = await res.json();
        setTipoError(json.errors?.nombre?.[0] || "Error desconocido");
      } else {
        setTipoError("No se pudo crear el tipo. Inténtalo de nuevo.");
      }
    } catch {
      setTipoError("Error de conexión.");
    }
    setCreandoTipo(false);
  };

  // Form principal
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("admin.mantenimientos.store"), {
      onSuccess: () => reset(),
    });
  };

  // Modal refocus
  const inputRef = useRef();
  if (modalAbierto && inputRef.current && false) {
    setTimeout(() => inputRef.current.focus(), 150);
  }

  return (
    <AppLayout>
      {mensaje && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center pointer-events-auto">
            <svg
              className="w-10 h-10 mb-2 text-green-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {mensaje}
            <span className="mt-2 text-xs text-gray-300">
              Serás redirigido automáticamente
            </span>
          </div>
        </div>
      )}

      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-3xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-10 border border-gray-100 relative">
          <h1 className="text-3xl font-black text-[#141b3a] mb-8 flex items-center gap-4">
            <Plus className="w-7 h-7 text-[#C42424]" /> Nuevo mantenimiento
          </h1>

          {/* Datos de vehículo/cita */}
          <div className="mb-6 flex flex-wrap gap-6 justify-between bg-gradient-to-l from-pink-100 via-white to-blue-100 border-l-4 border-[#C42424] p-5 rounded-2xl shadow">
            <div>
              <div className="text-gray-800 font-bold text-lg">
                {vehiculo.marca} {vehiculo.modelo}
              </div>
              <div className="text-gray-500 font-mono mb-1">{vehiculo.matricula}</div>
              {vehiculo.vin && (
                <div className="text-gray-700 text-xs font-semibold">
                  <span className="uppercase text-[#C42424]">Bastidor:</span> {vehiculo.vin}
                </div>
              )}
            </div>
            <div className="text-[#C42424] font-semibold text-lg">
              Cita: {cita.fecha} - {cita.hora?.slice(0, 5)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-gray-700 font-bold">Kilómetros *</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C42424] bg-white/90 font-semibold shadow text-gray-900"
                  required
                  value={data.kilometros}
                  onChange={e => setData("kilometros", e.target.value)}
                  min={0}
                />
                {errors.kilometros && <span className="text-red-600">{errors.kilometros}</span>}
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-bold">Próxima revisión</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C42424] bg-white/90 font-semibold shadow text-gray-900"
                  value={data.prox_revision}
                  onChange={e => setData("prox_revision", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-bold">Observaciones</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C42424] bg-white/90 font-semibold shadow resize-none text-gray-900"
                value={data.observaciones}
                onChange={e => setData("observaciones", e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-bold">Mano de obra (€) *</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#C42424] bg-white/90 font-semibold shadow text-gray-900"
                required
                value={data.mano_obra}
                onChange={e => setData("mano_obra", e.target.value)}
                min={0}
                step="0.01"
              />
              {errors.mano_obra && <span className="text-red-600">{errors.mano_obra}</span>}
            </div>

            {/* Detalles */}
            <div>
              <div className="flex items-center justify-between mt-8 mb-3">
                <h2 className="text-xl font-extrabold text-[#C42424] tracking-tight">Detalles del mantenimiento</h2>
                <Boton
                  texto="Añadir detalle"
                  color="red"
                  tamaño="sm"
                  onClick={agregarDetalle}
                  icono={<Plus className="w-5 h-5" />}
                />
              </div>
              <div className="space-y-4">
                {data.detalles.length === 0 && (
                  <div className="text-gray-400 italic">Añade al menos un detalle.</div>
                )}
                {data.detalles.map((detalle, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 shadow rounded-xl px-4 py-4 flex flex-col md:flex-row items-center gap-6 relative"
                  >
                    <Boton
                      tipo="button"
                      color="gray"
                      tamaño="xs"
                      className="absolute top-2 right-2"
                      onClick={() => eliminarDetalle(i)}
                      icono={<X className="w-5 h-5" />}
                      texto=""
                    />
                    <div className="flex-1 w-full">
                      <div className="flex gap-2 items-center">
                        <select
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C42424] bg-white/90 font-semibold shadow text-gray-900"
                          required
                          value={detalle.tipo_mantenimiento_id}
                          onChange={e => {
                            const detalles = [...data.detalles];
                            detalles[i].tipo_mantenimiento_id = e.target.value;
                            setData("detalles", detalles);
                            setUltimoDetalleSeleccionado(i);
                          }}
                        >
                          <option value="" className="text-gray-900">Tipo de mantenimiento...</option>
                          {tipos.map(tipo => (
                            <option key={tipo.id} value={tipo.id} className="text-gray-900">
                              {tipo.nombre}
                            </option>
                          ))}
                        </select>
                        <Boton
                          tipo="button"
                          color="red"
                          tamaño="xs"
                          onClick={() => abrirModal(i)}
                          icono={<Plus className="w-4 h-4" />}
                          texto=""
                          className="ml-1"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
                      <label className="flex items-center gap-1 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={detalle.limpiar}
                          onChange={e => {
                            const detalles = [...data.detalles];
                            detalles[i].limpiar = e.target.checked;
                            setData("detalles", detalles);
                          }}
                        />
                        Limpiar
                      </label>
                      <label className="flex items-center gap-1 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={detalle.revisar}
                          onChange={e => {
                            const detalles = [...data.detalles];
                            detalles[i].revisar = e.target.checked;
                            setData("detalles", detalles);
                          }}
                        />
                        Revisar
                      </label>
                      <label className="flex items-center gap-1 font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={detalle.sustituir}
                          onChange={e => {
                            const detalles = [...data.detalles];
                            detalles[i].sustituir = e.target.checked;
                            setData("detalles", detalles);
                          }}
                        />
                        Sustituir
                      </label>
                      <input
                        type="number"
                        className="rounded-lg border border-gray-300 px-3 py-1 w-32 focus:border-[#C42424] bg-white/90 font-semibold shadow text-gray-900"
                        min={0}
                        step={0.01}
                        placeholder="Precio (€)"
                        value={detalle.precio}
                        onChange={e => {
                          const detalles = [...data.detalles];
                          detalles[i].precio = e.target.value;
                          setData("detalles", detalles);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-8 flex justify-end">
              <span className="text-2xl font-extrabold text-[#040A2A] bg-gray-100 py-2 px-6 rounded-lg shadow">
                Total: <span className="text-[#C42424]">{total.toFixed(2)} €</span>
              </span>
            </div>

            <div className="mt-8 flex justify-end">
              <Boton
                texto={processing ? "Guardando..." : "Guardar mantenimiento"}
                color="green"
                tamaño="lg"
                tipo="submit"
                className="px-8 py-3"
                disabled={processing}
              />
            </div>
          </form>
        </div>

        {/* MODAL para crear tipo */}
        {modalAbierto && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={cerrarModal}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-7 relative animate-fadeIn"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700 rounded-full focus:outline-none transition"
                onClick={cerrarModal}
                tabIndex={-1}
                style={{ fontSize: 20, lineHeight: 1 }}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
              <form onSubmit={crearTipoMantenimiento} className="space-y-4">
                <h3 className="text-xl font-extrabold text-[#C42424] mb-2">Nuevo tipo de mantenimiento</h3>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow focus:border-[#C42424] font-semibold text-gray-900"
                  placeholder="Nombre"
                  value={nuevoTipo.nombre}
                  onChange={e => setNuevoTipo({ ...nuevoTipo, nombre: e.target.value })}
                  ref={inputRef}
                  disabled={creandoTipo}
                  required
                />
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow focus:border-[#C42424] font-semibold resize-none text-gray-900"
                  placeholder="Descripción"
                  value={nuevoTipo.descripcion}
                  onChange={e => setNuevoTipo({ ...nuevoTipo, descripcion: e.target.value })}
                  disabled={creandoTipo}
                  rows={2}
                />
                {tipoError && <div className="text-red-600 text-sm">{tipoError}</div>}
                <Boton
                  tipo="submit"
                  texto={creandoTipo ? "Creando..." : "Crear tipo"}
                  color="blue"
                  tamaño="md"
                  className="w-full"
                  disabled={creandoTipo}
                  icono={creandoTipo ? <Plus className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                />
              </form>
            </div>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
