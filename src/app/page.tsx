import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Faq } from "@/components/Faq";
import { JobApplicationForm } from "@/components/JobApplicationForm";
import { JobsPublic } from "@/components/JobsPublic";
import { benefitOne, benefitTwo } from "@/components/data";

export default function Home() {
  return (
    // Dejamos el fondo general blanco, pero el hero lo pintamos aparte
    <main className="bg-white">
      {/* HERO CON LOGO Y DESCRIPCIÓN */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        {/* Logo gigante muy tenue como fondo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <Image
            src="/img/logo.png"
            alt="Logo Conecta2"
            width={400}
            height={400}
            className="w-64 h-64 sm:w-80 sm:h-80"
          />
        </div>

        <Container className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Image
            src="/img/logo.png"
            alt="Logo Conecta2"
            width={96}
            height={96}
            className="w-20 h-20 mb-4 sm:w-24 sm:h-24"
          />

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            CONECTA2: conectamos talento confiable con oportunidades reales.
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-gray-700">
            Somos una iniciativa de intermediación laboral que acompaña a personas
            en su búsqueda de empleo y a empresas que necesitan personal confiable.
            Facilitamos el vínculo, orientamos el proceso y promovemos relaciones
            laborales justas, éticas y sostenibles en Honduras.
          </p>
        </Container>
      </section>

      {/* 🔹 SECCIÓN PERSONAS */}
      <section id="personas">
        <SectionTitle
          preTitle="Para personas"
          title="Si buscas empleo, te acompañamos en el proceso"
        >
          Regístrate con nosotros para que podamos conocerte mejor, entender tu
          perfil y acompañarte en la búsqueda de oportunidades laborales acordes
          a tu experiencia y a tus intereses.
        </SectionTitle>
        <Benefits data={benefitOne} />
      </section>

      {/* 🔹 SECCIÓN EMPRESAS */}
      <section id="empresas">
        <SectionTitle
          preTitle="Para empresas"
          title="Conectamos tu empresa con talento confiable"
        >
          Ayudamos a empresas hondureñas a encontrar personal confiable,
          preseleccionado y validado, reduciendo tiempos de reclutamiento y
          riesgos en la contratación, bajo un modelo transparente y ético.
        </SectionTitle>
        <Benefits imgPos="right" data={benefitTwo} />
      </section>

      {/* 🔹 SECCIÓN FAQ */}
      <section id="faq">
        <SectionTitle
          preTitle="FAQ"
          title="Preguntas frecuentes sobre CONECTA2"
        >
          Resolvemos las dudas más comunes de personas y empresas sobre cómo
          funciona nuestro servicio de intermediación laboral.
        </SectionTitle>
        <Faq />
      </section>

      {/* FORMULARIO DE APLICACIÓN */}
      <JobApplicationForm />
      <JobsPublic />
    </main>
  );
}
