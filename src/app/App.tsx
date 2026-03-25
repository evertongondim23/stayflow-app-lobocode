import React from "react";
import { BrowserRouter } from "react-router-dom";
import { HotelProvider } from "./context/HotelContext";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes";

export default function App() {
  return (
    <HotelProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </HotelProvider>
  );
}