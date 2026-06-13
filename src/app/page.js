'use client';
import Link from 'next/link';
import { COLORS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: COLORS.background }}>
      {/* Hero */}
      <div className="relative h-96 flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1551024601-bec78aea704b"
          alt="Mixología"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Descripción */}
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="font-body mb-4">
          Descubre nuestra colección de cócteles artesanales, donde cada trago cuenta una historia.
          Desde clásicos reinventados hasta creaciones exclusivas, nuestros cocktails fusionan técnica,
          creatividad y los mejores ingredientes premium. Cada sorbo es una experiencia sensorial que
          despierta los sentidos.
        </p>
        <p className="font-titles text-xl">
          Sabores que despiertan. Combinaciones que sorprenden. Cócteles que se recuerdan.
          Bienvenido a la nueva dimensión de la mixología.
        </p>
      </div>

      {/* Galería */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-w-4xl mx-auto px-6 mb-12">
        <img
          src="https://images.unsplash.com/photo-1536935338788-846bb9981813"
          alt="Cóctel"
          className="w-full h-64 object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1560508180-03f285f67ded"
          alt="Cóctel"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* CTA */}
      <div className="px-6 py-12" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b"
            alt="Bartender"
            className="w-full md:w-1/3 h-48 object-cover rounded-lg"
          />
          <div className="flex-1 text-center md:text-left" style={{ color: COLORS.card }}>
            <p className="font-body mb-6">
              Nuestro objetivo en MixTogether es que tengas a mano una librería enorme con los
              Cocktails y Mocktails más famosos y también los más únicos. Regístrate ahora para
              ser parte de nuestra comunidad y desbloquear la posibilidad de guardar tus bebidas
              favoritas. Además nuestros usuarios tienen acceso al Área de mezclas donde podrás
              dar rienda suelta a tu imaginación y crear tus propias mezclas.
            </p>
            <Link
              href="/register"
              className="font-buttons font-semibold px-8 py-3 rounded inline-block"
              style={{ backgroundColor: COLORS.card, color: COLORS.primary }}
            >
              REGÍSTRATE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}