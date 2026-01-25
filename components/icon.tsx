import React from "react";
import { IconName } from "boxicons";

/**
 * Props for the Icon component.
 * @property {IconName} name - The name of the icon to display.
 * @property {"xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl"} [size="xl"] - The size of the icon, defaults to "xl".
 * @property {string} [color="inherit"] - The color of the icon, defaults to "inherit".
 */
interface IconProps {
  name: IconName;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = "2xl",
  color = "inherit",
}) => {
  const colorClass =
    color && color !== "inherit" ? `text-[${color}]` : "text-inherit";

  return <i className={`bx bxl-${name} text-${size} ${colorClass}`} />;
};

export default Icon;
