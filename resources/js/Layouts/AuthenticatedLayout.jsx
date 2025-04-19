/* resources/js/Layouts/AuthenticatedLayout.jsx */
import ApplicationLogo   from '@/Components/ApplicationLogo';
import Dropdown          from '@/Components/Dropdown';
import NavLink           from '@/Components/NavLink';
import Footer            from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* NAVBAR */}
            <nav className="border-b border-gray-700 bg-[#040A2A] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-28 justify-between items-center">

                        {/* Logo + links */}
                        <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo />
                        </Link>


                            <div className="hidden space-x-6 sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')}
                                         active={route().current('dashboard')}>
                                    Inicio
                                </NavLink>

                                <NavLink href={route('tienda.index', 'cascos')}
                                         active={route().current('tienda.index', { categoria: 'cascos' })}>
                                    Cascos
                                </NavLink>

                                <NavLink href={route('tienda.index', 'chaquetas')}
                                         active={route().current('tienda.index', { categoria: 'chaquetas' })}>
                                    Chaquetas
                                </NavLink>

                                <NavLink href={route('tienda.index', 'pantalones')}
                                         active={route().current('tienda.index', { categoria: 'pantalones' })}>
                                    Pantalones
                                </NavLink>

                                <NavLink href={route('tienda.index', 'guantes')}
                                         active={route().current('tienda.index', { categoria: 'guantes' })}>
                                    Guantes
                                </NavLink>

                                <NavLink href={route('tienda.index', 'botas')}
                                         active={route().current('tienda.index', { categoria: 'botas' })}>
                                    Botas
                                </NavLink>

                                <NavLink href={route('carrito.index')}
                                         active={route().current('carrito.index')}>
                                    Carrito
                                </NavLink>
                            </div>
                        </div>

                        {/* Dropdown usuario */}
                        {/* Si estas logeado */}
                        {user && (
                            <div className="hidden sm:flex sm:items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-[#040A2A] px-3 py-2 text-sm font-medium leading-4 !text-white hover:!text-white/80 focus:outline-none"
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
                                        {user?.can?.viewAny_productos && (
                                        <Dropdown.Link href={route('productos.index')}>
                                            Ver lista de productos
                                        </Dropdown.Link>
                                        )}

                                        {user?.can?.create_productos && (
                                            <Dropdown.Link href={route('productos.create')}>
                                                Crear producto
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}

                        {/* Si NO estas logeado */}
                        {!user && (
                            <div className="hidden sm:flex sm:items-center">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center rounded-md border border-white bg-transparent px-3 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#040A2A] transition"
                                >
                                    Iniciar sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-[#050E3B] shadow text-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* CONTENIDO */}
            <main className="flex-1">
                {children}
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}
