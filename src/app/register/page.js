'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ birth_date: birthDate, username })
        .eq('id', data.user.id);
    }

    router.push('/login');
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
          ¿Ya eres usuario? <a href="/login" className="text-[#E48700] font-semibold">Inicia sesión</a>
        </p>
        <h1 className="font-titles text-3xl mb-6">Regístrate</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-semibold font-body">Introduce un correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded font-buttons"
          required
        />

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold font-body">Nombre</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded font-buttons"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold font-body">Fecha de nacimiento</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded font-buttons"
              required
            />
          </div>
        </div>

        <label className="block mb-1 text-sm font-semibold font-body">Introduce una contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-1 p-2 border rounded font-buttons"
          required
          minLength={12}
        />
        <p className="text-xs text-gray-500 mb-4 font-body">Longitud mínima: 12 caracteres</p>

        <button
          onClick={handleRegister}
          className="w-full font-buttons font-semibold py-2 rounded cursor-pointer"
          style={{ backgroundColor: '#E48700', color: '#FFFEF9' }}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}