import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function DevolucionAdmin({ devoluciones }) {
  const { flash } = usePage().props;
  const [mensaje, setMensaje] = useState(flash.success || null);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const actualizarEstado = (id, estado) => {
    router.put(route("admin.devoluciones.update", id), { estado });
  };

  const columnas = [
    {
      name: "Fecha solicitud",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) =>
        new Date(row.created_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
    {
      name: "Usuario",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono,
    },
    {
      name: "Pedido",
      selector: (row) => row.pedido?.numero_factura || "N/A",
      sortable: true,
      wrap: true,
    },
    {
      name: "Motivo",
      selector: (row) => row.motivo,
      wrap: true,
    },
    {
      name: "Mensaje",
      selector: (row) => row.mensaje,
      wrap: true,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      cell: (row) => (
        <span
          className={`capitalize font-semibold ${
            row.estado === "pendiente"
              ? "text-yellow-600"
              : row.estado === "aprobada"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {row.estado}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex flex-col gap-2 items-center pt-1 pb-1">
          <Boton
            texto="Aprobar"
            onClick={() => actualizarEstado(row.id, "aprobada")}
            tamaño="sm"
            color="green"
          />
          <Boton
            texto="Denegar"
            onClick={() => actualizarEstado(row.id, "denegada")}
            tamaño="sm"
            color="red"
          />
        </div>
      ),
    },
  ];

  const paginacionES = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    noRowsPerPage: false,
    selectAllRowsItem: false,
    selectAllRowsItemText: "Todos",
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        {mensaje && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4 shadow text-center font-semibold">
            {mensaje}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Solicitudes de Devolución
        </h1>

        <DataTable
          columns={columnas}
          data={devoluciones.data}
          pagination
          paginationComponentOptions={paginacionES}
          responsive
          highlightOnHover
          striped
          noDataComponent="No hay solicitudes de devolución"
        />
      </div>
    </AppLayout>
  );
}
