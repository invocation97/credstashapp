import React from "react";

export default function loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-dvh relative">
      <div className="parabolic-pentagon absolute inset-0 w-full h-full"></div>
    </div>
  );
}
