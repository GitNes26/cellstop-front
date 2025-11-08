import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

/* -----------------------------
 🧩 ESTRUCTURA ORGANIZADA
----------------------------- */
export const ObservableKeysList = {
   Menu: {
      item: "menu",
      all: "allMenus",
      select: "menusSelect",
      items: "menuItems",
      headers: "headersMenus",
      permissions: "permissionsByMenu",
      checkMaster: "checkMaster",
      checkMenus: "checkMenus",
      isItem: "isItem"
   },
   Department: {
      item: "department",
      all: "allDepartments",
      select: "departmentsSelect"
   }
} as const;

/* -----------------------------
 🧠 TIPO DINÁMICO (Menu.all | Department.select, etc.)
----------------------------- */
export type ObservableKeys = {
   [K in keyof typeof ObservableKeysList]: `${K}.${keyof (typeof ObservableKeysList)[K]}`;
}[keyof typeof ObservableKeysList];

/* -----------------------------
 🪝 HOOK PRINCIPAL
----------------------------- */
const useObservable = () => {
   const queryClient = useQueryClient();
   const keysRef = useRef<Set<ObservableKeys>>(new Set());

   const prefix = "Observable";

   /* -----------------------------
   ⚙️ MUTATION SIMULADA (para disparar actualizaciones)
   ----------------------------- */
   const mutation = useMutation({
      mutationFn: async ({ key, newData }: { key: ObservableKeys; newData: any }) => newData
   });

   /* -----------------------------
   🟢 SET: Guardar/Actualizar observable
   ----------------------------- */
   const ObservableSet = async (key: ObservableKeys, data: any) => {
      keysRef.current.add(key);
      return new Promise((resolve, reject) => {
         mutation.mutate(
            { key, newData: data },
            {
               onSuccess: (data) => {
                  queryClient.setQueryData([`${prefix}_${key}`], data);
                  // console.log(`✅ ObservableSet: ${key}`, data);
                  resolve(data);
               },
               onError: (err) => reject(err)
            }
         );
      });
   };

   /* -----------------------------
   🟣 GET: Obtener observable
   ----------------------------- */
   const ObservableGet = (key: ObservableKeys) => {
      // console.log(`📦 ObservableGet: ${key}`);
      return queryClient.getQueryData([`${prefix}_${key}`]);
   };

   /* -----------------------------
   🔴 DELETE: Eliminar observable
   ----------------------------- */
   const ObservableDelete = (key: ObservableKeys) => {
      keysRef.current.delete(key);
      queryClient.removeQueries({ queryKey: [`${prefix}_${key}`] });
      // console.log(`🗑️ ObservableDelete: ${key}`);
   };

   /* -----------------------------
   🧾 GET ALL KEYS: Mostrar observables activos
   ----------------------------- */
   const getAllKeys = () => Array.from(keysRef.current);

   return {
      ObservableSet,
      ObservableGet,
      ObservableDelete,
      getAllKeys
   };
};
export default useObservable;

export interface ObservableLike<T> {
   value: T;
   subscribe: (callback: (v: T) => void) => { unsubscribe: () => void };
   next: (v: T) => void;
}

export function useObservableState<T>(observable: ObservableLike<T>) {
   const [value, setValue] = useState<T>(observable.value);
   useEffect(() => {
      const sub = observable.subscribe(setValue);
      return () => sub.unsubscribe();
   }, [observable]);
   return [value, (v: T) => observable.next(v)] as [T, (v: T) => void];
}

export function useObservableValue<T>(observable: ObservableLike<T>) {
   const [value, setValue] = useState<T>(observable.value);
   useEffect(() => {
      const sub = observable.subscribe(setValue);
      return () => sub.unsubscribe();
   }, [observable]);
   return value;
}

