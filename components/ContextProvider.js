import React, { createContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <Context.Provider value={{ authToken, setAuthToken }}>
      {children}
    </Context.Provider>
  );
};

export default Context;