import Carrusel from "@/Components/Carrusel";
import TopVentas from "@/Components/TopVentas";
import NovedadesPorCategoria from '@/Components/NovedadesPorCategoria';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import MarcasDestacadas from "@/Components/MarcasDestacadas";

const imagenesCarrusel = [
  "/storage/Dashboard/carrusel/img-carrusel1.webp",
  "/storage/Dashboard/carrusel/img-carrusel2.webp",
  "/storage/Dashboard/carrusel/img-carrusel3.webp",
];

export default function Dashboard({ productosTop = [], novedadesPorCategoria = [] }) {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      <main className="flex flex-col">
        <Carrusel imagenes={imagenesCarrusel} intervaloMs={5000} />

        <section className="bg-gradient-to-b from-[#040A2A] via-[#3a4a6a] to-white py-10">
        <h2 className="text-center text-3xl text-white font-bold mb-10">¡EQUÍPATE!</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
            {[
              { nombre: "Cascos", src: "/storage/Dashboard/seccion_casco.jpg", slug: "cascos" },
              { nombre: "Chaquetas", src: "/storage/Dashboard/seccion_chaqueta.jpg", slug: "chaquetas" },
              { nombre: "Guantes", src: "/storage/Dashboard/seccion_guantes.jpg", slug: "guantes" },
              { nombre: "Pantalones", src: "/storage/Dashboard/secion_pantalones.jpg", slug: "pantalones" },
              { nombre: "Botas", src: "/storage/Dashboard/seccion_botas.jpg", slug: "botas" },
            ].map((item) => (
              <Link
                key={item.nombre}
                href={route("tienda.index", item.slug)}
                className="group relative w-full aspect-square rounded-lg overflow-hidden transition-transform transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <img
                  src={item.src}
                  alt={item.nombre}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:brightness-75"
                />
                <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg drop-shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:text-red-500">
                  {item.nombre}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="my-20">
          <TopVentas productosTop={productosTop} />

          <MarcasDestacadas />

          <NovedadesPorCategoria novedadesPorCategoria={novedadesPorCategoria} />
        </section>



      </main>
    </AuthenticatedLayout>
  );
}
