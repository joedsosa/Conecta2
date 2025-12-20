"use client";
import { useEffect, useState } from "react";

export function JobsPublic() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/jobs", { cache: "no-store" })
      .then((r) => r.json())
      .then(setJobs);
  }, []);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Plazas disponibles</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-600">Por ahora no hay plazas activas.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <div key={j.id} className="border rounded-xl p-4">
                <div className="font-semibold">{j.title}</div>
                <div className="text-sm text-gray-500">
                  {[j.location, j.type].filter(Boolean).join(" · ")}
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{j.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}