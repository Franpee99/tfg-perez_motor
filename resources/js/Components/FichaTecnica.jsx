// components/FichaTecnica.jsx
export default function FichaTecnica({ fichaTecnica }) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ficha Técnica
        </h2>
        {fichaTecnica.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-4 text-left">Característica</th>
                  <th className="py-3 px-4 text-left">Valor</th>
                </tr>
              </thead>
              <tbody>
                {fichaTecnica.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{item.key || "N/A"}</td>
                    <td className="py-3 px-4">{item.value || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay ficha técnica disponible.</p>
        )}
      </div>
    );
  }
