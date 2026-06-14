"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function MezclaDetailPage() {
  const { id } = useParams();
  const [mix, setMix] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [favId, setFavId] = useState(null);

  useEffect(() => {
    fetch(`/api/mezclas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMix(data);
        setLoading(false);
      });

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);

        const { data: fav } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("mix_id", id)
          .single();

        if (fav) {
          setIsFavorite(true);
          setFavId(fav.id);
        }
      }

      const { count } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("mix_id", id);

      setLikeCount(count || 0);
    };
    init();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) return;

    if (isFavorite && favId) {
      await fetch(`/api/favoritos/${favId}`, { method: "DELETE" });
      setIsFavorite(false);
      setFavId(null);
      setLikeCount((c) => c - 1);
    } else {
      const res = await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, mix_id: id }),
      });
      const newFav = await res.json();
      setIsFavorite(true);
      setFavId(newFav.id);
      setLikeCount((c) => c + 1);
    }
  };

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
          <div className="flex-1">
            <h1 className="font-titles text-4xl mb-4">{mix.name}</h1>
            <p className="font-body mb-4">{mix.description}</p>

            <div className="flex gap-8 mb-4">
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

            <button
              onClick={toggleFavorite}
              className="flex items-center gap-2 font-buttons font-semibold px-4 py-2 rounded border"
              style={{ backgroundColor: COLORS.card }}
            >
              {isFavorite ? <IoHeart color="red" size={22} /> : <IoHeartOutline size={22} />}
              <span>{likeCount} Me gusta</span>
            </button>
            {!user && <p className="font-body text-xs text-gray-500 mt-1">Inicia sesión para guardar favoritos</p>}
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
            <ol className="space-y-4">
              {mix.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-titles text-xl shrink-0" style={{ color: COLORS.text }}>
                    Paso {i + 1}.
                  </span>
                  <p className="font-body">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}