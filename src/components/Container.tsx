import React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
};

export function Container({
  children,
  className = "",
  ...props
}: Readonly<ContainerProps>) {
  return (
    <div className={`container p-8 mx-auto xl:px-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
