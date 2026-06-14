'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/lib/constants';
import { IoPersonCircleOutline, IoMenu, IoClose } from 'react-icons/io5';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="relative" style={{ backgroundColor: COLORS.primary }}>
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="font-titles text-2xl" style={{ color: COLORS.card }}>
          Mix Together
        </Link>

        <div className="hidden md:flex gap-6 font-buttons font-semibold" style={{ color: COLORS.card }}>
          <Link href="/cocktails">COCKTAILS</Link>
          <Link href="/mocktails">MOCKTAILS</Link>
          <Link href="/mezclas">ÁREA DE MEZCLAS</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href="/perfil" className="flex items-center gap-1 font-buttons" style={{ color: COLORS.card }}>
                <IoPersonCircleOutline size={24} /> Perfil
              </Link>
              <button onClick={handleLogout} className="font-buttons text-sm cursor-pointer" style={{ color: COLORS.card }}>
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-1 font-buttons" style={{ color: COLORS.card }}>
              <IoPersonCircleOutline size={24} /> Login
            </Link>
          )}
        </div>

        
        <button
          className="md:hidden"
          style={{ color: COLORS.card }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 font-buttons font-semibold" style={{ color: COLORS.card }}>
          <Link href="/cocktails" onClick={() => setMenuOpen(false)}>COCKTAILS</Link>
          <Link href="/mocktails" onClick={() => setMenuOpen(false)}>MOCKTAILS</Link>
          <Link href="/mezclas" onClick={() => setMenuOpen(false)}>ÁREA DE MEZCLAS</Link>

          {user ? (
            <>
              <Link href="/perfil" className="flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                <IoPersonCircleOutline size={24} /> Perfil
              </Link>
              <button onClick={handleLogout} className="text-left text-sm cursor-pointer">
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-1" onClick={() => setMenuOpen(false)}>
              <IoPersonCircleOutline size={24} /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}