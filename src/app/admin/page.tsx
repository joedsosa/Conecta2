"use client";

import { useEffect, useMemo, useState } from "react";

type Job = {
  id: number;
  title: string;
  description: string;
  location: string | null;
  type: string | null;
  active: boolean;
  createdAt: string;
};

const emptyForm = {
  title: "",
  description: "",
  location: "",
  type: "",
  active: true,
};

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function loadJobs() {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs?all=1", { cache: "no-store" });
      const data = await res.json();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function startEdit(job: Job) {
    setEditingId(job.id);
    setForm({
      title: job.title ?? "",
      description: job.description ?? "",
      location: job.location ?? "",
      type: job.type ?? "",
      active: job.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (!form.title.trim() || !form.description.trim()) {
        alert("Título y descripción son obligatorios.");
        return;
      }

      if (isEditing) {
        const res = await fetch(`/api/jobs/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            location: form.location?.trim() || null,
            type: form.type?.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Error actualizando plaza");
      } else {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            location: form.location?.trim() || null,
            type: form.type?.trim() || null,
          }),
        });
        if (!res.ok) throw new Error("Error creando plaza");
      }

      resetForm();
      await loadJobs();
    } catch (err: any) {
      alert(err?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  async function removeJob(id: number) {
    const ok = confirm("¿Eliminar esta plaza? Esto no se puede deshacer.");
    if (!ok) return;

    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("No se pudo eliminar.");
      return;
    }
    await loadJobs();
  }

  async function toggleActive(job: Job) {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.type,
        active: !job.active,
      }),
    });

    if (!res.ok) {
      alert("No se pudo cambiar el estado.");
      return;
    }
    await loadJobs();
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin · Plazas</h1>
            <p className="text-gray-600 mt-1">
              Crea, edita o elimina plazas. Las plazas <b>activas</b> se ven en la página principal.
            </p>
          </div>
        </header>

        {/* FORM */}
        <section className="border rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold">
              {isEditing ? `Editando plaza #${editingId}` : "Nueva plaza"}
            </h2>

            {isEditing && (
              <button
                onClick={resetForm}
                className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
              >
                Cancelar edición
              </button>
            )}
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Título *</label>
              <input
                className="w-full border rounded-md p-2 mt-1"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ej: Auxiliar de cocina"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Descripción *</label>
              <textarea
                className="w-full border rounded-md p-2 mt-1 min-h-[110px]"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Funciones, requisitos, horario, etc."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Ubicación</label>
              <input
                className="w-full border rounded-md p-2 mt-1"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Ej: Tegucigalpa"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tipo</label>
              <input
                className="w-full border rounded-md p-2 mt-1"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                placeholder="Ej: Tiempo completo / Medio tiempo"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
              />
              <label htmlFor="active" className="text-sm font-medium">
                Plaza activa (visible en la web)
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                disabled={saving}
                className="px-4 py-2 rounded-md bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
              >
                {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar plaza"}
              </button>
              <button
                type="button"
                onClick={loadJobs}
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                Refrescar lista
              </button>
            </div>
          </form>
        </section>

        {/* LISTADO */}
        <section className="border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Plazas</h2>
            {loading && <span className="text-sm text-gray-500">Cargando...</span>}
          </div>

          <div className="space-y-3">
            {jobs.length === 0 && !loading && (
              <p className="text-gray-600">No hay plazas todavía.</p>
            )}

            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        job.active ? "bg-green-50" : "bg-gray-50"
                      }`}
                    >
                      {job.active ? "Activa" : "Inactiva"}
                    </span>
                    {(job.location || job.type) && (
                      <span className="text-xs text-gray-500">
                        {job.location ? job.location : ""}
                        {job.location && job.type ? " · " : ""}
                        {job.type ? job.type : ""}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                <div className="flex gap-2 md:flex-col md:items-end">
                  <button
                    onClick={() => startEdit(job)}
                    className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => toggleActive(job)}
                    className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                  >
                    {job.active ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    onClick={() => removeJob(job.id)}
                    className="px-3 py-2 rounded-md border text-red-600 hover:bg-red-50 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
