"use client";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [carregando, setCarregando] = useState(false);
  return (
    <LoadingContext.Provider value={{ carregando, setCarregando }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}