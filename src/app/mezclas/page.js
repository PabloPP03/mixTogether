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
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
      const { data: { user } } = await supabase.auth.getUser();
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

    setUploading(true);
    let imageUrl = form.image_url;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const payload = {
      ...form,
      image_url: imageUrl,
      user_id: user.id,
      ingredients: form.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
      steps: form.steps.split("\n").map((s) => s.trim()).filter(Boolean),
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

    setUploading(false);
    setImageFile(null);
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

  const uploadImage = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("cocktails").upload(fileName, file);
    if (error) { console.error("Error subiendo imagen:", error); return null; }

    const { data } = supabase.storage.from("cocktails").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const totalPages = Math.ceil(mezclas.length / itemsPerPage);
  const paginated = mezclas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <p className="font-body">Inicia sesión para acceder al área de mezclas.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: COLORS.background }}>
      <div className="flex justify-center mb-8">
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="font-buttons font-semibold px-6 py-3 rounded cursor-pointer"
          style={{ backgroundColor: COLORS.primary, color: COLORS.card }}
        >
          {showForm ? "Cancelar" : "Crear nueva mezcla"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow mb-10 font-body">
          <h2 className="font-titles text-2xl mb-4">{editingId ? "Editar mezcla" : "Nueva mezcla"}</h2>

          <label className="block mb-1 font-semibold">Tipo de bebida</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="cocktail" checked={form.type === "cocktail"} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              Cocktail
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="type" value="mocktail" checked={form.type === "mocktail"} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              Mocktail
            </label>
          </div>

          <label className="block mb-1 font-semibold">Nombre de la mezcla</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mb-4 p-2 border rounded" required />

          <label className="block mb-1 font-semibold">Descripción</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mb-4 p-2 border rounded" rows={3} />

          <label className="block mb-1 font-semibold">Imagen</label>
          <label
            className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded cursor-pointer font-buttons font-semibold gap-2"
            style={{ borderColor: COLORS.primary, color: COLORS.primary, backgroundColor: COLORS.background }}
          >
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
            {imageFile ? imageFile.name : "+ Subir imagen"}
          </label>
          {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-32 object-cover rounded mt-2 mb-4" />}
          {!imageFile && form.image_url && <img src={form.image_url} alt="Imagen actual" className="w-full h-32 object-cover rounded mt-2 mb-4" />}

          <label className="block mb-1 font-semibold">Categoría</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mb-4 p-2 border rounded font-buttons">
            <option value="">Selecciona una categoría</option>
            <option value="Old Fashioned">Old Fashioned</option>
            <option value="Sours">Sours</option>
            <option value="Daisies y Smashes">Daisies / Smashes</option>
            <option value="Fizzes y Collins">Fizzes / Collins</option>
            <option value="Martinis">Martinis</option>
            <option value="Highballs">Highballs</option>
          </select>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Sabor</label>
              <input type="text" value={form.flavor} onChange={(e) => setForm({ ...form, flavor: e.target.value })} className="w-full p-2 border rounded" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Base</label>
              <input type="text" value={form.base} onChange={(e) => setForm({ ...form, base: e.target.value })} className="w-full p-2 border rounded" />
            </div>
          </div>

          <label className="block mb-1 font-semibold">Ingredientes (separados por coma)</label>
          <input type="text" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full mb-4 p-2 border rounded" placeholder="5cl vodka, 3cl licor de café, ..." />

          <label className="block mb-1 font-semibold">Pasos (uno por línea)</label>
          <textarea
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            rows={4}
            placeholder={`Paso 1: Añade los ingredientes...\nPaso 2: Mezcla bien...\nPaso 3: Sirve frío...`}
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="font-buttons px-6 py-2 rounded border cursor-pointer">Cancelar</button>
            <button type="submit" disabled={uploading} className="font-buttons px-6 py-2 rounded font-semibold cursor-pointer" style={{ backgroundColor: COLORS.primary, color: COLORS.card }}>
              {uploading ? "Subiendo..." : "Guardar"}
            </button>
          </div>
        </form>
      )}

      <h2 className="font-titles text-3xl mb-4 text-center">Mis mezclas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {paginated.map((m) => (
          <div key={m.id} className="bg-white rounded shadow p-4 font-body">
            <Link href={`/mezclas/${m.id}`}>
              {m.image_url && <img src={m.image_url} alt={m.name} className="w-full h-32 object-cover rounded mb-2" />}
              <h3 className="font-titles text-xl">{m.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{m.flavor} {m.base}</p>
            </Link>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(m)} className="font-buttons text-sm px-3 py-1 rounded border cursor-pointer">Editar</button>
              <button onClick={() => handleDelete(m.id)} className="font-buttons text-sm px-3 py-1 rounded border text-red-600 cursor-pointer">Borrar</button>
            </div>
          </div>
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
                backgroundColor: page === currentPage ? COLORS.primary : COLORS.card,
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