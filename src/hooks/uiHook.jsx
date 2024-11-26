import React, { createContext, useContext, useState, useLayoutEffect } from "react";


const ResponsiveContext = createContext();


export const ResponsiveProvider = ({ children }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  const checkScreenSize = () => {
    setIsSmallScreen(window.matchMedia("(max-width: 700px)").matches);
  };

  useLayoutEffect(() => {
    checkScreenSize(); 
    window.addEventListener("resize", checkScreenSize); // Listen for resize events

    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  return (
    <ResponsiveContext.Provider value={{ isSmallScreen }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);

  if (!context) {
    throw new Error("useResponsive must be used within a ResponsiveProvider");
  }

  return context;
};