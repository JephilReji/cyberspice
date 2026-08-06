import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import SplashScreen from "../components/SplashScreen.tsx";

interface SplashContextValue {
  triggerSplash: () => void;
}

const SplashContext = createContext<SplashContextValue | undefined>(undefined);

export function SplashProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);

  function triggerSplash() {
    setShow(true);
  }

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <SplashContext.Provider value={{ triggerSplash }}>
      {show && <SplashScreen />}
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const ctx = useContext(SplashContext);
  if (!ctx) throw new Error("useSplash must be used within SplashProvider");
  return ctx;
}