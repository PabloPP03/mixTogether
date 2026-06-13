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
    <div className="min-h-screen flex items-center justify-center bg-[#FDF7E1]">
      <form onSubmit={handleLogin} className="bg-[#FFFEF9] p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Bienvenido Mixer</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-semibold">Introduce tu correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-1 text-sm font-semibold">Introduce tu contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button type="submit" className="w-full bg-[#E48700] text-white py-2 rounded font-semibold cursor-pointer">
          Iniciar Sesión
        </button>

        <p className="text-center mt-4 text-sm">
          ¿No eres usuario? <a href="/register" className="text-[#E48700] font-semibold">Regístrate</a>
        </p>
      </form>
    </div>
  );
}