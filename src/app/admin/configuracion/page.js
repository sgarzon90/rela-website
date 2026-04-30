"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser"

// ─── Modal de edición ─────────────────────────────────────────────────────────
function ModalEditar({ item, campos, onSave, onClose }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    const initial = {};
    campos.forEach((c) => {
      initial[c.key] = item[c.key] ?? "";
    });
    setForm(initial);
  }, [item]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Editar</h3>
        <div className="space-y-3">
          {campos.map((campo) => (
            <div key={campo.key}>
              <label className="block text-xs text-gray-500 mb-1">
                {campo.placeholder}
              </label>
              <input
                type={campo.type || "text"}
                value={form[campo.key] || ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [campo.key]: e.target.value }))
                }
                className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave(form)}
            className="flex-1 bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Guardar cambios
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 text-sm text-gray-600 hover:border-black transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sección CRUD ─────────────────────────────────────────────────────────────
function SeccionCRUD({ titulo, items, onAdd, onEdit, onDelete, campos }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null);

  const puedeAgregar = campos.every((c) => form[c.key]);

  const handleAdd = async () => {
    if (!puedeAgregar) return;
    setLoading(true);
    await onAdd(form);
    setForm({});
    setLoading(false);
  };

  const handleEdit = async (formEditado) => {
    await onEdit(editando.id, formEditado);
    setEditando(null);
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4">{titulo}</h2>

      {/* Formulario agregar */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {campos.map((campo) => (
          <input
            key={campo.key}
            type={campo.type || "text"}
            value={form[campo.key] || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [campo.key]: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={campo.placeholder}
            className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black flex-1 min-w-[140px]"
          />
        ))}
        <button
          onClick={handleAdd}
          disabled={loading || !puedeAgregar}
          className="bg-black text-white px-5 py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? "Guardando..." : "+ Agregar"}
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {items.length === 0 && (
          <p className="text-sm text-gray-400">
            No hay {titulo.toLowerCase()} aún.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-800 font-medium">
                {item.nombre}
              </span>
              {item.slug && (
                <span className="text-xs text-gray-400">/{item.slug}</span>
              )}
              {item.orden !== undefined && item.orden !== null && (
                <span className="text-xs text-gray-400">
                  orden: {item.orden}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => setEditando(item)}
                className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
              >
                Editar
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => onDelete(item.id)}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <ModalEditar
          item={editando}
          campos={campos}
          onSave={handleEdit}
          onClose={() => setEditando(null)}
        />
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [categorias, setCategorias] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [msg, setMsg] = useState(null);

  const notify = (texto, ok = true) => {
    setMsg({ texto, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    const [{ data: cats }, { data: cols }, { data: tals }] = await Promise.all([
      supabase.from("categorias").select("*").order("nombre"),
      supabase.from("colores").select("*").order("nombre"),
      supabase.from("tallas").select("*").order("orden"),
    ]);
    setCategorias(cats || []);
    setColores(cols || []);
    setTallas(tals || []);
  };

  // ── Categorías ────────────────────────────────────────────────────────────
  const addCategoria = async (form) => {
    const slug = form.nombre
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase
      .from("categorias")
      .insert({ nombre: form.nombre, slug });
    error
      ? notify("Error: " + error.message, false)
      : (notify("Categoría creada ✓"), cargarTodo());
  };
  const editCategoria = async (id, form) => {
    const slug = form.nombre
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase
      .from("categorias")
      .update({ nombre: form.nombre, slug })
      .eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Categoría actualizada ✓"), cargarTodo());
  };
  const deleteCategoria = async (id) => {
    if (
      !confirm(
        "¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.",
      )
    )
      return;
    const { error } = await supabase.from("categorias").delete().eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Categoría eliminada"), cargarTodo());
  };

  // ── Colores ───────────────────────────────────────────────────────────────
  const addColor = async (form) => {
    const { error } = await supabase
      .from("colores")
      .insert({ nombre: form.nombre });
    error
      ? notify("Error: " + error.message, false)
      : (notify("Color creado ✓"), cargarTodo());
  };
  const editColor = async (id, form) => {
    const { error } = await supabase
      .from("colores")
      .update({ nombre: form.nombre })
      .eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Color actualizado ✓"), cargarTodo());
  };
  const deleteColor = async (id) => {
    if (!confirm("¿Eliminar este color?")) return;
    const { error } = await supabase.from("colores").delete().eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Color eliminado"), cargarTodo());
  };

  // ── Tallas ────────────────────────────────────────────────────────────────
  const addTalla = async (form) => {
    const { error } = await supabase
      .from("tallas")
      .insert({ nombre: form.nombre, orden: parseInt(form.orden) || 0 });
    error
      ? notify("Error: " + error.message, false)
      : (notify("Talla creada ✓"), cargarTodo());
  };
  const editTalla = async (id, form) => {
    const { error } = await supabase
      .from("tallas")
      .update({ nombre: form.nombre, orden: parseInt(form.orden) || 0 })
      .eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Talla actualizada ✓"), cargarTodo());
  };
  const deleteTalla = async (id) => {
    if (!confirm("¿Eliminar esta talla?")) return;
    const { error } = await supabase.from("tallas").delete().eq("id", id);
    error
      ? notify("Error: " + error.message, false)
      : (notify("Talla eliminada"), cargarTodo());
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">Configuración</h1>
      <p className="text-sm text-gray-500 mb-8">
        Gestiona las categorías, colores y tallas disponibles en la tienda.
      </p>

      {msg && (
        <div
          className={`mb-6 px-4 py-3 text-sm font-medium border ${
            msg.ok
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {msg.texto}
        </div>
      )}

      <div className="space-y-6">
        <SeccionCRUD
          titulo="Categorías"
          items={categorias}
          onAdd={addCategoria}
          onEdit={editCategoria}
          onDelete={deleteCategoria}
          campos={[{ key: "nombre", placeholder: "Ej: Camisetas" }]}
        />

        <SeccionCRUD
          titulo="Colores"
          items={colores}
          onAdd={addColor}
          onEdit={editColor}
          onDelete={deleteColor}
          campos={[{ key: "nombre", placeholder: "Ej: Beige" }]}
        />

        <SeccionCRUD
          titulo="Tallas"
          items={tallas}
          onAdd={addTalla}
          onEdit={editTalla}
          onDelete={deleteTalla}
          campos={[
            { key: "nombre", placeholder: "Ej: XL" },
            { key: "orden", placeholder: "Orden (ej: 5)", type: "number" },
          ]}
        />
      </div>
    </div>
  );
}
