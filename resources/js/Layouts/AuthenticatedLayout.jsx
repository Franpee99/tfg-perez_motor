import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Footer from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route('tienda.index', 'cascos')}
                                    active={route().current('tienda.index', { categoria: 'cascos' })}>
                                    Cascos
                                </NavLink>

                                <NavLink
                                    href={route('tienda.index', 'chaquetas')}
                                    active={route().current('tienda.index', { categoria: 'chaquetas' })}>
                                    Chaquetas
                                </NavLink>

                                <NavLink
                                    href={route('tienda.index', 'pantalones')}
                                    active={route().current('tienda.index', { categoria: 'pantalones' })}>
                                    Pantalones
                                </NavLink>

                                <NavLink
                                    href={route('tienda.index', 'guantes')}
                                    active={route().current('tienda.index', { categoria: 'guantes' })}>
                                    Guantes
                                </NavLink>

                                <NavLink
                                    href={route('tienda.index', 'botas')}
                                    active={route().current('tienda.index', { categoria: 'botas' })}>
                                    Botas
                                </NavLink>

                                <NavLink
                                    href={route('carrito.index')}
                                    active={route().current('carrito.index')}>
                                    Carrito
                                </NavLink>

                                {user?.can?.viewAny_productos && (
                                <NavLink
                                    href={route('productos.index')}
                                    active={route().current('productos.index')}>
                                    Productos
                                </NavLink>
                                )}

                                {user?.can?.create_productos && (
                                    <NavLink
                                        href={route('productos.create')}
                                        active={route().current('productos.create')}>
                                        Crear Producto
                                    </NavLink>

                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}
