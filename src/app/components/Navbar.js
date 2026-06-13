'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/lib/constants';

export default function Navbar() {
  const [user, setUser] = useState(null);
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
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3" style={{ backgroundColor: COLORS.primary }}>
      <Link href="/" className="font-titles text-2xl" style={{ color: COLORS.card }}>
        Mix Together
      </Link>

      <div className="hidden md:flex gap-6 font-buttons font-semibold" style={{ color: COLORS.card }}>
        <Link href="/cocktails">COCKTAILS</Link>
        <Link href="/mocktails">MOCKTAILS</Link>
        <Link href="/mezclas">ÁREA DE MEZCLAS</Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/perfil" className="font-buttons" style={{ color: COLORS.card }}>
              👤 Perfil
            </Link>
            <button onClick={handleLogout} className="font-buttons text-sm" style={{ color: COLORS.card }}>
              Salir
            </button>
          </>
        ) : (
          <Link href="/login" className="font-buttons" style={{ color: COLORS.card }}>
            👤 Login
          </Link>
        )}
      </div>
    </nav>
  );
}