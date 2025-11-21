import React, { createContext, useContext, useState } from "react";

const FinderModalContext = createContext();

export function FinderModalProvider({ children }) {
  const [showFinderModal, setShowFinderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  function openFinder(item) {
    setSelectedItem(item);
    setShowFinderModal(true);
  }

  function closeFinder() {
    setShowFinderModal(false);
    setTimeout(() => setSelectedItem(null), 200);
  }

  return (
    <FinderModalContext.Provider
      value={{
        showFinderModal,
        selectedItem,
        openFinder,
        closeFinder,
      }}>
      {children}
    </FinderModalContext.Provider>
  );
}

export function useFinderModal() {
  const ctx = useContext(FinderModalContext);
  if (!ctx)
    throw new Error("useFinderModal must be used inside FinderModalProvider");
  return ctx;
}
