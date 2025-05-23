/* resources/js/Layouts/AuthenticatedLayout.jsx */
import ApplicationLogo   from '@/Components/ApplicationLogo';
import Dropdown          from '@/Components/Dropdown';
import NavLink           from '@/Components/NavLink';
import Footer            from '@/Components/Footer';
import { Link, usePage } from '@inertiajs/react';
import { useState }      from 'react';
import { ShoppingCart } from 'lucide-react';
import { FaUserShield, FaPlus, FaTruck, FaUndoAlt, FaList, FaUser, FaSignOutAlt, FaClipboardList, FaMotorcycle, FaTools } from "react-icons/fa";


export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth?.user;
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* NAVBAR */}
            <nav className="border-b border-gray-700 bg-[#040A2A] text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-28 justify-between items-center">

                        {/* Logo + links */}
                        <div className="flex items-center w-full justify-between">
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo />
                            </Link>

                            {/* Botón hamburguesa + icono carrito móvil */}
                            <div className="xl:hidden flex items-center space-x-4">
                                {/* Botón hamburguesa visible hasta xl */}
                                <button
                                    onClick={() => setMenuAbierto(!menuAbierto)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/80 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {menuAbierto ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>

                                {/* Icono carrito móvil */}
                                <Link href={route('carrito.index')} className="relative inline-flex items-center">
                                    <ShoppingCart className="h-7 w-7 text-white" />
                                    {usePage().props.carritoCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1">
                                            {usePage().props.carritoCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Menú de escritorio visible desde xl */}
                            <div className="hidden xl:flex space-x-6 ms-10">
                                <NavLink href={route('tienda.index', 'cascos')} active={route().current('tienda.index', { categoria: 'cascos' })}>Cascos</NavLink>
                                <NavLink href={route('tienda.index', 'chaquetas')} active={route().current('tienda.index', { categoria: 'chaquetas' })}>Chaquetas</NavLink>
                                <NavLink href={route('tienda.index', 'pantalones')} active={route().current('tienda.index', { categoria: 'pantalones' })}>Pantalones</NavLink>
                                <NavLink href={route('tienda.index', 'guantes')} active={route().current('tienda.index', { categoria: 'guantes' })}>Guantes</NavLink>
                                <NavLink href={route('tienda.index', 'botas')} active={route().current('tienda.index', { categoria: 'botas' })}>Botas</NavLink>
                                <Link href={route('carrito.index')} className="relative inline-flex items-center">
                                    <ShoppingCart className="h-8 w-8 text-white" />
                                    {usePage().props.carritoCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
                                            {usePage().props.carritoCount}  {/*AppServiceProvider.php*/}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Dropdown usuario */}
                            {/* Si estas logeado */}
                            {user && (
                                <div className="hidden xl:flex items-center">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-[#040A2A] px-3 py-2 text-sm font-medium leading-4 !text-white hover:!text-white/80 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {/* ADMIN */}
                                            {(user?.can?.viewAny_productos ||
                                            user?.can?.create_productos ||
                                            user?.can?.viewAny_pedidos ||
                                            user?.can?.viewAny_devoluciones) && (
                                                <Dropdown.Link href={route('admin.panel')}>
                                                <span className="inline-flex items-center gap-2">
                                                    <FaUserShield className="text-[#040A2A]" />
                                                    Panel de Administración
                                                </span>
                                                </Dropdown.Link>
                                            )}

                                            {user?.can?.viewAny_productos && (
                                            <Dropdown.Link href={route('productos.index')}>
                                                <span className="inline-flex items-center gap-2">
                                                <FaList className="text-[#040A2A]" />
                                                Lista de productos
                                                </span>
                                            </Dropdown.Link>
                                            )}

                                            {user?.can?.create_productos && (
                                            <Dropdown.Link href={route('productos.create')}>
                                                <span className="inline-flex items-center gap-2">
                                                <FaPlus className="text-[#040A2A]" />
                                                Añadir producto
                                                </span>
                                            </Dropdown.Link>
                                            )}

                                            {user?.can?.viewAny_pedidos && (
                                            <Dropdown.Link href={route('admin.pedidos.index')}>
                                                <span className="inline-flex items-center gap-2">
                                                <FaTruck className="text-[#040A2A]" />
                                                Gestión de pedidos
                                                </span>
                                            </Dropdown.Link>
                                            )}

                                            {user?.can?.viewAny_devoluciones && (
                                            <Dropdown.Link href={route('admin.devoluciones.index')}>
                                                <span className="inline-flex items-center gap-2">
                                                <FaUndoAlt className="text-[#040A2A]" />
                                                Solicitudes de devolución
                                                </span>
                                            </Dropdown.Link>
                                            )}

                                            {user?.can?.viewAny_citasTaller && (
                                            <Dropdown.Link href={route('admin.citas.index')}>
                                                <span className="inline-flex items-center gap-2">
                                                <FaTools className="text-[#040A2A]" />
                                                Gestión del taller
                                                </span>
                                            </Dropdown.Link>
                                            )}

                                            {/* PEDIDOS */}
                                            <Dropdown.Link href={route('pedidos.index')}>
                                            <span className="inline-flex items-center gap-2">
                                                <FaClipboardList className="text-[#040A2A]" />
                                                Mis pedidos
                                            </span>
                                            </Dropdown.Link>
                                            {/* VEHICULOS */}
                                            <Dropdown.Link href={route('vehiculos.index')}>
                                            <span className="inline-flex items-center gap-2">
                                                <FaMotorcycle className="text-[#040A2A]" />
                                                Mis vehículos
                                            </span>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('profile.edit')}>
                                            <span className="inline-flex items-center gap-2">
                                                <FaUser className="text-[#040A2A]" />
                                                Perfil
                                            </span>
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                            <span className="inline-flex items-center gap-2">
                                                <FaSignOutAlt className="text-[#C42424]" />
                                                Cerrar sesión
                                            </span>
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}

                            {/* Si NO estas logeado */}
                            {!user && (
                                <div className="hidden xl:flex items-center">
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

                    {/* Menú móvil (hamburguesa expandido) */}
                    {menuAbierto && (
                        <div className="xl:hidden bg-[#040A2A] text-white py-4 px-6 shadow-md transition-all">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
                                {/* Navegación principal */}
                                <nav className="flex flex-col space-y-3 text-base font-medium sm:w-1/2">
                                    <Link href={route('tienda.index', 'cascos')} onClick={() => setMenuAbierto(false)} className="hover:text-red-500 border-b border-white/10 pb-2">Cascos</Link>
                                    <Link href={route('tienda.index', 'chaquetas')} onClick={() => setMenuAbierto(false)} className="hover:text-red-500 border-b border-white/10 pb-2">Chaquetas</Link>
                                    <Link href={route('tienda.index', 'pantalones')} onClick={() => setMenuAbierto(false)} className="hover:text-red-500 border-b border-white/10 pb-2">Pantalones</Link>
                                    <Link href={route('tienda.index', 'guantes')} onClick={() => setMenuAbierto(false)} className="hover:text-red-500 border-b border-white/10 pb-2">Guantes</Link>
                                    <Link href={route('tienda.index', 'botas')} onClick={() => setMenuAbierto(false)} className="hover:text-red-500 border-b border-white/10 pb-2">Botas</Link>
                                </nav>

                                {/* Perfil / Usuario */}
                                <nav className="flex flex-col space-y-3 text-base font-medium sm:w-1/2">
                                {user ? (
                                    <>
                                    {/* Panel de Administración */}
                                    {(user?.can?.viewAny_productos ||
                                        user?.can?.create_productos ||
                                        user?.can?.viewAny_pedidos ||
                                        user?.can?.viewAny_devoluciones) && (
                                        <Link
                                        href={route('admin.panel')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaUserShield className="text-white" />
                                        Panel de Administración
                                        </Link>
                                    )}

                                    {user?.can?.viewAny_productos && (
                                        <Link
                                        href={route('productos.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaList className="text-white" />
                                        Ver lista de productos
                                        </Link>
                                    )}

                                    {user?.can?.create_productos && (
                                        <Link
                                        href={route('productos.create')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaPlus className="text-white" />
                                        Crear producto
                                        </Link>
                                    )}

                                    {user?.can?.viewAny_pedidos && (
                                        <Link
                                        href={route('admin.pedidos.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaTruck className="text-white" />
                                        Gestión de pedidos
                                        </Link>
                                    )}

                                    {user?.can?.viewAny_devoluciones && (
                                        <Link
                                        href={route('admin.devoluciones.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaUndoAlt className="text-white" />
                                        Solicitudes de devolución
                                        </Link>
                                    )}

                                    {user?.can?.viewAny_citasTaller && (
                                        <Link
                                        href={route('admin.citas.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                        >
                                        <FaTools className="text-white" />
                                        Gestión del taller
                                        </Link>
                                    )}

                                    <Link
                                        href={route('pedidos.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                    >
                                        <FaClipboardList className="text-white" />
                                        Mis pedidos
                                    </Link>

                                    <Link
                                        href={route('vehiculos.index')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                    >
                                        <FaMotorcycle className="text-white" />
                                        Mis vehículos
                                    </Link>

                                    <Link
                                        href={route('profile.edit')}
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500 border-b border-white/10 pb-2"
                                    >
                                        <FaUser className="text-white" />
                                        Perfil
                                    </Link>

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        onClick={() => setMenuAbierto(false)}
                                        className="flex items-center gap-2 hover:text-red-500"
                                    >
                                        <FaSignOutAlt className="text-[#C42424]" />
                                        Cerrar sesión
                                    </Link>
                                    </>
                                ) : (
                                    <Link
                                    href={route('login')}
                                    onClick={() => setMenuAbierto(false)}
                                    className="flex items-center gap-2 hover:text-red-500"
                                    >
                                    <FaUser className="text-white" />
                                    Iniciar sesión
                                    </Link>
                                )}
                                </nav>
                            </div>
                        </div>
                    )}
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
