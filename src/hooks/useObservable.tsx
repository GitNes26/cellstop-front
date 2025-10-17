import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const useObservable = () => {
   const queryClient = useQueryClient();
   const myKey = " Observable";
   const mutation = useMutation({
      mutationFn: async ({ key, newData }: { key: string; newData: Record<string, any> | Array<Record<string, any>> }) => {
         return newData;
      }
   });

   return {
      ObservableSet: async (key: string, data: Record<string, any> | Array<Record<string, any>>) => {
         return new Promise((resolve, reject) => {
            mutation.mutate(
               { key, newData: data },
               {
                  onSuccess: (data) => {
                     queryClient.setQueryData([`${myKey}_${key}`], data);
                     console.log("Success", key, data);
                     resolve(data);
                  },
                  onError: (error) => {
                     reject(error);
                  }
               }
            );
         });
      },
      ObservableGet: (key: string) => {
         return queryClient.getQueryData([`${myKey}_${key}`]);
      },

      ObservableDelete: (key: string) => {
         queryClient.removeQueries({ queryKey: [`${myKey}_${key}`] }); // Usa QueryFilters
         console.log("Deleted", key);
      }
   };
};

export default useObservable;
