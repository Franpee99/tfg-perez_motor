import AppLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Contacto = () => {
  const [datos, setDatos] = useState({
    nombre: "",
    pedido: "",
    correo: "",
    telefono: "",
    motivo: "",
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
    setDatos((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!datos.correo.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(datos.correo)) {
      nuevosErrores.correo = "Introduce un correo válido.";
    }

    if (!/^[0-9]{9}$/.test(datos.telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener 9 dígitos.";
    }

    if (!datos.motivo.trim()) {
      nuevosErrores.motivo = "Selecciona un motivo.";
    }

    if (!datos.mensaje.trim()) {
      nuevosErrores.mensaje = "El mensaje es obligatorio.";
    }

    if (!datos.acepta) {
      nuevosErrores.acepta = "Debes aceptar las condiciones.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
        console.log("Formulario enviado:", datos); // Simulamos el envio por ahora
    }
  };

  return (
    <AppLayout>
      <section className="bg-[#040A2A] text-white py-10 px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold relative w-fit z-10">CONTÁCTANOS</h1>
            <div className="relative mt-2">
              <div
                className={`h-[4px] bg-red-600 rounded-full transition-all duration-1000 ease-out ${
                  animarBarra ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-10">
            {/* Formulario */}
            <form onSubmit={manejarEnvio} className="flex-1 min-w-[280px] space-y-4">
              <label className="block">
                Nombre y Apellidos*
                <input
                  type="text"
                  name="nombre"
                  value={datos.nombre}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                />
                {errores.nombre && <p className="text-red-400 text-sm">{errores.nombre}</p>}
              </label>

              <label className="block">
                Número de pedido
                <input
                  type="text"
                  name="pedido"
                  value={datos.pedido}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                />
              </label>

              <label className="block">
                Email*
                <input
                  type="email"
                  name="correo"
                  value={datos.correo}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                />
                {errores.correo && <p className="text-red-400 text-sm">{errores.correo}</p>}
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
                Motivo*
                <select
                  name="motivo"
                  value={datos.motivo}
                  onChange={manejarCambio}
                  className="w-full h-10 px-3 mt-1 bg-gray-300 text-black"
                >
                  <option value="">Selecciona un motivo</option>
                  <option value="devolucion">Devolución</option>
                  <option value="pago_plazos">Pago a plazos</option>
                  <option value="otro">Otro</option>
                </select>
                {errores.motivo && <p className="text-red-400 text-sm">{errores.motivo}</p>}
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
                    Acepto recibir comunicaciones vía email y teléfono para atender a mi consulta
                  </span>
                </label>
                {errores.acepta && <p className="text-red-400 text-sm">{errores.acepta}</p>}
              </div>

              <button
                type="submit"
                className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded"
              >
                ENVIAR
              </button>
            </form>

            {/* Información de contacto */}
            <div className="flex-1 min-w-[260px] relative space-y-3">
              <div className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-center bg-contain opacity-10" style={{ backgroundImage: 'url(/images/perez-motor/LOGO.png)' }}></div>
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
};

export default Contacto;
