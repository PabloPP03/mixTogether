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

    console.log('signUp result:', data, error);

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
    <div className="min-h-screen flex items-center justify-center bg-[#FDF7E1]">
      <form onSubmit={handleRegister} className="bg-[#FFFEF9] p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Regístrate</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-1 text-sm font-semibold">Introduce un correo electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-semibold">Fecha de nacimiento</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <label className="block mb-1 text-sm font-semibold">Introduce una contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-1 p-2 border rounded"
          required
          minLength={12}
        />
        <p className="text-xs text-gray-500 mb-4">Longitud mínima: 12 caracteres</p>

        <button type="submit" className="w-full bg-[#E48700] text-white py-2 rounded font-semibold cursor-pointer">
          Registrarse
        </button>

        <p className="text-center mt-4 text-sm">
          ¿Ya eres usuario? <a href="/login" className="text-[#E48700] font-semibold">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}