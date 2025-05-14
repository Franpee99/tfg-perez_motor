import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import Boton from "@/Components/Boton";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function DevolucionAdmin({ devoluciones }) {
  const { flash = {} } = usePage().props;
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (flash.success) {
      setMensaje(flash.success);
    }
  }, [flash.success]);

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const actualizarEstado = (id, estado) => {
    router.put(
      route("admin.devoluciones.update", id),
      { estado },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          const nuevoMensaje = page.props.flash?.success;
          if (nuevoMensaje) {
            setMensaje(nuevoMensaje);
          }
        },
      }
    );
  };

  const columnas = [
    {
      name: "Fecha",
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
          row.estado === "pendiente" ? (
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
          ) : (
            <span className="text-sm text-gray-400 italic">Ya gestionada</span>
          )
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
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-[#040A2A] text-white text-xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-fadeInOut flex flex-col items-center">
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
            </div>
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
          customStyles={{
            table: {
              style: {
                minWidth: '1000px',
                fontSize: '15px',
              },
            },
            headCells: {
              style: {
                fontSize: '15px',
                fontWeight: 'bold',
                backgroundColor: '#f3f4f6',
              },
            },
            cells: {
              style: {
                paddingTop: '14px',
                paddingBottom: '14px',
                paddingLeft: '12px',
                paddingRight: '12px',
              },
            },
          }}
        />
      </div>
    </AppLayout>
  );
}
