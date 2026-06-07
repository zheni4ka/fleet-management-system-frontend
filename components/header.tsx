'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { Truck, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Функція для діставання токена з кукі у браузері
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const token = getCookie('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = atob(payload); 
        const parsed = JSON.parse(decoded);
        const userRole = parsed['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || parsed.role;

        setTimeout(() => {
          setRole(userRole);
        }, 0);

      } catch (e) {
        console.error("Помилка розшифровки токена", e);
      }
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
    router.refresh();
  };

  return (
    <div className={className}>
        <nav className="flex justify-between items-center p-1.5 bg-slate-900 text-white font-medium shadow-md px-4">
          <div className="flex gap-3">
            <div className= {`${inter.className} flex items-center gap-1 hover:bg-slate-700 p-2 pl-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>
              <Truck size={20} />
              <Link href="/">Головна</Link>
            </div>
            {role === "Admin" && (
              <>
                <Link href="/driver" className={`${inter.className} hover:bg-slate-700 p-2 pl-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Водії</Link>
                <Link href="/auto" className={`${inter.className} hover:bg-slate-700 p-2 pl-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Авто</Link>
                <Link href="/dispatcher" className={`${inter.className} hover:bg-slate-700 p-2 pl-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Диспетчери</Link>
              </>
            )}

            <Link href="/route" className={`${inter.className} hover:bg-slate-700 p-2 pl-2 rounded-2xl transition-transform hover:scale-105 duration-300`}>Маршрути</Link>
          </div>
          
          <button 
            onClick={handleLogout} 
            className={`${inter.className} flex items-center gap-2 hover:bg-red-600/80 bg-red-500/20 text-red-100 p-2 px-3 rounded-2xl transition-transform hover:scale-105 duration-300`}
          >
            <LogOut size={18} />
            Вийти
          </button>
        </nav>
    </div>
  );
};

export default Header;