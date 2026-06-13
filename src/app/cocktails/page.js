'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { COLORS } from '@/lib/constants';
import { IoHeart, IoHeartOutline, IoFilterOutline } from 'react-icons/io5';

export default function CocktailsPage() {
  const [drinks, setDrinks] = useState([]);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [flavorFilter, setFlavorFilter] = useState('');
  const [baseFilter, setBaseFilter] = useState('');

  useEffect(() => {
    fetch('/api/bebidas?type=cocktail')
      .then((res) => res.json())
      .then(setDrinks);

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const res = await fetch(`/api/favoritos?user_id=${session.user.id}`);
        const data = await res.json();
        setFavorites(data);
      }
    };
    init();
  }, []);

  const isFavorite = (drinkId) => favorites.some((f) => f.drink_id === drinkId);

  const toggleFavorite = async (e, drinkId) => {
    e.preventDefault();
    if (!user) return;

    const existing = favorites.find((f) => f.drink_id === drinkId);

    if (existing) {
      await fetch(`/api/favoritos/${existing.id}`, { method: 'DELETE' });
    } else {
      await fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, drink_id: drinkId }),
      });
    }

    const res = await fetch(`/api/favoritos?user_id=${user.id}`);
    const data = await res.json();
    setFavorites(data);
  };

  const flavors = [...new Set(drinks.map((d) => d.flavor).filter(Boolean))];
  const bases = [...new Set(drinks.map((d) => d.base).filter(Boolean))];

  const filtered = drinks.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFlavor = !flavorFilter || d.flavor === flavorFilter;
    const matchesBase = !baseFilter || d.base === baseFilter;
    return matchesSearch && matchesFlavor && matchesBase;
  });

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.background }}>
      <h1 className="font-titles text-4xl text-center mb-6">Cocktails</h1>

      <div className="max-w-xl mx-auto mb-4 flex gap-2 items-start">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 border rounded font-body flex items-center gap-1"
          style={{ backgroundColor: COLORS.card }}
        >
          <IoFilterOutline size={20} /> Filtros
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded font-body bg-white"
        />
      </div>

      {showFilters && (
        <div className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row gap-3 p-3 rounded border font-body" style={{ backgroundColor: COLORS.card }}>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Sabor</label>
            <select
              value={flavorFilter}
              onChange={(e) => setFlavorFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todos</option>
              {flavors.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Base</label>
            <select
              value={baseFilter}
              onChange={(e) => setBaseFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todas</option>
              {bases.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {filtered.map((drink) => (
          <Link
            key={drink.id}
            href={`/bebidas/${drink.id}`}
            className="rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow relative"
            style={{ backgroundColor: COLORS.card }}
          >
            {drink.image_url && (
              <img src={drink.image_url} alt={drink.name} className="w-full h-40 object-cover" />
            )}
            {user && (
              <button
                onClick={(e) => toggleFavorite(e, drink.id)}
                className="absolute top-2 right-2"
              >
                <span className="bg-white rounded-full p-1 flex items-center justify-center">
                  {isFavorite(drink.id) ? <IoHeart color="red" size={22} /> : <IoHeartOutline size={22} />}
                </span>
              </button>
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