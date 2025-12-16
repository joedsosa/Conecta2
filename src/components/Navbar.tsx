"use client";
import Link from "next/link";
import ThemeChanger from "./DarkSwitch";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";

export const Navbar = () => {
  const navigation = [
    { label: "Inicio", href: "#" },
    { label: "Personas", href: "#personas" },
    { label: "Empresas", href: "#empresas" },
    { label: "Preguntas frecuentes", href: "#faq" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    // Solo interceptamos si es hash (#seccion)
    if (!href.startsWith("#")) return;

    e.preventDefault();

    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const id = href.replace("#", "");
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur border-b border-gray-100">
      <nav className="container relative flex flex-wrap items-center justify-between p-4 sm:p-6 mx-auto lg:justify-between xl:px-1">
        {/* Logo */}
        <Link href="/">
          <span className="flex items-center space-x-2 text-2xl font-semibold text-primary-600">
            <span>
              <Image
                src="/img/logo.png"
                width={32}
                height={32}
                alt="Conecta2"
                className="w-8 h-8"
              />
            </span>
            <span>CONECTA2</span>
          </span>
        </Link>

        {/* Botones derecha (desktop) */}
        <div className="gap-3 nav__item mr-2 lg:flex ml-auto lg:ml-0 lg:order-2 items-center">
          <ThemeChanger />

          {/* ✅ Nuevo botón admin (solo desktop) */}
          <Link
            href="/admin/login"
            className="hidden lg:inline-flex px-4 py-2 text-sm font-bold rounded-md border-2 border-primary-600 text-primary-700 hover:bg-primary-50 transition-colors"
          >
            ¿Eres miembro?
          </Link>

          <div className="hidden mr-3 lg:flex nav__item">
            <Link
              href="#aplica"
              onClick={(e) => handleScroll(e, "#aplica")}
              className="px-6 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md md:ml-3 hover:bg-primary-700 transition-colors"
            >
              Busco empleo
            </Link>
          </div>
        </div>

        {/* Menú móvil */}
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                aria-label="Toggle Menu"
                className="px-2 py-1 text-gray-600 rounded-md lg:hidden hover:text-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:outline-none"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  {open ? (
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    />
                  )}
                </svg>
              </Disclosure.Button>

              <Disclosure.Panel className="flex flex-wrap w-full my-4 lg:hidden">
                <>
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleScroll(e, item.href)}
                      className="w-full px-4 py-2 -ml-4 text-gray-700 rounded-md hover:text-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:outline-none"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* ✅ Nuevo botón admin (mobile) */}
                  <Link
                    href="/admin/login"
                    className="w-full px-6 py-2 mt-3 text-center rounded-md border-2 border-primary-600 text-primary-700 font-bold hover:bg-primary-50 transition-colors"
                  >
                    ¿Eres miembro?
                  </Link>

                  <Link
                    href="#aplica"
                    onClick={(e) => handleScroll(e, "#aplica")}
                    className="w-full px-6 py-2 mt-3 text-center text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Busco empleo
                  </Link>
                </>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Menú desktop */}
        <div className="hidden text-center lg:flex lg:items-center">
          <ul className="items-center justify-end flex-1 pt-4 list-none lg:pt-0 lg:flex">
            {navigation.map((item) => (
              <li className="mr-3 nav__item" key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="inline-block px-4 py-2 text-sm font-medium text-gray-700 no-underline rounded-md hover:text-primary-600 focus:text-primary-600 focus:bg-primary-50 focus:outline-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
