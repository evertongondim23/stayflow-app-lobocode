import React from "react";

export function RouteFallback() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 text-slate-500">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"
          aria-hidden
        />
        <p className="text-sm font-medium">Carregando…</p>
      </div>
    </div>
  );
}
