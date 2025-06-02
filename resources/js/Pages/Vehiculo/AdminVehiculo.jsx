import AppLayout from "@/Layouts/AuthenticatedLayout";
import DataTable from "react-data-table-component";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function AdminVehiculo({ vehiculos }) {
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroVin, setFiltroVin] = useState("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltroUsuario("");
    setFiltroMatricula("");
    setFiltroMarca("");
    setFiltroModelo("");
    setFiltroVin("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  const vehiculosFiltrados = vehiculos.filter(v => {
    const usuarioOk =
      (!filtroUsuario) ||
      (v.user?.name && v.user.name.toLowerCase().includes(filtroUsuario.toLowerCase())) ||
      (v.user?.email && v.user.email.toLowerCase().includes(filtroUsuario.toLowerCase()));

    const matriculaOk =
      !filtroMatricula || (v.matricula && v.matricula.toLowerCase().includes(filtroMatricula.toLowerCase()));

    const marcaOk =
      !filtroMarca || (v.marca && v.marca.toLowerCase().includes(filtroMarca.toLowerCase()));

    const modeloOk =
      !filtroModelo || (v.modelo && v.modelo.toLowerCase().includes(filtroModelo.toLowerCase()));

    const vinOk =
      !filtroVin || (v.vin && v.vin.toLowerCase().includes(filtroVin.toLowerCase()));

    // Fecha registro
    const fecha = v.created_at ? new Date(v.created_at) : null;
    const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
    const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;
    let fechaOk = true;
    if (desde && fecha && fecha < desde) fechaOk = false;
    if (hasta && fecha && fecha > hasta) fechaOk = false;

    return usuarioOk && matriculaOk && marcaOk && modeloOk && vinOk && fechaOk;
  });

  const columns = [
    {
      name: "Usuario",
      selector: row => row.user?.name || "",
      sortable: true,
      cell: row => (
        <div>
          <div className="font-semibold">{row.user?.name}</div>
          <div className="text-xs text-gray-400">{row.user?.email}</div>
        </div>
      ),
      minWidth: "180px"
    },
    { name: "Marca", selector: row => row.marca, sortable: true },
    { name: "Modelo", selector: row => row.modelo, sortable: true },
    { name: "Matrícula", selector: row => row.matricula, sortable: true },
    { name: "VIN", selector: row => row.vin, sortable: true },
    {
      name: "Fecha registro",
      selector: row => row.created_at,
      sortable: true,
      cell: row => (
        <span>
          {row.created_at ? new Date(row.created_at).toLocaleDateString("es-ES") : "—"}
        </span>
      ),
    },
    {
      name: "Acciones",
      cell: row => (
        <div className="flex gap-2">
          <Link
            href={route("vehiculos.show", row.id)}
            className="bg-blue-600 text-white rounded px-3 py-1 text-sm font-bold shadow hover:bg-blue-700 transition"
          >
            Ficha
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
      <section className="min-h-screen bg-gradient-to-br from-[#040A2A] to-[#232b4b] text-white py-12 px-2 flex flex-col items-center">
        <div className="max-w-7xl w-full mx-auto bg-white/95 rounded-xl shadow-lg p-10">
          <h1 className="text-3xl font-black text-[#141b3a] mb-2">Panel de vehículos</h1>
          <div className="mb-6 text-gray-500 text-sm flex items-center gap-2">
            <FaRegCalendarAlt className="w-5 h-5 text-gray-400" />
            Puedes filtrar por usuario, matrícula, marca, modelo, VIN o rango de fecha de registro ("Desde" / "Hasta").
          </div>
          {/* Filtros */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              placeholder="Buscar usuario (nombre/email)"
              value={filtroUsuario}
              onChange={e => setFiltroUsuario(e.target.value)}
            />
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              placeholder="Matrícula"
              value={filtroMatricula}
              onChange={e => setFiltroMatricula(e.target.value)}
            />
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              placeholder="Marca"
              value={filtroMarca}
              onChange={e => setFiltroMarca(e.target.value)}
            />
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              placeholder="Modelo"
              value={filtroModelo}
              onChange={e => setFiltroModelo(e.target.value)}
            />
            <input
              type="text"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              placeholder="VIN (bastidor)"
              value={filtroVin}
              onChange={e => setFiltroVin(e.target.value)}
            />
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              placeholder="Desde"
            />
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold shadow text-gray-900"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              placeholder="Hasta"
            />
            <button
              onClick={limpiarFiltros}
              className="col-span-1 md:col-span-2 lg:col-span-1 bg-red-600 px-6 py-2 rounded-xl text-white font-bold shadow"
            >
              Limpiar filtros
            </button>
          </div>
          <DataTable
            columns={columns}
            data={vehiculosFiltrados}
            pagination
            paginationComponentOptions={paginacionES}
            highlightOnHover
            noHeader
            striped
            responsive
            noDataComponent={
              <div className="text-gray-400 py-8 text-lg text-center">
                No hay vehículos que coincidan con los filtros aplicados.
              </div>
            }
            customStyles={{
              rows: { style: { minHeight: "56px" } },
              headCells: {
                style: {
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#f3f4f6",
                  color: "#040A2A"
                },
              },
              cells: { style: { color: "#040A2A" } }
            }}
          />
        </div>
      </section>
    </AppLayout>
  );
}
