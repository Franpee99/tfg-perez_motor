import { Link } from '@inertiajs/react';

export default function NavLink({ href, active = false, className = '', children, ...props }) {
    return (
        <Link
            href={href}
            {...props}
            className={[
                'relative inline-flex items-center px-2 py-1 text-lg font-medium text-white transition duration-300 ease-out',
                active
                    ? 'after:w-full after:scale-x-100 after:bg-red-500'
                    : 'after:w-0 after:scale-x-0 hover:after:w-full hover:after:scale-x-100 after:bg-red-500',
                'after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[2px] after:origin-center after:transition-all after:duration-300',
                className,
            ].join(' ')}
        >
            {children}
        </Link>
    );
}
