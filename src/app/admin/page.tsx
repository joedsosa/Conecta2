"use client";

import { useEffect, useMemo, useState } from "react";

type Job = {
  id: number;
  title: string;
  description: string;
  location: string | null;
  type: string | null;
  active: boolean;

  status: "OPEN" | "FILLED";
  deletedAt: string | null;

  hiredName?: string | null;
  hiredContact?: string | null;
  hiredNotes?: string | null;
  filledAt?: string | null;

  createdAt: string;
};

const emptyForm = {
  title: "",
  description: "",
  location: "",
  type: "",
  active: true,
};

type Tab = "PUBLISHED" | "HIDDEN" | "FILLED" | "DELETED" | "ALL";

function fmtDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "";
  }
}

function fmtShortDate(d?: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "—";
  }
}

type HiringReport = {
  ok: boolean;
  totals: {
    totalAllTime: number;
    hiredThisWeek: number;
    hiredThisMonth: number;
    hiredThisYear: number;
    hiredLast7: number;
    hiredLast30: number;
    hiredLast365: number;
  };
  recentHires: Array<{
    id: number;
    title: string;
    filledAt: string | null;
    hiredName: string | null;
    hiredContact: string | null;
    hiredNotes: string | null;
  }>;
};

function downloadCSV(rows: any[], filename: string) {
  if (!rows || rows.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }
  const headers = Object.keys(rows[0] ?? {});
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers
        .map((h) => {
          const val = r[h] ?? "";
          const s = String(val).replaceAll('"', '""');
          return `"${s}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function HiringReportPanel() {
  const [rep, setRep] = useState<HiringReport | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/reports/hiring", { cache: "no-store" });
      const data = (await r.json()) as HiringReport;
      setRep(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (!rep?.ok) {
    return (
      <section className="border rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Informes · Contrataciones</h2>
          <button
            onClick={load}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>
        </div>
        <p className="text-gray-600 mt-3">
          No se pudo cargar el informe (verifica que estés logueado como admin).
        </p>
      </section>
    );
  }

  const t = rep.totals;

  return (
    <section className="border rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">Informes · Contrataciones</h2>
          <p className="text-sm text-gray-600 mt-1">
            Métricas automáticas basadas en plazas completadas (FILLED).
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>

          {/* PDF */}
          <button
            onClick={() => window.open("/api/admin/reports/hiring/pdf", "_blank")}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            Ver PDF
          </button>

          {/* CSV */}
          <button
            onClick={() => {
              const rows = rep.recentHires.map((x) => ({
                id: x.id,
                plaza: x.title,
                contratado: x.hiredName ?? "",
                contacto: x.hiredContact ?? "",
                fecha: x.filledAt ?? "",
                notas: x.hiredNotes ?? "",
              }));
              downloadCSV(rows, "contrataciones_recientes.csv");
            }}
            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
          >
            Descargar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Semana (lun-dom)</div>
          <div className="text-2xl font-extrabold">{t.hiredThisWeek}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Mes</div>
          <div className="text-2xl font-extrabold">{t.hiredThisMonth}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Año</div>
          <div className="text-2xl font-extrabold">{t.hiredThisYear}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Total histórico</div>
          <div className="text-2xl font-extrabold">{t.totalAllTime}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Últimos 7 días</div>
          <div className="text-xl font-bold">{t.hiredLast7}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Últimos 30 días</div>
          <div className="text-xl font-bold">{t.hiredLast30}</div>
        </div>
        <div className="rounded-xl border p-3">
          <div className="text-xs text-gray-500">Últimos 365 días</div>
          <div className="text-xl font-bold">{t.hiredLast365}</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="mt-5">
        <div className="font-semibold text-gray-900">Contrataciones recientes</div>
        <div className="mt-2 overflow-auto border rounded-xl">
          <table className="min-w-[780px] w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Fecha</th>
                <th className="p-3">Plaza</th>
                <th className="p-3">Contratado</th>
                <th className="p-3">Contacto</th>
                <th className="p-3">Notas</th>
              </tr>
            </thead>
            <tbody>
              {rep.recentHires.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-600" colSpan={5}>
                    No hay contrataciones registradas aún.
                  </td>
                </tr>
              ) : (
                rep.recentHires.map((x) => (
                  <tr key={x.id} className="border-t align-top">
                    <td className="p-3">{fmtShortDate(x.filledAt)}</td>
                    <td className="p-3">
                      <div className="font-medium">{x.title}</div>
                      <div className="text-xs text-gray-400">#{x.id}</div>
                    </td>
                    <td className="p-3">{x.hiredName ?? "—"}</td>
                    <td className="p-3">{x.hiredContact ?? "—"}</td>
                    <td className="p-3 whitespace-pre-line">{x.hiredNotes ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [tab, setTab] = useState<Tab>("PUBLISHED");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  // modal completar
  const [fillOpen, setFillOpen] = useState(false);
  const [fillJob, setFillJob] = useState<Job | null>(null);
  const [hiredName, setHiredName] = useState("");
  const [hiredContact, setHiredContact] = useState("");
  const [hiredNotes, setHiredNotes] = useState("");

  async function loadJobs(nextTab: Tab = tab) {
    setLoading(true);
    try {
      let url = "/api/jobs?admin=1&all=1";

      if (nextTab === "FILLED") url = "/api/jobs?admin=1&filled=1";
      if (nextTab === "DELETED") url = "/api/jobs?admin=1&deleted=1";
      if (nextTab === "ALL") url = "/api/jobs?admin=1&all=1";
      if (nextTab === "PUBLISHED") url = "/api/jobs?admin=1&all=1";
      if (nextTab === "HIDDEN") url = "/api/jobs?admin=1&all=1";

      const res = await fetch(url, { cache: "no-store" });
      const data = (await res.json()) as Job[];

      if (nextTab === "PUBLISHED") {
        setJobs(data.filter((j) => !j.deletedAt && j.status !== "FILLED" && j.active === true));
      } else if (nextTab === "HIDDEN") {
        setJobs(data.filter((j) => !j.deletedAt && j.status !== "FILLED" && j.active === false));
      } else {
        setJobs(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeTab(next: Tab) {
    setTab(next);
    setEditingId(null);
    setForm({ ...emptyForm });
    loadJobs(next);
  }

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
      await loadJobs(tab);
    } catch (err: any) {
      alert(err?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  async function removeJob(id: number) {
    const ok = confirm("¿Eliminar esta plaza de la web pública? (Se guardará como registro en Admin)");
    if (!ok) return;

    const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("No se pudo eliminar.");
      return;
    }
    await loadJobs(tab);
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
    await loadJobs(tab);
  }

  function openFill(job: Job) {
    setFillJob(job);
    setHiredName(job.hiredName ?? "");
    setHiredContact(job.hiredContact ?? "");
    setHiredNotes(job.hiredNotes ?? "");
    setFillOpen(true);
  }

  function closeFill() {
    setFillOpen(false);
    setFillJob(null);
    setHiredName("");
    setHiredContact("");
    setHiredNotes("");
  }

  async function confirmFill() {
    if (!fillJob) return;

    if (!hiredName.trim()) {
      alert("Poné al menos el nombre de la persona contratada.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${fillJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fill: true,
          hiredName: hiredName.trim(),
          hiredContact: hiredContact.trim() || null,
          hiredNotes: hiredNotes.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("No se pudo marcar como completada.");

      closeFill();
      await loadJobs(tab);
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  async function unfillJob(job: Job) {
    const ok = confirm("¿Reabrir esta plaza? (volverá a estado OPEN)");
    if (!ok) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unfill: true }),
      });

      if (!res.ok) throw new Error("No se pudo reabrir la plaza.");
      await loadJobs(tab);
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  async function restoreJob(job: Job) {
    const ok = confirm("¿Restaurar esta plaza eliminada?");
    if (!ok) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      if (!res.ok) throw new Error("No se pudo restaurar.");

      await loadJobs(tab);
    } catch (e: any) {
      alert(e?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin · Plazas</h1>
            <p className="text-gray-600 mt-1">
              Publica, edita, oculta, completa o elimina plazas. Las plazas visibles se muestran en la página principal.
            </p>
          </div>
        </header>

        {/* TABS */}
        <section className="border rounded-2xl p-4">
          <div className="flex flex-wrap gap-2">
            {(["PUBLISHED","HIDDEN","FILLED","DELETED","ALL"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => changeTab(t)}
                className={`px-3 py-2 rounded-md border text-sm ${
                  tab === t ? "bg-primary-600 text-white border-primary-600" : "hover:bg-gray-50"
                }`}
              >
                {t === "PUBLISHED" && "Publicadas"}
                {t === "HIDDEN" && "No visibles"}
                {t === "FILLED" && "Completadas"}
                {t === "DELETED" && "Eliminadas"}
                {t === "ALL" && "Todas"}
              </button>
            ))}

            <button
              type="button"
              onClick={() => loadJobs(tab)}
              className="ml-auto px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
            >
              Refrescar
            </button>
          </div>
        </section>

        {/* FORM */}
        {tab !== "DELETED" && tab !== "FILLED" && (
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
                  Visible en la web (activa)
                </label>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                >
                  {saving ? "Guardando..." : isEditing ? "Guardar cambios" : "Publicar plaza"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* LISTADO */}
        <section className="border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {tab === "PUBLISHED" && "Plazas publicadas"}
              {tab === "HIDDEN" && "Plazas no visibles"}
              {tab === "FILLED" && "Plazas completadas"}
              {tab === "DELETED" && "Plazas eliminadas"}
              {tab === "ALL" && "Todas las plazas"}
            </h2>
            {loading && <span className="text-sm text-gray-500">Cargando...</span>}
          </div>

          <div className="space-y-3">
            {jobs.length === 0 && !loading && (
              <p className="text-gray-600">No hay plazas en esta categoría.</p>
            )}

            {jobs.map((job) => {
              const badge = job.deletedAt
                ? "Eliminada"
                : job.status === "FILLED"
                ? "Completada"
                : job.active
                ? "Activa"
                : "Inactiva";

              return (
                <div
                  key={job.id}
                  className="rounded-xl border p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900">{job.title}</h3>

                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          job.deletedAt
                            ? "bg-red-50"
                            : job.status === "FILLED"
                            ? "bg-blue-50"
                            : job.active
                            ? "bg-green-50"
                            : "bg-gray-50"
                        }`}
                      >
                        {badge}
                      </span>

                      {(job.location || job.type) && (
                        <span className="text-xs text-gray-500">
                          {[job.location, job.type].filter(Boolean).join(" · ")}
                        </span>
                      )}

                      <span className="text-xs text-gray-400">
                        #{job.id} · {fmtDate(job.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                      {job.description}
                    </p>

                    {job.status === "FILLED" && (
                      <div className="mt-3 rounded-lg border bg-gray-50 p-3 text-sm">
                        <div className="font-semibold text-gray-800">Registro de contratación</div>
                        <div className="text-gray-700 mt-1">
                          <div><b>Contratado:</b> {job.hiredName ?? "—"}</div>
                          <div><b>Contacto:</b> {job.hiredContact ?? "—"}</div>
                          <div><b>Fecha:</b> {fmtDate(job.filledAt) || "—"}</div>
                          {job.hiredNotes && (
                            <div className="mt-2 whitespace-pre-line"><b>Notas:</b>{"\n"}{job.hiredNotes}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {job.deletedAt && (
                      <div className="mt-2 text-xs text-gray-500">
                        Eliminada el: {fmtDate(job.deletedAt)}
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 md:flex-col md:items-end">
                    {!job.deletedAt && (
                      <>
                        <button
                          onClick={() => startEdit(job)}
                          className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                        >
                          Editar
                        </button>

                        {job.status !== "FILLED" && (
                          <button
                            onClick={() => toggleActive(job)}
                            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                          >
                            {job.active ? "Ocultar" : "Publicar"}
                          </button>
                        )}

                        {job.status === "OPEN" && (
                          <button
                            onClick={() => openFill(job)}
                            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                          >
                            Marcar completada
                          </button>
                        )}

                        {job.status === "FILLED" && (
                          <button
                            disabled={saving}
                            onClick={() => unfillJob(job)}
                            className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                          >
                            Reabrir (volver a OPEN)
                          </button>
                        )}

                        <button
                          onClick={() => removeJob(job.id)}
                          className="px-3 py-2 rounded-md border text-red-600 hover:bg-red-50 text-sm"
                        >
                          Eliminar
                        </button>
                      </>
                    )}

                    {job.deletedAt && (
                      <button
                        disabled={saving}
                        onClick={() => restoreJob(job)}
                        className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                      >
                        Restaurar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INFORMES */}
        <HiringReportPanel />

        {/* MODAL COMPLETAR */}
        {fillOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30" onClick={closeFill} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white border p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">Marcar plaza como completada</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Guarda el registro de a quién se contrató.
                  </p>
                </div>
                <button
                  className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
                  onClick={closeFill}
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium">Nombre contratado *</label>
                  <input
                    className="w-full border rounded-md p-2 mt-1"
                    value={hiredName}
                    onChange={(e) => setHiredName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contacto (tel/email)</label>
                  <input
                    className="w-full border rounded-md p-2 mt-1"
                    value={hiredContact}
                    onChange={(e) => setHiredContact(e.target.value)}
                    placeholder="Ej: +504 9999-9999 / correo@..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Notas internas</label>
                  <textarea
                    className="w-full border rounded-md p-2 mt-1 min-h-[90px]"
                    value={hiredNotes}
                    onChange={(e) => setHiredNotes(e.target.value)}
                    placeholder="Ej: fecha de inicio, condiciones, observaciones..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={closeFill}
                    className="px-4 py-2 rounded-md border hover:bg-gray-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    disabled={saving}
                    onClick={confirmFill}
                    className="px-4 py-2 rounded-md bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60 text-sm"
                  >
                    {saving ? "Guardando..." : "Confirmar completada"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
