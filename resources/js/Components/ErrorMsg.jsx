import React from "react";

export default function ErrorMsg({ children }) {
  return (
    <p className="text-red-600 text-lg font-extrabold mt-3 mb-3">{children}</p>
  );
}
