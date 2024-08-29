import React from "react";

export default function loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-dvh relative">
      <div className="cube-loader-animated absolute inset-0 size-10"></div>
    </div>
  );
}
