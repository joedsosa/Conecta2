import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";
import { CheckIcon } from "@heroicons/react/24/solid";

interface BenefitsProps {
  imgPos?: "left" | "right";
  data: {
    imgPos?: "left" | "right";
    title: string;
    desc: string;
    image: any;
    bullets: {
      title: string;
      desc: string;
    }[];
  };
}

export const Benefits = (props: Readonly<BenefitsProps>) => {
  const { data } = props;

  return (
    <Container className="flex flex-wrap mb-16 lg:gap-10 lg:flex-nowrap">
      {/* Imagen */}
      <div
        className={`flex items-center justify-center w-full lg:w-1/2 ${
          props.imgPos === "right" ? "lg:order-1" : ""
        }`}
      >
        <div className="rounded-2xl overflow-hidden shadow-sm bg-white">
          <Image
            src={data.image}
            width={521}
            height={521}
            alt="Ilustración sección"
            className="object-cover"
            placeholder="blur"
            blurDataURL={data.image.src}
          />
        </div>
      </div>

      {/* Texto */}
      <div
        className={`flex flex-wrap items-center w-full lg:w-1/2 mt-8 lg:mt-0 ${
          data.imgPos === "right" ? "lg:justify-end" : ""
        }`}
      >
        <div>
          <div className="flex flex-col w-full">
            <h3 className="max-w-2xl text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-gray-900">
              {data.title}
            </h3>

            <p className="max-w-2xl mt-4 text-base sm:text-lg leading-relaxed text-gray-700">
              {data.desc}
            </p>
          </div>

          <div className="w-full mt-6 space-y-4">
            {data.bullets.map((item, index) => (
              <Benefit key={index} title={item.title}>
                {item.desc}
              </Benefit>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

function Benefit(props: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center justify-center flex-shrink-0 mt-1 bg-primary-600 rounded-md w-11 h-11">
        <CheckIcon className="w-7 h-7 text-white" />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900">
          {props.title}
        </h4>
        <p className="mt-1 text-sm sm:text-base text-gray-700">
          {props.children}
        </p>
      </div>
    </div>
  );
}
