import React from 'react';
import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
        <nav className="flex gap-3 p-1.5 bg-slate-900 text-white font-medium shadow-md">
          <Link href="/" className={`${inter.className} hover:bg-slate-700 p-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Головна</Link>
          <Link href="/driver" className={`${inter.className} hover:bg-slate-700 p-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Водії</Link>
          <Link href="/auto" className={`${inter.className} hover:bg-slate-700 p-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Авто</Link>
          <Link href="/route" className={`${inter.className} hover:bg-slate-700 p-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Маршрути</Link>
        </nav>
    </div>
  );
};

export default Header;