import React from "react";
import { cn } from "./ui/utils";

export const STAYFLOW_LOGO_SRC = "/stayflow-logo.png";

type BrandLogoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  height?: number;
  /** Logo monocromático branco — use em sidebars escuras (recepção, admin). */
  variant?: "default" | "onDark";
};

export function BrandLogo({
  className,
  height = 36,
  alt = "StayFlow",
  variant = "default",
  ...props
}: BrandLogoProps) {
  return (
    <img
      src={STAYFLOW_LOGO_SRC}
      alt={alt}
      height={height}
      width={undefined}
      decoding="async"
      className={cn(
        "w-auto max-w-full object-contain object-left",
        variant === "onDark" && "brightness-0 invert",
        className
      )}
      style={{ height, width: "auto" }}
      {...props}
    />
  );
}
