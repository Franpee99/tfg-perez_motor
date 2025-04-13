import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AuthenticatedLayout';
import ProductoGrid from '@/Components/ProductoGrid';

export default function SeccionIndex({ categoriaActual, productos }) {
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {`Sección: ${categoriaActual}`}
                </h2>
            }
        >
            <Head title={`${categoriaActual}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <ProductoGrid productos={productos} />
                </div>
            </div>
        </AppLayout>
    );
}
