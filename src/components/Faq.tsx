"use client";
import { Container } from "@/components/Container";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!p-0" id="faq">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item) => (
          <div key={item.question} className="mb-4">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton
                    className="
                      flex items-center justify-between w-full 
                      px-4 py-4 
                      text-base sm:text-lg font-semibold text-left 
                      text-gray-900 
                      rounded-lg 
                      bg-white 
                      border border-primary-100
                      hover:bg-primary-50/60 
                      focus:outline-none 
                      focus-visible:ring-2 
                      focus-visible:ring-primary-300
                      transition-colors
                    "
                  >
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-primary-600`}
                    />
                  </DisclosureButton>

                  <DisclosurePanel
                    className="
                      px-4 pt-3 pb-4 
                      text-sm sm:text-base 
                      text-gray-700 
                      bg-white 
                      border border-t-0 border-primary-100 
                      rounded-b-lg
                    "
                  >
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "¿Qué es CONECTA2?",
    answer:
      "CONECTA2 es la nueva línea de intermediación laboral de Ángeles Para Tu Hogar (APTH). Conectamos personas desempleadas de perfiles profesionales, técnicos y operativos con empresas hondureñas que buscan talento confiable y comprometido.",
  },
  {
    question: "¿El servicio tiene algún costo para la empresa?",
    answer:
      "Durante todo el proceso de búsqueda, preselección, entrevistas y acompañamiento, el servicio no genera ningún costo para la empresa. Según el Acuerdo Ministerial STSS-211-2017, solo se realiza una única retribución equivalente al 50% del primer salario del trabajador una vez que la contratación se concreta.",
  },
  {
    question: "¿El proceso tiene costo para la persona que aplica?",
    answer:
      "No. Para las personas que buscan trabajo, todo el proceso de aplicación, entrevistas y acompañamiento es completamente gratuito.",
  },
  {
    question: "¿Qué tipo de perfiles atiende CONECTA2?",
    answer:
      "Atendemos perfiles profesionales, técnicos y operativos en distintas áreas, según las vacantes disponibles en las empresas aliadas.",
  },
  {
    question: "¿Qué hace CONECTA2 por mi empresa?",
    answer:
      "Identificamos y preseleccionamos candidatos, validamos referencias y experiencia, preparamos a los postulantes para entrevistas, acompañamos la selección y damos seguimiento durante los primeros 45 días posteriores a la contratación.",
  },
];
