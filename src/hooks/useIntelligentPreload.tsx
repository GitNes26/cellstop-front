// hooks/useIntelligentPreload.ts
import { useState, useCallback, useEffect } from "react";

const useIntelligentPreload = (fetchFunction, initialLoadCount = 50, searchThreshold = 3) => {
   const [allData, setAllData] = useState([]);
   const [page, setPage] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [hasMore, setHasMore] = useState(true);
   const [total, setTotal] = useState(0);
   const [searchMode, setSearchMode] = useState("local");

   const loadMore = useCallback(
      async (search = "") => {
         if (isLoading || !hasMore) return;

         try {
            setIsLoading(true);

            const result = await fetchFunction(page, search);

            if (result.items && result.items.length > 0) {
               if (search) {
                  // Modo búsqueda: reemplazar datos
                  setAllData(page === 1 ? result.items : [...allData, ...result.items]);
               } else {
                  // Modo normal: agregar datos
                  const existingIds = new Set(allData.map((item) => item.id));
                  const newItems = result.items.filter((item) => !existingIds.has(item.id));
                  setAllData((prev) => [...prev, ...newItems]);
               }

               setPage((prev) => prev + 1);
               setHasMore(result.hasMore);

               if (result.total !== undefined) {
                  setTotal(result.total);
               }
            } else {
               setHasMore(false);
            }
         } catch (error) {
            console.error("Error en pre-carga:", error);
            setHasMore(false);
         } finally {
            setIsLoading(false);
         }
      },
      [page, isLoading, hasMore, allData, fetchFunction]
   );

   const handleSearch = useCallback(
      (searchTerm) => {
         if (searchTerm.length >= searchThreshold) {
            // Búsqueda en servidor
            setSearchMode("server");
            setAllData([]);
            setPage(1);
            setHasMore(true);
            loadMore(searchTerm);
         } else if (searchTerm.length === 0) {
            // Volver a modo normal
            setSearchMode("local");
            if (allData.length < initialLoadCount && hasMore) {
               loadMore();
            }
         }
      },
      [loadMore, allData.length, hasMore, initialLoadCount, searchThreshold]
   );

   // Carga inicial
   useEffect(() => {
      if (allData.length === 0) {
         loadMore();
      }
   }, []);

   return {
      data: allData,
      isLoading,
      hasMore,
      total,
      searchMode,
      loadMore: () => loadMore(),
      handleSearch,
      reset: () => {
         setAllData([]);
         setPage(1);
         setHasMore(true);
         loadMore();
      }
   };
};
