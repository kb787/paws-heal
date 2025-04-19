import React, { createContext, useContext, useState } from "react";

const DocumentContext = createContext();

export const useDocumentContext = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [filteredDocumentsContext, setFilteredDocumentsContext] = useState([]);

  return (
    <DocumentContext.Provider value={{ filteredDocumentsContext, setFilteredDocumentsContext }}>
      {children}
    </DocumentContext.Provider>
  );
};
