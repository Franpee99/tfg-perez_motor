import React from 'react';
import { Link } from '@inertiajs/react';
import { FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#040A2A] text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start gap-4">
            {/* Logo */}
            <img
                src="/images/perez-motor/LOGO.png"
                alt="Pérez Motor Logo"
                className="max-h-[120px] object-contain"
            />
            <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Pérez Motor</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                C/ Tartaneros, 2<br />
                11540 Sanlúcar de Bda, Cádiz<br />
                <a href="mailto:info@perez-moto.com" className="hover:underline text-gray-200">
                    info@perez-moto.com
                </a>
                </p>
            </div>
        </div>

        {/* Nav*/}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-500">Información</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li><Link href="/quienes-somos" className="hover:underline">Quiénes somos</Link></li>
            <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </div>

        {/* Redes sociales y correo */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-red-500">Síguenos</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <FaInstagram className="text-pink-500" />
              <a href="https://www.instagram.com" target="_blank" className="hover:underline">Instagram</a>
            </li>
            <li className="flex items-center gap-2">
              <FaFacebookF className="text-blue-500" />
              <a href="https://www.facebook.com" target="_blank" className="hover:underline">Facebook</a>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" />
              <a href="mailto:info@perezmotor.com" className="hover:underline">info@perezmotor.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Pie de página */}
      <div className="text-center text-gray-400 mt-10 text-sm border-t border-gray-600 pt-6">
        &copy; {new Date().getFullYear()} Pérez Motor. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
