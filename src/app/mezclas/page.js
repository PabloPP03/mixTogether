"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";
import Link from "next/link";

export default function MezclasPage() {
  const [user, setUser] = useState(null);
  const [mezclas, setMezclas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    type: "cocktail",
    name: "",
    description: "",
    image_url: "",
    category: "",
    flavor: "",
    base: "",
    ingredients: "",
    steps: "",
  });

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchMezclas(user.id);
    };
    init();
  }, []);

  const fetchMezclas = async (userId) => {
    const res = await fetch(`/api/mezclas?user_id=${userId}`);
    const data = await res.json();
    setMezclas(data);
  };

  const resetForm = () => {
    setForm({
      type: "cocktail",
      name: "",
      description: "",
      image_url: "",
      category: "",
      flavor: "",
      base: "",
      ingredients: "",
      steps: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      ...form,
      user_id: user.id,
      ingredients: form.ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      steps: form.steps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await fetch(`/api/mezclas/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/mezclas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    fetchMezclas(user.id);
  };

  const handleEdit = (mezcla) => {
    setForm({
      type: mezcla.type,
      name: mezcla.name,
      description: mezcla.description || "",
      image_url: mezcla.image_url || "",
      category: mezcla.category || "",
      flavor: mezcla.flavor || "",
      base: mezcla.base || "",
      ingredients: (mezcla.ingredients || []).join(", "),
      steps: (mezcla.steps || []).join("\n"),
    });
    setEditingId(mezcla.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Borrar esta mezcla?")) return;
    await fetch(`/api/mezclas/${id}`, { method: "DELETE" });
    fetchMezclas(user.id);
  };

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLORS.background }}
      >
        <p className="font-body">
          Inicia sesión para acceder al área de mezclas.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="font-buttons font-semibold px-6 py-3 rounded"
          style={{ backgroundColor: COLORS.primary, color: COLORS.card }}
        >
          {showForm ? "Cancelar" : "Crear nueva mezcla"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 rounded shadow mb-10 font-body"
        >
          <h2 className="font-titles text-2xl mb-4">
            {editingId ? "Editar mezcla" : "Nueva mezcla"}
          </h2>

          <label className="block mb-1 font-semibold">Tipo de bebida</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="cocktail"
                checked={form.type === "cocktail"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              Cocktail
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="mocktail"
                checked={form.type === "mocktail"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />
              Mocktail
            </label>
          </div>

          <label className="block mb-1 font-semibold">
            Nombre de la mezcla
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label className="block mb-1 font-semibold">Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            rows={3}
          />

          <label className="block mb-1 font-semibold">Imagen (URL)</label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="https://..."
          />

          <label className="block mb-1 font-semibold">Categoría</label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Sabor</label>
              <input
                type="text"
                value={form.flavor}
                onChange={(e) => setForm({ ...form, flavor: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Base</label>
              <input
                type="text"
                value={form.base}
                onChange={(e) => setForm({ ...form, base: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <label className="block mb-1 font-semibold">
            Ingredientes (separados por coma)
          </label>
          <input
            type="text"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            placeholder="5cl vodka, 3cl licor de café, ..."
          />

          <label className="block mb-1 font-semibold">
            Pasos (uno por línea)
          </label>
          <textarea
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            rows={4}
            placeholder="Paso 1: ...&#10;Paso 2: ..."
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="font-buttons px-6 py-2 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="font-buttons px-6 py-2 rounded font-semibold"
              style={{ backgroundColor: COLORS.primary, color: COLORS.card }}
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      <h2 className="font-titles text-3xl mb-4 text-center">Mis mezclas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {mezclas.map((m) => (
          <div key={m.id} className="bg-white rounded shadow p-4 font-body">
            <Link href={`/mezclas/${m.id}`}>
              {m.image_url && (
                <img
                  src={m.image_url}
                  alt={m.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-titles text-xl">{m.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {m.flavor} {m.base}
              </p>
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(m)}
                className="font-buttons text-sm px-3 py-1 rounded border"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="font-buttons text-sm px-3 py-1 rounded border text-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
