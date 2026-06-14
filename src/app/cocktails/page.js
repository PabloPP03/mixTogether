"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";
import { IoHeart, IoHeartOutline, IoFilterOutline } from "react-icons/io5";

export default function CocktailsPage() {
  const [drinks, setDrinks] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [flavorFilter, setFlavorFilter] = useState("");
  const [baseFilter, setBaseFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const loadData = async () => {
      const [bebidasRes, mezclasRes] = await Promise.all([
        fetch("/api/bebidas?type=cocktail"),
        fetch("/api/mezclas?type=cocktail"),
      ]);
      const bebidas = await bebidasRes.json();
      const mezclas = await mezclasRes.json();
      const mezclasConFlag = Array.isArray(mezclas)
        ? mezclas.map((m) => ({ ...m, isUserMix: true }))
        : [];
      const all = [...bebidas, ...mezclasConFlag];
      setDrinks(all);
      if (bebidas.length > 0) {
        setFeatured(bebidas[Math.floor(Math.random() * bebidas.length)]);
      }
    };
    loadData();

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const res = await fetch(`/api/favoritos?user_id=${session.user.id}`);
        const data = await res.json();
        setFavorites(data);
      }
    };
    init();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, flavorFilter, baseFilter, categoryFilter, sortBy]);

  const isFavorite = (drink) => {
    if (drink.isUserMix) return favorites.some((f) => f.mix_id === drink.id);
    return favorites.some((f) => f.drink_id === drink.id);
  };

  const toggleFavorite = async (e, drink) => {
    e.preventDefault();
    if (!user) return;

    if (drink.isUserMix) {
      const existing = favorites.find((f) => f.mix_id === drink.id);
      if (existing) {
        await fetch(`/api/favoritos/${existing.id}`, { method: "DELETE" });
      } else {
        await fetch("/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, mix_id: drink.id }),
        });
      }
    } else {
      const existing = favorites.find((f) => f.drink_id === drink.id);
      if (existing) {
        await fetch(`/api/favoritos/${existing.id}`, { method: "DELETE" });
      } else {
        await fetch("/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, drink_id: drink.id }),
        });
      }
    }

    const res = await fetch(`/api/favoritos?user_id=${user.id}`);
    const data = await res.json();
    setFavorites(data);
  };

  const flavors = [...new Set(drinks.map((d) => d.flavor).filter(Boolean))];
  const bases = [...new Set(drinks.map((d) => d.base).filter(Boolean))];
  const categories = [
    ...new Set(drinks.map((d) => d.category).filter(Boolean)),
  ];

  const filtered = drinks
    .filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchesFlavor = !flavorFilter || d.flavor === flavorFilter;
      const matchesBase = !baseFilter || d.base === baseFilter;
      const matchesCategory = !categoryFilter || d.category === categoryFilter;
      return matchesSearch && matchesFlavor && matchesBase && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      if (sortBy === "flavor")
        return (a.flavor || "").localeCompare(b.flavor || "");
      if (sortBy === "base") return (a.base || "").localeCompare(b.base || "");
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      {featured && (
        <div
          className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row rounded-lg overflow-hidden shadow"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="md:w-64 h-48 md:h-64 shrink-0">
            <img
              src={featured.image_url}
              alt={featured.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h2 className="font-titles text-2xl mb-2">
              Historia de los Cócteles
            </h2>
            <p className="font-buttons text-sm">
              Los cócteles nacieron en el siglo XIX en Estados Unidos, donde los
              bartenders comenzaron a mezclar licores con azúcar, agua y
              bitters. La palabra "cocktail" apareció por primera vez en 1806.
              Con la Prohibición (1920-1933), los cócteles evolucionaron para
              disimular el sabor del alcohol ilegal, dando lugar a recetas
              creativas que hoy son clásicos universales. Cada trago cuenta una
              historia de ingenio, cultura y tradición.
            </p>
          </div>
        </div>
      )}

      <h1 className="font-titles text-4xl text-center mb-6">Cocktails</h1>

      <div className="max-w-xl mx-auto mb-4 flex flex-col sm:flex-row gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border rounded font-body flex items-center gap-1 cursor-pointer shrink-0"
            style={{ backgroundColor: COLORS.card }}
          >
            <IoFilterOutline size={20} /> Filtros
          </button>
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded font-body bg-white min-w-0"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border rounded font-buttons cursor-pointer w-full sm:w-auto"
          style={{ backgroundColor: COLORS.card }}
        >
          <option value="">Ordenar por</option>
          <option value="name_asc">Nombre A-Z</option>
          <option value="name_desc">Nombre Z-A</option>
          <option value="flavor">Sabor</option>
          <option value="base">Base</option>
        </select>
      </div>

      {showFilters && (
        <div
          className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row gap-3 p-3 rounded border font-body"
          style={{ backgroundColor: COLORS.card }}
        >
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Sabor</label>
            <select
              value={flavorFilter}
              onChange={(e) => setFlavorFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todos</option>
              {flavors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
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
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todas</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {paginated.map((drink) => (
          <Link
            key={`${drink.isUserMix ? "mix" : "drink"}-${drink.id}`}
            href={
              drink.isUserMix ? `/mezclas/${drink.id}` : `/bebidas/${drink.id}`
            }
            className="rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow relative"
            style={{ backgroundColor: COLORS.card }}
          >
            {drink.image_url && (
              <img
                src={drink.image_url}
                alt={drink.name}
                className="w-full h-40 object-cover"
              />
            )}
            {drink.isUserMix && (
              <span
                className="absolute top-2 left-2 font-buttons text-xs px-2 py-1 rounded"
                style={{ backgroundColor: COLORS.primary, color: COLORS.card }}
              >
                Creación
              </span>
            )}
            {user && (
              <button
                onClick={(e) => toggleFavorite(e, drink)}
                className="absolute top-2 right-2 cursor-pointer"
              >
                <span className="bg-white rounded-full p-1 flex items-center justify-center">
                  {isFavorite(drink) ? (
                    <IoHeart color="red" size={22} />
                  ) : (
                    <IoHeartOutline size={22} />
                  )}
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="font-buttons px-3 py-2 rounded border disabled:opacity-40 cursor-pointer"
            style={{ backgroundColor: COLORS.card }}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="font-buttons px-3 py-2 rounded border cursor-pointer"
              style={{
                backgroundColor:
                  page === currentPage ? COLORS.primary : COLORS.card,
                color: page === currentPage ? COLORS.card : COLORS.text,
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="font-buttons px-3 py-2 rounded border disabled:opacity-40 cursor-pointer"
            style={{ backgroundColor: COLORS.card }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
