"use client";
import { useState } from "react";
import Link from "next/link";
import { COLORS } from "@/lib/constants";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

export default function HomePage() {
  const images = [
    "https://images.unsplash.com/photo-1536935338788-846bb9981813",
    "https://images.unsplash.com/photo-1560508180-03f285f67ded",
    "https://images.unsplash.com/photo-1470338745628-171cf53de3a8",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
  ];
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);
  return (
    <div style={{ backgroundColor: COLORS.background }}>
      {/* Hero */}
      <div className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <iframe
          className="absolute w-[300%] h-[300%] top-[-100%] left-[-100%] pointer-events-none"
          src="https://www.youtube.com/embed/X7GyYRKIq4k?autoplay=1&mute=1&loop=1&playlist=X7GyYRKIq4k&controls=0&showinfo=0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div className="absolute inset-0 bg-black opacity-40" />
      </div>

      {/* Descripción */}
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <p className="font-body mb-4">
          Descubre nuestra colección de cócteles artesanales, donde cada trago
          cuenta una historia. Desde clásicos reinventados hasta creaciones
          exclusivas, nuestros cocktails fusionan técnica, creatividad y los
          mejores ingredientes premium. Cada sorbo es una experiencia sensorial
          que despierta los sentidos.
        </p>
        <p className="font-titles text-xl">
          Sabores que despiertan. Combinaciones que sorprenden. Cócteles que se
          recuerdan. Bienvenido a la nueva dimensión de la mixología.
        </p>
      </div>

      
      <div className="relative max-w-4xl mx-auto px-6 mb-12 h-100 overflow-hidden rounded-lg">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 cursor-pointer"
        >
          <IoChevronBackOutline size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 cursor-pointer"
        >
          <IoChevronForwardOutline size={24} />
        </button>

        {/* Puntos indicadores */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === current ? "bg-white scale-125" : "bg-white bg-opacity-50"}`}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-12" style={{ backgroundColor: COLORS.primary }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://hiskhfhkrikidbgoilrp.supabase.co/storage/v1/object/public/cocktails/timur-romanov-2DV8y3LU7Ac-unsplash.jpg"
            alt="Bartender"
            className="w-full md:w-1/3 h-65 object-cover rounded-lg"
          />
          <div
            className="flex-1 text-center md:text-left"
            style={{ color: COLORS.card }}
          >
            <p className="font-body mb-6">
              Nuestro objetivo en MixTogether es que tengas a mano una librería
              enorme con los Cocktails y Mocktails más famosos y también los más
              únicos. Regístrate ahora para ser parte de nuestra comunidad y
              desbloquear la posibilidad de guardar tus bebidas favoritas.
              Además nuestros usuarios tienen acceso al Área de mezclas donde
              podrás dar rienda suelta a tu imaginación y crear tus propias
              mezclas.
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
