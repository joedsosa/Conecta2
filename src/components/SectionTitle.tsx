import React from "react";
import { Container } from "@/components/Container";

interface SectionTitleProps {
  preTitle?: string;
  title?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export const SectionTitle = (props: Readonly<SectionTitleProps>) => {
  return (
    <Container
      className={`flex w-full flex-col mt-10 ${
        props.align === "left"
          ? ""
          : "items-center justify-center text-center"
      }`}
    >
      {/* 🔹 SUBTÍTULO (MORADO, MÁS GRANDE, NEGRITA) */}
      {props.preTitle && (
        <div className="text-lg font-extrabold tracking-wide text-primary-600 uppercase mb-2">
          {props.preTitle}
        </div>
      )}

      {/* 🔹 TÍTULO PRINCIPAL */}
      {props.title && (
        <h2 className="max-w-3xl text-4xl font-bold leading-snug tracking-tight text-gray-900 lg:text-5xl">
          {props.title}
        </h2>
      )}

      {/* 🔹 DESCRIPCIÓN */}
      {props.children && (
        <p className="max-w-3xl mt-4 text-lg leading-relaxed text-gray-700 lg:text-xl">
          {props.children}
        </p>
      )}
    </Container>
  );
};
