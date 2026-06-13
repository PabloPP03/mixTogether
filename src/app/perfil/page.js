"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";
import { IoHeart } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", bio: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      setForm({
        username: profileData?.username || "",
        bio: profileData?.bio || "",
      });

      const res = await fetch(`/api/favoritos?user_id=${session.user.id}`);
      const favData = await res.json();
      setFavorites(favData);

      setLoading(false);
    };
    init();
  }, []);

  const handleSave = async () => {
    await supabase
      .from("profiles")
      .update({ username: form.username, bio: form.bio })
      .eq("id", user.id);

    setProfile({ ...profile, username: form.username, bio: form.bio });
    setEditing(false);
  };

  const handleRemoveFavorite = async (favId) => {
    await fetch(`/api/favoritos/${favId}`, { method: "DELETE" });
    setFavorites(favorites.filter((f) => f.id !== favId));
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <p className="font-body">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <p className="font-body">Inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: COLORS.card }}
          >
            <IoPerson size={60} />
          </div>

          {editing ? (
            <div className="flex-1 w-full">
              <label className="block font-body font-semibold mb-1">
                Nombre:
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full mb-3 p-2 border rounded font-body"
              />
              <p className="font-body font-semibold mb-1">
                Email: {profile?.email}
              </p>
              <label className="block font-body font-semibold mb-1">
                Biografía:
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full mb-3 p-2 border rounded font-body"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="font-buttons px-4 py-2 rounded font-semibold"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.card,
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="font-buttons px-4 py-2 rounded border"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-body">
                <span className="font-semibold">Nombre:</span>{" "}
                {profile?.username || "-"}
              </p>
              <p className="font-body">
                <span className="font-semibold">Email:</span> {profile?.email}
              </p>
              <p className="font-body mb-3">
                <span className="font-semibold">Biografía:</span>{" "}
                {profile?.bio || "-"}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="font-buttons px-4 py-2 rounded font-semibold"
                style={{ backgroundColor: COLORS.primary, color: COLORS.card }}
              >
                Editar perfil
              </button>
            </div>
          )}
        </div>

        <h2 className="font-titles text-3xl mb-4">Bebidas Favoritas</h2>

        {favorites.length === 0 ? (
          <p className="font-body text-gray-500">
            Aún no tienes bebidas favoritas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((fav) => {
              const item = fav.drinks || fav.mixes;
              if (!item) return null;
              return (
                <Link
                  key={fav.id}
                  href={fav.drinks ? `/bebidas/${item.id}` : "#"}
                  className="rounded-lg shadow overflow-hidden relative"
                  style={{ backgroundColor: COLORS.card }}
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-titles text-lg">{item.name}</h3>
                    <p className="font-body text-xs uppercase text-gray-600">
                      {item.flavor} {item.base}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavorite(fav.id);
                    }}
                    className="absolute top-2 right-2 text-xl"
                  >
                    <span className="bg-white rounded-full p-1 flex items-center justify-center">
                        <IoHeart color="red" size={22} />
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
