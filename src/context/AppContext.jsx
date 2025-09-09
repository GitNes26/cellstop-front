// src/context/AppContext.tsx
import React, { createContext, useReducer, useEffect } from "react";
import api from "../api";

const initialState = {
   sellers: [],
   imports: [],
   chipsSummary: {},
   stats: {},
   loading: false
};

function reducer(state, action) {
   switch (action.type) {
      case "SET_SELLERS":
         return { ...state, sellers: action.payload };
      case "SET_IMPORTS":
         return { ...state, imports: action.payload };
      case "SET_STATS":
         return { ...state, stats: action.payload };
      case "SET_LOADING":
         return { ...state, loading: action.payload };
      default:
         return state;
   }
}

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialState);

   useEffect(() => {
      async function loadInitial() {
         dispatch({ type: "SET_LOADING", payload: true });
         const [sellersRes, statsRes] = await Promise.all([api.get("/sellers"), api.get("/stats/dashboard")]);
         dispatch({ type: "SET_SELLERS", payload: sellersRes.data });
         dispatch({ type: "SET_STATS", payload: statsRes.data });
         dispatch({ type: "SET_LOADING", payload: false });
      }
      loadInitial();
   }, []);

   return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
