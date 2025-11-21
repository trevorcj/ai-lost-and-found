import { createContext, useContext, useState, useEffect } from "react";

const ModalContext = createContext();

function parseDateToDisplay(d) {
  if (!d) return "";
  if (typeof d === "string" && d.includes("-")) {
    const [y, m, day] = d.split("-");
    return `${String(day).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
  }
  if (d instanceof Date) {
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  }
  return d;
}

export function AddItemModalProvider({ children }) {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch("/data.json")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const normalized = json.map((it) => ({
          ...it,
          date: parseDateToDisplay(it.date),
        }));
        setItems(normalized);
      })
      .catch((e) => {
        console.error("Failed to load data.json", e);
      });
    return () => {
      mounted = false;
    };
  }, []);

  function handleAddItem() {
    setShowAddItemModal((prev) => !prev);
  }

  function addItem(newItem) {
    setItems((prev) => [newItem, ...prev]);
  }

  return (
    <ModalContext.Provider
      value={{
        showAddItemModal,
        setShowAddItemModal,
        handleAddItem,
        items,
        addItem,
      }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error(
      "useModalContext must be used within an AddItemModalProvider"
    );
  }
  return context;
}
