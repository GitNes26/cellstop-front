import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

const useObservable = () => {
   const queryClient = useQueryClient();
   const keysRef = useRef<Set<string>>(new Set());

   const myKey = "Observable";

   const mutation = useMutation({
      mutationFn: async ({ key, newData }: { key: string; newData: any }) => newData
   });

   const ObservableSet = async (key: string, data: any) => {
      keysRef.current.add(key);
      return new Promise((resolve, reject) => {
         mutation.mutate(
            { key, newData: data },
            {
               onSuccess: (data) => {
                  queryClient.setQueryData([`${myKey}_${key}`], data);
                  console.log("✅ ObservableSet:", key, data);
                  resolve(data);
               },
               onError: (err) => reject(err)
            }
         );
      });
   };

   const ObservableGet = (key: string) => {
      console.log("📦 ObservableGet:", key);
      return queryClient.getQueryData([`${myKey}_${key}`]);
   };

   const ObservableDelete = (key: string) => {
      keysRef.current.delete(key);
      queryClient.removeQueries({ queryKey: [`${myKey}_${key}`] });
      console.log("🗑️ ObservableDelete:", key);
   };

   const getAllKeys = () => Array.from(keysRef.current);

   return {
      ObservableSet,
      ObservableGet,
      ObservableDelete,
      getAllKeys
   };
};

export default useObservable;
