"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password: pass }),
    });

    if (res.ok) router.push("/admin");
    else setError("Credenciales incorrectas");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-xl border p-6">
        <h1 className="text-xl font-bold mb-4">Acceso Admin</h1>

        <label className="text-sm font-medium">Usuario</label>
        <input className="w-full border rounded-md p-2 mb-3"
          value={user} onChange={(e) => setUser(e.target.value)} />

        <label className="text-sm font-medium">Contraseña</label>
        <input type="password" className="w-full border rounded-md p-2 mb-3"
          value={pass} onChange={(e) => setPass(e.target.value)} />

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button className="w-full bg-primary-600 text-white rounded-md py-2 font-semibold">
          Entrar
        </button>
      </form>
    </div>
  );
}
