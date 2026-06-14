'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/cocktails');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: 'url(https://hiskhfhkrikidbgoilrp.supabase.co/storage/v1/object/public/cocktails/edgar-chaparro-Lwx-q6OdGAc-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 bg-[#FFFEF9] p-8 rounded-lg shadow-md w-96">
        <p className="text-right text-sm mb-2">
          ¿No eres usuario? <a href="/register" className="text-[#E48700] font-semibold">Regístrate</a>
        </p>
        <h1 className="font-titles text-3xl mb-6">Bienvenido Mixer</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-semibold font-body">Introduce tu correo electrónico o tu nombre</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded font-body"
          required
        />

        <label className="block mb-1 text-sm font-semibold font-body">Introduce tu contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded font-body"
          required
        />

        <p className="text-right text-sm mb-4">
          <a href="#" className="text-[#E48700]">Olvidé mi contraseña</a>
        </p>

        <button type="submit" onClick={handleLogin} className="w-full font-buttons font-semibold py-2 rounded" style={{ backgroundColor: '#E48700', color: '#FFFEF9' }}>
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}