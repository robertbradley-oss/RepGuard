import type { SVGProps } from "react";

export function NucleoCameraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M15.5 12.5C15.5 14.433 13.933 16 12 16C10.067 16 8.5 14.433 8.5 12.5C8.5 10.567 10.067 9 12 9C13.933 9 15.5 10.567 15.5 12.5Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M22 20L22 6L17 6L15 3L9 3L7 6L2 6L2 20L22 20Z"
        stroke="currentColor"
        strokeWidth="1"
        data-color="color-2"
        fill="none"
      />
    </svg>
  );
}
