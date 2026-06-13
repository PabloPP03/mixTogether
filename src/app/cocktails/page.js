'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS } from '@/lib/constants';

export default function CocktailsPage() {
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/bebidas?type=cocktail')
      .then((res) => res.json())
      .then(setDrinks);
  }, []);

  const filtered = drinks.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.background }}>
      <h1 className="font-titles text-4xl text-center mb-6">Cocktails</h1>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded font-body"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filtered.map((drink) => (
          <Link
            key={drink.id}
            href={`/bebidas/${drink.id}`}
            className="rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
            style={{ backgroundColor: COLORS.card }}
          >
            {drink.image_url && (
              <img src={drink.image_url} alt={drink.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-titles text-xl mb-1">{drink.name}</h3>
              <p className="font-body text-sm text-gray-600 uppercase">
                {drink.flavor} {drink.base && `· ${drink.base}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}