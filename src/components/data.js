import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

// Beneficios para PERSONAS que buscan empleo
const benefitOne = {
  title: "Beneficios para personas que buscan empleo",
  desc:
    "CONECTA2 es una línea de intermediación laboral de Ángeles Para Tu Hogar (APTH) que acompaña a personas desempleadas en su proceso de búsqueda de trabajo, de forma gratuita y con enfoque humano.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Acompañamiento en tu búsqueda laboral",
      desc:
        "Te orientamos en la búsqueda de empleo, te apoyamos a prepararte para entrevistas y te acercamos a empresas que necesitan tu perfil.",
    },
    {
      title: "Proceso gratuito para la persona",
      desc:
        "No pagas nada por aplicar, recibir acompañamiento o ser presentada a una empresa. Todo el proceso es sin costo para ti.",
    },
    {
      title: "Enfoque humano y confiable",
      desc:
        "Trabajamos bajo la experiencia y respaldo de APTH, priorizando el trato digno, la transparencia y el respeto a tus derechos laborales.",
    },
  ],
};

// Beneficios para EMPRESAS
const benefitTwo = {
  title: "Beneficios para empresas aliadas",
  desc:
    "Apoyamos a empresas hondureñas a encontrar talento confiable, validado y comprometido, reduciendo tiempos y riesgos en el proceso de contratación.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Preselección de candidatos",
      desc:
        "Recibes perfiles que ya han sido filtrados de acuerdo con el puesto, las competencias requeridas y la cultura de tu empresa.",
    },
    {
      title: "Validación y acompañamiento",
      desc:
        "Verificamos referencias y experiencia, acompañamos las entrevistas y damos seguimiento durante los primeros días de contratación.",
    },
    {
      title: "Modelo transparente y sin costos ocultos",
      desc:
        "El servicio no genera costos durante el proceso de búsqueda. La retribución se realiza una sola vez, al concretarse la contratación, según el Acuerdo Ministerial vigente.",
    },
  ],
};

export { benefitOne, benefitTwo };
