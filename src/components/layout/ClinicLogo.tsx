import React from "react";

interface ClinicLogoProps {
  className?: string;
  variant?: "light" | "dark";
  layout?: "horizontal" | "stacked" | "mark";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

/**
 * Authentic Clinic Logo component
 * Uses the official The Aesthetic Villa mark (rose gold tooth + leaf)
 * with transparent backgrounds and sharp contrast for both light and dark backgrounds.
 */
export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = "",
  variant = "light",
  layout = "horizontal",
  size = "md",
}) => {
  const isDark = variant === "dark";

  // Height configurations
  const heightClasses = {
    horizontal: {
      sm: "h-9 sm:h-10",
      md: "h-11 sm:h-12",
      lg: "h-14 sm:h-16",
      xl: "h-18 sm:h-20",
    },
    stacked: {
      sm: "h-14 sm:h-16",
      md: "h-20 sm:h-24",
      lg: "h-28 sm:h-32",
      xl: "h-36 sm:h-40",
    },
    mark: {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-20 w-20",
    },
  };

  if (layout === "mark") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <img
          src="/img/clinic-logo-mark.png"
          alt="The Aesthetic Villa Emblem"
          className={`${heightClasses.mark[size]} object-contain drop-shadow-sm`}
          draggable={false}
        />
      </div>
    );
  }

  if (layout === "stacked") {
    const src = isDark
      ? "/img/clinic-logo-white.png"
      : "/img/clinic-logo-dark.png";

    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={src}
          alt="The Aesthetic Villa – Skin & Dental Clinic"
          className={`${heightClasses.stacked[size]} w-auto object-contain drop-shadow-sm`}
          draggable={false}
        />
      </div>
    );
  }

  // Horizontal layout (default, perfect for navbar & footer)
  const src = isDark
    ? "/img/clinic-logo-horizontal-white.png"
    : "/img/clinic-logo-horizontal-dark.png";

  return (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt="The Aesthetic Villa – Skin & Dental Clinic"
        className={`${heightClasses.horizontal[size]} w-auto object-contain`}
        draggable={false}
      />
    </div>
  );
};
