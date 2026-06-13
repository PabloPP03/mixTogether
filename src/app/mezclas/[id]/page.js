'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { COLORS } from '@/lib/constants';

export default function MezclaDetailPage() {
  const { id } = useParams();
  const [mix, setMix] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/mezclas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMix(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <p className="font-body">Cargando...</p>
      </div>
    );
  }

  if (!mix || mix.error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <p className="font-body">Mezcla no encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.background }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {mix.image_url && (
            <img
              src={mix.image_url}
              alt={mix.name}
              className="w-full md:w-64 h-64 object-cover rounded-lg"
            />
          )}
          <div>
            <h1 className="font-titles text-4xl mb-4">{mix.name}</h1>
            <p className="font-body mb-4">{mix.description}</p>

            <div className="flex gap-8">
              {mix.flavor && (
                <div>
                  <h3 className="font-titles text-lg">Sabor</h3>
                  <p className="font-body uppercase">{mix.flavor}</p>
                </div>
              )}
              {mix.base && (
                <div>
                  <h3 className="font-titles text-lg">Base</h3>
                  <p className="font-body uppercase">{mix.base}</p>
                </div>
              )}
              {mix.category && (
                <div>
                  <h3 className="font-titles text-lg">Categoría</h3>
                  <p className="font-body uppercase">{mix.category}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-t-2 mb-6" style={{ borderColor: COLORS.primary }} />

        <h2 className="font-titles text-3xl mb-4">Preparación</h2>

        {mix.ingredients?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-titles text-xl mb-2">Ingredientes</h3>
            <ul className="font-body list-disc list-inside">
              {mix.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        {mix.steps?.length > 0 && (
          <div>
            <h3 className="font-titles text-xl mb-2">Modo de preparación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mix.steps.map((step, i) => (
                <div key={i}>
                  <h4 className="font-titles text-lg mb-1">Paso {i + 1}</h4>
                  <p className="font-body">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}