"use client";

import { useState } from "react";

type Mode = "persona" | "empresa";

export function JobApplicationForm() {
  const [mode, setMode] = useState<Mode>("persona");

  return (
    <section id="aplica" className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* TITULO */}
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">
          Aplica con Conecta2
        </h2>
        <p className="text-center text-gray-600 mb-6">
          ¿Eres <strong>persona</strong> o <strong>empresa</strong>?
        </p>

        {/* BOTONES */}
        <div className="flex gap-3 justify-center mb-8">
          <button
            type="button"
            onClick={() => setMode("persona")}
            className={`px-5 py-2 rounded-lg border text-sm font-semibold transition ${
              mode === "persona"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"
            }`}
          >
            Soy persona (busco empleo)
          </button>

          <button
            type="button"
            onClick={() => setMode("empresa")}
            className={`px-5 py-2 rounded-lg border text-sm font-semibold transition ${
              mode === "empresa"
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-primary-300"
            }`}
          >
            Soy empresa (busco personal)
          </button>
        </div>

        {/* FORM */}
        {mode === "persona" ? <PersonaForm /> : <EmpresaForm />}
      </div>
    </section>
  );
}

/** ✅ TU FORMULARIO ACTUAL (persona) */
function PersonaForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      position: formData.get("position"),
      cvUrl: formData.get("cvUrl"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/job-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      setSuccess("Tu solicitud se envió correctamente. ¡Gracias!");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const inputBaseClasses =
    "w-full rounded-md border bg-white border-primary-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600";

  return (
    <>
      <p className="text-center text-gray-600 mb-8">
        Déjanos tus datos y nuestro equipo te contactará cuando tengamos una
        vacante que se adapte a tu perfil.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Nombre completo *
            </label>
            <input name="name" required className={inputBaseClasses} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Correo electrónico *
            </label>
            <input type="email" name="email" required className={inputBaseClasses} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Teléfono / WhatsApp
            </label>
            <input name="phone" className={inputBaseClasses} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Puesto o área de interés
            </label>
            <input
              name="position"
              className={inputBaseClasses}
              placeholder="Ej: Recursos humanos, atención al cliente..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Link a tu CV (Drive, Dropbox, etc.)
          </label>
          <input name="cvUrl" className={inputBaseClasses} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Mensaje adicional
          </label>
          <textarea
            name="message"
            rows={4}
            className={inputBaseClasses}
            placeholder="Cuéntanos brevemente tu experiencia o qué tipo de empleo buscas."
          />
        </div>

        {success && (
          <p className="text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
            {success}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </>
  );
}

/** ✅ NUEVO FORMULARIO (empresa) */
function EmpresaForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputBaseClasses =
    "w-full rounded-md border bg-white border-primary-600 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload = {
      companyName: formData.get("companyName"),
      contactName: formData.get("contactName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      positions: formData.get("positions"),
      details: formData.get("details"),
    };

    try {
      const res = await fetch("/api/company-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error en el servidor");

      setSuccess("Tu solicitud como empresa se envió correctamente. ¡Gracias!");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al enviar tu solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="text-center text-gray-600 mb-8">
        Déjanos los datos de tu empresa y el tipo de personal que necesitas. Esto
        llegará al correo del admin.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Empresa *
            </label>
            <input name="companyName" required className={inputBaseClasses} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Nombre de contacto *
            </label>
            <input name="contactName" required className={inputBaseClasses} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Correo *
            </label>
            <input type="email" name="email" required className={inputBaseClasses} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Teléfono / WhatsApp
            </label>
            <input name="phone" className={inputBaseClasses} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Ciudad
            </label>
            <input name="city" className={inputBaseClasses} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Puesto(s) que necesita *
            </label>
            <input
              name="positions"
              required
              className={inputBaseClasses}
              placeholder="Ej: mesero, cocinero, cajero..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-800">
            Detalles (horarios, experiencia, salario opcional, etc.)
          </label>
          <textarea name="details" rows={4} className={inputBaseClasses} />
        </div>

        {success && (
          <p className="text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
            {success}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </>
  );
}
