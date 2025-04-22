import React from "react";
import { router } from "@inertiajs/react";
import Boton from "@/Components/Boton";

export default function Paginacion({ links }) {
  return (
    <div className="mt-6 flex justify-center flex-wrap gap-2">
      {links.map((link, index) => {
        let label = link.label;

        if (label.includes("Previous")) label = "Anterior";
        if (label.includes("Next")) label = "Siguiente";

        return (
          <Boton
            key={index}
            texto={label}
            onClick={() => link.url && router.visit(link.url)}
            disabled={!link.url}
            color="primary"
            tamaño="sm"
            className={`!text-sm ${
              link.active ? 'bg-red-600 text-white border-red-600' : ''
            }`}
          />
        );
      })}
    </div>
  );
}
