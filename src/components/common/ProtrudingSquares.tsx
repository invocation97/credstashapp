import * as React from "react";
export default function ProtrudingSquares(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={500}
      height={500}
      viewBox="0 0 200 200"
      {...props}
    >
      <path fill="#EEE" d="M0 0h200v200H0z" />
      <defs>
        <linearGradient
          id="a"
          x1={100}
          x2={100}
          y1={33}
          y2={-3}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopOpacity={0} />
          <stop offset={1} />
        </linearGradient>
        <linearGradient
          id="b"
          x1={100}
          x2={100}
          y1={135}
          y2={97}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0} stopOpacity={0} />
          <stop offset={1} />
        </linearGradient>
      </defs>
      <g fill="#c6c6c6" fillOpacity={0.54}>
        <path d="M100 0h100v100H100zM0 100h100v100H0z" />
      </g>
      <g fillOpacity={0.54}>
        <path fill="url(#a)" d="M100 30 0 0h200z" />
        <path fill="url(#b)" d="M100 100 0 130v-30h200v30z" />
      </g>
    </svg>
  );
}
