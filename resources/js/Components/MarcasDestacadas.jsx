import { Link } from "@inertiajs/react";

const marcas = [
  {
    nombre: "Givi",
    imagen: "/storage/Dashboard/marcasDestacadas/alpinestart.avif",
  },
  {
    nombre: "Shark",
    imagen: "/storage/Dashboard/marcasDestacadas/shark.avif",
  },
  {
    nombre: "HJC",
    imagen: "/storage/Dashboard/marcasDestacadas/HJC.avif",
  },
  {
    nombre: "Armure",
    imagen: "/storage/Dashboard/marcasDestacadas/armure.avif",
  },
];

export default function MarcasDestacadas() {
  return (
    <section className="my-20 text-center">
      <h2 className="text-3xl font-bold text-[#040A2A] mb-6">
        MARCAS DESTACADAS
      </h2>
      <div className="h-1 bg-[#C42424] max-w-6xl mx-auto rounded-full mb-6" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {marcas.map((marca) => (
          <Link
            key={marca.nombre}
            href={route("tienda.index", {
              categoria: "Cascos",
              "marcas[]": marca.nombre, // pasarlo como array a laravel
            })}
            className="relative group overflow-hidden rounded-lg shadow"
          >
            <img
              src={marca.imagen}
              alt={marca.nombre}
              className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {marca.nombre}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
