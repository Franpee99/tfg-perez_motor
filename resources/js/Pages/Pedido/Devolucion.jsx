import AppLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Boton from "@/Components/Boton";

export default function Devolucion() {
  const { user, pedidos } = usePage().props;

  const [datos, setDatos] = useState({
    nombre: user.name,
    pedido: "",
    correo: user.email,
    telefono: user.telefono || "",
    motivo: "devolucion",
    mensaje: "",
    acepta: false,
  });

  const [errores, setErrores] = useState({});
  const [animarBarra, setAnimarBarra] = useState(false);

  useEffect(() => {
    const tiempo = setTimeout(() => setAnimarBarra(true), 300);
    return () => clearTimeout(tiempo);
  }, []);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // si es checkbox guarda true/false sino guarda value
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (!datos.pedido.trim()) nuevosErrores.pedido = "Debes seleccionar un pedido.";
    if (!datos.telefono.trim() || !/^[0-9]{9}$/.test(datos.telefono))
      nuevosErrores.telefono = "El teléfono debe tener 9 dígitos.";
    if (!datos.mensaje.trim()) nuevosErrores.mensaje = "El mensaje es obligatorio.";
    if (!datos.acepta) nuevosErrores.acepta = "Debes aceptar las condiciones.";

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) { // Lo convertimos en array para poder comparar
      router.post(route("devoluciones.formulario"), datos, {
        onSuccess: () => {
          setDatos({
            nombre: user.name,
            pedido: "",
            correo: user.email,
            telefono: "",
            motivo: "devolucion",
            mensaje: "",
            acepta: false,
          });
        },
      });
    }
  };

  return (
    <AppLayout>
      <section className="bg-[#040A2A] text-white py-10 px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10">SOLICITAR DEVOLUCIÓN</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? "w-full" : "w-0"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-10">
            {/* Formulario */}
            <form onSubmit={manejarEnvio} className="flex-1 min-w-[280px] space-y-4">
              <label className="block">
                Selecciona el pedido*
                <select
                  name="pedido"
                  value={datos.pedido}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                >
                  <option value="">Selecciona un pedido</option>
                  {pedidos.map((p) => (
                    <option key={p.id} value={p.numero_factura}>
                      Pedido #{p.numero_factura} - {p.created_at.slice(0, 10)} {/* -> mostrar año mes y dia */}
                    </option>
                  ))}
                </select>
                {errores.pedido && <p className="text-red-400 text-sm">{errores.pedido}</p>}
              </label>

              <label className="block">
                Teléfono*
                <input
                  type="tel"
                  name="telefono"
                  value={datos.telefono}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                />
                {errores.telefono && <p className="text-red-400 text-sm">{errores.telefono}</p>}
              </label>

              <label className="block">
                Mensaje*
                <textarea
                  name="mensaje"
                  value={datos.mensaje}
                  onChange={manejarCambio}
                  rows="5"
                  maxLength="150"
                  className="w-full px-3 mt-1 bg-gray-300 text-black resize-none"
                />
                {errores.mensaje && <p className="text-red-400 text-sm">{errores.mensaje}</p>}
              </label>

              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    name="acepta"
                    checked={datos.acepta}
                    onChange={manejarCambio}
                    className="mt-1"
                  />
                  <span className="text-sm">
                    Acepto recibir comunicaciones vía email y teléfono para atender a mi solicitud
                  </span>
                </label>
                {errores.acepta && <p className="text-red-400 text-sm">{errores.acepta}</p>}
              </div>

              <Boton
                tipo="submit"
                texto="ENVIAR"
                color="red"
                tamaño="md"
              />
            </form>

            {/* Información de contacto */}
            <div className="flex-1 min-w-[260px] relative space-y-3">
              <div
                className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center bg-contain opacity-10"
                style={{ backgroundImage: 'url(/images/perez-motor/LOGO.png)' }}
              ></div>
              <p className="flex items-center gap-2 z-10 relative">
                <FaMapMarkerAlt /> Pérez Motor
              </p>
              <p className="z-10 relative">C/ Tartaneros, 2</p>
              <p className="z-10 relative">11540 Sanlúcar de Bda, Cádiz</p>
              <p className="z-10 relative">info@perez-moto.com</p>

              <div className="pt-4 z-10 relative">
                <p className="font-bold">Horario tienda:</p>
                <p>Lu - Vi: 9h a 13h y 15:30h a 19:30h</p>
              </div>

              <div className="pt-4 z-10 relative">
                <p className="flex items-center gap-2 font-bold">
                  <FaPhoneAlt /> Llámanos:
                </p>
                <p>956 258 741</p>
                <p>Atención telefónica: Lu - Vi: 9h a 13h</p>
              </div>

              <div className="pt-4 z-10 relative">
                <p className="flex items-center gap-2 font-bold">
                  <FaWhatsapp /> WhatsApp:
                </p>
                <p>689 578 425</p>
                <p>Lu - Vi: 9h a 14h</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
