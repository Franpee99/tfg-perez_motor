// components/TablaStock.jsx
export default function TablaStock({ tallas }) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Stock por Tallas
        </h2>
        {tallas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 text-left">Talla</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                </tr>
              </thead>
              <tbody>
                {tallas.map((talla, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{talla.nombre}</td>
                    <td className="py-3 px-4">
                      {talla.pivot?.stock ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">
            No se encontraron tallas para este producto.
          </p>
        )}
      </div>
    );
  }
