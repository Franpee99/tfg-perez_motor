import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import FichaTecnica from '@/Components/FichaTecnica';
import Boton from '@/Components/Boton';
import { useForm, usePage, router } from '@inertiajs/react';
import ReactStars from 'react-stars';
import Paginacion from '@/Components/Paginacion';

export default function Show({ producto }) {
  const imagenes = producto.imagenes || [];
  const fichaTecnica = producto.caracteristicas || [];
  const tallas = producto.tallas || [];

  const [imagenPrincipal, setImagenPrincipal] = useState(imagenes.length > 0 ? imagenes[0].ruta : null);
  const [tabActivo, setTabActivo] = useState('descripcion');

  /* Mensaje producto añadido */
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(flash.success || null);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  /* Manejo del carrito */
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

  const { post, setData, processing } = useForm({
    producto_id: producto.id,
    talla_id: '',
    cantidad: 1,
  });

  const handleInsertar = () => {
    if (!tallaSeleccionada) return;
    setData('talla_id', tallaSeleccionada.id);
    post(route('carrito.insertarLinea'), {
      preserveScroll: true,
      preserveState: false,
      onSuccess: () => {
      },
    });
  };
  /* */

  /* VALORACIÓN */
  const { auth, haComprado, valoracion, valoracionesPublicas } = usePage().props;

  const valoraciones = valoracionesPublicas?.data || [];

  const [errorEstrella, setErrorEstrella] = useState('');

  const {
    data: valoracionData,
    setData: setValoracionData,
    post: enviarValoracion,
    processing: procesandoValoracion
  } = useForm({
    estrella: valoracion?.estrella || '',
    comentario: valoracion?.comentario || '',
  });

  const [mostrarFormularioValoracion, setMostrarFormularioValoracion] = useState(false);
  const [mostrarModalValoracionEliminar, setMostrarModalValoracionEliminar] = useState(false);



  return (
    <AppLayout>
      <main className="max-w-[90vw] xl:max-w-6xl mx-auto overflow-x-hidden">

        {/* Mensaje de producto y valoracion añadido */}
        {mensaje && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
              <svg
                className="w-10 h-10 mb-2 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {mensaje}
            </div>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
          <div className="flex flex-col items-end">
            <h2 className="text-4xl font-bold self-start mb-6">{producto.nombre}</h2>
            {producto.marca?.nombre && (
              <div className="self-start mb-6 w-full flex justify-between items-center">
                <span className="inline-block text-sm text-gray-500 font-medium tracking-wide border border-gray-200 rounded-md px-3 py-1 bg-white shadow-sm hover:shadow-md transition">
                  {producto.marca.nombre}
                </span>

                {valoraciones.length > 0 && (
                  <div className="flex items-center">
                    <ReactStars
                      count={5}
                      value={valoraciones.reduce((acc, v) => acc + v.estrella, 0) / valoraciones.length}
                      size={25}
                      color2="#FACC15"
                      edit={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Galería */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex sm:flex-col gap-2 border p-2 rounded w-full sm:w-auto overflow-x-auto sm:overflow-x-visible">
                {imagenes.map((img, i) => (
                  <img
                    key={i}
                    src={`/storage/${img.ruta}`}
                    onClick={() => setImagenPrincipal(img.ruta)}
                    className="w-24 h-24 object-contain cursor-pointer hover:scale-105 duration-200"
                  />
                ))}
              </div>

              <picture className="flex-1">
                <img
                  src={`/storage/${imagenPrincipal}`}
                  alt={producto.nombre}
                  className="w-full h-auto drop-shadow-xl"
                />
              </picture>
            </div>

            {/* Tabs */}
            <div className="w-full mt-10 border rounded-lg bg-gray-100 shadow-lg">
              <div className="flex flex-col sm:flex-row">
                <Boton
                  texto="Descripción"
                  onClick={() => setTabActivo('descripcion')}
                  className={`flex-1 rounded-none ${tabActivo === 'descripcion' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
                <Boton
                  texto="Características"
                  onClick={() => setTabActivo('caracteristicas')}
                  className={`flex-1 rounded-none ${tabActivo === 'caracteristicas' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
                <Boton
                  texto="¿Tienes dudas?"
                  onClick={() => setTabActivo('dudas')}
                  className={`flex-1 rounded-none ${tabActivo === 'dudas' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'}`}
                  tamaño="md"
                />
              </div>
              <div className="p-6 text-gray-800 text-sm">
                {tabActivo === 'descripcion' && <p>{producto.descripcion}</p>}
                {tabActivo === 'caracteristicas' && (
                  <div>Falta por implementar</div>
                )}
                {tabActivo === 'dudas' && (
                  <div>
                    <details className="mb-2">
                      <summary className="font-semibold cursor-pointer">¿Cómo puedo realizar un cambio?</summary>
                      <p className="pl-4 mt-2">Puedes hacerlo fácilmente desde tu perfil o escribiéndonos.</p>
                    </details>
                    <details className="mb-2">
                      <summary className="font-semibold cursor-pointer">¿Qué pasa si el producto llega dañado?</summary>
                      <p className="pl-4 mt-2">Contáctanos en menos de 7 días y lo solucionamos.</p>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Derecha: Precio, tallas, añadir a la cesta */}
          <div className="flex flex-col items-center py-12">
            <table className="w-full max-w-md border text-center mb-8">
              <tbody>
                <tr>
                  <td className="text-5xl font-bold py-4">{producto.precio}€</td>
                </tr>
                <tr>
                  <td className="border-t text-green-600 font-semibold py-2">
                    <p>Envío GRATIS</p>
                    <p>Precio mínimo garantizado</p>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Tallas disponibles */}
            <h2 className="text-xl font-semibold mb-2">ELIGE TU TALLA</h2>
            <div className="w-full max-w-md flex flex-wrap gap-2 justify-center mb-6">
              {tallas.map(t => (
                <div key={t.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (t.pivot?.stock === 0) return; // No permitir seleccionar tallas agotadas
                      if (tallaSeleccionada?.id === t.id) {
                        setTallaSeleccionada(null);
                        setData('talla_id', '');
                      } else {
                        setTallaSeleccionada(t);
                        setData('talla_id', t.id);
                      }
                    }}
                    disabled={t.pivot?.stock === 0}
                    className={`px-6 py-2 border text-lg cursor-pointer rounded transition ${
                      tallaSeleccionada?.id === t.id
                        ? 'bg-red-800 text-white'
                        : t.pivot?.stock === 0
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'hover:bg-red-400 hover:text-white'
                    }`}
                  >
                    {t.nombre}
                  </button>
                  {t.pivot?.stock === 0 && (
                    <span className="text-xs text-red-600 mt-1">Stock agotado</span>
                  )}
                </div>
              ))}
            </div>

            <Boton
              texto="AÑADIR A LA CESTA"
              color="green"
              tamaño="lg"
              className="w-full max-w-md"
              onClick={handleInsertar}
              disabled={!tallaSeleccionada || processing}
            />

            {/* Ficha técnica */}
            <div className="mt-12 w-full max-w-xl">
              <FichaTecnica fichaTecnica={fichaTecnica} />
            </div>
          </div>
        </section>

        {(valoraciones.length > 0 || (auth?.user && haComprado)) && (
          <div className="w-full max-w-3xl mx-auto py-16 border-t">
            <h2 className="text-2xl font-semibold mb-6 text-center">Opiniones de clientes</h2>

            {haComprado && (
              <div className="mb-10">
                <Boton
                  texto={mostrarFormularioValoracion ? 'Ocultar valoración' : (valoracion ? 'Editar tu valoración' : 'Valorar producto')}
                  tipo="button"
                  color="blue"
                  tamaño="md"
                  className="mb-4 mx-auto block"
                  onClick={() => setMostrarFormularioValoracion(prev => !prev)}
                />

                {mostrarFormularioValoracion && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();

                      if (!valoracionData.estrella) {
                        setErrorEstrella('Debes seleccionar una valoración en estrellas.');
                        return;
                      }
                      setErrorEstrella('');

                      enviarValoracion(route('productos.valorar', producto.id), {
                        preserveScroll: true,
                        preserveState: false,
                      });
                    }}
                    className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-lg border"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                      {valoracion ? 'Editar tu valoración' : 'Valora este producto'}
                    </h3>

                    <div>
                      <label className="block mb-1 font-medium text-gray-600">Estrellas*</label>
                      <ReactStars
                        count={5}
                        value={valoracionData.estrella}
                        onChange={(nuevoValor) => setValoracionData('estrella', nuevoValor)}
                        size={32}
                        color1="#E5E7EB"
                        color2="#FACC15"
                        half={false}
                      />
                      {errorEstrella && (
                        <p className="text-red-500 text-sm mt-1">{errorEstrella}</p>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">Comentario</label>
                      <textarea
                        value={valoracionData.comentario}
                        onChange={(e) => setValoracionData('comentario', e.target.value)}
                        rows="4"
                        className="w-full border px-3 py-2 rounded focus:border-[#040A2A] focus:ring-[#040A2A] focus:outline-none"
                        placeholder="¿Qué te ha parecido el producto?"
                      />
                    </div>

                    <Boton
                      texto={valoracion ? 'Actualizar valoración' : 'Publicar valoración'}
                      tipo="submit"
                      color="blue"
                      tamaño="md"
                      disabled={procesandoValoracion}
                    />

                    {valoracion && (
                      <Boton
                        texto="Eliminar valoración"
                        tipo="button"
                        color="red"
                        tamaño="md"
                        className="w-fit mt-2"
                        onClick={() => setMostrarModalValoracionEliminar(true)}
                      />
                    )}
                  </form>
                )}
              </div>
            )}

          {valoraciones.length > 0 && (
            <>
              {/* Mostrar valoracion del usuario logeado primero */}
              {valoracion && (
              <div className="mb-8">
                <div className="bg-white border-2 border-[#040A2A] shadow p-6 rounded-xl relative">
                  <div className="absolute bottom-0 right-0 bg-[#040A2A] text-white text-xs font-semibold px-3 py-1 rounded-tl-xl">
                    Tu valoración
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#040A2A]">{auth.user.name} (Tú)</span>
                    <span className="text-sm text-gray-400">
                      {new Date(valoracion.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <ReactStars
                      count={5}
                      value={valoracion.estrella}
                      size={24}
                      color2="#FACC15"
                      edit={false}
                    />
                  </div>
                  {valoracion.comentario && (
                    <p className="text-gray-800">{valoracion.comentario}</p>
                  )}
                </div>
              </div>
            )}


              <ul className="space-y-8">
                {valoraciones
                .filter(v => v.user.id !== auth?.user?.id)
                .map((v, index) => (
                  <li key={index} className="bg-white shadow-md p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">
                        {v.user.name}
                        {v.user.id === auth?.user?.id && <span> (Tú)</span>}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(v.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center mb-2">
                      <ReactStars
                        count={5}
                        value={v.estrella}
                        size={24}
                        color2="#FACC15"
                        edit={false}
                      />
                    </div>

                    {v.comentario && (
                      <p className="text-gray-700">{v.comentario}</p>
                    )}
                  </li>
                ))}
              </ul>

              <Paginacion links={valoracionesPublicas.links} />
            </>
          )}
          </div>
        )}

        {mostrarModalValoracionEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-[#040A2A] text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
              <svg
                className="w-10 h-10 mb-2 text-red-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <h2 className="text-xl font-bold mb-2 text-center">¿Eliminar valoración?</h2>
              <p className="text-sm text-gray-200 text-center mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-4 w-full">
                <Boton
                  texto="Cancelar"
                  onClick={() => setMostrarModalValoracionEliminar(false)}
                  color="gray"
                  tamaño="sm"
                />
                <Boton
                  texto="Eliminar"
                  onClick={() => {
                    router.delete(route('productos.eliminarValoracion', producto.id), {
                      preserveScroll: true,
                      preserveState: false,
                      onSuccess: () => setMostrarModalValoracionEliminar(false),
                    });
                  }}
                  color="red"
                  tamaño="sm"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
