import React from 'react';
import { Link } from '@inertiajs/inertia-react';

const Categoria = ({ categoriaActual, productos }) => {
    return (
        <div>
            <h1>Productos en la categoría: {categoriaActual}</h1>
            <div className="productos">
                {productos.map((producto) => (
                    <div key={producto.id} className="producto">
                        <h2>{producto.nombre}</h2>
                        {producto.imagenes && producto.imagenes.length > 0 && (
                            <img src={producto.imagenes[0]} alt={producto.nombre} />
                        )}
                        <p>{producto.descripcion}</p>
                        <p>Precio: ${producto.precio}</p>
                    </div>
                ))}
            </div>
            <Link href="/productos">Volver a todos los productos</Link>
        </div>
    );
};

export default Categoria;
